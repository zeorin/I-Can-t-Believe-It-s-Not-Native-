((typescript-mode
  . ((eval . (let ((project-directory (car (dir-locals-find-file default-directory))))
               (setq lsp-clients-typescript-prefer-use-project-ts-server t
                     lsp-clients-typescript-project-ts-server-path (concat project-directory ".yarn/sdks/typescript/bin/tsserver")))))))
