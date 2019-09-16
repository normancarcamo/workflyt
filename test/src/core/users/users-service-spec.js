const Repository = require('src/core/users/users-repository');
const Service = require('src/core/users/users-service');
const helpers = require('src/utils/helpers');
const ACTION_ERROR = require('test/config/errors').ERROR_BAD_GATEWAY;
const DATA = require('test/config/models');

describe('User Service', () => {
  const database = {};
  const repository = Repository({ database });
  let service = null;

  beforeEach(async () => { service = Service({ repository, helpers }); });

  describe('getUsers', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'getUsers').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const options = {};

      // Act:
      const res = service.getUsers(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of users', async () => {
      // Setup:
      jest.spyOn(repository, 'getUsers').mockResolvedValue([ DATA.user ]);

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
      jest.spyOn(repository, 'getUserByUsername').mockResolvedValue({});

      // Arrange:
      const values = DATA.user;
      const options = {};

      // Act:
      const res = service.createUser({ values, options });

      // Assert:
      return res.catch(e => expect(e.message).toContain('Forbidden'));
    });
    it('should throw error when user was not found but action fail', () => {
      // Setup:
      jest.spyOn(repository, 'getUserByUsername').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const values = DATA.user;
      const options = {};

      // Act:
      const res = service.createUser({ values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return user created', async () => {
      // Setup:
      jest.spyOn(repository, 'getUserByUsername').mockResolvedValue(null);
      jest.spyOn(helpers, 'hashPassword').mockResolvedValue('$2b$10$eqIcf8V1i6YlOX3paorWguQndpHDOXYt18oGzzpZzmwenscx.Em4e');
      jest.spyOn(repository, 'createUser').mockResolvedValue({ ...DATA.user });

      // Arrange:
      const values = { ...DATA.user, password: 'okokok' };
      const options = {};

      // Act:
      const res = await service.createUser({ values, options });

      // Assert:
      expect(res).toEqual({ ...DATA.user, password: undefined });
    });
  });

  describe('getUser', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'getUser').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const user_id = DATA.user.id;
      const options = {};

      // Act:
      const res = service.getUser({ user_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return user when is found', async () => {
      // Setup:
      jest.spyOn(repository, 'getUser').mockResolvedValue(DATA.user);

      // Arrange:
      const user_id = DATA.user.id;
      const options = {};

      // Act:
      const res = await service.getUser({ user_id, options });

      // Assert:
      expect(res).toEqual(DATA.user);
    });
  });

  describe('updateUser', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'updateUser').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const user_id = DATA.user.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = service.updateUser({ user_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return user updated when is found', async () => {
      // Setup:
      jest.spyOn(repository, 'updateUser').mockResolvedValue({
        extra: { enabled: true },
        updated_at: new Date('2019-10-10')
      });

      // Arrange:
      const user_id = DATA.user.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await service.updateUser({ user_id, values, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.extra).toEqual({ enabled: true });
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('deleteUser', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'deleteUser').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const user_id = DATA.user.id;
      const options = {};

      // Act:
      const res = service.deleteUser({ user_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return user updated when is found', async () => {
      // Setup:
      jest.spyOn(repository, 'deleteUser').mockResolvedValue({
        updated_at: new Date('2019-10-10'),
        deleted_at: new Date('2019-10-10')
      });

      // Arrange:
      const user_id = DATA.user.id;
      const options = {};

      // Act:
      const res = await service.deleteUser({ user_id, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('getRoles', () => {
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(repository, 'getRoles').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const user_id = DATA.user.id;
      const options = {};

      // Act:
      const res = service.getRoles({ user_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      jest.spyOn(repository, 'getRoles').mockResolvedValue([ DATA.role ]);

      // Arrange:
      const user_id = DATA.user.id;
      const options = {};

      // Act:
      const res = await service.getRoles({ user_id, options });

      // Assert:
      expect(res).toEqual([ DATA.role ]);
    });
  });

  describe('addRoles', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'addRoles').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const options = { user_id: DATA.user.id, roles: [ DATA.role.id ] };

      // Act:
      const res = service.addRoles(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations after adding them', async () => {
      // Setup:
      jest.spyOn(repository, 'addRoles').mockResolvedValue([ DATA.userRole ]);

      // Arrange:
      const options = { user_id: DATA.user.id, roles: [ DATA.role.id ] };

      // Act:
      const res = await service.addRoles(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty();
      expect(res).toEqual([ DATA.userRole ]);
    });
  });

  describe('getRole', () => {
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(repository, 'getRole').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const user_id = DATA.user.id;
      const role_id = DATA.role.id;
      const options = {};

      // Act:
      const res = service.getRole({ user_id, role_id, options }, true);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.role, UserRole: DATA.userRole };

      // Mock:
      jest.spyOn(repository, 'getRole').mockResolvedValue(expected);

      // Arrange:
      const user_id = DATA.user.id;
      const role_id = DATA.role.id;
      const options = {};

      // Act:
      const res = await service.getRole({ user_id, role_id, options }, true);

      // Assert:
      expect(res).toEqual(expected)
    });
  });

  describe('updateRole', () => {
    it('should throw error when action fail', () => {
      // Before:
      jest.spyOn(repository, 'updateRole').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const user_id = DATA.user.id;
      const role_id = DATA.role.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = service.updateRole({ user_id, role_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association updated after update', async () => {
      // Before:
      jest.spyOn(repository, 'updateRole').mockResolvedValue({
        ...DATA.userRole,
        extra: { enabled: true },
        updated_at: new Date('2019-10-10')
      });

      // Arrange:
      const user_id = DATA.userRole.user_id;
      const role_id = DATA.userRole.role_id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await service.updateRole({ user_id, role_id, values, options });

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
      // Before:
      jest.spyOn(repository, 'deleteRole').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const user_id = DATA.user.id;
      const role_id = DATA.role.id;
      const options = {};

      // Act:
      const res = service.deleteRole({ user_id, role_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association deleted after delete', async () => {
      // Before:
      jest.spyOn(repository, 'deleteRole').mockResolvedValue({
        ...DATA.userRole,
        updated_at: new Date('2019-10-10'),
        deleted_at: new Date('2019-10-10')
      });

      // Arrange:
      const user_id = DATA.userRole.user_id;
      const role_id = DATA.userRole.role_id;
      const options = {};

      // Act:
      const res = await service.deleteRole({ user_id, role_id, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.user_id).toEqual(user_id);
      expect(res.role_id).toEqual(role_id);
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });
});
