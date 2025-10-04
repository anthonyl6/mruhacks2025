{
  description = "mojo development environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      self,
      nixpkgs,
      flake-utils,
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs {
          inherit system;
        };

        inherit (pkgs) lib stdenv;

        # Node.js version
        nodejs = pkgs.nodejs_22;

        # Dependencies for native modules
        buildInputs =
          with pkgs;
          [
            # packages here
          ]
          ++ lib.optionals stdenv.isLinux (
            with pkgs;
            [
              # linux packages here
            ]
          )
          ++ lib.optionals stdenv.isDarwin (
            with pkgs;
            [
              # macOS packages here
            ]
          );
      in
      {
        devShells.default = pkgs.mkShell {
          inherit buildInputs;

          nativeBuildInputs = with pkgs; [
            # native build inputs here
          ];

          # Environment variables for Electron compatibility
          shellHook = ''
            echo "🚀 mojo development environment ready!"
          '';
        };

        apps = {
          dev =
            let
              dev = pkgs.writeShellScript "dev" ''
                echo "running dev environment"
              '';
            in
            {
              type = "app";
              program = "${dev}";
            };
        };
      }
    );
}
