const Repository = require('src/core/departments/departments-repository');

describe('Repository', () => {
  let database;

  beforeEach(() => {
    database = {
      models: {
        Department: {
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
        Employee: {
          findAll: options => {
            return Promise.resolve([]);
          },
          findOne: options => {
            return Promise.resolve([]);
          },
          update: (values, options) => {
            return Promise.resolve({});
          }
        },
        DepartmentEmployee: {
          bulkCreate: employees => Promise.resolve([ ...employees ]),
          update: (values, options) => Promise.resolve({}),
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
        'getEmployees',
        'addEmployees',
        'getEmployee',
        'updateEmployee',
        'removeEmployee'
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
      database.models.Department.create = data => Promise.reject(
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

  describe('getEmployees', () => {
    it('should be a function', () => {
      expect(Repository(database).getEmployees).toBeFunction();
    });
    it('should throw error when options are not passed in', async () => {
      expect(x => Repository(database).getEmployees()).toThrow();
    });
    it('should return Promise when is executed', () => {
      let options = {
        department: { getEmployees: options => Promise.resolve({}) },
        options: {}
      };
      expect(Repository(database).getEmployees(options)).toBePromise();
    });
  });

  describe('addEmployees', () => {
    it('should be a function', () => {
      expect(Repository(database).addEmployees).toBeFunction();
    });
    it('should throw error when options are not passed in', async () => {
      expect(x => Repository(database).addEmployees()).toThrow();
    });
    it('should return Promise when is executed', () => {
      let options = {
        department_id: 1,
        employees: [ 1, 2, 3, 4, 5 ]
      };
      expect(Repository(database).addEmployees(options)).toBePromise();
    });
  });

  describe('getEmployee', () => {
    it('should be a function', () => {
      expect(Repository(database).getEmployee).toBeFunction();
    });
    it('should throw error when options are not passed in', async () => {
      expect(x => Repository(database).getEmployee()).toThrow();
    });
    it('should return Promise when is executed', () => {
      let options = {
        department: { getEmployees: options => Promise.resolve({}) },
        employee_id: 1,
        options: {}
      };
      expect(Repository(database).getEmployee(options)).toBePromise();
    });
  });

  describe('updateEmployee', () => {
    it('should be a function', () => {
      expect(Repository(database).updateEmployee).toBeFunction();
    });
    it('should throw error when options are not passed in', async () => {
      expect(x => Repository(database).updateEmployee()).toThrow();
    });
    it('should return Promise when is executed', () => {
      expect(Repository(database).updateEmployee({})).toBePromise();
    });
  });

  describe('removeEmployee', () => {
    it('should be a function', () => {
      expect(Repository(database).removeEmployee).toBeFunction();
    });
    it('should throw error when options are not passed in', async () => {
      expect(x => Repository(database).removeEmployee()).toThrow();
    });
    it('should return Promise when is executed', () => {
      expect(Repository(database).removeEmployee({})).toBePromise();
    });
  });
});
