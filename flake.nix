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
            # website
            yarn
            # mobile app
            bun
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
          install-mobile =
            let
              install-mobile = pkgs.writeShellScript "install-mobile" ''
                echo "installing mobile dependencies"
                cd mojo
                ${pkgs.bun}/bin/bun i
              '';
            in
            {
              type = "app";
              program = "${install-mobile}";
            };
          dev-mobile =
            let
              dev-mobile = pkgs.writeShellScript "dev-mobile" ''
                echo "running dev environment"
                cd mojo
                nix run .#install-mobile
                ${pkgs.bun}/bin/bun start
              '';
            in
            {
              type = "app";
              program = "${dev-mobile}";
            };
        };
      }
    );
}
