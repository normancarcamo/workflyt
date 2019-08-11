const Service = require('src/core/supervisors/supervisors-service');

describe('Service', () => {
  let service;
  let validator;
  let repository;

  beforeEach(() => {
    validator = {};

    repository = {
      findAll: options => Promise.resolve([]),
      findByPk: options => Promise.resolve({}),
      getEmployees: data => Promise.resolve([]),
    };

    service = Service({ repository, validator });
  });

  it('should module be a factory function', () => {
    expect(Service).toBeFunction();
  });

  it('should return an object when function is invoked', () => {
    expect(Service({})).toBeObject().not.toBeEmpty().toContainAllKeys([
      'getSupervisors',
      'getSupervisor',
      'getEmployees'
    ]);
  });

  describe('getSupervisors', () => {
    it('should be a function', () => {
      expect(service.getSupervisors).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().getSupervisors()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = {
        token: {
          permissions: []
        }
      };
      expect(service.getSupervisors(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = {
        token: {
          permissions: ['']
        }
      };
      expect(service.getSupervisors(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: [ 'get supervisors' ]
        },
        query: {}
      };

      // When:
      let result = await service.getSupervisors(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when action fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['get supervisors']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.getSupervisors = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.findAll = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.getSupervisors(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when supervisors are filtered', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['get supervisors']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.getSupervisors = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.findAll = options => {
        return Promise.resolve({});
      };

      // When:
      let result = await service.getSupervisors(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('getSupervisor', () => {
    it('should be a function', () => {
      expect(service.getSupervisor).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().getSupervisor()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = {
        token: {
          permissions: []
        }
      };
      expect(service.getSupervisor(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = {
        token: {
          permissions: ['']
        }
      };
      expect(service.getSupervisor(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: [ 'get supervisor' ]
        },
        query: {}
      };

      // When:
      let result = await service.getSupervisor(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when action fails', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'get supervisor' ] },
        query: { name: 'kdmkdmkdm' },
        params: { supervisor: 1 }
      };

      validator.getSupervisor = {
        validate: options => Promise.resolve({ ...options })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.getSupervisor(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when supervisor is not found', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'get supervisor' ] },
        query: { name: 'kdmkdmkdm' },
        params: { supervisor: 1 }
      };

      validator.getSupervisor = {
        validate: options => Promise.resolve({ ...options })
      };

      repository.findByPk = options => Promise.resolve(null);

      // When:
      let result = await service.getSupervisor(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when supervisors is found', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'get supervisor' ] },
        query: { name: 'kdmkdmkdm' },
        params: { supervisor: 1 }
      };

      validator.getSupervisor = {
        validate: options => Promise.resolve({ ...options })
      };

      repository.findByPk = options => Promise.resolve({});

      // When:
      let result = await service.getSupervisor(request);

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
      let request = {
        token: {
          permissions: []
        }
      };
      expect(service.getEmployees(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = {
        token: {
          permissions: ['']
        }
      };
      expect(service.getEmployees(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: [ 'get employees from supervisor' ]
        },
        query: {}
      };

      // When:
      let result = await service.getEmployees(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when action fails', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'get employees from supervisor' ] },
        query: { name: 'kdmkdmkdm' },
        params: { supervisor: 1 }
      };

      validator.getEmployees = {
        validate: options => Promise.resolve({ ...options })
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
    it('should be rejected with error when supervisor is not found', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'get employees from supervisor' ] },
        query: { name: 'kdmkdmkdm' },
        params: { supervisor: 1 }
      };

      validator.getEmployees = {
        validate: options => Promise.resolve({ ...options })
      };

      repository.findByPk = options => Promise.resolve(null);

      // When:
      let result = await service.getEmployees(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when search employees action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'get employees from supervisor' ] },
        query: { name: 'kdmkdmkdm' },
        params: { supervisor: 1 }
      };

      validator.getEmployees = {
        validate: options => Promise.resolve({ ...options })
      };

      repository.findByPk = options => Promise.resolve({});

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
        token: { permissions: [ 'get employees from supervisor' ] },
        query: { name: 'kdmkdmkdm' },
        params: { supervisor: 1 }
      };

      validator.getEmployees = {
        validate: options => Promise.resolve({ ...options })
      };

      repository.findByPk = options => Promise.resolve({});

      repository.getEmployees = options => Promise.resolve([]);

      // When:
      let result = await service.getEmployees(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });
});
