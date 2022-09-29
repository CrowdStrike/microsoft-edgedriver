'use strict';

require('../src/utils/throw-up');

const got = require('got');
const { promisify } = require('util');
const fs = { ...require('fs'), ...require('fs').promises };
const path = require('path');
const extract = require('extract-zip');
const pipeline = promisify(require('stream').pipeline);
const os = require('os');
const { createTmpDir } = require('../src/tmp');

const platform = os.platform();
const arch = os.arch();

const downloadHost = 'https://msedgedriver.azureedge.net';

function getDownloadName() {
  let firstPart;
  let secondPart;

  if (platform === 'linux' && arch === 'x64') {
    firstPart = 'linux';
    secondPart = '64';
  } else if (platform === 'darwin' && arch === 'x64') {
    firstPart = 'mac';
    secondPart = '64';
  } else if (platform === 'darwin' && arch === 'arm64') {
    firstPart = 'mac';
    secondPart = '64';
  } else if (platform === 'win32' && arch === 'x64') {
    firstPart = 'win';
    secondPart = '64';
  } else if (platform === 'win32' && arch === 'x32') {
    firstPart = 'win';
    secondPart = '32';
  } else if (platform === 'win32' && arch === 'arm64') {
    firstPart = 'arm';
    secondPart = '64';
  } else {
    throw new Error(`${platform} ${arch} not supported`);
  }

  return `edgedriver_${firstPart}${secondPart}.zip`;
}

async function getDriverVersion() {
  let version;

  if (process.env.EDGEDRIVER_VERSION) {
    version = process.env.EDGEDRIVER_VERSION;
  } else {
    let { body } = await got.get(`${downloadHost}/LATEST_STABLE`);

    // For example: '��102.0.1245.33\r\n'
    version = body.replace(/[^\d.]/g, '');
  }

  return version;
}

function getDriverName() {
  if (platform === 'win32') {
    return 'msedgedriver.exe';
  } else {
    return 'msedgedriver';
  }
}

function getDriverPath(driverName = getDriverName()) {
  return path.resolve(__dirname, driverName);
}

async function install() {
  let downloadName = getDownloadName();

  let tmpDir = await createTmpDir();

  let downloadPath = path.join(tmpDir, downloadName);

  let version = await getDriverVersion();

  let downloadUrl = `${downloadHost}/${version}/${downloadName}`;

  console.log(`Downloading ${downloadUrl}...`);

  await pipeline(
    got.stream(downloadUrl),
    fs.createWriteStream(downloadPath),
  );

  let tmpPath = path.resolve(__dirname, '../tmp');

  await fs.mkdir(tmpPath, { recursive: true });

  console.log(`Extracting ${downloadPath}...`);

  await extract(downloadPath, { dir: tmpPath });

  let driverName = getDriverName();

  let tmpDriverPath = path.join(tmpPath, driverName);

  let driverPath = getDriverPath(driverName);

  await fs.rename(tmpDriverPath, driverPath);

  console.log(`Edge WebDriver available at ${driverPath}`);

  await fs.rm(tmpPath, { recursive: true, force: true });

  await fs.unlink(downloadPath);

  // await hackLocalBinSymlink();
}

// eslint-disable-next-line no-unused-vars
async function hackLocalBinSymlink() {
  let packagePath = require.resolve('../package');
  let { bin } = require(packagePath);
  let packageRoot = path.dirname(packagePath);

  for (let [name, _path] of Object.entries(bin)) {
    let dest = path.join(packageRoot, 'node_modules/.bin', name);
    let source = path.relative(path.dirname(dest), path.join(packageRoot, _path));

    try {
      await fs.unlink(dest);
    } catch (err) {
      if (err.code !== 'ENOENT') {
        throw err;
      }
    }

    await fs.symlink(source, dest);

    console.log(`${dest} -> ${source}`);
  }
}

if (require.main === module) {
  install();
} else {
  module.exports = {
    getDriverPath,
  };
}
