module.exports = {
	env: {
		browser: true,
		es2021: true,
		node: true,
		'jest/globals': true,
	},
	extends: [
		'eslint:recommended',
		'plugin:react/recommended',
		'plugin:jsx-a11y/recommended',
		'plugin:testing-library/react',
		'plugin:jest/recommended'
	],
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	plugins: ['react', 'jest', 'testing-library'], 
	rules: {
		indent: ['error', 4],
		'jest/no-disabled-tests': 'warn',
		'jest/no-focused-tests': 'error',
		'jest/no-identical-title': 'error',
		'jest/prefer-to-have-length': 'warn',
		'jest/valid-expect': 'error',
	},
};
