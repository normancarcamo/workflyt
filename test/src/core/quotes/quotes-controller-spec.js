const db = require('src/providers/postgres');
const DATA = require('test/config/models');
const helpers = require('test/config/helpers')(db);
const API_BASE = '/v1';

describe('Quotes - Controller', () => {
  beforeEach(helpers.destroyData);
  afterEach(helpers.restoreMocks);
  afterAll(helpers.closeConnections);

  describe('Retrieving Quotes', () => {
    it('GET /quotes --> Invalid Rights', async () => {
      // Arrange:
      let permissions = [ 'unknow' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(`${API_BASE}/quotes`, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it('GET /quotes --> Invalid input', async () => {
      // Arrange:
      let permissions = [ 'get quotes' ];
      let query = { unknown: 'dm' };
      let payload = { permissions, query };

      // Act:
      let res = await helpers.request.get(`${API_BASE}/quotes`, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it('GET /quotes --> Successfully', async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/quotes/quotes-service', () => () => ({
          getQuotes: async options => [ DATA.quote ]
        }));
      } else {
        await db.models.Area.create(DATA.area);
        await db.models.Service.create(DATA.service);
        await db.models.Client.create(DATA.client);
        await db.models.Worker.create(DATA.salesman);
        await db.models.Quote.create(DATA.quote);
      }

      // Arrange:
      let permissions = [ 'get quotes' ];
      let query = {};
      let payload = { permissions, query };

      // Act:
      let res = await helpers.request.get(`${API_BASE}/quotes`, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeArray().not.toBeEmpty();
      expect(res.body.data[0]).toBeObject().not.toBeEmpty();
    });
  });

  describe('Creating Quote', () => {
    it(`POST /quotes --> Invalid Rights`, async () => {
      // Arrange:
      let permissions = [ 'unknown' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.post(`${API_BASE}/quotes`, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`POST /quotes --> Invalid input`, async () => {
      // Arrange:
      let permissions = [ 'create quote' ];
      let data = { unknownProperty: 'mm' };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.post(`${API_BASE}/quotes`, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`POST /quotes --> There is an quote with the same name`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/quotes/quotes-service', () => () => ({
          createQuote: helpers.serviceUniqueError
        }));
      } else {
        await db.models.Area.create(DATA.area);
        await db.models.Service.create(DATA.service);
        await db.models.Client.create(DATA.client);
        await db.models.Worker.create(DATA.salesman);
        await db.models.Quote.create(DATA.quote);
      }

      // Arrange:
      let permissions = [ 'create quote' ];
      let data = DATA.quote;
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.post(`${API_BASE}/quotes`, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`POST /quotes --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/quotes/quotes-service', () => () => ({
          createQuote: async values => values
        }));
      } else {
        await db.models.Area.create(DATA.area);
        await db.models.Service.create(DATA.service);
        await db.models.Client.create(DATA.client);
        await db.models.Worker.create(DATA.salesman);
      }

      // Arrange:
      let permissions = [ 'create quote' ];
      let data = DATA.quote;
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.post(`${API_BASE}/quotes`, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 201 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
    });
  });

  describe('Retrieving Quote', () => {
    it(`GET /quotes/:quote --> Invalid Rights`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/quotes/${DATA.quote.id}`;
      let permissions = [ 'unknown privilege' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`GET /quotes/:quote --> Invalid input`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/quotes/kdjsnkjnfksjndkfjnmm`;
      let permissions = [ 'get quote' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`GET /quotes/:quote --> Not found`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/quotes/quotes-service', () => () => ({
          getQuote: helpers.serviceNotFoundError
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/quotes/${DATA.quote.id}`;
      let permissions = [ 'get quote' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /quotes/:quote --> Successfully`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/quotes/quotes-service', () => () => ({
          getQuote: async ({ quote_id, options }) => DATA.quote
        }));
      } else {
        await db.models.Area.create(DATA.area);
        await db.models.Service.create(DATA.service);
        await db.models.Client.create(DATA.client);
        await db.models.Worker.create(DATA.salesman);
        await db.models.Quote.create(DATA.quote);
      }

      // Arrange:
      let endpoint = `${API_BASE}/quotes/${DATA.quote.id}`;
      let permissions = [ 'get quote' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.id).toEqual(DATA.quote.id);
    });
  });

  describe('Updating Quote', () => {
    it(`PATCH /quotes/:quote --> Invalid Rights`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/quotes/${DATA.quote.id}`;
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
    it(`PATCH /quotes/:quote --> Invalid input`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/quotes/${DATA.quote.id}`;
      let permissions = [ 'update quote' ];
      let data = { namemmm: 'New name updated' };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`PATCH /quotes/:quote --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/quotes/quotes-service', () => () => ({
          updateQuote: helpers.serviceNotFoundError
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/quotes/${DATA.quote.id}`;
      let permissions = [ 'update quote' ];
      let data = { extra: { enabled: true } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`PATCH /quotes/:quote --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/quotes/quotes-service', () => () => ({
          updateQuote: async ({ quote_id, values, options }) => values
        }));
      } else {
        await db.models.Area.create(DATA.area);
        await db.models.Service.create(DATA.service);
        await db.models.Client.create(DATA.client);
        await db.models.Worker.create(DATA.salesman);
        await db.models.Quote.create(DATA.quote);
      }

      // Arrange:
      let endpoint = `${API_BASE}/quotes/${DATA.quote.id}`;
      let permissions = [ 'update quote' ];
      let data = { extra: { enabled: true } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data.extra).toEqual({ enabled: true });
    });
  });

  describe('Deleting Quote', () => {
    it(`DELETE /quotes/:quote --> Invalid Rights`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/quotes/${DATA.quote.id}`;
      let permissions = [ 'unknown' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`DELETE /quotes/:quote --> Invalid input`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/quotes/sjdbjhsbdjhfbsdjhfbjsdhfb`;
      let permissions = [ 'delete quote' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`DELETE /quotes/:quote --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/quotes/quotes-service', () => () => ({
          deleteQuote: helpers.serviceNotFoundError
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/quotes/${DATA.quote.id}`;
      let permissions = [ 'delete quote' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`DELETE /quotes/:quote --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/quotes/quotes-service', () => () => ({
          deleteQuote: async ({ quote_id, options }) => ({
            id: quote_id,
            updated_at: new Date('2019-10-10'),
            deleted_at: new Date('2019-10-10')
          })
        }));
      } else {
        await db.models.Area.create(DATA.area);
        await db.models.Service.create(DATA.service);
        await db.models.Client.create(DATA.client);
        await db.models.Worker.create(DATA.salesman);
        await db.models.Quote.create(DATA.quote);
      }

      // Arrange:
      let endpoint = `${API_BASE}/quotes/${DATA.quote.id}`;
      let permissions = [ 'delete quote' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data.id).toEqual(DATA.quote.id);
      expect(res.body.data.deleted_at).not.toBe(null);
    });
  });

  describe('Retrieving Services', () => {
    it(`GET /quotes/:quote/services --> Invalid rights`, async () => {
      // Arrange:
      let quote_id = DATA.quote.id;
      let endpoint = `${API_BASE}/quotes/${quote_id}/services`;
      let permissions = [ 'unknown' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`GET /quotes/:quote/services --> Invalid input`, async () => {
      // Arrange:
      let quote_id = DATA.quote.id;
      let endpoint = `${API_BASE}/quotes/${quote_id}/services`;
      let permissions = [ 'get services from quote' ];
      let query = { attributes: [ 'nanana' ] };
      let payload = { permissions, query };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`GET /quotes/:quote/services --> Failed - exception`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/quotes/quotes-service', () => () => ({
          getServices: helpers.serviceNotFoundError
        }));
      }

      // Arrange:
      let quote_id = DATA.quote.id;
      let endpoint = `${API_BASE}/quotes/${quote_id}/services`;
      let permissions = [ 'get services from quote' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /quotes/:quote/services --> Successfully`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/quotes/quotes-service', () => () => ({
          getServices: async ({ quote_id, options }) => [{
            ...DATA.service,
            QuoteService: DATA.quote
          }]
        }));
      } else {
        await db.models.Area.create(DATA.area);
        await db.models.Client.create(DATA.client);
        await db.models.Worker.create(DATA.salesman);
        let service = await db.models.Service.create(DATA.service);
        let quote = await db.models.Quote.create(DATA.quote);
        await quote.addService(service);
      }

      // Arrange:
      let endpoint = `${API_BASE}/quotes/${DATA.quote.id}/services`;
      let permissions = [ 'get services from quote' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeArray().not.toBeEmpty();
    });
  });

  describe('Adding services', () => {
    it(`PUT /quotes/:quote/services --> Invalid rights`, async () => {
      // Arrange:
      let quote_id = DATA.quote.id;
      let endpoint = `${API_BASE}/quotes/${quote_id}/services`;
      let permissions = [ 'unknown' ];
      let data = { services: [] };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.put(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`PUT /quotes/:quote/services --> Invalid input`, async () => {
      // Arrange:
      let quote_id = DATA.quote.id;
      let endpoint = `${API_BASE}/quotes/${quote_id}/services`;
      let permissions = [ 'add services to quote' ];
      let data = { services: [ 'welkdnfksnksjdnf' ] };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.put(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`PUT /quotes/:quote/services --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/quotes/quotes-service', () => () => ({
          addServices: helpers.serviceNotFoundError
        }));
      }

      // Arrange:
      let quote_id = DATA.quote.id;
      let service_id = DATA.service.id;
      let endpoint = `${API_BASE}/quotes/${quote_id}/services`;
      let permissions = [ 'add services to quote' ];
      let data = { services: [ service_id ] };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.put(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`PUT /quotes/:quote/services --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/quotes/quotes-service', () => () => ({
          addServices: async ({ quote_id, services }) => [
            DATA.quoteService
          ]
        }));
      } else {
        await db.models.Area.create(DATA.area);
        await db.models.Service.create(DATA.service);
        await db.models.Client.create(DATA.client);
        await db.models.Worker.create(DATA.salesman);
        await db.models.Quote.create(DATA.quote);
      }

      // Arrange:
      let endpoint = `${API_BASE}/quotes/${DATA.quote.id}/services`;
      let permissions = [ 'add services to quote' ];
      let data = { services: [ DATA.service.id ] };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.put(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 201 });
      expect(res.body.data).toBeArray().not.toBeEmpty();
      expect(res.body.data[0].quote_id).toEqual(DATA.quote.id);
      expect(res.body.data[0].service_id).toEqual(DATA.service.id);
    });
  });

  describe('Retrieve service', () => {
    it(`GET /quotes/:quote/services/:service --> Invalid rights`, async () => {
      // Arrange:
      let quote_id = DATA.quote.id;
      let service_id = DATA.service.id;
      let endpoint = `${API_BASE}/quotes/${quote_id}/services/${service_id}`;
      let permissions = [ 'unknown' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`GET /quotes/:quote/services/:service --> Invalid input`, async () => {
      // Arrange:
      let quote_id = DATA.quote.id;
      let service_id = DATA.service.id;
      let endpoint = `${API_BASE}/quotes/${quote_id}/services/${service_id}`;
      let permissions = [ 'get service from quote' ];
      let query = { attributes: [ 'skmksms' ] };
      let payload = { permissions, query };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`GET /quotes/:quote/services/:service --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/quotes/quotes-service', () => () => ({
          getService: helpers.serviceNotFoundError
        }));
      }

      // Arrange:
      let quote_id = DATA.quote.id;
      let service_id = DATA.service.id;
      let endpoint = `${API_BASE}/quotes/${quote_id}/services/${service_id}`;
      let permissions = [ 'get service from quote' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /quotes/:quote/services/:service --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/quotes/quotes-service', () => () => ({
          getService: async ({ quote_id, service_id, options }) => ({
            ...DATA.service,
            QuoteService: DATA.quoteService
          })
        }));
      } else {
        await db.models.Area.create(DATA.area);
        await db.models.Client.create(DATA.client);
        await db.models.Worker.create(DATA.salesman);
        let service = await db.models.Service.create(DATA.service);
        let quote = await db.models.Quote.create(DATA.quote);
        await quote.addService(service);
      }

      // Arrange:
      let quote_id = DATA.quote.id;
      let service_id = DATA.service.id;
      let endpoint = `${API_BASE}/quotes/${quote_id}/services/${service_id}`;
      let permissions = [ 'get service from quote' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.id).toEqual(service_id);
    });
  });

  describe('Updating service', () => {
    it(`PATCH /quotes/:quote/services/:service --> Invalid rights`, async () => {
      // Arrange:
      let quote_id = DATA.quote.id;
      let service_id = DATA.service.id;
      let endpoint = `${API_BASE}/quotes/${quote_id}/services/${service_id}`;
      let permissions = [ 'jdsnkjnsfkj' ];
      let data = { extra: { enabled: true } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`PATCH /quotes/:quote/services/:service --> Invalid input`, async () => {
      // Arrange:
      let quote_id = DATA.quote.id;
      let service_id = DATA.service.id;
      let endpoint = `${API_BASE}/quotes/${quote_id}/services/${service_id}`;
      let permissions = [ 'update service from quote' ];
      let data = { unknownProperty: { units: 20 } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`PATCH /quotes/:quote/services/:service --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/quotes/quotes-service', () => () => ({
          updateService: helpers.serviceNotFoundError
        }));
      }

      // Arrange:
      let quote_id = DATA.quote.id;
      let service_id = DATA.service.id;
      let endpoint = `${API_BASE}/quotes/${quote_id}/services/${service_id}`;
      let permissions = [ 'update service from quote' ];
      let data = { extra: { enabled: true } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`PATCH /quotes/:quote/services/:service --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/quotes/quotes-service', () => () => ({
          updateService: async ({ quote_id, service_id, values, options }) => ({
            quote_id: quote_id,
            service_id: service_id,
            ...values
          })
        }));
      } else {
        await db.models.Area.create(DATA.area);
        await db.models.Client.create(DATA.client);
        await db.models.Worker.create(DATA.salesman);
        let service = await db.models.Service.create(DATA.service);
        let quote = await db.models.Quote.create(DATA.quote);
        await quote.addService(service);
      }

      // Arrange:
      let quote_id = DATA.quote.id;
      let service_id = DATA.service.id;
      let endpoint = `${API_BASE}/quotes/${quote_id}/services/${service_id}`;
      let permissions = [ 'update service from quote' ];
      let data = { extra: { enabled: true } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.extra).toEqual({ enabled: true });
    });
  });

  describe('Deleting service', () => {
    it(`DELETE /quotes/:quote/services/:service --> Invalid rights`, async () => {
      // Arrange:
      let quote_id = DATA.quote.id;
      let service_id = DATA.service.id;
      let endpoint = `${API_BASE}/quotes/${quote_id}/services/${service_id}`;
      let permissions = [ 'jdbjhdbdfjhb' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`DELETE /quotes/:quote/services/:service --> Invalid input`, async () => {
      // Arrange:
      let quote_id = DATA.quote.id;
      let service_id = DATA.service.id;
      let endpoint = `${API_BASE}/quotes/${quote_id}/services/${service_id}`;
      let permissions = [ 'delete service from quote' ];
      let query = { force: 'sdkjnskjnfksdjnf' };
      let payload = { permissions, query };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`DELETE /quotes/:quote/services/:service --> Failed - exception`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/quotes/quotes-service', () => () => ({
          deleteService: helpers.serviceNotFoundError
        }));
      } else {
        await db.models.Area.create(DATA.area);
        await db.models.Service.create(DATA.service);
        await db.models.Client.create(DATA.client);
        await db.models.Worker.create(DATA.salesman);
        await db.models.Quote.create(DATA.quote);
      }

      // Arrange:
      let quote_id = DATA.quote.id;
      let service_id = DATA.service.id;
      let endpoint = `${API_BASE}/quotes/${quote_id}/services/${service_id}`;
      let permissions = [ 'delete service from quote' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`DELETE /quotes/:quote/services/:service --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/quotes/quotes-service', () => () => ({
          deleteService: async ({ quote_id, service_id, options }) => ({
            quote_id: quote_id,
            service_id: service_id,
            deleted_at: new Date()
          })
        }));
      } else {
        await db.models.Area.create(DATA.area);
        await db.models.Client.create(DATA.client);
        await db.models.Worker.create(DATA.salesman);
        let quote = await db.models.Quote.create(DATA.quote);
        let service = await db.models.Service.create(DATA.service);
        await quote.addService(service);
      }

      // Arrange:
      let quote_id = DATA.quote.id;
      let service_id = DATA.service.id;
      let endpoint = `${API_BASE}/quotes/${quote_id}/services/${service_id}`;
      let permissions = [ 'delete service from quote' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.quote_id).toEqual(quote_id);
      expect(res.body.data.service_id).toEqual(service_id);
      expect(res.body.data.deleted_at).not.toBe(null);
    });
  });

  describe('Retrieving Orders', () => {
    it(`GET /quotes/:quote/orders --> Invalid rights`, async () => {
      // Arrange:
      let quote_id = DATA.quote.id;
      let endpoint = `${API_BASE}/quotes/${quote_id}/orders`;
      let permissions = [ 'unknown' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`GET /quotes/:quote/orders --> Invalid input`, async () => {
      // Arrange:
      let quote_id = DATA.quote.id;
      let endpoint = `${API_BASE}/quotes/${quote_id}/orders`;
      let permissions = [ 'get orders from quote' ];
      let query = { attributes: [ 'nanana' ] };
      let payload = { permissions, query };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`GET /quotes/:quote/orders --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/quotes/quotes-service', () => () => ({
          getOrders: helpers.serviceNotFoundError
        }));
      }

      // Arrange:
      let quote_id = DATA.quote.id;
      let endpoint = `${API_BASE}/quotes/${quote_id}/orders`;
      let permissions = [ 'get orders from quote' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /quotes/:quote/orders --> Successfully`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/quotes/quotes-service', () => () => ({
          getOrders: async ({ quote_id, options }) => [ DATA.order ]
        }));
      } else {
        await db.models.Area.create(DATA.area);
        await db.models.Service.create(DATA.service);
        await db.models.Client.create(DATA.client);
        await db.models.Worker.create(DATA.salesman);
        let quote = await db.models.Quote.create(DATA.quote);
        let order = await db.models.Order.create(DATA.order);
        await quote.addOrder(order);
      }

      // Arrange:
      let endpoint = `${API_BASE}/quotes/${DATA.quote.id}/orders`;
      let permissions = [ 'get orders from quote' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeArray().not.toBeEmpty();
    });
  });

  describe('Retrieve order', () => {
    it(`GET /quotes/:quote/orders/:order --> Invalid rights`, async () => {
      // Arrange:
      let quote_id = DATA.quote.id;
      let order_id = DATA.order.id;
      let endpoint = `${API_BASE}/quotes/${quote_id}/orders/${order_id}`;
      let permissions = [ 'unknown' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`GET /quotes/:quote/orders/:order --> Invalid input`, async () => {
      // Arrange:
      let quote_id = DATA.quote.id;
      let order_id = DATA.order.id;
      let endpoint = `${API_BASE}/quotes/${quote_id}/orders/${order_id}`;
      let permissions = [ 'get order from quote' ];
      let query = { attributes: [ 'skmksms' ] };
      let payload = { permissions, query };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`GET /quotes/:quote/orders/:order --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/quotes/quotes-service', () => () => ({
          getOrder: helpers.serviceNotFoundError
        }));
      } else {
        await db.models.Area.create(DATA.area);
        await db.models.Service.create(DATA.service);
        await db.models.Client.create(DATA.client);
        await db.models.Worker.create(DATA.salesman);
        await db.models.Quote.create(DATA.quote);
      }

      // Arrange:
      let quote_id = DATA.quote.id;
      let order_id = DATA.order.id;
      let endpoint = `${API_BASE}/quotes/${quote_id}/orders/${order_id}`;
      let permissions = [ 'get order from quote' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /quotes/:quote/orders/:order --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/quotes/quotes-service', () => () => ({
          getOrder: async ({ quote_id, order_id, options }) => DATA.order
        }));
      } else {
        await db.models.Area.create(DATA.area);
        await db.models.Service.create(DATA.service);
        await db.models.Client.create(DATA.client);
        await db.models.Worker.create(DATA.salesman);
        let quote = await db.models.Quote.create(DATA.quote);
        let order = await db.models.Order.create(DATA.order);
        await quote.addOrder(order);
      }

      // Arrange:
      let quote_id = DATA.quote.id;
      let order_id = DATA.order.id;
      let endpoint = `${API_BASE}/quotes/${quote_id}/orders/${order_id}`;
      let permissions = [ 'get order from quote' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.id).toEqual(order_id);
    });
  });
});
