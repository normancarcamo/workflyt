const Repository = require('src/core/materials/materials-repository');
const ACTION_ERROR = require('test/config/errors').ERROR_BAD_GATEWAY;
const DATA = require('test/config/models');
const DATABASE = require('test/config/database');

describe('Material Repository', () => {
  const database = { ...DATABASE };
  const repository = Repository({ database });

  beforeEach(async () => { database.models = DATABASE.models; });

  describe('getMaterials', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Material, 'findAll').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const options = {};

      // Act:
      const res = repository.getMaterials(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of materials', async () => {
      // Setup:
      jest.spyOn(database.models.Material, 'findAll')
        .mockResolvedValue([ DATA.material ]);

      // Arrange:
      const options = {};

      // Act:
      const res = await repository.getMaterials(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty().toEqual([ DATA.material ]);
    });
    it('should return an empty list when records are not found', async () => {
      // Setup:
      jest.spyOn(database.models.Material, 'findAll').mockResolvedValue([]);

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
      jest.spyOn(database.models.Material, 'create').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const values = DATA.material;

      // Act:
      const res = repository.createMaterial(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return material created', async () => {
      // Setup:
      jest.spyOn(database.models.Material, 'create')
        .mockResolvedValue(DATA.material);

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
      jest.spyOn(database.models.Material, 'findByPk').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = repository.getMaterial({ material_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return null when material was not found', async () => {
      // Setup:
      jest.spyOn(database.models.Material, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = await repository.getMaterial({ material_id, options });

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and strict is set true', () => {
      // Setup:
      jest.spyOn(database.models.Material, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = repository.getMaterial({ material_id, options }, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return material when is found', async () => {
      // Setup:
      jest.spyOn(database.models.Material, 'findByPk')
        .mockResolvedValue(DATA.material);

      // Arrange:
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = await repository.getMaterial({ material_id, options });

      // Assert:
      expect(res).toEqual(DATA.material);
    });
  });

  describe('updateMaterial', () => {
    it('should throw error when material was not found', () => {
      // Setup:
      jest.spyOn(database.models.Material, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const material_id = DATA.material.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateMaterial({ material_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Material, 'findByPk').mockResolvedValue({
        update: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const material_id = DATA.material.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateMaterial({ material_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return material updated when is found', async () => {
      // Setup:
      jest.spyOn(database.models.Material, 'findByPk').mockResolvedValue({
        update: jest.fn().mockResolvedValue({
          extra: { enabled: true },
          updated_at: new Date()
        })
      });

      // Arrange:
      const material_id = DATA.material.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await repository.updateMaterial({ material_id, values, options });

      // Assert:
      expect(res.extra).toEqual(values.extra);
    });
  });

  describe('deleteMaterial', () => {
    it('should throw error when material was not found', () => {
      // Setup:
      jest.spyOn(database.models.Material, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = repository.deleteMaterial({ material_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Material, 'findByPk').mockResolvedValue({
        destroy: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = repository.deleteMaterial({ material_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return material deleted when is found', async () => {
      // Setup:
      jest.spyOn(database.models.Material, 'findByPk').mockResolvedValue({
        destroy: jest.fn().mockResolvedValue({
          updated_at: new Date(),
          deleted_at: new Date()
        })
      });

      // Arrange:
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = await repository.deleteMaterial({ material_id, options });

      // Assert:
      expect(res.deleted_at).not.toBe(null);
    });
  });

  describe('getStocks', () => {
    it('should throw error when material was not found', () => {
      // Setup:
      jest.spyOn(database.models.Material, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = repository.getStocks({ material_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(database.models.Material, 'findByPk').mockResolvedValue({
        getStocks: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = repository.getStocks({ material_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      jest.spyOn(database.models.Material, 'findByPk').mockResolvedValue({
        getStocks: jest.fn().mockResolvedValue([ DATA.stock ])
      });

      // Arrange:
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = await repository.getStocks({ material_id, options });

      // Assert:
      expect(res).toEqual([ DATA.stock ]);
    });
    it('should return a list empty when records are not found', async () => {
      // Mock:
      jest.spyOn(database.models.Material, 'findByPk').mockResolvedValue({
        getStocks: jest.fn().mockResolvedValue([])
      });

      // Arrange:
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = await repository.getStocks({ material_id, options });

      // Assert:
      expect(res).toBeArray().toBeEmpty();
    });
  });

  describe('getStock', () => {
    it('should throw error when material was not found', () => {
      // Setup:
      jest.spyOn(database.models.Material, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const material_id = DATA.material.id;
      const stock_id = DATA.stock.id;
      const options = {};

      // Act:
      const res = repository.getStock({ material_id, stock_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return null when stock was not found', async () => {
      // Mock:
      jest.spyOn(database.models.Material, 'findByPk').mockResolvedValue({
        getStocks: jest.fn().mockResolvedValue(null)
      });

      // Arrange:
      const material_id = DATA.material.id;
      const stock_id = DATA.stock.id;
      const options = {};

      // Act:
      const res = await repository.getStock({ material_id, stock_id, options });

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and assert is true', () => {
      // Mock:
      jest.spyOn(database.models.Material, 'findByPk').mockResolvedValue({
        getStocks: jest.fn().mockResolvedValue(null)
      });

      // Arrange:
      const material_id = DATA.material.id;
      const stock_id = DATA.stock.id;
      const options = {};

      // Act:
      const res = repository.getStock({ material_id, stock_id, options }, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(database.models.Material, 'findByPk').mockResolvedValue({
        getStocks: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const material_id = DATA.material.id;
      const stock_id = DATA.stock.id;
      const options = {};

      // Act:
      const res = repository.getStock({ material_id, stock_id, options }, true);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.stock };

      // Mock:
      jest.spyOn(database.models.Material, 'findByPk').mockResolvedValue({
        getStocks: jest.fn().mockResolvedValue(expected)
      });

      // Arrange:
      const material_id = DATA.material.id;
      const stock_id = DATA.stock.id;
      const options = {};

      // Act:
      const res = await repository.getStock({ material_id, stock_id, options }, true);

      // Assert:
      expect(res).toEqual(expected)
    });
  });
});
