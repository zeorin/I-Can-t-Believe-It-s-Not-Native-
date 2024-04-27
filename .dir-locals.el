((nil . ((indent-tabs-mode . t)
         (tab-width . 2)))
 (nix-mode . ((indent-tabs-mode . nil)))
 (rjsx-mode . ((lsp-eslint-node-path . ".yarn/sdks")
    (lsp-eslint-working-directories . [(pattern "packages/*")])
    (lsp-auto-fix-on-save . t)))
 (typescript-mode . ((lsp-eslint-node-path . ".yarn/sdks")
    (lsp-eslint-working-directories . [(pattern "packages/*")])
    (lsp-auto-fix-on-save . t)))
 (typescript-mode
  . ((eval . (let ((project-directory (car (dir-locals-find-file default-directory))))
               (setq lsp-clients-typescript-prefer-use-project-ts-server t
                     lsp-clients-typescript-project-ts-server-path (concat project-directory ".yarn/sdks/typescript/bin/tsserver")))))))
