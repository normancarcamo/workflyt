const Service = require('src/core/users/users-service');

describe('Service', () => {
  let service;
  let validator;
  let repository;
  let adapter;

  beforeEach(() => {
    validator = {};

    repository = {
      findAll: options => Promise.resolve({}),
      create: data => Promise.resolve({}),
      findByUsername: options => Promise.resolve({}),
      findByPk: options => Promise.resolve({}),
      update: options => Promise.resolve({}),
      destroy: options => Promise.resolve({}),
      getRoles: options => Promise.resolve({}),
      addRoles: options => Promise.resolve([]),
      getRole: options => Promise.resolve({}),
      updateRole: options => Promise.resolve({}),
      removeRole: options => Promise.resolve({})
    };

    adapter = {
      hashPassword: async values => true,
      signToken: options => 'ddkmdkdm.dkdnkddkndkd.dkndknd'
    };

    service = Service({ repository, validator, adapter });
  });

  it('should module be a factory function', () => {
    expect(Service).toBeFunction();
  });

  it('should return an object when function is invoked', () => {
    expect(Service({})).toBeObject().not.toBeEmpty().toContainAllKeys([
      'getUsers',
      'createUsers',
      'getUser',
      'updateUser',
      'deleteUser',
      'getRoles',
      'addRoles',
      'getRole',
      'updateRole',
      'removeRole'
    ]);
  });

  describe('getUsers', () => {
    it('should be a function', () => {
      expect(service.getUsers).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().getUsers()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = {
        token: {
          permissions: []
        }
      };
      expect(service.getUsers(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = {
        token: {
          permissions: ['']
        }
      };
      expect(service.getUsers(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['get users']
        },
        query: {}
      };

      // When:
      let result = await service.getUsers(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when action fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['get users']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.getUsers = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.findAll = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.getUsers(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when users are filtered', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['get users']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.getUsers = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.findAll = options => {
        return Promise.resolve({});
      };

      // When:
      let result = await service.getUsers(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('createUsers', () => {
    it('should be a function', () => {
      expect(service.createUsers).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().createUsers()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = {
        token: {
          permissions: []
        }
      };
      expect(service.createUsers(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = {
        token: {
          permissions: ['']
        }
      };
      expect(service.createUsers(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: [ 'create users' ]
        },
        query: {}
      };

      // When:
      let result = await service.createUsers(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when search the user', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'create users' ] },
        body: { username: 'kdmkdmkdm', password: 'dkkdkdmkdm' }
      };

      validator.createUsers = {
        validate: options => Promise.resolve({ ...options })
      };

      repository.findByUsername = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.createUsers(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when user is taken', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'create users' ] },
        body: { username: 'kdmkdmkdm', password: 'dkkdkdmkdm' }
      };

      validator.createUsers = {
        validate: options => Promise.resolve({ ...options })
      };

      repository.findByUsername = options => {
        return Promise.resolve({});
      };

      // When:
      let result = await service.createUsers(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when the was hashing the password', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'create users' ] },
        body: { username: 'kdmkdmkdm', password: 'dkkdkdmkdm' }
      };

      validator.createUsers = {
        validate: options => Promise.resolve({ ...options })
      };

      adapter.hashPassword = options => {
        return Promise.reject(new Error('hash error.'));
      };

      repository.findByUsername = options => Promise.resolve(null);

      // When:
      let result = await service.createUsers(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when action create fails', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'create users' ] },
        body: { username: 'kdmkdmkdm', password: 'dkkdkdmkdm' }
      };

      validator.createUsers = {
        validate: options => Promise.resolve({ ...options })
      };

      repository.findByUsername = options => Promise.resolve(null);

      adapter.hashPassword = options => {
        return Promise.resolve('edmkmdkmf.dkmdkfmdf.fdfdf');
      };

      repository.create = options => {
        return Promise.reject(new Error('create error.'));
      };

      // When:
      let result = await service.createUsers(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when user is created', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'create users' ] },
        body: { username: 'kdmkdmkdm', password: 'dkkdkdmkdm' }
      };

      validator.createUsers = {
        validate: options => Promise.resolve({ ...options })
      };

      repository.findByUsername = options => Promise.resolve(null);

      adapter.hashPassword = options => {
        return Promise.resolve('edmkmdkmf.dkmdkfmdf.fdfdf');
      };

      repository.create = options => Promise.resolve({ password: 'dkdmkm' });

      // When:
      let result = await service.createUsers(request);

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
      let request = {
        token: {
          permissions: []
        }
      };
      expect(service.getUser(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = {
        token: {
          permissions: ['']
        }
      };
      expect(service.getUser(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['get user']
        },
        query: {}
      };

      // When:
      let result = await service.getUser(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when action fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['get user'] },
        query: { name: 'kdmkdmkdm' },
        params: { user: 1 }
      };

      validator.getUser = {
        validate: () => Promise.resolve({
          query: {},
          params: { user: 1 }
        })
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
    it('should be rejected with error when user is not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get user'] },
        query: { name: 'kdmkdmkdm' },
        params: { user: 1 }
      };

      validator.getUser = {
        validate: () => Promise.resolve({
          query: {},
          params: { user: 1 }
        })
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
    it('should be resolved with data when users is found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get user'] },
        query: { name: 'kdmkdmkdm' },
        params: { user: 1 }
      };

      validator.getUser = {
        validate: () => Promise.resolve({
          query: {},
          params: { user: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      // When:
      let result = await service.getUser(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('updateUser', () => {
    it('should be a function', () => {
      expect(service.updateUser).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().updateUser()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.updateUser(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.updateUser(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = { token: { permissions: ['update user'] }, query: {} };

      // When:
      let result = await service.updateUser(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when user search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['update user'] },
        query: { name: 'kdmkdmkdm' },
        params: { user: 1 }
      };

      validator.updateUser = {
        validate: () => Promise.resolve({
          params: { user: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.updateUser(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when user was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['update user'] },
        query: { name: 'kdmkdmkdm' },
        params: { user: 1 }
      };

      validator.updateUser = {
        validate: () => Promise.resolve({
          params: { user: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.updateUser(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when user update action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['update user'] },
        query: { name: 'kdmkdmkdm' },
        params: { user: 1 }
      };

      validator.updateUser = {
        validate: () => Promise.resolve({
          params: { user: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.update = options => {
        return Promise.reject(new Error('error mocked.'));
      }

      // When:
      let result = await service.updateUser(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when user is updated', async () => {
      // Given:
      let request = {
        token: { permissions: ['update user'] },
        query: { name: 'kdmkdmkdm' },
        params: { user: 1 }
      };

      validator.updateUser = {
        validate: () => Promise.resolve({
          params: { user: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.update = options => {
        return Promise.resolve({});
      }

      // When:
      let result = await service.updateUser(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('deleteUser', () => {
    it('should be a function', () => {
      expect(service.deleteUser).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().deleteUser()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.deleteUser(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.deleteUser(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = { token: { permissions: ['delete user'] }, query: {} };
      validator.deleteUser = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'))
        }
      };

      // When:
      let result = await service.deleteUser(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when user search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete user'] },
        query: { name: 'kdmkdmkdm' },
        params: { user: 1 }
      };

      validator.deleteUser = {
        validate: () => Promise.resolve({
          params: { user: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.deleteUser(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when user was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete user'] },
        query: { name: 'kdmkdmkdm' },
        params: { user: 1 }
      };

      validator.deleteUser = {
        validate: () => Promise.resolve({
          params: { user: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.deleteUser(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when user destroy action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete user'] },
        query: { name: 'kdmkdmkdm' },
        params: { user: 1 }
      };

      validator.deleteUser = {
        validate: () => Promise.resolve({
          params: { user: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.destroy = options => {
        return Promise.reject(new Error('error mocked.'));
      }

      // When:
      let result = await service.deleteUser(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when user is deleted', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete user'] },
        query: { name: 'kdmkdmkdm' },
        params: { user: 1 }
      };

      validator.deleteUser = {
        validate: () => Promise.resolve({
          params: { user: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.destroy = options => {
        return Promise.resolve({});
      }

      // When:
      let result = await service.deleteUser(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('getRoles', () => {
    it('should be a function', () => {
      expect(service.getRoles).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().getRoles()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.getRoles(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.getRoles(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['get roles from user'] },
        query: {}
      };

      validator.getRoles = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'));
        }
      };

      // When:
      let result = await service.getRoles(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'get roles from user' ] },
        query: { name: 'kdmkdmkdm' },
        params: { user: 1 }
      };

      validator.getRoles = {
        validate: () => Promise.resolve({
          params: { user: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.getRoles(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when user was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get roles from user'] },
        query: { name: 'kdmkdmkdm' },
        params: { user: 1 }
      };

      validator.getRoles = {
        validate: () => Promise.resolve({
          params: { user: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.getRoles(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when getRoles action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['get roles from user'] },
        query: { name: 'kdmkdmkdm' },
        params: { user: 1 }
      };

      validator.getRoles = {
        validate: () => Promise.resolve({
          params: { user: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.getRoles = options => {
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
        token: { permissions: ['get roles from user'] },
        query: { name: 'kdmkdmkdm' },
        params: { user: 1 }
      };

      validator.getRoles = {
        validate: () => Promise.resolve({
          params: { user: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.getRoles = options => {
        return Promise.resolve([]);
      }

      // When:
      let result = await service.getRoles(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('addRoles', () => {
    it('should be a function', () => {
      expect(service.addRoles).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().addRoles()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.addRoles(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.addRoles(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['add roles to user'] },
        query: {}
      };

      validator.addRoles = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'));
        }
      };

      // When:
      let result = await service.addRoles(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'add roles to user' ] },
        query: { name: 'kdmkdmkdm' },
        params: { user: 1 }
      };

      validator.addRoles = {
        validate: () => Promise.resolve({
          params: { user: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.addRoles(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when user was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['add roles to user'] },
        query: { name: 'kdmkdmkdm' },
        params: { user: 1 }
      };

      validator.addRoles = {
        validate: () => Promise.resolve({
          params: { user: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.addRoles(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when addRoles action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['add roles to user'] },
        query: { name: 'kdmkdmkdm' },
        params: { user: 1 },
        body: { roles: [] }
      };

      validator.addRoles = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.addRoles = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.addRoles(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when roles are added', async () => {
      // Given:
      let request = {
        token: { permissions: ['add roles to user'] },
        query: { name: 'kdmkdmkdm' },
        params: { user: 1 },
        body: { roles: [] }
      };

      validator.addRoles = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.addRoles = options => {
        return Promise.resolve([]);
      }

      // When:
      let result = await service.addRoles(request);

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
      let request = { token: { permissions: [] } };
      expect(service.getRole(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.getRole(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['get role from user'] },
        query: {}
      };

      validator.getRole = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'));
        }
      };

      // When:
      let result = await service.getRole(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'get role from user' ] },
        query: { name: 'kdmkdmkdm' },
        params: { user: 1, role: 2 }
      };

      validator.getRole = {
        validate: () => Promise.resolve({
          params: { user: 1 }
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
    it('should be rejected with error when user was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get role from user'] },
        query: { name: 'kdmkdmkdm' },
        params: { user: 1, role: 2 }
      };

      validator.getRole = {
        validate: () => Promise.resolve({
          params: { user: 1 }
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
    it('should be rejected with error when getRole action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['get role from user'] },
        query: { name: 'kdmkdmkdm' },
        params: { user: 1, role: 2 }
      };

      validator.getRole = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.getRole = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.getRole(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when role was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get role from user'] },
        query: { name: 'kdmkdmkdm' },
        params: { user: 1, role: 2 }
      };

      validator.getRole = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.getRole = options => {
        return Promise.resolve(null);
      }

      // When:
      let result = await service.getRole(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when roles is found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get role from user'] },
        query: { name: 'kdmkdmkdm' },
        params: { user: 1 },
        body: { roles: [] }
      };

      validator.getRole = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.getRole = options => {
        return Promise.resolve({});
      }

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
      let request = {
        token: { permissions: ['update role from user'] },
        query: {}
      };

      validator.updateRole = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'));
        }
      };

      // When:
      let result = await service.updateRole(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when user search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'update role from user' ] },
        query: { name: 'kdmkdmkdm' },
        params: { user: 1, role: 2 }
      };

      validator.updateRole = {
        validate: () => Promise.resolve({
          params: { user: 1 }
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
    it('should be rejected with error when user was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['update role from user'] },
        query: { name: 'kdmkdmkdm' },
        params: { user: 1, role: 2 }
      };

      validator.updateRole = {
        validate: () => Promise.resolve({
          params: { user: 1 }
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
    it('should be rejected with error when getRole action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['update role from user'] },
        query: { name: 'kdmkdmkdm' },
        params: { user: 1, role: 2 }
      };

      validator.updateRole = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getRole = options => {
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
        token: { permissions: [ 'update role from user' ] },
        query: { name: 'kdmkdmkdm' },
        params: { user: 1, role: 2 }
      };

      validator.updateRole = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getRole = options => Promise.resolve(null);

      // When:
      let result = await service.updateRole(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when roles update action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['update role from user'] },
        query: { name: 'kdmkdmkdm' },
        params: { user: 1 },
        body: { roles: [] }
      };

      validator.updateRole = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getRole = options => Promise.resolve({});
      repository.updateRole = options => Promise.reject(new Error('error mocked.'));

      // When:
      let result = await service.updateRole(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when roles is found', async () => {
      // Given:
      let request = {
        token: { permissions: ['update role from user'] },
        query: { name: 'kdmkdmkdm' },
        params: { user: 1 },
        body: { roles: [] }
      };

      validator.updateRole = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getRole = options => Promise.resolve({});
      repository.updateRole = options => Promise.resolve({});

      // When:
      let result = await service.updateRole(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('removeRole', () => {
    it('should be a function', () => {
      expect(service.removeRole).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().removeRole()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.removeRole(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.removeRole(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['remove role from user'] },
        query: {}
      };

      validator.removeRole = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'));
        }
      };

      // When:
      let result = await service.removeRole(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when user search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'remove role from user' ] },
        query: { name: 'kdmkdmkdm' },
        params: { user: 1, role: 2 }
      };

      validator.removeRole = {
        validate: () => Promise.resolve({
          params: { user: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.removeRole(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when user was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['remove role from user'] },
        query: { name: 'kdmkdmkdm' },
        params: { user: 1, role: 2 }
      };

      validator.removeRole = {
        validate: () => Promise.resolve({
          params: { user: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.removeRole(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when getRole action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['remove role from user'] },
        query: { name: 'kdmkdmkdm' },
        params: { user: 1, role: 2 }
      };

      validator.removeRole = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getRole = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.removeRole(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when role was not found', async () => {
      // Given:
      let request = {
        token: { permissions: [ 'remove role from user' ] },
        query: { name: 'kdmkdmkdm' },
        params: { user: 1, role: 2 }
      };

      validator.removeRole = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getRole = options => Promise.resolve(null);

      // When:
      let result = await service.removeRole(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when roles remove action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['remove role from user'] },
        query: { name: 'kdmkdmkdm' },
        params: { user: 1 }
      };

      validator.removeRole = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getRole = options => Promise.resolve({});
      repository.removeRole = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.removeRole(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when roles is found', async () => {
      // Given:
      let request = {
        token: { permissions: ['remove role from user'] },
        query: { name: 'kdmkdmkdm' },
        params: { user: 1 }
      };

      validator.removeRole = {
        validate: options => Promise.resolve({
          ...options
        })
      };

      repository.findByPk = options => Promise.resolve({});
      repository.getRole = options => Promise.resolve({});
      repository.removeRole = options => Promise.resolve({});

      // When:
      let result = await service.removeRole(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });
});
