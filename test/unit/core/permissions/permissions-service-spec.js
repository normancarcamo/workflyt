const Service = require('src/core/permissions/permissions-service');

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
      'getPermissions',
      'createPermissions',
      'getPermission',
      'updatePermission',
      'deletePermission'
    ]);
  });

  describe('getPermissions', () => {
    it('should be a function', () => {
      expect(service.getPermissions).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().getPermissions()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = {
        token: {
          permissions: []
        }
      };
      expect(service.getPermissions(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = {
        token: {
          permissions: ['']
        }
      };
      expect(service.getPermissions(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['get permissions']
        },
        query: {}
      };

      // When:
      let result = await service.getPermissions(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when action fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['get permissions']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.getPermissions = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.findAll = options => {
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
        token: {
          permissions: ['get permissions']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.getPermissions = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.findAll = options => {
        return Promise.resolve({});
      };

      // When:
      let result = await service.getPermissions(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('createPermissions', () => {
    it('should be a function', () => {
      expect(service.createPermissions).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().createPermissions()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = {
        token: {
          permissions: []
        }
      };
      expect(service.createPermissions(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = {
        token: {
          permissions: ['']
        }
      };
      expect(service.createPermissions(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['create permissions']
        },
        query: {}
      };

      // When:
      let result = await service.createPermissions(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when action fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['create permissions']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.createPermissions = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.create = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.createPermissions(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when permission is created', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['create permissions']
        },
        query: {
          name: 'kdmkdmkdm'
        }
      };

      validator.createPermissions = {
        validate: () => Promise.resolve({ query: {} })
      };

      repository.create = options => {
        return Promise.resolve({});
      };

      // When:
      let result = await service.createPermissions(request);

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
      let request = {
        token: {
          permissions: []
        }
      };
      expect(service.getPermission(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = {
        token: {
          permissions: ['']
        }
      };
      expect(service.getPermission(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = {
        token: {
          permissions: ['get permission']
        },
        query: {}
      };

      // When:
      let result = await service.getPermission(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when action fails', async () => {
      // Given:
      let request = {
        token: { permissions: ['get permission'] },
        query: { name: 'kdmkdmkdm' },
        params: { permission: 1 }
      };

      validator.getPermission = {
        validate: () => Promise.resolve({
          query: {},
          params: { permission: 1 }
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
    it('should be rejected with error when permission is not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get permission'] },
        query: { name: 'kdmkdmkdm' },
        params: { permission: 1 }
      };

      validator.getPermission = {
        validate: () => Promise.resolve({
          query: {},
          params: { permission: 1 }
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
    it('should be resolved with data when permissions is found', async () => {
      // Given:
      let request = {
        token: { permissions: ['get permission'] },
        query: { name: 'kdmkdmkdm' },
        params: { permission: 1 }
      };

      validator.getPermission = {
        validate: () => Promise.resolve({
          query: {},
          params: { permission: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

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
      let request = { token: { permissions: ['update permission'] }, query: {} };

      // When:
      let result = await service.updatePermission(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when permission search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['update permission'] },
        query: { name: 'kdmkdmkdm' },
        params: { permission: 1 }
      };

      validator.updatePermission = {
        validate: () => Promise.resolve({
          params: { permission: 1 }
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
    it('should be rejected with error when permission was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['update permission'] },
        query: { name: 'kdmkdmkdm' },
        params: { permission: 1 }
      };

      validator.updatePermission = {
        validate: () => Promise.resolve({
          params: { permission: 1 }
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
    it('should be rejected with error when permission update action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['update permission'] },
        query: { name: 'kdmkdmkdm' },
        params: { permission: 1 }
      };

      validator.updatePermission = {
        validate: () => Promise.resolve({
          params: { permission: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.update = options => {
        return Promise.reject(new Error('error mocked.'));
      }

      // When:
      let result = await service.updatePermission(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when permission is updated', async () => {
      // Given:
      let request = {
        token: { permissions: ['update permission'] },
        query: { name: 'kdmkdmkdm' },
        params: { permission: 1 }
      };

      validator.updatePermission = {
        validate: () => Promise.resolve({
          params: { permission: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.update = options => {
        return Promise.resolve({});
      }

      // When:
      let result = await service.updatePermission(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });

  describe('deletePermission', () => {
    it('should be a function', () => {
      expect(service.deletePermission).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().deletePermission()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      let request = { token: { permissions: [] } };
      expect(service.deletePermission(request)).toBePromise();
    });
    it('should be rejected with error when access control is denied', () => {
      let request = { token: { permissions: [''] } };
      expect(service.deletePermission(request)).toBePromise();
    });
    it('should be rejected with error when data validation fails', async () => {
      // Given:
      let request = { token: { permissions: ['delete permission'] }, query: {} };
      validator.deletePermission = {
        validate: options => {
          return Promise.reject(new Error('error mocked.'))
        }
      };

      // When:
      let result = await service.deletePermission(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when permission search action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete permission'] },
        query: { name: 'kdmkdmkdm' },
        params: { permission: 1 }
      };

      validator.deletePermission = {
        validate: () => Promise.resolve({
          params: { permission: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.reject(new Error('error mocked.'));
      };

      // When:
      let result = await service.deletePermission(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when permission was not found', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete permission'] },
        query: { name: 'kdmkdmkdm' },
        params: { permission: 1 }
      };

      validator.deletePermission = {
        validate: () => Promise.resolve({
          params: { permission: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve(null);
      };

      // When:
      let result = await service.deletePermission(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be rejected with error when permission destroy action fail', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete permission'] },
        query: { name: 'kdmkdmkdm' },
        params: { permission: 1 }
      };

      validator.deletePermission = {
        validate: () => Promise.resolve({
          params: { permission: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.destroy = options => {
        return Promise.reject(new Error('error mocked.'));
      }

      // When:
      let result = await service.deletePermission(request);

      // Then:
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
    it('should be resolved with data when permission is deleted', async () => {
      // Given:
      let request = {
        token: { permissions: ['delete permission'] },
        query: { name: 'kdmkdmkdm' },
        params: { permission: 1 }
      };

      validator.deletePermission = {
        validate: () => Promise.resolve({
          params: { permission: 1 }
        })
      };

      repository.findByPk = options => {
        return Promise.resolve({});
      };

      repository.destroy = options => {
        return Promise.resolve({});
      }

      // When:
      let result = await service.deletePermission(request);

      // Then:
      expect(result.success).toBe(true);
      expect(result.data).toBeDefined();
    });
  });
});
