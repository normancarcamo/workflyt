const db = require('src/providers/postgres');
const DATA = require('test/config/models');
const helpers = require('test/config/helpers')(db);
const API_BASE = '/v1';

describe('Categories - Controller', () => {
  beforeEach(helpers.destroyData);
  afterEach(helpers.restoreMocks);
  afterAll(helpers.closeConnections);

  describe('Retrieving Categories', () => {
    it('GET /categories --> Invalid Rights', async () => {
      // Arrange:
      let permissions = [ 'unknow' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(`${API_BASE}/categories`, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it('GET /categories --> Invalid input', async () => {
      // Arrange:
      let permissions = [ 'get categories' ];
      let query = { unknown: 'dm' };
      let payload = { permissions, query };

      // Act:
      let res = await helpers.request.get(`${API_BASE}/categories`, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it('GET /categories --> Successfully', async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/categories/categories-service', () => () => ({
          getCategories: async options => [ DATA.category ]
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
    it(`POST /categories --> Invalid Rights`, async () => {
      // Arrange:
      let permissions = [ 'unknown' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.post(`${API_BASE}/categories`, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`POST /categories --> Invalid input`, async () => {
      // Arrange:
      let permissions = [ 'create category' ];
      let data = { unknownProperty: 'mm' };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.post(`${API_BASE}/categories`, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`POST /categories --> There is an category with the same name`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/categories/categories-service', () => () => ({
          createCategory: helpers.serviceUniqueError
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
        jest.doMock('src/core/categories/categories-service', () => () => ({
          createCategory: async values => values
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
    it(`GET /categories/:category --> Invalid Rights`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/categories/${DATA.category.id}`;
      let permissions = [ 'unknown privilege' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`GET /categories/:category --> Invalid input`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/categories/kdjsnkjnfksjndkfjnmm`;
      let permissions = [ 'get category' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`GET /categories/:category --> Not found`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/categories/categories-service', () => () => ({
          getCategory: helpers.serviceNotFoundError
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
        jest.doMock('src/core/categories/categories-service', () => () => ({
          getCategory: async ({ category_id, options }) => DATA.category
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
    it(`PATCH /categories/:category --> Invalid Rights`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/categories/${DATA.category.id}`;
      let permissions = [ 'unknown privilege' ];
      let data = { name: 'New name updated' };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`PATCH /categories/:category --> Invalid input`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/categories/${DATA.category.id}`;
      let permissions = [ 'update category' ];
      let data = { namemmm: 'New name updated' };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`PATCH /categories/:category --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/categories/categories-service', () => () => ({
          updateCategory: helpers.serviceNotFoundError
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
        jest.doMock('src/core/categories/categories-service', () => () => ({
          updateCategory: async ({ category_id, values, options }) => values
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
    it(`DELETE /categories/:category --> Invalid Rights`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/categories/${DATA.category.id}`;
      let permissions = [ 'unknown' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`DELETE /categories/:category --> Invalid input`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/categories/sjdbjhsbdjhfbsdjhfbjsdhfb`;
      let permissions = [ 'delete category' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`DELETE /categories/:category --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/categories/categories-service', () => () => ({
          deleteCategory: helpers.serviceNotFoundError
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
        jest.doMock('src/core/categories/categories-service', () => () => ({
          deleteCategory: async ({ category_id, options }) => ({
            id: category_id,
            updated_at: new Date('2019-10-10'),
            deleted_at: new Date('2019-10-10')
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
    it(`GET /categories/:category/materials --> Invalid rights`, async () => {
      // Arrange:
      let category_id = DATA.category.id;
      let endpoint = `${API_BASE}/categories/${category_id}/materials`;
      let permissions = [ 'unknown' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`GET /categories/:category/materials --> Invalid input`, async () => {
      // Arrange:
      let category_id = DATA.category.id;
      let endpoint = `${API_BASE}/categories/${category_id}/materials`;
      let permissions = [ 'get materials from category' ];
      let query = { attributes: [ 'nanana' ] };
      let payload = { permissions, query };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`GET /categories/:category/materials --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/categories/categories-service', () => () => ({
          getMaterials: helpers.serviceNotFoundError
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
        jest.doMock('src/core/categories/categories-service', () => () => ({
          getMaterials: async ({ category_id, options }) => [ DATA.material ]
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
    it(`GET /categories/:category/materials/:material --> Invalid rights`, async () => {
      // Arrange:
      let category_id = DATA.category.id;
      let material_id = DATA.material.id;
      let endpoint = `${API_BASE}/categories/${category_id}/materials/${material_id}`;
      let permissions = [ 'unknown' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`GET /categories/:category/materials/:material --> Invalid input`, async () => {
      // Arrange:
      let category_id = DATA.category.id;
      let material_id = DATA.material.id;
      let endpoint = `${API_BASE}/categories/${category_id}/materials/${material_id}`;
      let permissions = [ 'get material from category' ];
      let query = { attributes: [ 'skmksms' ] };
      let payload = { permissions, query };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`GET /categories/:category/materials/:material --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/categories/categories-service', () => () => ({
          getMaterial: helpers.serviceNotFoundError
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
        jest.doMock('src/core/categories/categories-service', () => () => ({
          getMaterial: async ({ category_id, material_id, options }) => DATA.material
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
