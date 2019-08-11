const Service = require('src/core/warehouses/warehouses-service');

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
      removeItem: options => Promise.resolve({})
    };

    service = Service({ repository, validator });
  });

  it('should module be a factory function', () => {
    expect(Service).toBeFunction();
  });

  it('should return an object when function is invoked', () => {
    expect(Service({})).toBeObject().not.toBeEmpty().toContainAllKeys([
      'getWarehouses',
      'createWarehouses',
      'getWarehouse',
      'updateWarehouse',
      'deleteWarehouse',
      'getItems',
      'addItems',
      'getItem',
      'updateItem',
      'removeItem'
    ]);
  });

  describe('getWarehouses', () => {
    it('should be a function', () => {
      expect(service.getWarehouses).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().getWarehouses()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = {
        token: {
          permissions: []
        }
      };
      expect(service.getWarehouses(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = {
        token: {
          permissions: ['']
        }
      };
      expect(service.getWarehouses(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['get warehouses']
        },
        query: {}
      };

      // When:
      let result = await service.getWarehouses(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when action fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['get warehouses']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.getWarehouses = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.findAll = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.getWarehouses(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when warehouses are filtered', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['get warehouses']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.getWarehouses = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.findAll = options => {
        return Promise.resolve({});
      };

      // When:
      let result = await service.getWarehouses(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('createWarehouses', () => {
    it('should be a function', () => {
      expect(service.createWarehouses).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().createWarehouses()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = {
        token: {
          permissions: []
        }
      };
      expect(service.createWarehouses(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = {
        token: {
          permissions: ['']
        }
      };
      expect(service.createWarehouses(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['create warehouses']
        },
        query: {}
      };

      // When:
      let result = await service.createWarehouses(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when action fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['create warehouses']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.createWarehouses = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.create = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.createWarehouses(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when warehouse is created', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['create warehouses']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.createWarehouses = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.create = options => {
        return Promise.resolve({});
      };

      // When:
      let result = await service.createWarehouses(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('getWarehouse', () => {
    it('should be a function', () => {
      expect(service.getWarehouse).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().getWarehouse()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = {
        token: {
          permissions: []
        }
      };
      expect(service.getWarehouse(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = {
        token: {
          permissions: ['']
        }
      };
      expect(service.getWarehouse(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['get warehouse']
        },
        query: {}
      };

      // When:
      let result = await service.getWarehouse(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when action fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['get warehouse'] },
        query: { name: 'kdmkdmkdm' },
        params: { warehouse: 1 }
      };

      validator.getWarehouse = {
        validate: () => Promise.resolve({
          query: {},
          params: { warehouse: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.getWarehouse(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when warehouse is not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get warehouse'] },
        query: { name: 'kdmkdmkdm' },
        params: { warehouse: 1 }
      };

      validator.getWarehouse = {
        validate: () => Promise.resolve({
          query: {},
          params: { warehouse: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.getWarehouse(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when warehouses is found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get warehouse'] },
        query: { name: 'kdmkdmkdm' },
        params: { warehouse: 1 }
      };

      validator.getWarehouse = {
        validate: () => Promise.resolve({
          query: {},
          params: { warehouse: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      // When:
      let result = await service.getWarehouse(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('updateWarehouse', () => {
    it('should be a function', () => {
      expect(service.updateWarehouse).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().updateWarehouse()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.updateWarehouse(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.updateWarehouse(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = { token: { permissions: ['update warehouse'] }, query: {} };

      // When:
      let result = await service.updateWarehouse(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when warehouse search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['update warehouse'] },
        query: { name: 'kdmkdmkdm' },
        params: { warehouse: 1 }
      };

      validator.updateWarehouse = {
        validate: () => Promise.resolve({
          params: { warehouse: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.updateWarehouse(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when warehouse was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['update warehouse'] },
        query: { name: 'kdmkdmkdm' },
        params: { warehouse: 1 }
      };

      validator.updateWarehouse = {
        validate: () => Promise.resolve({
          params: { warehouse: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.updateWarehouse(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when warehouse update action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['update warehouse'] },
        query: { name: 'kdmkdmkdm' },
        params: { warehouse: 1 }
      };

      validator.updateWarehouse = {
        validate: () => Promise.resolve({
          params: { warehouse: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.update = options => {
        return Promise.reject(new Error('error mocked.'));
      }

      // When:
      let result = await service.updateWarehouse(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when warehouse is updated', async () => {
      // Given:
      let request = {
        token: { permissions: ['update warehouse'] },
        query: { name: 'kdmkdmkdm' },
        params: { warehouse: 1 }
      };

      validator.updateWarehouse = {
        validate: () => Promise.resolve({
          params: { warehouse: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.update = options => {
        return Promise.resolve({});
      }

      // When:
      let result = await service.updateWarehouse(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('deleteWarehouse', () => {
    it('should be a function', () => {
      expect(service.deleteWarehouse).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().deleteWarehouse()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.deleteWarehouse(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.deleteWarehouse(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = { token: { permissions: ['delete warehouse'] }, query: {} };
      validator.deleteWarehouse = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'))
        }
      };

      // When:
      let result = await service.deleteWarehouse(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when warehouse search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete warehouse'] },
        query: { name: 'kdmkdmkdm' },
        params: { warehouse: 1 }
      };

      validator.deleteWarehouse = {
        validate: () => Promise.resolve({
          params: { warehouse: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.deleteWarehouse(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when warehouse was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete warehouse'] },
        query: { name: 'kdmkdmkdm' },
        params: { warehouse: 1 }
      };

      validator.deleteWarehouse = {
        validate: () => Promise.resolve({
          params: { warehouse: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.deleteWarehouse(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when warehouse destroy action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete warehouse'] },
        query: { name: 'kdmkdmkdm' },
        params: { warehouse: 1 }
      };

      validator.deleteWarehouse = {
        validate: () => Promise.resolve({
          params: { warehouse: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.destroy = options => {
        return Promise.reject(new Error('error mocked.'));
      }

      // When:
      let result = await service.deleteWarehouse(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when warehouse is deleted', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete warehouse'] },
        query: { name: 'kdmkdmkdm' },
        params: { warehouse: 1 }
      };

      validator.deleteWarehouse = {
        validate: () => Promise.resolve({
          params: { warehouse: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.destroy = options => {
        return Promise.resolve({});
      }

      // When:
      let result = await service.deleteWarehouse(request);

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
        token: { permissions: ['get items from warehouse'] },
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
        token: { permissions: [ 'get items from warehouse' ] },
        query: { name: 'kdmkdmkdm' },
        params: { warehouse: 1 }
      };

      validator.getItems = {
        validate: () => Promise.resolve({
          params: { warehouse: 1 }
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
    it('should be rejected with error when warehouse was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get items from warehouse'] },
        query: { name: 'kdmkdmkdm' },
        params: { warehouse: 1 }
      };

      validator.getItems = {
        validate: () => Promise.resolve({
          params: { warehouse: 1 }
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
        token: { permissions: ['get items from warehouse'] },
        query: { name: 'kdmkdmkdm' },
        params: { warehouse: 1 }
      };

      validator.getItems = {
        validate: () => Promise.resolve({
          params: { warehouse: 1 }
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
        token: { permissions: ['get items from warehouse'] },
        query: { name: 'kdmkdmkdm' },
        params: { warehouse: 1 }
      };

      validator.getItems = {
        validate: () => Promise.resolve({
          params: { warehouse: 1 }
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
        token: { permissions: ['add items to warehouse'] },
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
        token: { permissions: [ 'add items to warehouse' ] },
        query: { name: 'kdmkdmkdm' },
        params: { warehouse: 1 }
      };

      validator.addItems = {
        validate: () => Promise.resolve({
          params: { warehouse: 1 }
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
    it('should be rejected with error when warehouse was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['add items to warehouse'] },
        query: { name: 'kdmkdmkdm' },
        params: { warehouse: 1 }
      };

      validator.addItems = {
        validate: () => Promise.resolve({
          params: { warehouse: 1 }
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
        token: { permissions: ['add items to warehouse'] },
        query: { name: 'kdmkdmkdm' },
        params: { warehouse: 1 },
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
        token: { permissions: ['add items to warehouse'] },
        query: { name: 'kdmkdmkdm' },
        params: { warehouse: 1 },
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
        token: { permissions: ['get item from warehouse'] },
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
        token: { permissions: [ 'get item from warehouse' ] },
        query: { name: 'kdmkdmkdm' },
        params: { warehouse: 1, item: 2 }
      };

      validator.getItem = {
        validate: () => Promise.resolve({
          params: { warehouse: 1 }
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
    it('should be rejected with error when warehouse was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get item from warehouse'] },
        query: { name: 'kdmkdmkdm' },
        params: { warehouse: 1, item: 2 }
      };

      validator.getItem = {
        validate: () => Promise.resolve({
          params: { warehouse: 1 }
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
        token: { permissions: ['get item from warehouse'] },
        query: { name: 'kdmkdmkdm' },
        params: { warehouse: 1, item: 2 }
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
        token: { permissions: ['get item from warehouse'] },
        query: { name: 'kdmkdmkdm' },
        params: { warehouse: 1, item: 2 }
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
        token: { permissions: ['get item from warehouse'] },
        query: { name: 'kdmkdmkdm' },
        params: { warehouse: 1 },
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
        token: { permissions: ['update item from warehouse'] },
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
    it('should be rejected with error when warehouse search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'update item from warehouse' ] },
        query: { name: 'kdmkdmkdm' },
        params: { warehouse: 1, item: 2 }
      };

      validator.updateItem = {
        validate: () => Promise.resolve({
          params: { warehouse: 1 }
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
    it('should be rejected with error when warehouse was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['update item from warehouse'] },
        query: { name: 'kdmkdmkdm' },
        params: { warehouse: 1, item: 2 }
      };

      validator.updateItem = {
        validate: () => Promise.resolve({
          params: { warehouse: 1 }
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
        token: { permissions: ['update item from warehouse'] },
        query: { name: 'kdmkdmkdm' },
        params: { warehouse: 1, item: 2 }
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
        token: { permissions: [ 'update item from warehouse' ] },
        query: { name: 'kdmkdmkdm' },
        params: { warehouse: 1, item: 2 }
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
        token: { permissions: ['update item from warehouse'] },
        query: { name: 'kdmkdmkdm' },
        params: { warehouse: 1 },
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
        token: { permissions: ['update item from warehouse'] },
        query: { name: 'kdmkdmkdm' },
        params: { warehouse: 1 },
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
        token: { permissions: ['remove item from warehouse'] },
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
    it('should be rejected with error when warehouse search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'remove item from warehouse' ] },
        query: { name: 'kdmkdmkdm' },
        params: { warehouse: 1, item: 2 }
      };

      validator.removeItem = {
        validate: () => Promise.resolve({
          params: { warehouse: 1 }
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
    it('should be rejected with error when warehouse was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['remove item from warehouse'] },
        query: { name: 'kdmkdmkdm' },
        params: { warehouse: 1, item: 2 }
      };

      validator.removeItem = {
        validate: () => Promise.resolve({
          params: { warehouse: 1 }
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
        token: { permissions: ['remove item from warehouse'] },
        query: { name: 'kdmkdmkdm' },
        params: { warehouse: 1, item: 2 }
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
        token: { permissions: [ 'remove item from warehouse' ] },
        query: { name: 'kdmkdmkdm' },
        params: { warehouse: 1, item: 2 }
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
        token: { permissions: ['remove item from warehouse'] },
        query: { name: 'kdmkdmkdm' },
        params: { warehouse: 1 }
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
        token: { permissions: ['remove item from warehouse'] },
        query: { name: 'kdmkdmkdm' },
        params: { warehouse: 1 }
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
});
