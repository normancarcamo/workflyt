'use strict';

const config = require('./jest.config');

process.env.UNIT_TEST = true;

module.exports = {
  ...config,
  "coveragePathIgnorePatterns": [
    "<rootDir>/src/routes",
    "<rootDir>/test"
  ],
  "testMatch": [
    "<rootDir>/test/unit/**/*.(spec|test).js?(x)"
  ],
};
