"use strict";

module.exports = {
  "bail": true,
  "verbose": false,
  "collectCoverage": false,
  "expand": true,
  "testURL": "http://localhost:3000/",
  "coverageDirectory": "./test/reports/coverage",
  "testEnvironment": "node",
  "rootDir": "../../",
  "setupFilesAfterEnv": [
    "./test/config/jest.setup.js"
  ],
  "watchPathIgnorePatterns": ["node_modules"],
  "transform": {
    "^.+\\.js$": "babel-jest"
  },
  "reporters": [
    "default",
    ["./node_modules/jest-html-reporter", {
      "pageTitle": "WorkFlyt",
      "outputPath": "test/reports/index.html",
      "includeFailureMsg": true,
      "theme": "lightTheme"
    }]
  ]
};
