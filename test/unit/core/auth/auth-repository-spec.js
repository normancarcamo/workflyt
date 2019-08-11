const Repository = require('src/core/auth/auth-repository');
const database = {
  models: {
    User: {
      findOne: o => Promise.resolve({}),
      create: o => Promise.resolve({}),
    }
  },
  sequelize: { query: s => Promise.resolve(null) },
  Sequelize: { QueryTypes: { SELECT: 1 } }
};

describe('Repository', () => {
  beforeEach(() => {
    database.sequelize.query = s => Promise.resolve(null);
    database.models.User.findOne = o => Promise.resolve({});
    database.models.User.create = o => Promise.resolve({});
  });

  it('should module be a factory function', () => {
    expect(Repository).toBeFunction();
  });
  it('should return an object when function is invoked', () => {
    expect(Repository()).toBeObject().not.toBeEmpty().toContainAllKeys([
      'findUserWithRoles',
      'findUserByUsername',
      'createUser'
    ]);
  });

  describe('findUserWithRoles', () => {
    it('should be a function', () => {
      expect(Repository().findUserWithRoles).toBeFunction();
    });
    it('should throw error when is invoked without arguments', () => {
      expect(x => Repository().findUserWithRoles()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      database.sequelize.query = s => Promise.resolve({});
      expect(Repository(database).findUserWithRoles({})).toBePromise();
    });
    it('should be resolved when query returns a value', () => {
      database.sequelize.query = s => Promise.resolve({});
      expect(Repository(database).findUserWithRoles({}))
        .toBePromise()
        .toResolve();
    });
    it('should be rejected when query fail', () => {
      database.sequelize.query = s => Promise.reject(new Error('ouch!'));
      expect(Repository(database).findUserWithRoles({}))
        .toBePromise()
        .toReject();
    });
  });

  describe('findUserByUsername', () => {
    it('should be a function', () => {
      expect(Repository().findUserByUsername).toBeFunction();
    });
    it('should throw error when is invoked without arguments', () => {
      expect(o => Repository().findUserByUsername()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      expect(Repository(database).findUserByUsername({})).toBePromise();
    });
    it('should be resolved when query returns a value', () => {
      database.models.User.findOne = o => Promise.resolve({});
      expect(Repository(database).findUserByUsername({}))
        .toBePromise()
        .toResolve();
    });
    it('should be rejected when query fail', () => {
      database.models.User.findOne = o => Promise.reject(new Error('ouch!'));
      expect(Repository(database).findUserByUsername({}))
        .toBePromise()
        .toReject();
    });
  });

  describe('createUser', () => {
    it('should be a function', () => {
      expect(Repository().createUser).toBeFunction();
    });
    it('should throw error when is invoked without arguments', () => {
      expect(o => Repository().createUser()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      expect(Repository(database).createUser({})).toBePromise();
    });
    it('should be resolved when query returns a value', () => {
      database.models.User.create = o => Promise.resolve({});
      expect(Repository(database).createUser({})).toBePromise().toResolve();
    });
    it('should be rejected when query fail', () => {
      database.models.User.create = o => Promise.reject(new Error('ouch!'));
      expect(Repository(database).createUser({})).toBePromise().toReject();
    });
  });
});
