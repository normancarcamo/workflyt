const Repository = require('src/core/permissions/permissions-repository');
const ACTION_ERROR = require('test/config/errors').ERROR_BAD_GATEWAY;
const DATA = require('test/config/models');
const DATABASE = require('test/config/database');

describe('Permission Repository', () => {
  const database = { ...DATABASE };
  const repository = Repository({ database });

  beforeEach(async () => { database.models = DATABASE.models; });

  describe('getPermissions', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Permission, 'findAll').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const options = {};

      // Act:
      const res = repository.getPermissions(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of permissions', async () => {
      // Setup:
      jest.spyOn(database.models.Permission, 'findAll')
        .mockResolvedValue([ DATA.permission ]);

      // Arrange:
      const options = {};

      // Act:
      const res = await repository.getPermissions(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty().toEqual([ DATA.permission ]);
    });
    it('should return an empty list when records are not found', async () => {
      // Setup:
      jest.spyOn(database.models.Permission, 'findAll').mockResolvedValue([]);

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
      jest.spyOn(database.models.Permission, 'create').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const values = DATA.permission;

      // Act:
      const res = repository.createPermission(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return permission created', async () => {
      // Setup:
      jest.spyOn(database.models.Permission, 'create')
        .mockResolvedValue(DATA.permission);

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
      jest.spyOn(database.models.Permission, 'findByPk').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const permission_id = DATA.permission.id;
      const options = {};

      // Act:
      const res = repository.getPermission({ permission_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return null when permission was not found', async () => {
      // Setup:
      jest.spyOn(database.models.Permission, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const permission_id = DATA.permission.id;
      const options = {};

      // Act:
      const res = await repository.getPermission({ permission_id, options });

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and strict is set true', () => {
      // Setup:
      jest.spyOn(database.models.Permission, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const permission_id = DATA.permission.id;
      const options = {};

      // Act:
      const res = repository.getPermission({ permission_id, options }, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return permission when is found', async () => {
      // Setup:
      jest.spyOn(database.models.Permission, 'findByPk')
        .mockResolvedValue(DATA.permission);

      // Arrange:
      const permission_id = DATA.permission.id;
      const options = {};

      // Act:
      const res = await repository.getPermission({ permission_id, options });

      // Assert:
      expect(res).toEqual(DATA.permission);
    });
  });

  describe('updatePermission', () => {
    it('should throw error when permission was not found', () => {
      // Setup:
      jest.spyOn(database.models.Permission, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const permission_id = DATA.permission.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updatePermission({ permission_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Permission, 'findByPk').mockResolvedValue({
        update: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const permission_id = DATA.permission.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updatePermission({ permission_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return permission updated when is found', async () => {
      // Setup:
      jest.spyOn(database.models.Permission, 'findByPk').mockResolvedValue({
        update: jest.fn().mockResolvedValue({
          extra: { enabled: true },
          updated_at: new Date()
        })
      });

      // Arrange:
      const permission_id = DATA.permission.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await repository.updatePermission({ permission_id, values, options });

      // Assert:
      expect(res.extra).toEqual(values.extra);
    });
  });

  describe('deletePermission', () => {
    it('should throw error when permission was not found', () => {
      // Setup:
      jest.spyOn(database.models.Permission, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const permission_id = DATA.permission.id;
      const options = {};

      // Act:
      const res = repository.deletePermission({ permission_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Permission, 'findByPk').mockResolvedValue({
        destroy: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const permission_id = DATA.permission.id;
      const options = {};

      // Act:
      const res = repository.deletePermission({ permission_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return permission deleted when is found', async () => {
      // Setup:
      jest.spyOn(database.models.Permission, 'findByPk').mockResolvedValue({
        destroy: jest.fn().mockResolvedValue({
          updated_at: new Date(),
          deleted_at: new Date()
        })
      });

      // Arrange:
      const permission_id = DATA.permission.id;
      const options = {};

      // Act:
      const res = await repository.deletePermission({ permission_id, options });

      // Assert:
      expect(res.deleted_at).not.toBe(null);
    });
  });
});
