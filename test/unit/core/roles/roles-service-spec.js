const Service = require('src/core/roles/roles-service');

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
      getPermissions: options => Promise.resolve({}),
      addPermissions: options => Promise.resolve([]),
      getPermission: options => Promise.resolve({}),
      updatePermission: options => Promise.resolve({}),
      removePermission: options => Promise.resolve({})
    };

    service = Service({ repository, validator });
  });

  it('should module be a factory function', () => {
    expect(Service).toBeFunction();
  });

  it('should return an object when function is invoked', () => {
    expect(Service({})).toBeObject().not.toBeEmpty().toContainAllKeys([
      'getRoles',
      'createRoles',
      'getRole',
      'updateRole',
      'deleteRole',
      'getPermissions',
      'addPermissions',
      'getPermission',
      'updatePermission',
      'removePermission'
    ]);
  });

  describe('getRoles', () => {
    it('should be a function', () => {
      expect(service.getRoles).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().getRoles()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = {
        token: {
          permissions: []
        }
      };
      expect(service.getRoles(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = {
        token: {
          permissions: ['']
        }
      };
      expect(service.getRoles(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['get roles']
        },
        query: {}
      };

      // When:
      let result = await service.getRoles(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when action fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['get roles']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.getRoles = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.findAll = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.getRoles(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when roles are filtered', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['get roles']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.getRoles = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.findAll = options => {
        return Promise.resolve({});
      };

      // When:
      let result = await service.getRoles(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('createRoles', () => {
    it('should be a function', () => {
      expect(service.createRoles).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().createRoles()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = {
        token: {
          permissions: []
        }
      };
      expect(service.createRoles(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = {
        token: {
          permissions: ['']
        }
      };
      expect(service.createRoles(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['create roles']
        },
        query: {}
      };

      // When:
      let result = await service.createRoles(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when action fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['create roles']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.createRoles = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.create = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.createRoles(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when role is created', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['create roles']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.createRoles = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.create = options => {
        return Promise.resolve({});
      };

      // When:
      let result = await service.createRoles(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('getRole', () => {
    it('should be a function', () => {
      expect(service.getRole).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().getRole()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = {
        token: {
          permissions: []
        }
      };
      expect(service.getRole(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = {
        token: {
          permissions: ['']
        }
      };
      expect(service.getRole(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['get role']
        },
        query: {}
      };

      // When:
      let result = await service.getRole(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when action fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['get role'] },
        query: { name: 'kdmkdmkdm' },
        params: { role: 1 }
      };

      validator.getRole = {
        validate: () => Promise.resolve({
          query: {},
          params: { role: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.getRole(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when role is not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get role'] },
        query: { name: 'kdmkdmkdm' },
        params: { role: 1 }
      };

      validator.getRole = {
        validate: () => Promise.resolve({
          query: {},
          params: { role: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.getRole(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when roles is found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get role'] },
        query: { name: 'kdmkdmkdm' },
        params: { role: 1 }
      };

      validator.getRole = {
        validate: () => Promise.resolve({
          query: {},
          params: { role: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      // When:
      let result = await service.getRole(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('updateRole', () => {
    it('should be a function', () => {
      expect(service.updateRole).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().updateRole()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.updateRole(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.updateRole(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = { token: { permissions: ['update role'] }, query: {} };

      // When:
      let result = await service.updateRole(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when role search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['update role'] },
        query: { name: 'kdmkdmkdm' },
        params: { role: 1 }
      };

      validator.updateRole = {
        validate: () => Promise.resolve({
          params: { role: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.updateRole(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when role was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['update role'] },
        query: { name: 'kdmkdmkdm' },
        params: { role: 1 }
      };

      validator.updateRole = {
        validate: () => Promise.resolve({
          params: { role: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.updateRole(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when role update action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['update role'] },
        query: { name: 'kdmkdmkdm' },
        params: { role: 1 }
      };

      validator.updateRole = {
        validate: () => Promise.resolve({
          params: { role: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.update = options => {
        return Promise.reject(new Error('error mocked.'));
      }

      // When:
      let result = await service.updateRole(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when role is updated', async () => {
      // Given:
      let request = {
        token: { permissions: ['update role'] },
        query: { name: 'kdmkdmkdm' },
        params: { role: 1 }
      };

      validator.updateRole = {
        validate: () => Promise.resolve({
          params: { role: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.update = options => {
        return Promise.resolve({});
      }

      // When:
      let result = await service.updateRole(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('deleteRole', () => {
    it('should be a function', () => {
      expect(service.deleteRole).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().deleteRole()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.deleteRole(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.deleteRole(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = { token: { permissions: ['delete role'] }, query: {} };
      validator.deleteRole = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'))
        }
      };

      // When:
      let result = await service.deleteRole(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when role search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete role'] },
        query: { name: 'kdmkdmkdm' },
        params: { role: 1 }
      };

      validator.deleteRole = {
        validate: () => Promise.resolve({
          params: { role: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.deleteRole(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when role was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete role'] },
        query: { name: 'kdmkdmkdm' },
        params: { role: 1 }
      };

      validator.deleteRole = {
        validate: () => Promise.resolve({
          params: { role: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.deleteRole(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when role destroy action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete role'] },
        query: { name: 'kdmkdmkdm' },
        params: { role: 1 }
      };

      validator.deleteRole = {
        validate: () => Promise.resolve({
          params: { role: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.destroy = options => {
        return Promise.reject(new Error('error mocked.'));
      }

      // When:
      let result = await service.deleteRole(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when role is deleted', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete role'] },
        query: { name: 'kdmkdmkdm' },
        params: { role: 1 }
      };

      validator.deleteRole = {
        validate: () => Promise.resolve({
          params: { role: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.destroy = options => {
        return Promise.resolve({});
      }

      // When:
      let result = await service.deleteRole(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('getPermissions', () => {
    it('should be a function', () => {
      expect(service.getPermissions).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().getPermissions()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.getPermissions(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.getPermissions(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['get permissions from role'] },
        query: {}
      };

      validator.getPermissions = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'));
        }
      };

      // When:
      let result = await service.getPermissions(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'get permissions from role' ] },
        query: { name: 'kdmkdmkdm' },
        params: { role: 1 }
      };

      validator.getPermissions = {
        validate: () => Promise.resolve({
          params: { role: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.getPermissions(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when role was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get permissions from role'] },
        query: { name: 'kdmkdmkdm' },
        params: { role: 1 }
      };

      validator.getPermissions = {
        validate: () => Promise.resolve({
          params: { role: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.getPermissions(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when getPermissions action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['get permissions from role'] },
        query: { name: 'kdmkdmkdm' },
        params: { role: 1 }
      };

      validator.getPermissions = {
        validate: () => Promise.resolve({
          params: { role: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.getPermissions = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.getPermissions(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when permissions are filtered', async () => {
      // Given:
      let request = {
        token: { permissions: ['get permissions from role'] },
        query: { name: 'kdmkdmkdm' },
        params: { role: 1 }
      };

      validator.getPermissions = {
        validate: () => Promise.resolve({
          params: { role: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.getPermissions = options => {
        return Promise.resolve([]);
      }

      // When:
      let result = await service.getPermissions(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('addPermissions', () => {
    it('should be a function', () => {
      expect(service.addPermissions).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().addPermissions()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.addPermissions(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.addPermissions(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['add permissions to role'] },
        query: {}
      };

      validator.addPermissions = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'));
        }
      };

      // When:
      let result = await service.addPermissions(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'add permissions to role' ] },
        query: { name: 'kdmkdmkdm' },
        params: { role: 1 }
      };

      validator.addPermissions = {
        validate: () => Promise.resolve({
          params: { role: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.addPermissions(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when role was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['add permissions to role'] },
        query: { name: 'kdmkdmkdm' },
        params: { role: 1 }
      };

      validator.addPermissions = {
        validate: () => Promise.resolve({
          params: { role: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.addPermissions(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when addPermissions action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['add permissions to role'] },
        query: { name: 'kdmkdmkdm' },
        params: { role: 1 },
        body: { permissions: [] }
      };

      validator.addPermissions = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.addPermissions = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.addPermissions(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when permissions are added', async () => {
      // Given:
      let request = {
        token: { permissions: ['add permissions to role'] },
        query: { name: 'kdmkdmkdm' },
        params: { role: 1 },
        body: { permissions: [] }
      };

      validator.addPermissions = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.addPermissions = options => {
        return Promise.resolve([]);
      }

      // When:
      let result = await service.addPermissions(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('getPermission', () => {
    it('should be a function', () => {
      expect(service.getPermission).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().getPermission()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.getPermission(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.getPermission(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['get permission from role'] },
        query: {}
      };

      validator.getPermission = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'));
        }
      };

      // When:
      let result = await service.getPermission(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'get permission from role' ] },
        query: { name: 'kdmkdmkdm' },
        params: { role: 1, permission: 2 }
      };

      validator.getPermission = {
        validate: () => Promise.resolve({
          params: { role: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.getPermission(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when role was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get permission from role'] },
        query: { name: 'kdmkdmkdm' },
        params: { role: 1, permission: 2 }
      };

      validator.getPermission = {
        validate: () => Promise.resolve({
          params: { role: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.getPermission(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when getPermission action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['get permission from role'] },
        query: { name: 'kdmkdmkdm' },
        params: { role: 1, permission: 2 }
      };

      validator.getPermission = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.getPermission = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.getPermission(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when permission was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get permission from role'] },
        query: { name: 'kdmkdmkdm' },
        params: { role: 1, permission: 2 }
      };

      validator.getPermission = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.getPermission = options => {
        return Promise.resolve(null);
      }

      // When:
      let result = await service.getPermission(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when permissions is found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get permission from role'] },
        query: { name: 'kdmkdmkdm' },
        params: { role: 1 },
        body: { permissions: [] }
      };

      validator.getPermission = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.getPermission = options => {
        return Promise.resolve({});
      }

      // When:
      let result = await service.getPermission(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('updatePermission', () => {
    it('should be a function', () => {
      expect(service.updatePermission).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().updatePermission()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.updatePermission(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.updatePermission(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['update permission from role'] },
        query: {}
      };

      validator.updatePermission = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'));
        }
      };

      // When:
      let result = await service.updatePermission(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when role search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'update permission from role' ] },
        query: { name: 'kdmkdmkdm' },
        params: { role: 1, permission: 2 }
      };

      validator.updatePermission = {
        validate: () => Promise.resolve({
          params: { role: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.updatePermission(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when role was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['update permission from role'] },
        query: { name: 'kdmkdmkdm' },
        params: { role: 1, permission: 2 }
      };

      validator.updatePermission = {
        validate: () => Promise.resolve({
          params: { role: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.updatePermission(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when getPermission action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['update permission from role'] },
        query: { name: 'kdmkdmkdm' },
        params: { role: 1, permission: 2 }
      };

      validator.updatePermission = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getPermission = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.updatePermission(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when permission was not found', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'update permission from role' ] },
        query: { name: 'kdmkdmkdm' },
        params: { role: 1, permission: 2 }
      };

      validator.updatePermission = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getPermission = options => Promise.resolve(null);

      // When:
      let result = await service.updatePermission(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when permissions update action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['update permission from role'] },
        query: { name: 'kdmkdmkdm' },
        params: { role: 1 },
        body: { permissions: [] }
      };

      validator.updatePermission = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getPermission = options => Promise.resolve({});
      repository.updatePermission = options => Promise.reject(new Error('error mocked.'));

      // When:
      let result = await service.updatePermission(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when permissions is found', async () => {
      // Given:
      let request = {
        token: { permissions: ['update permission from role'] },
        query: { name: 'kdmkdmkdm' },
        params: { role: 1 },
        body: { permissions: [] }
      };

      validator.updatePermission = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getPermission = options => Promise.resolve({});
      repository.updatePermission = options => Promise.resolve({});

      // When:
      let result = await service.updatePermission(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('removePermission', () => {
    it('should be a function', () => {
      expect(service.removePermission).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().removePermission()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.removePermission(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.removePermission(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['remove permission from role'] },
        query: {}
      };

      validator.removePermission = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'));
        }
      };

      // When:
      let result = await service.removePermission(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when role search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'remove permission from role' ] },
        query: { name: 'kdmkdmkdm' },
        params: { role: 1, permission: 2 }
      };

      validator.removePermission = {
        validate: () => Promise.resolve({
          params: { role: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.removePermission(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when role was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['remove permission from role'] },
        query: { name: 'kdmkdmkdm' },
        params: { role: 1, permission: 2 }
      };

      validator.removePermission = {
        validate: () => Promise.resolve({
          params: { role: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.removePermission(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when getPermission action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['remove permission from role'] },
        query: { name: 'kdmkdmkdm' },
        params: { role: 1, permission: 2 }
      };

      validator.removePermission = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getPermission = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.removePermission(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when permission was not found', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'remove permission from role' ] },
        query: { name: 'kdmkdmkdm' },
        params: { role: 1, permission: 2 }
      };

      validator.removePermission = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getPermission = options => Promise.resolve(null);

      // When:
      let result = await service.removePermission(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when permissions remove action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['remove permission from role'] },
        query: { name: 'kdmkdmkdm' },
        params: { role: 1 }
      };

      validator.removePermission = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getPermission = options => Promise.resolve({});
      repository.removePermission = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.removePermission(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when permissions is found', async () => {
      // Given:
      let request = {
        token: { permissions: ['remove permission from role'] },
        query: { name: 'kdmkdmkdm' },
        params: { role: 1 }
      };

      validator.removePermission = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getPermission = options => Promise.resolve({});
      repository.removePermission = options => Promise.resolve({});

      // When:
      let result = await service.removePermission(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });
});
