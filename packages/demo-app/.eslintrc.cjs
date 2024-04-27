require('@repo/eslint-config/patch')

/** @type {import("eslint").Linter.Config} */
module.exports = {
	extends: [require.resolve('@repo/eslint-config')],
	root: true,
	parserOptions: {
		project: ['./tsconfig.json', './tsconfig.node.json'],
		tsconfigRootDir: __dirname,
	},
}
