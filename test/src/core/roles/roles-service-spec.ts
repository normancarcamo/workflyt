import '../../../config/global';
import { RoleRepository } from '../../../../src/core/roles/roles-repository';
import { RoleService } from '../../../../src/core/roles/roles-service';
import { I } from '../../../../src/core/roles/roles-types';
import { ERROR_BAD_GATEWAY as ACTION_ERROR } from '../../../config/errors';
import * as DATA from '../../../config/models';

describe('Role Service', () => {
  let database = {};
  let repository = RoleRepository(database);
  let service:I.service = RoleService(repository);

  beforeEach(async () => { service = RoleService(repository); });

  describe('getRoles', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.getRoles = async () => { throw ACTION_ERROR; };

      // Arrange:
      const options = {};

      // Act:
      const res = service.getRoles(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of roles', async () => {
      // Setup:
      repository.getRoles = async () => [ DATA.role ];

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
      repository.createRole = async () => { throw ACTION_ERROR; };

      // Arrange:
      const values = DATA.role;

      // Act:
      const res = service.createRole(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return role created', async () => {
      // Setup:
      repository.createRole = async () => DATA.role;

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
      repository.getRole = async () => { throw ACTION_ERROR; };

      // Arrange:
      const role_id = DATA.role.id;
      const options = {};

      // Act:
      const res = service.getRole(role_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return role when is found', async () => {
      // Setup:
      repository.getRole = async () => DATA.role;

      // Arrange:
      const role_id = DATA.role.id;
      const options = {};

      // Act:
      const res = await service.getRole(role_id, options);

      // Assert:
      expect(res).toEqual(DATA.role);
    });
  });

  describe('updateRole', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.updateRole = async () => { throw ACTION_ERROR; };

      // Arrange:
      const role_id = DATA.role.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = service.updateRole(role_id, values, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return role updated when is found', async () => {
      // Setup:
      repository.updateRole = async () => ({
        extra: { enabled: true },
        updated_at: new Date('2019-10-10')
      });

      // Arrange:
      const role_id = DATA.role.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await service.updateRole(role_id, values, options);

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.extra).toEqual({ enabled: true });
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('deleteRole', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.deleteRole = async () => { throw ACTION_ERROR; };

      // Arrange:
      const role_id = DATA.role.id;
      const options = {};

      // Act:
      const res = service.deleteRole(role_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return role updated when is found', async () => {
      // Setup:
      repository.deleteRole = async () => ({
        updated_at: new Date('2019-10-10'),
        deleted_at: new Date('2019-10-10')
      });

      // Arrange:
      const role_id = DATA.role.id;
      const options = {};

      // Act:
      const res = await service.deleteRole(role_id, options);

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('getPermissions', () => {
    it('should throw error when action fail', () => {
      // Mock:
      repository.getPermissions = async () => { throw ACTION_ERROR; };

      // Arrange:
      const role_id = DATA.role.id;
      const options = {};

      // Act:
      const res = service.getPermissions(role_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      repository.getPermissions = async () => [ DATA.permission ];

      // Arrange:
      const role_id = DATA.role.id;
      const options = {};

      // Act:
      const res = await service.getPermissions(role_id, options);

      // Assert:
      expect(res).toEqual([ DATA.permission ]);
    });
  });

  describe('addPermissions', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.addPermissions = async () => { throw ACTION_ERROR; };

      // Arrange:
      const role_id = DATA.role.id;
      const permissions = [ DATA.permission.id ];

      // Act:
      const res = service.addPermissions(role_id, permissions);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations after adding them', async () => {
      // Setup:
      repository.addPermissions = async () => [ DATA.rolePermission ];

      // Arrange:
      const role_id = DATA.role.id;
      const permissions = [ DATA.permission.id ];

      // Act:
      const res = await service.addPermissions(role_id, permissions);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty();
      expect(res).toEqual([ DATA.rolePermission ]);
    });
  });

  describe('getPermission', () => {
    it('should throw error when action fail', () => {
      // Mock:
      repository.getPermission = async () => { throw ACTION_ERROR; };

      // Arrange:
      const role_id = DATA.role.id;
      const permission_id = DATA.permission.id;
      const options = {};

      // Act:
      const res = service.getPermission(role_id, permission_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.permission, RolePermission: DATA.rolePermission };

      // Mock:
      repository.getPermission = async () => expected;

      // Arrange:
      const role_id = DATA.role.id;
      const permission_id = DATA.permission.id;
      const options = {};

      // Act:
      const res = await service.getPermission(role_id, permission_id, options);

      // Assert:
      expect(res).toEqual(expected)
    });
  });

  describe('updatePermission', () => {
    it('should throw error when action fail', () => {
      // Before:
      repository.updatePermission = async () => { throw ACTION_ERROR; };

      // Arrange:
      const role_id = DATA.role.id;
      const permission_id = DATA.permission.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = service.updatePermission(role_id, permission_id, values, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association updated after update', async () => {
      // Before:
      repository.updatePermission = async () => ({
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
      const res = await service.updatePermission(role_id, permission_id, values, options);

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
      repository.deletePermission = async () => { throw ACTION_ERROR; };

      // Arrange:
      const role_id = DATA.role.id;
      const permission_id = DATA.permission.id;
      const options = {};

      // Act:
      const res = service.deletePermission(role_id, permission_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association deleted after delete', async () => {
      // Before:
      repository.deletePermission = async () => ({
        role_id: DATA.rolePermission.role_id,
        permission_id: DATA.rolePermission.permission_id,
        deleted_at: new Date('2019-10-10')
      });

      // Arrange:
      const role_id = DATA.rolePermission.role_id;
      const permission_id = DATA.rolePermission.permission_id;
      const options = {};

      // Act:
      const res = await service.deletePermission(role_id, permission_id, options);

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.role_id).toEqual(role_id);
      expect(res.permission_id).toEqual(permission_id);
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });
});
