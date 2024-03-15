const path = require('path');

module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:import/recommended',
    'plugin:react-hooks/recommended'
  ],
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    ecmaFeatures: {
      jsx: true
    },
    ecmaVersion: 14
  },
  rules: {
    'react/react-in-jsx-scope': 0
  },
  settings: {
    react: {
      version: 'detect'
    },
    'import/resolver': {
      webpack: {
        config: path.join(__dirname, 'webpack.config.babel.js')
      }
    }
  }
};
