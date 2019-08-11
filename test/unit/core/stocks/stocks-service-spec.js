const Service = require('src/core/stocks/stocks-service');

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
      destroy: options => Promise.resolve({})
    };

    service = Service({ repository, validator });
  });

  it('should module be a factory function', () => {
    expect(Service).toBeFunction();
  });

  it('should return an object when function is invoked', () => {
    expect(Service({})).toBeObject().not.toBeEmpty().toContainAllKeys([
      'getStocks',
      'createStocks',
      'getStock',
      'updateStock',
      'deleteStock'
    ]);
  });

  describe('getStocks', () => {
    it('should be a function', () => {
      expect(service.getStocks).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().getStocks()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = {
        token: {
          permissions: []
        }
      };
      expect(service.getStocks(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = {
        token: {
          permissions: ['']
        }
      };
      expect(service.getStocks(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['get stocks']
        },
        query: {}
      };

      // When:
      let result = await service.getStocks(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when action fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['get stocks']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.getStocks = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.findAll = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.getStocks(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when stocks are filtered', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['get stocks']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.getStocks = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.findAll = options => {
        return Promise.resolve({});
      };

      // When:
      let result = await service.getStocks(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('createStocks', () => {
    it('should be a function', () => {
      expect(service.createStocks).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().createStocks()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = {
        token: {
          permissions: []
        }
      };
      expect(service.createStocks(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = {
        token: {
          permissions: ['']
        }
      };
      expect(service.createStocks(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['create stocks']
        },
        query: {}
      };

      // When:
      let result = await service.createStocks(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when action fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['create stocks']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.createStocks = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.create = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.createStocks(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when stock is created', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['create stocks']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.createStocks = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.create = options => {
        return Promise.resolve({});
      };

      // When:
      let result = await service.createStocks(request);

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
      let request = {
        token: {
          permissions: []
        }
      };
      expect(service.getStock(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = {
        token: {
          permissions: ['']
        }
      };
      expect(service.getStock(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['get stock']
        },
        query: {}
      };

      // When:
      let result = await service.getStock(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when action fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['get stock'] },
        query: { name: 'kdmkdmkdm' },
        params: { stock: 1 }
      };

      validator.getStock = {
        validate: () => Promise.resolve({
          query: {},
          params: { stock: 1 }
        })
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
    it('should be rejected with error when stock is not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get stock'] },
        query: { name: 'kdmkdmkdm' },
        params: { stock: 1 }
      };

      validator.getStock = {
        validate: () => Promise.resolve({
          query: {},
          params: { stock: 1 }
        })
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
    it('should be resolved with data when stocks is found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get stock'] },
        query: { name: 'kdmkdmkdm' },
        params: { stock: 1 }
      };

      validator.getStock = {
        validate: () => Promise.resolve({
          query: {},
          params: { stock: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      // When:
      let result = await service.getStock(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('updateStock', () => {
    it('should be a function', () => {
      expect(service.updateStock).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().updateStock()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.updateStock(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.updateStock(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = { token: { permissions: ['update stock'] }, query: {} };

      // When:
      let result = await service.updateStock(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when stock search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['update stock'] },
        query: { name: 'kdmkdmkdm' },
        params: { stock: 1 }
      };

      validator.updateStock = {
        validate: () => Promise.resolve({
          params: { stock: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.updateStock(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when stock was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['update stock'] },
        query: { name: 'kdmkdmkdm' },
        params: { stock: 1 }
      };

      validator.updateStock = {
        validate: () => Promise.resolve({
          params: { stock: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.updateStock(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when stock update action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['update stock'] },
        query: { name: 'kdmkdmkdm' },
        params: { stock: 1 }
      };

      validator.updateStock = {
        validate: () => Promise.resolve({
          params: { stock: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.update = options => {
        return Promise.reject(new Error('error mocked.'));
      }

      // When:
      let result = await service.updateStock(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when stock is updated', async () => {
      // Given:
      let request = {
        token: { permissions: ['update stock'] },
        query: { name: 'kdmkdmkdm' },
        params: { stock: 1 }
      };

      validator.updateStock = {
        validate: () => Promise.resolve({
          params: { stock: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.update = options => {
        return Promise.resolve({});
      }

      // When:
      let result = await service.updateStock(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('deleteStock', () => {
    it('should be a function', () => {
      expect(service.deleteStock).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().deleteStock()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.deleteStock(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.deleteStock(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = { token: { permissions: ['delete stock'] }, query: {} };
      validator.deleteStock = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'))
        }
      };

      // When:
      let result = await service.deleteStock(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when stock search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete stock'] },
        query: { name: 'kdmkdmkdm' },
        params: { stock: 1 }
      };

      validator.deleteStock = {
        validate: () => Promise.resolve({
          params: { stock: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.deleteStock(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when stock was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete stock'] },
        query: { name: 'kdmkdmkdm' },
        params: { stock: 1 }
      };

      validator.deleteStock = {
        validate: () => Promise.resolve({
          params: { stock: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.deleteStock(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when stock destroy action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete stock'] },
        query: { name: 'kdmkdmkdm' },
        params: { stock: 1 }
      };

      validator.deleteStock = {
        validate: () => Promise.resolve({
          params: { stock: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.destroy = options => {
        return Promise.reject(new Error('error mocked.'));
      }

      // When:
      let result = await service.deleteStock(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when stock is deleted', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete stock'] },
        query: { name: 'kdmkdmkdm' },
        params: { stock: 1 }
      };

      validator.deleteStock = {
        validate: () => Promise.resolve({
          params: { stock: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.destroy = options => {
        return Promise.resolve({});
      }

      // When:
      let result = await service.deleteStock(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });
});
