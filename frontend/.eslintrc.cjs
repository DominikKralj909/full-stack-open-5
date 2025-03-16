module.exports = {
	rules: {
		indent: ["error", 4],
		quotes: ["error", "single"],
		semi: ["error", "always"],
		"react/prop-types": ["error"]
	},
	extends: ["eslint:recommended", "plugin:react/recommended"],
	env: {
		browser: true,
		es2021: true
	},
	parserOptions: {
		ecmaFeatures: {
			jsx: true
		},
		ecmaVersion: 12,
		sourceType: "module"
	},
	plugins: ["react"]
};
