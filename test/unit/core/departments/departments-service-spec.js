const Service = require('src/core/departments/departments-service');

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
      getEmployees: options => Promise.resolve({}),
      addEmployees: options => Promise.resolve([]),
      getEmployee: options => Promise.resolve({}),
      updateEmployee: options => Promise.resolve({}),
      removeEmployee: options => Promise.resolve({})
    };

    service = Service({ repository, validator });
  });

  it('should module be a factory function', () => {
    expect(Service).toBeFunction();
  });

  it('should return an object when function is invoked', () => {
    expect(Service({})).toBeObject().not.toBeEmpty().toContainAllKeys([
      'getDepartments',
      'createDepartments',
      'getDepartment',
      'updateDepartment',
      'deleteDepartment',
      'getEmployees',
      'addEmployees',
      'getEmployee',
      'updateEmployee',
      'removeEmployee'
    ]);
  });

  describe('getDepartments', () => {
    it('should be a function', () => {
      expect(service.getDepartments).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().getDepartments()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = {
        token: {
          permissions: []
        }
      };
      expect(service.getDepartments(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = {
        token: {
          permissions: ['']
        }
      };
      expect(service.getDepartments(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['get departments']
        },
        query: {}
      };

      // When:
      let result = await service.getDepartments(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when action fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['get departments']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.getDepartments = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.findAll = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.getDepartments(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when departments are filtered', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['get departments']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.getDepartments = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.findAll = options => {
        return Promise.resolve({});
      };

      // When:
      let result = await service.getDepartments(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('createDepartments', () => {
    it('should be a function', () => {
      expect(service.createDepartments).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().createDepartments()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = {
        token: {
          permissions: []
        }
      };
      expect(service.createDepartments(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = {
        token: {
          permissions: ['']
        }
      };
      expect(service.createDepartments(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['create departments']
        },
        query: {}
      };

      // When:
      let result = await service.createDepartments(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when action fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['create departments']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.createDepartments = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.create = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.createDepartments(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when department is created', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['create departments']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.createDepartments = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.create = options => {
        return Promise.resolve({});
      };

      // When:
      let result = await service.createDepartments(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('getDepartment', () => {
    it('should be a function', () => {
      expect(service.getDepartment).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().getDepartment()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = {
        token: {
          permissions: []
        }
      };
      expect(service.getDepartment(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = {
        token: {
          permissions: ['']
        }
      };
      expect(service.getDepartment(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['get department']
        },
        query: {}
      };

      // When:
      let result = await service.getDepartment(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when action fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['get department'] },
        query: { name: 'kdmkdmkdm' },
        params: { department: 1 }
      };

      validator.getDepartment = {
        validate: () => Promise.resolve({
          query: {},
          params: { department: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.getDepartment(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when department is not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get department'] },
        query: { name: 'kdmkdmkdm' },
        params: { department: 1 }
      };

      validator.getDepartment = {
        validate: () => Promise.resolve({
          query: {},
          params: { department: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.getDepartment(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when departments is found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get department'] },
        query: { name: 'kdmkdmkdm' },
        params: { department: 1 }
      };

      validator.getDepartment = {
        validate: () => Promise.resolve({
          query: {},
          params: { department: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      // When:
      let result = await service.getDepartment(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('updateDepartment', () => {
    it('should be a function', () => {
      expect(service.updateDepartment).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().updateDepartment()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.updateDepartment(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.updateDepartment(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = { token: { permissions: ['update department'] }, query: {} };

      // When:
      let result = await service.updateDepartment(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when department search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['update department'] },
        query: { name: 'kdmkdmkdm' },
        params: { department: 1 }
      };

      validator.updateDepartment = {
        validate: () => Promise.resolve({
          params: { department: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.updateDepartment(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when department was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['update department'] },
        query: { name: 'kdmkdmkdm' },
        params: { department: 1 }
      };

      validator.updateDepartment = {
        validate: () => Promise.resolve({
          params: { department: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.updateDepartment(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when department update action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['update department'] },
        query: { name: 'kdmkdmkdm' },
        params: { department: 1 }
      };

      validator.updateDepartment = {
        validate: () => Promise.resolve({
          params: { department: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.update = options => {
        return Promise.reject(new Error('error mocked.'));
      }

      // When:
      let result = await service.updateDepartment(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when department is updated', async () => {
      // Given:
      let request = {
        token: { permissions: ['update department'] },
        query: { name: 'kdmkdmkdm' },
        params: { department: 1 }
      };

      validator.updateDepartment = {
        validate: () => Promise.resolve({
          params: { department: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.update = options => {
        return Promise.resolve({});
      }

      // When:
      let result = await service.updateDepartment(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('deleteDepartment', () => {
    it('should be a function', () => {
      expect(service.deleteDepartment).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().deleteDepartment()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.deleteDepartment(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.deleteDepartment(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = { token: { permissions: ['delete department'] }, query: {} };
      validator.deleteDepartment = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'))
        }
      };

      // When:
      let result = await service.deleteDepartment(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when department search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete department'] },
        query: { name: 'kdmkdmkdm' },
        params: { department: 1 }
      };

      validator.deleteDepartment = {
        validate: () => Promise.resolve({
          params: { department: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.deleteDepartment(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when department was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete department'] },
        query: { name: 'kdmkdmkdm' },
        params: { department: 1 }
      };

      validator.deleteDepartment = {
        validate: () => Promise.resolve({
          params: { department: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.deleteDepartment(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when department destroy action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete department'] },
        query: { name: 'kdmkdmkdm' },
        params: { department: 1 }
      };

      validator.deleteDepartment = {
        validate: () => Promise.resolve({
          params: { department: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.destroy = options => {
        return Promise.reject(new Error('error mocked.'));
      }

      // When:
      let result = await service.deleteDepartment(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when department is deleted', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete department'] },
        query: { name: 'kdmkdmkdm' },
        params: { department: 1 }
      };

      validator.deleteDepartment = {
        validate: () => Promise.resolve({
          params: { department: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.destroy = options => {
        return Promise.resolve({});
      }

      // When:
      let result = await service.deleteDepartment(request);

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
      let request = { token: { permissions: [] } };
      expect(service.getEmployees(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.getEmployees(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['get employees from department'] },
        query: {}
      };

      validator.getEmployees = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'));
        }
      };

      // When:
      let result = await service.getEmployees(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'get employees from department' ] },
        query: { name: 'kdmkdmkdm' },
        params: { department: 1 }
      };

      validator.getEmployees = {
        validate: () => Promise.resolve({
          params: { department: 1 }
        })
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
    it('should be rejected with error when department was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get employees from department'] },
        query: { name: 'kdmkdmkdm' },
        params: { department: 1 }
      };

      validator.getEmployees = {
        validate: () => Promise.resolve({
          params: { department: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.getEmployees(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when getEmployees action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['get employees from department'] },
        query: { name: 'kdmkdmkdm' },
        params: { department: 1 }
      };

      validator.getEmployees = {
        validate: () => Promise.resolve({
          params: { department: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

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
        token: { permissions: ['get employees from department'] },
        query: { name: 'kdmkdmkdm' },
        params: { department: 1 }
      };

      validator.getEmployees = {
        validate: () => Promise.resolve({
          params: { department: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.getEmployees = options => {
        return Promise.resolve([]);
      }

      // When:
      let result = await service.getEmployees(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('addEmployees', () => {
    it('should be a function', () => {
      expect(service.addEmployees).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().addEmployees()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.addEmployees(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.addEmployees(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['add employees to department'] },
        query: {}
      };

      validator.addEmployees = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'));
        }
      };

      // When:
      let result = await service.addEmployees(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'add employees to department' ] },
        query: { name: 'kdmkdmkdm' },
        params: { department: 1 }
      };

      validator.addEmployees = {
        validate: () => Promise.resolve({
          params: { department: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.addEmployees(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when department was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['add employees to department'] },
        query: { name: 'kdmkdmkdm' },
        params: { department: 1 }
      };

      validator.addEmployees = {
        validate: () => Promise.resolve({
          params: { department: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.addEmployees(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when addEmployees action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['add employees to department'] },
        query: { name: 'kdmkdmkdm' },
        params: { department: 1 },
        body: { employees: [] }
      };

      validator.addEmployees = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.addEmployees = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.addEmployees(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when employees are added', async () => {
      // Given:
      let request = {
        token: { permissions: ['add employees to department'] },
        query: { name: 'kdmkdmkdm' },
        params: { department: 1 },
        body: { employees: [] }
      };

      validator.addEmployees = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.addEmployees = options => {
        return Promise.resolve([]);
      }

      // When:
      let result = await service.addEmployees(request);

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
      let request = { token: { permissions: [] } };
      expect(service.getEmployee(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.getEmployee(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['get employee from department'] },
        query: {}
      };

      validator.getEmployee = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'));
        }
      };

      // When:
      let result = await service.getEmployee(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'get employee from department' ] },
        query: { name: 'kdmkdmkdm' },
        params: { department: 1, employee: 2 }
      };

      validator.getEmployee = {
        validate: () => Promise.resolve({
          params: { department: 1 }
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
    it('should be rejected with error when department was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get employee from department'] },
        query: { name: 'kdmkdmkdm' },
        params: { department: 1, employee: 2 }
      };

      validator.getEmployee = {
        validate: () => Promise.resolve({
          params: { department: 1 }
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
    it('should be rejected with error when getEmployee action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['get employee from department'] },
        query: { name: 'kdmkdmkdm' },
        params: { department: 1, employee: 2 }
      };

      validator.getEmployee = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.getEmployee = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.getEmployee(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when employee was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get employee from department'] },
        query: { name: 'kdmkdmkdm' },
        params: { department: 1, employee: 2 }
      };

      validator.getEmployee = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.getEmployee = options => {
        return Promise.resolve(null);
      }

      // When:
      let result = await service.getEmployee(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when employees is found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get employee from department'] },
        query: { name: 'kdmkdmkdm' },
        params: { department: 1 },
        body: { employees: [] }
      };

      validator.getEmployee = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.getEmployee = options => {
        return Promise.resolve({});
      }

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
      let request = {
        token: { permissions: ['update employee from department'] },
        query: {}
      };

      validator.updateEmployee = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'));
        }
      };

      // When:
      let result = await service.updateEmployee(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when department search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'update employee from department' ] },
        query: { name: 'kdmkdmkdm' },
        params: { department: 1, employee: 2 }
      };

      validator.updateEmployee = {
        validate: () => Promise.resolve({
          params: { department: 1 }
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
    it('should be rejected with error when department was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['update employee from department'] },
        query: { name: 'kdmkdmkdm' },
        params: { department: 1, employee: 2 }
      };

      validator.updateEmployee = {
        validate: () => Promise.resolve({
          params: { department: 1 }
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
    it('should be rejected with error when getEmployee action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['update employee from department'] },
        query: { name: 'kdmkdmkdm' },
        params: { department: 1, employee: 2 }
      };

      validator.updateEmployee = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getEmployee = options => {
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
        token: { permissions: [ 'update employee from department' ] },
        query: { name: 'kdmkdmkdm' },
        params: { department: 1, employee: 2 }
      };

      validator.updateEmployee = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getEmployee = options => Promise.resolve(null);

      // When:
      let result = await service.updateEmployee(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when employees update action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['update employee from department'] },
        query: { name: 'kdmkdmkdm' },
        params: { department: 1 },
        body: { employees: [] }
      };

      validator.updateEmployee = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getEmployee = options => Promise.resolve({});
      repository.updateEmployee = options => Promise.reject(new Error('error mocked.'));

      // When:
      let result = await service.updateEmployee(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when employees is found', async () => {
      // Given:
      let request = {
        token: { permissions: ['update employee from department'] },
        query: { name: 'kdmkdmkdm' },
        params: { department: 1 },
        body: { employees: [] }
      };

      validator.updateEmployee = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getEmployee = options => Promise.resolve({});
      repository.updateEmployee = options => Promise.resolve({});

      // When:
      let result = await service.updateEmployee(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('removeEmployee', () => {
    it('should be a function', () => {
      expect(service.removeEmployee).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().removeEmployee()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.removeEmployee(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.removeEmployee(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['remove employee from department'] },
        query: {}
      };

      validator.removeEmployee = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'));
        }
      };

      // When:
      let result = await service.removeEmployee(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when department search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'remove employee from department' ] },
        query: { name: 'kdmkdmkdm' },
        params: { department: 1, employee: 2 }
      };

      validator.removeEmployee = {
        validate: () => Promise.resolve({
          params: { department: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.removeEmployee(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when department was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['remove employee from department'] },
        query: { name: 'kdmkdmkdm' },
        params: { department: 1, employee: 2 }
      };

      validator.removeEmployee = {
        validate: () => Promise.resolve({
          params: { department: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.removeEmployee(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when getEmployee action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['remove employee from department'] },
        query: { name: 'kdmkdmkdm' },
        params: { department: 1, employee: 2 }
      };

      validator.removeEmployee = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getEmployee = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.removeEmployee(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when employee was not found', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'remove employee from department' ] },
        query: { name: 'kdmkdmkdm' },
        params: { department: 1, employee: 2 }
      };

      validator.removeEmployee = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getEmployee = options => Promise.resolve(null);

      // When:
      let result = await service.removeEmployee(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when employees remove action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['remove employee from department'] },
        query: { name: 'kdmkdmkdm' },
        params: { department: 1 }
      };

      validator.removeEmployee = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getEmployee = options => Promise.resolve({});
      repository.removeEmployee = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.removeEmployee(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when employees is found', async () => {
      // Given:
      let request = {
        token: { permissions: ['remove employee from department'] },
        query: { name: 'kdmkdmkdm' },
        params: { department: 1 }
      };

      validator.removeEmployee = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getEmployee = options => Promise.resolve({});
      repository.removeEmployee = options => Promise.resolve({});

      // When:
      let result = await service.removeEmployee(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });
});
