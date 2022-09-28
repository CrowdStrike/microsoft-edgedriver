#!/usr/bin/env node
'use strict';

require('../src/utils/throw-up');

const execa = require('execa');
const { getDriverPath } = require('./install-msedgedriver');

execa(getDriverPath(), process.argv.slice(2), {
  stdio: 'inherit',
});
