const Repository = require('src/core/roles/roles-repository');
const Service = require('src/core/roles/roles-service');
const ACTION_ERROR = require('test/config/errors').ERROR_BAD_GATEWAY;
const DATA = require('test/config/models');

describe('Role Service', () => {
  const database = {};
  const repository = Repository({ database });
  let service = null;

  beforeEach(async () => { service = Service({ repository }); });

  describe('getRoles', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'getRoles').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const options = {};

      // Act:
      const res = service.getRoles(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of roles', async () => {
      // Setup:
      jest.spyOn(repository, 'getRoles').mockResolvedValue([ DATA.role ]);

      // Arrange:
      const options = {};

      // Act:
      const res = await service.getRoles(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty().toEqual([ DATA.role ]);
    });
  });

  describe('createRole', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'createRole').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const values = DATA.role;

      // Act:
      const res = service.createRole(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return role created', async () => {
      // Setup:
      jest.spyOn(repository, 'createRole').mockResolvedValue(DATA.role);

      // Arrange:
      const values = DATA.role;

      // Act:
      const res = await service.createRole(values);

      // Assert:
      expect(res).toEqual(DATA.role);
    });
  });

  describe('getRole', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'getRole').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const role_id = DATA.role.id;
      const options = {};

      // Act:
      const res = service.getRole({ role_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return role when is found', async () => {
      // Setup:
      jest.spyOn(repository, 'getRole').mockResolvedValue(DATA.role);

      // Arrange:
      const role_id = DATA.role.id;
      const options = {};

      // Act:
      const res = await service.getRole({ role_id, options });

      // Assert:
      expect(res).toEqual(DATA.role);
    });
  });

  describe('updateRole', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'updateRole').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const role_id = DATA.role.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = service.updateRole({ role_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return role updated when is found', async () => {
      // Setup:
      jest.spyOn(repository, 'updateRole').mockResolvedValue({
        extra: { enabled: true },
        updated_at: new Date('2019-10-10')
      });

      // Arrange:
      const role_id = DATA.role.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await service.updateRole({ role_id, values, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.extra).toEqual({ enabled: true });
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('deleteRole', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'deleteRole').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const role_id = DATA.role.id;
      const options = {};

      // Act:
      const res = service.deleteRole({ role_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return role updated when is found', async () => {
      // Setup:
      jest.spyOn(repository, 'deleteRole').mockResolvedValue({
        updated_at: new Date('2019-10-10'),
        deleted_at: new Date('2019-10-10')
      });

      // Arrange:
      const role_id = DATA.role.id;
      const options = {};

      // Act:
      const res = await service.deleteRole({ role_id, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('getPermissions', () => {
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(repository, 'getPermissions').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const role_id = DATA.role.id;
      const options = {};

      // Act:
      const res = service.getPermissions({ role_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      jest.spyOn(repository, 'getPermissions').mockResolvedValue([ DATA.permission ]);

      // Arrange:
      const role_id = DATA.role.id;
      const options = {};

      // Act:
      const res = await service.getPermissions({ role_id, options });

      // Assert:
      expect(res).toEqual([ DATA.permission ]);
    });
  });

  describe('addPermissions', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'addPermissions').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const options = { role_id: DATA.role.id, permissions: [ DATA.permission.id ] };

      // Act:
      const res = service.addPermissions(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations after adding them', async () => {
      // Setup:
      jest.spyOn(repository, 'addPermissions').mockResolvedValue([ DATA.rolePermission ]);

      // Arrange:
      const options = { role_id: DATA.role.id, permissions: [ DATA.permission.id ] };

      // Act:
      const res = await service.addPermissions(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty();
      expect(res).toEqual([ DATA.rolePermission ]);
    });
  });

  describe('getPermission', () => {
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(repository, 'getPermission').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const role_id = DATA.role.id;
      const permission_id = DATA.permission.id;
      const options = {};

      // Act:
      const res = service.getPermission({ role_id, permission_id, options }, true);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.permission, RolePermission: DATA.rolePermission };

      // Mock:
      jest.spyOn(repository, 'getPermission').mockResolvedValue(expected);

      // Arrange:
      const role_id = DATA.role.id;
      const permission_id = DATA.permission.id;
      const options = {};

      // Act:
      const res = await service.getPermission({ role_id, permission_id, options }, true);

      // Assert:
      expect(res).toEqual(expected)
    });
  });

  describe('updatePermission', () => {
    it('should throw error when action fail', () => {
      // Before:
      jest.spyOn(repository, 'updatePermission').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const role_id = DATA.role.id;
      const permission_id = DATA.permission.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = service.updatePermission({ role_id, permission_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association updated after update', async () => {
      // Before:
      jest.spyOn(repository, 'updatePermission').mockResolvedValue({
        ...DATA.rolePermission,
        extra: { enabled: true },
        updated_at: new Date('2019-10-10')
      });

      // Arrange:
      const role_id = DATA.rolePermission.role_id;
      const permission_id = DATA.rolePermission.permission_id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await service.updatePermission({ role_id, permission_id, values, options });

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
      jest.spyOn(repository, 'deletePermission').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const role_id = DATA.role.id;
      const permission_id = DATA.permission.id;
      const options = {};

      // Act:
      const res = service.deletePermission({ role_id, permission_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association deleted after delete', async () => {
      // Before:
      jest.spyOn(repository, 'deletePermission').mockResolvedValue({
        role_id: DATA.rolePermission.role_id,
        permission_id: DATA.rolePermission.permission_id,
        deleted_at: new Date('2019-10-10')
      });

      // Arrange:
      const role_id = DATA.rolePermission.role_id;
      const permission_id = DATA.rolePermission.permission_id;
      const options = {};

      // Act:
      const res = await service.deletePermission({ role_id, permission_id, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.role_id).toEqual(role_id);
      expect(res.permission_id).toEqual(permission_id);
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });
});
