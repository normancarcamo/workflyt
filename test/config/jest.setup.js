'use strict';

require('dotenv').config({ path: '.env.test' });
require('jest-extended');
require('jest-chain');

process.on('unhandledRejection', err => {
  console.error('TestSuite: unhandledRejection ->', err.message);
});

process.on('uncaughtException', err => {
  console.error('TestSuite: uncaughtException ->', err.message);
});

function isPromise(value) {
  return Boolean(value && typeof value.then === 'function');
}

expect.extend({
  toBePromise: (received, regexp) => {
    if (isPromise(received)) {
      return {
        pass: true
      };
    } else {
      return {
        pass: false,
        message: x => `Expected to be Promise, but got: ${received}`
      };
    }
  }
});
