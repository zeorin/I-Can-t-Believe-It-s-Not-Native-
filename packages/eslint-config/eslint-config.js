/** @type { import('eslint').Linter.Config } */
module.exports = {
	root: true,
	env: { browser: true, es2020: true },
	extends: [
		'eslint:recommended',
		'plugin:compat/recommended',
		'plugin:@typescript-eslint/strict-type-checked',
		'plugin:jsdoc/recommended-typescript',
		'plugin:promise/recommended',
		'plugin:import/recommended',
		'plugin:import/typescript',
		'plugin:react-hooks/recommended',
		'plugin:react/recommended',
		'plugin:react/jsx-runtime',
		'plugin:jsx-a11y/recommended',
		'plugin:@tanstack/eslint-plugin-query/recommended',
		'plugin:eslint-comments/recommended',
		'plugin:storybook/recommended',
		'prettier',
	],
	ignorePatterns: ['dist', '.eslintrc.cjs', 'src/routeTree.gen.ts'],
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
			linkComponents: [
				{
					name: 'Link',
					linkAttribute: ['to', 'href'],
				},
			],
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
				groups: [
					'builtin',
					'external',
					'internal',
					'unknown',
					'parent',
					'sibling',
					'index',
					'object',
				],
				pathGroups: [
					{
						pattern: '{react,react/**,react-dom,react-dom/**}',
						group: 'builtin',
						position: 'after',
					},
					{
						pattern: '@tanstack/**',
						group: 'builtin',
						position: 'after',
					},
					{
						pattern: '@mui/**',
						group: 'builtin',
						position: 'after',
					},
					{
						pattern: '#/**',
						group: 'internal',
						position: 'after',
					},
				],
				distinctGroup: true,
			},
		],
		'react-refresh/only-export-components': [
			'warn',
			{ allowConstantExport: true },
		],
		'react/jsx-no-literals': [
			'off',
			{
				noStrings: true,
				ignoreProps: true,
			},
		],
		'react/prop-types': 'off',
		'jsdoc/require-jsdoc': [
			'warn',
			{
				publicOnly: true,
			},
		],
		'jsdoc/require-returns': 'off',
		'jsdoc/require-param': [
			'off',
			{
				exemptedBy: ['inheritdoc', 'type'],
			},
		],
		'@typescript-eslint/no-unused-vars': [
			'warn',
			{
				varsIgnorePattern: '^_+$',
				argsIgnorePattern: '^_+$',
			},
		],
		'@typescript-eslint/restrict-template-expressions': [
			'warn',
			{
				allowNumber: true,
			},
		],
	},
}
