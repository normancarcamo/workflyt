import '../../../config/global';
import db from '../../../../src/providers/postgres';
import * as DATA from '../../../config/models';
import Helpers from '../../../config/helpers';

describe('Clients - Controller', () => {
  const API_BASE = '/v1';
  const helpers = Helpers(db);

  beforeEach(helpers.destroyData);
  afterEach(helpers.restoreMocks);
  afterAll(helpers.closeConnections);

  describe('Retrieving Clients', () => {
    it('GET /clients --> Successfully', async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/clients/clients-service', () => ({
          ClientService: () => ({
            getClients: async () => [ DATA.client ]
          })
        }));
      } else {
        await db.models.Client.create(DATA.client);
      }

      // Arrange:
      let permissions = [ 'get clients' ];
      let query = {};
      let payload = { permissions, query };

      // Act:
      let res = await helpers.request.get(`${API_BASE}/clients`, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeArray().not.toBeEmpty();
      expect(res.body.data[0]).toBeObject().not.toBeEmpty();
    });
  });

  describe('Creating Client', () => {
    it(`POST /clients --> There is an client with the same name`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/clients/clients-service', () => ({
          ClientService: () => ({
            createClient: helpers.serviceUniqueError
          })
        }));
      } else {
        await db.models.Client.create(DATA.client);
      }

      // Arrange:
      let permissions = [ 'create client' ];
      let data = DATA.client;
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.post(`${API_BASE}/clients`, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`POST /clients --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/clients/clients-service', () => ({
          ClientService: () => ({
            createClient: async (values:object) => values
          })
        }));
      }

      // Arrange:
      let permissions = [ 'create client' ];
      let data = DATA.client;
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.post(`${API_BASE}/clients`, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 201 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
    });
  });

  describe('Retrieving Client', () => {
    it(`GET /clients/:client --> Not found`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/clients/clients-service', () => ({
          ClientService: () => ({
            getClient: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/clients/${DATA.client.id}`;
      let permissions = [ 'get client' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /clients/:client --> Successfully`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/clients/clients-service', () => ({
          ClientService: () => ({
            getClient: async (client_id:string, options?:object) => DATA.client
          })
        }));
      } else {
        await db.models.Client.create(DATA.client);
      }

      // Arrange:
      let endpoint = `${API_BASE}/clients/${DATA.client.id}`;
      let permissions = [ 'get client' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.id).toEqual(DATA.client.id);
    });
  });

  describe('Updating Client', () => {
    it(`PATCH /clients/:client --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/clients/clients-service', () => ({
          ClientService: () => ({
            updateClient: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/clients/${DATA.client.id}`;
      let permissions = [ 'update client' ];
      let data = { extra: { enabled: true } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`PATCH /clients/:client --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/clients/clients-service', () => ({
          ClientService: () => ({
            updateClient: async (client_id:string, values:object, options?:object) => values
          })
        }));
      } else {
        await db.models.Client.create(DATA.client);
      }

      // Arrange:
      let endpoint = `${API_BASE}/clients/${DATA.client.id}`;
      let permissions = [ 'update client' ];
      let data = { extra: { enabled: true } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data.extra).toEqual({ enabled: true });
    });
  });

  describe('Deleting Client', () => {
    it(`DELETE /clients/:client --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/clients/clients-service', () => ({
          ClientService: () => ({
            deleteClient: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/clients/${DATA.client.id}`;
      let permissions = [ 'delete client' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`DELETE /clients/:client --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/clients/clients-service', () => ({
          ClientService: () => ({
            deleteClient: async (client_id:string, options?:object) => ({
              id: client_id,
              updated_at: new Date('2019-10-10'),
              deleted_at: new Date('2019-10-10')
            })
          })
        }));
      } else {
        await db.models.Client.create(DATA.client);
      }

      // Arrange:
      let endpoint = `${API_BASE}/clients/${DATA.client.id}`;
      let permissions = [ 'delete client' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data.id).toEqual(DATA.client.id);
      expect(res.body.data.deleted_at).not.toBe(null);
    });
  });

  describe('Retrieving Quotes', () => {
    it(`GET /clients/:client/quotes --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/clients/clients-service', () => ({
          ClientService: () => ({
            getQuotes: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let client_id = DATA.client.id;
      let endpoint = `${API_BASE}/clients/${client_id}/quotes`;
      let permissions = [ 'get quotes from client' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /clients/:client/quotes --> Successfully`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/clients/clients-service', () => ({
          ClientService: () => ({
            getQuotes: async (client_id:string, options?:object) => [ DATA.quote ]
          })
        }));
      } else {
        let client = await db.models.Client.create(DATA.client);
        let salesman = await db.models.Worker.create(DATA.salesman);
        let quote = await db.models.Quote.create(DATA.quote);
        await client.addQuote(quote);
      }

      // Arrange:
      let endpoint = `${API_BASE}/clients/${DATA.client.id}/quotes`;
      let permissions = [ 'get quotes from client' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeArray().not.toBeEmpty();
    });
  });

  describe('Retrieve quote', () => {
    it(`GET /clients/:client/quotes/:quote --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/clients/clients-service', () => ({
          ClientService: () => ({
            getQuote: helpers.serviceNotFoundError
          })
        }));
      } else {
        await db.models.Client.create(DATA.client);
      }

      // Arrange:
      let client_id = DATA.client.id;
      let quote_id = DATA.quote.id;
      let endpoint = `${API_BASE}/clients/${client_id}/quotes/${quote_id}`;
      let permissions = [ 'get quote from client' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /clients/:client/quotes/:quote --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/clients/clients-service', () => ({
          ClientService: () => ({
            getQuote: async (client_id:string, quote_id:string, options?:object) => DATA.quote
          })
        }));
      } else {
        let client = await db.models.Client.create(DATA.client);
        let salesman = await db.models.Worker.create(DATA.salesman);
        let quote = await db.models.Quote.create(DATA.quote);
        await client.addQuote(quote);
      }

      // Arrange:
      let client_id = DATA.client.id;
      let quote_id = DATA.quote.id;
      let endpoint = `${API_BASE}/clients/${client_id}/quotes/${quote_id}`;
      let permissions = [ 'get quote from client' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.id).toEqual(quote_id);
    });
  });
});
