'use strict';

const { describe, it, setUpObjectReset } = require('../helpers/mocha');
const { expect } = require('../helpers/chai');
const execa = require('execa');
const fs = require('fs').promises;
const { driversRoot, getDriverPath } = require('../../bin/install-msedgedriver');
const path = require('path');

const installerPath = require.resolve('../../bin/install-msedgedriver');

describe(path.basename(installerPath), function() {
  this.timeout(30e3);

  setUpObjectReset(process.env);

  let driverPath;

  beforeEach(async function() {
    await fs.rm(driversRoot, { recursive: true, force: true });

    driverPath = await getDriverPath();
  });

  it('works', async function() {
    await execa.node(installerPath);

    expect(driverPath).to.be.a.file();
  });

  it('can pin the version', async function() {
    let version = '102.0.1245.33';

    Object.assign(process.env, {
      EDGEDRIVER_VERSION: version,
    });

    driverPath = await getDriverPath();

    let ps = await execa.node(installerPath);

    expect(driverPath).to.be.a.file();

    expect(ps.stdout).to.include(version);
  });
});
