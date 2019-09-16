const db = require('src/providers/postgres');
const DATA = require('test/config/models');
const helpers = require('test/config/helpers')(db);
const API_BASE = '/v1';

describe('Stocks - Controller', () => {
  beforeEach(helpers.destroyData);
  afterEach(helpers.restoreMocks);
  afterAll(helpers.closeConnections);

  describe('Retrieving Stocks', () => {
    it('GET /stocks --> Invalid Rights', async () => {
      // Arrange:
      let permissions = [ 'unknow' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(`${API_BASE}/stocks`, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it('GET /stocks --> Invalid input', async () => {
      // Arrange:
      let permissions = [ 'get stocks' ];
      let query = { unknown: 'dm' };
      let payload = { permissions, query };

      // Act:
      let res = await helpers.request.get(`${API_BASE}/stocks`, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it('GET /stocks --> Successfully', async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/stocks/stocks-service', () => () => ({
          getStocks: async options => [ DATA.stock ]
        }));
      } else {
        await db.models.Category.create(DATA.category);
        await db.models.Material.create(DATA.material);
        await db.models.Stock.create(DATA.stock);
      }

      // Arrange:
      let permissions = [ 'get stocks' ];
      let query = {};
      let payload = { permissions, query };

      // Act:
      let res = await helpers.request.get(`${API_BASE}/stocks`, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeArray().not.toBeEmpty();
      expect(res.body.data[0]).toBeObject().not.toBeEmpty();
    });
  });

  describe('Creating Stock', () => {
    it(`POST /stocks --> Invalid Rights`, async () => {
      // Arrange:
      let permissions = [ 'unknown' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.post(`${API_BASE}/stocks`, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`POST /stocks --> Invalid input`, async () => {
      // Arrange:
      let permissions = [ 'create stock' ];
      let data = { unknownProperty: 'mm' };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.post(`${API_BASE}/stocks`, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`POST /stocks --> There is an stock with the same name`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/stocks/stocks-service', () => () => ({
          createStock: helpers.serviceUniqueError
        }));
      } else {
        await db.models.Category.create(DATA.category);
        await db.models.Material.create(DATA.material);
        await db.models.Stock.create(DATA.stock);
      }

      // Arrange:
      let permissions = [ 'create stock' ];
      let data = DATA.stock;
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.post(`${API_BASE}/stocks`, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`POST /stocks --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/stocks/stocks-service', () => () => ({
          createStock: async values => values
        }));
      } else {
        await db.models.Category.create(DATA.category);
        await db.models.Material.create(DATA.material);
      }

      // Arrange:
      let permissions = [ 'create stock' ];
      let data = DATA.stock;
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.post(`${API_BASE}/stocks`, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 201 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
    });
  });

  describe('Retrieving Stock', () => {
    it(`GET /stocks/:stock --> Invalid Rights`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/stocks/${DATA.stock.id}`;
      let permissions = [ 'unknown privilege' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`GET /stocks/:stock --> Invalid input`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/stocks/kdjsnkjnfksjndkfjnmm`;
      let permissions = [ 'get stock' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`GET /stocks/:stock --> Not found`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/stocks/stocks-service', () => () => ({
          getStock: helpers.serviceNotFoundError
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/stocks/${DATA.stock.id}`;
      let permissions = [ 'get stock' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /stocks/:stock --> Successfully`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/stocks/stocks-service', () => () => ({
          getStock: async ({ stock_id, options }) => DATA.stock
        }));
      } else {
        await db.models.Category.create(DATA.category);
        await db.models.Material.create(DATA.material);
        await db.models.Stock.create(DATA.stock);
      }

      // Arrange:
      let endpoint = `${API_BASE}/stocks/${DATA.stock.id}`;
      let permissions = [ 'get stock' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.id).toEqual(DATA.stock.id);
    });
  });

  describe('Updating Stock', () => {
    it(`PATCH /stocks/:stock --> Invalid Rights`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/stocks/${DATA.stock.id}`;
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
    it(`PATCH /stocks/:stock --> Invalid input`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/stocks/${DATA.stock.id}`;
      let permissions = [ 'update stock' ];
      let data = { namemmm: 'New name updated' };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`PATCH /stocks/:stock --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/stocks/stocks-service', () => () => ({
          updateStock: helpers.serviceNotFoundError
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/stocks/${DATA.stock.id}`;
      let permissions = [ 'update stock' ];
      let data = { extra: { enabled: true } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`PATCH /stocks/:stock --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/stocks/stocks-service', () => () => ({
          updateStock: async ({ stock_id, values, options }) => values
        }));
      } else {
        await db.models.Category.create(DATA.category);
        await db.models.Material.create(DATA.material);
        await db.models.Stock.create(DATA.stock);
      }

      // Arrange:
      let endpoint = `${API_BASE}/stocks/${DATA.stock.id}`;
      let permissions = [ 'update stock' ];
      let data = { extra: { enabled: true } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data.extra).toEqual({ enabled: true });
    });
  });

  describe('Deleting Stock', () => {
    it(`DELETE /stocks/:stock --> Invalid Rights`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/stocks/${DATA.stock.id}`;
      let permissions = [ 'unknown' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`DELETE /stocks/:stock --> Invalid input`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/stocks/sjdbjhsbdjhfbsdjhfbjsdhfb`;
      let permissions = [ 'delete stock' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`DELETE /stocks/:stock --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/stocks/stocks-service', () => () => ({
          deleteStock: helpers.serviceNotFoundError
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/stocks/${DATA.stock.id}`;
      let permissions = [ 'delete stock' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`DELETE /stocks/:stock --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/stocks/stocks-service', () => () => ({
          deleteStock: async ({ stock_id, options }) => ({
            id: stock_id,
            updated_at: new Date('2019-10-10'),
            deleted_at: new Date('2019-10-10')
          })
        }));
      } else {
        await db.models.Category.create(DATA.category);
        await db.models.Material.create(DATA.material);
        await db.models.Stock.create(DATA.stock);
      }

      // Arrange:
      let endpoint = `${API_BASE}/stocks/${DATA.stock.id}`;
      let permissions = [ 'delete stock' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data.id).toEqual(DATA.stock.id);
      expect(res.body.data.deleted_at).not.toBe(null);
    });
  });
});
