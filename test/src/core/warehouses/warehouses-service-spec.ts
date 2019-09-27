import '../../../config/global';
import { WarehouseRepository } from '../../../../src/core/warehouses/warehouses-repository';
import { WarehouseService } from '../../../../src/core/warehouses/warehouses-service';
import { I } from '../../../../src/core/warehouses/warehouses-types';
import { ERROR_BAD_GATEWAY as ACTION_ERROR } from '../../../config/errors';
import * as DATA from '../../../config/models';

describe('Warehouse Service', () => {
  let database = {};
  let repository = WarehouseRepository(database);
  let service:I.service = WarehouseService(repository);

  beforeEach(async () => { service = WarehouseService(repository); });

  describe('getWarehouses', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.getWarehouses = async () => { throw ACTION_ERROR; };

      // Arrange:
      const options = {};

      // Act:
      const res = service.getWarehouses(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of warehouses', async () => {
      // Setup:
      repository.getWarehouses = async () => [ DATA.warehouse ];

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
      repository.createWarehouse = async () => { throw ACTION_ERROR; };

      // Arrange:
      const values = DATA.warehouse;

      // Act:
      const res = service.createWarehouse(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return warehouse created', async () => {
      // Setup:
      repository.createWarehouse = async () => DATA.warehouse;

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
      repository.getWarehouse = async () => { throw ACTION_ERROR; };

      // Arrange:
      const warehouse_id = DATA.warehouse.id;
      const options = {};

      // Act:
      const res = service.getWarehouse(warehouse_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return warehouse when is found', async () => {
      // Setup:
      repository.getWarehouse = async () => DATA.warehouse;
      jest.spyOn(repository, 'getWarehouse').mockResolvedValue(DATA.warehouse);

      // Arrange:
      const warehouse_id = DATA.warehouse.id;
      const options = {};

      // Act:
      const res = await service.getWarehouse(warehouse_id, options);

      // Assert:
      expect(res).toEqual(DATA.warehouse);
    });
  });

  describe('updateWarehouse', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.updateWarehouse = async () => { throw ACTION_ERROR; };

      // Arrange:
      const warehouse_id = DATA.warehouse.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = service.updateWarehouse(warehouse_id, values, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return warehouse updated when is found', async () => {
      // Arrange:
      repository.updateWarehouse = async () => ({
        extra: { enabled: true },
        updated_at: new Date('2019-10-10')
      });
      const warehouse_id = DATA.warehouse.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await service.updateWarehouse(warehouse_id, values, options);

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.extra).toEqual({ enabled: true });
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('deleteWarehouse', () => {
    it('should throw error when action fail', () => {
      // Arrange:
      repository.deleteWarehouse = async () => { throw ACTION_ERROR; };
      const warehouse_id = DATA.warehouse.id;
      const options = {};

      // Act:
      const res = service.deleteWarehouse(warehouse_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return warehouse updated when is found', async () => {
      // Arrange:
      repository.deleteWarehouse = async () => ({
        updated_at: new Date('2019-10-10'),
        deleted_at: new Date('2019-10-10')
      });
      const warehouse_id = DATA.warehouse.id;
      const options = {};

      // Act:
      const res = await service.deleteWarehouse(warehouse_id, options);

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('getMaterials', () => {
    it('should throw error when action fail', () => {
      // Mock:
      repository.getMaterials = async () => { throw ACTION_ERROR; };

      // Arrange:
      const warehouse_id = DATA.warehouse.id;
      const options = {};

      // Act:
      const res = service.getMaterials(warehouse_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      repository.getMaterials = async () => [ DATA.material ];

      // Arrange:
      const warehouse_id = DATA.warehouse.id;
      const options = {};

      // Act:
      const res = await service.getMaterials(warehouse_id, options);

      // Assert:
      expect(res).toEqual([ DATA.material ]);
    });
  });

  describe('addMaterials', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.addMaterials = async () => { throw ACTION_ERROR; };

      // Arrange:
      const warehouse_id:string = DATA.warehouse.id;
      const materials:string[] = [ DATA.material.id ];

      // Act:
      const res = service.addMaterials(warehouse_id, materials);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations after adding them', async () => {
      // Setup:
      repository.addMaterials = async () => [ DATA.warehouseMaterial ];

      // Arrange:
      const warehouse_id:string = DATA.warehouse.id;
      const materials:string[] = [ DATA.material.id ];

      // Act:
      const res = await service.addMaterials(warehouse_id, materials);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty();
      expect(res).toEqual([ DATA.warehouseMaterial ]);
    });
  });

  describe('getMaterial', () => {
    it('should throw error when action fail', () => {
      // Mock:
      repository.getMaterial = async () => { throw ACTION_ERROR; };

      // Arrange:
      const warehouse_id = DATA.warehouse.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = service.getMaterial(warehouse_id, material_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      // Arrange:
      const expected = { ...DATA.material, WarehouseMaterial: DATA.warehouseMaterial };
      repository.getMaterial = async () => expected;
      const warehouse_id = DATA.warehouse.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = await service.getMaterial(warehouse_id, material_id, options);

      // Assert:
      expect(res).toEqual(expected)
    });
  });

  describe('updateMaterial', () => {
    it('should throw error when action fail', () => {
      // Before:
      repository.updateMaterial = async () => { throw ACTION_ERROR; };

      // Arrange:
      const warehouse_id = DATA.warehouse.id;
      const material_id = DATA.material.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = service.updateMaterial(warehouse_id, material_id, values, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association updated after update', async () => {
      // Arrange:
      repository.updateMaterial = async () => ({
        ...DATA.warehouseMaterial,
        extra: { enabled: true },
        updated_at: new Date('2019-10-10')
      });
      const warehouse_id = DATA.warehouseMaterial.warehouse_id;
      const material_id = DATA.warehouseMaterial.material_id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await service.updateMaterial(warehouse_id, material_id, values, options);

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
      repository.deleteMaterial = async () => { throw ACTION_ERROR; };

      // Arrange:
      const warehouse_id = DATA.warehouse.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = service.deleteMaterial(warehouse_id, material_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association deleted after delete', async () => {
      // Arrange:
      repository.deleteMaterial = async () => ({
        ...DATA.warehouseMaterial,
        updated_at: new Date('2019-10-10'),
        deleted_at: new Date('2019-10-10')
      });
      const warehouse_id = DATA.warehouseMaterial.warehouse_id;
      const material_id = DATA.warehouseMaterial.material_id;
      const options = {};

      // Act:
      const res = await service.deleteMaterial(warehouse_id, material_id, options);

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.warehouse_id).toEqual(warehouse_id);
      expect(res.material_id).toEqual(material_id);
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });
});
