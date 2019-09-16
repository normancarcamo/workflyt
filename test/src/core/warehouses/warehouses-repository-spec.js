const Repository = require('src/core/warehouses/warehouses-repository');
const ACTION_ERROR = require('test/config/errors').ERROR_BAD_GATEWAY;
const DATA = require('test/config/models');
const DATABASE = require('test/config/database');

describe('Warehouse Repository', () => {
  const database = { ...DATABASE };
  const repository = Repository({ database });

  beforeEach(async () => { database.models = DATABASE.models; });

  describe('getWarehouses', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Warehouse, 'findAll').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const options = {};

      // Act:
      const res = repository.getWarehouses(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of warehouses', async () => {
      // Setup:
      jest.spyOn(database.models.Warehouse, 'findAll')
        .mockResolvedValue([ DATA.warehouse ]);

      // Arrange:
      const options = {};

      // Act:
      const res = await repository.getWarehouses(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty().toEqual([ DATA.warehouse ]);
    });
    it('should return an empty list when records are not found', async () => {
      // Setup:
      jest.spyOn(database.models.Warehouse, 'findAll').mockResolvedValue([]);

      // Arrange:
      const options = {};

      // Act:
      const res = await repository.getWarehouses(options);

      // Assert:
      expect(res).toBeArray().toBeEmpty();
    });
  });

  describe('createWarehouse', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Warehouse, 'create').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const values = DATA.warehouse;

      // Act:
      const res = repository.createWarehouse(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return warehouse created', async () => {
      // Setup:
      jest.spyOn(database.models.Warehouse, 'create')
        .mockResolvedValue(DATA.warehouse);

      // Arrange:
      const values = DATA.warehouse;

      // Act:
      const res = await repository.createWarehouse(values);

      // Assert:
      expect(res).toEqual(DATA.warehouse);
    });
  });

  describe('getWarehouse', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Warehouse, 'findByPk').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const warehouse_id = DATA.warehouse.id;
      const options = {};

      // Act:
      const res = repository.getWarehouse({ warehouse_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return null when warehouse was not found', async () => {
      // Setup:
      jest.spyOn(database.models.Warehouse, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const warehouse_id = DATA.warehouse.id;
      const options = {};

      // Act:
      const res = await repository.getWarehouse({ warehouse_id, options });

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and strict is set true', () => {
      // Setup:
      jest.spyOn(database.models.Warehouse, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const warehouse_id = DATA.warehouse.id;
      const options = {};

      // Act:
      const res = repository.getWarehouse({ warehouse_id, options }, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return warehouse when is found', async () => {
      // Setup:
      jest.spyOn(database.models.Warehouse, 'findByPk')
        .mockResolvedValue(DATA.warehouse);

      // Arrange:
      const warehouse_id = DATA.warehouse.id;
      const options = {};

      // Act:
      const res = await repository.getWarehouse({ warehouse_id, options });

      // Assert:
      expect(res).toEqual(DATA.warehouse);
    });
  });

  describe('updateWarehouse', () => {
    it('should throw error when warehouse was not found', () => {
      // Setup:
      jest.spyOn(database.models.Warehouse, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const warehouse_id = DATA.warehouse.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateWarehouse({ warehouse_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Warehouse, 'findByPk').mockResolvedValue({
        update: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const warehouse_id = DATA.warehouse.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateWarehouse({ warehouse_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return warehouse updated when is found', async () => {
      // Setup:
      jest.spyOn(database.models.Warehouse, 'findByPk').mockResolvedValue({
        update: jest.fn().mockResolvedValue({
          extra: { enabled: true },
          updated_at: new Date()
        })
      });

      // Arrange:
      const warehouse_id = DATA.warehouse.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await repository.updateWarehouse({ warehouse_id, values, options });

      // Assert:
      expect(res.extra).toEqual(values.extra);
    });
  });

  describe('deleteWarehouse', () => {
    it('should throw error when warehouse was not found', () => {
      // Setup:
      jest.spyOn(database.models.Warehouse, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const warehouse_id = DATA.warehouse.id;
      const options = {};

      // Act:
      const res = repository.deleteWarehouse({ warehouse_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Warehouse, 'findByPk').mockResolvedValue({
        destroy: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const warehouse_id = DATA.warehouse.id;
      const options = {};

      // Act:
      const res = repository.deleteWarehouse({ warehouse_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return warehouse deleted when is found', async () => {
      // Setup:
      jest.spyOn(database.models.Warehouse, 'findByPk').mockResolvedValue({
        destroy: jest.fn().mockResolvedValue({
          updated_at: new Date(),
          deleted_at: new Date()
        })
      });

      // Arrange:
      const warehouse_id = DATA.warehouse.id;
      const options = {};

      // Act:
      const res = await repository.deleteWarehouse({ warehouse_id, options });

      // Assert:
      expect(res.deleted_at).not.toBe(null);
    });
  });

  describe('getMaterials', () => {
    it('should throw error when warehouse was not found', () => {
      // Setup:
      jest.spyOn(database.models.Warehouse, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const warehouse_id = DATA.warehouse.id;
      const options = {};

      // Act:
      const res = repository.getMaterials({ warehouse_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(database.models.Warehouse, 'findByPk').mockResolvedValue({
        getMaterials: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const warehouse_id = DATA.warehouse.id;
      const options = {};

      // Act:
      const res = repository.getMaterials({ warehouse_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      jest.spyOn(database.models.Warehouse, 'findByPk').mockResolvedValue({
        getMaterials: jest.fn().mockResolvedValue([ DATA.material ])
      });

      // Arrange:
      const warehouse_id = DATA.warehouse.id;
      const options = {};

      // Act:
      const res = await repository.getMaterials({ warehouse_id, options });

      // Assert:
      expect(res).toEqual([ DATA.material ]);
    });
    it('should return a list empty when records are not found', async () => {
      // Mock:
      jest.spyOn(database.models.Warehouse, 'findByPk').mockResolvedValue({
        getMaterials: jest.fn().mockResolvedValue([])
      });

      // Arrange:
      const warehouse_id = DATA.warehouse.id;
      const options = {};

      // Act:
      const res = await repository.getMaterials({ warehouse_id, options });

      // Assert:
      expect(res).toBeArray().toBeEmpty();
    });
  });

  describe('addMaterials', () => {
    it('should throw error when warehouse was not found', () => {
      // Setup:
      jest.spyOn(database.models.Warehouse, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const warehouse_id = DATA.warehouse.id;
      const materials = [ DATA.material.id ];

      // Act:
      const res = repository.addMaterials({ warehouse_id, materials });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Warehouse, 'findByPk').mockResolvedValue({
        addMaterials: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const options = {
        warehouse_id: DATA.warehouse.id,
        materials: [ DATA.material.id ]
      };

      // Act:
      const res = repository.addMaterials(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations after adding them', async () => {
      // Setup:
      jest.spyOn(database.models.Warehouse, 'findByPk').mockResolvedValue({
        addMaterials: jest.fn().mockResolvedValue([
          DATA.warehouseMaterial
        ])
      });

      // Arrange:
      const options = {
        warehouse_id: DATA.warehouse.id,
        materials: [ DATA.material.id ]
      };

      // Act:
      const res = await repository.addMaterials(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty();
      expect(res).toEqual([ DATA.warehouseMaterial ]);
    });
  });

  describe('getMaterial', () => {
    it('should throw error when warehouse was not found', () => {
      // Setup:
      jest.spyOn(database.models.Warehouse, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const warehouse_id = DATA.warehouse.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = repository.getMaterial({ warehouse_id, material_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return null when material was not found', async () => {
      // Mock:
      jest.spyOn(database.models.Warehouse, 'findByPk').mockResolvedValue({
        getMaterials: jest.fn().mockResolvedValue(null)
      });

      // Arrange:
      const warehouse_id = DATA.warehouse.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = await repository.getMaterial({ warehouse_id, material_id, options });

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and assert is true', () => {
      // Mock:
      jest.spyOn(database.models.Warehouse, 'findByPk').mockResolvedValue({
        getMaterials: jest.fn().mockResolvedValue(null)
      });

      // Arrange:
      const warehouse_id = DATA.warehouse.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = repository.getMaterial({ warehouse_id, material_id, options }, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(database.models.Warehouse, 'findByPk').mockResolvedValue({
        getMaterials: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const warehouse_id = DATA.warehouse.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = repository.getMaterial({ warehouse_id, material_id, options }, true);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.material, WarehouseMaterial: DATA.warehouseMaterial };

      // Mock:
      jest.spyOn(database.models.Warehouse, 'findByPk').mockResolvedValue({
        getMaterials: jest.fn().mockResolvedValue(expected)
      });

      // Arrange:
      const warehouse_id = DATA.warehouse.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = await repository.getMaterial({ warehouse_id, material_id, options }, true);

      // Assert:
      expect(res).toEqual(expected)
    });
  });

  describe('updateMaterial', () => {
    it('should throw error when warehouse was not found', () => {
      // Before:
      jest.spyOn(database.models.Warehouse, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const warehouse_id = DATA.warehouse.id;
      const material_id = DATA.material.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateMaterial({ warehouse_id, material_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return null when material was not found', () => {
      // Before:
      jest.spyOn(database.models.Warehouse, 'findByPk').mockResolvedValue({
        getMaterials: jest.fn().mockResolvedValue(null)
      });

      // Arrange:
      const warehouse_id = DATA.warehouse.id;
      const material_id = DATA.material.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateMaterial({ warehouse_id, material_id, values, options });

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Before:
      jest.spyOn(database.models.Warehouse, 'findByPk').mockResolvedValue({
        getMaterials: jest.fn().mockResolvedValue({
          WarehouseMaterial: {
            update: jest.fn().mockRejectedValue(ACTION_ERROR)
          }
        })
      });

      // Arrange:
      const warehouse_id = DATA.warehouse.id;
      const material_id = DATA.material.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateMaterial({ warehouse_id, material_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association updated after update', async () => {
      // Before:
      jest.spyOn(database.models.Warehouse, 'findByPk').mockResolvedValue({
        getMaterials: jest.fn().mockResolvedValue({
          WarehouseMaterial: {
            update: jest.fn().mockResolvedValue({
              ...DATA.warehouseMaterial,
              extra: { enabled: true },
              updated_at: new Date('2019-10-10')
            })
          }
        })
      });

      // Arrange:
      const warehouse_id = DATA.warehouseMaterial.warehouse_id;
      const material_id = DATA.warehouseMaterial.material_id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await repository.updateMaterial({ warehouse_id, material_id, values, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.warehouse_id).toEqual(warehouse_id);
      expect(res.material_id).toEqual(material_id);
      expect(res.extra).toEqual({ enabled: true });
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('deleteMaterial', () => {
    it('should throw error when warehouse was not found', () => {
      // Before:
      jest.spyOn(database.models.Warehouse, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const warehouse_id = DATA.warehouse.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = repository.deleteMaterial({ warehouse_id, material_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return null when material was not found', () => {
      // Before:
      jest.spyOn(database.models.Warehouse, 'findByPk').mockResolvedValue({
        getMaterials: jest.fn().mockResolvedValue(null)
      });

      // Arrange:
      const warehouse_id = DATA.warehouse.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = repository.deleteMaterial({ warehouse_id, material_id, options });

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Before:
      jest.spyOn(database.models.Warehouse, 'findByPk').mockResolvedValue({
        getMaterials: jest.fn().mockResolvedValue({
          WarehouseMaterial: {
            destroy: jest.fn().mockRejectedValue(ACTION_ERROR)
          }
        })
      });

      // Arrange:
      const warehouse_id = DATA.warehouse.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = repository.deleteMaterial({ warehouse_id, material_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association deleted after delete', async () => {
      // Before:
      jest.spyOn(database.models.Warehouse, 'findByPk').mockResolvedValue({
        getMaterials: jest.fn().mockResolvedValue({
          WarehouseMaterial: {
            destroy: jest.fn().mockResolvedValue({
              ...DATA.warehouseMaterial,
              updated_at: new Date('2019-10-10'),
              deleted_at: new Date('2019-10-10')
            })
          }
        })
      });

      // Arrange:
      const warehouse_id = DATA.warehouseMaterial.warehouse_id;
      const material_id = DATA.warehouseMaterial.material_id;
      const options = {};

      // Act:
      const res = await repository.deleteMaterial({ warehouse_id, material_id, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.warehouse_id).toEqual(warehouse_id);
      expect(res.material_id).toEqual(material_id);
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });
});
