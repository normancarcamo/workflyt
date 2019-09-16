const Repository = require('src/core/users/users-repository');
const ACTION_ERROR = require('test/config/errors').ERROR_BAD_GATEWAY;
const DATA = require('test/config/models');
const DATABASE = require('test/config/database');

describe('User Repository', () => {
  const database = { ...DATABASE };
  const repository = Repository({ database });

  beforeEach(async () => { database.models = DATABASE.models; });

  describe('getUsers', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.User, 'findAll').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const options = {};

      // Act:
      const res = repository.getUsers(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of users', async () => {
      // Setup:
      jest.spyOn(database.models.User, 'findAll')
        .mockResolvedValue([ DATA.user ]);

      // Arrange:
      const options = {};

      // Act:
      const res = await repository.getUsers(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty().toEqual([ DATA.user ]);
    });
    it('should return an empty list when records are not found', async () => {
      // Setup:
      jest.spyOn(database.models.User, 'findAll').mockResolvedValue([]);

      // Arrange:
      const options = {};

      // Act:
      const res = await repository.getUsers(options);

      // Assert:
      expect(res).toBeArray().toBeEmpty();
    });
  });

  describe('createUser', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.User, 'create').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const values = DATA.user;

      // Act:
      const res = repository.createUser(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return user created', async () => {
      // Setup:
      jest.spyOn(database.models.User, 'create')
        .mockResolvedValue(DATA.user);

      // Arrange:
      const values = DATA.user;

      // Act:
      const res = await repository.createUser(values);

      // Assert:
      expect(res).toEqual(DATA.user);
    });
  });

  describe('getUser', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.User, 'findByPk').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const user_id = DATA.user.id;
      const options = {};

      // Act:
      const res = repository.getUser({ user_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return null when user was not found', async () => {
      // Setup:
      jest.spyOn(database.models.User, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const user_id = DATA.user.id;
      const options = {};

      // Act:
      const res = await repository.getUser({ user_id, options });

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and strict is set true', () => {
      // Setup:
      jest.spyOn(database.models.User, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const user_id = DATA.user.id;
      const options = {};

      // Act:
      const res = repository.getUser({ user_id, options, throwNotFound: true });

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return user when is found', async () => {
      // Setup:
      jest.spyOn(database.models.User, 'findByPk')
        .mockResolvedValue(DATA.user);

      // Arrange:
      const user_id = DATA.user.id;
      const options = {};

      // Act:
      const res = await repository.getUser({ user_id, options });

      // Assert:
      expect(res).toEqual(DATA.user);
    });
  });

  describe('getUserByUsername', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.User, 'findOne').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const user_id = DATA.user.id;
      const options = {};

      // Act:
      const res = repository.getUserByUsername({ user_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return null when user was not found', async () => {
      // Setup:
      jest.spyOn(database.models.User, 'findOne').mockResolvedValue(null);

      // Arrange:
      const user_id = DATA.user.id;
      const options = {};

      // Act:
      const res = await repository.getUserByUsername({ user_id, options });

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and throwNotFound is set true', () => {
      // Arrange:
      jest.spyOn(database.models.User, 'findOne').mockResolvedValue(null);

      // Act:
      const res = repository.getUserByUsername({
        username: DATA.user.username,
        options: {},
        throwNotFound: true
      });

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return user when is found', async () => {
      // Setup:
      jest.spyOn(database.models.User, 'findOne')
        .mockResolvedValue(DATA.user);

      // Arrange:
      const user_id = DATA.user.id;
      const options = {};

      // Act:
      const res = await repository.getUserByUsername({ user_id, options });

      // Assert:
      expect(res).toEqual(DATA.user);
    });
  });

  describe('getUserByUsernameWithRoles', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.sequelize, 'query').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const username = DATA.user.username;
      const options = {};

      // Act:
      const res = repository.getUserByUsernameWithRoles({ username, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return null when user was not found', async () => {
      // Setup:
      jest.spyOn(database.sequelize, 'query').mockResolvedValue(null);

      // Arrange:
      const username = DATA.user.username;
      const options = {};

      // Act:
      const res = await repository.getUserByUsernameWithRoles({ username, options });

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and throwNotFound is set true', () => {
      // Arrange:
      jest.spyOn(database.sequelize, 'query').mockResolvedValue(null);

      // Act:
      const res = repository.getUserByUsernameWithRoles({
        username: DATA.user.username,
        options: {},
        throwNotFound: true
      });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return user when is found', async () => {
      // Setup:
      jest.spyOn(database.sequelize, 'query').mockResolvedValue(DATA.user);

      // Arrange:
      const username = DATA.user.username;
      const options = {};

      // Act:
      const res = await repository.getUserByUsernameWithRoles({ username, options });

      // Assert:
      expect(res).toEqual(DATA.user);
    });
  });

  describe('updateUser', () => {
    it('should throw error when user was not found', () => {
      // Setup:
      jest.spyOn(database.models.User, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const user_id = DATA.user.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateUser({ user_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.User, 'findByPk').mockResolvedValue({
        update: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const user_id = DATA.user.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateUser({ user_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return user updated when is found', async () => {
      // Setup:
      jest.spyOn(database.models.User, 'findByPk').mockResolvedValue({
        update: jest.fn().mockResolvedValue({
          extra: { enabled: true },
          updated_at: new Date()
        })
      });

      // Arrange:
      const user_id = DATA.user.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await repository.updateUser({ user_id, values, options });

      // Assert:
      expect(res.extra).toEqual(values.extra);
    });
  });

  describe('deleteUser', () => {
    it('should throw error when user was not found', () => {
      // Setup:
      jest.spyOn(database.models.User, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const user_id = DATA.user.id;
      const options = {};

      // Act:
      const res = repository.deleteUser({ user_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.User, 'findByPk').mockResolvedValue({
        destroy: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const user_id = DATA.user.id;
      const options = {};

      // Act:
      const res = repository.deleteUser({ user_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return user deleted when is found', async () => {
      // Setup:
      jest.spyOn(database.models.User, 'findByPk').mockResolvedValue({
        destroy: jest.fn().mockResolvedValue({
          updated_at: new Date(),
          deleted_at: new Date()
        })
      });

      // Arrange:
      const user_id = DATA.user.id;
      const options = {};

      // Act:
      const res = await repository.deleteUser({ user_id, options });

      // Assert:
      expect(res.deleted_at).not.toBe(null);
    });
  });

  describe('getRoles', () => {
    it('should throw error when user was not found', () => {
      // Setup:
      jest.spyOn(database.models.User, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const user_id = DATA.user.id;
      const options = {};

      // Act:
      const res = repository.getRoles({ user_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(database.models.User, 'findByPk').mockResolvedValue({
        getRoles: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const user_id = DATA.user.id;
      const options = {};

      // Act:
      const res = repository.getRoles({ user_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      jest.spyOn(database.models.User, 'findByPk').mockResolvedValue({
        getRoles: jest.fn().mockResolvedValue([ DATA.role ])
      });

      // Arrange:
      const user_id = DATA.user.id;
      const options = {};

      // Act:
      const res = await repository.getRoles({ user_id, options });

      // Assert:
      expect(res).toEqual([ DATA.role ]);
    });
    it('should return a list empty when records are not found', async () => {
      // Mock:
      jest.spyOn(database.models.User, 'findByPk').mockResolvedValue({
        getRoles: jest.fn().mockResolvedValue([])
      });

      // Arrange:
      const user_id = DATA.user.id;
      const options = {};

      // Act:
      const res = await repository.getRoles({ user_id, options });

      // Assert:
      expect(res).toBeArray().toBeEmpty();
    });
  });

  describe('addRoles', () => {
    it('should throw error when user was not found', () => {
      // Setup:
      jest.spyOn(database.models.User, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const user_id = DATA.user.id;
      const roles = [ DATA.role.id ];

      // Act:
      const res = repository.addRoles({ user_id, roles });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.User, 'findByPk').mockResolvedValue({
        addRoles: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const options = {
        user_id: DATA.user.id,
        roles: [ DATA.role.id ]
      };

      // Act:
      const res = repository.addRoles(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations after adding them', async () => {
      // Setup:
      jest.spyOn(database.models.User, 'findByPk').mockResolvedValue({
        addRoles: jest.fn().mockResolvedValue([
          DATA.userRole
        ])
      });

      // Arrange:
      const options = {
        user_id: DATA.user.id,
        roles: [ DATA.role.id ]
      };

      // Act:
      const res = await repository.addRoles(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty();
      expect(res).toEqual([ DATA.userRole ]);
    });
  });

  describe('getRole', () => {
    it('should throw error when user was not found', () => {
      // Setup:
      jest.spyOn(database.models.User, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const user_id = DATA.user.id;
      const role_id = DATA.role.id;
      const options = {};
      const throwNotFound = true;

      // Act:
      const res = repository.getRole({ user_id, role_id, options, throwNotFound });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return null when role was not found', async () => {
      // Mock:
      jest.spyOn(database.models.User, 'findByPk').mockResolvedValue({
        getRoles: jest.fn().mockResolvedValue(null)
      });

      // Arrange:
      const user_id = DATA.user.id;
      const role_id = DATA.role.id;
      const options = {};
      const throwNotFound = false;

      // Act:
      const res = await repository.getRole({ user_id, role_id, options, throwNotFound });

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and throwNotFound is true', () => {
      // Mock:
      jest.spyOn(database.models.User, 'findByPk').mockResolvedValue({
        getRoles: jest.fn().mockResolvedValue(null)
      });

      // Arrange:
      const user_id = DATA.user.id;
      const role_id = DATA.role.id;
      const options = {};
      const throwNotFound = true;

      // Act:
      const res = repository.getRole({ user_id, role_id, options, throwNotFound });

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(database.models.User, 'findByPk').mockResolvedValue({
        getRoles: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const user_id = DATA.user.id;
      const role_id = DATA.role.id;
      const options = {};
      const throwNotFound = true;

      // Act:
      const res = repository.getRole({ user_id, role_id, options, throwNotFound });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.role, UserRole: DATA.userRole };

      // Mock:
      jest.spyOn(database.models.User, 'findByPk').mockResolvedValue({
        getRoles: jest.fn().mockResolvedValue(expected)
      });

      // Arrange:
      const user_id = DATA.user.id;
      const role_id = DATA.role.id;
      const options = {};
      const throwNotFound = true;

      // Act:
      const res = await repository.getRole({ user_id, role_id, options, throwNotFound });

      // Assert:
      expect(res).toEqual(expected)
    });
  });

  describe('updateRole', () => {
    it('should throw error when user was not found', () => {
      // Before:
      jest.spyOn(database.models.User, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const user_id = DATA.user.id;
      const role_id = DATA.role.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateRole({ user_id, role_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return null when role was not found', () => {
      // Before:
      jest.spyOn(database.models.User, 'findByPk').mockResolvedValue({
        getRoles: jest.fn().mockResolvedValue(null)
      });

      // Arrange:
      const user_id = DATA.user.id;
      const role_id = DATA.role.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateRole({ user_id, role_id, values, options });

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Before:
      jest.spyOn(database.models.User, 'findByPk').mockResolvedValue({
        getRoles: jest.fn().mockResolvedValue({
          UserRole: {
            update: jest.fn().mockRejectedValue(ACTION_ERROR)
          }
        })
      });

      // Arrange:
      const user_id = DATA.user.id;
      const role_id = DATA.role.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateRole({ user_id, role_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association updated after update', async () => {
      // Before:
      jest.spyOn(database.models.User, 'findByPk').mockResolvedValue({
        getRoles: jest.fn().mockResolvedValue({
          UserRole: {
            update: jest.fn().mockResolvedValue({
              ...DATA.userRole,
              extra: { enabled: true },
              updated_at: new Date('2019-10-10')
            })
          }
        })
      });

      // Arrange:
      const user_id = DATA.userRole.user_id;
      const role_id = DATA.userRole.role_id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await repository.updateRole({ user_id, role_id, values, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.user_id).toEqual(user_id);
      expect(res.role_id).toEqual(role_id);
      expect(res.extra).toEqual({ enabled: true });
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('deleteRole', () => {
    it('should throw error when user was not found', () => {
      // Before:
      jest.spyOn(database.models.User, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const user_id = DATA.user.id;
      const role_id = DATA.role.id;
      const options = {};

      // Act:
      const res = repository.deleteRole({ user_id, role_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return null when role was not found', () => {
      // Before:
      jest.spyOn(database.models.User, 'findByPk').mockResolvedValue({
        getRoles: jest.fn().mockResolvedValue(null)
      });

      // Arrange:
      const user_id = DATA.user.id;
      const role_id = DATA.role.id;
      const options = {};

      // Act:
      const res = repository.deleteRole({ user_id, role_id, options });

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Before:
      jest.spyOn(database.models.User, 'findByPk').mockResolvedValue({
        getRoles: jest.fn().mockResolvedValue({
          UserRole: {
            destroy: jest.fn().mockRejectedValue(ACTION_ERROR)
          }
        })
      });

      // Arrange:
      const user_id = DATA.user.id;
      const role_id = DATA.role.id;
      const options = {};

      // Act:
      const res = repository.deleteRole({ user_id, role_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association deleted after delete', async () => {
      // Before:
      jest.spyOn(database.models.User, 'findByPk').mockResolvedValue({
        getRoles: jest.fn().mockResolvedValue({
          UserRole: {
            destroy: jest.fn().mockResolvedValue({
              ...DATA.userRole,
              updated_at: new Date('2019-10-10'),
              deleted_at: new Date('2019-10-10')
            })
          }
        })
      });

      // Arrange:
      const user_id = DATA.userRole.user_id;
      const role_id = DATA.userRole.role_id;
      const options = {};

      // Act:
      const res = await repository.deleteRole({ user_id, role_id, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.user_id).toEqual(user_id);
      expect(res.role_id).toEqual(role_id);
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });
});
