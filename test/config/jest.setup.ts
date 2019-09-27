import is from '@ncardez/datalizer/src/is';
import dotenv from 'dotenv';
import 'jest-extended';
import 'jest-chain';

dotenv.config({ path: '.env.test' });


process.on('unhandledRejection', (err:any) => {
  console.error('TestSuite: unhandledRejection ->', err.message);
});

process.on('uncaughtException', (err:any) => {
  console.error('TestSuite: uncaughtException ->', err.message);
});

declare global {
  namespace jest {
    // required for expect(expected).toBeJsonWebToken()
    interface Matchers<R> {
      toBeJsonWebToken(): object;
    }
    // required for { id: expect.toBeRandomId() }
    interface Expect {
      toBeRandomId(): object;
    }
  }
}

expect.extend({
  toBePromise(received) {
    let message = () => `Expected to be Promise, but got: ${received}`;
    return is.promise(received)
      ? { pass: true, message: '' }
      : { pass: false, message };
  },
  toBeError(received) {
    let message = () => `Expected to be Error, but got: ${received}`;
    return (received && received.stack &&
      received.message &&
      typeof received.stack === 'string' &&
      typeof received.message === 'string')
        ? { pass: true, message: '' }
        : { pass: false, message };
  },
  toBeJsonWebToken(received) {
    if (is.string(received) && !is.empty(received) &&
    received.includes('.') &&
    received.match(/\./g).length === 2) {
      let a = received.split('.');
      if (is.array(a) && !is.empty(a) && a.length === 3) {
        if (received.length > 100) {
          return { pass: true, message: '' };
        }
      }
    }

    let message = 'Expected to be a string signature of Json Web Token';
    return { pass: false, message: () => `${message}, but got: ${received}` };
  }
});
