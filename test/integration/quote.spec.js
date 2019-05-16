import setup_factory from './index';
import db from 'src/db/models';
import { request } from 'test/utils';
import uuid from 'uuid/v4';

const IS_INTEGRATION_MOCK = JSON.parse(process.env.MOCK);
const ERROR_MOCK = new Error('error mocked.');
const API_BASE = '/api/v1/quotes';
const setup = setup_factory(db, IS_INTEGRATION_MOCK);
const { Quote } = db.sequelize.models;

describe("Quote Service:", () => {
  beforeAll(setup.before_all);
  beforeEach(setup.before_each);

  // --------------------------------------------------------------------------

  describe("get quotes:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - query is: {}`, async () => {
        // Given:
        let querystring = {};

        // When:
        let res = await request("get", API_BASE).query(querystring);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - query is: { search: {} }`, async () => {
        // Given:
        let querystring = { search: {} };

        // When:
        let res = await request("get", API_BASE).query(querystring);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - query is: undefined`, async () => {
        // Given:
        let querystring = { search: undefined };

        // When:
        let res = await request("get", API_BASE).query(querystring);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - query is: { search: { subject: 'ccccc' } }`, async () => {
        // Given:
        let querystring = { search: { subject: 'ccccc' } };

        // When:
        let res = await request("get", API_BASE).query(querystring);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - query is: { search: { subject: { like: '%vvvvv%' } } }`, async () => {
        // Given:
        let querystring = { search: { subject: { like: '%vvvvv%' } } };

        // When:
        let res = await request("get", API_BASE).query(querystring);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - query validation fail`, async () => {
        // Given:
        let querystring = { search: null };

        // When:
        let res = await request("get", API_BASE).query(querystring);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - action throw error`, async () => {
        // Mock:
        jest.spyOn(Quote, 'findAll').mockRejectedValue(ERROR_MOCK);

        // Given:
        let querystring = { search: { subject: 'bbbbb' } };

        // When:
        let res = await request("get", API_BASE).query(querystring);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe("create quote:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - values are valid`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Quote, 'create').mockResolvedValue(setup.instance.quotes[0]);
        }

        // Given:
        let values = {
          customer_id: setup.instance.customers[0].id,
          salesman_id: setup.instance.employees[0].id,
          subject: 'demo subject description'
        };

        // When:
        let res = await request("post", API_BASE).send({ values });

        // Then:
        expect(res.statusCode).toEqual(201);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - is created by a specific user`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Quote, 'create').mockResolvedValue(Quote.build({
            ...setup.instance.quotes[0].dataValues,
            created_by: setup.instance.users[0].id,
            updated_by: setup.instance.users[0].id,
          }));
        }

        // Given:
        let values = {
          customer_id: setup.instance.customers[0].id,
          salesman_id: setup.instance.employees[0].id,
          subject: 'demo subject description',
          created_by: setup.instance.users[0].id,
          updated_by: setup.instance.users[0].id,
        };

        // When:
        let res = await request("post", API_BASE).send({ values });

        // Then:
        expect(res.statusCode).toEqual(201);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
        expect(res.body.data.created_by).toEqual(setup.instance.users[0].id);
        expect(res.body.data.updated_by).toEqual(setup.instance.users[0].id);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - values are null`, async () => {
        // Given:
        let values = null;

        // When:
        let res = await request("post", API_BASE).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - value are not valid`, async () => {
        // Given:
        let values = {
          customer_id: setup.instance.customers[0].id,
          salesman_id: setup.instance.employees[0].id,
          subject: ''
        };

        // When:
        let res = await request("post", API_BASE).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - action throw error`, async () => {
        // Mock:
        jest.spyOn(Quote, 'create').mockRejectedValue(ERROR_MOCK);

        // Given:
        let values = {
          customer_id: setup.instance.customers[0].id,
          salesman_id: setup.instance.employees[0].id,
          subject: 'demo subject description'
        };

        // When:
        let res = await request("post", API_BASE).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe("get quote:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - quote is found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Quote, 'findByPk').mockResolvedValue(setup.instance.quotes[0]);
        }

        // Given:
        let quote_id = setup.instance.quotes[0].id;
        let options = {};

        // When:
        let res = await request("get", `${API_BASE}/${quote_id}`).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - quote id param is malformed`, async () => {
        // Given:
        let quote_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111dd';

        // When:
        let res = await request("get", `${API_BASE}/${quote_id}`);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - quote is not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Quote, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let quote_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';

        // When:
        let res = await request("get", `${API_BASE}/${quote_id}`);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - quote is trying to be found`, async () => {
        // Mock:
        jest.spyOn(Quote, 'findByPk').mockRejectedValue(ERROR_MOCK);

        // Given:
        let quote_id = setup.instance.quotes[0].id;
        let endpoint = `${API_BASE}/${quote_id}`;
        let options = {};

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe("update quote:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - values are valid`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Quote, 'findByPk').mockResolvedValue({
            update: async (values, options) => Quote.build({
              ...setup.instance.quotes[0].dataValues,
              ...values,
              updated_at: new Date().toISOString()
            })
          });
        }

        // Given:
        let quote_id = setup.instance.quotes[0].id;
        let values = { status: 'cancelled' };
        let endpoint = `${API_BASE}/${quote_id}`;

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - quote id param is malformed`, async () => {
        // Given:
        let quote_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let values = null;
        let endpoint = `${API_BASE}/${quote_id}`;

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - quote is not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Quote, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let quote_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
        let values = { status: 'cancelled' };
        let endpoint = `${API_BASE}/${quote_id}`;

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - quote was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Quote, 'findByPk').mockRejectedValue(ERROR_MOCK);

        // Given:
        let quote_id = setup.instance.quotes[0].id;
        let values = { status: 'cancelled' };
        let endpoint = `${API_BASE}/${quote_id}`;

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - quote was trying to be updated`, async () => {
        // Mock:
        jest.spyOn(Quote, 'findByPk').mockResolvedValue({
          update: async (payload, options) => {
            throw ERROR_MOCK;
          }
        });

        // Given:
        let quote_id = setup.instance.quotes[0].id;
        let values = { status: 'cancelled' };
        let endpoint = `${API_BASE}/${quote_id}`;

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe("delete quote:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - quote is deleted without options`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Quote, 'findByPk').mockResolvedValue({
            destroy: async (options) => {
              let quote = setup.instance.quotes[0];
              quote.deleted_at = new Date().toISOString();
              return quote;
            }
          });
        }

        // Given:
        let quote_id = setup.instance.quotes[0].id;
        let endpoint = `${API_BASE}/${quote_id}`;
        let options = {}

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - quote is deleted with the force option as true`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Quote, 'findByPk').mockResolvedValue({
            destroy: async (options) => {
              let quote = setup.instance.quotes[0];
              quote.deleted_at = new Date().toISOString();
              return quote;
            }
          });
        }

        // Given:
        let quote_id = setup.instance.quotes[0].id;
        let endpoint = `${API_BASE}/${quote_id}`;
        let options = { force: true }

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - quote is deleted with the force option as false`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Quote, 'findByPk').mockResolvedValue({
            destroy: async (options) => {
              let quote = setup.instance.quotes[0];
              quote.deleted_at = new Date().toISOString();
              return quote;
            }
          });
        }

        // Given:
        let quote_id = setup.instance.quotes[0].id;
        let endpoint = `${API_BASE}/${quote_id}`;
        let options = { force: false }

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - quote id param is malformed`, async () => {
        // Given:
        let quote_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let endpoint = `${API_BASE}/${quote_id}`;
        let options = {}

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - quote is not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Quote, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let quote_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
        let endpoint = `${API_BASE}/${quote_id}`;
        let options = {}

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - quote was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Quote, 'findByPk').mockRejectedValue(ERROR_MOCK);

        // Given:
        let quote_id = setup.instance.quotes[0].id;
        let endpoint = `${API_BASE}/${quote_id}`;
        let options = {}

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - quote was trying to be deleted`, async () => {
        // Mock:
        jest.spyOn(Quote, 'findByPk').mockResolvedValue({
          destroy: async (options) => {
            throw ERROR_MOCK;
          }
        });

        // Given:
        let quote_id = setup.instance.quotes[0].id;
        let endpoint = `${API_BASE}/${quote_id}`;
        let options = {}

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  // --------------------------------------------------------------------------

  describe('get items', () => {
    describe('should return data when:', () => {
      it(`${uuid()} - query is: empty`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Quote, 'findByPk').mockResolvedValue({
            getItems: async payload => setup.instance.items
          });
        }

        // Given:
        let quote_id = setup.instance.quotes[0].id;
        let endpoint = `${API_BASE}/${quote_id}/items`;
        let options = {};

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBe(null);
      });
      it(`${uuid()} - query is: name=dknd`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Quote, 'findByPk').mockResolvedValue({
            getItems: async payload => setup.instance.items
          });
        }

        // Given:
        let quote_id = setup.instance.quotes[0].id;
        let endpoint = `${API_BASE}/${quote_id}/items`;
        let options = { search: { name: 'dknd' } };

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBe(null);
      });
      it(`${uuid()} - query is: name like %disk%`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Quote, 'findByPk').mockResolvedValue({
            getItems: async payload => setup.instance.items
          });
        }

        // Given:
        let quote_id = setup.instance.quotes[0].id;
        let endpoint = `${API_BASE}/${quote_id}/items`;
        let options = { search: { name: { like: '%disk%' } } };

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBe(null);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - quote param id is malformed`, async () => {
        // Given:
        let quote_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let endpoint = `${API_BASE}/${quote_id}/items`;
        let options = {};

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - quote is not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Quote, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let quote_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
        let endpoint = `${API_BASE}/${quote_id}/items`;
        let options = {};

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - quote was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Quote, 'findByPk').mockRejectedValue(new Error('error mocked.'));

        // Given:
        let quote_id = setup.instance.quotes[0].id;
        let endpoint = `${API_BASE}/${quote_id}/items`;
        let options = {};

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - items were trying to be found`, async () => {
        // Setup:
        jest.spyOn(Quote, 'findByPk').mockResolvedValue({
          getItems: async (options) => {
            throw new Error('error mocked.');
          }
        });

        // Given:
        let quote_id = setup.instance.quotes[0].id;
        let endpoint = `${API_BASE}/${quote_id}/items`;
        let options = {};

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe('set items', () => {
    describe('should return data when:', () => {
      it(`${uuid()} - items are set`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Quote, 'findByPk').mockResolvedValue({
            addItems: async payload => []
          });
        }

        // Given:
        let quote_id = setup.instance.quotes[0].id;
        let items = setup.instance.items.map(item => item.id);
        let endpoint = `${API_BASE}/${quote_id}/items`;

        // When:
        let res = await request("post", endpoint).send({ items });

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBe(null);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - quote param id is malformed`, async () => {
        // Given:
        let quote_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let items = setup.instance.items.map(item => item.id);
        let endpoint = `${API_BASE}/${quote_id}/items`;

        // When:
        let res = await request("post", endpoint).send({ items });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - items id are malformed`, async () => {
        // Given:
        let quote_id = setup.instance.quotes[0].id;
        let items = [
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s'
        ];
        let endpoint = `${API_BASE}/${quote_id}/items`;

        // When:
        let res = await request("post", endpoint).send({ items });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - quote is not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Quote, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let quote_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
        let items = setup.instance.items.map(item => item.id);
        let endpoint = `${API_BASE}/${quote_id}/items`;

        // When:
        let res = await request("post", endpoint).send({ items });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - quote was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Quote, 'findByPk').mockRejectedValue(new Error('error mocked.'));

        // Given:
        let quote_id = setup.instance.quotes[0].id;
        let items = setup.instance.items.map(item => item.id);
        let endpoint = `${API_BASE}/${quote_id}/items`;

        // When:
        let res = await request("post", endpoint).send({ items });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - items were trying to be set`, async () => {
        // Setup:
        jest.spyOn(Quote, 'findByPk').mockResolvedValue({
          addItems: async (options) => {
            throw new Error('error mocked.');
          }
        });

        // Given:
        let quote_id = setup.instance.quotes[0].id;
        let items = setup.instance.items.map(item => item.id);
        let endpoint = `${API_BASE}/${quote_id}/items`;

        // When:
        let res = await request("post", endpoint).send({ items });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe('get item', () => {
    describe('should return data when:', () => {
      it(`${uuid()} - item is found`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Quote, 'findByPk').mockResolvedValue({
            getItems: async (options) => setup.instance.items[0]
          });
        }

        // Given:
        let quote_id = setup.instance.quotes[0].id;
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${quote_id}/items/${item_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBe(null);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - quote param id is malformed`, async () => {
        // Given:
        let quote_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${quote_id}/items/${item_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - item param id is malformed`, async () => {
        // Given:
        let quote_id = setup.instance.quotes[0].id;
        let item_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let endpoint = `${API_BASE}/${quote_id}/items/${item_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - quote is not found`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Quote, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let quote_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${quote_id}/items/${item_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - item is not found`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Quote, 'findByPk').mockResolvedValue({
            getItems: async (options) => null
          });
        }

        // Given:
        let quote_id = setup.instance.quotes[0].id;
        let item_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
        let endpoint = `${API_BASE}/${quote_id}/items/${item_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - quote was trying to be found`, async () => {
        // Setup:
        jest.spyOn(Quote, 'findByPk').mockRejectedValue(new Error('error mocked.'));

        // Given:
        let quote_id = setup.instance.quotes[0].id;
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${quote_id}/items/${item_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - item was trying to be found`, async () => {
        // Setup:
        jest.spyOn(Quote, 'findByPk').mockResolvedValue({
          getItems: async (options) => {
            throw new Error('error mocked.');
          }
        });

        // Given:
        let quote_id = setup.instance.quotes[0].id;
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${quote_id}/items/${item_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe('update item', () => {
    describe('should return data when:', () => {
      it(`${uuid()} - item is found and values are valid`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Quote, 'findByPk').mockResolvedValue({
            getItems: async (options) => ({ mocked: 'yes' }),
            addItem: async (values, options) => setup.instance.items[0]
          });
        }

        // Given:
        let quote_id = setup.instance.quotes[0].id;
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${quote_id}/items/${item_id}`;
        let values = { extra: { units: 20 } };

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBe(null);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - quote param id is malformed`, async () => {
        // Given:
        let quote_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${quote_id}/items/${item_id}`;
        let values = { extra: { units: 20 } };

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - item param id is malformed`, async () => {
        // Given:
        let quote_id = setup.instance.quotes[0].id;
        let item_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let endpoint = `${API_BASE}/${quote_id}/items/${item_id}`;
        let values = { extra: { units: 20 } };

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - quote is not found`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Quote, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let quote_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${quote_id}/items/${item_id}`;
        let values = { extra: { units: 20 } };

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - item is not found`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Quote, 'findByPk').mockResolvedValue({
            getItems: async (options) => null
          });
        }

        // Given:
        let quote_id = setup.instance.quotes[0].id;
        let item_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
        let endpoint = `${API_BASE}/${quote_id}/items/${item_id}`;
        let values = { extra: { units: 20 } };

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - quote was trying to be found`, async () => {
        // Setup:
        jest.spyOn(Quote, 'findByPk').mockRejectedValue(new Error('error mocked.'));

        // Given:
        let quote_id = setup.instance.quotes[0].id;
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${quote_id}/items/${item_id}`;
        let values = { extra: { units: 20 } };

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - item was trying to be found`, async () => {
        // Setup:
        jest.spyOn(Quote, 'findByPk').mockResolvedValue({
          getItems: async (options) => {
            throw new Error('error mocked.');
          }
        });

        // Given:
        let quote_id = setup.instance.quotes[0].id;
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${quote_id}/items/${item_id}`;
        let values = { extra: { units: 20 } };

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - item was trying to be updated`, async () => {
        // Setup:
        jest.spyOn(Quote, 'findByPk').mockResolvedValue({
          getItems: async (options) => ({}),
          addItem: async (uuid, options) => {
            throw new Error('error mocked.');
          }
        });

        // Given:
        let quote_id = setup.instance.quotes[0].id;
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${quote_id}/items/${item_id}`;
        let values = { extra: { units: 20 } };

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe('remove item', () => {
    describe('should return data when:', () => {
      it(`${uuid()} - item is found and values are valid`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Quote, 'findByPk').mockResolvedValue({
            getItems: async (payload, options) => ({}),
            removeItem: async (payload, options) => setup.instance.items[0]
          });
        }

        // Given:
        let quote_id = setup.instance.quotes[0].id;
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${quote_id}/items/${item_id}`;
        let options = {};

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBe(null);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - quote param id is malformed`, async () => {
        // Given:
        let quote_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${quote_id}/items/${item_id}`;
        let options = {};

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - item param id is malformed`, async () => {
        // Given:
        let quote_id = setup.instance.quotes[0].id;
        let item_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let endpoint = `${API_BASE}/${quote_id}/items/${item_id}`;
        let options = {};

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - quote is not found`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Quote, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let quote_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${quote_id}/items/${item_id}`;
        let options = {};

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - item is not found`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Quote, 'findByPk').mockResolvedValue({
            getItems: async (options) => null
          });
        }

        // Given:
        let quote_id = setup.instance.quotes[0].id;
        let item_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
        let endpoint = `${API_BASE}/${quote_id}/items/${item_id}`;
        let options = {};

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - quote was trying to be found`, async () => {
        // Setup:
        jest.spyOn(Quote, 'findByPk').mockRejectedValue(new Error('error mocked.'));

        // Given:
        let quote_id = setup.instance.quotes[0].id;
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${quote_id}/items/${item_id}`;
        let options = {};

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - item was trying to be found`, async () => {
        // Setup:
        jest.spyOn(Quote, 'findByPk').mockResolvedValue({
          getItems: async (options) => {
            throw new Error('error mocked.');
          }
        });

        // Given:
        let quote_id = setup.instance.quotes[0].id;
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${quote_id}/items/${item_id}`;
        let options = {};

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - item was trying to be removed`, async () => {
        // Setup:
        jest.spyOn(Quote, 'findByPk').mockResolvedValue({
          getItems: async (options) => ({}),
          removeItem: async (uuid, options) => {
            throw new Error('error mocked.');
          }
        });

        // Given:
        let quote_id = setup.instance.quotes[0].id;
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${quote_id}/items/${item_id}`;
        let options = {};

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  // --------------------------------------------------------------------------

  describe("get orders:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - query is: {}`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Quote, 'findByPk').mockResolvedValue({
            getOrders: async payload => ({ success : 'mocked' })
          });
        }

        // Given:
        let quote_id = setup.instance.quotes[0].id;
        let endpoint = `${API_BASE}/${quote_id}/orders`;
        let options = {};

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - query is: { search: {} }`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Quote, 'findByPk').mockResolvedValue({
            getOrders: async payload => ({ success : 'mocked' })
          });
        }

        // Given:
        let quote_id = setup.instance.quotes[0].id;
        let endpoint = `${API_BASE}/${quote_id}/orders`;
        let options = { search: {} };

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - query is: undefined`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Quote, 'findByPk').mockResolvedValue({
            getOrders: async payload => ({ success : 'mocked' })
          });
        }

        // Given:
        let quote_id = setup.instance.quotes[0].id;
        let endpoint = `${API_BASE}/${quote_id}/orders`;
        let options = { search: undefined };

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - query is: { search: { code: 'ccccc' } }`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Quote, 'findByPk').mockResolvedValue({
            getOrders: async payload => ({ success : 'mocked' })
          });
        }

        // Given:
        let quote_id = setup.instance.quotes[0].id;
        let endpoint = `${API_BASE}/${quote_id}/orders`;
        let options = { search: { code: 'ccccc' } };

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - query is: { search: { code: { like: '%vvvvv%' } } }`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Quote, 'findByPk').mockResolvedValue({
            getOrders: async payload => ({ success : 'mocked' })
          });
        }

        // Given:
        let quote_id = setup.instance.quotes[0].id;
        let endpoint = `${API_BASE}/${quote_id}/orders`;
        let options = { search: { code: { like: '%vvvvv%' } } };

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - quote id param is malformed`, async () => {
        // Given:
        let quote_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let endpoint = `${API_BASE}/${quote_id}/orders`;
        let options = {};

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - quote is not found`, async () => {
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Quote, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let quote_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
        let endpoint = `${API_BASE}/${quote_id}/orders`;
        let options = {};

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - quote is trying to be found`, async () => {
        jest.spyOn(Quote, 'findByPk').mockRejectedValue(new Error('error mocked.'));

        // Given:
        let quote_id = setup.instance.quotes[0].id;
        let endpoint = `${API_BASE}/${quote_id}/orders`;
        let options = {};

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - quote is trying to be found`, async () => {
        jest.spyOn(Quote, 'findByPk').mockResolvedValue({
          getOrders: async payload => {
            throw new Error('error mocked.');
          }
        });

        // Given:
        let quote_id = setup.instance.quotes[0].id;
        let endpoint = `${API_BASE}/${quote_id}/orders`;
        let options = {};

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe("set orders:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - orders are added`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Quote, 'findByPk').mockResolvedValue({
            addOrders: async payload => ({ success : 'mocked' })
          });
        }

        // Given:
        let quote_id = setup.instance.quotes[0].id;
        let orders = setup.instance.orders.map(o => o.id);
        let endpoint = `${API_BASE}/${quote_id}/orders`;

        // When:
        let res = await request("post", endpoint).send({ orders });

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - quote id param is malformed`, async () => {
        // Given:
        let quote_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let orders = setup.instance.orders.map(o => o.id);
        let endpoint = `${API_BASE}/${quote_id}/orders`;

        // When:
        let res = await request("post", endpoint).send({ orders });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - quote is not found`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Quote, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let quote_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
        let orders = setup.instance.orders.map(o => o.id);
        let endpoint = `${API_BASE}/${quote_id}/orders`;

        // When:
        let res = await request("post", endpoint).send({ orders });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - quote is trying to be found`, async () => {
        // Setup:
        jest.spyOn(Quote, 'findByPk').mockRejectedValue(new Error('error mocked.'));

        // Given:
        let quote_id = setup.instance.quotes[0].id;
        let orders = setup.instance.orders.map(o => o.id);
        let endpoint = `${API_BASE}/${quote_id}/orders`;

        // When:
        let res = await request("post", endpoint).send({ orders });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - quote is trying to be set`, async () => {
        jest.spyOn(Quote, 'findByPk').mockResolvedValue({
          addOrders: payload => {
            throw new Error('error mocked.');
          }
        });

        // Given:
        let quote_id = setup.instance.quotes[0].id;
        let orders = setup.instance.orders.map(o => o.id);
        let endpoint = `${API_BASE}/${quote_id}/orders`;

        // When:
        let res = await request("post", endpoint).send({ orders });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe("get order:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - order is found`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Quote, 'findByPk').mockResolvedValue({
            getOrders: async payload => setup.instance.orders[0]
          });
        }

        // Given:
        let quote_id = setup.instance.quotes[0].id;
        let order_id = setup.instance.orders[0].id;
        let endpoint = `${API_BASE}/${quote_id}/orders/${order_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - quote id param is malformed`, async () => {
        // Given:
        let quote_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let order_id = setup.instance.orders[0].id;
        let endpoint = `${API_BASE}/${quote_id}/orders/${order_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - order id param is malformed`, async () => {
        // Given:
        let quote_id = setup.instance.quotes[0].id;
        let order_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let endpoint = `${API_BASE}/${quote_id}/orders/${order_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - quote is not found`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Quote, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let quote_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
        let order_id = setup.instance.orders[0].id;
        let endpoint = `${API_BASE}/${quote_id}/orders/${order_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - order is not found`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Quote, 'findByPk').mockResolvedValue({
            getOrders: async payload => null
          });
        }

        // Given:
        let quote_id = setup.instance.quotes[0].id;
        let order_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
        let endpoint = `${API_BASE}/${quote_id}/orders/${order_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - quote was trying to be found`, async () => {
        // Setup:
        jest.spyOn(Quote, 'findByPk').mockRejectedValue(new Error('error mocked.'));

        // Given:
        let quote_id = setup.instance.quotes[0].id;
        let order_id = setup.instance.orders[0].id;
        let endpoint = `${API_BASE}/${quote_id}/orders/${order_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - order was trying to be found`, async () => {
        // Setup:
        jest.spyOn(Quote, 'findByPk').mockResolvedValue({
          getOrders: async payload => {
            throw new Error('error mocked.');
          }
        });

        // Given:
        let quote_id = setup.instance.quotes[0].id;
        let order_id = setup.instance.orders[0].id;
        let endpoint = `${API_BASE}/${quote_id}/orders/${order_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  // --------------------------------------------------------------------------

  afterEach(setup.after_each);
  afterAll(setup.after_all);
});
