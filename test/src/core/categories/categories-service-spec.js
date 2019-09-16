const Repository = require('src/core/categories/categories-repository');
const Service = require('src/core/categories/categories-service');
const ACTION_ERROR = require('test/config/errors').ERROR_BAD_GATEWAY;
const DATA = require('test/config/models');

describe('Category Service', () => {
  const database = {};
  const repository = Repository({ database });
  let service = null;

  beforeEach(async () => { service = Service({ repository }); });

  describe('getCategories', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'getCategories').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const options = {};

      // Act:
      const res = service.getCategories(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of categories', async () => {
      // Setup:
      jest.spyOn(repository, 'getCategories').mockResolvedValue([ DATA.category ]);

      // Arrange:
      const options = {};

      // Act:
      const res = await service.getCategories(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty().toEqual([ DATA.category ]);
    });
  });

  describe('createCategory', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'createCategory').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const values = DATA.category;

      // Act:
      const res = service.createCategory(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return category created', async () => {
      // Setup:
      jest.spyOn(repository, 'createCategory').mockResolvedValue(DATA.category);

      // Arrange:
      const values = DATA.category;

      // Act:
      const res = await service.createCategory(values);

      // Assert:
      expect(res).toEqual(DATA.category);
    });
  });

  describe('getCategory', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'getCategory').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const category_id = DATA.category.id;
      const options = {};

      // Act:
      const res = service.getCategory({ category_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return category when is found', async () => {
      // Setup:
      jest.spyOn(repository, 'getCategory').mockResolvedValue(DATA.category);

      // Arrange:
      const category_id = DATA.category.id;
      const options = {};

      // Act:
      const res = await service.getCategory({ category_id, options });

      // Assert:
      expect(res).toEqual(DATA.category);
    });
  });

  describe('updateCategory', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'updateCategory').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const category_id = DATA.category.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = service.updateCategory({ category_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return category updated when is found', async () => {
      // Setup:
      jest.spyOn(repository, 'updateCategory').mockResolvedValue({
        extra: { enabled: true },
        updated_at: new Date('2019-10-10')
      });

      // Arrange:
      const category_id = DATA.category.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await service.updateCategory({ category_id, values, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.extra).toEqual({ enabled: true });
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('deleteCategory', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'deleteCategory').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const category_id = DATA.category.id;
      const options = {};

      // Act:
      const res = service.deleteCategory({ category_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return category updated when is found', async () => {
      // Setup:
      jest.spyOn(repository, 'deleteCategory').mockResolvedValue({
        updated_at: new Date('2019-10-10'),
        deleted_at: new Date('2019-10-10')
      });

      // Arrange:
      const category_id = DATA.category.id;
      const options = {};

      // Act:
      const res = await service.deleteCategory({ category_id, options });

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
      const category_id = DATA.category.id;
      const options = {};

      // Act:
      const res = service.getMaterials({ category_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      jest.spyOn(repository, 'getMaterials').mockResolvedValue([ DATA.material ]);

      // Arrange:
      const category_id = DATA.category.id;
      const options = {};

      // Act:
      const res = await service.getMaterials({ category_id, options });

      // Assert:
      expect(res).toEqual([ DATA.material ]);
    });
  });

  describe('getMaterial', () => {
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(repository, 'getMaterial').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const category_id = DATA.category.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = service.getMaterial({ category_id, material_id, options }, true);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.material };

      // Mock:
      jest.spyOn(repository, 'getMaterial').mockResolvedValue(expected);

      // Arrange:
      const category_id = DATA.category.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = await service.getMaterial({ category_id, material_id, options }, true);

      // Assert:
      expect(res).toEqual(expected)
    });
  });
});
