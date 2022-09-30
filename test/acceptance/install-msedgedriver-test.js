'use strict';

const { describe, it, setUpObjectReset } = require('../helpers/mocha');
const { expect } = require('../helpers/chai');
const execa = require('execa');
const fs = require('fs').promises;
const { driversRoot, getDriverPath } = require('../../src');
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

  it('doesn\'t redownload same version', async function() {
    let string = `Found ${driverPath}, not downloading`;

    let ps = await execa.node(installerPath);

    expect(ps.stdout).to.not.include(string);

    ps = await execa.node(installerPath);

    expect(ps.stdout).to.include(string);
  });

  it('can detect the version', async function() {
    if (process.platform === 'win32') {
      return this.skip();
    }

    Object.assign(process.env, {
      DETECT_EDGEDRIVER_VERSION: 'true',
    });

    driverPath = await getDriverPath();

    let ps = await execa.node(installerPath);

    expect(driverPath).to.be.a.file();

    expect(ps.stdout).to.include('DETECT_EDGEDRIVER_VERSION=true, detected version ');
  });
});
