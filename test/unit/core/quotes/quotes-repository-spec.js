const Repository = require('src/core/quotes/quotes-repository');

describe('Repository', () => {
  let database;

  beforeEach(() => {
    database = {
      models: {
        Quote: {
          findAll: options => Promise.resolve([]),
          create: data => Promise.resolve({}),
          findByPk: (id, options) => Promise.resolve({}),
          update: (values, options) => Promise.resolve([1, {}]),
          destroy: options => Promise.resolve({})
        },
        QuoteItem: {
          bulkCreate: options => Promise.resolve([]),
          update: (values, options) => Promise.resolve([1, {}]),
          destroy: options => Promise.resolve({})
        },
        Order: {
          findAll: options => Promise.resolve([]),
          findOne: (values, options) => Promise.resolve([1, {}]),
          update: options => Promise.resolve([1, {}])
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
        'updateItem',
        'removeItem',
        'getOrders',
        'addOrders',
        'getOrder'
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
      database.models.Quote.create = data => Promise.reject(
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
      let options = {
        quote: { getItems: options => Promise.resolve({}) },
        options: {}
      };
      expect(Repository(database).getItems(options)).toBePromise();
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
      let options = {
        quote_id: 1,
        items: [ 1, 2, 3, 4, 5 ]
      };
      expect(Repository(database).addItems(options)).toBePromise();
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
      let options = {
        quote: { getItems: options => Promise.resolve({}) },
        item_id: 1,
        options: {}
      };
      expect(Repository(database).getItem(options)).toBePromise();
    });
  });

  describe('updateItem', () => {
    it('should be a function', () => {
      expect(Repository(database).updateItem).toBeFunction();
    });
    it('should throw error when options are not passed in', async () => {
      expect(x => Repository(database).updateItem()).toThrow();
    });
    it('should return Promise when is executed', () => {
      expect(Repository(database).updateItem({})).toBePromise();
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

  describe('getOrders', () => {
    it('should be a function', () => {
      expect(Repository(database).getOrders).toBeFunction();
    });
    it('should throw error when options are not passed in', async () => {
      expect(x => Repository(database).getOrders()).toThrow();
    });
    it('should return Promise when is executed', () => {
      let options = {
        quote: { getOrders: options => Promise.resolve({}) },
        options: {}
      };
      expect(Repository(database).getOrders(options)).toBePromise();
    });
  });

  describe('addOrders', () => {
    it('should be a function', () => {
      expect(Repository(database).addOrders).toBeFunction();
    });
    it('should throw error when options are not passed in', async () => {
      expect(x => Repository(database).addOrders()).toThrow();
    });
    it('should return Promise when is executed', () => {
      let options = {
        quote_id: 1,
        orders: [ 1, 2, 3, 4, 5 ]
      };
      expect(Repository(database).addOrders(options)).toBePromise();
    });
  });

  describe('getOrder', () => {
    it('should be a function', () => {
      expect(Repository(database).getOrder).toBeFunction();
    });
    it('should throw error when options are not passed in', async () => {
      expect(x => Repository(database).getOrder()).toThrow();
    });
    it('should return Promise when is executed', () => {
      let options = {
        quote: { getOrders: options => Promise.resolve({}) },
        order_id: 1,
        options: {}
      };
      expect(Repository(database).getOrder(options)).toBePromise();
    });
  });
});
