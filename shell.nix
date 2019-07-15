with (import <nixpkgs> {});

let
  imported = import ./functions/nix/default.nix {};
in
  mkShell {
    buildInputs = [
      imported."firebase-tools-7.0.2"
      google-cloud-sdk
      nodejs-10_x
    ];
    shellHook = ''
      export PATH=$PATH:$PWD/functions/bin/
    '';
  }
