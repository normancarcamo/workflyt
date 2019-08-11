const Validator = require('src/core/auth/auth-validator');

describe('Validator', () => {
  it('should module be a factory function', () => {
    expect(Validator).toBeFunction();
  });
  it('should throw error when Datalizer is not passed in as argument', () => {
    expect(x => Validator({})).toThrow();
  });
  it('should return an object when function is invoked', () => {
    expect(Validator({ Datalizer: function(schema) {} }))
      .toBeObject()
      .not.toBeEmpty()
      .toContainAllKeys([ 'signIn', 'signUp' ]);
  });
});
