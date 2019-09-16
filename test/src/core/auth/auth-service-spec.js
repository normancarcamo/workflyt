const UserRepository = require('src/core/users/users-repository');
const AuthRepository = require('src/core/auth/auth-repository');
const Service = require('src/core/auth/auth-service');
const DATA = require('test/config/models');
const database = require('test/config/database');
const HELPERS = require('src/utils/helpers');

describe('Auth Service', () => {
  let repository = null;
  let service = null;
  let helpers = null;

  beforeEach(() => {
    repository = AuthRepository({ User: UserRepository({ database })});
    helpers = { ...HELPERS };
    service = Service({ repository, helpers });
  });

  describe('Sign in', () => {
    it('should throw error when user is not found', () => {
      // Arrange:
      const username = 'ncardez';
      const password = 'sdjnksjnkdjfn13.32';

      // Act:
      const res = service.signIn({ username, password });

      // Assert:
      return res.catch(e => { expect(e.message).toEqual('Forbidden'); });
    });
    it('should return a jsonwebtoken when credentials are valid', async () => {
      // Mock:
      jest.spyOn(repository, 'getUserByUsernameWithRoles').mockResolvedValue({ ...DATA.user });

      // Arrange:
      const username = DATA.user.username;
      const password = 'PASSword.2119';

      // Act:
      const result = await service.signIn({ username, password });

      // Assert:
      expect(result).toBeString().not.toBeEmpty().toIncludeRepeated(/\./, 2);
      expect(result.split('.')).toBeArray().not.toBeEmpty().toHaveLength(3);
      expect(result.length).toSatisfy(n => n > 100);
    });
  });
});
