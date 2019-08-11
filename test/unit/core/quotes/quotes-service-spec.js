const Service = require('src/core/quotes/quotes-service');

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
      getOrders: options => Promise.resolve({}),
      addOrders: options => Promise.resolve([]),
      getOrder: options => Promise.resolve({})
    };

    service = Service({ repository, validator });
  });

  it('should module be a factory function', () => {
    expect(Service).toBeFunction();
  });

  it('should return an object when function is invoked', () => {
    expect(Service({})).toBeObject().not.toBeEmpty().toContainAllKeys([
      'getQuotes',
      'createQuotes',
      'getQuote',
      'updateQuote',
      'deleteQuote',
      'getItems',
      'addItems',
      'getItem',
      'updateItem',
      'removeItem',
      'getOrders',
      'addOrders',
      'getOrder'
    ]);
  });

  describe('getQuotes', () => {
    it('should be a function', () => {
      expect(service.getQuotes).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().getQuotes()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = {
        token: {
          permissions: []
        }
      };
      expect(service.getQuotes(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = {
        token: {
          permissions: ['']
        }
      };
      expect(service.getQuotes(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['get quotes']
        },
        query: {}
      };

      // When:
      let result = await service.getQuotes(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when action fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['get quotes']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.getQuotes = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.findAll = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.getQuotes(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when quotes are filtered', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['get quotes']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.getQuotes = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.findAll = options => {
        return Promise.resolve({});
      };

      // When:
      let result = await service.getQuotes(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('createQuotes', () => {
    it('should be a function', () => {
      expect(service.createQuotes).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().createQuotes()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = {
        token: {
          permissions: []
        }
      };
      expect(service.createQuotes(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = {
        token: {
          permissions: ['']
        }
      };
      expect(service.createQuotes(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['create quotes']
        },
        query: {}
      };

      // When:
      let result = await service.createQuotes(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when action fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['create quotes']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.createQuotes = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.create = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.createQuotes(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when quote is created', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['create quotes']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.createQuotes = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.create = options => {
        return Promise.resolve({});
      };

      // When:
      let result = await service.createQuotes(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('getQuote', () => {
    it('should be a function', () => {
      expect(service.getQuote).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().getQuote()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = {
        token: {
          permissions: []
        }
      };
      expect(service.getQuote(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = {
        token: {
          permissions: ['']
        }
      };
      expect(service.getQuote(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['get quote']
        },
        query: {}
      };

      // When:
      let result = await service.getQuote(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when action fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['get quote'] },
        query: { name: 'kdmkdmkdm' },
        params: { quote: 1 }
      };

      validator.getQuote = {
        validate: () => Promise.resolve({
          query: {},
          params: { quote: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.getQuote(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when quote is not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get quote'] },
        query: { name: 'kdmkdmkdm' },
        params: { quote: 1 }
      };

      validator.getQuote = {
        validate: () => Promise.resolve({
          query: {},
          params: { quote: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.getQuote(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when quotes is found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get quote'] },
        query: { name: 'kdmkdmkdm' },
        params: { quote: 1 }
      };

      validator.getQuote = {
        validate: () => Promise.resolve({
          query: {},
          params: { quote: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      // When:
      let result = await service.getQuote(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('updateQuote', () => {
    it('should be a function', () => {
      expect(service.updateQuote).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().updateQuote()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.updateQuote(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.updateQuote(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = { token: { permissions: ['update quote'] }, query: {} };

      // When:
      let result = await service.updateQuote(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when quote search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['update quote'] },
        query: { name: 'kdmkdmkdm' },
        params: { quote: 1 }
      };

      validator.updateQuote = {
        validate: () => Promise.resolve({
          params: { quote: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.updateQuote(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when quote was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['update quote'] },
        query: { name: 'kdmkdmkdm' },
        params: { quote: 1 }
      };

      validator.updateQuote = {
        validate: () => Promise.resolve({
          params: { quote: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.updateQuote(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when quote update action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['update quote'] },
        query: { name: 'kdmkdmkdm' },
        params: { quote: 1 }
      };

      validator.updateQuote = {
        validate: () => Promise.resolve({
          params: { quote: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.update = options => {
        return Promise.reject(new Error('error mocked.'));
      }

      // When:
      let result = await service.updateQuote(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when quote is updated', async () => {
      // Given:
      let request = {
        token: { permissions: ['update quote'] },
        query: { name: 'kdmkdmkdm' },
        params: { quote: 1 }
      };

      validator.updateQuote = {
        validate: () => Promise.resolve({
          params: { quote: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.update = options => {
        return Promise.resolve({});
      }

      // When:
      let result = await service.updateQuote(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('deleteQuote', () => {
    it('should be a function', () => {
      expect(service.deleteQuote).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().deleteQuote()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.deleteQuote(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.deleteQuote(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = { token: { permissions: ['delete quote'] }, query: {} };
      validator.deleteQuote = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'))
        }
      };

      // When:
      let result = await service.deleteQuote(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when quote search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete quote'] },
        query: { name: 'kdmkdmkdm' },
        params: { quote: 1 }
      };

      validator.deleteQuote = {
        validate: () => Promise.resolve({
          params: { quote: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.deleteQuote(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when quote was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete quote'] },
        query: { name: 'kdmkdmkdm' },
        params: { quote: 1 }
      };

      validator.deleteQuote = {
        validate: () => Promise.resolve({
          params: { quote: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.deleteQuote(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when quote destroy action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete quote'] },
        query: { name: 'kdmkdmkdm' },
        params: { quote: 1 }
      };

      validator.deleteQuote = {
        validate: () => Promise.resolve({
          params: { quote: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.destroy = options => {
        return Promise.reject(new Error('error mocked.'));
      }

      // When:
      let result = await service.deleteQuote(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when quote is deleted', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete quote'] },
        query: { name: 'kdmkdmkdm' },
        params: { quote: 1 }
      };

      validator.deleteQuote = {
        validate: () => Promise.resolve({
          params: { quote: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.destroy = options => {
        return Promise.resolve({});
      }

      // When:
      let result = await service.deleteQuote(request);

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
        token: { permissions: ['get items from quote'] },
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
        token: { permissions: [ 'get items from quote' ] },
        query: { name: 'kdmkdmkdm' },
        params: { quote: 1 }
      };

      validator.getItems = {
        validate: () => Promise.resolve({
          params: { quote: 1 }
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
    it('should be rejected with error when quote was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get items from quote'] },
        query: { name: 'kdmkdmkdm' },
        params: { quote: 1 }
      };

      validator.getItems = {
        validate: () => Promise.resolve({
          params: { quote: 1 }
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
        token: { permissions: ['get items from quote'] },
        query: { name: 'kdmkdmkdm' },
        params: { quote: 1 }
      };

      validator.getItems = {
        validate: () => Promise.resolve({
          params: { quote: 1 }
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
        token: { permissions: ['get items from quote'] },
        query: { name: 'kdmkdmkdm' },
        params: { quote: 1 }
      };

      validator.getItems = {
        validate: () => Promise.resolve({
          params: { quote: 1 }
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
        token: { permissions: ['add items to quote'] },
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
        token: { permissions: [ 'add items to quote' ] },
        query: { name: 'kdmkdmkdm' },
        params: { quote: 1 }
      };

      validator.addItems = {
        validate: () => Promise.resolve({
          params: { quote: 1 }
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
    it('should be rejected with error when quote was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['add items to quote'] },
        query: { name: 'kdmkdmkdm' },
        params: { quote: 1 }
      };

      validator.addItems = {
        validate: () => Promise.resolve({
          params: { quote: 1 }
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
        token: { permissions: ['add items to quote'] },
        query: { name: 'kdmkdmkdm' },
        params: { quote: 1 },
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
        token: { permissions: ['add items to quote'] },
        query: { name: 'kdmkdmkdm' },
        params: { quote: 1 },
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
        token: { permissions: ['get item from quote'] },
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
        token: { permissions: [ 'get item from quote' ] },
        query: { name: 'kdmkdmkdm' },
        params: { quote: 1, item: 2 }
      };

      validator.getItem = {
        validate: () => Promise.resolve({
          params: { quote: 1 }
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
    it('should be rejected with error when quote was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get item from quote'] },
        query: { name: 'kdmkdmkdm' },
        params: { quote: 1, item: 2 }
      };

      validator.getItem = {
        validate: () => Promise.resolve({
          params: { quote: 1 }
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
        token: { permissions: ['get item from quote'] },
        query: { name: 'kdmkdmkdm' },
        params: { quote: 1, item: 2 }
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
        token: { permissions: ['get item from quote'] },
        query: { name: 'kdmkdmkdm' },
        params: { quote: 1, item: 2 }
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
        token: { permissions: ['get item from quote'] },
        query: { name: 'kdmkdmkdm' },
        params: { quote: 1 },
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
        token: { permissions: ['update item from quote'] },
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
    it('should be rejected with error when quote search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'update item from quote' ] },
        query: { name: 'kdmkdmkdm' },
        params: { quote: 1, item: 2 }
      };

      validator.updateItem = {
        validate: () => Promise.resolve({
          params: { quote: 1 }
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
    it('should be rejected with error when quote was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['update item from quote'] },
        query: { name: 'kdmkdmkdm' },
        params: { quote: 1, item: 2 }
      };

      validator.updateItem = {
        validate: () => Promise.resolve({
          params: { quote: 1 }
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
        token: { permissions: ['update item from quote'] },
        query: { name: 'kdmkdmkdm' },
        params: { quote: 1, item: 2 }
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
        token: { permissions: [ 'update item from quote' ] },
        query: { name: 'kdmkdmkdm' },
        params: { quote: 1, item: 2 }
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
        token: { permissions: ['update item from quote'] },
        query: { name: 'kdmkdmkdm' },
        params: { quote: 1 },
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
        token: { permissions: ['update item from quote'] },
        query: { name: 'kdmkdmkdm' },
        params: { quote: 1 },
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
        token: { permissions: ['remove item from quote'] },
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
    it('should be rejected with error when quote search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'remove item from quote' ] },
        query: { name: 'kdmkdmkdm' },
        params: { quote: 1, item: 2 }
      };

      validator.removeItem = {
        validate: () => Promise.resolve({
          params: { quote: 1 }
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
    it('should be rejected with error when quote was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['remove item from quote'] },
        query: { name: 'kdmkdmkdm' },
        params: { quote: 1, item: 2 }
      };

      validator.removeItem = {
        validate: () => Promise.resolve({
          params: { quote: 1 }
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
        token: { permissions: ['remove item from quote'] },
        query: { name: 'kdmkdmkdm' },
        params: { quote: 1, item: 2 }
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
        token: { permissions: [ 'remove item from quote' ] },
        query: { name: 'kdmkdmkdm' },
        params: { quote: 1, item: 2 }
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
        token: { permissions: ['remove item from quote'] },
        query: { name: 'kdmkdmkdm' },
        params: { quote: 1 }
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
        token: { permissions: ['remove item from quote'] },
        query: { name: 'kdmkdmkdm' },
        params: { quote: 1 }
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

  describe('getOrders', () => {
    it('should be a function', () => {
      expect(service.getOrders).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().getOrders()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.getOrders(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.getOrders(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['get orders from quote'] },
        query: {}
      };

      validator.getOrders = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'));
        }
      };

      // When:
      let result = await service.getOrders(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'get orders from quote' ] },
        query: { name: 'kdmkdmkdm' },
        params: { quote: 1 }
      };

      validator.getOrders = {
        validate: () => Promise.resolve({
          params: { quote: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.getOrders(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when quote was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get orders from quote'] },
        query: { name: 'kdmkdmkdm' },
        params: { quote: 1 }
      };

      validator.getOrders = {
        validate: () => Promise.resolve({
          params: { quote: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.getOrders(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when getOrders action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['get orders from quote'] },
        query: { name: 'kdmkdmkdm' },
        params: { quote: 1 }
      };

      validator.getOrders = {
        validate: () => Promise.resolve({
          params: { quote: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.getOrders = options => {
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
        token: { permissions: ['get orders from quote'] },
        query: { name: 'kdmkdmkdm' },
        params: { quote: 1 }
      };

      validator.getOrders = {
        validate: () => Promise.resolve({
          params: { quote: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.getOrders = options => {
        return Promise.resolve([]);
      }

      // When:
      let result = await service.getOrders(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('addOrders', () => {
    it('should be a function', () => {
      expect(service.addOrders).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().addOrders()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.addOrders(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.addOrders(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['add orders to quote'] },
        query: {}
      };

      validator.addOrders = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'));
        }
      };

      // When:
      let result = await service.addOrders(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'add orders to quote' ] },
        query: { name: 'kdmkdmkdm' },
        params: { quote: 1 }
      };

      validator.addOrders = {
        validate: () => Promise.resolve({
          params: { quote: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.addOrders(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when quote was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['add orders to quote'] },
        query: { name: 'kdmkdmkdm' },
        params: { quote: 1 }
      };

      validator.addOrders = {
        validate: () => Promise.resolve({
          params: { quote: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.addOrders(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when addOrders action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['add orders to quote'] },
        query: { name: 'kdmkdmkdm' },
        params: { quote: 1 },
        body: { orders: [] }
      };

      validator.addOrders = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.addOrders = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.addOrders(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when orders are added', async () => {
      // Given:
      let request = {
        token: { permissions: ['add orders to quote'] },
        query: { name: 'kdmkdmkdm' },
        params: { quote: 1 },
        body: { orders: [] }
      };

      validator.addOrders = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.addOrders = options => {
        return Promise.resolve([]);
      }

      // When:
      let result = await service.addOrders(request);

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
      let request = { token: { permissions: [] } };
      expect(service.getOrder(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.getOrder(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['get order from quote'] },
        query: {}
      };

      validator.getOrder = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'));
        }
      };

      // When:
      let result = await service.getOrder(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'get order from quote' ] },
        query: { name: 'kdmkdmkdm' },
        params: { quote: 1, order: 2 }
      };

      validator.getOrder = {
        validate: () => Promise.resolve({
          params: { quote: 1 }
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
    it('should be rejected with error when quote was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get order from quote'] },
        query: { name: 'kdmkdmkdm' },
        params: { quote: 1, order: 2 }
      };

      validator.getOrder = {
        validate: () => Promise.resolve({
          params: { quote: 1 }
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
    it('should be rejected with error when getOrder action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['get order from quote'] },
        query: { name: 'kdmkdmkdm' },
        params: { quote: 1, order: 2 }
      };

      validator.getOrder = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.getOrder = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.getOrder(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when order was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get order from quote'] },
        query: { name: 'kdmkdmkdm' },
        params: { quote: 1, order: 2 }
      };

      validator.getOrder = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.getOrder = options => {
        return Promise.resolve(null);
      }

      // When:
      let result = await service.getOrder(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when orders is found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get order from quote'] },
        query: { name: 'kdmkdmkdm' },
        params: { quote: 1 },
        body: { orders: [] }
      };

      validator.getOrder = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.getOrder = options => {
        return Promise.resolve({});
      }

      // When:
      let result = await service.getOrder(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });
});
