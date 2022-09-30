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

async function rename(from, to) {
  // system tmp may be mounted on a different drive
  // use `fs-extra` to prevent `Error: EXDEV: cross-device link not permitted, rename ...`
  await require('fs-extra').move(from, to);
}

module.exports = {
  exists,
  rename,
};
