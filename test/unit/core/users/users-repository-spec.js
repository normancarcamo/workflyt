const Repository = require('src/core/users/users-repository');

describe('Repository', () => {
  let database;

  beforeEach(() => {
    database = {
      models: {
        User: {
          findAll: options => Promise.resolve([]),
          create: data => Promise.resolve({}),
          findOne: (id, options) => Promise.resolve({}),
          findByPk: (id, options) => Promise.resolve({}),
          update: (values, options) => Promise.resolve([1, {}]),
          destroy: options => Promise.resolve({})
        },
        UserRole: {
          bulkCreate: options => Promise.resolve([]),
          update: (values, options) => Promise.resolve([1, {}]),
          destroy: options => Promise.resolve({})
        }
      },
      queryBuilder: options => ({ ...options }),
      Sequelize: { Op: { in: Symbol('in') } }
    };
  });

  it('should module be a factory function', () => {
    expect(Repository).toBeFunction();
  });

  it('should return an object when function is invoked', () => {
    expect(Repository({}))
      .toBeObject()
      .not.toBeEmpty()
      .toContainAllKeys([
        'findAll',
        'create',
        'findByUsername',
        'findByPk',
        'update',
        'destroy',
        'getRoles',
        'addRoles',
        'getRole',
        'updateRole',
        'removeRole'
      ]);
  });

  describe('findAll', () => {
    it('should be a function', () => {
      expect(Repository(database).findAll).toBeFunction();
    });
    it('should return Promise when is executed', () => {
      expect(Repository(database).findAll()).toBePromise();
      expect(Repository(database).findAll({})).toBePromise();
    });
  });

  describe('create', () => {
    it('should be a function', () => {
      expect(Repository(database).create).toBeFunction();
    });
    it('should promise be rejected when options are not passed in', async () => {
      database.models.User.create = data => Promise.reject(
        new Error('error mocked.')
      );
      expect(Repository(database).create()).toBePromise().toReject();
    });
    it('should return Promise when is executed', () => {
      expect(Repository(database).create({})).toBePromise();
    });
  });

  describe('findByPk', () => {
    it('should be a function', () => {
      expect(Repository(database).findByPk).toBeFunction();
    });
    it('should throw error when options are not passed in', async () => {
      expect(x => Repository(database).findByPk()).toThrow();
    });
    it('should return Promise when is executed', () => {
      expect(Repository(database).findByPk({})).toBePromise();
    });
  });

  describe('findByUsername', () => {
    it('should be a function', () => {
      expect(Repository(database).findByUsername).toBeFunction();
    });
    it('should throw error when options are not passed in', async () => {
      expect(x => Repository(database).findByUsername()).toThrow();
    });
    it('should return Promise when is executed', () => {
      expect(Repository(database).findByUsername({})).toBePromise();
    });
  });

  describe('update', () => {
    it('should be a function', () => {
      expect(Repository(database).update).toBeFunction();
    });
    it('should throw error when options are not passed in', async () => {
      expect(x => Repository(database).update()).toThrow();
    });
    it('should return Promise when is executed', () => {
      expect(Repository(database).update({})).toBePromise();
    });
  });

  describe('destroy', () => {
    it('should be a function', () => {
      expect(Repository(database).destroy).toBeFunction();
    });
    it('should throw error when options are not passed in', async () => {
      expect(x => Repository(database).destroy()).toThrow();
    });
    it('should return Promise when is executed', () => {
      expect(Repository(database).destroy({})).toBePromise();
    });
  });

  describe('getRoles', () => {
    it('should be a function', () => {
      expect(Repository(database).getRoles).toBeFunction();
    });
    it('should throw error when options are not passed in', async () => {
      expect(x => Repository(database).getRoles()).toThrow();
    });
    it('should return Promise when is executed', () => {
      let options = {
        user: { getRoles: options => Promise.resolve({}) },
        options: {}
      };
      expect(Repository(database).getRoles(options)).toBePromise();
    });
  });

  describe('addRoles', () => {
    it('should be a function', () => {
      expect(Repository(database).addRoles).toBeFunction();
    });
    it('should throw error when options are not passed in', async () => {
      expect(x => Repository(database).addRoles()).toThrow();
    });
    it('should return Promise when is executed', () => {
      let options = {
        user_id: 1,
        roles: [ 1, 2, 3, 4, 5 ]
      };
      expect(Repository(database).addRoles(options)).toBePromise();
    });
  });

  describe('getRole', () => {
    it('should be a function', () => {
      expect(Repository(database).getRole).toBeFunction();
    });
    it('should throw error when options are not passed in', async () => {
      expect(x => Repository(database).getRole()).toThrow();
    });
    it('should return Promise when is executed', () => {
      let options = {
        user: { getRoles: options => Promise.resolve({}) },
        role_id: 1,
        options: {}
      };
      expect(Repository(database).getRole(options)).toBePromise();
    });
  });

  describe('updateRole', () => {
    it('should be a function', () => {
      expect(Repository(database).updateRole).toBeFunction();
    });
    it('should throw error when options are not passed in', async () => {
      expect(x => Repository(database).updateRole()).toThrow();
    });
    it('should return Promise when is executed', () => {
      expect(Repository(database).updateRole({})).toBePromise();
    });
  });

  describe('removeRole', () => {
    it('should be a function', () => {
      expect(Repository(database).removeRole).toBeFunction();
    });
    it('should throw error when options are not passed in', async () => {
      expect(x => Repository(database).removeRole()).toThrow();
    });
    it('should return Promise when is executed', () => {
      expect(Repository(database).removeRole({})).toBePromise();
    });
  });
});
