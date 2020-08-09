module.exports = {
  'parser': 'vue-eslint-parser',
  'parserOptions': {
    'parser': '@typescript-eslint/parser',
    'ecmaVersion': 2020,
    'sourceType': 'module',
    'project': ['./tsconfig.json'],
    'extraFileExtensions': ['.vue'],
  },
  'env': {
    'commonjs': true,
    'node': true,
    'es6': true,
    'es2017': true,
  },
  'ignorePatterns': ['node_modules/','dist/'],
  'plugins': [
    '@typescript-eslint',
    'vue',
    'jsdoc',
  ],
  'rules': {
    'unicode-bom': ['error', 'never'],
    'semi': 'off', //overriden by typescript-eslint
    'quotes': 'off', //overriden by typescript-eslint
    'no-var': 'error',
    'no-unreachable': 'error',
    'multiline-ternary': ['error', 'never'],
    'eol-last': ['error', 'always'],
    'linebreak-style': ['error', 'unix'],
    'comma-style': ['error', 'last'],
    'comma-dangle': ['error', 'always-multiline'],
    'brace-style': 'off', //overriden by typescript-eslint
    'indent': 'off', //overriden by typescript-eslint
    'no-implicit-globals': 'error',
    'no-eval': 'error',
    'curly': 'error',
    'default-case': 'error',
    'no-compare-neg-zero': 'error',
    'no-cond-assign': ['error', 'always'],
    'no-debugger': 'error',
    'no-dupe-args': 'error',
    'no-dupe-keys': 'error',
    'no-duplicate-case': 'error',
    'no-ex-assign': 'error',
    'no-extra-parens': 'off', //overriden by typescript-eslint
    'no-irregular-whitespace': 'error',
    'no-unsafe-finally': 'error',
    'no-unsafe-negation': 'error',
    'use-isnan': 'error',
    'eqeqeq': ['error', 'always'],
    'guard-for-in': 'error',
    'no-alert': 'error',
    'no-extra-bind': 'error',
    'no-floating-decimal': 'error',
    'no-labels': 'warn',
    'no-multi-spaces': 'error',
    'no-self-compare': 'error',
    'no-useless-catch': 'error',
    'no-useless-concat': 'error',
    'no-useless-escape': 'error',
    'no-useless-return': 'error',
    'no-with': 'error',
    'prefer-promise-reject-errors': 'error',
    'vars-on-top': 'error',
    'no-shadow': 'error',
    'no-undef': 'error',
    'no-undef-init': 'error',
    'global-require': 'error',
    'no-new-require': 'error',
    'no-mixed-requires': 'error',
    'no-tabs': 'error',

    //base rules overriden by typescript-eslint
    '@typescript-eslint/semi': ['error', 'always'],
    '@typescript-eslint/quotes': ['error', 'single'],
    '@typescript-eslint/brace-style': ['error'],
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/no-implied-eval': 'error',
    '@typescript-eslint/no-extra-parens': ['error'],

    //typescript related rules
    '@typescript-eslint/adjacent-overload-signatures': 'error',
    '@typescript-eslint/array-type': ['error', {'default': 'generic'}],
    '@typescript-eslint/await-thenable': 'error',
    '@typescript-eslint/ban-ts-ignore': 'error',
    '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/no-floating-promises': 'warn',
    '@typescript-eslint/no-misused-new': 'error',
    '@typescript-eslint/no-this-alias': 'error',
    '@typescript-eslint/no-unnecessary-condition': 'error',
    '@typescript-eslint/no-unnecessary-type-assertion': 'error',
    '@typescript-eslint/prefer-nullish-coalescing': 'error',
    '@typescript-eslint/prefer-optional-chain': 'error',
    '@typescript-eslint/prefer-string-starts-ends-with': 'error',
    '@typescript-eslint/promise-function-async': 'error',
    '@typescript-eslint/unified-signatures': 'error',

    //jsdoc rules
    'jsdoc/check-access': 'warn',
    'jsdoc/check-alignment': 'error',
    'jsdoc/check-indentation': 'warn',
    'jsdoc/check-param-names': 'error',
    'jsdoc/check-property-names': 'error',
    'jsdoc/check-tag-names': 'error',
    'jsdoc/check-types': 'warn',
    'jsdoc/check-values': 'error',
    'jsdoc/empty-tags': 'error',
    'jsdoc/newline-after-description': 'warn',
    'jsdoc/no-types': 'warn',
    'jsdoc/no-undefined-types': 'warn',
    'jsdoc/require-description': 'error',
    'jsdoc/require-jsdoc': ['error',{
      'publicOnly': false,
      'require': {
        'ArrowFunctionExpression': true,
        'ClassDeclaration': true,
        'ClassExpression': true,
        'FunctionDeclaration': true,
        'FunctionExpression': true,
        'MethodDefinition': true,
      },
    }],
    'jsdoc/require-param-description': 'error',
    'jsdoc/require-param-name': 'error',
    'jsdoc/require-param': 'error',
    'jsdoc/require-property': 'error',
    'jsdoc/require-property-description': 'error',
    'jsdoc/require-property-name': 'error',
    'jsdoc/require-returns-description': 'error',
    'jsdoc/require-returns': 'error',

    //vue rules
    'vue/comment-directive': 'error',
    'vue/jsx-uses-vars': 'error',
    'vue/no-dupe-keys': 'error',
    'vue/no-duplicate-attributes': ['error', {
      'allowCoexistClass': true,
      'allowCoexistStyle': true
    }],
    'vue/no-reserved-keys': 'error',
    'vue/no-shared-component-data': 'error',
    'vue/no-side-effects-in-computed-properties': 'error',
    'vue/no-template-key': 'error',
    'vue/no-textarea-mustache': 'error',
    'vue/no-unused-vars': 'error',
    'vue/no-use-v-if-with-v-for': 'error',
    'vue/require-prop-type-constructor': 'error',
    'vue/require-render-return': 'error',
    'vue/require-v-for-key': 'error',
    'vue/require-valid-default-prop': 'error',
    'vue/return-in-computed-property': 'error',
    'vue/valid-template-root': 'error',
    'vue/valid-v-bind': 'error',
    'vue/valid-v-cloak': 'error',
    'vue/valid-v-else-if': 'error',
    'vue/valid-v-else': 'error',
    'vue/valid-v-for': 'error',
    'vue/valid-v-html': 'error',
    'vue/valid-v-if': 'error',
    'vue/valid-v-model': 'error',
    'vue/valid-v-on': 'error',
    'vue/valid-v-once': 'error',
    'vue/valid-v-pre': 'error',
    'vue/valid-v-show': 'error',
    'vue/valid-v-text': 'error',
    'vue/attribute-hyphenation': 'error',
    "vue/html-closing-bracket-newline": ["error", {
      "singleline": "never",
      "multiline": "never",
    }],
    "vue/html-closing-bracket-spacing": ["error", {
      "startTag": "always",
      "endTag": "always",
      "selfClosingTag": "always",
    }],
    'vue/html-end-tags': 'error',
    'vue/html-indent': ['error', 2],
    "vue/html-quotes": ["error", "double"],
    "vue/html-self-closing": ["error", {
      "html": {
        "void": "always",
        "normal": "always",
        "component": "always"
      },
      "svg": "always",
      "math": "always"
    }],
    "vue/mustache-interpolation-spacing": ["error", "never"],
    "vue/name-property-casing": ["error", "kebab-case"],
    'vue/no-multi-spaces': 'error',
    "vue/no-spaces-around-equal-signs-in-attribute": ["error"],
    'vue/no-template-shadow': 'error',
    "vue/prop-name-casing": ["error", "snake_case"],
    'vue/require-default-prop': 'error',
    'vue/require-prop-types': 'error',
    "vue/v-bind-style": ["error", "shorthand"],
    "vue/v-on-style": ["error", "longform"],
    'vue/no-v-html': 'error',
    "vue/this-in-template": ["error", "never"],
    "vue/component-definition-name-casing": ["error", "kebab-case"],
    "vue/component-name-in-template-casing": ["error", "kebab-case"],
    'vue/no-deprecated-scope-attribute': 'error',
    'vue/no-deprecated-slot-attribute': 'error',
    'vue/no-deprecated-slot-scope-attribute': 'error',
    'vue/no-irregular-whitespace': 'error',
    'vue/no-reserved-component-names': 'error',
    'vue/require-name-property': 'error',
    "vue/v-slot-style": ["error", {
      "atComponent": "v-slot",
      "default": "v-slot",
      "named": "longform",
    }],
    'vue/valid-v-bind-sync': 'error',
    'vue/valid-v-slot': 'error',
  },
  'settings': {
    'jsdoc': {
      'mode': 'typescript',
    },
  },
};
