'use strict';

const { describe, it, setUpObjectReset } = require('../helpers/mocha');
const { expect } = require('../helpers/chai');
const execa = require('execa');
const path = require('path');

const installerPath = require.resolve('../../bin/install-msedgedriver');
const binPath = require.resolve('../../bin/msedgedriver.js');

describe(path.basename(binPath), function() {
  this.timeout(30e3);

  setUpObjectReset(process.env);

  before(async function() {
    await execa.node(installerPath);
  });

  it('works', async function() {
    let ps = execa.node(binPath);

    let isSuccess = false;

    ps.stdout.on('data', data => {
      let stdout = data.toString();

      if (stdout.includes('Microsoft Edge WebDriver was started successfully.')) {
        ps.kill();

        isSuccess = true;
      }
    });

    await expect(ps).to.eventually.be.rejectedWith('Command was killed with SIGTERM');

    expect(isSuccess).to.equal(true);
  });

  it('can find bin even if different version', async function() {
    let version = '102.0.1245.33';

    Object.assign(process.env, {
      EDGEDRIVER_VERSION: version,
    });

    let ps = execa.node(binPath);

    let isSuccess = false;

    ps.stdout.on('data', data => {
      let stdout = data.toString();

      if (stdout.includes('Microsoft Edge WebDriver was started successfully.')) {
        ps.kill();

        isSuccess = true;
      }
    });

    await expect(ps).to.eventually.be.rejectedWith('Command was killed with SIGTERM');

    expect(isSuccess).to.equal(true);
  });
});
