const Repository = require('src/core/employees/employees-repository');

describe('Repository', () => {
  let database;

  beforeEach(() => {
    database = {
      models: {
        Employee: {
          findAll: options => Promise.resolve([]),
          create: data => Promise.resolve({}),
          findByPk: (id, options) => Promise.resolve({}),
          update: (values, options) => Promise.resolve([1, {}]),
          destroy: options => Promise.resolve({})
        },
        User: {
          findOne: options => Promise.resolve({}),
          update: options => Promise.resolve([1, {}])
        },
        Quote: {
          findAll: options => Promise.resolve({}),
          update: options => Promise.resolve([1, {}]),
          findOne: options => Promise.resolve({}),
        },
        EmployeeSupervisor: {
          bulkCreate: supervisors => Promise.resolve([ ...supervisors ]),
          update: (values, options) => Promise.resolve([1, {}]),
          destroy: options => Promise.resolve({}),
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
        'getUser',
        'setUser',
        'removeUser',
        'getQuotes',
        'addQuotes',
        'getQuote',
        'getSupervisors',
        'addSupervisors',
        'getSupervisor',
        'updateSupervisor',
        'removeSupervisor'
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
      database.models.Employee.create = data => Promise.reject(
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

  describe('getUser', () => {
    it('should be a function', () => {
      expect(Repository(database).getUser).toBeFunction();
    });
    it('should throw error when options are not passed in', async () => {
      expect(x => Repository(database).getUser()).toThrow();
    });
    it('should return Promise when is executed', () => {
      let options1 = { employee_id: 1, user_id: 2, options: {} };
      let options2 = { employee_id: 1, options: {} };
      expect(Repository(database).getUser(options1)).toBePromise();
      expect(Repository(database).getUser(options2)).toBePromise();
    });
  });

  describe('setUser', () => {
    it('should be a function', () => {
      expect(Repository(database).setUser).toBeFunction();
    });
    it('should throw error when options are not passed in', async () => {
      expect(x => Repository(database).setUser()).toThrow();
    });
    it('should return Promise when is executed', () => {
      let options = { employee_id: 1, user_id: 2, options: {} };
      expect(Repository(database).setUser(options)).toBePromise();
    });
  });

  describe('removeUser', () => {
    it('should be a function', () => {
      expect(Repository(database).removeUser).toBeFunction();
    });
    it('should throw error when options are not passed in', async () => {
      expect(x => Repository(database).removeUser()).toThrow();
    });
    it('should return Promise when is executed', () => {
      let options = { employee_id: 1, options: {} };
      expect(Repository(database).removeUser(options)).toBePromise();
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
      let options = { salesman_id: 1, options: {} };
      expect(Repository(database).getQuotes(options)).toBePromise();
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
      let options = { salesman_id: 1, quotes: [], options: {} };
      expect(Repository(database).addQuotes(options)).toBePromise();
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
      let options = { salesman_id: 1, quote_id: 1, options: {} };
      expect(Repository(database).getQuote(options)).toBePromise();
    });
  });

  describe('getSupervisors', () => {
    it('should be a function', () => {
      expect(Repository(database).getSupervisors).toBeFunction();
    });
    it('should throw error when options are not passed in', async () => {
      expect(x => Repository(database).getSupervisors()).toThrow();
    });
    it('should return Promise when is executed', () => {
      let options = {
        employee: { getSupervisors: options => Promise.resolve({}) },
        options: {}
      };
      expect(Repository(database).getSupervisors(options)).toBePromise();
    });
  });

  describe('addSupervisors', () => {
    it('should be a function', () => {
      expect(Repository(database).addSupervisors).toBeFunction();
    });
    it('should throw error when options are not passed in', async () => {
      expect(x => Repository(database).addSupervisors()).toThrow();
    });
    it('should return Promise when is executed', () => {
      let options = {
        employee_id: 1,
        supervisors: [ 1, 2, 3, 4, 5 ]
      };
      expect(Repository(database).addSupervisors(options)).toBePromise();
    });
  });

  describe('getSupervisor', () => {
    it('should be a function', () => {
      expect(Repository(database).getSupervisor).toBeFunction();
    });
    it('should throw error when options are not passed in', async () => {
      expect(x => Repository(database).getSupervisor()).toThrow();
    });
    it('should return Promise when is executed', () => {
      let options = {
        employee: { getSupervisors: options => Promise.resolve({}) },
        supervisor_id: 1,
        options: {}
      };
      expect(Repository(database).getSupervisor(options)).toBePromise();
    });
  });

  describe('updateSupervisor', () => {
    it('should be a function', () => {
      expect(Repository(database).updateSupervisor).toBeFunction();
    });
    it('should throw error when options are not passed in', async () => {
      expect(x => Repository(database).updateSupervisor()).toThrow();
    });
    it('should return Promise when is executed', () => {
      expect(Repository(database).updateSupervisor({})).toBePromise();
    });
  });

  describe('removeSupervisor', () => {
    it('should be a function', () => {
      expect(Repository(database).removeSupervisor).toBeFunction();
    });
    it('should throw error when options are not passed in', async () => {
      expect(x => Repository(database).removeSupervisor()).toThrow();
    });
    it('should return Promise when is executed', () => {
      expect(Repository(database).removeSupervisor({})).toBePromise();
    });
  });
});
