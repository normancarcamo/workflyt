const Service = require('src/core/items/items-service');

describe('Service', () => {
  let service;
  let validator;
  let repository;

  beforeEach(() => {
    validator = {};

    repository = {
      findAll: options => Promise.resolve([]),
      create: data => Promise.resolve({}),
      findByPk: options => Promise.resolve({}),
      update: options => Promise.resolve({}),
      destroy: options => Promise.resolve({}),
      getStocks: options => Promise.resolve([]),
      addStocks: options => Promise.resolve([]),
      getStock: options => Promise.resolve({})
    };

    service = Service({ repository, validator });
  });

  it('should module be a factory function', () => {
    expect(Service).toBeFunction();
  });

  it('should return an object when function is invoked', () => {
    expect(Service({})).toBeObject().not.toBeEmpty().toContainAllKeys([
      'getItems',
      'createItems',
      'getItem',
      'updateItem',
      'deleteItem',
      'getStocks',
      'addStocks',
      'getStock'
    ]);
  });

  describe('getItems', () => {
    it('should be a function', () => {
      expect(service.getItems).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().getItems()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = {
        token: {
          permissions: []
        }
      };
      expect(service.getItems(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = {
        token: {
          permissions: ['']
        }
      };
      expect(service.getItems(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['get items']
        },
        query: {}
      };

      // When:
      let result = await service.getItems(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when action fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['get items']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.getItems = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.findAll = options => {
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
        token: {
          permissions: ['get items']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.getItems = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.findAll = options => {
        return Promise.resolve({});
      };

      // When:
      let result = await service.getItems(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('createItems', () => {
    it('should be a function', () => {
      expect(service.createItems).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().createItems()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = {
        token: {
          permissions: []
        }
      };
      expect(service.createItems(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = {
        token: {
          permissions: ['']
        }
      };
      expect(service.createItems(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['create items']
        },
        query: {}
      };

      // When:
      let result = await service.createItems(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when action fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['create items']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.createItems = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.create = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.createItems(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when item is created', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['create items']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.createItems = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.create = options => {
        return Promise.resolve({});
      };

      // When:
      let result = await service.createItems(request);

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
      let request = {
        token: {
          permissions: []
        }
      };
      expect(service.getItem(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = {
        token: {
          permissions: ['']
        }
      };
      expect(service.getItem(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['get item']
        },
        query: {}
      };

      // When:
      let result = await service.getItem(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when action fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['get item'] },
        query: { name: 'kdmkdmkdm' },
        params: { item: 1 }
      };

      validator.getItem = {
        validate: () => Promise.resolve({
          query: {},
          params: { item: 1 }
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
    it('should be rejected with error when item is not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get item'] },
        query: { name: 'kdmkdmkdm' },
        params: { item: 1 }
      };

      validator.getItem = {
        validate: () => Promise.resolve({
          query: {},
          params: { item: 1 }
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
    it('should be resolved with data when items is found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get item'] },
        query: { name: 'kdmkdmkdm' },
        params: { item: 1 }
      };

      validator.getItem = {
        validate: () => Promise.resolve({
          query: {},
          params: { item: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

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
      let request = { token: { permissions: ['update item'] }, query: {} };

      // When:
      let result = await service.updateItem(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when item search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['update item'] },
        query: { name: 'kdmkdmkdm' },
        params: { item: 1 }
      };

      validator.updateItem = {
        validate: () => Promise.resolve({
          params: { item: 1 }
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
    it('should be rejected with error when item was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['update item'] },
        query: { name: 'kdmkdmkdm' },
        params: { item: 1 }
      };

      validator.updateItem = {
        validate: () => Promise.resolve({
          params: { item: 1 }
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
    it('should be rejected with error when item update action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['update item'] },
        query: { name: 'kdmkdmkdm' },
        params: { item: 1 }
      };

      validator.updateItem = {
        validate: () => Promise.resolve({
          params: { item: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.update = options => {
        return Promise.reject(new Error('error mocked.'));
      }

      // When:
      let result = await service.updateItem(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when item is updated', async () => {
      // Given:
      let request = {
        token: { permissions: ['update item'] },
        query: { name: 'kdmkdmkdm' },
        params: { item: 1 }
      };

      validator.updateItem = {
        validate: () => Promise.resolve({
          params: { item: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.update = options => {
        return Promise.resolve({});
      }

      // When:
      let result = await service.updateItem(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('deleteItem', () => {
    it('should be a function', () => {
      expect(service.deleteItem).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().deleteItem()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.deleteItem(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.deleteItem(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = { token: { permissions: ['delete item'] }, query: {} };
      validator.deleteItem = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'))
        }
      };

      // When:
      let result = await service.deleteItem(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when item search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete item'] },
        query: { name: 'kdmkdmkdm' },
        params: { item: 1 }
      };

      validator.deleteItem = {
        validate: () => Promise.resolve({
          params: { item: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.deleteItem(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when item was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete item'] },
        query: { name: 'kdmkdmkdm' },
        params: { item: 1 }
      };

      validator.deleteItem = {
        validate: () => Promise.resolve({
          params: { item: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.deleteItem(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when item destroy action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete item'] },
        query: { name: 'kdmkdmkdm' },
        params: { item: 1 }
      };

      validator.deleteItem = {
        validate: () => Promise.resolve({
          params: { item: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.destroy = options => {
        return Promise.reject(new Error('error mocked.'));
      }

      // When:
      let result = await service.deleteItem(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when item is deleted', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete item'] },
        query: { name: 'kdmkdmkdm' },
        params: { item: 1 }
      };

      validator.deleteItem = {
        validate: () => Promise.resolve({
          params: { item: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.destroy = options => {
        return Promise.resolve({});
      }

      // When:
      let result = await service.deleteItem(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('getStocks', () => {
    it('should be a function', () => {
      expect(service.getStocks).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().getStocks()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.getStocks(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.getStocks(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['get stocks from item'] },
        query: {}
      };

      validator.getStocks = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'));
        }
      };

      // When:
      let result = await service.getStocks(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'get stocks from item' ] },
        query: { name: 'kdmkdmkdm' },
        params: { item: 1 }
      };

      validator.getStocks = {
        validate: options => Promise.resolve({ ...options })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.getStocks(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when item was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get stocks from item'] },
        query: { name: 'kdmkdmkdm' },
        params: { item: 1 }
      };

      validator.getStocks = {
        validate: options => Promise.resolve({ ...options })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.getStocks(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when user search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['get stocks from item'] },
        query: { name: 'kdmkdmkdm' },
        params: { item: 1 }
      };

      validator.getStocks = {
        validate: options => Promise.resolve({ ...options })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.getStocks = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.getStocks(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when user is found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get stocks from item'] },
        query: { name: 'kdmkdmkdm' },
        params: { item: 1 }
      };

      validator.getStocks = {
        validate: options => Promise.resolve({ ...options })
      };
      repository.findByPk = options => Promise.resolve({});
      repository.getStocks = options => Promise.resolve([]);

      // When:
      let result = await service.getStocks(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('addStocks', () => {
    it('should be a function', () => {
      expect(service.addStocks).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().addStocks()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.addStocks(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.addStocks(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['add stocks to item'] },
        query: {}
      };

      validator.addStocks = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'));
        }
      };

      // When:
      let result = await service.addStocks(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'add stocks to item' ] },
        query: { name: 'kdmkdmkdm' },
        params: { item: 1 },
        body: { stocks: [] }
      };

      validator.addStocks = {
        validate: options => Promise.resolve({ ...options })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.addStocks(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when item was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['add stocks to item'] },
        query: { name: 'kdmkdmkdm' },
        params: { item: 1 },
        body: { stocks: [] }
      };

      validator.addStocks = {
        validate: options => Promise.resolve({ ...options })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.addStocks(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when user search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['add stocks to item'] },
        query: { name: 'kdmkdmkdm' },
        params: { item: 1 },
        body: { stocks: [] }
      };

      validator.addStocks = {
        validate: options => Promise.resolve({ ...options })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.addStocks = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.addStocks(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when user is found', async () => {
      // Given:
      let request = {
        token: { permissions: ['add stocks to item'] },
        query: { name: 'kdmkdmkdm' },
        params: { item: 1 },
        body: { stocks: [] }
      };

      validator.addStocks = {
        validate: options => Promise.resolve({ ...options })
      };
      repository.findByPk = options => Promise.resolve({});
      repository.addStocks = options => Promise.resolve([]);

      // When:
      let result = await service.addStocks(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('getStock', () => {
    it('should be a function', () => {
      expect(service.getStock).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().getStock()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.getStock(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.getStock(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['get stock from item'] },
        query: {}
      };

      validator.getStock = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'));
        }
      };

      // When:
      let result = await service.getStock(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'get stock from item' ] },
        query: { name: 'kdmkdmkdm' },
        params: { item: 1 },
        body: { stocks: [] }
      };

      validator.getStock = {
        validate: options => Promise.resolve({ ...options })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.getStock(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when item was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get stock from item'] },
        query: { name: 'kdmkdmkdm' },
        params: { item: 1 },
        body: { stocks: [] }
      };

      validator.getStock = {
        validate: options => Promise.resolve({ ...options })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.getStock(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when stock search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['get stock from item'] },
        query: { name: 'kdmkdmkdm' },
        params: { item: 1 },
        body: { stocks: [] }
      };

      validator.getStock = {
        validate: options => Promise.resolve({ ...options })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.getStock = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.getStock(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when stock is not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get stock from item'] },
        query: { name: 'kdmkdmkdm' },
        params: { item: 1 },
        body: { stocks: [] }
      };

      validator.getStock = {
        validate: options => Promise.resolve({ ...options })
      };
      repository.findByPk = options => Promise.resolve({});
      repository.getStock = options => Promise.resolve(null);

      // When:
      let result = await service.getStock(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when stock is found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get stock from item'] },
        query: { name: 'kdmkdmkdm' },
        params: { item: 1 },
        body: { stocks: [] }
      };

      validator.getStock = {
        validate: options => Promise.resolve({ ...options })
      };
      repository.findByPk = options => Promise.resolve({});
      repository.getStock = options => Promise.resolve({});

      // When:
      let result = await service.getStock(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });
});
