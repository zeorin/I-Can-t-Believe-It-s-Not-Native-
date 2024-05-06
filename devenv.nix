{ pkgs, config, lib, ... }:

let
  distDir = "${config.env.DEVENV_ROOT}/dist";
  iosevkaAile = pkgs.fetchzip {
    url =
      "https://github.com/be5invis/Iosevka/releases/download/v30.0.0/PkgWebFont-IosevkaAile-30.0.0.zip";
    hash = "sha256-L6tteOF+2IPFEAX9EkCAijNnnvpdv+WIGPPHR+rnB6I=";
    stripRoot = false;
  };
  nordScss = pkgs.writeText "nord.scss" ''
    @import "../template/mixins";
    @import "../template/settings";
    @import url('https://fonts.googleapis.com/css2?family=Barlow:wght@800&display=swap');
    @import url('fonts/IosevkaAile/IosevkaAile.css');
    $nord0: #2E3440;
    $nord1: #3B4252;
    $nord2: #434C5E;
    $nord3: #4C566A;
    $nord4: #D8DEE9;
    $nord5: #E5E9F0;
    $nord6: #ECEFF4;
    $nord7: #8FBCBB;
    $nord8: #88C0D0;
    $nord9: #81A1C1;
    $nord10: #5E81AC;
    $nord11: #BF616A;
    $nord12: #D08770;
    $nord13: #EBCB8B;
    $nord14: #A3BE8C;
    $nord15: #B48EAD;
    $mainColor: $nord4;
    $mainFont: 'Iosevka Aile Web', sans-serif;
    $headingColor: $nord6;
    $headingFont: Barlow, sans-serif;
    $headingFontWeight: 800;
    $headingTextShadow: none;
    $backgroundColor: $nord1;
    $linkColor: $nord9;
    $linkColorHover: lighten( $linkColor, 20% );
    $selectionBackgroundColor: $nord15;
    @include light-bg-text-color(#222);
    @import "../template/theme";
  '';
  extraCss = pkgs.writeText "extra.css" ''
    span[class|=section-number] {
      display: none;
    }
  '';
  revealjs = pkgs.buildNpmPackage rec {
    pname = "revealjs";
    version = "5.1.0";
    src = pkgs.fetchFromGitHub {
      owner = "hakimel";
      repo = "reveal.js";
      rev = version;
      hash = "sha256-L6KVBw20K67lHT07Ws+ZC2DwdURahqyuyjAaK0kTgN0=";
    };
    npmDepsHash = "sha256-KlTgu7wGHoUxjB+BkuuHhGYAQm/xgZlEPOdXEcwEiBA=";
    dontNpmPrune = true;
    postPatch = ''
      rm .npmignore
      cat <<EOF > bin.js
      process.chdir(__dirname)
      require('gulp-cli')();
      EOF
      ${pkgs.jq}/bin/jq '
        .bin.revealjs |= "bin.js"
      ' ${src}/package.json > package.json
      cp -L  ${nordScss} css/theme/source/nord.scss
      cp -Lr ${iosevkaAile} dist/theme/fonts/IosevkaAile
      cp -L  ${extraCss} dist/extra.css
    '';
    PUPPETEER_SKIP_DOWNLOAD = true;
    npmInstallFlags = [ "--include=dev" ];
    preBuild = ''
      export PATH="node_modules/.bin:$PATH"
    '';
  };
  org-reveal-export = pkgs.writeText "org-reveal-export.el" ''
    (require 'org-re-reveal)
    (setq org-re-reveal-root "reveal.js"
          org-re-reveal-revealjs-version "4"
          org-re-reveal-plugins '(notes)
          org-re-reveal-generate-custom-ids t
          org-re-reveal-extra-css "reveal.js/dist/extra.css"
          org-re-reveal-transition "none"
          org-re-reveal-history t
          org-re-reveal-theme "nord"
          org-re-reveal-height 800
          org-re-reveal-width 1200
          org-re-reveal-margin "0.1"
          org-re-reveal-min-scale "0.2"
          org-re-reveal-max-scale "2.5")
    (defun publish-slides ()
      (find-file "${distDir}/presentation/presentation.org")
      (org-re-reveal-export-to-html))
    (publish-slides)
  '';
  emacs = ((pkgs.emacsPackagesFor pkgs.emacs).emacsWithPackages
    (epkgs: with epkgs; [ org-re-reveal ]));
  build-presentation = pkgs.writeShellScript "build-presentation" ''
    set -euo pipefail
    cd "${distDir}/presentation"
    cp    "${config.env.DEVENV_ROOT}/presentation.org" .
    cp -R "${config.env.DEVENV_ROOT}/images" .
    ${emacs}/bin/emacs --batch -l "${org-reveal-export}"
  '';
in {
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
    ln -sf "${config.process-managers.process-compose.configFile}" "${config.env.DEVENV_ROOT}/process-compose.yml"
    "${initYarnScript}"
  '';

  env.PLAYWRIGHT_BROWSERS_PATH = "${pkgs.playwright-driver.browsers}";

  packages = (config.pre-commit.enabledPackages or [ ]) ++ [ revealjs ];

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

  scripts = {
    "build:presentation".exec = let
      clean = pkgs.writeShellScript "clean" ''
        rm -rf "${distDir}/presentation"
        mkdir -p "${distDir}/presentation"
      '';
      install = pkgs.writeShellScript "install" ''
        set -euo pipefail
        mkdir -p "${distDir}/presentation/reveal.js"/{js,css}
        cp -Lr --no-preserve=all "${revealjs}/lib/node_modules/reveal.js" "${distDir}/presentation"
      '';
    in ''
      set -euo pipefail
      ${clean}
      ${install}
      ${build-presentation}
    '';
    "build:demo-app".exec = ''
      mkdir -p "${distDir}/demo"
      yarn workspace @repo/demo-app build --outDir "${distDir}/demo" --emptyOutDir --base=/i-cant-believe-its-not-native/demo/
    '';
    "build:storybook".exec = ''
      mkdir -p "${distDir}/storybook"
      yarn workspace @repo/demo-app build-storybook --output-dir "${distDir}/storybook"
    '';
    build.exec = ''
      build:presentation &
      build:demo-app &
      build:storybook &
      wait
    '';
    dev.exec = ''
      process-compose \
        --unix-socket ''${PC_SOCKET_PATH:-${
          toString config.process.process-compose.unix-socket
        }} \
        --tui=''${PC_TUI_ENABLED:-${
          toString config.process.process-compose.tui
        }} \
        --namespace dev
    '';
  };

  processes = {
    "revealjs" = let log_location = "${config.env.DEVENV_STATE}/revealjs.log";
    in {
      exec = ''
        set -euo pipefail
        truncate -s 0 "${log_location}"
        revealjs serve --root "${distDir}/presentation" --watch
      '';
      process-compose = {
        namespace = "dev";
        availability.restart = "on_failure";
        inherit log_location;
        log_configuration.flush_each_line = true;
        depends_on.org-export.condition = "process_healthy";
        readiness_probe = {
          exec.command = toString
            (pkgs.writeShellScript "revealjs-readiness-probe.sh" ''
              set -euo pipefail
              [ ! -f "${log_location}" ] && exit 1
              grep -q "LiveReload started" "${log_location}"
            '');
          initial_delay_seconds = 1;
          period_seconds = 2;
          timeout_seconds = 2;
          success_threshold = 1;
          failure_threshold = 100;
        };
      };
    };
    "org-export" =
      let log_location = "${config.env.DEVENV_STATE}/org-export.log";
      in {
        exec = ''
          set -euo pipefail
          truncate -s 0 "${log_location}"
          export PATH="${lib.makeBinPath [ pkgs.inotify-tools ]}:$PATH"
          build:presentation
          while inotifywait -e close_write "${config.env.DEVENV_ROOT}/presentation.org"; do
            ${build-presentation}
          done
        '';
        process-compose = {
          namespace = "dev";
          availability.restart = "on_failure";
          inherit log_location;
          log_configuration.flush_each_line = true;
          readiness_probe = {
            exec.command = toString
              (pkgs.writeShellScript "org-export-readiness-probe.sh" ''
                set -euo pipefail
                [ ! -f "${log_location}" ] && exit 1
                grep -q "Watches established" "${log_location}"
              '');
            initial_delay_seconds = 1;
            period_seconds = 2;
            timeout_seconds = 2;
            success_threshold = 1;
            failure_threshold = 100;
          };
        };
      };
    "storybook" = let log_location = "${config.env.DEVENV_STATE}/storybook.log";
    in {
      exec = ''
        set -euo pipefail
        truncate -s 0 "${log_location}"
        yarn workspace @repo/demo-app storybook
      '';
      process-compose = {
        namespace = "dev";
        availability.restart = "on_failure";
        inherit log_location;
        log_configuration.flush_each_line = true;
        readiness_probe = {
          exec.command = toString
            (pkgs.writeShellScript "storybook-readiness-probe.sh" ''
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
    "demo-app" = let log_location = "${config.env.DEVENV_STATE}/demo-app.log";
    in {
      exec = ''
        set -euo pipefail
        truncate -s 0 "${log_location}"
        yarn workspace @repo/demo-app dev
      '';
      process-compose = {
        namespace = "dev";
        availability.restart = "on_failure";
        inherit log_location;
        log_configuration.flush_each_line = true;
        readiness_probe = {
          exec.command = toString
            (pkgs.writeShellScript "demo-app-readiness-probe.sh" ''
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
