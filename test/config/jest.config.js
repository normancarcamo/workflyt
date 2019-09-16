'use strict';

require("regenerator-runtime/runtime");

const dotenv = require('dotenv');

dotenv.config({ path: '.env.test' });

const config = {
  "rootDir": "../../",
  "bail": true,
  "verbose": false,
  "collectCoverage": false,
  "expand": true,
  "testURL": "http://localhost:3000/",
  "coverageDirectory": "docs/test/coverage",
  "testEnvironment": "node",
  "setupFilesAfterEnv": [
    "./test/config/jest.setup.js"
  ],
  "moduleFileExtensions": [ 'ts', 'tsx', 'js', 'jsx', 'json', 'node' ],
  "watchPathIgnorePatterns": ["node_modules"],
  "transform": {
    "^.+\\.js$": "babel-jest"
  },
  "modulePaths": [
    "<rootDir>"
  ],
  "reporters": [
    "default",
    ["./node_modules/jest-html-reporter", {
      "pageTitle": "WorkFlyt",
      "outputPath": "docs/test/report/index.html",
      "includeFailureMsg": true,
      "sort": "titleAsc",
      "dateFormat": "dd-mm-yyyy HH:MM:ss"
    }]
  ],
  "coveragePathIgnorePatterns": [
    "<rootDir>/test",
    "<rootDir>/src/providers",
    "<rootDir>/src/server.js"
  ],
  "collectCoverageFrom": [
    "<rootDir>/src/**/*.(js|ts)"
  ],
  "testMatch": [
    "<rootDir>/test/src/**/*-(spec|test).js?(x)",
    "**/*.steps.js"
  ]
};

if (process.env.MOCK === 'true') {
  config.reporters[1][1].outputPath = "docs/test/report/testing-mock.html";
  config.coverageDirectory = "docs/test/coverage/testing-mock";
} else {
  config.reporters[1][1].outputPath = "docs/test/report/testing.html";
  config.coverageDirectory = "docs/test/coverage/testing";
}

module.exports = config;
