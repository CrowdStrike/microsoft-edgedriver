#!/usr/bin/env node
'use strict';

require('../src/utils/throw-up');

const { getDriverPath } = require('../src');

(async () => {
  const { execa } = await import('execa');

  await execa(getDriverPath(), process.argv.slice(2), {
    stdio: 'inherit',
  });
})();
