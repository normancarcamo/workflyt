const Repository = require('src/core/permissions/permissions-repository');
const Service = require('src/core/permissions/permissions-service');
const ACTION_ERROR = require('test/config/errors').ERROR_BAD_GATEWAY;
const DATA = require('test/config/models');

describe('Permission Service', () => {
  const database = {};
  const repository = Repository({ database });
  let service = null;

  beforeEach(async () => { service = Service({ repository }); });

  describe('getPermissions', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'getPermissions').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const options = {};

      // Act:
      const res = service.getPermissions(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of permissions', async () => {
      // Setup:
      jest.spyOn(repository, 'getPermissions').mockResolvedValue([ DATA.permission ]);

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
      jest.spyOn(repository, 'createPermission').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const values = DATA.permission;

      // Act:
      const res = service.createPermission(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return permission created', async () => {
      // Setup:
      jest.spyOn(repository, 'createPermission').mockResolvedValue(DATA.permission);

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
      jest.spyOn(repository, 'getPermission').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const permission_id = DATA.permission.id;
      const options = {};

      // Act:
      const res = service.getPermission({ permission_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return permission when is found', async () => {
      // Setup:
      jest.spyOn(repository, 'getPermission').mockResolvedValue(DATA.permission);

      // Arrange:
      const permission_id = DATA.permission.id;
      const options = {};

      // Act:
      const res = await service.getPermission({ permission_id, options });

      // Assert:
      expect(res).toEqual(DATA.permission);
    });
  });

  describe('updatePermission', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'updatePermission').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const permission_id = DATA.permission.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = service.updatePermission({ permission_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return permission updated when is found', async () => {
      // Setup:
      jest.spyOn(repository, 'updatePermission').mockResolvedValue({
        extra: { enabled: true },
        updated_at: new Date('2019-10-10')
      });

      // Arrange:
      const permission_id = DATA.permission.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await service.updatePermission({ permission_id, values, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.extra).toEqual({ enabled: true });
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('deletePermission', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'deletePermission').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const permission_id = DATA.permission.id;
      const options = {};

      // Act:
      const res = service.deletePermission({ permission_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return permission updated when is found', async () => {
      // Setup:
      jest.spyOn(repository, 'deletePermission').mockResolvedValue({
        updated_at: new Date('2019-10-10'),
        deleted_at: new Date('2019-10-10')
      });

      // Arrange:
      const permission_id = DATA.permission.id;
      const options = {};

      // Act:
      const res = await service.deletePermission({ permission_id, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });
});
