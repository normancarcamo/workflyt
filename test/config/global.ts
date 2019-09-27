import 'jest-extended';
import 'jest-chain';

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
