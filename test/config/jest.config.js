"use strict";

module.exports = {
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
    "^.+\\.js$": "babel-jest",
    '^.+\\.tsx?$': 'ts-jest',
  },
  "reporters": [
    "default",
    ["./node_modules/jest-html-reporter", {
      "pageTitle": "WorkFlyt",
      "outputPath": "docs/test/report/index.html",
      "includeFailureMsg": true,
      "sort": "titleAsc",
      "dateFormat": "dd-mm-yyyy HH:MM:ss"
    }]
  ]
};
