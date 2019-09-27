import '../../../config/global';
import * as DATA from '../../../config/models';
import DATABASE from '../../../config/database';
import { ERROR_BAD_GATEWAY as ACTION_ERROR } from '../../../config/errors';
import { MaterialRepository } from '../../../../src/core/materials/materials-repository';

describe('Material Repository', () => {
  const database = { ...DATABASE() };
  const repository = MaterialRepository(database);

  beforeEach(async () => { database.models = DATABASE().models; });

  describe('getMaterials', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Material.findAll = (async () => { throw ACTION_ERROR; }) as any;

      // Arrange:
      const options = {};

      // Act:
      const res = repository.getMaterials(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of materials', async () => {
      // Setup:
      database.models.Material.findAll = (async () => [ DATA.material ]) as any;

      // Arrange:
      const options = {};

      // Act:
      const res = await repository.getMaterials(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty().toEqual([ DATA.material ]);
    });
    it('should return an empty list when records are not found', async () => {
      // Setup:
      database.models.Material.findAll = (async () => []) as any;

      // Arrange:
      const options = {};

      // Act:
      const res = await repository.getMaterials(options);

      // Assert:
      expect(res).toBeArray().toBeEmpty();
    });
  });

  describe('createMaterial', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Material.create = (async () => { throw ACTION_ERROR; }) as any;

      // Arrange:
      const values = DATA.material;

      // Act:
      const res = repository.createMaterial(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return material created', async () => {
      // Setup:
      database.models.Material.create = (async () => DATA.material) as any;

      // Arrange:
      const values = DATA.material;

      // Act:
      const res = await repository.createMaterial(values);

      // Assert:
      expect(res).toEqual(DATA.material);
    });
  });

  describe('getMaterial', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Material.findByPk = (async () => { throw ACTION_ERROR; }) as any;

      // Arrange:
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = repository.getMaterial(material_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return null when material was not found', async () => {
      // Setup:
      database.models.Material.findByPk = (async () => null) as any;

      // Arrange:
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = await repository.getMaterial(material_id, options);

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and strict is set true', () => {
      // Setup:
      database.models.Material.findByPk = (async () => null) as any;

      // Arrange:
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = repository.getMaterial(material_id, options, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return material when is found', async () => {
      // Setup:
      database.models.Material.findByPk = (async () => DATA.material) as any;

      // Arrange:
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = await repository.getMaterial(material_id, options);

      // Assert:
      expect(res).toEqual(DATA.material);
    });
  });

  describe('updateMaterial', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Material.findByPk = (async () => ({
        update: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const material_id = DATA.material.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateMaterial(material_id, values, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return material updated when is found', async () => {
      // Setup:
      database.models.Material.findByPk = (async () => ({
        update: async () => ({
          extra: { enabled: true },
          updated_at: new Date()
        })
      })) as any;

      // Arrange:
      const material_id = DATA.material.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await repository.updateMaterial(material_id, values, options);

      // Assert:
      expect(res.extra).toEqual(values.extra);
    });
  });

  describe('deleteMaterial', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Material.findByPk = (async () => ({
        destroy: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = repository.deleteMaterial(material_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return material deleted when is found', async () => {
      // Setup:
      database.models.Material.findByPk = (async () => ({
        destroy: async () => ({
          updated_at: new Date(),
          deleted_at: new Date()
        })
      })) as any;

      // Arrange:
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = await repository.deleteMaterial(material_id, options);

      // Assert:
      expect(res.deleted_at).not.toBe(null);
    });
  });

  describe('getStocks', () => {
    it('should throw error when action fail', () => {
      // Mock:
      database.models.Material.findByPk = (async () => ({
        getStocks: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = repository.getStocks(material_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      database.models.Material.findByPk = (async () => ({
        getStocks: async () => [ DATA.stock ]
      })) as any;

      // Arrange:
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = await repository.getStocks(material_id, options);

      // Assert:
      expect(res).toEqual([ DATA.stock ]);
    });
    it('should return a list empty when records are not found', async () => {
      // Mock:
      database.models.Material.findByPk = (async () => ({
        getStocks: async () => []
      })) as any;

      // Arrange:
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = await repository.getStocks(material_id, options);

      // Assert:
      expect(res).toBeArray().toBeEmpty();
    });
  });

  describe('getStock', () => {
    it('should return null when stock was not found', async () => {
      // Mock:
      database.models.Material.findByPk = (async () => ({
        getStocks: async () => null
      })) as any;

      // Arrange:
      const material_id = DATA.material.id;
      const stock_id = DATA.stock.id;
      const options = {};

      // Act:
      const res = await repository.getStock(material_id, stock_id, options);

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and assert is true', () => {
      // Mock:
      database.models.Material.findByPk = (async () => ({
        getStocks: async () => null
      })) as any;

      // Arrange:
      const material_id = DATA.material.id;
      const stock_id = DATA.stock.id;
      const options = {};

      // Act:
      const res = repository.getStock(material_id, stock_id, options, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Mock:
      database.models.Material.findByPk = (async () => ({
        getStocks: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const material_id = DATA.material.id;
      const stock_id = DATA.stock.id;
      const options = {};

      // Act:
      const res = repository.getStock(material_id, stock_id, options, true);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.stock };

      // Mock:
      database.models.Material.findByPk = (async () => ({
        getStocks: async () => expected
      })) as any;

      // Arrange:
      const material_id = DATA.material.id;
      const stock_id = DATA.stock.id;
      const options = {};

      // Act:
      const res = await repository.getStock(material_id, stock_id, options, true);

      // Assert:
      expect(res).toEqual(expected);
    });
  });
});
