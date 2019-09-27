import '../../../config/global';
import db from '../../../../src/providers/postgres';
import * as DATA from '../../../config/models';
import Helpers from '../../../config/helpers';

describe('Quotes - Controller', () => {
  const API_BASE = '/v1';
  const helpers = Helpers(db);

  beforeEach(helpers.destroyData);
  afterEach(helpers.restoreMocks);
  afterAll(helpers.closeConnections);

  describe('Retrieving Quotes', () => {
    it('GET /quotes --> Successfully', async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/quotes/quotes-service', () => ({
          QuoteService: () => ({
            getQuotes: async (options?:object) => [ DATA.quote ]
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
    it(`POST /quotes --> There is an quote with the same name`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/quotes/quotes-service', () => ({
          QuoteService: () => ({
            createQuote: helpers.serviceUniqueError
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
        jest.doMock('src/core/quotes/quotes-service', () => ({
          QuoteService: () => ({
            createQuote: async (values:object) => values
          })
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
    it(`GET /quotes/:quote --> Not found`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/quotes/quotes-service', () => ({
          QuoteService: () => ({
            getQuote: helpers.serviceNotFoundError
          })
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
        jest.doMock('src/core/quotes/quotes-service', () => ({
          QuoteService: () => ({
            getQuote: async (quote_id:string, options?:object) => DATA.quote
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
    it(`PATCH /quotes/:quote --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/quotes/quotes-service', () => ({
          QuoteService: () => ({
            updateQuote: helpers.serviceNotFoundError
          })
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
        jest.doMock('src/core/quotes/quotes-service', () => ({
          QuoteService: () => ({
            updateQuote: async (quote_id:string, values:object, options?:object) => values
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
    it(`DELETE /quotes/:quote --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/quotes/quotes-service', () => ({
          QuoteService: () => ({
            deleteQuote: helpers.serviceNotFoundError
          })
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
        jest.doMock('src/core/quotes/quotes-service', () => ({
          QuoteService: () => ({
            deleteQuote: async (quote_id:string, options?:object) => ({
              id: quote_id,
              updated_at: new Date('2019-10-10'),
              deleted_at: new Date('2019-10-10')
            })
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
    it(`GET /quotes/:quote/services --> Failed - exception`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/quotes/quotes-service', () => ({
          QuoteService: () => ({
            getServices: helpers.serviceNotFoundError
          })
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
        jest.doMock('src/core/quotes/quotes-service', () => ({
          QuoteService: () => ({
            getServices: async (quote_id:string, options?:object) => [{
              ...DATA.service,
              QuoteService: DATA.quote
            }]
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
    it(`PUT /quotes/:quote/services --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/quotes/quotes-service', () => ({
          QuoteService: () => ({
            addServices: helpers.serviceNotFoundError
          })
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
        jest.doMock('src/core/quotes/quotes-service', () => ({
          QuoteService: () => ({
            addServices: async (quote_id:string, services:string[]) => [ DATA.quoteService ]
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
    it(`GET /quotes/:quote/services/:service --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/quotes/quotes-service', () => ({
          QuoteService: () => ({
            getService: helpers.serviceNotFoundError
          })
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
        jest.doMock('src/core/quotes/quotes-service', () => ({
          QuoteService: () => ({
            getService: async (quote_id:string, service_id:string, options?:object) => ({
              ...DATA.service,
              QuoteService: DATA.quoteService
            })
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
    it(`PATCH /quotes/:quote/services/:service --> Failed - exception`, async () => {
      // Arrange:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/quotes/quotes-service', () => ({
          QuoteService: () => ({
            updateService: helpers.serviceNotFoundError
          })
        }));
      }
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
      // Arrange:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/quotes/quotes-service', () => ({
          QuoteService: () => ({
            updateService: async (quote_id:string, service_id:string, values:object, options?:object) => ({
              quote_id: quote_id,
              service_id: service_id,
              ...values
            })
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
    it(`DELETE /quotes/:quote/services/:service --> Failed - exception`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/quotes/quotes-service', () => ({
          QuoteService: () => ({
            deleteService: helpers.serviceNotFoundError
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
        jest.doMock('src/core/quotes/quotes-service', () => ({
          QuoteService: () => ({
            deleteService: async (quote_id:string, service_id:string, options?:object) => ({
              quote_id: quote_id,
              service_id: service_id,
              deleted_at: new Date()
            })
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
    it(`GET /quotes/:quote/orders --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/quotes/quotes-service', () => ({
          QuoteService: () => ({
            getOrders: helpers.serviceNotFoundError
          })
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
        jest.doMock('src/core/quotes/quotes-service', () => ({
          QuoteService: () => ({
            getOrders: async (quote_id:string, options?:object) => [ DATA.order ]
          })
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
    it(`GET /quotes/:quote/orders/:order --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/quotes/quotes-service', () => ({
          QuoteService: () => ({
            getOrder: helpers.serviceNotFoundError
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
        jest.doMock('src/core/quotes/quotes-service', () => ({
          QuoteService: () => ({
            getOrder: async (quote_id:string, order_id:string, options?:object) => DATA.order
          })
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
