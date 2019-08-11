const Service = require('src/core/auth/auth-service');

let service;
let validator;
let adapter;
let repository;

describe('Service', () => {
  it('should module be a factory function', () => {
    expect(Service).toBeFunction();
  });

  it('should return an object when function is invoked', () => {
    expect(Service({})).toBeObject().not.toBeEmpty().toContainAllKeys([
      'signIn',
      'signUp'
    ]);
  });

  describe('signIn', () => {
    beforeEach(() => {
      validator = {
        signIn: {
          validate: () => Promise.resolve({
            body: { username: 'fake' }
          })
        }
      };

      repository = {
        findUserWithRoles: options => Promise.resolve({})
      };

      adapter = {
        comparePassword: async values => true,
        signToken: options => 'ddkmdkdm.dkdnkddkndkd.dkndknd'
      };

      service = Service({ repository, validator, adapter });
    });

    it('should be a function', () => {
      expect(Service({}).signIn).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().signIn()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      expect(service.signIn({})).toBePromise();
    });
    it('should promise be resolved in all cases when it is invoked', () => {
      expect(service.signIn({})).toBePromise().toResolve();
    });
    it('should return error when input validation fails', async () => {
      validator.signIn.validate = options => {
        return Promise.reject(new Error('error mocked.'));
      };
      service = Service({ repository, validator, adapter });
      let result = await service.signIn({});
      expect(result).toHaveProperty('success', false);
    });
    it('should return error when findUserWithRoles action fails', async () => {
      repository.findUserWithRoles = options => {
        return Promise.reject(new Error('error mocked.'));
      };
      service = Service({ repository, validator, adapter });
      let result = await service.signIn({});
      expect(result).toHaveProperty('success', false);
    });
    it('should return error when user is not found', async () => {
      repository.findUserWithRoles = options => Promise.resolve(null);
      service = Service({ repository, validator, adapter });
      let result = await service.signIn({});
      expect(result).toHaveProperty('success', false);
    });
    it('should return error when comparing the passwords', async () => {
      adapter.comparePassword = options => {
        return Promise.reject(new Error('error mocked.'));
      };
      service = Service({ repository, validator, adapter });
      let result = await service.signIn({});
      expect(result).toHaveProperty('success', false);
    });
    it('should return error when passwords doesn\'t match', async () => {
      adapter.comparePassword = options => { return Promise.resolve(false); };
      service = Service({ repository, validator, adapter });
      let result = await service.signIn({});
      expect(result).toHaveProperty('success', false);
    });
    it('should return error during the token signature', async () => {
      adapter.signToken = options => { throw new Error('error mocked.'); };
      service = Service({ repository, validator, adapter });
      let result = await service.signIn({});
      expect(result).toHaveProperty('success', false);
    });
    it('should return data when success', async () => {
      let result = await service.signIn({});
      expect(result).toHaveProperty('success', true);
    });
  });

  describe('signUp', () => {
    beforeEach(() => {
      validator = {
        signUp: {
          validate: () => Promise.resolve({
            body: { username: 'fake' }
          })
        }
      };

      repository = {
        findUserByUsername: options => Promise.resolve({}),
        createUser: payload => Promise.resolve({ ...payload })
      };

      adapter = {
        hashPassword: async values => true,
        signToken: options => 'ddkmdkdm.dkdnkddkndkd.dkndknd'
      };

      service = Service({ repository, validator, adapter });
    });

    it('should be a function', () => {
      expect(Service({}).signUp).toBeFunction();
    });
    it('should throw error when is invoked with incorrect arguments', () => {
      expect(x => Service().signUp()).toThrow();
    });
    it('should return a promise when it is invoked', () => {
      expect(service.signUp({})).toBePromise();
    });
    it('should promise be resolved in all cases', () => {
      expect(service.signUp({})).toBePromise().toResolve();
    });
    it('should return error when input validation fails', async () => {
      validator.signUp.validate = options => {
        return Promise.reject(new Error('error mocked.'));
      };
      service = Service({ repository, validator, adapter });
      let result = await service.signUp({});
      expect(result).toHaveProperty('success', false);
    });
    it('should return error when findUserByUsername action fails', async () => {
      repository.findUserByUsername = options => {
        return Promise.reject(new Error('error mocked.'));
      };
      service = Service({ repository, validator, adapter });
      let result = await service.signUp({});
      expect(result).toHaveProperty('success', false);
    });
    it('should return error when user is found', async () => {
      let result = await service.signUp({});
      expect(result).toHaveProperty('success', false);
    });
    it('should return error when hashing the password', async () => {
      repository.findUserByUsername = options => Promise.resolve(null);
      adapter.hashPassword = options => {
        return Promise.reject(new Error('error mocked.'));
      };
      service = Service({ repository, validator, adapter });
      let result = await service.signUp({});
      expect(result).toHaveProperty('success', false);
    });
    it('should return error when user was being created', async () => {
      repository.findUserByUsername = options => Promise.resolve(null);
      adapter.hashPassword = options => { return Promise.resolve('23k.dsa'); };
      repository.createUser = data => {
        return Promise.reject(new Error('error mocked.'));
      }
      service = Service({ repository, validator, adapter });
      let result = await service.signUp({});
      expect(result).toHaveProperty('success', false);
    });
    it('should return error during the token signature', async () => {
      repository.findUserByUsername = options => Promise.resolve(null);
      adapter.hashPassword = options => { return Promise.resolve('23k.dsa'); };
      adapter.signToken = options => { throw new Error('error mocked.'); };
      service = Service({ repository, validator, adapter });
      let result = await service.signUp({});
      expect(result).toHaveProperty('success', false);
    });
    it('should return data when success', async () => {
      repository.findUserByUsername = options => Promise.resolve(null);
      service = Service({ repository, validator, adapter });
      let result = await service.signUp({});
      expect(result).toHaveProperty('success', true);
    });
  });
});
