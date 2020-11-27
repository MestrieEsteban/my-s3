module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2019,
  },
  env: {
    es6: true,
  },
  extends: ['plugin:@typescript-eslint/recommended', 'prettier/@typescript-eslint'],
  plugins: ['prettier'],

  rules: {
    'prettier/prettier': ['error', require('./prettier.config')],
    // my rules
    '@typescript-eslint/no-var-requires': 'off',
    "@typescript-eslint/no-empty-function": 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
    '@typescript-eslint/camelcase': 'off'
  }
}