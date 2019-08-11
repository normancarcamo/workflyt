const Service = require('src/core/companies/companies-service');

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
      'getCompanies',
      'createCompanies',
      'getCompany',
      'updateCompany',
      'deleteCompany'
    ]);
  });

  describe('getCompanies', () => {
    it('should be a function', () => {
      expect(service.getCompanies).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().getCompanies()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = {
        token: {
          permissions: []
        }
      };
      expect(service.getCompanies(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = {
        token: {
          permissions: ['']
        }
      };
      expect(service.getCompanies(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['get companies']
        },
        query: {}
      };

      // When:
      let result = await service.getCompanies(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when action fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['get companies']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.getCompanies = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.findAll = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.getCompanies(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when companies are filtered', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['get companies']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.getCompanies = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.findAll = options => {
        return Promise.resolve({});
      };

      // When:
      let result = await service.getCompanies(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('createCompanies', () => {
    it('should be a function', () => {
      expect(service.createCompanies).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().createCompanies()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = {
        token: {
          permissions: []
        }
      };
      expect(service.createCompanies(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = {
        token: {
          permissions: ['']
        }
      };
      expect(service.createCompanies(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['create companies']
        },
        query: {}
      };

      // When:
      let result = await service.createCompanies(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when action fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['create companies']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.createCompanies = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.create = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.createCompanies(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when company is created', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['create companies']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.createCompanies = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.create = options => {
        return Promise.resolve({});
      };

      // When:
      let result = await service.createCompanies(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('getCompany', () => {
    it('should be a function', () => {
      expect(service.getCompany).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().getCompany()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = {
        token: {
          permissions: []
        }
      };
      expect(service.getCompany(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = {
        token: {
          permissions: ['']
        }
      };
      expect(service.getCompany(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['get company']
        },
        query: {}
      };

      // When:
      let result = await service.getCompany(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when action fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['get company'] },
        query: { name: 'kdmkdmkdm' },
        params: { company: 1 }
      };

      validator.getCompany = {
        validate: () => Promise.resolve({
          query: {},
          params: { company: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.getCompany(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when company is not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get company'] },
        query: { name: 'kdmkdmkdm' },
        params: { company: 1 }
      };

      validator.getCompany = {
        validate: () => Promise.resolve({
          query: {},
          params: { company: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.getCompany(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when companies is found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get company'] },
        query: { name: 'kdmkdmkdm' },
        params: { company: 1 }
      };

      validator.getCompany = {
        validate: () => Promise.resolve({
          query: {},
          params: { company: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      // When:
      let result = await service.getCompany(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('updateCompany', () => {
    it('should be a function', () => {
      expect(service.updateCompany).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().updateCompany()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.updateCompany(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.updateCompany(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = { token: { permissions: ['update company'] }, query: {} };

      // When:
      let result = await service.updateCompany(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when company search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['update company'] },
        query: { name: 'kdmkdmkdm' },
        params: { company: 1 }
      };

      validator.updateCompany = {
        validate: () => Promise.resolve({
          params: { company: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.updateCompany(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when company was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['update company'] },
        query: { name: 'kdmkdmkdm' },
        params: { company: 1 }
      };

      validator.updateCompany = {
        validate: () => Promise.resolve({
          params: { company: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.updateCompany(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when company update action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['update company'] },
        query: { name: 'kdmkdmkdm' },
        params: { company: 1 }
      };

      validator.updateCompany = {
        validate: () => Promise.resolve({
          params: { company: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.update = options => {
        return Promise.reject(new Error('error mocked.'));
      }

      // When:
      let result = await service.updateCompany(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when company is updated', async () => {
      // Given:
      let request = {
        token: { permissions: ['update company'] },
        query: { name: 'kdmkdmkdm' },
        params: { company: 1 }
      };

      validator.updateCompany = {
        validate: () => Promise.resolve({
          params: { company: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.update = options => {
        return Promise.resolve({});
      }

      // When:
      let result = await service.updateCompany(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('deleteCompany', () => {
    it('should be a function', () => {
      expect(service.deleteCompany).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().deleteCompany()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.deleteCompany(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.deleteCompany(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = { token: { permissions: ['delete company'] }, query: {} };
      validator.deleteCompany = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'))
        }
      };

      // When:
      let result = await service.deleteCompany(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when company search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete company'] },
        query: { name: 'kdmkdmkdm' },
        params: { company: 1 }
      };

      validator.deleteCompany = {
        validate: () => Promise.resolve({
          params: { company: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.deleteCompany(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when company was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete company'] },
        query: { name: 'kdmkdmkdm' },
        params: { company: 1 }
      };

      validator.deleteCompany = {
        validate: () => Promise.resolve({
          params: { company: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.deleteCompany(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when company destroy action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete company'] },
        query: { name: 'kdmkdmkdm' },
        params: { company: 1 }
      };

      validator.deleteCompany = {
        validate: () => Promise.resolve({
          params: { company: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.destroy = options => {
        return Promise.reject(new Error('error mocked.'));
      }

      // When:
      let result = await service.deleteCompany(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when company is deleted', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete company'] },
        query: { name: 'kdmkdmkdm' },
        params: { company: 1 }
      };

      validator.deleteCompany = {
        validate: () => Promise.resolve({
          params: { company: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.destroy = options => {
        return Promise.resolve({});
      }

      // When:
      let result = await service.deleteCompany(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });
});
