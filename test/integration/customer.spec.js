import setup_factory from './index';
import db from 'src/db/models';
import { request } from 'test/utils';
import uuid from 'uuid/v4';

const IS_INTEGRATION_MOCK = JSON.parse(process.env.MOCK);
const ERROR_MOCK = new Error('error mocked.');
const API_BASE = '/api/v1/customers';
const setup = setup_factory(db, IS_INTEGRATION_MOCK);
const { Customer } = db.sequelize.models;

describe("Customer Service:", () => {
  beforeAll(setup.before_all);
  beforeEach(setup.before_each);

  // --------------------------------------------------------------------------

  describe("get customers:", () => {
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
      it(`${uuid()} - query is: { search: { name: 'ccccc' } }`, async () => {
        // Given:
        let querystring = { search: { name: 'ccccc' } };

        // When:
        let res = await request("get", API_BASE).query(querystring);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - query is: { search: { name: { like: '%vvvvv%' } } }`, async () => {
        // Given:
        let querystring = { search: { name: { like: '%vvvvv%' } } };

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
        jest.spyOn(Customer, 'findAll').mockRejectedValue(ERROR_MOCK);

        // Given:
        let querystring = { search: { name: 'bbbbb' } };

        // When:
        let res = await request("get", API_BASE).query(querystring);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe("create customers:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - values are valid`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Customer, 'create').mockResolvedValue(setup.instance.customers[0]);
        }

        // Given:
        let values = { name: 'demo' };

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
          jest.spyOn(Customer, 'create').mockResolvedValue(Customer.build({
            ...setup.instance.customers[0].dataValues,
            created_by: setup.instance.users[0].id,
            updated_by: setup.instance.users[0].id,
          }));
        }

        // Given:
        let values = {
          name: 'demo',
          created_by: setup.instance.users[0].id,
          updated_by: setup.instance.users[0].id
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
      it(`${uuid()} - values are not valid`, async () => {
        // Given:
        let values = null;

        // When:
        let res = await request("post", API_BASE).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - value "name" is not valid`, async () => {
        // Given:
        let values = { name: '' };

        // When:
        let res = await request("post", API_BASE).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - action throw error`, async () => {
        // Mock:
        jest.spyOn(Customer, 'create').mockRejectedValue(ERROR_MOCK);

        // Given:
        let values = { name: 'Customer A' };

        // When:
        let res = await request("post", API_BASE).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe("get Customer:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - Customer is found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Customer, 'findByPk').mockResolvedValue(setup.instance.customers[0]);
        }

        // Given:
        let customer_id = setup.instance.customers[0].id;

        // When:
        let res = await request("get", `${API_BASE}/${customer_id}`);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - Customer id param is malformed`, async () => {
        // Given:
        let customer_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111dd';

        // When:
        let res = await request("get", `${API_BASE}/${customer_id}`);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - Customer is not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Customer, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let customer_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';

        // When:
        let res = await request("get", `${API_BASE}/${customer_id}`);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe("update Customer:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - values are valid`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Customer, 'findByPk').mockResolvedValue({
            update: async (payload, options) => Customer.build({
              ...setup.instance.customers[0].dataValues,
              ...payload
            })
          });
        }

        // Given:
        let customer_id = setup.instance.customers[0].id;
        let values = { name: 'Customer A' };
        let endpoint = `${API_BASE}/${customer_id}`;

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - values are not valid`, async () => {
        // Given:
        let customer_id = setup.instance.customers[0].id;
        let values = null;
        let endpoint = `${API_BASE}/${customer_id}`;

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - Customer is not found`, async () => {
        // Mock:
        jest.spyOn(Customer, 'findByPk').mockResolvedValue(null);

        // Given:
        let customer_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
        let values = { name: 'Customer A' };
        let endpoint = `${API_BASE}/${customer_id}`;

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - Customer was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Customer, 'findByPk').mockRejectedValue(ERROR_MOCK);

        // Given:
        let customer_id = setup.instance.customers[0].id;
        let values = { name: 'Customer A' };
        let endpoint = `${API_BASE}/${customer_id}`;

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - Customer was trying to be updated`, async () => {
        // Mock:
        jest.spyOn(Customer, 'findByPk').mockResolvedValue({
          update: async (payload, options) => {
            throw ERROR_MOCK;
          }
        });

        // Given:
        let customer_id = setup.instance.customers[0].id;
        let values = { name: 'Customer A' };
        let endpoint = `${API_BASE}/${customer_id}`;

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe("delete Customer:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - Customer is deleted without options`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Customer, 'findByPk').mockResolvedValue({
            destroy: async (options) => {
              let Customer = setup.instance.customers[0];
              Customer.deleted_at = new Date().toISOString();
              return Customer;
            }
          });
        }

        // Given:
        let customer_id = setup.instance.customers[0].id;
        let endpoint = `${API_BASE}/${customer_id}`;
        let options = {}

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - Customer is deleted with the force option as true`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Customer, 'findByPk').mockResolvedValue({
            destroy: async (options) => {
              let Customer = setup.instance.customers[0];
              Customer.deleted_at = new Date().toISOString();
              return Customer;
            }
          });
        }

        // Given:
        let customer_id = setup.instance.customers[0].id;
        let endpoint = `${API_BASE}/${customer_id}`;
        let options = { force: true }

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - Customer is deleted with the force option as false`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Customer, 'findByPk').mockResolvedValue({
            destroy: async (options) => {
              let Customer = setup.instance.customers[0];
              Customer.deleted_at = new Date().toISOString();
              return Customer;
            }
          });
        }

        // Given:
        let customer_id = setup.instance.customers[0].id;
        let endpoint = `${API_BASE}/${customer_id}`;
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
      it(`${uuid()} - Customer id param is malformed`, async () => {
        // Given:
        let customer_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let endpoint = `${API_BASE}/${customer_id}`;
        let options = {}

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - Customer is not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Customer, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let customer_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
        let endpoint = `${API_BASE}/${customer_id}`;
        let options = {}

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - Customer was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Customer, 'findByPk').mockRejectedValue(ERROR_MOCK);

        // Given:
        let customer_id = setup.instance.customers[0].id;
        let endpoint = `${API_BASE}/${customer_id}`;
        let options = {}

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - Customer was trying to be deleted`, async () => {
        // Mock:
        jest.spyOn(Customer, 'findByPk').mockResolvedValue({
          destroy: async (options) => {
            throw ERROR_MOCK;
          }
        });

        // Given:
        let customer_id = setup.instance.customers[0].id;
        let endpoint = `${API_BASE}/${customer_id}`;
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

  describe("get quotes:", () => {
    describe("should return data when:", () => {
      it(`${uuid()} - query is: {}`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Customer, 'findByPk').mockResolvedValue({
            getQuotes: async (options) => setup.instance.quotes
          });
        }

        // Given:
        let customer_id = setup.instance.customers[0].id;
        let endpoint = `${API_BASE}/${customer_id}/quotes`;
        let options = {}

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - query is: { search: {} }`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Customer, 'findByPk').mockResolvedValue({
            getQuotes: async (options) => setup.instance.quotes
          });
        }

        // Given:
        let customer_id = setup.instance.customers[0].id;
        let endpoint = `${API_BASE}/${customer_id}/quotes`;
        let options = { search: {} }

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - query is: { search: undefined }`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Customer, 'findByPk').mockResolvedValue({
            getQuotes: async (options) => setup.instance.quotes
          });
        }

        // Given:
        let customer_id = setup.instance.customers[0].id;
        let endpoint = `${API_BASE}/${customer_id}/quotes`;
        let options = { search: undefined }

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - query is: { search: { subject: 'ccccc' } }`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Customer, 'findByPk').mockResolvedValue({
            getQuotes: async (options) => setup.instance.quotes
          });
        }

        // Given:
        let customer_id = setup.instance.customers[0].id;
        let endpoint = `${API_BASE}/${customer_id}/quotes`;
        let options = { search: { subject: 'ccccc' } }

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - query is: { search: { subject: { like: '%vv%' } } }`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Customer, 'findByPk').mockResolvedValue({
            getQuotes: async (options) => setup.instance.quotes
          });
        }

        // Given:
        let customer_id = setup.instance.customers[0].id;
        let endpoint = `${API_BASE}/${customer_id}/quotes`;
        let options = { search: { subject: { like: '%vv%' } } }

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
    });
    describe("should return error when:", () => {
      it(`${uuid()} - customer id param is malformed`, async () => {
        // Given:
        let customer_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let endpoint = `${API_BASE}/${customer_id}/quotes`;
        let options = { search: { subject: 'demo' } };

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - customer is not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Customer, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let customer_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
        let endpoint = `${API_BASE}/${customer_id}/quotes`;
        let options = { search: { subject: 'demo' } };

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - customer was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Customer, 'findByPk').mockRejectedValue(ERROR_MOCK);

        // Given:
        let customer_id = setup.instance.customers[0].id;
        let endpoint = `${API_BASE}/${customer_id}/quotes`;
        let options = { search: { subject: 'demo' } };

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - quotes were trying to be found`, async () => {
        // Mock:
        jest.spyOn(Customer, 'findByPk').mockResolvedValue({
          getQuotes: async (options) => { throw ERROR_MOCK; }
        });

        // Given:
        let customer_id = setup.instance.customers[0].id;
        let endpoint = `${API_BASE}/${customer_id}/quotes`;
        let options = { search: { subject: 'demodd' } };

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe("set quotes:", () => {
    describe("should return data when:", () => {
      it(`${uuid()} - quotes are set to a customer`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Customer, 'findByPk').mockResolvedValue({
            addQuotes: async (payload, options) => payload
          });
        }

        // Given:
        let customer_id = setup.instance.customers[0].id;
        let quotes = setup.instance.quotes.map(q => q.id);
        let endpoint = `${API_BASE}/${customer_id}/quotes`;

        // When:
        let res = await request("post", endpoint).send({ quotes });

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
    });
    describe("should return error when:", () => {
      it(`${uuid()} - customer id param is malformed`, async () => {
        // Given:
        let customer_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let quotes = setup.instance.quotes.map(e => e.id);
        let endpoint = `${API_BASE}/${customer_id}/quotes`;

        // When:
        let res = await request("post", endpoint).send({ quotes });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - quotes ids values are malformed`, async () => {
        // Given:
        let customer_id = setup.instance.customers[0].id;
        let quotes = [ '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s' ];
        let endpoint = `${API_BASE}/${customer_id}/quotes`;

        // When:
        let res = await request("post", endpoint).send({ quotes });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - customer is not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Customer, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let customer_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
        let quotes = setup.instance.quotes.map(e => e.id);
        let endpoint = `${API_BASE}/${customer_id}/quotes`;

        // When:
        let res = await request("post", endpoint).send({ quotes });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - customer was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Customer, 'findByPk').mockRejectedValue(ERROR_MOCK);

        // Given:
        let customer_id = setup.instance.customers[0].id;
        let quotes = setup.instance.quotes.map(e => e.id);
        let endpoint = `${API_BASE}/${customer_id}/quotes`;

        // When:
        let res = await request("post", endpoint).send({ quotes });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - quotes were trying to be set`, async () => {
        // Mock:
        jest.spyOn(Customer, 'findByPk').mockResolvedValue({
          addQuotes: async (payload, options) => {
            throw ERROR_MOCK;
          }
        });

        // Given:
        let customer_id = setup.instance.customers[0].id;
        let quotes = setup.instance.quotes.map(e => e.id);
        let endpoint = `${API_BASE}/${customer_id}/quotes`;

        // When:
        let res = await request("post", endpoint).send({ quotes });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe("get quote:", () => {
    describe("should return data when:", () => {
      it(`${uuid()} - quote is found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Customer, 'findByPk').mockResolvedValue({
            getQuotes: async payload => setup.instance.quotes[0]
          });
        }

        // Given:
        let customer_id = setup.instance.customers[0].id;
        let quote_id = setup.instance.quotes[0].id;
        let endpoint = `${API_BASE}/${customer_id}/quotes/${quote_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
    });
    describe("should return error when:", () => {
      it(`${uuid()} - customer id param is malformed`, async () => {
        // Given:
        let customer_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll';
        let quote_id = setup.instance.quotes[0].id;
        let endpoint = `${API_BASE}/${customer_id}/quotes/${quote_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - quote id param is malformed`, async () => {
        // Given:
        let customer_id = setup.instance.customers[0].id;
        let quote_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll';
        let endpoint = `${API_BASE}/${customer_id}/quotes/${quote_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - customer is not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Customer, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let customer_id = '5dc8dfea-34c1-4280-bb5e-d18af9296fc1';
        let quote_id = setup.instance.quotes[0].id;
        let endpoint = `${API_BASE}/${customer_id}/quotes/${quote_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - quote is not found`, async () => {
        // Mock:
        jest.spyOn(Customer, 'findByPk').mockResolvedValue({
          getQuotes: async payload => null
        });

        // Given:
        let customer_id = setup.instance.customers[0].id;
        let quote_id = '5dc8dfea-34c1-4280-bb5e-d18af9296fc1';
        let endpoint = `${API_BASE}/${customer_id}/quotes/${quote_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - customer was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Customer, 'findByPk').mockRejectedValue(ERROR_MOCK);

        // Given:
        let customer_id = setup.instance.customers[0].id;
        let quote_id = setup.instance.quotes[0].id;
        let endpoint = `${API_BASE}/${customer_id}/quotes/${quote_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - quote was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Customer, 'findByPk').mockResolvedValue({
          getQuotes: async payload => {
            throw ERROR_MOCK;
          }
        });

        // Given:
        let customer_id = setup.instance.customers[0].id;
        let quote_id = setup.instance.quotes[0].id;
        let endpoint = `${API_BASE}/${customer_id}/quotes/${quote_id}`;

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
