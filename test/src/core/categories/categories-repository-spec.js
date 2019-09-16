const Repository = require('src/core/categories/categories-repository');
const ACTION_ERROR = require('test/config/errors').ERROR_BAD_GATEWAY;
const DATA = require('test/config/models');
const DATABASE = require('test/config/database');

describe('Category Repository', () => {
  const database = { ...DATABASE };
  const repository = Repository({ database });

  beforeEach(async () => { database.models = DATABASE.models; });

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
      jest.spyOn(database.models.Category, 'findAll')
        .mockResolvedValue([ DATA.category ]);

      // Arrange:
      const options = {};

      // Act:
      const res = await repository.getCategories(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty().toEqual([ DATA.category ]);
    });
    it('should return an empty list when records are not found', async () => {
      // Setup:
      jest.spyOn(database.models.Category, 'findAll').mockResolvedValue([]);

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
      jest.spyOn(database.models.Category, 'create').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const values = DATA.category;

      // Act:
      const res = repository.createCategory(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return category created', async () => {
      // Setup:
      jest.spyOn(database.models.Category, 'create')
        .mockResolvedValue(DATA.category);

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
      jest.spyOn(database.models.Category, 'findByPk').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const category_id = DATA.category.id;
      const options = {};

      // Act:
      const res = repository.getCategory({ category_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return null when category was not found', async () => {
      // Setup:
      jest.spyOn(database.models.Category, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const category_id = DATA.category.id;
      const options = {};

      // Act:
      const res = await repository.getCategory({ category_id, options });

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and strict is set true', () => {
      // Setup:
      jest.spyOn(database.models.Category, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const category_id = DATA.category.id;
      const options = {};

      // Act:
      const res = repository.getCategory({ category_id, options }, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return category when is found', async () => {
      // Setup:
      jest.spyOn(database.models.Category, 'findByPk')
        .mockResolvedValue(DATA.category);

      // Arrange:
      const category_id = DATA.category.id;
      const options = {};

      // Act:
      const res = await repository.getCategory({ category_id, options });

      // Assert:
      expect(res).toEqual(DATA.category);
    });
  });

  describe('updateCategory', () => {
    it('should throw error when category was not found', () => {
      // Setup:
      jest.spyOn(database.models.Category, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const category_id = DATA.category.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateCategory({ category_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Category, 'findByPk').mockResolvedValue({
        update: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const category_id = DATA.category.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateCategory({ category_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return category updated when is found', async () => {
      // Setup:
      jest.spyOn(database.models.Category, 'findByPk').mockResolvedValue({
        update: jest.fn().mockResolvedValue({
          extra: { enabled: true },
          updated_at: new Date()
        })
      });

      // Arrange:
      const category_id = DATA.category.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await repository.updateCategory({ category_id, values, options });

      // Assert:
      expect(res.extra).toEqual(values.extra);
    });
  });

  describe('deleteCategory', () => {
    it('should throw error when category was not found', () => {
      // Setup:
      jest.spyOn(database.models.Category, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const category_id = DATA.category.id;
      const options = {};

      // Act:
      const res = repository.deleteCategory({ category_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Category, 'findByPk').mockResolvedValue({
        destroy: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const category_id = DATA.category.id;
      const options = {};

      // Act:
      const res = repository.deleteCategory({ category_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return category deleted when is found', async () => {
      // Setup:
      jest.spyOn(database.models.Category, 'findByPk').mockResolvedValue({
        destroy: jest.fn().mockResolvedValue({
          updated_at: new Date(),
          deleted_at: new Date()
        })
      });

      // Arrange:
      const category_id = DATA.category.id;
      const options = {};

      // Act:
      const res = await repository.deleteCategory({ category_id, options });

      // Assert:
      expect(res.deleted_at).not.toBe(null);
    });
  });

  describe('getMaterials', () => {
    it('should throw error when category was not found', () => {
      // Setup:
      jest.spyOn(database.models.Category, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const category_id = DATA.category.id;
      const options = {};

      // Act:
      const res = repository.getMaterials({ category_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(database.models.Category, 'findByPk').mockResolvedValue({
        getMaterials: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const category_id = DATA.category.id;
      const options = {};

      // Act:
      const res = repository.getMaterials({ category_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      jest.spyOn(database.models.Category, 'findByPk').mockResolvedValue({
        getMaterials: jest.fn().mockResolvedValue([ DATA.material ])
      });

      // Arrange:
      const category_id = DATA.category.id;
      const options = {};

      // Act:
      const res = await repository.getMaterials({ category_id, options });

      // Assert:
      expect(res).toEqual([ DATA.material ]);
    });
    it('should return a list empty when records are not found', async () => {
      // Mock:
      jest.spyOn(database.models.Category, 'findByPk').mockResolvedValue({
        getMaterials: jest.fn().mockResolvedValue([])
      });

      // Arrange:
      const category_id = DATA.category.id;
      const options = {};

      // Act:
      const res = await repository.getMaterials({ category_id, options });

      // Assert:
      expect(res).toBeArray().toBeEmpty();
    });
  });

  describe('getMaterial', () => {
    it('should throw error when category was not found', () => {
      // Setup:
      jest.spyOn(database.models.Category, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const category_id = DATA.category.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = repository.getMaterial({ category_id, material_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return null when material was not found', async () => {
      // Mock:
      jest.spyOn(database.models.Category, 'findByPk').mockResolvedValue({
        getMaterials: jest.fn().mockResolvedValue(null)
      });

      // Arrange:
      const category_id = DATA.category.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = await repository.getMaterial({ category_id, material_id, options });

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and assert is true', () => {
      // Mock:
      jest.spyOn(database.models.Category, 'findByPk').mockResolvedValue({
        getMaterials: jest.fn().mockResolvedValue(null)
      });

      // Arrange:
      const category_id = DATA.category.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = repository.getMaterial({ category_id, material_id, options }, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(database.models.Category, 'findByPk').mockResolvedValue({
        getMaterials: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const category_id = DATA.category.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = repository.getMaterial({ category_id, material_id, options }, true);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.material };

      // Mock:
      jest.spyOn(database.models.Category, 'findByPk').mockResolvedValue({
        getMaterials: jest.fn().mockResolvedValue(expected)
      });

      // Arrange:
      const category_id = DATA.category.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = await repository.getMaterial({ category_id, material_id, options }, true);

      // Assert:
      expect(res).toEqual(expected)
    });
  });
});
