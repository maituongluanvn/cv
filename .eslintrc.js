const off = 'off';

const warn = 'warn';

const error = 'error';

const TEST_ONLY_IMPORTS = ['fast-check', 'jest', 'eslint', 'prettier', 'supertest'];

// https://github.com/typescript-eslint/typescript-eslint/blob/master/packages/eslint-plugin/docs/rules/naming-convention.md
let NAMING_CONVENTION = [
  { selector: 'class', format: ['StrictPascalCase'] },
  {
    selector: 'default',
    format: ['strictCamelCase'],
  },
  {
    selector: 'accessor',
    format: ['strictCamelCase'],
  },
  {
    selector: 'accessor',
    modifiers: ['static'],
    format: ['UPPER_CASE', 'strictCamelCase'],
  },
  {
    selector: 'property',
    modifiers: ['public', 'static'],
    format: ['UPPER_CASE', 'strictCamelCase'],
  },
  {
    selector: 'property',
    modifiers: ['public'],
    // FIXME: snake_case is necessary since our output interfaces, or the input
    // ones may contain snake_case, since we don't have control over them (Or
    // changing them would be too expensive).
    // Is there any other way to flag these ones individually?
    format: ['camelCase', 'snake_case', 'PascalCase'],
  },
  {
    selector: 'function',
    format: ['strictCamelCase'],
  },
  {
    selector: 'variable',
    format: ['strictCamelCase', 'UPPER_CASE', 'StrictPascalCase'],
  },
  {
    selector: 'variable',
    types: ['function'],
    format: ['strictCamelCase', 'StrictPascalCase'],
  },
  {
    selector: 'parameter',
    format: ['strictCamelCase'],
  },
  {
    selector: 'parameterProperty',
    format: ['strictCamelCase'],
  },
  {
    selector: 'method',
    format: ['strictCamelCase'],
  },
  {
    selector: 'enumMember',
    // We can't modify the snake_case enums right now, since it defines outside
    // strings. We would need to change our format, or our use of enums.
    format: ['UPPER_CASE', 'snake_case'],
  },
  {
    selector: 'typeLike',
    format: ['StrictPascalCase'],
  },
];

NAMING_CONVENTION = NAMING_CONVENTION.map((description) => {
  return {
    leadingUnderscore: 'allow',
    trailingUnderscore: 'forbid',
    ...description,
  };
});

