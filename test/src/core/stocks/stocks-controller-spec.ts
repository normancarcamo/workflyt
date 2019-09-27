import '../../../config/global';
import db from '../../../../src/providers/postgres';
import * as DATA from '../../../config/models';
import Helpers from '../../../config/helpers';

describe('Stocks - Controller', () => {
  const API_BASE = '/v1';
  const helpers = Helpers(db);

  beforeEach(helpers.destroyData);
  afterEach(helpers.restoreMocks);
  afterAll(helpers.closeConnections);

  describe('Retrieving Stocks', () => {
    it('GET /stocks --> Successfully', async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/stocks/stocks-service', () => ({
          StockService: () => ({
            getStocks: async (options?:object) => [ DATA.stock ]
          })
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
    it(`POST /stocks --> There is an stock with the same name`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/stocks/stocks-service', () => ({
          StockService: () => ({
            createStock: helpers.serviceUniqueError
          })
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
        jest.doMock('src/core/stocks/stocks-service', () => ({
          StockService: () => ({
            createStock: async (values:object) => values
          })
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
    it(`GET /stocks/:stock --> Not found`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/stocks/stocks-service', () => ({
          StockService: () => ({
            getStock: helpers.serviceNotFoundError
          })
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
        jest.doMock('src/core/stocks/stocks-service', () => ({
          StockService: () => ({
            getStock: async (stock_id:string, options?:object) => DATA.stock
          })
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
    it(`PATCH /stocks/:stock --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/stocks/stocks-service', () => ({
          StockService: () => ({
            updateStock: helpers.serviceNotFoundError
          })
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
        jest.doMock('src/core/stocks/stocks-service', () => ({
          StockService: () => ({
            updateStock: async (stock_id:string, values:object, options?:object) => values
          })
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
    it(`DELETE /stocks/:stock --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/stocks/stocks-service', () => ({
          StockService: () => ({
            deleteStock: helpers.serviceNotFoundError
          })
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
        jest.doMock('src/core/stocks/stocks-service', () => ({
          StockService: () => ({
            deleteStock: async (stock_id:string, options?:object) => ({
              id: stock_id,
              updated_at: new Date('2019-10-10'),
              deleted_at: new Date('2019-10-10')
            })
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
