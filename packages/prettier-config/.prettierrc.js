/** @type { import('prettier').Config } */
export default {
	experimentalTernaries: true,
	useTabs: true,
	semi: false,
	singleQuote: true,
	overrides: [
		{
			files: 'package.json',
			options: {
				useTabs: false,
			},
		},
	],
}
