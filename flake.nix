{
  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs/nixpkgs-unstable";
  };
  outputs =
    { nixpkgs, ... }:
    let
      forAllSystems =
        function:
        nixpkgs.lib.genAttrs nixpkgs.lib.systems.flakeExposed (
          system: function nixpkgs.legacyPackages.${system}
        );
    in
    {
      formatter = forAllSystems (pkgs: pkgs.alejandra);
      devShells = forAllSystems (
        pkgs:
        let
          nodejs = pkgs.nodejs-slim_latest;
          corepack = pkgs.corepack.override { nodejs-slim = nodejs; };
        in
        {
          default = pkgs.mkShell {
            packages = with pkgs; [
              nixd
              nixfmt
              # Python side: uv manages the interpreter and the workspace venv.
              python3
              uv
              # TypeScript side: corepack provides the pinned pnpm.
              nodejs
              corepack
            ];

            shellHook = ''
              unset PYTHONPATH
            '';
          };
        }
      );
    };
}
