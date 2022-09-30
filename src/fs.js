'use strict';

const fs = { ...require('fs'), ...require('fs').promises };

async function exists(path) {
  try {
    await fs.access(path, fs.constants.F_OK);

    return true;
  } catch {
    return false;
  }
}

module.exports = {
  exists,
};
