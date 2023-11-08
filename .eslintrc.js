module.exports = {
  env: {
    es2021: true,
  },
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        '.eslintrc.{js,cjs}',
      ],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'no-underscore-dangle': ['error', { allow: ['_place', '_id'] }],
    'func-names': ['error', 'never'],
    'prefer-arrow-callback': [
      'error',
      {
        allowNamedFunctions: true,
        allowUnboundThis: false,
      },
    ],
    'consistent-return': 'off',
    'arrow-body-style': ['error', 'as-needed'],
    'max-classes-per-file': ['error', 5],
  },
};
