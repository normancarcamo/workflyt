import '../../../config/global';
import * as DATA from '../../../config/models';
import DATABASE from '../../../config/database';
import { ERROR_BAD_GATEWAY as ACTION_ERROR } from '../../../config/errors';
import { CategoryRepository } from '../../../../src/core/categories/categories-repository';

describe('Category Repository', () => {
  const database = { ...DATABASE() };
  const repository = CategoryRepository(database);

  beforeEach(async () => { database.models = DATABASE().models; });

  describe('getCategories', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Category, 'findAll').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const options = {};

      // Act:
      const res = repository.getCategories(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of categories', async () => {
      // Setup:
      database.models.Category.findAll = (async () => [ DATA.category ]) as any;

      // Arrange:
      const options = {};

      // Act:
      const res = await repository.getCategories(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty().toEqual([ DATA.category ]);
    });
    it('should return an empty list when records are not found', async () => {
      // Setup:
      database.models.Category.findAll = (async () => []) as any;

      // Arrange:
      const options = {};

      // Act:
      const res = await repository.getCategories(options);

      // Assert:
      expect(res).toBeArray().toBeEmpty();
    });
  });

  describe('createCategory', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Category.create = (async () => { throw ACTION_ERROR }) as any;

      // Arrange:
      const values = DATA.category;

      // Act:
      const res = repository.createCategory(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return category created', async () => {
      // Setup:
      database.models.Category.create = (async () => DATA.category) as any;

      // Arrange:
      const values = DATA.category;

      // Act:
      const res = await repository.createCategory(values);

      // Assert:
      expect(res).toEqual(DATA.category);
    });
  });

  describe('getCategory', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Category.findByPk = (async () => { throw ACTION_ERROR; }) as any;

      // Arrange:
      const category_id = DATA.category.id;
      const options = {};

      // Act:
      const res = repository.getCategory(category_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return null when category was not found', async () => {
      // Setup:
      database.models.Category.findByPk = (async () => null) as any;

      // Arrange:
      const category_id = DATA.category.id;
      const options = {};

      // Act:
      const res = await repository.getCategory(category_id, options);

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and strict is set true', () => {
      // Setup:
      database.models.Category.findByPk = (async () => null) as any;

      // Arrange:
      const category_id = DATA.category.id;
      const options = {};

      // Act:
      const res = repository.getCategory(category_id, options, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return category when is found', async () => {
      // Setup:
      database.models.Category.findByPk = (async () => DATA.category) as any;

      // Arrange:
      const category_id = DATA.category.id;
      const options = {};

      // Act:
      const res = await repository.getCategory(category_id, options);

      // Assert:
      expect(res).toEqual(DATA.category);
    });
  });

  describe('updateCategory', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Category.findByPk = (async () => ({
        update: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const category_id = DATA.category.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateCategory(category_id, values, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return category updated when is found', async () => {
      // Setup:
      database.models.Category.findByPk = (async () => ({
        update: jest.fn().mockResolvedValue({
          extra: { enabled: true },
          updated_at: new Date()
        })
      })) as any;

      // Arrange:
      const category_id = DATA.category.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await repository.updateCategory(category_id, values, options);

      // Assert:
      expect(res.extra).toEqual(values.extra);
    });
  });

  describe('deleteCategory', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Category.findByPk = (async () => ({
        destroy: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const category_id = DATA.category.id;
      const options = {};

      // Act:
      const res = repository.deleteCategory(category_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return category deleted when is found', async () => {
      // Setup:
      database.models.Category.findByPk = (async () => ({
        destroy: async () => ({
          updated_at: new Date(),
          deleted_at: new Date()
        })
      })) as any;

      // Arrange:
      const category_id = DATA.category.id;
      const options = {};

      // Act:
      const res = await repository.deleteCategory(category_id, options);

      // Assert:
      expect(res.deleted_at).not.toBe(null);
    });
  });

  describe('getMaterials', () => {
    it('should throw error when action fail', () => {
      // Mock:
      database.models.Category.findByPk = (async () => ({
        getMaterials: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const category_id = DATA.category.id;
      const options = {};

      // Act:
      const res = repository.getMaterials(category_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      database.models.Category.findByPk = (async () => ({
        getMaterials: async () => [ DATA.material ]
      })) as any;

      // Arrange:
      const category_id = DATA.category.id;
      const options = {};

      // Act:
      const res = await repository.getMaterials(category_id, options);

      // Assert:
      expect(res).toEqual([ DATA.material ]);
    });
    it('should return a list empty when records are not found', async () => {
      // Mock:
      database.models.Category.findByPk = (async () => ({
        getMaterials: async () => []
      })) as any;

      // Arrange:
      const category_id = DATA.category.id;
      const options = {};

      // Act:
      const res = await repository.getMaterials(category_id, options);

      // Assert:
      expect(res).toBeArray().toBeEmpty();
    });
  });

  describe('getMaterial', () => {
    it('should return null when material was not found', async () => {
      // Mock:
      database.models.Category.findByPk = (async () => ({
        getMaterials: async () => null
      })) as any;

      // Arrange:
      const category_id = DATA.category.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = await repository.getMaterial(category_id, material_id, options);

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and assert is true', () => {
      // Mock:
      database.models.Category.findByPk = (async () => ({
        getMaterials: async () => null
      })) as any;

      // Arrange:
      const category_id = DATA.category.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = repository.getMaterial(category_id, material_id, options, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Mock:
      database.models.Category.findByPk = (async () => ({
        getMaterials: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const category_id = DATA.category.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = repository.getMaterial(category_id, material_id, options, true);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.material };

      // Mock:
      database.models.Category.findByPk = (async () => ({
        getMaterials: async () => expected
      })) as any;

      // Arrange:
      const category_id = DATA.category.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = await repository.getMaterial(category_id, material_id, options, true);

      // Assert:
      expect(res).toEqual(expected);
    });
  });
});
