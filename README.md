# QualityWatcher Reporter for Webdriverio

Publishes [WebdriverIO](https://webdriver.io/) runs on QualityWatcher.

This reporter works in conjunction with the [`@qualitywatcher/wdio-service`](https://www.npmjs.com/package/@qualitywatcher/wdio-service)

## Install

```shell
$ npm install @qualitywatcher/wdio-reporter --save-dev
```

or

```shell
yarn add -D @qualitywatcher/wdio-reporter
```

## Usage

1. Import QualityWatcher reporter to your config file `wdio.conf.js`

```javascript
import QualityWatcherReporter from "@qualitywatcher/wdio-reporter";
```

or

```javascript
const QualityWatcherReporter = require("@qualitywatcher/wdio-reporter");
```

2. Add QualityWatcher reporter to the list of reporters in your config file `wdio.conf.js`:

```javascript
reporters: ['spec', QualityWatcherReporter],
```

3. Your WebdriverIO tests should include the ID of your QualityWatcher test case and suite that it belongs to. Make sure the suite and test case IDs are distinct from your test titles:

```Javascript
// Good:
it("[S12C1234] Can authenticate a valid user", ...
it("Can authenticate a valid user [S12C1234]", ...

// Bad:
it("S12C123Can authenticate a valid user", ...
it("Can authenticate a valid userS5C123", ...
```

4. Install [`@qualitywatcher/wdio-service`](https://www.npmjs.com/package/@qualitywatcher/wdio-service) this reporter works in conjunction with that service.