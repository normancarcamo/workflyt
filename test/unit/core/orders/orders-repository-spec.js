const Repository = require('src/core/orders/orders-repository');

describe('Repository', () => {
  let database;

  beforeEach(() => {
    database = {
      models: {
        Order: {
          findAll: options => Promise.resolve([]),
          create: data => Promise.resolve({}),
          findByPk: (id, options) => Promise.resolve({}),
          update: (values, options) => Promise.resolve([1, {}]),
          destroy: options => Promise.resolve({})
        },
        OrderItem: {
          bulkCreate: options => Promise.resolve([]),
          update: (values, options) => Promise.resolve([1, {}]),
          destroy: options => Promise.resolve({})
        },
        OrderDepartment: {
          bulkCreate: options => Promise.resolve([]),
          update: (values, options) => Promise.resolve([1, {}]),
          destroy: options => Promise.resolve({})
        },
        OrderEmployee: {
          bulkCreate: options => Promise.resolve([]),
          update: (values, options) => Promise.resolve([1, {}]),
          destroy: options => Promise.resolve({})
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
        'getItems',
        'addItems',
        'getItem',
        'updateItem',
        'removeItem',
        'getDepartments',
        'addDepartments',
        'getDepartment',
        'updateDepartment',
        'removeDepartment',
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
      database.models.Order.create = data => Promise.reject(
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
        order: { getItems: options => Promise.resolve({}) },
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
        order_id: 1,
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
        order: { getItems: options => Promise.resolve({}) },
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

  describe('getDepartments', () => {
    it('should be a function', () => {
      expect(Repository(database).getDepartments).toBeFunction();
    });
    it('should throw error when options are not passed in', async () => {
      expect(x => Repository(database).getDepartments()).toThrow();
    });
    it('should return Promise when is executed', () => {
      let options = {
        order: { getDepartments: options => Promise.resolve({}) },
        options: {}
      };
      expect(Repository(database).getDepartments(options)).toBePromise();
    });
  });

  describe('addDepartments', () => {
    it('should be a function', () => {
      expect(Repository(database).addDepartments).toBeFunction();
    });
    it('should throw error when options are not passed in', async () => {
      expect(x => Repository(database).addDepartments()).toThrow();
    });
    it('should return Promise when is executed', () => {
      let options = {
        order_id: 1,
        departments: [ 1, 2, 3, 4, 5 ]
      };
      expect(Repository(database).addDepartments(options)).toBePromise();
    });
  });

  describe('getDepartment', () => {
    it('should be a function', () => {
      expect(Repository(database).getDepartment).toBeFunction();
    });
    it('should throw error when options are not passed in', async () => {
      expect(x => Repository(database).getDepartment()).toThrow();
    });
    it('should return Promise when is executed', () => {
      let options = {
        order: { getDepartments: options => Promise.resolve({}) },
        department_id: 1,
        options: {}
      };
      expect(Repository(database).getDepartment(options)).toBePromise();
    });
  });

  describe('updateDepartment', () => {
    it('should be a function', () => {
      expect(Repository(database).updateDepartment).toBeFunction();
    });
    it('should throw error when options are not passed in', async () => {
      expect(x => Repository(database).updateDepartment()).toThrow();
    });
    it('should return Promise when is executed', () => {
      expect(Repository(database).updateDepartment({})).toBePromise();
    });
  });

  describe('removeDepartment', () => {
    it('should be a function', () => {
      expect(Repository(database).removeDepartment).toBeFunction();
    });
    it('should throw error when options are not passed in', async () => {
      expect(x => Repository(database).removeDepartment()).toThrow();
    });
    it('should return Promise when is executed', () => {
      expect(Repository(database).removeDepartment({})).toBePromise();
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
        order: { getEmployees: options => Promise.resolve({}) },
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
        order_id: 1,
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
        order: { getEmployees: options => Promise.resolve({}) },
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
