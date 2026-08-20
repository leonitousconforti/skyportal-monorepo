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
      ...
    }:
    let
      inherit (nixpkgs) lib;
      forAllSystems = lib.genAttrs lib.systems.flakeExposed;

      # ---- Python: the uv workspace, as read from uv.lock --------------------
      workspace = uv2nix.lib.workspace.loadWorkspace { workspaceRoot = ./.; };
      pyOverlay = workspace.mkPyprojectOverlay { sourcePreference = "wheel"; };
      editableOverlay = workspace.mkEditablePyprojectOverlay { root = "$REPO_ROOT"; };

      perSystem =
        system:
        let
          pkgs = nixpkgs.legacyPackages.${system};
          mkPythonSet =
            python:
            (pkgs.callPackage pyproject-nix.build.packages { inherit python; }).overrideScope (
              lib.composeManyExtensions [
                pyproject-build-systems.overlays.wheel
                pyOverlay
              ]
            );
          pythonSet = mkPythonSet pkgs.python3;

          # Every Python package plus the dev and test dependency groups.
          pyEnv = pythonSet.mkVirtualEnv "skyportal-monorepo-env" workspace.deps.all;

          # The interpreters the packages claim to support (requires-python).
          supportedPythons = {
            "3.11" = pkgs.python311;
            "3.12" = pkgs.python312;
            "3.13" = pkgs.python313;
            "3.14" = pkgs.python314;
          };

          # Only what the repo declares: what `uv sync --locked` would give.
          src = lib.cleanSource ./.;

          # ---- JavaScript: the pnpm workspace, as read from pnpm-lock.yaml ------
          nodejs = pkgs.nodejs_24;
          pnpm = pkgs.pnpm_11;
          pnpmDeps = pkgs.fetchPnpmDeps {
            pname = "skyportal-monorepo";
            version = "0";
            inherit src pnpm;
            fetcherVersion = 4;
            hash = "sha256-7t0C5YRlAiQFV3yRZJoo7KVVBODIAELcJWh8C+1drA0=";
          };

          # A derivation with the workspace checked out and node_modules in place.
          mkJsDerivation =
            name: attrs:
            pkgs.stdenv.mkDerivation (
              {
                pname = name;
                version = "0";
                inherit src pnpmDeps;
                nativeBuildInputs = [
                  nodejs
                  pnpm
                  pkgs.pnpmConfigHook
                ]
                ++ (attrs.nativeBuildInputs or [ ]);
                dontConfigure = false;
                doCheck = false;
                dontFixup = true;
              }
              // (builtins.removeAttrs attrs [ "nativeBuildInputs" ])
            );

          # ---- Checks ----------------------------------------------------------
          mkPyCheckWith =
            env: name: script:
            pkgs.runCommand "check-${name}"
              {
                nativeBuildInputs = [ env ];
                inherit src;
                # httpx builds an SSL context when a client is created, even for
                # tests that never hit the network; give it a CA bundle.
                SSL_CERT_FILE = "${pkgs.cacert}/etc/ssl/certs/ca-bundle.crt";
              }
              ''
                cp -r $src source && chmod -R u+w source && cd source
                ${script}
                touch $out
              '';
          mkPyCheck = mkPyCheckWith pyEnv;
        in
        rec {
          packages = {
            skyportal-py-models = pythonSet.skyportal-py-models;
            skyportal-py = pythonSet.skyportal-py;
            python-env = pyEnv;

            # Both TypeScript packages, built (dist/) and ready to pack.
            js = mkJsDerivation "skyportal-js" {
              buildPhase = ''
                runHook preBuild
                pnpm build
                runHook postBuild
              '';
              installPhase = ''
                runHook preInstall
                mkdir -p $out
                for p in packages/api-models-ts packages/client-ts; do
                  mkdir -p $out/$p
                  cp -r $p/dist $p/package.json $p/README.md $p/LICENSE $out/$p/
                done
                runHook postInstall
              '';
            };

            default = packages.js;
          };

          checks = {
            python-lint = mkPyCheck "python-lint" ''
              ruff check packages tools
              ruff format --check packages tools
            '';
            python-types = mkPyCheck "python-types" ''
              ty check
            '';
            # knope keeps the four versions and the models pin in lockstep; this
            # catches a hand edit that breaks that.
            versions = mkPyCheck "versions" ''
              python3 - <<'PY'
              import json, re, sys, tomllib
              py = {p: tomllib.load(open(f"packages/{p}/pyproject.toml", "rb"))["project"] for p in ("api-models-py", "client-py")}
              js = {p: json.load(open(f"packages/{p}/package.json")) for p in ("api-models-ts", "client-ts")}
              versions = {p: d["version"] for p, d in (py | js).items()}
              pin = next(d for d in py["client-py"]["dependencies"] if d.startswith("skyportal-py-models"))
              versions["client-py pin"] = pin.split("==")[1]
              if len(set(versions.values())) != 1:
                  sys.exit(f"versions out of lockstep: {versions}")
              PY
            '';

            # Typecheck, lint, build and test the TypeScript workspace, and make
            # sure the generated index.ts files are current.
            js = mkJsDerivation "check-js" {
              buildPhase = ''
                runHook preBuild
                cp -r packages/api-models-ts/src/index.ts /tmp/models-index.ts
                cp -r packages/client-ts/src/index.ts /tmp/client-index.ts
                pnpm codegen
                diff -u /tmp/models-index.ts packages/api-models-ts/src/index.ts
                diff -u /tmp/client-index.ts packages/client-ts/src/index.ts
                pnpm check
                pnpm lint
                pnpm build
                pnpm test --run
                runHook postBuild
              '';
              installPhase = "touch $out";
            };

            # The Python and TypeScript models are written by hand, twice. This
            # dumps JSON Schema from both and diffs them.
            schema-parity = mkJsDerivation "check-schema-parity" {
              nativeBuildInputs = [ pyEnv ];
              buildPhase = ''
                runHook preBuild
                python3 tools/schema-parity/dump_py.py
                pnpm schema-parity
                python3 tools/schema-parity/compare.py
                runHook postBuild
              '';
              installPhase = "touch $out";
            };
          }
          // lib.mapAttrs' (
            version: python:
            lib.nameValuePair "python-tests-${version}" (
              mkPyCheckWith
                ((mkPythonSet python).mkVirtualEnv "skyportal-monorepo-env-${version}" workspace.deps.all)
                "python-tests-${version}"
                ''
                  pytest packages -q -p no:cacheprovider
                ''
            )
          ) supportedPythons
          // lib.mapAttrs' (name: pkg: lib.nameValuePair "build-${name}" pkg) (
            lib.filterAttrs (n: _: n != "default") packages
          );

          devShells.default =
            let
              editableSet = pythonSet.overrideScope editableOverlay;
              devEnv = editableSet.mkVirtualEnv "skyportal-monorepo-dev-env" workspace.deps.all;
            in
            pkgs.mkShell {
              packages = [
                devEnv
                pkgs.uv
                nodejs
                pnpm
                pkgs.knope
                pkgs.nixd
                pkgs.nixfmt
              ];
              env = {
                # uv is for editing the lockfile; the venv itself comes from Nix.
                UV_NO_SYNC = "1";
                UV_PYTHON = editableSet.python.interpreter;
                UV_PYTHON_DOWNLOADS = "never";
              };
              shellHook = ''
                unset PYTHONPATH
                export REPO_ROOT=$(git rev-parse --show-toplevel)
              '';
            };

          formatter = pkgs.nixfmt;
        };
    in
    {
      packages = forAllSystems (system: (perSystem system).packages);
      checks = forAllSystems (system: (perSystem system).checks);
      devShells = forAllSystems (system: (perSystem system).devShells);
      formatter = forAllSystems (system: (perSystem system).formatter);
    };
}
