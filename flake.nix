{
  # inspired by: https://serokell.io/blog/practical-nix-flakes#packaging-existing-applications
  description = "Hakyll based website - 'j14i'";
  inputs.nixpkgs.url = "nixpkgs/nixpkgs-unstable";
  outputs = { self, nixpkgs }:
    let
      supportedSystems = [ "x86_64-linux" "x86_64-darwin" "aarch64-darwin" ];
      forAllSystems = f: nixpkgs.lib.genAttrs supportedSystems (system: f system);
      nixpkgsFor = forAllSystems (system: import nixpkgs {
        inherit system;
        overlays = [ self.overlay ];
      });
    in
    {
      overlay = (final: prev: {
        j14i = final.haskellPackages.callCabal2nix "j14i" ./. {};
      });
      packages = forAllSystems (system: {
         j14i = nixpkgsFor.${system}.j14i;
      });
      defaultPackage = forAllSystems (system: self.packages.${system}.j14i);
      checks = self.packages;
      devShell = forAllSystems (system: let haskellPackages = nixpkgsFor.${system}.haskellPackages;
        in haskellPackages.shellFor {
          packages = p: [self.packages.${system}.j14i];
          withHoogle = true;
          buildInputs = with haskellPackages; [
            haskell-language-server
            ghcid
            cabal-install
            hakyll
            hakyll-sass
          ];
          shellHook = "
            export PATH=$(pwd)/result/bin:$PATH
            export PS1='\\e[1;34mdev > \\e[0m'
          ";
        });
  };
}
