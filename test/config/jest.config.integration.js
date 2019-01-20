'use strict';

require('dotenv').config({ path: '.env.test' });
const config = require('./jest.config');

process.env.INTEGRATION_TEST = true;

if (typeof process.env.MOCK === 'undefined') {
  process.env.MOCK = true;
} else {
  if (['true','false'].indexOf(process.env.MOCK) === -1) {
    throw new Error('"process.env.MOCK" value must be of boolean type.');
  }
}

module.exports = {
  ...config,
  "coveragePathIgnorePatterns": [
    "<rootDir>/test"
  ],
  "collectCoverageFrom": [
    "src/routes/**/*.js",
  ],
  "testMatch": [
    "<rootDir>/test/integration/**/*.(spec|test).js?(x)"
  ]
};
