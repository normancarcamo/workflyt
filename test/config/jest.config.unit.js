'use strict';

const dotenv = require('dotenv');

dotenv.config({ path: '.env.test' });

const config = require('./jest.config');

config.reporters[1][1].outputPath = "docs/test/report/unit.html";

config.coverageDirectory = "docs/test/coverage/unit";

module.exports = {
  ...config,
  "coveragePathIgnorePatterns": [
    "<rootDir>/test",
    "<rootDir>/src/providers"
  ],
  "collectCoverageFrom": [
    "<rootDir>/src/*.(js|ts)",
    "<rootDir>/src/**/*.(js|ts)",
    "<rootDir>/src/**/**/*.(js|ts)",
    "!<rootDir>/src/core/**/index.(js|ts)"
  ],
  "testMatch": [
    "<rootDir>/test/unit/core/**/*-(spec|test).js?(x)",
    "<rootDir>/test/unit/*-(spec|test).js?(x)",
    "<rootDir>/test/unit/**/*-(spec|test).js?(x)",
    "<rootDir>/test/unit/**/**/*-(spec|test).js?(x)"
  ]
};