module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:json/recommended',
    'plugin:prettier/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  env: {
    browser: true,
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      typescript: { project: 'tsconfig.eslint.json' },
    },
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'import'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018, // Allows for the parsing of modern ECMAScript features
    sourceType: 'module', // Allows for the use of imports
    tsconfigRootDir: __dirname,
    project: ['./tsconfig.eslint.json'],
  },
  rules: {
    curly: 'error',
    'import/no-extraneous-dependencies': warn,
    'no-console': off,
    'no-return-await': off,
    'no-unused-vars': off,
    eqeqeq: [error, 'smart'],
    'no-else-return': [
      error,
      {
        allowElseIf: true,
      },
    ],
    '@typescript-eslint/unbound-method': [
      error,
      {
        ignoreStatic: true,
      },
    ],
    'no-restricted-imports': [
      'error',
      {
        paths: TEST_ONLY_IMPORTS.map((name) => {
          return { name, message: `${name} is only available during testing` };
        }),
        patterns: TEST_ONLY_IMPORTS.map((dep) => `${dep}/*`),
      },
    ],
    // camelcase is deprecated, use ONLY naming-convention
    camelcase: off,
    '@typescript-eslint/camelcase': off,
    '@typescript-eslint/naming-convention': [error, ...NAMING_CONVENTION],
    'require-await': off,
    '@typescript-eslint/require-await': off,
    '@typescript-eslint/indent': off,
    '@typescript-eslint/explicit-member-accessibility': warn,
    '@typescript-eslint/explicit-module-boundary-types': [off],
    '@typescript-eslint/no-var-requires': off,
    '@typescript-eslint/no-empty-function': off,
    '@typescript-eslint/no-object-literal-type-assertion': off,
    '@typescript-eslint/no-floating-promises': error,
    '@typescript-eslint/no-use-before-define': [error, { functions: false, classes: true }],
    '@typescript-eslint/restrict-template-expressions': [
      error,
      { allowNullish: true, allowBoolean: true, allowAny: true },
    ],
    // Issue for this rule https://github.com/typescript-eslint/typescript-eslint/issues/2393
    '@typescript-eslint/no-namespace': [error, { allowDeclarations: true }],
    // TODO: Too difficult to do right now
    /** <ANY> type issues */
    '@typescript-eslint/no-unsafe-assignment': off,
    '@typescript-eslint/no-explicit-any': off,
    '@typescript-eslint/no-unsafe-member-access': off,
    '@typescript-eslint/no-unsafe-return': off,
    '@typescript-eslint/no-unsafe-call': off,
    '@typescript-eslint/ban-types': [
      error,
      {
        types: {
          '{}': {
            message: 'Use object instead',
            fixWith: 'object',
          },
          object: false,
        },
        extendDefaults: true,
      },
    ],
    /** </> */
    'no-use-before-define': off,
    // Complexity analysis should be 20 as default.
    // https://eslint.org/docs/rules/complexity#rule-details
    complexity: ['error', { max: 20 }],
    // Preferably it would be 3, but botkit uses functions with 4 parameters
    'max-params': ['error', { max: 4 }],
    'max-nested-callbacks': ['error', { max: 5 }],
    'max-lines': ['error', { max: 600 }],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
  },
  overrides: [
    {
      files: ['*.js'],
      env: {
        browser: false,
        node: true,
      },
    },
    {
      files: ['*.ts', '*.tsx'],
      rules: {
        // Better than explicit-return type since it gives us freedom in internal functions.
        // https://github.com/typescript-eslint/typescript-eslint/pull/1020
        '@typescript-eslint/explicit-module-boundary-types': [
          error,
          {
            /**
             * If true, the rule will not report for arguments that are explicitly typed as `any`
             */
            allowArgumentsExplicitlyTypedAsAny: true,
            /**
             * If true, body-less arrow functions that return an `as const` type assertion will not
             * require an explicit return value annotation.
             * You must still type the parameters of the function.
             */
            allowDirectConstAssertionInArrowFunctions: true,
            /**
             * If true, functions immediately returning another function expression will not
             * require an explicit return value annotation.
             * You must still type the parameters of the function.
             */
            allowHigherOrderFunctions: true,
            /**
             * If true, type annotations are also allowed on the variable of a function expression
             * rather than on the function arguments/return value directly.
             */
            allowTypedFunctionExpressions: true,
          },
        ],
      },
    },
    {
      // TESTING CONFIGURATION
      files: [
        '**/*.test.js',
        '**/*.spec.js',
        '**/*.test.ts',
        '**/*.spec.ts',
        'tests/**/*.js',
        'tests/**/*.ts',
        '__mocks__/**/*.js',
        '__mocks__/**/*.ts',
        'jest*.setup.js',
        'jest*.env.setup.js',
      ],

      // https://eslint.org/docs/user-guide/configuring#specifying-environments
      env: {
        jest: true,
      },
      // Can't extend in overrides: https://github.com/eslint/eslint/issues/8813
      // "extends": ["plugin:jest/recommended"]
      plugins: ['jest'],
      // We can't use extends inside an overwrite unfortunately
      rules: {
        'no-restricted-imports': off,
        'jest/prefer-hooks-on-top': warn,
        'jest/no-conditional-expect': warn,
        // TODO: Prefer expect assertions requires us to modify all our tests.
        'jest/prefer-expect-assertions': off,
        // style
        'jest/consistent-test-it': ['error', { fn: 'test' }],
        'jest/prefer-strict-equal': warn,
        'jest/prefer-to-be-null': warn,
        'jest/prefer-to-be-undefined': warn,
        'jest/prefer-to-contain': warn,
        'jest/prefer-to-have-length': warn,
        'jest/prefer-called-with': warn,
        // Auto-Fixable
        'jest/valid-title': error,
        'jest/prefer-spy-on': warn,
        // Recommended
        'jest/no-identical-title': error,
        'jest/no-focused-tests': error,
        'jest/no-export': error,
        'jest/no-disabled-tests': error,
        'jest/no-commented-out-tests': error,
        'jest/no-jasmine-globals': error,
        'jest/no-jest-import': error,
        'jest/no-mocks-import': error,
        'jest/no-done-callback': error,
        'jest/no-standalone-expect': error,
        'jest/no-test-prefixes': error,
        'jest/valid-describe': error,
        'jest/valid-expect': error,
        'jest/valid-expect-in-promise': error,
      },
    },
  ],
};
