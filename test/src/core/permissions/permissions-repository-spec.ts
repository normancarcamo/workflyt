import '../../../config/global';
import * as DATA from '../../../config/models';
import DATABASE from '../../../config/database';
import { ERROR_BAD_GATEWAY as ACTION_ERROR } from '../../../config/errors';
import { PermissionRepository } from '../../../../src/core/permissions/permissions-repository';

describe('Permission Repository', () => {
  const database = { ...DATABASE() };
  const repository = PermissionRepository(database);

  beforeEach(async () => { database.models = DATABASE().models; });

  describe('getPermissions', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Permission.findAll = (async () => { throw ACTION_ERROR; }) as any;

      // Arrange:
      const options = {};

      // Act:
      const res = repository.getPermissions(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of permissions', async () => {
      // Setup:
      database.models.Permission.findAll = (async () => [ DATA.permission ]) as any;

      // Arrange:
      const options = {};

      // Act:
      const res = await repository.getPermissions(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty().toEqual([ DATA.permission ]);
    });
    it('should return an empty list when records are not found', async () => {
      // Setup:
      database.models.Permission.findAll = (async () => []) as any;

      // Arrange:
      const options = {};

      // Act:
      const res = await repository.getPermissions(options);

      // Assert:
      expect(res).toBeArray().toBeEmpty();
    });
  });

  describe('createPermission', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Permission.create = (async () => { throw ACTION_ERROR; }) as any;

      // Arrange:
      const values = DATA.permission;

      // Act:
      const res = repository.createPermission(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return permission created', async () => {
      // Setup:
      database.models.Permission.create = (async () => DATA.permission) as any;

      // Arrange:
      const values = DATA.permission;

      // Act:
      const res = await repository.createPermission(values);

      // Assert:
      expect(res).toEqual(DATA.permission);
    });
  });

  describe('getPermission', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Permission.findByPk = (async () => { throw ACTION_ERROR; }) as any;

      // Arrange:
      const permission_id = DATA.permission.id;
      const options = {};

      // Act:
      const res = repository.getPermission(permission_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return null when permission was not found', async () => {
      // Setup:
      database.models.Permission.findByPk = (async () => null) as any;

      // Arrange:
      const permission_id = DATA.permission.id;
      const options = {};

      // Act:
      const res = await repository.getPermission(permission_id, options);

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and strict is set true', () => {
      // Setup:
      database.models.Permission.findByPk = (async () => null) as any;

      // Arrange:
      const permission_id = DATA.permission.id;
      const options = {};

      // Act:
      const res = repository.getPermission(permission_id, options, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return permission when is found', async () => {
      // Setup:
      database.models.Permission.findByPk = (async () => DATA.permission) as any;

      // Arrange:
      const permission_id = DATA.permission.id;
      const options = {};

      // Act:
      const res = await repository.getPermission(permission_id, options);

      // Assert:
      expect(res).toEqual(DATA.permission);
    });
  });

  describe('updatePermission', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Permission.findByPk = (async () => ({
        update: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const permission_id = DATA.permission.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updatePermission(permission_id, values, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return permission updated when is found', async () => {
      // Setup:
      database.models.Permission.findByPk = (async () => ({
        update: async () => ({
          extra: { enabled: true },
          updated_at: new Date()
        })
      })) as any;

      // Arrange:
      const permission_id = DATA.permission.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await repository.updatePermission(permission_id, values, options);

      // Assert:
      expect(res.extra).toEqual(values.extra);
    });
  });

  describe('deletePermission', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Permission.findByPk = (async () => ({
        destroy: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const permission_id = DATA.permission.id;
      const options = {};

      // Act:
      const res = repository.deletePermission(permission_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return permission deleted when is found', async () => {
      // Setup:
      database.models.Permission.findByPk = (async () => ({
        destroy: async () => ({
          updated_at: new Date(),
          deleted_at: new Date()
        })
      })) as any;

      // Arrange:
      const permission_id = DATA.permission.id;
      const options = {};

      // Act:
      const res = await repository.deletePermission(permission_id, options);

      // Assert:
      expect(res.deleted_at).not.toBe(null);
    });
  });
});
