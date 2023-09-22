'use strict';

const { describe, it, setUpObjectReset } = require('../helpers/mocha');
const { expect } = require('../helpers/chai');
const { getGotOptions } = require('../../src');

const downloadUrl = 'https://foo.com';

describe(function() {
  describe(getGotOptions, function() {
    it('works', function() {
      let options = getGotOptions(downloadUrl);

      expect(options).to.be.empty;
    });

    describe('proxy', function() {
      setUpObjectReset(process.env);

      it('works', function() {
        process.env.HTTPS_PROXY = 'https://bar.com';

        let options = getGotOptions(downloadUrl);

        expect(options).to.nested.include({
          'agent.https.connectOpts.host': 'bar.com',
          'agent.https.connectOpts.port': 443,
        });
      });
    });
  });
});
