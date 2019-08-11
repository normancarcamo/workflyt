const Service = require('src/core/suppliers/suppliers-service');

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
      'getSuppliers',
      'createSuppliers',
      'getSupplier',
      'updateSupplier',
      'deleteSupplier',
      'getItems',
      'addItems',
      'getItem',
      'updateItem',
      'removeItem'
    ]);
  });

  describe('getSuppliers', () => {
    it('should be a function', () => {
      expect(service.getSuppliers).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().getSuppliers()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = {
        token: {
          permissions: []
        }
      };
      expect(service.getSuppliers(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = {
        token: {
          permissions: ['']
        }
      };
      expect(service.getSuppliers(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['get suppliers']
        },
        query: {}
      };

      // When:
      let result = await service.getSuppliers(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when action fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['get suppliers']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.getSuppliers = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.findAll = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.getSuppliers(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when suppliers are filtered', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['get suppliers']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.getSuppliers = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.findAll = options => {
        return Promise.resolve({});
      };

      // When:
      let result = await service.getSuppliers(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('createSuppliers', () => {
    it('should be a function', () => {
      expect(service.createSuppliers).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().createSuppliers()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = {
        token: {
          permissions: []
        }
      };
      expect(service.createSuppliers(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = {
        token: {
          permissions: ['']
        }
      };
      expect(service.createSuppliers(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['create suppliers']
        },
        query: {}
      };

      // When:
      let result = await service.createSuppliers(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when action fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['create suppliers']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.createSuppliers = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.create = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.createSuppliers(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when supplier is created', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['create suppliers']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.createSuppliers = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.create = options => {
        return Promise.resolve({});
      };

      // When:
      let result = await service.createSuppliers(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('getSupplier', () => {
    it('should be a function', () => {
      expect(service.getSupplier).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().getSupplier()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = {
        token: {
          permissions: []
        }
      };
      expect(service.getSupplier(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = {
        token: {
          permissions: ['']
        }
      };
      expect(service.getSupplier(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['get supplier']
        },
        query: {}
      };

      // When:
      let result = await service.getSupplier(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when action fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['get supplier'] },
        query: { name: 'kdmkdmkdm' },
        params: { supplier: 1 }
      };

      validator.getSupplier = {
        validate: () => Promise.resolve({
          query: {},
          params: { supplier: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.getSupplier(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when supplier is not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get supplier'] },
        query: { name: 'kdmkdmkdm' },
        params: { supplier: 1 }
      };

      validator.getSupplier = {
        validate: () => Promise.resolve({
          query: {},
          params: { supplier: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.getSupplier(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when suppliers is found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get supplier'] },
        query: { name: 'kdmkdmkdm' },
        params: { supplier: 1 }
      };

      validator.getSupplier = {
        validate: () => Promise.resolve({
          query: {},
          params: { supplier: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      // When:
      let result = await service.getSupplier(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('updateSupplier', () => {
    it('should be a function', () => {
      expect(service.updateSupplier).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().updateSupplier()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.updateSupplier(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.updateSupplier(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = { token: { permissions: ['update supplier'] }, query: {} };

      // When:
      let result = await service.updateSupplier(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when supplier search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['update supplier'] },
        query: { name: 'kdmkdmkdm' },
        params: { supplier: 1 }
      };

      validator.updateSupplier = {
        validate: () => Promise.resolve({
          params: { supplier: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.updateSupplier(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when supplier was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['update supplier'] },
        query: { name: 'kdmkdmkdm' },
        params: { supplier: 1 }
      };

      validator.updateSupplier = {
        validate: () => Promise.resolve({
          params: { supplier: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.updateSupplier(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when supplier update action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['update supplier'] },
        query: { name: 'kdmkdmkdm' },
        params: { supplier: 1 }
      };

      validator.updateSupplier = {
        validate: () => Promise.resolve({
          params: { supplier: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.update = options => {
        return Promise.reject(new Error('error mocked.'));
      }

      // When:
      let result = await service.updateSupplier(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when supplier is updated', async () => {
      // Given:
      let request = {
        token: { permissions: ['update supplier'] },
        query: { name: 'kdmkdmkdm' },
        params: { supplier: 1 }
      };

      validator.updateSupplier = {
        validate: () => Promise.resolve({
          params: { supplier: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.update = options => {
        return Promise.resolve({});
      }

      // When:
      let result = await service.updateSupplier(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('deleteSupplier', () => {
    it('should be a function', () => {
      expect(service.deleteSupplier).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().deleteSupplier()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.deleteSupplier(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.deleteSupplier(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = { token: { permissions: ['delete supplier'] }, query: {} };
      validator.deleteSupplier = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'))
        }
      };

      // When:
      let result = await service.deleteSupplier(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when supplier search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete supplier'] },
        query: { name: 'kdmkdmkdm' },
        params: { supplier: 1 }
      };

      validator.deleteSupplier = {
        validate: () => Promise.resolve({
          params: { supplier: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.deleteSupplier(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when supplier was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete supplier'] },
        query: { name: 'kdmkdmkdm' },
        params: { supplier: 1 }
      };

      validator.deleteSupplier = {
        validate: () => Promise.resolve({
          params: { supplier: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.deleteSupplier(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when supplier destroy action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete supplier'] },
        query: { name: 'kdmkdmkdm' },
        params: { supplier: 1 }
      };

      validator.deleteSupplier = {
        validate: () => Promise.resolve({
          params: { supplier: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.destroy = options => {
        return Promise.reject(new Error('error mocked.'));
      }

      // When:
      let result = await service.deleteSupplier(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when supplier is deleted', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete supplier'] },
        query: { name: 'kdmkdmkdm' },
        params: { supplier: 1 }
      };

      validator.deleteSupplier = {
        validate: () => Promise.resolve({
          params: { supplier: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.destroy = options => {
        return Promise.resolve({});
      }

      // When:
      let result = await service.deleteSupplier(request);

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
        token: { permissions: ['get items from supplier'] },
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
        token: { permissions: [ 'get items from supplier' ] },
        query: { name: 'kdmkdmkdm' },
        params: { supplier: 1 }
      };

      validator.getItems = {
        validate: () => Promise.resolve({
          params: { supplier: 1 }
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
    it('should be rejected with error when supplier was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get items from supplier'] },
        query: { name: 'kdmkdmkdm' },
        params: { supplier: 1 }
      };

      validator.getItems = {
        validate: () => Promise.resolve({
          params: { supplier: 1 }
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
        token: { permissions: ['get items from supplier'] },
        query: { name: 'kdmkdmkdm' },
        params: { supplier: 1 }
      };

      validator.getItems = {
        validate: () => Promise.resolve({
          params: { supplier: 1 }
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
        token: { permissions: ['get items from supplier'] },
        query: { name: 'kdmkdmkdm' },
        params: { supplier: 1 }
      };

      validator.getItems = {
        validate: () => Promise.resolve({
          params: { supplier: 1 }
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
        token: { permissions: ['add items to supplier'] },
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
        token: { permissions: [ 'add items to supplier' ] },
        query: { name: 'kdmkdmkdm' },
        params: { supplier: 1 }
      };

      validator.addItems = {
        validate: () => Promise.resolve({
          params: { supplier: 1 }
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
    it('should be rejected with error when supplier was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['add items to supplier'] },
        query: { name: 'kdmkdmkdm' },
        params: { supplier: 1 }
      };

      validator.addItems = {
        validate: () => Promise.resolve({
          params: { supplier: 1 }
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
        token: { permissions: ['add items to supplier'] },
        query: { name: 'kdmkdmkdm' },
        params: { supplier: 1 },
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
        token: { permissions: ['add items to supplier'] },
        query: { name: 'kdmkdmkdm' },
        params: { supplier: 1 },
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
        token: { permissions: ['get item from supplier'] },
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
        token: { permissions: [ 'get item from supplier' ] },
        query: { name: 'kdmkdmkdm' },
        params: { supplier: 1, item: 2 }
      };

      validator.getItem = {
        validate: () => Promise.resolve({
          params: { supplier: 1 }
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
    it('should be rejected with error when supplier was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get item from supplier'] },
        query: { name: 'kdmkdmkdm' },
        params: { supplier: 1, item: 2 }
      };

      validator.getItem = {
        validate: () => Promise.resolve({
          params: { supplier: 1 }
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
        token: { permissions: ['get item from supplier'] },
        query: { name: 'kdmkdmkdm' },
        params: { supplier: 1, item: 2 }
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
        token: { permissions: ['get item from supplier'] },
        query: { name: 'kdmkdmkdm' },
        params: { supplier: 1, item: 2 }
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
        token: { permissions: ['get item from supplier'] },
        query: { name: 'kdmkdmkdm' },
        params: { supplier: 1 },
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
        token: { permissions: ['update item from supplier'] },
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
    it('should be rejected with error when supplier search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'update item from supplier' ] },
        query: { name: 'kdmkdmkdm' },
        params: { supplier: 1, item: 2 }
      };

      validator.updateItem = {
        validate: () => Promise.resolve({
          params: { supplier: 1 }
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
    it('should be rejected with error when supplier was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['update item from supplier'] },
        query: { name: 'kdmkdmkdm' },
        params: { supplier: 1, item: 2 }
      };

      validator.updateItem = {
        validate: () => Promise.resolve({
          params: { supplier: 1 }
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
        token: { permissions: ['update item from supplier'] },
        query: { name: 'kdmkdmkdm' },
        params: { supplier: 1, item: 2 }
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
        token: { permissions: [ 'update item from supplier' ] },
        query: { name: 'kdmkdmkdm' },
        params: { supplier: 1, item: 2 }
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
        token: { permissions: ['update item from supplier'] },
        query: { name: 'kdmkdmkdm' },
        params: { supplier: 1 },
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
        token: { permissions: ['update item from supplier'] },
        query: { name: 'kdmkdmkdm' },
        params: { supplier: 1 },
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
        token: { permissions: ['remove item from supplier'] },
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
    it('should be rejected with error when supplier search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'remove item from supplier' ] },
        query: { name: 'kdmkdmkdm' },
        params: { supplier: 1, item: 2 }
      };

      validator.removeItem = {
        validate: () => Promise.resolve({
          params: { supplier: 1 }
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
    it('should be rejected with error when supplier was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['remove item from supplier'] },
        query: { name: 'kdmkdmkdm' },
        params: { supplier: 1, item: 2 }
      };

      validator.removeItem = {
        validate: () => Promise.resolve({
          params: { supplier: 1 }
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
        token: { permissions: ['remove item from supplier'] },
        query: { name: 'kdmkdmkdm' },
        params: { supplier: 1, item: 2 }
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
        token: { permissions: [ 'remove item from supplier' ] },
        query: { name: 'kdmkdmkdm' },
        params: { supplier: 1, item: 2 }
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
        token: { permissions: ['remove item from supplier'] },
        query: { name: 'kdmkdmkdm' },
        params: { supplier: 1 }
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
        token: { permissions: ['remove item from supplier'] },
        query: { name: 'kdmkdmkdm' },
        params: { supplier: 1 }
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
