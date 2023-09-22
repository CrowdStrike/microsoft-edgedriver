# browser-webdriver-downloader

[![npm version](https://badge.fury.io/js/browser-webdriver-downloader.svg)](https://badge.fury.io/js/browser-webdriver-downloader)

Install and wrap msedgedriver in Node.js

Setting `EDGEDRIVER_VERSION` will prevent it from downloading latest, for example `EDGEDRIVER_VERSION=102.0.1245.33 npm install`.

Setting `DETECT_EDGEDRIVER_VERSION=true` will match your installed Edge version.

Setting `SKIP_EDGEDRIVER_DOWNLOAD=true` will skip the download.

Any supported proxy config from [proxy-from-env](https://www.npmjs.com/package/proxy-from-env) will work.
