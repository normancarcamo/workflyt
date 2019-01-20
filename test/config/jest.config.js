"use strict";

module.exports = {
  "bail": true,
  "verbose": false,
  "collectCoverage": false,
  "expand": true,
  "testURL": "http://localhost/",
  "coverageDirectory": "./test/reports/coverage",
  "testEnvironment": "node",
  "rootDir": "../../",
  "setupTestFrameworkScriptFile": "./test/config/jest.setup.js",
  "transform": {
    "^.+\\.js$": "babel-jest"
  },
  "reporters": [
    "default",
    ["./node_modules/jest-html-reporter", {
      "pageTitle": "Tracking WorkFlow",
      "outputPath": "test/reports/index.html",
      "includeFailureMsg": true,
      "theme": "lightTheme"
    }]
  ]
};
