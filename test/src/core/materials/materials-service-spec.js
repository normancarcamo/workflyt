const Repository = require('src/core/materials/materials-repository');
const Service = require('src/core/materials/materials-service');
const ACTION_ERROR = require('test/config/errors').ERROR_BAD_GATEWAY;
const DATA = require('test/config/models');

describe('Material Service', () => {
  const database = {};
  const repository = Repository({ database });
  let service = null;

  beforeEach(async () => { service = Service({ repository }); });

  describe('getMaterials', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'getMaterials').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const options = {};

      // Act:
      const res = service.getMaterials(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of materials', async () => {
      // Setup:
      jest.spyOn(repository, 'getMaterials').mockResolvedValue([ DATA.material ]);

      // Arrange:
      const options = {};

      // Act:
      const res = await service.getMaterials(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty().toEqual([ DATA.material ]);
    });
  });

  describe('createMaterial', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'createMaterial').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const values = DATA.material;

      // Act:
      const res = service.createMaterial(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return material created', async () => {
      // Setup:
      jest.spyOn(repository, 'createMaterial').mockResolvedValue(DATA.material);

      // Arrange:
      const values = DATA.material;

      // Act:
      const res = await service.createMaterial(values);

      // Assert:
      expect(res).toEqual(DATA.material);
    });
  });

  describe('getMaterial', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'getMaterial').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = service.getMaterial({ material_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return material when is found', async () => {
      // Setup:
      jest.spyOn(repository, 'getMaterial').mockResolvedValue(DATA.material);

      // Arrange:
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = await service.getMaterial({ material_id, options });

      // Assert:
      expect(res).toEqual(DATA.material);
    });
  });

  describe('updateMaterial', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'updateMaterial').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const material_id = DATA.material.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = service.updateMaterial({ material_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return material updated when is found', async () => {
      // Setup:
      jest.spyOn(repository, 'updateMaterial').mockResolvedValue({
        extra: { enabled: true },
        updated_at: new Date('2019-10-10')
      });

      // Arrange:
      const material_id = DATA.material.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await service.updateMaterial({ material_id, values, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.extra).toEqual({ enabled: true });
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('deleteMaterial', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'deleteMaterial').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = service.deleteMaterial({ material_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return material updated when is found', async () => {
      // Setup:
      jest.spyOn(repository, 'deleteMaterial').mockResolvedValue({
        updated_at: new Date('2019-10-10'),
        deleted_at: new Date('2019-10-10')
      });

      // Arrange:
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = await service.deleteMaterial({ material_id, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('getStocks', () => {
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(repository, 'getStocks').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = service.getStocks({ material_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      jest.spyOn(repository, 'getStocks').mockResolvedValue([ DATA.stock ]);

      // Arrange:
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = await service.getStocks({ material_id, options });

      // Assert:
      expect(res).toEqual([ DATA.stock ]);
    });
  });

  describe('getStock', () => {
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(repository, 'getStock').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const material_id = DATA.material.id;
      const stock_id = DATA.stock.id;
      const options = {};

      // Act:
      const res = service.getStock({ material_id, stock_id, options }, true);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.stock };

      // Mock:
      jest.spyOn(repository, 'getStock').mockResolvedValue(expected);

      // Arrange:
      const material_id = DATA.material.id;
      const stock_id = DATA.stock.id;
      const options = {};

      // Act:
      const res = await service.getStock({ material_id, stock_id, options }, true);

      // Assert:
      expect(res).toEqual(expected)
    });
  });
});
