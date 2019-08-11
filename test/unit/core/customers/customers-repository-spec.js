const Repository = require('src/core/customers/customers-repository');

describe('Repository', () => {
  let database;

  beforeEach(() => {
    database = {
      models: {
        Customer: {
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
        Quote: {
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
        'getQuotes',
        'addQuotes',
        'getQuote'
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
      database.models.Customer.create = data => Promise.reject(
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

  describe('getQuotes', () => {
    it('should be a function', () => {
      expect(Repository(database).getQuotes).toBeFunction();
    });
    it('should throw error when options are not passed in', async () => {
      expect(x => Repository(database).getQuotes()).toThrow();
    });
    it('should return Promise when is executed', () => {
      expect(Repository(database).getQuotes({})).toBePromise();
    });
  });

  describe('addQuotes', () => {
    it('should be a function', () => {
      expect(Repository(database).addQuotes).toBeFunction();
    });
    it('should throw error when options are not passed in', async () => {
      expect(x => Repository(database).addQuotes()).toThrow();
    });
    it('should return Promise when is executed', () => {
      expect(Repository(database).addQuotes({ quotes: [] })).toBePromise();
    });
  });

  describe('getQuote', () => {
    it('should be a function', () => {
      expect(Repository(database).getQuote).toBeFunction();
    });
    it('should throw error when options are not passed in', async () => {
      expect(x => Repository(database).getQuote()).toThrow();
    });
    it('should return Promise when is executed', () => {
      expect(Repository(database).getQuote({})).toBePromise();
    });
  });
});
