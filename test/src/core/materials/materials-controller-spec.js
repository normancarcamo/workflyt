const db = require('src/providers/postgres');
const DATA = require('test/config/models');
const helpers = require('test/config/helpers')(db);
const API_BASE = '/v1';

describe('Materials - Controller', () => {
  beforeEach(helpers.destroyData);
  afterEach(helpers.restoreMocks);
  afterAll(helpers.closeConnections);

  describe('Retrieving Materials', () => {
    it('GET /materials --> Invalid Rights', async () => {
      // Arrange:
      let permissions = [ 'unknow' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(`${API_BASE}/materials`, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it('GET /materials --> Invalid input', async () => {
      // Arrange:
      let permissions = [ 'get materials' ];
      let query = { unknown: 'dm' };
      let payload = { permissions, query };

      // Act:
      let res = await helpers.request.get(`${API_BASE}/materials`, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it('GET /materials --> Successfully', async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/materials/materials-service', () => () => ({
          getMaterials: async options => [ DATA.material ]
        }));
      } else {
        await db.models.Category.create(DATA.category);
        await db.models.Material.create(DATA.material);
      }

      // Arrange:
      let permissions = [ 'get materials' ];
      let query = {};
      let payload = { permissions, query };

      // Act:
      let res = await helpers.request.get(`${API_BASE}/materials`, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeArray().not.toBeEmpty();
      expect(res.body.data[0]).toBeObject().not.toBeEmpty();
    });
  });

  describe('Creating Material', () => {
    it(`POST /materials --> Invalid Rights`, async () => {
      // Arrange:
      let permissions = [ 'unknown' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.post(`${API_BASE}/materials`, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`POST /materials --> Invalid input`, async () => {
      // Arrange:
      let permissions = [ 'create material' ];
      let data = { unknownProperty: 'mm' };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.post(`${API_BASE}/materials`, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`POST /materials --> There is an material with the same name`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/materials/materials-service', () => () => ({
          createMaterial: helpers.serviceUniqueError
        }));
      } else {
        await db.models.Category.create(DATA.category);
        await db.models.Material.create(DATA.material);
      }

      // Arrange:
      let permissions = [ 'create material' ];
      let data = DATA.material;
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.post(`${API_BASE}/materials`, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`POST /materials --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/materials/materials-service', () => () => ({
          createMaterial: async values => values
        }));
      } else {
        await db.models.Category.create(DATA.category);
      }

      // Arrange:
      let permissions = [ 'create material' ];
      let data = DATA.material;
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.post(`${API_BASE}/materials`, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 201 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
    });
  });

  describe('Retrieving Material', () => {
    it(`GET /materials/:material --> Invalid Rights`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/materials/${DATA.material.id}`;
      let permissions = [ 'unknown privilege' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`GET /materials/:material --> Invalid input`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/materials/kdjsnkjnfksjndkfjnmm`;
      let permissions = [ 'get material' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`GET /materials/:material --> Not found`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/materials/materials-service', () => () => ({
          getMaterial: helpers.serviceNotFoundError
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/materials/${DATA.material.id}`;
      let permissions = [ 'get material' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /materials/:material --> Successfully`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/materials/materials-service', () => () => ({
          getMaterial: async ({ material_id, options }) => DATA.material
        }));
      } else {
        await db.models.Category.create(DATA.category);
        await db.models.Material.create(DATA.material);
      }

      // Arrange:
      let endpoint = `${API_BASE}/materials/${DATA.material.id}`;
      let permissions = [ 'get material' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.id).toEqual(DATA.material.id);
    });
  });

  describe('Updating Material', () => {
    it(`PATCH /materials/:material --> Invalid Rights`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/materials/${DATA.material.id}`;
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
    it(`PATCH /materials/:material --> Invalid input`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/materials/${DATA.material.id}`;
      let permissions = [ 'update material' ];
      let data = { namemmm: 'New name updated' };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`PATCH /materials/:material --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/materials/materials-service', () => () => ({
          updateMaterial: helpers.serviceNotFoundError
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/materials/${DATA.material.id}`;
      let permissions = [ 'update material' ];
      let data = { extra: { enabled: true } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`PATCH /materials/:material --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/materials/materials-service', () => () => ({
          updateMaterial: async ({ material_id, values, options }) => values
        }));
      } else {
        await db.models.Category.create(DATA.category);
        await db.models.Material.create(DATA.material);
      }

      // Arrange:
      let endpoint = `${API_BASE}/materials/${DATA.material.id}`;
      let permissions = [ 'update material' ];
      let data = { extra: { enabled: true } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data.extra).toEqual({ enabled: true });
    });
  });

  describe('Deleting Material', () => {
    it(`DELETE /materials/:material --> Invalid Rights`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/materials/${DATA.material.id}`;
      let permissions = [ 'unknown' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`DELETE /materials/:material --> Invalid input`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/materials/sjdbjhsbdjhfbsdjhfbjsdhfb`;
      let permissions = [ 'delete material' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`DELETE /materials/:material --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/materials/materials-service', () => () => ({
          deleteMaterial: helpers.serviceNotFoundError
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/materials/${DATA.material.id}`;
      let permissions = [ 'delete material' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`DELETE /materials/:material --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/materials/materials-service', () => () => ({
          deleteMaterial: async ({ material_id, options }) => ({
            id: material_id,
            updated_at: new Date('2019-10-10'),
            deleted_at: new Date('2019-10-10')
          })
        }));
      } else {
        await db.models.Category.create(DATA.category);
        await db.models.Material.create(DATA.material);
      }

      // Arrange:
      let endpoint = `${API_BASE}/materials/${DATA.material.id}`;
      let permissions = [ 'delete material' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data.id).toEqual(DATA.material.id);
      expect(res.body.data.deleted_at).not.toBe(null);
    });
  });

  describe('Retrieving Stocks', () => {
    it(`GET /materials/:material/stocks --> Invalid rights`, async () => {
      // Arrange:
      let material_id = DATA.material.id;
      let endpoint = `${API_BASE}/materials/${material_id}/stocks`;
      let permissions = [ 'unknown' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`GET /materials/:material/stocks --> Invalid input`, async () => {
      // Arrange:
      let material_id = DATA.material.id;
      let endpoint = `${API_BASE}/materials/${material_id}/stocks`;
      let permissions = [ 'get stocks from material' ];
      let query = { attributes: [ 'nanana' ] };
      let payload = { permissions, query };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`GET /materials/:material/stocks --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/materials/materials-service', () => () => ({
          getStocks: helpers.serviceNotFoundError
        }));
      }

      // Arrange:
      let material_id = DATA.material.id;
      let endpoint = `${API_BASE}/materials/${material_id}/stocks`;
      let permissions = [ 'get stocks from material' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /materials/:material/stocks --> Successfully`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/materials/materials-service', () => () => ({
          getStocks: async ({ material_id, options }) => [ DATA.stock ]
        }));
      } else {
        let category = await db.models.Category.create(DATA.category);
        let material = await db.models.Material.create(DATA.material);
        let salesman = await db.models.Worker.create(DATA.salesman);
        let stock = await db.models.Stock.create(DATA.stock);
        await material.addStock(stock);
      }

      // Arrange:
      let endpoint = `${API_BASE}/materials/${DATA.material.id}/stocks`;
      let permissions = [ 'get stocks from material' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeArray().not.toBeEmpty();
    });
  });

  describe('Retrieve stock', () => {
    it(`GET /materials/:material/stocks/:stock --> Invalid rights`, async () => {
      // Arrange:
      let material_id = DATA.material.id;
      let stock_id = DATA.stock.id;
      let endpoint = `${API_BASE}/materials/${material_id}/stocks/${stock_id}`;
      let permissions = [ 'unknown' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`GET /materials/:material/stocks/:stock --> Invalid input`, async () => {
      // Arrange:
      let material_id = DATA.material.id;
      let stock_id = DATA.stock.id;
      let endpoint = `${API_BASE}/materials/${material_id}/stocks/${stock_id}`;
      let permissions = [ 'get stock from material' ];
      let query = { attributes: [ 'skmksms' ] };
      let payload = { permissions, query };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`GET /materials/:material/stocks/:stock --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/materials/materials-service', () => () => ({
          getStock: helpers.serviceNotFoundError
        }));
      } else {
        await db.models.Category.create(DATA.category);
        await db.models.Material.create(DATA.material);
      }

      // Arrange:
      let material_id = DATA.material.id;
      let stock_id = DATA.stock.id;
      let endpoint = `${API_BASE}/materials/${material_id}/stocks/${stock_id}`;
      let permissions = [ 'get stock from material' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /materials/:material/stocks/:stock --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/materials/materials-service', () => () => ({
          getStock: async ({ material_id, stock_id, options }) => DATA.stock
        }));
      } else {
        let category = await db.models.Category.create(DATA.category);
        let material = await db.models.Material.create(DATA.material);
        let salesman = await db.models.Worker.create(DATA.salesman);
        let stock = await db.models.Stock.create(DATA.stock);
        await material.addStock(stock);
      }

      // Arrange:
      let material_id = DATA.material.id;
      let stock_id = DATA.stock.id;
      let endpoint = `${API_BASE}/materials/${material_id}/stocks/${stock_id}`;
      let permissions = [ 'get stock from material' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.id).toEqual(stock_id);
    });
  });
});
