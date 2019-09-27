import '../../../config/global';
import { UserRepository } from '../../../../src/core/users/users-repository';
import { UserService } from '../../../../src/core/users/users-service';
import { I } from '../../../../src/core/users/users-types';
import { ERROR_BAD_GATEWAY as ACTION_ERROR } from '../../../config/errors';
import * as DATA from '../../../config/models';
import * as helpers from '../../../../src/utils/helpers';

describe('User Service', () => {
  const database = {};
  const repository = UserRepository(database);
  let service:I.service = UserService(repository, helpers);

  beforeEach(async () => { service = UserService(repository, helpers); });

  describe('getUsers', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.getUsers = async () => { throw ACTION_ERROR; };

      // Arrange:
      const options = {};

      // Act:
      const res = service.getUsers(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of users', async () => {
      // Setup:
      repository.getUsers = async () => [ DATA.user ];

      // Arrange:
      const options = {};

      // Act:
      const res = await service.getUsers(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty().toEqual([ DATA.user ]);
    });
  });

  describe('createUser', () => {
    it('should throw error when user was found', () => {
      // Setup:
      repository.getUserByUsername = async () => ({});

      // Arrange:
      const values = DATA.user;
      const options = {};

      // Act:
      const res = service.createUser(values, options);

      // Assert:
      return res.catch(e => expect(e.message).toContain('Forbidden'));
    });
    it('should throw error when user was not found but action fail', () => {
      // Setup:
      repository.getUserByUsername = async () => { throw ACTION_ERROR; };

      // Arrange:
      const values = DATA.user;
      const options = {};

      // Act:
      const res = service.createUser(values, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return user created', async () => {
      // Setup:
      jest.spyOn(helpers, 'hashPassword').mockResolvedValue('$2b$10$eqIcf8V1i6YlOX3paorWguQndpHDOXYt18oGzzpZzmwenscx.Em4e');
      repository.getUserByUsername = async () => null;
      repository.createUser = async () => ({ ...DATA.user });

      // Arrange:
      const values = { ...DATA.user, password: 'okokok' };
      const options = {};

      // Act:
      const res = await service.createUser(values, options);

      // Assert:
      expect(res).toEqual({ ...DATA.user, password: undefined });
    });
  });

  describe('getUser', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.getUser = async () => { throw ACTION_ERROR; };

      // Arrange:
      const user_id = DATA.user.id;
      const options = {};

      // Act:
      const res = service.getUser(user_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return user when is found', async () => {
      // Setup:
      repository.getUser = async () => DATA.user;

      // Arrange:
      const user_id = DATA.user.id;
      const options = {};

      // Act:
      const res = await service.getUser(user_id, options);

      // Assert:
      expect(res).toEqual(DATA.user);
    });
  });

  describe('updateUser', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.updateUser = async () => { throw ACTION_ERROR; };

      // Arrange:
      const user_id = DATA.user.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = service.updateUser(user_id, values, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return user updated when is found', async () => {
      // Setup:
      repository.updateUser = async () => ({
        extra: { enabled: true },
        updated_at: new Date('2019-10-10')
      });

      // Arrange:
      const user_id = DATA.user.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await service.updateUser(user_id, values, options);

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.extra).toEqual({ enabled: true });
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('deleteUser', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.deleteUser = async () => { throw ACTION_ERROR; };

      // Arrange:
      const user_id = DATA.user.id;
      const options = {};

      // Act:
      const res = service.deleteUser(user_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return user updated when is found', async () => {
      // Arrange:
      repository.deleteUser = async () => ({
        updated_at: new Date('2019-10-10'),
        deleted_at: new Date('2019-10-10')
      });
      const user_id = DATA.user.id;
      const options = {};

      // Act:
      const res = await service.deleteUser(user_id, options);

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('getRoles', () => {
    it('should throw error when action fail', () => {
      // Mock:
      repository.getRoles = async () => { throw ACTION_ERROR; };

      // Arrange:
      const user_id = DATA.user.id;
      const options = {};

      // Act:
      const res = service.getRoles(user_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      repository.getRoles = async () => [ DATA.role ];

      // Arrange:
      const user_id = DATA.user.id;
      const options = {};

      // Act:
      const res = await service.getRoles(user_id, options);

      // Assert:
      expect(res).toEqual([ DATA.role ]);
    });
  });

  describe('addRoles', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.addRoles = async () => { throw ACTION_ERROR; };

      // Arrange:
      const user_id = DATA.user.id;
      const roles = [ DATA.role.id ];

      // Act:
      const res = service.addRoles(user_id, roles);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations after adding them', async () => {
      // Setup:
      repository.addRoles = async () => [ DATA.userRole ];

      // Arrange:
      const user_id = DATA.user.id;
      const roles = [ DATA.role.id ];

      // Act:
      const res = await service.addRoles(user_id, roles);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty();
      expect(res).toEqual([ DATA.userRole ]);
    });
  });

  describe('getRole', () => {
    it('should throw error when action fail', () => {
      // Mock:
      repository.getRole = async () => { throw ACTION_ERROR; };

      // Arrange:
      const user_id = DATA.user.id;
      const role_id = DATA.role.id;
      const options = {};

      // Act:
      const res = service.getRole(user_id, role_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      // Arrange:
      const expected = { ...DATA.role, UserRole: DATA.userRole };
      repository.getRole = async () => expected;
      const user_id = DATA.user.id;
      const role_id = DATA.role.id;
      const options = {};

      // Act:
      const res = await service.getRole(user_id, role_id, options);

      // Assert:
      expect(res).toEqual(expected);
    });
  });

  describe('updateRole', () => {
    it('should throw error when action fail', () => {
      // Before:
      repository.updateRole = async () => { throw ACTION_ERROR; };

      // Arrange:
      const user_id = DATA.user.id;
      const role_id = DATA.role.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = service.updateRole(user_id, role_id, values, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association updated after update', async () => {
      // Arrange:
      repository.updateRole = async () => ({
        ...DATA.userRole,
        extra: { enabled: true },
        updated_at: new Date('2019-10-10')
      });
      const user_id = DATA.userRole.user_id;
      const role_id = DATA.userRole.role_id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await service.updateRole(user_id, role_id, values, options);

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.user_id).toEqual(user_id);
      expect(res.role_id).toEqual(role_id);
      expect(res.extra).toEqual({ enabled: true });
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('deleteRole', () => {
    it('should throw error when action fail', () => {
      // Arrange:
      repository.deleteRole = async () => { throw ACTION_ERROR; };
      const user_id = DATA.user.id;
      const role_id = DATA.role.id;
      const options = {};

      // Act:
      const res = service.deleteRole(user_id, role_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association deleted after delete', async () => {
      // Arrange:
      repository.deleteRole = async () => ({
        ...DATA.userRole,
        updated_at: new Date('2019-10-10'),
        deleted_at: new Date('2019-10-10')
      });
      const user_id = DATA.userRole.user_id;
      const role_id = DATA.userRole.role_id;
      const options = {};

      // Act:
      const res = await service.deleteRole(user_id, role_id, options);

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.user_id).toEqual(user_id);
      expect(res.role_id).toEqual(role_id);
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });
});
