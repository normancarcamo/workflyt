"use strict";

// @ts-ignore
require("regenerator-runtime/runtime");

const dotenv = require("dotenv");

dotenv.config({ path: ".env.test" });

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
    "./test/config/jest.setup.ts"
  ],
  "moduleFileExtensions": [ "ts", "tsx", "js", "jsx", "json", "node" ],
  "watchPathIgnorePatterns": ["node_modules"],
  "transform": {
    "^.+\\.(js|jsx|ts|tsx)$": "<rootDir>/node_modules/babel-jest"
  },
  "testMatch": [
    "<rootDir>/test/src/**/(*-|*.)(steps|spec|test).(js|jsx|ts|tsx)?(x)"
  ],
  "modulePaths": [
    "<rootDir>",
    "<rootDir>/src",
    "<rootDir>/test",
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
    "<rootDir>/src/server.ts"
  ],
  "collectCoverageFrom": [
    "<rootDir>/src/**/*.(js|jsx|ts|tsx)"
  ]
};

if (process.env.MOCK === "true") {
  // @ts-ignore
  config.reporters[1][1].outputPath = "docs/test/report/testing-mock.html";
  config.coverageDirectory = "docs/test/coverage/testing-mock";
} else {
  // @ts-ignore
  config.reporters[1][1].outputPath = "docs/test/report/testing.html";
  config.coverageDirectory = "docs/test/coverage/testing";
}

module.exports = config;
