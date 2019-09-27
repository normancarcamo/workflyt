import '../../../config/global';
import db from '../../../../src/providers/postgres';
import * as DATA from '../../../config/models';
import Helpers from '../../../config/helpers';

describe('Categories - Controller', () => {
  const API_BASE = '/v1';
  const helpers = Helpers(db);

  beforeEach(helpers.destroyData);
  afterEach(helpers.restoreMocks);
  afterAll(helpers.closeConnections);

  describe('Retrieving Categories', () => {
    it('GET /categories --> Successfully', async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/categories/categories-service', () => ({
          CategoryService: () => ({
            getCategories: async (options?:object) => [ DATA.category ]
          })
        }));
      } else {
        await db.models.Category.create(DATA.category);
      }

      // Arrange:
      let permissions = [ 'get categories' ];
      let query = {};
      let payload = { permissions, query };

      // Act:
      let res = await helpers.request.get(`${API_BASE}/categories`, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeArray().not.toBeEmpty();
      expect(res.body.data[0]).toBeObject().not.toBeEmpty();
    });
  });

  describe('Creating Category', () => {
    it(`POST /categories --> There is an category with the same name`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/categories/categories-service', () => ({
          CategoryService: () => ({
            createCategory: helpers.serviceUniqueError
          })
        }));
      } else {
        await db.models.Category.create(DATA.category);
      }

      // Arrange:
      let permissions = [ 'create category' ];
      let data = DATA.category;
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.post(`${API_BASE}/categories`, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`POST /categories --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/categories/categories-service', () => ({
          CategoryService: () => ({
            createCategory: async (values:object, options?:object) => values
          })
        }));
      }

      // Arrange:
      let permissions = [ 'create category' ];
      let data = DATA.category;
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.post(`${API_BASE}/categories`, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 201 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
    });
  });

  describe('Retrieving Category', () => {
    it(`GET /categories/:category --> Not found`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/categories/categories-service', () => ({
          CategoryService: () => ({
            getCategory: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/categories/${DATA.category.id}`;
      let permissions = [ 'get category' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /categories/:category --> Successfully`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/categories/categories-service', () => ({
          CategoryService: () => ({
            getCategory: async (category_id, options) => DATA.category
          })
        }));
      } else {
        await db.models.Category.create(DATA.category);
      }

      // Arrange:
      let endpoint = `${API_BASE}/categories/${DATA.category.id}`;
      let permissions = [ 'get category' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.id).toEqual(DATA.category.id);
    });
  });

  describe('Updating Category', () => {
    it(`PATCH /categories/:category --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/categories/categories-service', () => ({
          CategoryService: () => ({
            updateCategory: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/categories/${DATA.category.id}`;
      let permissions = [ 'update category' ];
      let data = { extra: { enabled: true } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`PATCH /categories/:category --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/categories/categories-service', () => ({
          CategoryService: () => ({
            updateCategory: async (category_id, values, options) => values
          })
        }));
      } else {
        await db.models.Category.create(DATA.category);
      }

      // Arrange:
      let endpoint = `${API_BASE}/categories/${DATA.category.id}`;
      let permissions = [ 'update category' ];
      let data = { extra: { enabled: true } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data.extra).toEqual({ enabled: true });
    });
  });

  describe('Deleting Category', () => {
    it(`DELETE /categories/:category --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/categories/categories-service', () => ({
          CategoryService: () => ({
            deleteCategory: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/categories/${DATA.category.id}`;
      let permissions = [ 'delete category' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`DELETE /categories/:category --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/categories/categories-service', () => ({
          CategoryService: () => ({
            deleteCategory: async (category_id, options) => ({
              id: category_id,
              updated_at: new Date('2019-10-10'),
              deleted_at: new Date('2019-10-10')
            })
          })
        }));
      } else {
        await db.models.Category.create(DATA.category);
      }

      // Arrange:
      let endpoint = `${API_BASE}/categories/${DATA.category.id}`;
      let permissions = [ 'delete category' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data.id).toEqual(DATA.category.id);
      expect(res.body.data.deleted_at).not.toBe(null);
    });
  });

  describe('Retrieving Materials', () => {
    it(`GET /categories/:category/materials --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/categories/categories-service', () => ({
          CategoryService: () => ({
            getMaterials: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let category_id = DATA.category.id;
      let endpoint = `${API_BASE}/categories/${category_id}/materials`;
      let permissions = [ 'get materials from category' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /categories/:category/materials --> Successfully`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/categories/categories-service', () => ({
          CategoryService: () => ({
            getMaterials: async (category_id, options) => [ DATA.material ]
          })
        }));
      } else {
        let category = await db.models.Category.create(DATA.category);
        let material = await db.models.Material.create(DATA.material);
        await category.addMaterial(material);
      }

      // Arrange:
      let endpoint = `${API_BASE}/categories/${DATA.category.id}/materials`;
      let permissions = [ 'get materials from category' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeArray().not.toBeEmpty();
    });
  });

  describe('Retrieve material', () => {
    it(`GET /categories/:category/materials/:material --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/categories/categories-service', () => ({
          CategoryService: () => ({
            getMaterial: helpers.serviceNotFoundError
          })
        }));
      } else {
        await db.models.Category.create(DATA.category);
      }

      // Arrange:
      let category_id = DATA.category.id;
      let material_id = DATA.material.id;
      let endpoint = `${API_BASE}/categories/${category_id}/materials/${material_id}`;
      let permissions = [ 'get material from category' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /categories/:category/materials/:material --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/categories/categories-service', () => ({
          CategoryService: () => ({
            getMaterial: async (category_id, material_id, options) => DATA.material
          })
        }));
      } else {
        let category = await db.models.Category.create(DATA.category);
        let material = await db.models.Material.create(DATA.material);
        await category.addMaterial(material);
      }

      // Arrange:
      let category_id = DATA.category.id;
      let material_id = DATA.material.id;
      let endpoint = `${API_BASE}/categories/${category_id}/materials/${material_id}`;
      let permissions = [ 'get material from category' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.id).toEqual(material_id);
    });
  });
});
