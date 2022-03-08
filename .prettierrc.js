//@ts-check
/** @type {import("prettier").Options & {overrides:{files:string, options:import("prettier").Options}[]}} */
const options = {
  semi: true,
  trailingComma: 'all',
  singleQuote: true,
  printWidth: 120,
  tabWidth: 2,
  overrides: [
    {
      files: '*.json',
      options: {
        tabWidth: 4,
      },
    },
  ],
};

module.exports = options;
