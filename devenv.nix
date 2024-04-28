{ pkgs, config, lib, ... }:

{
  name = "I Can't Believe It's Not Native!";

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

  env.PLAYWRIGHT_BROWSERS_PATH = "${pkgs.playwright-driver.browsers}";

  packages = (config.pre-commit.enabledPackages or [ ]);

  pre-commit.excludes = [ "\\.pnp\\.cjs" "\\.pnp\\.loader\\.mjs" "\\.yarn/.*" ];
  pre-commit.hooks = {
    check-added-large-files.enable = true;
    check-case-conflicts.enable = true;
    check-json.enable = true;
    check-merge-conflicts.enable = true;
    check-shebang-scripts-are-executable.enable = true;
    check-symlinks.enable = true;
    check-vcs-permalinks.enable = true;
    check-yaml.enable = true;
    commitizen.enable = true;
    deadnix.enable = true;
    html-tidy.enable = true;
    prettier = {
      enable = true;
      entry = "yarn workspaces foreach --all run format";
      pass_filenames = false;
    };
  } // (let
    inSubfolder = subfolder:
      { entry, files, excludes ? [ ], ... }@attrs:
      attrs // {
        entry = toString
          (pkgs.writeShellScript "pre-commit-in-subfolder-entry-${subfolder}" ''
            				set -euo pipefail
            				cd "${subfolder}"
                    ${entry} "''${@//${lib.escape [ "/" ] subfolder}\//}"
          '');
        files = "${subfolder}/${files}";
        excludes = map (exclude: "${subfolder}/${exclude}") excludes;
      };
    mapToSubfolder = subfolder:
      lib.attrsets.mapAttrs' (name: attrs: {
        name = "${subfolder}-${name}";
        value = inSubfolder subfolder attrs;
      });
  in mapToSubfolder "packages/demo-app" {
    lint = {
      enable = true;
      entry =
        "yarn run eslint --report-unused-disable-directives --max-warnings 0";
      files = ".*\\.tsx?";
      excludes = [ "\\.storybook/.*" "src/routeTree\\.gen\\.ts" ];
    };
    e2e = {
      enable = true;
      entry = "yarn e2e";
      files = "e2e/.*\\.ts";
      pass_filenames = false;
    };
    test = {
      enable = true;
      entry = "yarn test";
      files = ".*\\.spec\\.ts";
    };
    check = {
      enable = true;
      entry = "yarn check";
      files = ".*\\.tsx?";
      pass_filenames = false;
    };
  });

  processes = {
    demo-dev = let log_location = "${config.env.DEVENV_STATE}/demo-dev.log";
    in {
      exec = ''
        set -euo pipefail
        truncate -s 0 "${log_location}"
        yarn workspace @repo/demo-app dev
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
    demo-storybook =
      let log_location = "${config.env.DEVENV_STATE}/demo-storybook.log";
      in {
        exec = ''
          set -euo pipefail
          truncate -s 0 "${log_location}"
          yarn workspace @repo/demo-app storybook
        '';
        process-compose = {
          availability.restart = "on_failure";
          inherit log_location;
          log_configuration.flush_each_line = true;
          readiness_probe = {
            exec.command = toString
              (pkgs.writeShellScript "storybook-watch-readiness-probe.sh" ''
                set -euo pipefail
                [ ! -f "${log_location}" ] && exit 1
                grep -q "Storybook.*started" "${log_location}"
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
