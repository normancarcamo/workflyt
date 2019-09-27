import '../../../config/global';
import * as DATA from '../../../config/models';
import DATABASE from '../../../config/database';
import { ERROR_BAD_GATEWAY as ACTION_ERROR } from '../../../config/errors';
import { RoleRepository } from '../../../../src/core/roles/roles-repository';

describe('Role Repository', () => {
  const database = { ...DATABASE() };
  const repository = RoleRepository(database);

  beforeEach(async () => { database.models = DATABASE().models; });

  describe('getRoles', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Role.findAll = (async () => { throw ACTION_ERROR; }) as any;

      // Arrange:
      const options = {};

      // Act:
      const res = repository.getRoles(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of roles', async () => {
      // Setup:
      database.models.Role.findAll = (async () => [ DATA.role ]) as any;

      // Arrange:
      const options = {};

      // Act:
      const res = await repository.getRoles(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty().toEqual([ DATA.role ]);
    });
    it('should return an empty list when records are not found', async () => {
      // Setup:
      database.models.Role.findAll = (async () => []) as any;

      // Arrange:
      const options = {};

      // Act:
      const res = await repository.getRoles(options);

      // Assert:
      expect(res).toBeArray().toBeEmpty();
    });
  });

  describe('createRole', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Role.create = (async () => { throw ACTION_ERROR; }) as any;

      // Arrange:
      const values = DATA.role;

      // Act:
      const res = repository.createRole(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return role created', async () => {
      // Setup:
      database.models.Role.create = (async () => DATA.role) as any;

      // Arrange:
      const values = DATA.role;

      // Act:
      const res = await repository.createRole(values);

      // Assert:
      expect(res).toEqual(DATA.role);
    });
  });

  describe('getRole', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Role.findByPk = (async () => { throw ACTION_ERROR; }) as any;

      // Arrange:
      const role_id = DATA.role.id;
      const options = {};

      // Act:
      const res = repository.getRole(role_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return null when role was not found', async () => {
      // Setup:
      database.models.Role.findByPk = (async () => null) as any;

      // Arrange:
      const role_id = DATA.role.id;
      const options = {};

      // Act:
      const res = await repository.getRole(role_id, options);

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and strict is set true', () => {
      // Setup:
      database.models.Role.findByPk = (async () => null) as any;

      // Arrange:
      const role_id = DATA.role.id;
      const options = {};

      // Act:
      const res = repository.getRole(role_id, options, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return role when is found', async () => {
      // Setup:
      database.models.Role.findByPk = (async () => DATA.role) as any;

      // Arrange:
      const role_id = DATA.role.id;
      const options = {};

      // Act:
      const res = await repository.getRole(role_id, options);

      // Assert:
      expect(res).toEqual(DATA.role);
    });
  });

  describe('updateRole', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Role.findByPk = (async () => ({
        update: async (values:object, options?:object) => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const role_id = DATA.role.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateRole(role_id, values, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return role updated when is found', async () => {
      // Setup:
      database.models.Role.findByPk = (async () => ({
        update: async (values:object, options?:object) => ({
          extra: { enabled: true },
          updated_at: new Date()
        })
      })) as any;

      // Arrange:
      const role_id = DATA.role.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await repository.updateRole(role_id, values, options);

      // Assert:
      expect(res.extra).toEqual(values.extra);
    });
  });

  describe('deleteRole', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Role.findByPk = (async () => ({
        destroy: (options?:object) => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const role_id = DATA.role.id;
      const options = {};

      // Act:
      const res = repository.deleteRole(role_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return role deleted when is found', async () => {
      // Setup:
      database.models.Role.findByPk = (async () => ({
        destroy: async (options?:object) => ({
          updated_at: new Date(),
          deleted_at: new Date()
        })
      })) as any;

      // Arrange:
      const role_id = DATA.role.id;
      const options = {};

      // Act:
      const res = await repository.deleteRole(role_id, options);

      // Assert:
      expect(res.deleted_at).not.toBe(null);
    });
  });

  describe('getPermissions', () => {
    it('should throw error when action fail', () => {
      // Mock:
      database.models.Role.findByPk = (async () => ({
        getPermissions: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const role_id = DATA.role.id;
      const options = {};

      // Act:
      const res = repository.getPermissions(role_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      database.models.Role.findByPk = (async () => ({
        getPermissions: async () => [ DATA.permission ]
      })) as any;

      // Arrange:
      const role_id = DATA.role.id;
      const options = {};

      // Act:
      const res = await repository.getPermissions(role_id, options);

      // Assert:
      expect(res).toEqual([ DATA.permission ]);
    });
    it('should return a list empty when records are not found', async () => {
      // Mock:
      database.models.Role.findByPk = (async () => ({
        getPermissions: async () => []
      })) as any;

      // Arrange:
      const role_id = DATA.role.id;
      const options = {};

      // Act:
      const res = await repository.getPermissions(role_id, options);

      // Assert:
      expect(res).toBeArray().toBeEmpty();
    });
  });

  describe('addPermissions', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Role.findByPk = (async () => ({
        addPermissions: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const role_id = DATA.role.id;
      const permissions = [ DATA.permission.id ];

      // Act:
      const res = repository.addPermissions(role_id, permissions);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations after adding them', async () => {
      // Setup:
      database.models.Role.findByPk = (async () => ({
        addPermissions: async () => [ DATA.rolePermission ]
      })) as any;

      // Arrange:
      const role_id = DATA.role.id;
      const permissions = [ DATA.permission.id ];

      // Act:
      const res = await repository.addPermissions(role_id, permissions);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty();
      expect(res).toEqual([ DATA.rolePermission ]);
    });
  });

  describe('getPermission', () => {
    it('should return null when permission was not found', async () => {
      // Mock:
      database.models.Role.findByPk = (async () => ({
        getPermissions: async () => null
      })) as any;

      // Arrange:
      const role_id = DATA.role.id;
      const permission_id = DATA.permission.id;
      const options = {};

      // Act:
      const res = await repository.getPermission(role_id, permission_id, options);

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and assert is true', () => {
      // Mock:
      database.models.Role.findByPk = (async () => ({
        getPermissions: async () => null
      })) as any;

      // Arrange:
      const role_id = DATA.role.id;
      const permission_id = DATA.permission.id;
      const options = {};

      // Act:
      const res = repository.getPermission(role_id, permission_id, options, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Mock:
      database.models.Role.findByPk = (async () => ({
        getPermissions: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const role_id = DATA.role.id;
      const permission_id = DATA.permission.id;
      const options = {};

      // Act:
      const res = repository.getPermission(role_id, permission_id, options, true);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.permission, RolePermission: DATA.rolePermission };

      // Mock:
      database.models.Role.findByPk = (async () => ({
        getPermissions: async () => expected
      })) as any;

      // Arrange:
      const role_id = DATA.role.id;
      const permission_id = DATA.permission.id;
      const options = {};

      // Act:
      const res = await repository.getPermission(role_id, permission_id, options, true);

      // Assert:
      expect(res).toEqual(expected)
    });
  });

  describe('updatePermission', () => {
    it('should throw error when action fail', () => {
      // Before:
      database.models.Role.findByPk = (async () => ({
        getPermissions: async () => ({
          RolePermission: {
            update: async () => { throw ACTION_ERROR; }
          }
        })
      })) as any;

      // Arrange:
      const role_id = DATA.role.id;
      const permission_id = DATA.permission.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updatePermission(role_id, permission_id, values, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association updated after update', async () => {
      // Before:
      database.models.Role.findByPk = (async () => ({
        getPermissions: async () => ({
          RolePermission: {
            update: async () => ({
              ...DATA.rolePermission,
              extra: { enabled: true },
              updated_at: new Date('2019-10-10')
            })
          }
        })
      })) as any;

      // Arrange:
      const role_id = DATA.rolePermission.role_id;
      const permission_id = DATA.rolePermission.permission_id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await repository.updatePermission(role_id, permission_id, values, options);

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.role_id).toEqual(role_id);
      expect(res.permission_id).toEqual(permission_id);
      expect(res.extra).toEqual({ enabled: true });
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('deletePermission', () => {
    it('should throw error when action fail', () => {
      // Before:
      database.models.Role.findByPk = (async () => ({
        getPermissions: async () => ({
          RolePermission: {
            destroy: async () => { throw ACTION_ERROR; }
          }
        })
      })) as any;

      // Arrange:
      const role_id = DATA.role.id;
      const permission_id = DATA.permission.id;
      const options = {};

      // Act:
      const res = repository.deletePermission(role_id, permission_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association deleted after delete', async () => {
      // Before:
      database.models.Role.findByPk = (async () => ({
        getPermissions: async () => ({
          RolePermission: {
            destroy: async () => ({
              ...DATA.rolePermission,
              updated_at: new Date('2019-10-10'),
              deleted_at: new Date('2019-10-10')
            })
          }
        })
      })) as any;

      // Arrange:
      const role_id = DATA.rolePermission.role_id;
      const permission_id = DATA.rolePermission.permission_id;
      const options = {};

      // Act:
      const res = await repository.deletePermission(role_id, permission_id, options);

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.role_id).toEqual(role_id);
      expect(res.permission_id).toEqual(permission_id);
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });
});
