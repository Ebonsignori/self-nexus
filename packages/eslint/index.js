module.exports = {
	env: {
		'node': true,
		'browser': false,
		'commonjs': true,
		'es6': true,
		'mocha': true,
	},
	extends: [
		'eslint:recommended',
		'airbnb-typescript/base',
		'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
		"plugin:@typescript-eslint/recommended",
		"plugin:@typescript-eslint/eslint-recommended",
		"plugin:@typescript-eslint/recommended-requiring-type-checking",
	],
	plugins: ['@typescript-eslint'],
	globals: {
		'Atomics': 'readonly',
		'SharedArrayBuffer': 'readonly',
	},
	parser: "@typescript-eslint/parser",
	'parserOptions': {
		"project": "./tsconfig.json"
	},
	settings: {
		'import/resolver': {
			node: {
				extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
				paths: ['./src']
			}
		},
		'import/extensions': ['error', 'ignorePackages', {
      js: 'never',
      jsx: 'never',
      ts: 'never',
      tsx: 'never',
		}],
	},
	overrides: [
		{
			files: ["./migrations/**/*.ts"],
			rules: {
				"import/prefer-default-export": 0,
				"@typescript-eslint/class-name-casing": 0,
				"@typescript-eslint/no-explicit-any": 0,
				"max-len": [2, {"code": 120, "tabWidth": 4, "ignoreUrls": true}]
			}
		},
	],
	rules: {
		'indent': 0,
		'@typescript-eslint/indent': [
			'error',
			2
		],
		'linebreak-style': [
			'error',
			'unix'
		],
		'quotes': [
			'error',
			'single'
		],
		"comma-dangle": ["error", {
				"arrays": "always-multiline",
				"objects": "always-multiline",
				"imports": "always-multiline",
				"exports": "always-multiline",
				"functions": "never"
		}],
		"no-use-before-define": ["error", { "functions": false, "classes": false, "variables": true }],
		"@typescript-eslint/no-use-before-define": ["error", { "functions": false, "classes": false, "variables": true }],
		'@typescript-eslint/no-var-requires': 0,
		"class-methods-use-this": 0,
		// Disabled because TypeORM relation mappings require circular imports
		"import/no-cycle": 0,
		"max-len": [2, {"code": 120, "tabWidth": 4, "ignoreUrls": true}],
		'import/prefer-default-export': 0,
		'prefer-destructuring': 0,
		"no-restricted-syntax": ["error", "LabeledStatement", "WithStatement"],
		'no-underscore-dangle': 0,
		'@typescript-eslint/no-unused-vars': ['error', {
			'varsIgnorePattern': '^type$',
			'argsIgnorePattern': '^type$',
		}],
		'arrow-parens': 0,
    'max-classes-per-file': 0,
    'no-explicit-any': 0,
    '@typescript-eslint/no-explicit-any': 0,
    // Use global require for lazy-loading modules
    'global-require': 0,
    'no-await-in-loop': 0,
    'no-param-reassign': 0,
    'no-continue': 0,
	}
}
