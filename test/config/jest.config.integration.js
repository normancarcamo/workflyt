'use strict';

const dotenv = require('dotenv');

dotenv.config({ path: '.env.test' });

const config = require('./jest.config');

if (process.env.MOCK === 'true') {
  config.reporters[1][1].outputPath = "docs/test/report/integration-mock.html";
  config.coverageDirectory = "docs/test/coverage/integration-mock";
} else {
  config.reporters[1][1].outputPath = "docs/test/report/integration.html";
  config.coverageDirectory = "docs/test/coverage/integration";
}

module.exports = {
  ...config,
  "coveragePathIgnorePatterns": [
    "<rootDir>/test",
    "<rootDir>/src/providers",
    "<rootDir>/src/index.js"
  ],
  "collectCoverageFrom": [
    "<rootDir>/src/*.(js|ts)",
    "<rootDir>/src/**/*.(js|ts)",
    "<rootDir>/src/**/**/*.(js|ts)"
  ],
  "testMatch": [
    "<rootDir>/test/integration/*-(spec|test).js?(x)",
    "<rootDir>/test/integration/**/*-(spec|test).js?(x)"
  ]
};
