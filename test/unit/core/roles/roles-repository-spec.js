const Repository = require('src/core/roles/roles-repository');

describe('Repository', () => {
  let database;

  beforeEach(() => {
    database = {
      models: {
        Role: {
          findAll: options => Promise.resolve([]),
          create: data => Promise.resolve({}),
          findByPk: (id, options) => Promise.resolve({}),
          update: (values, options) => Promise.resolve([1, {}]),
          destroy: options => Promise.resolve({})
        },
        RolePermission: {
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
        'findByPk',
        'update',
        'destroy',
        'getPermissions',
        'addPermissions',
        'getPermission',
        'updatePermission',
        'removePermission'
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
      database.models.Role.create = data => Promise.reject(
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

  describe('getPermissions', () => {
    it('should be a function', () => {
      expect(Repository(database).getPermissions).toBeFunction();
    });
    it('should throw error when options are not passed in', async () => {
      expect(x => Repository(database).getPermissions()).toThrow();
    });
    it('should return Promise when is executed', () => {
      let options = {
        role: { getPermissions: options => Promise.resolve({}) },
        options: {}
      };
      expect(Repository(database).getPermissions(options)).toBePromise();
    });
  });

  describe('addPermissions', () => {
    it('should be a function', () => {
      expect(Repository(database).addPermissions).toBeFunction();
    });
    it('should throw error when options are not passed in', async () => {
      expect(x => Repository(database).addPermissions()).toThrow();
    });
    it('should return Promise when is executed', () => {
      let options = {
        role_id: 1,
        permissions: [ 1, 2, 3, 4, 5 ]
      };
      expect(Repository(database).addPermissions(options)).toBePromise();
    });
  });

  describe('getPermission', () => {
    it('should be a function', () => {
      expect(Repository(database).getPermission).toBeFunction();
    });
    it('should throw error when options are not passed in', async () => {
      expect(x => Repository(database).getPermission()).toThrow();
    });
    it('should return Promise when is executed', () => {
      let options = {
        role: { getPermissions: options => Promise.resolve({}) },
        permission_id: 1,
        options: {}
      };
      expect(Repository(database).getPermission(options)).toBePromise();
    });
  });

  describe('updatePermission', () => {
    it('should be a function', () => {
      expect(Repository(database).updatePermission).toBeFunction();
    });
    it('should throw error when options are not passed in', async () => {
      expect(x => Repository(database).updatePermission()).toThrow();
    });
    it('should return Promise when is executed', () => {
      expect(Repository(database).updatePermission({})).toBePromise();
    });
  });

  describe('removePermission', () => {
    it('should be a function', () => {
      expect(Repository(database).removePermission).toBeFunction();
    });
    it('should throw error when options are not passed in', async () => {
      expect(x => Repository(database).removePermission()).toThrow();
    });
    it('should return Promise when is executed', () => {
      expect(Repository(database).removePermission({})).toBePromise();
    });
  });
});
