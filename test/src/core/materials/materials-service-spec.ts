import '../../../config/global';
import { MaterialRepository } from '../../../../src/core/materials/materials-repository';
import { MaterialService } from '../../../../src/core/materials/materials-service';
import { I } from '../../../../src/core/materials/materials-types';
import { ERROR_BAD_GATEWAY as ACTION_ERROR } from '../../../config/errors';
import * as DATA from '../../../config/models';

describe('Material Service', () => {
  let database = {};
  let repository = MaterialRepository(database);
  let service:I.service = MaterialService(repository);

  beforeEach(async () => { service = MaterialService(repository); });

  describe('getMaterials', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.getMaterials = async () => { throw ACTION_ERROR; };

      // Arrange:
      const options = {};

      // Act:
      const res = service.getMaterials(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of materials', async () => {
      // Setup:
      repository.getMaterials = async () => [ DATA.material ];

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
      repository.createMaterial = async () => { throw ACTION_ERROR; };

      // Arrange:
      const values = DATA.material;

      // Act:
      const res = service.createMaterial(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return material created', async () => {
      // Setup:
      repository.createMaterial = async () => DATA.material;

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
      repository.getMaterial = async () => { throw ACTION_ERROR; };

      // Arrange:
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = service.getMaterial(material_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return material when is found', async () => {
      // Setup:
      repository.getMaterial = async () => DATA.material;

      // Arrange:
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = await service.getMaterial(material_id, options);

      // Assert:
      expect(res).toEqual(DATA.material);
    });
  });

  describe('updateMaterial', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.updateMaterial = async () => { throw ACTION_ERROR; };

      // Arrange:
      const material_id = DATA.material.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = service.updateMaterial(material_id, values, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return material updated when is found', async () => {
      // Setup:
      repository.updateMaterial = async () => ({
        extra: { enabled: true },
        updated_at: new Date('2019-10-10')
      });

      // Arrange:
      const material_id = DATA.material.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await service.updateMaterial(material_id, values, options);

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.extra).toEqual({ enabled: true });
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('deleteMaterial', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.deleteMaterial = async () => { throw ACTION_ERROR; };

      // Arrange:
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = service.deleteMaterial(material_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return material updated when is found', async () => {
      // Setup:
      repository.deleteMaterial = async () => ({
        updated_at: new Date('2019-10-10'),
        deleted_at: new Date('2019-10-10')
      });

      // Arrange:
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = await service.deleteMaterial(material_id, options);

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('getStocks', () => {
    it('should throw error when action fail', () => {
      // Mock:
      repository.getStocks = async () => { throw ACTION_ERROR; };

      // Arrange:
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = service.getStocks(material_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      repository.getStocks = async () => [ DATA.stock ];

      // Arrange:
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = await service.getStocks(material_id, options);

      // Assert:
      expect(res).toEqual([ DATA.stock ]);
    });
  });

  describe('getStock', () => {
    it('should throw error when action fail', () => {
      // Mock:
      repository.getStock = async () => { throw ACTION_ERROR; };

      // Arrange:
      const material_id = DATA.material.id;
      const stock_id = DATA.stock.id;
      const options = {};

      // Act:
      const res = service.getStock(material_id, stock_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.stock };

      // Mock:
      repository.getStock = async () => expected;

      // Arrange:
      const material_id = DATA.material.id;
      const stock_id = DATA.stock.id;
      const options = {};

      // Act:
      const res = await service.getStock(material_id, stock_id, options);

      // Assert:
      expect(res).toEqual(expected);
    });
  });
});
