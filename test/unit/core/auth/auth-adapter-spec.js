const Adapter = require('src/core/auth/auth-adapter');

describe('Adapter', () => {
  it('should module be a factory function', () => {
    expect(Adapter).toBeFunction();
  });

  it('should return an object when function is invoked', () => {
    expect(Adapter({})).toBeObject().not.toBeEmpty().toContainAllKeys([
      'comparePassword',
      'hashPassword',
      'signToken'
    ]);
  });

  describe('comparePassword', () => {
    it('should be a function', () => {
      expect(Adapter({}).comparePassword).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Adapter().comparePassword()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let bcrypt = { compare: (a, b) => Promise.resolve({ msg: 'ok' }) };
      let adapter = Adapter({ bcrypt });
      let options = { passwordA: 'AAA', passwordB: 'BBB' };
      expect(adapter.comparePassword(options)).toBePromise();
    });
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

  describe('signToken', () => {
    it('should be a function', () => {
      expect(Adapter({}).signToken).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Adapter().signToken()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let token = 'dk32jn2k3jn.23k23k32nkj32.232332kjn';
      let jsonwebtoken = { sign: (payload, secret) => token };
      let adapter = Adapter({ jsonwebtoken });
      let options = { payload: {}, secret: 'MyPasSwOrD.&^$' };
      expect(adapter.signToken(options)).toEqual(token);
    });
  });
});
