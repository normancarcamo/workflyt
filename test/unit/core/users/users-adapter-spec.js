const Adapter = require('src/core/users/users-adapter');

describe('Adapter', () => {
  it('should module be a factory function', () => {
    expect(Adapter).toBeFunction();
  });

  it('should return an object when function is invoked', () => {
    expect(Adapter({})).toBeObject().not.toBeEmpty().toContainAllKeys([
      'hashPassword'
    ]);
  });

  describe('hashPassword', () => {
    it('should be a function', () => {
      expect(Adapter({}).hashPassword).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Adapter().hashPassword()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let bcrypt = { hash: (payload, salt) => Promise.resolve({ msg: 'ok' }) };
      let adapter = Adapter({ bcrypt });
      let options = { password: 'AAA', salt: 10 };
      expect(adapter.hashPassword(options)).toBePromise();
    });
  });
});
