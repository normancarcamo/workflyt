import '../../../config/global';
import { UserRepository } from '../../../../src/core/users/users-repository';
import { AuthRepository } from '../../../../src/core/auth/auth-repository';
import { AuthService } from '../../../../src/core/auth/auth-service';
import * as DATA from '../../../config/models';
import database from '../../../config/database';
import * as HELPERS from '../../../../src/utils/helpers';
import { I } from '../../../../src/core/auth/auth-types';

describe('Auth Service', () => {
  let repository:I.repository = null;
  let service:I.service = null;
  let helpers = null;

  beforeEach(() => {
    repository = AuthRepository(UserRepository(database));
    helpers = { ...HELPERS };
    service = AuthService(repository, helpers);
  });

  describe('Sign in', () => {
    it('should throw error when user is not found', () => {
      // Arrange:
      repository.getUserByUsernameWithRoles = async () => null;
      const username = 'ncardez';
      const password = 'sdjnksjnkdjfn13.32';

      // Act:
      const res = service.signIn(username, password);

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Forbidden'));
    });
    it('should return a jsonwebtoken when credentials are valid', async () => {
      // Arrange:
      repository.getUserByUsernameWithRoles = async () => ({ ...DATA.user });
      const username = DATA.user.username;
      const password = 'PASSword.2119';

      // Act:
      const result = await service.signIn(username, password);

      // Assert:
      expect(result).toBeJsonWebToken();
    });
  });
});
