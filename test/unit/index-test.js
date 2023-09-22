'use strict';

const { describe, it } = require('../helpers/mocha');
const { expect } = require('../helpers/chai');
const { getGotOptions } = require('../../src');

describe(function() {
  describe(getGotOptions, function() {
    it('works', function() {
      let options = getGotOptions();

      expect(options).to.be.empty;
    });
  });
});
