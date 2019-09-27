import '../../../config/global';
import { PermissionRepository } from '../../../../src/core/permissions/permissions-repository';
import { PermissionService } from '../../../../src/core/permissions/permissions-service';
import { I } from '../../../../src/core/permissions/permissions-types';
import { ERROR_BAD_GATEWAY as ACTION_ERROR } from '../../../config/errors';
import * as DATA from '../../../config/models';

describe('Permission Service', () => {
  let database = {};
  let repository = PermissionRepository(database);
  let service:I.service = PermissionService(repository);

  beforeEach(async () => { service = PermissionService(repository); });

  describe('getPermissions', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.getPermissions = async () => { throw ACTION_ERROR; };

      // Arrange:
      const options = {};

      // Act:
      const res = service.getPermissions(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of permissions', async () => {
      // Setup:
      repository.getPermissions = async () => [ DATA.permission ];

      // Arrange:
      const options = {};

      // Act:
      const res = await service.getPermissions(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty().toEqual([ DATA.permission ]);
    });
  });

  describe('createPermission', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.createPermission = async () => { throw ACTION_ERROR; };

      // Arrange:
      const values = DATA.permission;

      // Act:
      const res = service.createPermission(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return permission created', async () => {
      // Setup:
      repository.createPermission = async () => DATA.permission;

      // Arrange:
      const values = DATA.permission;

      // Act:
      const res = await service.createPermission(values);

      // Assert:
      expect(res).toEqual(DATA.permission);
    });
  });

  describe('getPermission', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.getPermission = async () => { throw ACTION_ERROR; };

      // Arrange:
      const permission_id = DATA.permission.id;
      const options = {};

      // Act:
      const res = service.getPermission(permission_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return permission when is found', async () => {
      // Setup:
      repository.getPermission = async () => DATA.permission;

      // Arrange:
      const permission_id = DATA.permission.id;
      const options = {};

      // Act:
      const res = await service.getPermission(permission_id, options);

      // Assert:
      expect(res).toEqual(DATA.permission);
    });
  });

  describe('updatePermission', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.updatePermission = async () => { throw ACTION_ERROR; };

      // Arrange:
      const permission_id = DATA.permission.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = service.updatePermission(permission_id, values, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return permission updated when is found', async () => {
      // Setup:
      repository.updatePermission = async () => ({
        extra: { enabled: true },
        updated_at: new Date('2019-10-10')
      });

      // Arrange:
      const permission_id = DATA.permission.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await service.updatePermission(permission_id, values, options);

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.extra).toEqual({ enabled: true });
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('deletePermission', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.deletePermission = async () => { throw ACTION_ERROR; };

      // Arrange:
      const permission_id = DATA.permission.id;
      const options = {};

      // Act:
      const res = service.deletePermission(permission_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return permission updated when is found', async () => {
      // Setup:
      repository.deletePermission = async () => ({
        updated_at: new Date('2019-10-10'),
        deleted_at: new Date('2019-10-10')
      });

      // Arrange:
      const permission_id = DATA.permission.id;
      const options = {};

      // Act:
      const res = await service.deletePermission(permission_id, options);

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });
});
