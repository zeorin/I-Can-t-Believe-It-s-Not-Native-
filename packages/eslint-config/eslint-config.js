/** @type { import('eslint').Linter.Config } */
module.exports = {
	root: true,
	env: { browser: true, es2020: true },
	extends: [
		'eslint:recommended',
		'plugin:compat/recommended',
		'plugin:@typescript-eslint/strict-type-checked',
		'plugin:promise/recommended',
		'plugin:import/recommended',
		'plugin:import/typescript',
		'plugin:react-hooks/recommended',
		'plugin:react/recommended',
		'plugin:react/jsx-runtime',
		'plugin:jsx-a11y/recommended',
		'plugin:eslint-comments/recommended',
		'prettier',
	],
	ignorePatterns: ['dist', '.eslintrc.cjs'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	settings: {
		'import/resolver': {
			[require.resolve('eslint-import-resolver-typescript')]: {
				alwaysTryTypes: true,
			},
			node: true,
		},
		react: {
			version: 'detect',
		},
	},
	plugins: ['react-refresh'],
	rules: {
		'import/first': 'warn',
		'import/order': [
			'warn',
			{
				alphabetize: {
					order: 'asc',
				},
				'newlines-between': 'always',
				pathGroups: [
					{
						pattern: 'react',
						group: 'builtin',
						position: 'after',
					},
					{
						pattern: '#/**',
						group: 'internal',
						position: 'before',
					},
				],
				pathGroupsExcludedImportTypes: ['react'],
				groups: [
					'builtin',
					'external',
					'internal',
					'parent',
					'sibling',
					'index',
					'object',
				],
			},
		],
		'react-refresh/only-export-components': [
			'warn',
			{ allowConstantExport: true },
		],
	},
}
