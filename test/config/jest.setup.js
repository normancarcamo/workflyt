'use strict';

require('dotenv').config({ path: '.env.test' });
require('jest-extended');
require('jest-chain');
let is = require('@ncardez/datalizer/src/is');

process.on('unhandledRejection', err => {
  console.error('TestSuite: unhandledRejection ->', err.message);
});

process.on('uncaughtException', err => {
  console.error('TestSuite: uncaughtException ->', err.message);
});

expect.extend({
  toBePromise: (received, regexp) => {
    let message = x => `Expected to be Promise, but got: ${received}`;
    return is.promise(received)
      ? { pass: true }
      : { pass: false, message };
  },
  toBeError: (e, regexp) => {
    let message = x => `Expected to be Error, but got: ${e}`;
    return (e && e.stack && e.message && typeof e.stack === 'string' && typeof e.message === 'string')
      ? { pass: true }
      : { pass: false, message };
  },
  toBeJsonWebToken: (x, regexp) => {
    if (is.string(x) && !is.empty(x) && x.includes('.') && x.match(/\./g).length === 2) {
      let a = x.split('.');
      if (is.array(a) && !is.empty(a) && a.length === 3) {
        if (x.length > 100) {
          return { pass: true };
        }
      }
    }

    return {
      pass: false,
      message: x => `Expected to be a string signature of Json Web Token, but got: ${x}`
    };
  }
});
