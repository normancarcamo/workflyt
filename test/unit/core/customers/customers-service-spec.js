const Service = require('src/core/customers/customers-service');

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
      getQuotes: options => Promise.resolve({}),
      addQuotes: options => Promise.resolve({}),
      getQuote: options => Promise.resolve({})
    };

    service = Service({ repository, validator });
  });

  it('should module be a factory function', () => {
    expect(Service).toBeFunction();
  });

  it('should return an object when function is invoked', () => {
    expect(Service({})).toBeObject().not.toBeEmpty().toContainAllKeys([
      'getCustomers',
      'createCustomers',
      'getCustomer',
      'updateCustomer',
      'deleteCustomer',
      'getQuotes',
      'addQuotes',
      'getQuote'
    ]);
  });

  describe('getCustomers', () => {
    it('should be a function', () => {
      expect(service.getCustomers).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().getCustomers()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = {
        token: {
          permissions: []
        }
      };
      expect(service.getCustomers(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = {
        token: {
          permissions: ['']
        }
      };
      expect(service.getCustomers(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['get customers']
        },
        query: {}
      };

      // When:
      let result = await service.getCustomers(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when action fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['get customers']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.getCustomers = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.findAll = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.getCustomers(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when customers are filtered', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['get customers']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.getCustomers = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.findAll = options => {
        return Promise.resolve({});
      };

      // When:
      let result = await service.getCustomers(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('createCustomers', () => {
    it('should be a function', () => {
      expect(service.createCustomers).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().createCustomers()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = {
        token: {
          permissions: []
        }
      };
      expect(service.createCustomers(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = {
        token: {
          permissions: ['']
        }
      };
      expect(service.createCustomers(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['create customers']
        },
        query: {}
      };

      // When:
      let result = await service.createCustomers(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when action fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['create customers']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.createCustomers = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.create = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.createCustomers(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when customer is created', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['create customers']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.createCustomers = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.create = options => {
        return Promise.resolve({});
      };

      // When:
      let result = await service.createCustomers(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('getCustomer', () => {
    it('should be a function', () => {
      expect(service.getCustomer).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().getCustomer()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = {
        token: {
          permissions: []
        }
      };
      expect(service.getCustomer(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = {
        token: {
          permissions: ['']
        }
      };
      expect(service.getCustomer(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['get customer']
        },
        query: {}
      };

      // When:
      let result = await service.getCustomer(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when action fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['get customer'] },
        query: { name: 'kdmkdmkdm' },
        params: { customer: 1 }
      };

      validator.getCustomer = {
        validate: () => Promise.resolve({
          query: {},
          params: { customer: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.getCustomer(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when customer is not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get customer'] },
        query: { name: 'kdmkdmkdm' },
        params: { customer: 1 }
      };

      validator.getCustomer = {
        validate: () => Promise.resolve({
          query: {},
          params: { customer: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.getCustomer(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when customers is found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get customer'] },
        query: { name: 'kdmkdmkdm' },
        params: { customer: 1 }
      };

      validator.getCustomer = {
        validate: () => Promise.resolve({
          query: {},
          params: { customer: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      // When:
      let result = await service.getCustomer(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('updateCustomer', () => {
    it('should be a function', () => {
      expect(service.updateCustomer).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().updateCustomer()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.updateCustomer(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.updateCustomer(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = { token: { permissions: ['update customer'] }, query: {} };

      // When:
      let result = await service.updateCustomer(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when customer search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['update customer'] },
        query: { name: 'kdmkdmkdm' },
        params: { customer: 1 }
      };

      validator.updateCustomer = {
        validate: () => Promise.resolve({
          params: { customer: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.updateCustomer(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when customer was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['update customer'] },
        query: { name: 'kdmkdmkdm' },
        params: { customer: 1 }
      };

      validator.updateCustomer = {
        validate: () => Promise.resolve({
          params: { customer: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.updateCustomer(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when customer update action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['update customer'] },
        query: { name: 'kdmkdmkdm' },
        params: { customer: 1 }
      };

      validator.updateCustomer = {
        validate: () => Promise.resolve({
          params: { customer: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.update = options => {
        return Promise.reject(new Error('error mocked.'));
      }

      // When:
      let result = await service.updateCustomer(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when customer is updated', async () => {
      // Given:
      let request = {
        token: { permissions: ['update customer'] },
        query: { name: 'kdmkdmkdm' },
        params: { customer: 1 }
      };

      validator.updateCustomer = {
        validate: () => Promise.resolve({
          params: { customer: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.update = options => {
        return Promise.resolve({});
      }

      // When:
      let result = await service.updateCustomer(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('deleteCustomer', () => {
    it('should be a function', () => {
      expect(service.deleteCustomer).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().deleteCustomer()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.deleteCustomer(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.deleteCustomer(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = { token: { permissions: ['delete customer'] }, query: {} };
      validator.deleteCustomer = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'))
        }
      };

      // When:
      let result = await service.deleteCustomer(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when customer search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete customer'] },
        query: { name: 'kdmkdmkdm' },
        params: { customer: 1 }
      };

      validator.deleteCustomer = {
        validate: () => Promise.resolve({
          params: { customer: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.deleteCustomer(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when customer was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete customer'] },
        query: { name: 'kdmkdmkdm' },
        params: { customer: 1 }
      };

      validator.deleteCustomer = {
        validate: () => Promise.resolve({
          params: { customer: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.deleteCustomer(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when customer destroy action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete customer'] },
        query: { name: 'kdmkdmkdm' },
        params: { customer: 1 }
      };

      validator.deleteCustomer = {
        validate: () => Promise.resolve({
          params: { customer: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.destroy = options => {
        return Promise.reject(new Error('error mocked.'));
      }

      // When:
      let result = await service.deleteCustomer(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when customer is deleted', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete customer'] },
        query: { name: 'kdmkdmkdm' },
        params: { customer: 1 }
      };

      validator.deleteCustomer = {
        validate: () => Promise.resolve({
          params: { customer: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.destroy = options => {
        return Promise.resolve({});
      }

      // When:
      let result = await service.deleteCustomer(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('getQuotes', () => {
    it('should be a function', () => {
      expect(service.getQuotes).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().getQuotes()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.getQuotes(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.getQuotes(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['get quotes from customer'] },
        query: {}
      };

      validator.getQuotes = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'));
        }
      };

      // When:
      let result = await service.getQuotes(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'get quotes from customer' ] },
        query: { name: 'kdmkdmkdm' },
        params: { customer: 1 }
      };

      validator.getQuotes = {
        validate: () => Promise.resolve({
          params: { customer: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.getQuotes(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when customer was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get quotes from customer'] },
        query: { name: 'kdmkdmkdm' },
        params: { customer: 1 }
      };

      validator.getQuotes = {
        validate: () => Promise.resolve({
          params: { customer: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.getQuotes(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when getQuotes action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['get quotes from customer'] },
        query: { name: 'kdmkdmkdm' },
        params: { customer: 1 }
      };

      validator.getQuotes = {
        validate: () => Promise.resolve({
          params: { customer: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.getQuotes = options => {
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
        token: { permissions: ['get quotes from customer'] },
        query: { name: 'kdmkdmkdm' },
        params: { customer: 1 }
      };

      validator.getQuotes = {
        validate: () => Promise.resolve({
          params: { customer: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.getQuotes = options => {
        return Promise.resolve([]);
      }

      // When:
      let result = await service.getQuotes(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('addQuotes', () => {
    it('should be a function', () => {
      expect(service.addQuotes).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().addQuotes()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.addQuotes(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.addQuotes(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['add quotes to customer'] },
        query: {}
      };

      validator.addQuotes = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'));
        }
      };

      // When:
      let result = await service.addQuotes(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'add quotes to customer' ] },
        query: { name: 'kdmkdmkdm' },
        params: { customer: 1 }
      };

      validator.addQuotes = {
        validate: () => Promise.resolve({
          params: { customer: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.addQuotes(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when customer was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['add quotes to customer'] },
        query: { name: 'kdmkdmkdm' },
        params: { customer: 1 }
      };

      validator.addQuotes = {
        validate: () => Promise.resolve({
          params: { customer: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.addQuotes(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when addQuotes action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['add quotes to customer'] },
        query: { name: 'kdmkdmkdm' },
        params: { customer: 1 },
        body: { quotes: [] }
      };

      validator.addQuotes = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.addQuotes = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.addQuotes(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when quotes are added', async () => {
      // Given:
      let request = {
        token: { permissions: ['add quotes to customer'] },
        query: { name: 'kdmkdmkdm' },
        params: { customer: 1 },
        body: { quotes: [] }
      };

      validator.addQuotes = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.addQuotes = options => {
        return Promise.resolve([]);
      }

      // When:
      let result = await service.addQuotes(request);

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
      let request = { token: { permissions: [] } };
      expect(service.getQuote(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.getQuote(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['get quote from customer'] },
        query: {}
      };

      validator.getQuote = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'));
        }
      };

      // When:
      let result = await service.getQuote(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'get quote from customer' ] },
        query: { name: 'kdmkdmkdm' },
        params: { customer: 1, quote: 2 }
      };

      validator.getQuote = {
        validate: () => Promise.resolve({
          params: { customer: 1 }
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
    it('should be rejected with error when customer was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get quote from customer'] },
        query: { name: 'kdmkdmkdm' },
        params: { customer: 1, quote: 2 }
      };

      validator.getQuote = {
        validate: () => Promise.resolve({
          params: { customer: 1 }
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
    it('should be rejected with error when getQuote action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['get quote from customer'] },
        query: { name: 'kdmkdmkdm' },
        params: { customer: 1, quote: 2 }
      };

      validator.getQuote = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.getQuote = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.getQuote(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when quote was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get quote from customer'] },
        query: { name: 'kdmkdmkdm' },
        params: { customer: 1, quote: 2 }
      };

      validator.getQuote = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.getQuote = options => {
        return Promise.resolve(null);
      }

      // When:
      let result = await service.getQuote(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when quotes is found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get quote from customer'] },
        query: { name: 'kdmkdmkdm' },
        params: { customer: 1 },
        body: { quotes: [] }
      };

      validator.getQuote = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.getQuote = options => {
        return Promise.resolve({});
      }

      // When:
      let result = await service.getQuote(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });
});
