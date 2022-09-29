'use strict';

const { describe, it } = require('../helpers/mocha');
const { expect } = require('../helpers/chai');
const execa = require('execa');
const fs = require('fs').promises;
const { getDriverPath } = require('../../bin/install-msedgedriver');

const installerPath = require.resolve('../../bin/install-msedgedriver');
const driverPath = getDriverPath();

describe(function() {
  this.timeout(30e3);

  beforeEach(async function() {
    await fs.rm(driverPath, { force: true });
  });

  it('works', async function() {
    await execa.node(installerPath);

    expect(driverPath).to.be.a.file();
  });
});
