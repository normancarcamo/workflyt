import '../../../config/global';
import * as DATA from '../../../config/models';
import DATABASE from '../../../config/database';
import { ERROR_BAD_GATEWAY as ACTION_ERROR } from '../../../config/errors';
import { WarehouseRepository } from '../../../../src/core/warehouses/warehouses-repository';

describe('Warehouse Repository', () => {
  const database = { ...DATABASE() };
  const repository = WarehouseRepository(database);

  beforeEach(async () => { database.models = DATABASE().models; });

  describe('getWarehouses', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Warehouse.findAll = (async () => { throw ACTION_ERROR; }) as any;

      // Arrange:
      const options = {};

      // Act:
      const res = repository.getWarehouses(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of warehouses', async () => {
      // Setup:
      database.models.Warehouse.findAll = (async () => [ DATA.warehouse ]) as any;

      // Arrange:
      const options = {};

      // Act:
      const res = await repository.getWarehouses(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty().toEqual([ DATA.warehouse ]);
    });
    it('should return an empty list when records are not found', async () => {
      // Setup:
      database.models.Warehouse.findAll = (async () => []) as any;

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
      database.models.Warehouse.create = (async () => { throw ACTION_ERROR; }) as any;

      // Arrange:
      const values = DATA.warehouse;

      // Act:
      const res = repository.createWarehouse(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return warehouse created', async () => {
      // Setup:
      database.models.Warehouse.create = (async () => DATA.warehouse) as any;

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
      database.models.Warehouse.findByPk = (async () => { throw ACTION_ERROR; }) as any;

      // Arrange:
      const warehouse_id = DATA.warehouse.id;
      const options = {};

      // Act:
      const res = repository.getWarehouse(warehouse_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return null when warehouse was not found', async () => {
      // Setup:
      database.models.Warehouse.findByPk = (async () => null) as any;

      // Arrange:
      const warehouse_id = DATA.warehouse.id;
      const options = {};

      // Act:
      const res = await repository.getWarehouse(warehouse_id, options);

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and strict is set true', () => {
      // Setup:
      database.models.Warehouse.findByPk = (async () => null) as any;

      // Arrange:
      const warehouse_id = DATA.warehouse.id;
      const options = {};

      // Act:
      const res = repository.getWarehouse(warehouse_id, options, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return warehouse when is found', async () => {
      // Setup:
      database.models.Warehouse.findByPk = (async () => DATA.warehouse) as any;

      // Arrange:
      const warehouse_id = DATA.warehouse.id;
      const options = {};

      // Act:
      const res = await repository.getWarehouse(warehouse_id, options);

      // Assert:
      expect(res).toEqual(DATA.warehouse);
    });
  });

  describe('updateWarehouse', () => {
    it('should throw error when action fail', () => {
      // Arrange:
      database.models.Warehouse.findByPk = (async () => ({
        update: async () => { throw ACTION_ERROR; }
      })) as any;
      const warehouse_id = DATA.warehouse.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateWarehouse(warehouse_id, values, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return warehouse updated when is found', async () => {
      // Arrange:
      database.models.Warehouse.findByPk = (async () => ({
        update: async () => ({
          extra: { enabled: true },
          updated_at: new Date()
        })
      })) as any;
      const warehouse_id = DATA.warehouse.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await repository.updateWarehouse(warehouse_id, values, options);

      // Assert:
      expect(res.extra).toEqual(values.extra);
    });
  });

  describe('deleteWarehouse', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Warehouse.findByPk = (async () => ({
        destroy: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const warehouse_id = DATA.warehouse.id;
      const options = {};

      // Act:
      const res = repository.deleteWarehouse(warehouse_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return warehouse deleted when is found', async () => {
      // Setup:
      database.models.Warehouse.findByPk = (async () => ({
        destroy: async () => ({
          updated_at: new Date(),
          deleted_at: new Date()
        })
      })) as any;

      // Arrange:
      const warehouse_id = DATA.warehouse.id;
      const options = {};

      // Act:
      const res = await repository.deleteWarehouse(warehouse_id, options);

      // Assert:
      expect(res.deleted_at).not.toBe(null);
    });
  });

  describe('getMaterials', () => {
    it('should throw error when action fail', () => {
      // Mock:
      database.models.Warehouse.findByPk = (async () => ({
        getMaterials: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const warehouse_id = DATA.warehouse.id;
      const options = {};

      // Act:
      const res = repository.getMaterials(warehouse_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Arrange:
      database.models.Warehouse.findByPk = (async () => ({
        getMaterials: async () => [ DATA.material ]
      })) as any;
      const warehouse_id = DATA.warehouse.id;
      const options = {};

      // Act:
      const res = await repository.getMaterials(warehouse_id, options);

      // Assert:
      expect(res).toEqual([ DATA.material ]);
    });
    it('should return a list empty when records are not found', async () => {
      // Arrange:
      database.models.Warehouse.findByPk = (async () => ({
        getMaterials: async () => []
      })) as any;
      const warehouse_id = DATA.warehouse.id;
      const options = {};

      // Act:
      const res = await repository.getMaterials(warehouse_id, options);

      // Assert:
      expect(res).toBeArray().toBeEmpty();
    });
  });

  describe('addMaterials', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Warehouse.findByPk = (async () => ({
        addMaterials: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const warehouse_id:string =  DATA.warehouse.id;
      const materials:string[] =  [ DATA.material.id ];

      // Act:
      const res = repository.addMaterials(warehouse_id, materials);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations after adding them', async () => {
      // Setup:
      database.models.Warehouse.findByPk = (async () => ({
        addMaterials: async () => [ DATA.warehouseMaterial ]
      })) as any;

      // Arrange:
      const warehouse_id:string = DATA.warehouse.id;
      const materials:string[] = [ DATA.material.id ];

      // Act:
      const res = await repository.addMaterials(warehouse_id, materials);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty();
      expect(res).toEqual([ DATA.warehouseMaterial ]);
    });
  });

  describe('getMaterial', () => {
    it('should return null when material was not found', async () => {
      // Mock:
      database.models.Warehouse.findByPk = (async () => ({
        getMaterials: async () => null
      })) as any;

      // Arrange:
      const warehouse_id = DATA.warehouse.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = await repository.getMaterial(warehouse_id, material_id, options);

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and assert is true', () => {
      // Mock:
      database.models.Warehouse.findByPk = (async () => ({
        getMaterials: async () => null
      })) as any;

      // Arrange:
      const warehouse_id = DATA.warehouse.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = repository.getMaterial(warehouse_id, material_id, options, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Arrange:
      database.models.Warehouse.findByPk = (async () => ({
        getMaterials: async () => { throw ACTION_ERROR; }
      })) as any;
      const warehouse_id = DATA.warehouse.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = repository.getMaterial(warehouse_id, material_id, options, true);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.material, WarehouseMaterial: DATA.warehouseMaterial };
      // Arrange:
      database.models.Warehouse.findByPk = (async () => ({
        getMaterials: async () => expected
      })) as any;
      const warehouse_id = DATA.warehouse.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = await repository.getMaterial(warehouse_id, material_id, options, true);

      // Assert:
      expect(res).toEqual(expected);
    });
  });

  describe('updateMaterial', () => {
    it('should throw error when action fail', () => {
      // Arrange:
      database.models.Warehouse.findByPk = (async () => ({
        getMaterials: async () => ({
          WarehouseMaterial: {
            update: async () => { throw ACTION_ERROR; }
          }
        })
      })) as any;
      const warehouse_id = DATA.warehouse.id;
      const material_id = DATA.material.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateMaterial(warehouse_id, material_id, values, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association updated after update', async () => {
      // Arrange:
      database.models.Warehouse.findByPk = (async () => ({
        getMaterials: async () => ({
          WarehouseMaterial: {
            update: async () => ({
              ...DATA.warehouseMaterial,
              extra: { enabled: true },
              updated_at: new Date('2019-10-10')
            })
          }
        })
      })) as any;
      const warehouse_id = DATA.warehouseMaterial.warehouse_id;
      const material_id = DATA.warehouseMaterial.material_id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await repository.updateMaterial(warehouse_id, material_id, values, options);

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
      // Arrange:
      database.models.Warehouse.findByPk = (async () => ({
        getMaterials: async () => ({
          WarehouseMaterial: {
            destroy: async () => { throw ACTION_ERROR; }
          }
        })
      })) as any;
      const warehouse_id = DATA.warehouse.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = repository.deleteMaterial(warehouse_id, material_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association deleted after delete', async () => {
      // Arrange:
      database.models.Warehouse.findByPk = (async () => ({
        getMaterials: async () => ({
          WarehouseMaterial: {
            destroy: async () => ({
              ...DATA.warehouseMaterial,
              updated_at: new Date('2019-10-10'),
              deleted_at: new Date('2019-10-10')
            })
          }
        })
      })) as any;
      const warehouse_id = DATA.warehouseMaterial.warehouse_id;
      const material_id = DATA.warehouseMaterial.material_id;
      const options = {};

      // Act:
      const res = await repository.deleteMaterial(warehouse_id, material_id, options);

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.warehouse_id).toEqual(warehouse_id);
      expect(res.material_id).toEqual(material_id);
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });
});
