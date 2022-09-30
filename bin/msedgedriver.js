#!/usr/bin/env node
'use strict';

require('../src/utils/throw-up');

const execa = require('execa');
const { getDriverPath } = require('../src');

(async () => {
  execa(await getDriverPath(), process.argv.slice(2), {
    stdio: 'inherit',
  });
})();
