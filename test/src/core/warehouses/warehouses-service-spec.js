const Repository = require('src/core/warehouses/warehouses-repository');
const Service = require('src/core/warehouses/warehouses-service');
const ACTION_ERROR = require('test/config/errors').ERROR_BAD_GATEWAY;
const DATA = require('test/config/models');

describe('Warehouse Service', () => {
  const database = {};
  const repository = Repository({ database });
  let service = null;

  beforeEach(async () => { service = Service({ repository }); });

  describe('getWarehouses', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'getWarehouses').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const options = {};

      // Act:
      const res = service.getWarehouses(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of warehouses', async () => {
      // Setup:
      jest.spyOn(repository, 'getWarehouses').mockResolvedValue([ DATA.warehouse ]);

      // Arrange:
      const options = {};

      // Act:
      const res = await service.getWarehouses(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty().toEqual([ DATA.warehouse ]);
    });
  });

  describe('createWarehouse', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'createWarehouse').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const values = DATA.warehouse;

      // Act:
      const res = service.createWarehouse(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return warehouse created', async () => {
      // Setup:
      jest.spyOn(repository, 'createWarehouse').mockResolvedValue(DATA.warehouse);

      // Arrange:
      const values = DATA.warehouse;

      // Act:
      const res = await service.createWarehouse(values);

      // Assert:
      expect(res).toEqual(DATA.warehouse);
    });
  });

  describe('getWarehouse', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'getWarehouse').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const warehouse_id = DATA.warehouse.id;
      const options = {};

      // Act:
      const res = service.getWarehouse({ warehouse_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return warehouse when is found', async () => {
      // Setup:
      jest.spyOn(repository, 'getWarehouse').mockResolvedValue(DATA.warehouse);

      // Arrange:
      const warehouse_id = DATA.warehouse.id;
      const options = {};

      // Act:
      const res = await service.getWarehouse({ warehouse_id, options });

      // Assert:
      expect(res).toEqual(DATA.warehouse);
    });
  });

  describe('updateWarehouse', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'updateWarehouse').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const warehouse_id = DATA.warehouse.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = service.updateWarehouse({ warehouse_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return warehouse updated when is found', async () => {
      // Setup:
      jest.spyOn(repository, 'updateWarehouse').mockResolvedValue({
        extra: { enabled: true },
        updated_at: new Date('2019-10-10')
      });

      // Arrange:
      const warehouse_id = DATA.warehouse.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await service.updateWarehouse({ warehouse_id, values, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.extra).toEqual({ enabled: true });
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('deleteWarehouse', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'deleteWarehouse').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const warehouse_id = DATA.warehouse.id;
      const options = {};

      // Act:
      const res = service.deleteWarehouse({ warehouse_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return warehouse updated when is found', async () => {
      // Setup:
      jest.spyOn(repository, 'deleteWarehouse').mockResolvedValue({
        updated_at: new Date('2019-10-10'),
        deleted_at: new Date('2019-10-10')
      });

      // Arrange:
      const warehouse_id = DATA.warehouse.id;
      const options = {};

      // Act:
      const res = await service.deleteWarehouse({ warehouse_id, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('getMaterials', () => {
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(repository, 'getMaterials').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const warehouse_id = DATA.warehouse.id;
      const options = {};

      // Act:
      const res = service.getMaterials({ warehouse_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      jest.spyOn(repository, 'getMaterials').mockResolvedValue([ DATA.material ]);

      // Arrange:
      const warehouse_id = DATA.warehouse.id;
      const options = {};

      // Act:
      const res = await service.getMaterials({ warehouse_id, options });

      // Assert:
      expect(res).toEqual([ DATA.material ]);
    });
  });

  describe('addMaterials', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'addMaterials').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const options = { warehouse_id: DATA.warehouse.id, materials: [ DATA.material.id ] };

      // Act:
      const res = service.addMaterials(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations after adding them', async () => {
      // Setup:
      jest.spyOn(repository, 'addMaterials').mockResolvedValue([ DATA.warehouseMaterial ]);

      // Arrange:
      const options = { warehouse_id: DATA.warehouse.id, materials: [ DATA.material.id ] };

      // Act:
      const res = await service.addMaterials(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty();
      expect(res).toEqual([ DATA.warehouseMaterial ]);
    });
  });

  describe('getMaterial', () => {
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(repository, 'getMaterial').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const warehouse_id = DATA.warehouse.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = service.getMaterial({ warehouse_id, material_id, options }, true);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.material, WarehouseMaterial: DATA.warehouseMaterial };

      // Mock:
      jest.spyOn(repository, 'getMaterial').mockResolvedValue(expected);

      // Arrange:
      const warehouse_id = DATA.warehouse.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = await service.getMaterial({ warehouse_id, material_id, options }, true);

      // Assert:
      expect(res).toEqual(expected)
    });
  });

  describe('updateMaterial', () => {
    it('should throw error when action fail', () => {
      // Before:
      jest.spyOn(repository, 'updateMaterial').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const warehouse_id = DATA.warehouse.id;
      const material_id = DATA.material.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = service.updateMaterial({ warehouse_id, material_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association updated after update', async () => {
      // Before:
      jest.spyOn(repository, 'updateMaterial').mockResolvedValue({
        ...DATA.warehouseMaterial,
        extra: { enabled: true },
        updated_at: new Date('2019-10-10')
      });

      // Arrange:
      const warehouse_id = DATA.warehouseMaterial.warehouse_id;
      const material_id = DATA.warehouseMaterial.material_id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await service.updateMaterial({ warehouse_id, material_id, values, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.warehouse_id).toEqual(warehouse_id);
      expect(res.material_id).toEqual(material_id);
      expect(res.extra).toEqual({ enabled: true });
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('deleteMaterial', () => {
    it('should throw error when action fail', () => {
      // Before:
      jest.spyOn(repository, 'deleteMaterial').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const warehouse_id = DATA.warehouse.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = service.deleteMaterial({ warehouse_id, material_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association deleted after delete', async () => {
      // Before:
      jest.spyOn(repository, 'deleteMaterial').mockResolvedValue({
        ...DATA.warehouseMaterial,
        updated_at: new Date('2019-10-10'),
        deleted_at: new Date('2019-10-10')
      });

      // Arrange:
      const warehouse_id = DATA.warehouseMaterial.warehouse_id;
      const material_id = DATA.warehouseMaterial.material_id;
      const options = {};

      // Act:
      const res = await service.deleteMaterial({ warehouse_id, material_id, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.warehouse_id).toEqual(warehouse_id);
      expect(res.material_id).toEqual(material_id);
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });
});
