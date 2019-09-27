import '../../../config/global';
import * as DATA from '../../../config/models';
import DATABASE from '../../../config/database';
import { ERROR_BAD_GATEWAY as ACTION_ERROR } from '../../../config/errors';
import { UserRepository } from '../../../../src/core/users/users-repository';

describe('User Repository', () => {
  const database = { ...DATABASE() };
  const repository = UserRepository(database);

  beforeEach(async () => { database.models = DATABASE().models; });

  describe('getUsers', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.User.findAll = (async () => { throw ACTION_ERROR; }) as any;

      // Arrange:
      const options = {};

      // Act:
      const res = repository.getUsers(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of users', async () => {
      // Setup:
      database.models.User.findAll = (async () => [ DATA.user ]) as any;

      // Arrange:
      const options = {};

      // Act:
      const res = await repository.getUsers(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty().toEqual([ DATA.user ]);
    });
    it('should return an empty list when records are not found', async () => {
      // Setup:
      database.models.User.findAll = (async () => []) as any;

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
      database.models.User.create = (async () => { throw ACTION_ERROR; }) as any;

      // Arrange:
      const values = DATA.user;

      // Act:
      const res = repository.createUser(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return user created', async () => {
      // Setup:
      database.models.User.create = (async () => DATA.user) as any;

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
      database.models.User.findByPk = (async () => { throw ACTION_ERROR; }) as any;

      // Arrange:
      const user_id = DATA.user.id;
      const options = {};

      // Act:
      const res = repository.getUser(user_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return null when user was not found', async () => {
      // Setup:
      database.models.User.findByPk = (async () => null) as any;

      // Arrange:
      const user_id = DATA.user.id;
      const options = {};

      // Act:
      const res = await repository.getUser(user_id, options);

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and strict is set true', () => {
      // Setup:
      database.models.User.findByPk = (async () => null) as any;

      // Arrange:
      const user_id = DATA.user.id;
      const options = {};

      // Act:
      const res = repository.getUser(user_id, options, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return user when is found', async () => {
      // Setup:
      database.models.User.findByPk = (async () => DATA.user) as any;

      // Arrange:
      const user_id = DATA.user.id;
      const options = {};

      // Act:
      const res = await repository.getUser(user_id, options);

      // Assert:
      expect(res).toEqual(DATA.user);
    });
  });

  describe('getUserByUsername', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.User.findOne = (async () => { throw ACTION_ERROR; }) as any;

      // Arrange:
      const user_id = DATA.user.id;
      const options = {};

      // Act:
      const res = repository.getUserByUsername(user_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return null when user was not found', async () => {
      // Setup:
      database.models.User.findOne = (async () => null) as any;

      // Arrange:
      const user_id = DATA.user.id;
      const options = {};

      // Act:
      const res = await repository.getUserByUsername(user_id, options);

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and throwNotFound is set true', () => {
      // Arrange:
      database.models.User.findOne = (async () => null) as any;
      const username = DATA.user.username;
      const options = {};
      const throwNotFound = true;

      // Act:
      const res = repository.getUserByUsername(username, options, throwNotFound);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return user when is found', async () => {
      // Setup:
      database.models.User.findOne = (async () => DATA.user) as any;

      // Arrange:
      const user_id = DATA.user.id;
      const options = {};

      // Act:
      const res = await repository.getUserByUsername(user_id, options);

      // Assert:
      expect(res).toEqual(DATA.user);
    });
  });

  describe('getUserByUsernameWithRoles', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.sequelize.query = (async () => { throw ACTION_ERROR; }) as any;

      // Arrange:
      const username = DATA.user.username;
      const options = {};

      // Act:
      const res = repository.getUserByUsernameWithRoles(username, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return null when user was not found', async () => {
      // Setup:
      database.sequelize.query = (async () => null) as any;

      // Arrange:
      const username = DATA.user.username;
      const options = {};

      // Act:
      const res = await repository.getUserByUsernameWithRoles(username, options);

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and throwNotFound is set true', () => {
      // Arrange:
      database.sequelize.query = (async () => null) as any;
      const username = DATA.user.username;
      const options = {};
      const throwNotFound = true;

      // Act:
      const res = repository.getUserByUsernameWithRoles(username, options, throwNotFound);

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return user when is found', async () => {
      // Setup:
      database.sequelize.query = (async () => DATA.user) as any;

      // Arrange:
      const username = DATA.user.username;
      const options = {};

      // Act:
      const res = await repository.getUserByUsernameWithRoles(username, options);

      // Assert:
      expect(res).toEqual(DATA.user);
    });
  });

  describe('updateUser', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.User.findByPk = (async () => ({
        update: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const user_id = DATA.user.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateUser(user_id, values, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return user updated when is found', async () => {
      // Arrange:
      database.models.User.findByPk = (async () => ({
        update: async () => ({
          extra: { enabled: true },
          updated_at: new Date()
        })
      })) as any;
      const user_id = DATA.user.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await repository.updateUser(user_id, values, options);

      // Assert:
      expect(res.extra).toEqual(values.extra);
    });
  });

  describe('deleteUser', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.User.findByPk = (async () => ({
        destroy: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const user_id = DATA.user.id;
      const options = {};

      // Act:
      const res = repository.deleteUser(user_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return user deleted when is found', async () => {
      // Arrange:
      database.models.User.findByPk = (async () => ({
        destroy: async () => ({
          updated_at: new Date(),
          deleted_at: new Date()
        })
      })) as any;
      const user_id = DATA.user.id;
      const options = {};

      // Act:
      const res = await repository.deleteUser(user_id, options);

      // Assert:
      expect(res.deleted_at).not.toBe(null);
    });
  });

  describe('getRoles', () => {
    it('should throw error when action fail', () => {
      // Mock:
      database.models.User.findByPk = (async () => ({
        getRoles: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const user_id = DATA.user.id;
      const options = {};

      // Act:
      const res = repository.getRoles(user_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Arrange:
      database.models.User.findByPk = (async () => ({
        getRoles: async () => [ DATA.role ]
      })) as any;
      const user_id = DATA.user.id;
      const options = {};

      // Act:
      const res = await repository.getRoles(user_id, options);

      // Assert:
      expect(res).toEqual([ DATA.role ]);
    });
    it('should return a list empty when records are not found', async () => {
      // Arrange:
      database.models.User.findByPk = (async () => ({
        getRoles: async () => []
      })) as any;
      const user_id = DATA.user.id;
      const options = {};

      // Act:
      const res = await repository.getRoles(user_id, options);

      // Assert:
      expect(res).toBeArray().toBeEmpty();
    });
  });

  describe('addRoles', () => {
    it('should throw error when action fail', () => {
      // Arrange:
      database.models.User.findByPk = (async () => ({
        addRoles: async () => { throw ACTION_ERROR; }
      })) as any;
      const user_id = DATA.user.id;
      const roles = [ DATA.role.id ];

      // Act:
      const res = repository.addRoles(user_id, roles);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations after adding them', async () => {
      // Arrange:
      database.models.User.findByPk = (async () => ({
        addRoles: async () => [ DATA.userRole ]
      })) as any;
      const user_id = DATA.user.id;
      const roles = [ DATA.role.id ];

      // Act:
      const res = await repository.addRoles(user_id, roles);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty();
      expect(res).toEqual([ DATA.userRole ]);
    });
  });

  describe('getRole', () => {
    it('should return null when role was not found', async () => {
      // Arrange:
      database.models.User.findByPk = (async () => ({
        getRoles: async () => null
      })) as any;
      const user_id = DATA.user.id;
      const role_id = DATA.role.id;
      const options = {};
      const throwNotFound = false;

      // Act:
      const res = await repository.getRole(user_id, role_id, options, throwNotFound);

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and throwNotFound is true', () => {
      // Arrange:
      database.models.User.findByPk = (async () => ({
        getRoles: async () => null
      })) as any;
      const user_id = DATA.user.id;
      const role_id = DATA.role.id;
      const options = {};
      const throwNotFound = true;

      // Act:
      const res = repository.getRole(user_id, role_id, options, throwNotFound);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Arrange:
      database.models.User.findByPk = (async () => ({
        getRoles: async () => { throw ACTION_ERROR; }
      })) as any;
      const user_id = DATA.user.id;
      const role_id = DATA.role.id;
      const options = {};
      const throwNotFound = true;

      // Act:
      const res = repository.getRole(user_id, role_id, options, throwNotFound);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      // Arrange:
      const expected = { ...DATA.role, UserRole: DATA.userRole };
      database.models.User.findByPk = (async () => ({
        getRoles: async () => expected
      })) as any;
      const user_id = DATA.user.id;
      const role_id = DATA.role.id;
      const options = {};
      const throwNotFound = true;

      // Act:
      const res = await repository.getRole(user_id, role_id, options, throwNotFound);

      // Assert:
      expect(res).toEqual(expected);
    });
  });

  describe('updateRole', () => {
    it('should throw error when action fail', () => {
      // Arrange:
      database.models.User.findByPk = (async () => ({
        getRoles: async () => ({
          UserRole: {
            update: async () => { throw ACTION_ERROR; }
          }
        })
      })) as any;
      const user_id = DATA.user.id;
      const role_id = DATA.role.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateRole(user_id, role_id, values, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association updated after update', async () => {
      // Arrange:
      database.models.User.findByPk = (async () => ({
        getRoles: async () => ({
          UserRole: {
            update: async () => ({
              ...DATA.userRole,
              extra: { enabled: true },
              updated_at: new Date('2019-10-10')
            })
          }
        })
      })) as any;
      const user_id = DATA.userRole.user_id;
      const role_id = DATA.userRole.role_id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await repository.updateRole(user_id, role_id, values, options);

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
      database.models.User.findByPk = (async () => ({
        getRoles: async () => ({
          UserRole: {
            destroy: async () => { throw ACTION_ERROR; }
          }
        })
      })) as any;
      const user_id = DATA.user.id;
      const role_id = DATA.role.id;
      const options = {};

      // Act:
      const res = repository.deleteRole(user_id, role_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association deleted after delete', async () => {
      // Arrange:
      database.models.User.findByPk = (async () => ({
        getRoles: async () => ({
          UserRole: {
            destroy: async () => ({
              ...DATA.userRole,
              updated_at: new Date('2019-10-10'),
              deleted_at: new Date('2019-10-10')
            })
          }
        })
      })) as any;
      const user_id = DATA.userRole.user_id;
      const role_id = DATA.userRole.role_id;
      const options = {};

      // Act:
      const res = await repository.deleteRole(user_id, role_id, options);

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.user_id).toEqual(user_id);
      expect(res.role_id).toEqual(role_id);
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });
});
