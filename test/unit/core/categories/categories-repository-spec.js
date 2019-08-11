const Repository = require('src/core/categories/categories-repository');

describe('Repository', () => {
  let database;

  beforeEach(() => {
    database = {
      models: {
        Category: {
          findAll: options => {
            return Promise.resolve([]);
          },
          create: data => {
            return Promise.resolve({});
          },
          findByPk: (id, options) => {
            return Promise.resolve({});
          },
          update: (values, options) => {
            return Promise.resolve({});
          },
          destroy: (options) => {
            return Promise.resolve({});
          }
        },
        Item: {
          findAll: options => {
            return Promise.resolve([]);
          },
          findOne: options => {
            return Promise.resolve([]);
          },
          update: (values, options) => {
            return Promise.resolve({});
          }
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
        'getItems',
        'addItems',
        'getItem',
        'removeItem'
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
      database.models.Category.create = data => Promise.reject(
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

  describe('getItems', () => {
    it('should be a function', () => {
      expect(Repository(database).getItems).toBeFunction();
    });
    it('should throw error when options are not passed in', async () => {
      expect(x => Repository(database).getItems()).toThrow();
    });
    it('should return Promise when is executed', () => {
      expect(Repository(database).getItems({})).toBePromise();
    });
  });

  describe('addItems', () => {
    it('should be a function', () => {
      expect(Repository(database).addItems).toBeFunction();
    });
    it('should throw error when options are not passed in', async () => {
      expect(x => Repository(database).addItems()).toThrow();
    });
    it('should return Promise when is executed', () => {
      expect(Repository(database).addItems({})).toBePromise();
    });
  });

  describe('getItem', () => {
    it('should be a function', () => {
      expect(Repository(database).getItem).toBeFunction();
    });
    it('should throw error when options are not passed in', async () => {
      expect(x => Repository(database).getItem()).toThrow();
    });
    it('should return Promise when is executed', () => {
      expect(Repository(database).getItem({})).toBePromise();
    });
  });

  describe('removeItem', () => {
    it('should be a function', () => {
      expect(Repository(database).removeItem).toBeFunction();
    });
    it('should throw error when options are not passed in', async () => {
      expect(x => Repository(database).removeItem()).toThrow();
    });
    it('should return Promise when is executed', () => {
      expect(Repository(database).removeItem({})).toBePromise();
    });
  });

});
