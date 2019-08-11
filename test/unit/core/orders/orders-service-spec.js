const Service = require('src/core/orders/orders-service');

describe('Service', () => {
  let service;
  let validator;
  let repository;

  beforeEach(() => {
    validator = {};

    repository = {
      findAll: options => Promise.resolve({}),
      create: data => Promise.resolve({}),
      findByPk: options => Promise.resolve({}),
      update: options => Promise.resolve({}),
      destroy: options => Promise.resolve({}),
      getItems: options => Promise.resolve({}),
      addItems: options => Promise.resolve([]),
      getItem: options => Promise.resolve({}),
      updateItem: options => Promise.resolve({}),
      removeItem: options => Promise.resolve({}),
      getDepartments: options => Promise.resolve({}),
      addDepartments: options => Promise.resolve([]),
      getDepartment: options => Promise.resolve({}),
      updateDepartment: options => Promise.resolve({}),
      removeDepartment: options => Promise.resolve({}),
      getEmployees: options => Promise.resolve({}),
      addEmployees: options => Promise.resolve([]),
      getEmployee: options => Promise.resolve({}),
      updateEmployee: options => Promise.resolve({}),
      removeEmployee: options => Promise.resolve({})
    };

    service = Service({ repository, validator });
  });

  it('should module be a factory function', () => {
    expect(Service).toBeFunction();
  });

  it('should return an object when function is invoked', () => {
    expect(Service({})).toBeObject().not.toBeEmpty().toContainAllKeys([
      'getOrders',
      'createOrders',
      'getOrder',
      'updateOrder',
      'deleteOrder',
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

  describe('getOrders', () => {
    it('should be a function', () => {
      expect(service.getOrders).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().getOrders()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = {
        token: {
          permissions: []
        }
      };
      expect(service.getOrders(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = {
        token: {
          permissions: ['']
        }
      };
      expect(service.getOrders(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['get orders']
        },
        query: {}
      };

      // When:
      let result = await service.getOrders(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when action fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['get orders']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.getOrders = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.findAll = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.getOrders(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when orders are filtered', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['get orders']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.getOrders = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.findAll = options => {
        return Promise.resolve({});
      };

      // When:
      let result = await service.getOrders(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('createOrders', () => {
    it('should be a function', () => {
      expect(service.createOrders).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().createOrders()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = {
        token: {
          permissions: []
        }
      };
      expect(service.createOrders(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = {
        token: {
          permissions: ['']
        }
      };
      expect(service.createOrders(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['create orders']
        },
        query: {}
      };

      // When:
      let result = await service.createOrders(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when action fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['create orders']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.createOrders = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.create = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.createOrders(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when order is created', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['create orders']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.createOrders = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.create = options => {
        return Promise.resolve({});
      };

      // When:
      let result = await service.createOrders(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('getOrder', () => {
    it('should be a function', () => {
      expect(service.getOrder).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().getOrder()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = {
        token: {
          permissions: []
        }
      };
      expect(service.getOrder(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = {
        token: {
          permissions: ['']
        }
      };
      expect(service.getOrder(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['get order']
        },
        query: {}
      };

      // When:
      let result = await service.getOrder(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when action fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['get order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1 }
      };

      validator.getOrder = {
        validate: () => Promise.resolve({
          query: {},
          params: { order: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.getOrder(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when order is not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1 }
      };

      validator.getOrder = {
        validate: () => Promise.resolve({
          query: {},
          params: { order: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.getOrder(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when orders is found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1 }
      };

      validator.getOrder = {
        validate: () => Promise.resolve({
          query: {},
          params: { order: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      // When:
      let result = await service.getOrder(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('updateOrder', () => {
    it('should be a function', () => {
      expect(service.updateOrder).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().updateOrder()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.updateOrder(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.updateOrder(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = { token: { permissions: ['update order'] }, query: {} };

      // When:
      let result = await service.updateOrder(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when order search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['update order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1 }
      };

      validator.updateOrder = {
        validate: () => Promise.resolve({
          params: { order: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.updateOrder(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when order was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['update order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1 }
      };

      validator.updateOrder = {
        validate: () => Promise.resolve({
          params: { order: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.updateOrder(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when order update action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['update order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1 }
      };

      validator.updateOrder = {
        validate: () => Promise.resolve({
          params: { order: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.update = options => {
        return Promise.reject(new Error('error mocked.'));
      }

      // When:
      let result = await service.updateOrder(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when order is updated', async () => {
      // Given:
      let request = {
        token: { permissions: ['update order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1 }
      };

      validator.updateOrder = {
        validate: () => Promise.resolve({
          params: { order: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.update = options => {
        return Promise.resolve({});
      }

      // When:
      let result = await service.updateOrder(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('deleteOrder', () => {
    it('should be a function', () => {
      expect(service.deleteOrder).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().deleteOrder()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.deleteOrder(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.deleteOrder(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = { token: { permissions: ['delete order'] }, query: {} };
      validator.deleteOrder = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'))
        }
      };

      // When:
      let result = await service.deleteOrder(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when order search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1 }
      };

      validator.deleteOrder = {
        validate: () => Promise.resolve({
          params: { order: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.deleteOrder(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when order was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1 }
      };

      validator.deleteOrder = {
        validate: () => Promise.resolve({
          params: { order: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.deleteOrder(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when order destroy action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1 }
      };

      validator.deleteOrder = {
        validate: () => Promise.resolve({
          params: { order: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.destroy = options => {
        return Promise.reject(new Error('error mocked.'));
      }

      // When:
      let result = await service.deleteOrder(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when order is deleted', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1 }
      };

      validator.deleteOrder = {
        validate: () => Promise.resolve({
          params: { order: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.destroy = options => {
        return Promise.resolve({});
      }

      // When:
      let result = await service.deleteOrder(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('getItems', () => {
    it('should be a function', () => {
      expect(service.getItems).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().getItems()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.getItems(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.getItems(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['get items from order'] },
        query: {}
      };

      validator.getItems = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'));
        }
      };

      // When:
      let result = await service.getItems(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'get items from order' ] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1 }
      };

      validator.getItems = {
        validate: () => Promise.resolve({
          params: { order: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.getItems(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when order was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get items from order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1 }
      };

      validator.getItems = {
        validate: () => Promise.resolve({
          params: { order: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.getItems(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when getItems action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['get items from order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1 }
      };

      validator.getItems = {
        validate: () => Promise.resolve({
          params: { order: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.getItems = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.getItems(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when items are filtered', async () => {
      // Given:
      let request = {
        token: { permissions: ['get items from order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1 }
      };

      validator.getItems = {
        validate: () => Promise.resolve({
          params: { order: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.getItems = options => {
        return Promise.resolve([]);
      }

      // When:
      let result = await service.getItems(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('addItems', () => {
    it('should be a function', () => {
      expect(service.addItems).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().addItems()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.addItems(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.addItems(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['add items to order'] },
        query: {}
      };

      validator.addItems = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'));
        }
      };

      // When:
      let result = await service.addItems(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'add items to order' ] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1 }
      };

      validator.addItems = {
        validate: () => Promise.resolve({
          params: { order: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.addItems(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when order was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['add items to order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1 }
      };

      validator.addItems = {
        validate: () => Promise.resolve({
          params: { order: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.addItems(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when addItems action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['add items to order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1 },
        body: { items: [] }
      };

      validator.addItems = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.addItems = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.addItems(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when items are added', async () => {
      // Given:
      let request = {
        token: { permissions: ['add items to order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1 },
        body: { items: [] }
      };

      validator.addItems = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.addItems = options => {
        return Promise.resolve([]);
      }

      // When:
      let result = await service.addItems(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('getItem', () => {
    it('should be a function', () => {
      expect(service.getItem).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().getItem()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.getItem(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.getItem(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['get item from order'] },
        query: {}
      };

      validator.getItem = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'));
        }
      };

      // When:
      let result = await service.getItem(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'get item from order' ] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1, item: 2 }
      };

      validator.getItem = {
        validate: () => Promise.resolve({
          params: { order: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.getItem(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when order was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get item from order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1, item: 2 }
      };

      validator.getItem = {
        validate: () => Promise.resolve({
          params: { order: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.getItem(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when getItem action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['get item from order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1, item: 2 }
      };

      validator.getItem = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.getItem = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.getItem(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when item was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get item from order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1, item: 2 }
      };

      validator.getItem = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.getItem = options => {
        return Promise.resolve(null);
      }

      // When:
      let result = await service.getItem(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when items is found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get item from order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1 },
        body: { items: [] }
      };

      validator.getItem = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.getItem = options => {
        return Promise.resolve({});
      }

      // When:
      let result = await service.getItem(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('updateItem', () => {
    it('should be a function', () => {
      expect(service.updateItem).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().updateItem()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.updateItem(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.updateItem(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['update item from order'] },
        query: {}
      };

      validator.updateItem = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'));
        }
      };

      // When:
      let result = await service.updateItem(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when order search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'update item from order' ] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1, item: 2 }
      };

      validator.updateItem = {
        validate: () => Promise.resolve({
          params: { order: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.updateItem(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when order was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['update item from order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1, item: 2 }
      };

      validator.updateItem = {
        validate: () => Promise.resolve({
          params: { order: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.updateItem(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when getItem action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['update item from order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1, item: 2 }
      };

      validator.updateItem = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getItem = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.updateItem(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when item was not found', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'update item from order' ] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1, item: 2 }
      };

      validator.updateItem = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getItem = options => Promise.resolve(null);

      // When:
      let result = await service.updateItem(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when items update action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['update item from order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1 },
        body: { items: [] }
      };

      validator.updateItem = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getItem = options => Promise.resolve({});
      repository.updateItem = options => Promise.reject(new Error('error mocked.'));

      // When:
      let result = await service.updateItem(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when items is found', async () => {
      // Given:
      let request = {
        token: { permissions: ['update item from order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1 },
        body: { items: [] }
      };

      validator.updateItem = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getItem = options => Promise.resolve({});
      repository.updateItem = options => Promise.resolve({});

      // When:
      let result = await service.updateItem(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('removeItem', () => {
    it('should be a function', () => {
      expect(service.removeItem).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().removeItem()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.removeItem(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.removeItem(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['remove item from order'] },
        query: {}
      };

      validator.removeItem = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'));
        }
      };

      // When:
      let result = await service.removeItem(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when order search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'remove item from order' ] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1, item: 2 }
      };

      validator.removeItem = {
        validate: () => Promise.resolve({
          params: { order: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.removeItem(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when order was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['remove item from order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1, item: 2 }
      };

      validator.removeItem = {
        validate: () => Promise.resolve({
          params: { order: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.removeItem(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when getItem action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['remove item from order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1, item: 2 }
      };

      validator.removeItem = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getItem = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.removeItem(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when item was not found', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'remove item from order' ] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1, item: 2 }
      };

      validator.removeItem = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getItem = options => Promise.resolve(null);

      // When:
      let result = await service.removeItem(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when items remove action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['remove item from order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1 }
      };

      validator.removeItem = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getItem = options => Promise.resolve({});
      repository.removeItem = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.removeItem(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when items is found', async () => {
      // Given:
      let request = {
        token: { permissions: ['remove item from order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1 }
      };

      validator.removeItem = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getItem = options => Promise.resolve({});
      repository.removeItem = options => Promise.resolve({});

      // When:
      let result = await service.removeItem(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('getDepartments', () => {
    it('should be a function', () => {
      expect(service.getDepartments).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().getDepartments()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.getDepartments(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.getDepartments(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['get departments from order'] },
        query: {}
      };

      validator.getDepartments = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'));
        }
      };

      // When:
      let result = await service.getDepartments(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'get departments from order' ] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1 }
      };

      validator.getDepartments = {
        validate: () => Promise.resolve({
          params: { order: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.getDepartments(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when order was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get departments from order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1 }
      };

      validator.getDepartments = {
        validate: () => Promise.resolve({
          params: { order: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.getDepartments(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when getDepartments action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['get departments from order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1 }
      };

      validator.getDepartments = {
        validate: () => Promise.resolve({
          params: { order: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.getDepartments = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.getDepartments(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when departments are filtered', async () => {
      // Given:
      let request = {
        token: { permissions: ['get departments from order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1 }
      };

      validator.getDepartments = {
        validate: () => Promise.resolve({
          params: { order: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.getDepartments = options => {
        return Promise.resolve([]);
      }

      // When:
      let result = await service.getDepartments(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('addDepartments', () => {
    it('should be a function', () => {
      expect(service.addDepartments).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().addDepartments()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.addDepartments(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.addDepartments(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['add departments to order'] },
        query: {}
      };

      validator.addDepartments = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'));
        }
      };

      // When:
      let result = await service.addDepartments(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'add departments to order' ] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1 }
      };

      validator.addDepartments = {
        validate: () => Promise.resolve({
          params: { order: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.addDepartments(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when order was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['add departments to order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1 }
      };

      validator.addDepartments = {
        validate: () => Promise.resolve({
          params: { order: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.addDepartments(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when addDepartments action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['add departments to order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1 },
        body: { departments: [] }
      };

      validator.addDepartments = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.addDepartments = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.addDepartments(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when departments are added', async () => {
      // Given:
      let request = {
        token: { permissions: ['add departments to order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1 },
        body: { departments: [] }
      };

      validator.addDepartments = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.addDepartments = options => {
        return Promise.resolve([]);
      }

      // When:
      let result = await service.addDepartments(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('getDepartment', () => {
    it('should be a function', () => {
      expect(service.getDepartment).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().getDepartment()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.getDepartment(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.getDepartment(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['get department from order'] },
        query: {}
      };

      validator.getDepartment = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'));
        }
      };

      // When:
      let result = await service.getDepartment(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'get department from order' ] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1, department: 2 }
      };

      validator.getDepartment = {
        validate: () => Promise.resolve({
          params: { order: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.getDepartment(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when order was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get department from order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1, department: 2 }
      };

      validator.getDepartment = {
        validate: () => Promise.resolve({
          params: { order: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.getDepartment(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when getDepartment action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['get department from order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1, department: 2 }
      };

      validator.getDepartment = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.getDepartment = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.getDepartment(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when department was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get department from order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1, department: 2 }
      };

      validator.getDepartment = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.getDepartment = options => {
        return Promise.resolve(null);
      }

      // When:
      let result = await service.getDepartment(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when departments is found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get department from order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1 },
        body: { departments: [] }
      };

      validator.getDepartment = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.getDepartment = options => {
        return Promise.resolve({});
      }

      // When:
      let result = await service.getDepartment(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('updateDepartment', () => {
    it('should be a function', () => {
      expect(service.updateDepartment).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().updateDepartment()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.updateDepartment(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.updateDepartment(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['update department from order'] },
        query: {}
      };

      validator.updateDepartment = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'));
        }
      };

      // When:
      let result = await service.updateDepartment(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when order search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'update department from order' ] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1, department: 2 }
      };

      validator.updateDepartment = {
        validate: () => Promise.resolve({
          params: { order: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.updateDepartment(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when order was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['update department from order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1, department: 2 }
      };

      validator.updateDepartment = {
        validate: () => Promise.resolve({
          params: { order: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.updateDepartment(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when getDepartment action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['update department from order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1, department: 2 }
      };

      validator.updateDepartment = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getDepartment = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.updateDepartment(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when department was not found', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'update department from order' ] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1, department: 2 }
      };

      validator.updateDepartment = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getDepartment = options => Promise.resolve(null);

      // When:
      let result = await service.updateDepartment(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when departments update action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['update department from order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1 },
        body: { departments: [] }
      };

      validator.updateDepartment = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getDepartment = options => Promise.resolve({});
      repository.updateDepartment = options => Promise.reject(new Error('error mocked.'));

      // When:
      let result = await service.updateDepartment(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when departments is found', async () => {
      // Given:
      let request = {
        token: { permissions: ['update department from order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1 },
        body: { departments: [] }
      };

      validator.updateDepartment = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getDepartment = options => Promise.resolve({});
      repository.updateDepartment = options => Promise.resolve({});

      // When:
      let result = await service.updateDepartment(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('removeDepartment', () => {
    it('should be a function', () => {
      expect(service.removeDepartment).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().removeDepartment()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.removeDepartment(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.removeDepartment(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['remove department from order'] },
        query: {}
      };

      validator.removeDepartment = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'));
        }
      };

      // When:
      let result = await service.removeDepartment(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when order search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'remove department from order' ] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1, department: 2 }
      };

      validator.removeDepartment = {
        validate: () => Promise.resolve({
          params: { order: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.removeDepartment(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when order was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['remove department from order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1, department: 2 }
      };

      validator.removeDepartment = {
        validate: () => Promise.resolve({
          params: { order: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.removeDepartment(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when getDepartment action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['remove department from order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1, department: 2 }
      };

      validator.removeDepartment = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getDepartment = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.removeDepartment(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when department was not found', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'remove department from order' ] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1, department: 2 }
      };

      validator.removeDepartment = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getDepartment = options => Promise.resolve(null);

      // When:
      let result = await service.removeDepartment(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when departments remove action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['remove department from order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1 }
      };

      validator.removeDepartment = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getDepartment = options => Promise.resolve({});
      repository.removeDepartment = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.removeDepartment(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when departments is found', async () => {
      // Given:
      let request = {
        token: { permissions: ['remove department from order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1 }
      };

      validator.removeDepartment = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getDepartment = options => Promise.resolve({});
      repository.removeDepartment = options => Promise.resolve({});

      // When:
      let result = await service.removeDepartment(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('getEmployees', () => {
    it('should be a function', () => {
      expect(service.getEmployees).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().getEmployees()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.getEmployees(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.getEmployees(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['get employees from order'] },
        query: {}
      };

      validator.getEmployees = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'));
        }
      };

      // When:
      let result = await service.getEmployees(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'get employees from order' ] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1 }
      };

      validator.getEmployees = {
        validate: () => Promise.resolve({
          params: { order: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.getEmployees(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when order was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get employees from order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1 }
      };

      validator.getEmployees = {
        validate: () => Promise.resolve({
          params: { order: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.getEmployees(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when getEmployees action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['get employees from order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1 }
      };

      validator.getEmployees = {
        validate: () => Promise.resolve({
          params: { order: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.getEmployees = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.getEmployees(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when employees are filtered', async () => {
      // Given:
      let request = {
        token: { permissions: ['get employees from order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1 }
      };

      validator.getEmployees = {
        validate: () => Promise.resolve({
          params: { order: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.getEmployees = options => {
        return Promise.resolve([]);
      }

      // When:
      let result = await service.getEmployees(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('addEmployees', () => {
    it('should be a function', () => {
      expect(service.addEmployees).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().addEmployees()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.addEmployees(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.addEmployees(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['add employees to order'] },
        query: {}
      };

      validator.addEmployees = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'));
        }
      };

      // When:
      let result = await service.addEmployees(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'add employees to order' ] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1 }
      };

      validator.addEmployees = {
        validate: () => Promise.resolve({
          params: { order: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.addEmployees(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when order was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['add employees to order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1 }
      };

      validator.addEmployees = {
        validate: () => Promise.resolve({
          params: { order: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.addEmployees(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when addEmployees action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['add employees to order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1 },
        body: { employees: [] }
      };

      validator.addEmployees = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.addEmployees = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.addEmployees(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when employees are added', async () => {
      // Given:
      let request = {
        token: { permissions: ['add employees to order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1 },
        body: { employees: [] }
      };

      validator.addEmployees = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.addEmployees = options => {
        return Promise.resolve([]);
      }

      // When:
      let result = await service.addEmployees(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('getEmployee', () => {
    it('should be a function', () => {
      expect(service.getEmployee).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().getEmployee()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.getEmployee(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.getEmployee(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['get employee from order'] },
        query: {}
      };

      validator.getEmployee = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'));
        }
      };

      // When:
      let result = await service.getEmployee(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'get employee from order' ] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1, employee: 2 }
      };

      validator.getEmployee = {
        validate: () => Promise.resolve({
          params: { order: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.getEmployee(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when order was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get employee from order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1, employee: 2 }
      };

      validator.getEmployee = {
        validate: () => Promise.resolve({
          params: { order: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.getEmployee(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when getEmployee action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['get employee from order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1, employee: 2 }
      };

      validator.getEmployee = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.getEmployee = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.getEmployee(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when employee was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get employee from order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1, employee: 2 }
      };

      validator.getEmployee = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.getEmployee = options => {
        return Promise.resolve(null);
      }

      // When:
      let result = await service.getEmployee(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when employees is found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get employee from order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1 },
        body: { employees: [] }
      };

      validator.getEmployee = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.getEmployee = options => {
        return Promise.resolve({});
      }

      // When:
      let result = await service.getEmployee(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('updateEmployee', () => {
    it('should be a function', () => {
      expect(service.updateEmployee).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().updateEmployee()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.updateEmployee(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.updateEmployee(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['update employee from order'] },
        query: {}
      };

      validator.updateEmployee = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'));
        }
      };

      // When:
      let result = await service.updateEmployee(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when order search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'update employee from order' ] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1, employee: 2 }
      };

      validator.updateEmployee = {
        validate: () => Promise.resolve({
          params: { order: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.updateEmployee(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when order was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['update employee from order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1, employee: 2 }
      };

      validator.updateEmployee = {
        validate: () => Promise.resolve({
          params: { order: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.updateEmployee(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when getEmployee action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['update employee from order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1, employee: 2 }
      };

      validator.updateEmployee = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getEmployee = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.updateEmployee(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when employee was not found', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'update employee from order' ] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1, employee: 2 }
      };

      validator.updateEmployee = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getEmployee = options => Promise.resolve(null);

      // When:
      let result = await service.updateEmployee(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when employees update action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['update employee from order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1 },
        body: { employees: [] }
      };

      validator.updateEmployee = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getEmployee = options => Promise.resolve({});
      repository.updateEmployee = options => Promise.reject(new Error('error mocked.'));

      // When:
      let result = await service.updateEmployee(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when employees is found', async () => {
      // Given:
      let request = {
        token: { permissions: ['update employee from order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1 },
        body: { employees: [] }
      };

      validator.updateEmployee = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getEmployee = options => Promise.resolve({});
      repository.updateEmployee = options => Promise.resolve({});

      // When:
      let result = await service.updateEmployee(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('removeEmployee', () => {
    it('should be a function', () => {
      expect(service.removeEmployee).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().removeEmployee()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.removeEmployee(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.removeEmployee(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['remove employee from order'] },
        query: {}
      };

      validator.removeEmployee = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'));
        }
      };

      // When:
      let result = await service.removeEmployee(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when order search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'remove employee from order' ] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1, employee: 2 }
      };

      validator.removeEmployee = {
        validate: () => Promise.resolve({
          params: { order: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.removeEmployee(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when order was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['remove employee from order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1, employee: 2 }
      };

      validator.removeEmployee = {
        validate: () => Promise.resolve({
          params: { order: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.removeEmployee(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when getEmployee action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['remove employee from order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1, employee: 2 }
      };

      validator.removeEmployee = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getEmployee = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.removeEmployee(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when employee was not found', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'remove employee from order' ] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1, employee: 2 }
      };

      validator.removeEmployee = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getEmployee = options => Promise.resolve(null);

      // When:
      let result = await service.removeEmployee(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when employees remove action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['remove employee from order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1 }
      };

      validator.removeEmployee = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getEmployee = options => Promise.resolve({});
      repository.removeEmployee = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.removeEmployee(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when employees is found', async () => {
      // Given:
      let request = {
        token: { permissions: ['remove employee from order'] },
        query: { name: 'kdmkdmkdm' },
        params: { order: 1 }
      };

      validator.removeEmployee = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getEmployee = options => Promise.resolve({});
      repository.removeEmployee = options => Promise.resolve({});

      // When:
      let result = await service.removeEmployee(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });
});
