'use strict';

const { describe, it, setUpSinon } = require('../helpers/mocha');
const { expect } = require('../helpers/chai');
const index = require('../../src');
const { oldVersion, missingPath } = require('../helpers/edge');

const { getDriverVersion } = index;

describe(function() {
  setUpSinon();

  describe(getDriverVersion, function() {
    let getLatestDriverVersion;

    beforeEach(function() {
      getLatestDriverVersion = this.stub(index, 'getLatestDriverVersion').rejects();
    });

    it('gracefully fails if trying to detect but edge not installed', async function() {
      getLatestDriverVersion.withArgs().resolves(oldVersion);

      let version = await getDriverVersion({
        shouldDetectVersion: true,
        browserCmd: missingPath,
      });

      expect(version).to.equal(oldVersion);

      expect(getLatestDriverVersion).to.be.calledOnce;
    });
  });
});
