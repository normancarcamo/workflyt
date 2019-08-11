const Service = require('src/core/categories/categories-service');

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
      addItems: options => Promise.resolve({}),
      getItem: options => Promise.resolve({}),
      removeItem: options => Promise.resolve({})
    };

    service = Service({ repository, validator });
  });

  it('should module be a factory function', () => {
    expect(Service).toBeFunction();
  });

  it('should return an object when function is invoked', () => {
    expect(Service({})).toBeObject().not.toBeEmpty().toContainAllKeys([
      'getCategories',
      'createCategories',
      'getCategory',
      'updateCategory',
      'deleteCategory',
      'getItems',
      'addItems',
      'getItem',
      'removeItem'
    ]);
  });

  describe('getCategories', () => {
    it('should be a function', () => {
      expect(service.getCategories).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().getCategories()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = {
        token: {
          permissions: []
        }
      };
      expect(service.getCategories(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = {
        token: {
          permissions: ['']
        }
      };
      expect(service.getCategories(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['get categories']
        },
        query: {}
      };

      // When:
      let result = await service.getCategories(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when action fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['get categories']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.getCategories = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.findAll = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.getCategories(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when categories are filtered', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['get categories']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.getCategories = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.findAll = options => {
        return Promise.resolve({});
      };

      // When:
      let result = await service.getCategories(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('createCategories', () => {
    it('should be a function', () => {
      expect(service.createCategories).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().createCategories()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = {
        token: {
          permissions: []
        }
      };
      expect(service.createCategories(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = {
        token: {
          permissions: ['']
        }
      };
      expect(service.createCategories(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['create categories']
        },
        query: {}
      };

      // When:
      let result = await service.createCategories(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when action fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['create categories']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.createCategories = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.create = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.createCategories(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when category is created', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['create categories']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.createCategories = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.create = options => {
        return Promise.resolve({});
      };

      // When:
      let result = await service.createCategories(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('getCategory', () => {
    it('should be a function', () => {
      expect(service.getCategory).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().getCategory()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = {
        token: {
          permissions: []
        }
      };
      expect(service.getCategory(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = {
        token: {
          permissions: ['']
        }
      };
      expect(service.getCategory(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['get category']
        },
        query: {}
      };

      // When:
      let result = await service.getCategory(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when action fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['get category'] },
        query: { name: 'kdmkdmkdm' },
        params: { category: 1 }
      };

      validator.getCategory = {
        validate: () => Promise.resolve({
          query: {},
          params: { category: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.getCategory(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when category is not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get category'] },
        query: { name: 'kdmkdmkdm' },
        params: { category: 1 }
      };

      validator.getCategory = {
        validate: () => Promise.resolve({
          query: {},
          params: { category: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.getCategory(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when categories is found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get category'] },
        query: { name: 'kdmkdmkdm' },
        params: { category: 1 }
      };

      validator.getCategory = {
        validate: () => Promise.resolve({
          query: {},
          params: { category: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      // When:
      let result = await service.getCategory(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('updateCategory', () => {
    it('should be a function', () => {
      expect(service.updateCategory).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().updateCategory()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.updateCategory(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.updateCategory(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = { token: { permissions: ['update category'] }, query: {} };

      // When:
      let result = await service.updateCategory(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when category search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['update category'] },
        query: { name: 'kdmkdmkdm' },
        params: { category: 1 }
      };

      validator.updateCategory = {
        validate: () => Promise.resolve({
          params: { category: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.updateCategory(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when category was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['update category'] },
        query: { name: 'kdmkdmkdm' },
        params: { category: 1 }
      };

      validator.updateCategory = {
        validate: () => Promise.resolve({
          params: { category: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.updateCategory(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when category update action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['update category'] },
        query: { name: 'kdmkdmkdm' },
        params: { category: 1 }
      };

      validator.updateCategory = {
        validate: () => Promise.resolve({
          params: { category: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.update = options => {
        return Promise.reject(new Error('error mocked.'));
      }

      // When:
      let result = await service.updateCategory(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when category is updated', async () => {
      // Given:
      let request = {
        token: { permissions: ['update category'] },
        query: { name: 'kdmkdmkdm' },
        params: { category: 1 }
      };

      validator.updateCategory = {
        validate: () => Promise.resolve({
          params: { category: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.update = options => {
        return Promise.resolve({});
      }

      // When:
      let result = await service.updateCategory(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('deleteCategory', () => {
    it('should be a function', () => {
      expect(service.deleteCategory).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().deleteCategory()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.deleteCategory(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.deleteCategory(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = { token: { permissions: ['delete category'] }, query: {} };
      validator.deleteCategory = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'))
        }
      };

      // When:
      let result = await service.deleteCategory(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when category search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete category'] },
        query: { name: 'kdmkdmkdm' },
        params: { category: 1 }
      };

      validator.deleteCategory = {
        validate: () => Promise.resolve({
          params: { category: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.deleteCategory(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when category was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete category'] },
        query: { name: 'kdmkdmkdm' },
        params: { category: 1 }
      };

      validator.deleteCategory = {
        validate: () => Promise.resolve({
          params: { category: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.deleteCategory(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when category destroy action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete category'] },
        query: { name: 'kdmkdmkdm' },
        params: { category: 1 }
      };

      validator.deleteCategory = {
        validate: () => Promise.resolve({
          params: { category: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.destroy = options => {
        return Promise.reject(new Error('error mocked.'));
      }

      // When:
      let result = await service.deleteCategory(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when category is deleted', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete category'] },
        query: { name: 'kdmkdmkdm' },
        params: { category: 1 }
      };

      validator.deleteCategory = {
        validate: () => Promise.resolve({
          params: { category: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.destroy = options => {
        return Promise.resolve({});
      }

      // When:
      let result = await service.deleteCategory(request);

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
        token: { permissions: ['get items from category'] },
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
        token: { permissions: [ 'get items from category' ] },
        query: { name: 'kdmkdmkdm' },
        params: { category: 1 }
      };

      validator.getItems = {
        validate: () => Promise.resolve({
          params: { category: 1 }
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
    it('should be rejected with error when category was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get items from category'] },
        query: { name: 'kdmkdmkdm' },
        params: { category: 1 }
      };

      validator.getItems = {
        validate: () => Promise.resolve({
          params: { category: 1 }
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
        token: { permissions: ['get items from category'] },
        query: { name: 'kdmkdmkdm' },
        params: { category: 1 }
      };

      validator.getItems = {
        validate: () => Promise.resolve({
          params: { category: 1 }
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
        token: { permissions: ['get items from category'] },
        query: { name: 'kdmkdmkdm' },
        params: { category: 1 }
      };

      validator.getItems = {
        validate: () => Promise.resolve({
          params: { category: 1 }
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
        token: { permissions: ['add items to category'] },
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
        token: { permissions: [ 'add items to category' ] },
        query: { name: 'kdmkdmkdm' },
        params: { category: 1 }
      };

      validator.addItems = {
        validate: () => Promise.resolve({
          params: { category: 1 }
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
    it('should be rejected with error when category was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['add items to category'] },
        query: { name: 'kdmkdmkdm' },
        params: { category: 1 }
      };

      validator.addItems = {
        validate: () => Promise.resolve({
          params: { category: 1 }
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
        token: { permissions: ['add items to category'] },
        query: { name: 'kdmkdmkdm' },
        params: { category: 1 },
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
        token: { permissions: ['add items to category'] },
        query: { name: 'kdmkdmkdm' },
        params: { category: 1 },
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
        token: { permissions: ['get item from category'] },
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
        token: { permissions: [ 'get item from category' ] },
        query: { name: 'kdmkdmkdm' },
        params: { category: 1, item: 2 }
      };

      validator.getItem = {
        validate: () => Promise.resolve({
          params: { category: 1 }
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
    it('should be rejected with error when category was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get item from category'] },
        query: { name: 'kdmkdmkdm' },
        params: { category: 1, item: 2 }
      };

      validator.getItem = {
        validate: () => Promise.resolve({
          params: { category: 1 }
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
        token: { permissions: ['get item from category'] },
        query: { name: 'kdmkdmkdm' },
        params: { category: 1, item: 2 }
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
        token: { permissions: ['get item from category'] },
        query: { name: 'kdmkdmkdm' },
        params: { category: 1, item: 2 }
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
        token: { permissions: ['get item from category'] },
        query: { name: 'kdmkdmkdm' },
        params: { category: 1 },
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
        token: { permissions: [ 'remove item from category' ] },
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
    it('should be rejected with error when category search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'remove item from category' ] },
        query: { name: 'kdmkdmkdm' },
        params: { category: 1, item: 2 }
      };

      validator.removeItem = {
        validate: () => Promise.resolve({
          params: { category: 1 }
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
    it('should be rejected with error when category was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['remove item from category'] },
        query: { name: 'kdmkdmkdm' },
        params: { category: 1, item: 2 }
      };

      validator.removeItem = {
        validate: () => Promise.resolve({
          params: { category: 1 }
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
    it('should be rejected with error when item search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['remove item from category'] },
        query: { name: 'kdmkdmkdm' },
        params: { category: 1, item: 2 }
      };

      validator.removeItem = {
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
      let result = await service.removeItem(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with error when item was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['remove item from category'] },
        query: { name: 'kdmkdmkdm' },
        params: { category: 1, item: 2 }
      };

      validator.removeItem = {
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
      let result = await service.removeItem(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with error when item remove action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['remove item from category'] },
        query: { name: 'kdmkdmkdm' },
        params: { category: 1 },
        body: { items: [] }
      };

      validator.removeItem = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.getItem = options => {
        return Promise.resolve({});
      };

      repository.removeItem = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.removeItem(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when item is removed', async () => {
      // Given:
      let request = {
        token: { permissions: ['remove item from category'] },
        query: { name: 'kdmkdmkdm' },
        params: { category: 1 },
        body: { items: [] }
      };

      validator.removeItem = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.getItem = options => {
        return Promise.resolve({});
      };

      repository.removeItem = options => {
        return Promise.resolve({});
      };

      // When:
      let result = await service.removeItem(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });
});
