{
  description = "SkyPortal API clients and the request/response models they share";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
    pyproject-nix = {
      url = "github:pyproject-nix/pyproject.nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    uv2nix = {
      url = "github:pyproject-nix/uv2nix";
      inputs.pyproject-nix.follows = "pyproject-nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    pyproject-build-systems = {
      url = "github:pyproject-nix/build-system-pkgs";
      inputs.pyproject-nix.follows = "pyproject-nix";
      inputs.uv2nix.follows = "uv2nix";
      inputs.nixpkgs.follows = "nixpkgs";
    };
  };

  outputs =
    {
      self,
      nixpkgs,
      pyproject-nix,
      uv2nix,
      pyproject-build-systems,
    }:
    let
      inherit (nixpkgs) lib;
      workspace = uv2nix.lib.workspace.loadWorkspace { workspaceRoot = ./.; };

      perSystem =
        system:
        let
          pkgs = nixpkgs.legacyPackages.${system};

          # ---- Python: uv.lock -> a virtualenv per interpreter ------------------
          venvFor =
            python:
            let
              pythonSet = (pkgs.callPackage pyproject-nix.build.packages { inherit python; }).overrideScope (
                lib.composeManyExtensions [
                  pyproject-build-systems.overlays.wheel
                  (workspace.mkPyprojectOverlay { sourcePreference = "wheel"; })
                ]
              );
            in
            {
              inherit pythonSet;
              venv = pythonSet.mkVirtualEnv "skyportal-monorepo-env" workspace.deps.all;
            };
          default = venvFor pkgs.python3;

          pyCheck =
            name: venv: script:
            pkgs.runCommand "check-${name}"
              {
                nativeBuildInputs = [ venv ];
                # httpx builds an SSL context on client creation, even offline.
                SSL_CERT_FILE = "${pkgs.cacert}/etc/ssl/certs/ca-bundle.crt";
              }
              ''
                cp -r ${self} source && chmod -R u+w source && cd source
                ${script}
                touch $out
              '';

          # ---- TypeScript: pnpm-lock.yaml -> node_modules, then the usual scripts
          pnpm = pkgs.pnpm_11;
          js = pkgs.stdenv.mkDerivation {
            name = "skyportal-js";
            src = self;
            nativeBuildInputs = [
              pkgs.nodejs_24
              pnpm
              pkgs.pnpmConfigHook
            ];
            pnpmDeps = pkgs.fetchPnpmDeps {
              pname = "skyportal-monorepo";
              version = "0";
              src = self;
              inherit pnpm;
              fetcherVersion = 4;
              hash = "sha256-MTwmVHNyOwvKuMcbmm0UAtym0gLEvXmXHqstb1h6Nnc=";
            };
            buildPhase = ''
              cp -r packages /tmp/before && pnpm codegen
              diff -r -x node_modules /tmp/before packages   # generated index.ts files are current
              pnpm check && pnpm lint && pnpm build && pnpm test --run
            '';
            installPhase = ''
              for p in packages/*-ts; do
                mkdir -p $out/$p && cp -r $p/dist $p/package.json $p/README.md $p/LICENSE $out/$p/
              done
            '';
            dontFixup = true;
          };
        in
        {
          packages.default = js;

          checks = {
            inherit js;
            python-lint = pyCheck "python-lint" default.venv ''
              ruff check packages
              ruff format --check packages
              ty check
            '';
          }
          //
            lib.mapAttrs'
              (
                version: python:
                lib.nameValuePair "python-tests-${version}" (
                  pyCheck "python-tests-${version}" (venvFor python).venv "pytest packages -q -p no:cacheprovider"
                )
              )
              {
                "3.11" = pkgs.python311;
                "3.12" = pkgs.python312;
                "3.13" = pkgs.python313;
                "3.14" = pkgs.python314;
              };

          devShells.default =
            let
              editable = default.pythonSet.overrideScope (
                workspace.mkEditablePyprojectOverlay { root = "$REPO_ROOT"; }
              );
            in
            pkgs.mkShell {
              packages = [
                (editable.mkVirtualEnv "skyportal-monorepo-dev-env" workspace.deps.all)
                pkgs.uv
                pkgs.nodejs_24
                pnpm
                pkgs.knope
                pkgs.nixd
                pkgs.nixfmt
              ];
              env = {
                # uv edits the lockfile; the venv itself comes from Nix.
                UV_NO_SYNC = "1";
                UV_PYTHON = editable.python.interpreter;
                UV_PYTHON_DOWNLOADS = "never";
              };
              shellHook = ''
                unset PYTHONPATH
                export REPO_ROOT=$(git rev-parse --show-toplevel)
              '';
            };

          formatter = pkgs.nixfmt;
        };

      systems = lib.genAttrs lib.systems.flakeExposed perSystem;
    in
    {
      packages = lib.mapAttrs (_: s: s.packages) systems;
      checks = lib.mapAttrs (_: s: s.checks) systems;
      devShells = lib.mapAttrs (_: s: s.devShells) systems;
      formatter = lib.mapAttrs (_: s: s.formatter) systems;
    };
}
