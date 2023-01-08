'use strict';

const { describe, it } = require('../helpers/mocha');
const { expect } = require('../helpers/chai');
const fs = require('fs').promises;
const { getDriverPath } = require('../../src');
const path = require('path');

const installerPath = require.resolve('../../bin/install-msedgedriver');
const driverPath = getDriverPath();

describe(path.basename(installerPath), function() {
  this.timeout(30e3);

  beforeEach(async function() {
    await fs.rm(driverPath, { force: true });
  });

  it('gracefully fails if trying to detect but edge not installed', async function() {
    const { execaNode } = await import('execa');

    let ps = await execaNode(installerPath, [], {
      env: {
        DETECT_EDGEDRIVER_VERSION: 'true',
      },
    });

    expect(driverPath).to.be.a.file();

    expect(ps.stdout).to.include('DETECT_EDGEDRIVER_VERSION=true, but Microsoft Edge install not found');
  });
});
