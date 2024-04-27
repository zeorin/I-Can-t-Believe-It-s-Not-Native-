{ pkgs, lib, config, inputs, ... }:

{
  languages.javascript.enable = true;
  languages.javascript.corepack.enable = true;
  languages.typescript.enable = true;

  enterShell = let
    # Adapted from https://github.com/cachix/devenv/blob/main/src/modules/languages/javascript.nix
    initYarnScript = pkgs.writeShellScript "init-yarn.sh" ''
      function _devenv-yarn-install()
      {
        # Avoid running "yarn install" for every shell.
        # Only run it when the "yarn.lock" file or nodejs version has changed.
        # We do this by storing the nodejs version and a hash of "yarn.lock" in node_modules.
        local ACTUAL_YARN_CHECKSUM="$(yarn --version):$(${pkgs.nix}/bin/nix-hash --type sha256 yarn.lock)"
        local YARN_CHECKSUM_FILE="${config.env.DEVENV_STATE}/yarn.lock.checksum"
        if [ -f "$YARN_CHECKSUM_FILE" ]
          then
            read -r EXPECTED_YARN_CHECKSUM < "$YARN_CHECKSUM_FILE"
          else
            EXPECTED_YARN_CHECKSUM=""
        fi

        if [ "$ACTUAL_YARN_CHECKSUM" != "$EXPECTED_YARN_CHECKSUM" ]
        then
          if yarn install
          then
            [ ! -d "${config.env.DEVENV_STATE}" ] && mkdir -p "${config.env.DEVENV_STATE}"
            echo "$ACTUAL_YARN_CHECKSUM" > "$YARN_CHECKSUM_FILE"
          else
            echo "Install failed. Run 'yarn install' manually."
          fi
        fi
      }

      if [ ! -f package.json ]
      then
        echo "No package.json found. Run 'yarn init' to create one." >&2
      else
        _devenv-yarn-install
      fi
    '';
  in ''
    "${initYarnScript}"
  '';

  processes = {
    demo-dev = let log_location = "${config.env.DEVENV_STATE}/demo-dev.log";
    in {
      exec = ''
        set -euo pipefail
        truncate -s 0 "${log_location}"
        yarn workspace demo dev
      '';
      process-compose = {
        availability.restart = "on_failure";
        inherit log_location;
        log_configuration.flush_each_line = true;
        readiness_probe = {
          exec.command = toString
            (pkgs.writeShellScript "vite-devserver-readiness-probe.sh" ''
              set -euo pipefail
              [ ! -f "${log_location}" ] && exit 1
              grep -q "VITE.*ready" "${log_location}"
            '');
          initial_delay_seconds = 1;
          period_seconds = 2;
          timeout_seconds = 2;
          success_threshold = 1;
          failure_threshold = 100;
        };
      };
    };
  };
}
