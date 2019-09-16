const Repository = require('src/core/roles/roles-repository');
const ACTION_ERROR = require('test/config/errors').ERROR_BAD_GATEWAY;
const DATA = require('test/config/models');
const DATABASE = require('test/config/database');

describe('Role Repository', () => {
  const database = { ...DATABASE };
  const repository = Repository({ database });

  beforeEach(async () => { database.models = DATABASE.models; });

  describe('getRoles', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Role, 'findAll').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const options = {};

      // Act:
      const res = repository.getRoles(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of roles', async () => {
      // Setup:
      jest.spyOn(database.models.Role, 'findAll')
        .mockResolvedValue([ DATA.role ]);

      // Arrange:
      const options = {};

      // Act:
      const res = await repository.getRoles(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty().toEqual([ DATA.role ]);
    });
    it('should return an empty list when records are not found', async () => {
      // Setup:
      jest.spyOn(database.models.Role, 'findAll').mockResolvedValue([]);

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
      jest.spyOn(database.models.Role, 'create').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const values = DATA.role;

      // Act:
      const res = repository.createRole(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return role created', async () => {
      // Setup:
      jest.spyOn(database.models.Role, 'create')
        .mockResolvedValue(DATA.role);

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
      jest.spyOn(database.models.Role, 'findByPk').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const role_id = DATA.role.id;
      const options = {};

      // Act:
      const res = repository.getRole({ role_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return null when role was not found', async () => {
      // Setup:
      jest.spyOn(database.models.Role, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const role_id = DATA.role.id;
      const options = {};

      // Act:
      const res = await repository.getRole({ role_id, options });

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and strict is set true', () => {
      // Setup:
      jest.spyOn(database.models.Role, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const role_id = DATA.role.id;
      const options = {};

      // Act:
      const res = repository.getRole({ role_id, options }, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return role when is found', async () => {
      // Setup:
      jest.spyOn(database.models.Role, 'findByPk')
        .mockResolvedValue(DATA.role);

      // Arrange:
      const role_id = DATA.role.id;
      const options = {};

      // Act:
      const res = await repository.getRole({ role_id, options });

      // Assert:
      expect(res).toEqual(DATA.role);
    });
  });

  describe('updateRole', () => {
    it('should throw error when role was not found', () => {
      // Setup:
      jest.spyOn(database.models.Role, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const role_id = DATA.role.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateRole({ role_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Role, 'findByPk').mockResolvedValue({
        update: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const role_id = DATA.role.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateRole({ role_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return role updated when is found', async () => {
      // Setup:
      jest.spyOn(database.models.Role, 'findByPk').mockResolvedValue({
        update: jest.fn().mockResolvedValue({
          extra: { enabled: true },
          updated_at: new Date()
        })
      });

      // Arrange:
      const role_id = DATA.role.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await repository.updateRole({ role_id, values, options });

      // Assert:
      expect(res.extra).toEqual(values.extra);
    });
  });

  describe('deleteRole', () => {
    it('should throw error when role was not found', () => {
      // Setup:
      jest.spyOn(database.models.Role, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const role_id = DATA.role.id;
      const options = {};

      // Act:
      const res = repository.deleteRole({ role_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Role, 'findByPk').mockResolvedValue({
        destroy: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const role_id = DATA.role.id;
      const options = {};

      // Act:
      const res = repository.deleteRole({ role_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return role deleted when is found', async () => {
      // Setup:
      jest.spyOn(database.models.Role, 'findByPk').mockResolvedValue({
        destroy: jest.fn().mockResolvedValue({
          updated_at: new Date(),
          deleted_at: new Date()
        })
      });

      // Arrange:
      const role_id = DATA.role.id;
      const options = {};

      // Act:
      const res = await repository.deleteRole({ role_id, options });

      // Assert:
      expect(res.deleted_at).not.toBe(null);
    });
  });

  describe('getPermissions', () => {
    it('should throw error when role was not found', () => {
      // Setup:
      jest.spyOn(database.models.Role, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const role_id = DATA.role.id;
      const options = {};

      // Act:
      const res = repository.getPermissions({ role_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(database.models.Role, 'findByPk').mockResolvedValue({
        getPermissions: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const role_id = DATA.role.id;
      const options = {};

      // Act:
      const res = repository.getPermissions({ role_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      jest.spyOn(database.models.Role, 'findByPk').mockResolvedValue({
        getPermissions: jest.fn().mockResolvedValue([ DATA.permission ])
      });

      // Arrange:
      const role_id = DATA.role.id;
      const options = {};

      // Act:
      const res = await repository.getPermissions({ role_id, options });

      // Assert:
      expect(res).toEqual([ DATA.permission ]);
    });
    it('should return a list empty when records are not found', async () => {
      // Mock:
      jest.spyOn(database.models.Role, 'findByPk').mockResolvedValue({
        getPermissions: jest.fn().mockResolvedValue([])
      });

      // Arrange:
      const role_id = DATA.role.id;
      const options = {};

      // Act:
      const res = await repository.getPermissions({ role_id, options });

      // Assert:
      expect(res).toBeArray().toBeEmpty();
    });
  });

  describe('addPermissions', () => {
    it('should throw error when role was not found', () => {
      // Setup:
      jest.spyOn(database.models.Role, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const role_id = DATA.role.id;
      const permissions = [ DATA.permission.id ];

      // Act:
      const res = repository.addPermissions({ role_id, permissions });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Role, 'findByPk').mockResolvedValue({
        addPermissions: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const options = {
        role_id: DATA.role.id,
        permissions: [ DATA.permission.id ]
      };

      // Act:
      const res = repository.addPermissions(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations after adding them', async () => {
      // Setup:
      jest.spyOn(database.models.Role, 'findByPk').mockResolvedValue({
        addPermissions: jest.fn().mockResolvedValue([
          DATA.rolePermission
        ])
      });

      // Arrange:
      const options = {
        role_id: DATA.role.id,
        permissions: [ DATA.permission.id ]
      };

      // Act:
      const res = await repository.addPermissions(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty();
      expect(res).toEqual([ DATA.rolePermission ]);
    });
  });

  describe('getPermission', () => {
    it('should throw error when role was not found', () => {
      // Setup:
      jest.spyOn(database.models.Role, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const role_id = DATA.role.id;
      const permission_id = DATA.permission.id;
      const options = {};

      // Act:
      const res = repository.getPermission({ role_id, permission_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return null when permission was not found', async () => {
      // Mock:
      jest.spyOn(database.models.Role, 'findByPk').mockResolvedValue({
        getPermissions: jest.fn().mockResolvedValue(null)
      });

      // Arrange:
      const role_id = DATA.role.id;
      const permission_id = DATA.permission.id;
      const options = {};

      // Act:
      const res = await repository.getPermission({ role_id, permission_id, options });

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and assert is true', () => {
      // Mock:
      jest.spyOn(database.models.Role, 'findByPk').mockResolvedValue({
        getPermissions: jest.fn().mockResolvedValue(null)
      });

      // Arrange:
      const role_id = DATA.role.id;
      const permission_id = DATA.permission.id;
      const options = {};

      // Act:
      const res = repository.getPermission({ role_id, permission_id, options }, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(database.models.Role, 'findByPk').mockResolvedValue({
        getPermissions: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const role_id = DATA.role.id;
      const permission_id = DATA.permission.id;
      const options = {};

      // Act:
      const res = repository.getPermission({ role_id, permission_id, options }, true);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.permission, RolePermission: DATA.rolePermission };

      // Mock:
      jest.spyOn(database.models.Role, 'findByPk').mockResolvedValue({
        getPermissions: jest.fn().mockResolvedValue(expected)
      });

      // Arrange:
      const role_id = DATA.role.id;
      const permission_id = DATA.permission.id;
      const options = {};

      // Act:
      const res = await repository.getPermission({ role_id, permission_id, options }, true);

      // Assert:
      expect(res).toEqual(expected)
    });
  });

  describe('updatePermission', () => {
    it('should throw error when role was not found', () => {
      // Before:
      jest.spyOn(database.models.Role, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const role_id = DATA.role.id;
      const permission_id = DATA.permission.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updatePermission({ role_id, permission_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return null when permission was not found', () => {
      // Before:
      jest.spyOn(database.models.Role, 'findByPk').mockResolvedValue({
        getPermissions: jest.fn().mockResolvedValue(null)
      });

      // Arrange:
      const role_id = DATA.role.id;
      const permission_id = DATA.permission.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updatePermission({ role_id, permission_id, values, options });

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Before:
      jest.spyOn(database.models.Role, 'findByPk').mockResolvedValue({
        getPermissions: jest.fn().mockResolvedValue({
          RolePermission: {
            update: jest.fn().mockRejectedValue(ACTION_ERROR)
          }
        })
      });

      // Arrange:
      const role_id = DATA.role.id;
      const permission_id = DATA.permission.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updatePermission({ role_id, permission_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association updated after update', async () => {
      // Before:
      jest.spyOn(database.models.Role, 'findByPk').mockResolvedValue({
        getPermissions: jest.fn().mockResolvedValue({
          RolePermission: {
            update: jest.fn().mockResolvedValue({
              ...DATA.rolePermission,
              extra: { enabled: true },
              updated_at: new Date('2019-10-10')
            })
          }
        })
      });

      // Arrange:
      const role_id = DATA.rolePermission.role_id;
      const permission_id = DATA.rolePermission.permission_id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await repository.updatePermission({ role_id, permission_id, values, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.role_id).toEqual(role_id);
      expect(res.permission_id).toEqual(permission_id);
      expect(res.extra).toEqual({ enabled: true });
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('deletePermission', () => {
    it('should throw error when role was not found', () => {
      // Before:
      jest.spyOn(database.models.Role, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const role_id = DATA.role.id;
      const permission_id = DATA.permission.id;
      const options = {};

      // Act:
      const res = repository.deletePermission({ role_id, permission_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return null when permission was not found', () => {
      // Before:
      jest.spyOn(database.models.Role, 'findByPk').mockResolvedValue({
        getPermissions: jest.fn().mockResolvedValue(null)
      });

      // Arrange:
      const role_id = DATA.role.id;
      const permission_id = DATA.permission.id;
      const options = {};

      // Act:
      const res = repository.deletePermission({ role_id, permission_id, options });

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Before:
      jest.spyOn(database.models.Role, 'findByPk').mockResolvedValue({
        getPermissions: jest.fn().mockResolvedValue({
          RolePermission: {
            destroy: jest.fn().mockRejectedValue(ACTION_ERROR)
          }
        })
      });

      // Arrange:
      const role_id = DATA.role.id;
      const permission_id = DATA.permission.id;
      const options = {};

      // Act:
      const res = repository.deletePermission({ role_id, permission_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association deleted after delete', async () => {
      // Before:
      jest.spyOn(database.models.Role, 'findByPk').mockResolvedValue({
        getPermissions: jest.fn().mockResolvedValue({
          RolePermission: {
            destroy: jest.fn().mockResolvedValue({
              ...DATA.rolePermission,
              updated_at: new Date('2019-10-10'),
              deleted_at: new Date('2019-10-10')
            })
          }
        })
      });

      // Arrange:
      const role_id = DATA.rolePermission.role_id;
      const permission_id = DATA.rolePermission.permission_id;
      const options = {};

      // Act:
      const res = await repository.deletePermission({ role_id, permission_id, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.role_id).toEqual(role_id);
      expect(res.permission_id).toEqual(permission_id);
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });
});
