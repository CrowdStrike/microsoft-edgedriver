'use strict';

module.exports = {
  root: true,
  extends: [
    'crowdstrike-node',
  ],
  parserOptions: {
    // eslint bug, not inheriting from eslint-config-crowdstrike correctly
    ecmaVersion: 2020,
  },
  overrides: [
    {
      files: 'test/**/*-test.js',
      env: {
        mocha: true,
      },
      plugins: ['mocha'],
      extends: 'plugin:mocha/recommended',
      rules: {
        'mocha/no-exclusive-tests': 'error',
        'mocha/no-setup-in-describe': 'off',
      },
    },
  ],
};
