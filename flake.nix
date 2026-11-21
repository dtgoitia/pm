{
  description = "pm - product-management tools";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    rust-overlay = {
      url = "github:oxalica/rust-overlay";
      inputs.nixpkgs.follows = "nixpkgs";
    };
    git-hooks-nix.url = "github:cachix/git-hooks.nix";
  };

  outputs = {
    self,
    nixpkgs,
    rust-overlay,
    git-hooks-nix,
  }: let
    systems = [
      "x86_64-linux"
      "aarch64-linux"
      "x86_64-darwin"
      "aarch64-darwin"
    ];

    forAllSystems = f:
      nixpkgs.lib.genAttrs systems (
        system:
          f (
            import nixpkgs {
              inherit system;
              overlays = [rust-overlay.overlays.default];
            }
          )
      );

    cargoToml = builtins.fromTOML (builtins.readFile ./Cargo.toml);

    # Full toolchain (with rust-analyzer, clippy, ...) for the devshell, pinned by rust-toolchain.toml.
    mkDevToolchain = pkgs: pkgs.rust-bin.fromRustupToolchainFile ./rust-toolchain.toml;

    # Same channel, minimal profile: all the package build needs.
    mkBuildToolchain = pkgs:
      pkgs.rust-bin.fromRustupToolchain {
        channel = (builtins.fromTOML (builtins.readFile ./rust-toolchain.toml)).toolchain.channel;
        profile = "minimal";
      };

    mkPackage = pkgs: let
      toolchain = mkBuildToolchain pkgs;
      rustPlatform = pkgs.makeRustPlatform {
        cargo = toolchain;
        rustc = toolchain;
      };
    in
      rustPlatform.buildRustPackage {
        pname = cargoToml.package.name;
        version = cargoToml.package.version;

        src = pkgs.lib.fileset.toSource {
          root = ./.;
          fileset = pkgs.lib.fileset.unions [
            ./Cargo.toml
            ./Cargo.lock
            ./src
          ];
        };

        cargoLock.lockFile = ./Cargo.lock;

        meta = {
          description = "Product-management tools";
          mainProgram = cargoToml.package.name;
          platforms = systems;
        };
      };

    mkPreCommitCheck = pkgs: let
      # Use the pinned toolchain so hooks match the devshell's rustfmt/clippy.
      toolchain = mkDevToolchain pkgs;
    in
      git-hooks-nix.lib.${pkgs.stdenv.hostPlatform.system}.run {
        src = ./.;
        hooks = {
          alejandra.enable = true;

          markdownlint = {
            enable = true;
            args = ["--fix"];
            settings.configuration.MD013 = false; # skill files are prose; don't hard-wrap them at 80 columns.
          };

          rustfmt = {
            enable = true;
            packageOverrides = {
              cargo = toolchain;
              rustfmt = toolchain;
            };
          };

          clippy = {
            enable = true;
            packageOverrides = {
              cargo = toolchain;
              clippy = toolchain;
            };
            settings.denyWarnings = true;
          };
        };
      };
  in {
    packages = forAllSystems (pkgs: rec {
      pm = mkPackage pkgs;
      default = pm;
    });

    apps = forAllSystems (pkgs: {
      default = {
        type = "app";
        program = pkgs.lib.getExe self.packages.${pkgs.stdenv.hostPlatform.system}.default;
        meta.description = "Run pm";
      };
    });

    # Lets NixOS / home-manager configs use `pkgs.pm`.
    overlays.default = final: _prev: {
      pm = self.packages.${final.stdenv.hostPlatform.system}.default;
    };

    devShells = forAllSystems (
      pkgs: let
        pre-commit-check = self.checks.${pkgs.stdenv.hostPlatform.system}.pre-commit-check;
      in {
        default = pkgs.mkShell {
          inputsFrom = [self.packages.${pkgs.stdenv.hostPlatform.system}.default];
          packages =
            [
              (mkDevToolchain pkgs)
              pkgs.cargo-watch
              pkgs.cargo-nextest
              pkgs.cargo-edit
            ]
            ++ pre-commit-check.enabledPackages;
          RUST_BACKTRACE = "1";
          shellHook = ''
            ${pre-commit-check.shellHook}
          '';
        };
      }
    );

    checks = forAllSystems (pkgs: {
      build = self.packages.${pkgs.stdenv.hostPlatform.system}.default;
      pre-commit-check = mkPreCommitCheck pkgs;
    });

    formatter = forAllSystems (pkgs: pkgs.alejandra);
  };
}
