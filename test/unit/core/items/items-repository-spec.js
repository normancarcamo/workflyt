const Repository = require('src/core/items/items-repository');

describe('Repository', () => {
  let database;

  beforeEach(() => {
    database = {
      models: {
        Item: {
          findAll: options => Promise.resolve([]),
          create: data => Promise.resolve({}),
          findByPk: (id, options) => Promise.resolve({}),
          update: (values, options) => Promise.resolve([1, {}]),
          destroy: options => Promise.resolve({})
        },
        Stock: {
          findAll: options => Promise.resolve({}),
          update: options => Promise.resolve([1, {}]),
          findOne: options => Promise.resolve({}),
        },
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
        'getStocks',
        'addStocks',
        'getStock'
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
      database.models.Item.create = data => Promise.reject(
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

  describe('getStocks', () => {
    it('should be a function', () => {
      expect(Repository(database).getStocks).toBeFunction();
    });
    it('should throw error when options are not passed in', async () => {
      expect(x => Repository(database).getStocks()).toThrow();
    });
    it('should return Promise when is executed', () => {
      let options = { salesman_id: 1, options: {} };
      expect(Repository(database).getStocks(options)).toBePromise();
    });
  });

  describe('addStocks', () => {
    it('should be a function', () => {
      expect(Repository(database).addStocks).toBeFunction();
    });
    it('should throw error when options are not passed in', async () => {
      expect(x => Repository(database).addStocks()).toThrow();
    });
    it('should return Promise when is executed', () => {
      let options = { salesman_id: 1, stocks: [], options: {} };
      expect(Repository(database).addStocks(options)).toBePromise();
    });
  });

  describe('getStock', () => {
    it('should be a function', () => {
      expect(Repository(database).getStock).toBeFunction();
    });
    it('should throw error when options are not passed in', async () => {
      expect(x => Repository(database).getStock()).toThrow();
    });
    it('should return Promise when is executed', () => {
      let options = { salesman_id: 1, stock_id: 1, options: {} };
      expect(Repository(database).getStock(options)).toBePromise();
    });
  });
});
