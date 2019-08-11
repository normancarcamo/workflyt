const Repository = require('src/core/supervisors/supervisors-repository');

describe('Repository', () => {
  let database;

  beforeEach(() => {
    database = {
      models: {
        Employee: {
          findAll: options => Promise.resolve([]),
          findOne: (id, options) => Promise.resolve({}),
          getEmployees: options => Promise.resolve([])
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
      .toContainAllKeys([ 'findAll', 'findByPk', 'getEmployees' ]);
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

  describe('getEmployees', () => {
    it('should be a function', () => {
      expect(Repository(database).getEmployees).toBeFunction();
    });
    it('should throw error when options are not passed in', async () => {
      expect(x => Repository(database).getEmployees()).toThrow();
    });
    it('should return Promise when is executed', () => {
      let options = {
        supervisor: { getEmployees: options => Promise.resolve([]) },
        options: {}
      };
      expect(Repository(database).getEmployees(options)).toBePromise();
    });
  });
});
