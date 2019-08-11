const Service = require('src/core/employees/employees-service');

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
      getUser: options => Promise.resolve({}),
      setUser: options => Promise.resolve({}),
      removeUser: options => Promise.resolve({}),
      getQuotes: options => Promise.resolve([]),
      addQuotes: options => Promise.resolve([]),
      getQuote: options => Promise.resolve({}),
      getSupervisors: options => Promise.resolve([]),
      addSupervisors: options => Promise.resolve([]),
      getSupervisor: options => Promise.resolve({}),
      updateSupervisor: options => Promise.resolve({}),
      removeSupervisor: options => Promise.resolve({})
    };

    service = Service({ repository, validator });
  });

  it('should module be a factory function', () => {
    expect(Service).toBeFunction();
  });

  it('should return an object when function is invoked', () => {
    expect(Service({})).toBeObject().not.toBeEmpty().toContainAllKeys([
      'getEmployees',
      'createEmployees',
      'getEmployee',
      'updateEmployee',
      'deleteEmployee',
      'getUser',
      'setUser',
      'removeUser',
      'getQuotes',
      'addQuotes',
      'getQuote',
      'getSupervisors',
      'addSupervisors',
      'getSupervisor',
      'updateSupervisor',
      'removeSupervisor'
    ]);
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
          permissions: ['get employees']
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
        token: {
          permissions: ['get employees']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.getEmployees = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.findAll = options => {
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
        token: {
          permissions: ['get employees']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.getEmployees = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.findAll = options => {
        return Promise.resolve({});
      };

      // When:
      let result = await service.getEmployees(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('createEmployees', () => {
    it('should be a function', () => {
      expect(service.createEmployees).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().createEmployees()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = {
        token: {
          permissions: []
        }
      };
      expect(service.createEmployees(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = {
        token: {
          permissions: ['']
        }
      };
      expect(service.createEmployees(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['create employees']
        },
        query: {}
      };

      // When:
      let result = await service.createEmployees(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when action fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['create employees']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.createEmployees = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.create = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.createEmployees(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when employee is created', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['create employees']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.createEmployees = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.create = options => {
        return Promise.resolve({});
      };

      // When:
      let result = await service.createEmployees(request);

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
      let request = {
        token: {
          permissions: []
        }
      };
      expect(service.getEmployee(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = {
        token: {
          permissions: ['']
        }
      };
      expect(service.getEmployee(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['get employee']
        },
        query: {}
      };

      // When:
      let result = await service.getEmployee(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when action fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['get employee'] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1 }
      };

      validator.getEmployee = {
        validate: () => Promise.resolve({
          query: {},
          params: { employee: 1 }
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
    it('should be rejected with error when employee is not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get employee'] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1 }
      };

      validator.getEmployee = {
        validate: () => Promise.resolve({
          query: {},
          params: { employee: 1 }
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
    it('should be resolved with data when employees is found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get employee'] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1 }
      };

      validator.getEmployee = {
        validate: () => Promise.resolve({
          query: {},
          params: { employee: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

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
      let request = { token: { permissions: ['update employee'] }, query: {} };

      // When:
      let result = await service.updateEmployee(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when employee search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['update employee'] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1 }
      };

      validator.updateEmployee = {
        validate: () => Promise.resolve({
          params: { employee: 1 }
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
    it('should be rejected with error when employee was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['update employee'] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1 }
      };

      validator.updateEmployee = {
        validate: () => Promise.resolve({
          params: { employee: 1 }
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
    it('should be rejected with error when employee update action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['update employee'] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1 }
      };

      validator.updateEmployee = {
        validate: () => Promise.resolve({
          params: { employee: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.update = options => {
        return Promise.reject(new Error('error mocked.'));
      }

      // When:
      let result = await service.updateEmployee(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when employee is updated', async () => {
      // Given:
      let request = {
        token: { permissions: ['update employee'] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1 }
      };

      validator.updateEmployee = {
        validate: () => Promise.resolve({
          params: { employee: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.update = options => {
        return Promise.resolve({});
      }

      // When:
      let result = await service.updateEmployee(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('deleteEmployee', () => {
    it('should be a function', () => {
      expect(service.deleteEmployee).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().deleteEmployee()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.deleteEmployee(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.deleteEmployee(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = { token: { permissions: ['delete employee'] }, query: {} };
      validator.deleteEmployee = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'))
        }
      };

      // When:
      let result = await service.deleteEmployee(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when employee search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete employee'] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1 }
      };

      validator.deleteEmployee = {
        validate: () => Promise.resolve({
          params: { employee: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.deleteEmployee(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when employee was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete employee'] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1 }
      };

      validator.deleteEmployee = {
        validate: () => Promise.resolve({
          params: { employee: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.deleteEmployee(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when employee destroy action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete employee'] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1 }
      };

      validator.deleteEmployee = {
        validate: () => Promise.resolve({
          params: { employee: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.destroy = options => {
        return Promise.reject(new Error('error mocked.'));
      }

      // When:
      let result = await service.deleteEmployee(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when employee is deleted', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete employee'] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1 }
      };

      validator.deleteEmployee = {
        validate: () => Promise.resolve({
          params: { employee: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.destroy = options => {
        return Promise.resolve({});
      }

      // When:
      let result = await service.deleteEmployee(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('getUser', () => {
    it('should be a function', () => {
      expect(service.getUser).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().getUser()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.getUser(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.getUser(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['get user from employee'] },
        query: {}
      };

      validator.getUser = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'));
        }
      };

      // When:
      let result = await service.getUser(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'get user from employee' ] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1 }
      };

      validator.getUser = {
        validate: options => Promise.resolve({ ...options })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.getUser(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when employee was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get user from employee'] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1 }
      };

      validator.getUser = {
        validate: options => Promise.resolve({ ...options })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.getUser(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when user search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'get user from employee' ] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1 }
      };

      validator.getUser = {
        validate: options => Promise.resolve({ ...options })
      };

      repository.findByPk = options => Promise.resolve({});

      repository.getUser = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.getUser(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when user is found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get user from employee'] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1 }
      };

      validator.getUser = {
        validate: options => Promise.resolve({ ...options })
      };
      repository.findByPk = options => Promise.resolve({});
      repository.getUser = options => Promise.resolve({});

      // When:
      let result = await service.getUser(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('setUser', () => {
    it('should be a function', () => {
      expect(service.setUser).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().setUser()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.setUser(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.setUser(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['set user to employee'] },
        query: {}
      };

      validator.setUser = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'));
        }
      };

      // When:
      let result = await service.setUser(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'set user to employee' ] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1 },
        body: { user: 2 }
      };

      validator.setUser = {
        validate: options => Promise.resolve({ ...options })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.setUser(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when employee was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['set user to employee'] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1 },
        body: { user: 2 }
      };

      validator.setUser = {
        validate: options => Promise.resolve({ ...options })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.setUser(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when user search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['set user to employee'] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1 },
        body: { user: 2 }
      };

      validator.setUser = {
        validate: options => Promise.resolve({ ...options })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.getUser = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.setUser(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when user is not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['set user to employee'] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1 },
        body: { user: 2 }
      };

      validator.setUser = {
        validate: options => Promise.resolve({ ...options })
      };
      repository.findByPk = options => Promise.resolve({});
      repository.getUser = options => Promise.resolve(null);

      // When:
      let result = await service.setUser(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when tried to set the user', async () => {
      // Given:
      let request = {
        token: { permissions: ['set user to employee'] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1 },
        body: { user: 2 }
      };

      validator.setUser = {
        validate: options => Promise.resolve({ ...options })
      };
      repository.findByPk = options => Promise.resolve({});
      repository.getUser = options => Promise.resolve({});
      repository.setUser = options => Promise.reject(new Error('error mocked.'));

      // When:
      let result = await service.setUser(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when user is set', async () => {
      // Given:
      let request = {
        token: { permissions: ['set user to employee'] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1 },
        body: { user: 2 }
      };

      validator.setUser = {
        validate: options => Promise.resolve({ ...options })
      };
      repository.findByPk = options => Promise.resolve({});
      repository.getUser = options => Promise.resolve({});
      repository.setUser = options => Promise.resolve({});

      // When:
      let result = await service.setUser(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('removeUser', () => {
    it('should be a function', () => {
      expect(service.removeUser).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().removeUser()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.removeUser(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.removeUser(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['remove user from employee'] },
        query: {}
      };

      validator.removeUser = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'));
        }
      };

      // When:
      let result = await service.removeUser(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'remove user from employee' ] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1 }
      };

      validator.removeUser = {
        validate: options => Promise.resolve({ ...options })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.removeUser(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when employee was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['remove user from employee'] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1 }
      };

      validator.removeUser = {
        validate: options => Promise.resolve({ ...options })
      };

      repository.findByPk = options => Promise.resolve(null);

      // When:
      let result = await service.removeUser(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when tried to remove the user', async () => {
      // Given:
      let request = {
        token: { permissions: ['remove user from employee'] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1 }
      };

      validator.removeUser = {
        validate: options => Promise.resolve({ ...options })
      };
      repository.findByPk = options => Promise.resolve({});
      repository.getUser = options => Promise.resolve({});
      repository.removeUser = options => Promise.reject(new Error('error mocked.'));

      // When:
      let result = await service.removeUser(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when user is set', async () => {
      // Given:
      let request = {
        token: { permissions: ['remove user from employee'] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1 }
      };

      validator.removeUser = {
        validate: options => Promise.resolve({ ...options })
      };
      repository.findByPk = options => Promise.resolve({});
      repository.getUser = options => Promise.resolve({});
      repository.removeUser = options => Promise.resolve({});

      // When:
      let result = await service.removeUser(request);

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
        token: { permissions: ['get quotes from employee'] },
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
        token: { permissions: [ 'get quotes from employee' ] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1 }
      };

      validator.getQuotes = {
        validate: options => Promise.resolve({ ...options })
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
    it('should be rejected with error when employee was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get quotes from employee'] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1 }
      };

      validator.getQuotes = {
        validate: options => Promise.resolve({ ...options })
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
    it('should be rejected with error when user search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['get quotes from employee'] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1 }
      };

      validator.getQuotes = {
        validate: options => Promise.resolve({ ...options })
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
    it('should be resolved with data when user is found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get quotes from employee'] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1 }
      };

      validator.getQuotes = {
        validate: options => Promise.resolve({ ...options })
      };
      repository.findByPk = options => Promise.resolve({});
      repository.getQuotes = options => Promise.resolve([]);

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
        token: { permissions: ['add quotes to employee'] },
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
        token: { permissions: [ 'add quotes to employee' ] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1 },
        body: { quotes: [] }
      };

      validator.addQuotes = {
        validate: options => Promise.resolve({ ...options })
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
    it('should be rejected with error when employee was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['add quotes to employee'] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1 },
        body: { quotes: [] }
      };

      validator.addQuotes = {
        validate: options => Promise.resolve({ ...options })
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
    it('should be rejected with error when user search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['add quotes to employee'] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1 },
        body: { quotes: [] }
      };

      validator.addQuotes = {
        validate: options => Promise.resolve({ ...options })
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
    it('should be resolved with data when user is found', async () => {
      // Given:
      let request = {
        token: { permissions: ['add quotes to employee'] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1 },
        body: { quotes: [] }
      };

      validator.addQuotes = {
        validate: options => Promise.resolve({ ...options })
      };
      repository.findByPk = options => Promise.resolve({});
      repository.addQuotes = options => Promise.resolve([]);

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
        token: { permissions: ['get quote from employee'] },
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
        token: { permissions: [ 'get quote from employee' ] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1 },
        body: { quotes: [] }
      };

      validator.getQuote = {
        validate: options => Promise.resolve({ ...options })
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
    it('should be rejected with error when employee was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get quote from employee'] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1 },
        body: { quotes: [] }
      };

      validator.getQuote = {
        validate: options => Promise.resolve({ ...options })
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
    it('should be rejected with error when quote search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['get quote from employee'] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1 },
        body: { quotes: [] }
      };

      validator.getQuote = {
        validate: options => Promise.resolve({ ...options })
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
    it('should be rejected with error when quote is not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get quote from employee'] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1 },
        body: { quotes: [] }
      };

      validator.getQuote = {
        validate: options => Promise.resolve({ ...options })
      };
      repository.findByPk = options => Promise.resolve({});
      repository.getQuote = options => Promise.resolve(null);

      // When:
      let result = await service.getQuote(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when quote is found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get quote from employee'] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1 },
        body: { quotes: [] }
      };

      validator.getQuote = {
        validate: options => Promise.resolve({ ...options })
      };
      repository.findByPk = options => Promise.resolve({});
      repository.getQuote = options => Promise.resolve({});

      // When:
      let result = await service.getQuote(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('getSupervisors', () => {
    it('should be a function', () => {
      expect(service.getSupervisors).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().getSupervisors()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.getSupervisors(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.getSupervisors(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['get supervisors from employee'] },
        query: {}
      };

      validator.getSupervisors = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'));
        }
      };

      // When:
      let result = await service.getSupervisors(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'get supervisors from employee' ] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1 }
      };

      validator.getSupervisors = {
        validate: () => Promise.resolve({
          params: { employee: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.getSupervisors(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when employee was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get supervisors from employee'] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1 }
      };

      validator.getSupervisors = {
        validate: () => Promise.resolve({
          params: { employee: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.getSupervisors(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when getSupervisors action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['get supervisors from employee'] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1 }
      };

      validator.getSupervisors = {
        validate: () => Promise.resolve({
          params: { employee: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.getSupervisors = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.getSupervisors(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when employees are filtered', async () => {
      // Given:
      let request = {
        token: { permissions: ['get supervisors from employee'] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1 }
      };

      validator.getSupervisors = {
        validate: () => Promise.resolve({
          params: { employee: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.getSupervisors = options => {
        return Promise.resolve([]);
      }

      // When:
      let result = await service.getSupervisors(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('addSupervisors', () => {
    it('should be a function', () => {
      expect(service.addSupervisors).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().addSupervisors()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.addSupervisors(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.addSupervisors(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['add supervisors to employee'] },
        query: {}
      };

      validator.addSupervisors = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'));
        }
      };

      // When:
      let result = await service.addSupervisors(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'add supervisors to employee' ] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1 }
      };

      validator.addSupervisors = {
        validate: () => Promise.resolve({
          params: { employee: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.addSupervisors(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when employee was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['add supervisors to employee'] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1 }
      };

      validator.addSupervisors = {
        validate: () => Promise.resolve({
          params: { employee: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.addSupervisors(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when addSupervisors action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['add supervisors to employee'] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1 },
        body: { employees: [] }
      };

      validator.addSupervisors = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.addSupervisors = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.addSupervisors(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when employees are added', async () => {
      // Given:
      let request = {
        token: { permissions: ['add supervisors to employee'] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1 },
        body: { employees: [] }
      };

      validator.addSupervisors = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.addSupervisors = options => {
        return Promise.resolve([]);
      }

      // When:
      let result = await service.addSupervisors(request);

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
      let request = { token: { permissions: [] } };
      expect(service.getSupervisor(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.getSupervisor(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['get supervisor from employee'] },
        query: {}
      };

      validator.getSupervisor = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'));
        }
      };

      // When:
      let result = await service.getSupervisor(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'get supervisor from employee' ] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1, employee: 2 }
      };

      validator.getSupervisor = {
        validate: () => Promise.resolve({
          params: { employee: 1 }
        })
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
    it('should be rejected with error when employee was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get supervisor from employee'] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1, employee: 2 }
      };

      validator.getSupervisor = {
        validate: () => Promise.resolve({
          params: { employee: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.getSupervisor(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when getSupervisor action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['get supervisor from employee'] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1, employee: 2 }
      };

      validator.getSupervisor = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.getSupervisor = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.getSupervisor(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when employee was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get supervisor from employee'] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1, employee: 2 }
      };

      validator.getSupervisor = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.getSupervisor = options => {
        return Promise.resolve(null);
      }

      // When:
      let result = await service.getSupervisor(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when employees is found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get supervisor from employee'] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1 },
        body: { employees: [] }
      };

      validator.getSupervisor = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.getSupervisor = options => {
        return Promise.resolve({});
      }

      // When:
      let result = await service.getSupervisor(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('updateSupervisor', () => {
    it('should be a function', () => {
      expect(service.updateSupervisor).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().updateSupervisor()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.updateSupervisor(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.updateSupervisor(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['update supervisor from employee'] },
        query: {}
      };

      validator.updateSupervisor = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'));
        }
      };

      // When:
      let result = await service.updateSupervisor(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when employee search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'update supervisor from employee' ] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1, employee: 2 }
      };

      validator.updateSupervisor = {
        validate: options => Promise.resolve({ ...options })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.updateSupervisor(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when employee was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['update supervisor from employee'] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1, employee: 2 }
      };

      validator.updateSupervisor = {
        validate: options => Promise.resolve({ ...options })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.updateSupervisor(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when getEmployee action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'update supervisor from employee' ] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1, supervisor: 2 }
      };

      validator.updateSupervisor = {
        validate: options => Promise.resolve({ ...options })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getSupervisor = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.updateSupervisor(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when employee was not found', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'update supervisor from employee' ] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1, supervisor: 2 }
      };

      validator.updateSupervisor = {
        validate: options => Promise.resolve({ ...options })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getSupervisor = options => Promise.resolve(null);

      // When:
      let result = await service.updateSupervisor(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when employees update action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['update supervisor from employee'] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1, supervisor: 2 },
        body: { employees: [] }
      };

      validator.updateSupervisor = {
        validate: options => Promise.resolve({ ...options })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getSupervisor = options => Promise.resolve({});
      repository.updateSupervisor = options => Promise.reject(new Error('error mocked.'));

      // When:
      let result = await service.updateSupervisor(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when employees is found', async () => {
      // Given:
      let request = {
        token: { permissions: ['update supervisor from employee'] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1, supervisor: 2 },
        body: { employees: [] }
      };

      validator.updateSupervisor = {
        validate: options => Promise.resolve({ ...options })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getSupervisor = options => Promise.resolve({});
      repository.updateSupervisor = options => Promise.resolve({});

      // When:
      let result = await service.updateSupervisor(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('removeSupervisor', () => {
    it('should be a function', () => {
      expect(service.removeSupervisor).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().removeSupervisor()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.removeSupervisor(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.removeSupervisor(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['remove supervisor from employee'] },
        query: {},
        params: { employee: 1, supervisor: 2 }
      };

      validator.removeSupervisor = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'));
        }
      };

      // When:
      let result = await service.removeSupervisor(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when employee search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'remove supervisor from employee' ] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1, supervisor: 2 }
      };

      validator.removeSupervisor = {
        validate: options => Promise.resolve({ ...options })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.removeSupervisor(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when employee was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['remove supervisor from employee'] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1, supervisor: 2 }
      };

      validator.removeSupervisor = {
        validate: options => Promise.resolve({ ...options })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.removeSupervisor(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when supervisor search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['remove supervisor from employee'] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1, supervisor: 2 }
      };

      validator.removeSupervisor = {
        validate: options => Promise.resolve({ ...options })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getSupervisor = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.removeSupervisor(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when supervisor was not found', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'remove supervisor from employee' ] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1, supervisor: 2 }
      };

      validator.removeSupervisor = {
        validate: options => Promise.resolve({ ...options })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getSupervisor = options => Promise.resolve(null);

      // When:
      let result = await service.removeSupervisor(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when employees remove action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['remove supervisor from employee'] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1, supervisor: 2 }
      };

      validator.removeSupervisor = {
        validate: options => Promise.resolve({ ...options })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getSupervisor = options => Promise.resolve({});
      repository.removeSupervisor = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.removeSupervisor(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when employees is found', async () => {
      // Given:
      let request = {
        token: { permissions: ['remove supervisor from employee'] },
        query: { name: 'kdmkdmkdm' },
        params: { employee: 1, supervisor: 2 }
      };

      validator.removeSupervisor = {
        validate: options => Promise.resolve({ ...options })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getSupervisor = options => Promise.resolve({});
      repository.removeSupervisor = options => Promise.resolve({});

      // When:
      let result = await service.removeSupervisor(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });
});
