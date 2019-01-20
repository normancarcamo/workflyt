"use strict";

require('dotenv').config({ path: '.env.test' });
require('jest-extended');
require('jest-chain');

process.on("unhandledRejection", err => {
  console.error("TestSuite: unhandledRejection ->", err.message);
});

process.on("uncaughtException", err => {
  console.error("TestSuite: uncaughtException ->", err.message);
});

if (process.env.INTEGRATION_TEST) {
  require("src/db/models").default.sync().then(() => {});
}

expect.extend({});
