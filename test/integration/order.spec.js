import setup_factory from './index';
import db from 'src/db/models';
import { request } from 'test/utils';
import uuid from 'uuid/v4';

const IS_INTEGRATION_MOCK = JSON.parse(process.env.MOCK);
const ERROR_MOCK = new Error('error mocked.');
const API_BASE = '/api/v1/orders';
const setup = setup_factory(db, IS_INTEGRATION_MOCK);
const { Order } = db.sequelize.models;

describe("Order Service:", () => {
  beforeAll(setup.before_all);
  beforeEach(setup.before_each);

  // --------------------------------------------------------------------------

  describe("get orders:", () => {
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
      it(`${uuid()} - query is: { search: { code: 'ccccc' } }`, async () => {
        // Given:
        let querystring = { search: { code: 'ccccc' } };

        // When:
        let res = await request("get", API_BASE).query(querystring);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - query is: { search: { code: { like: '%vvvvv%' } } }`, async () => {
        // Given:
        let querystring = { search: { code: { like: '%vvvvv%' } } };

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
        jest.spyOn(Order, 'findAll').mockRejectedValue(ERROR_MOCK);

        // Given:
        let querystring = { search: { code: 'bbbbb' } };

        // When:
        let res = await request("get", API_BASE).query(querystring);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe("create order:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - values are valid`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Order, 'create').mockResolvedValue(setup.instance.orders[0]);
        }

        // Given:
        let values = {
          quote_id: setup.instance.quotes[0].id,
          type: 'work',
          status: 'working'
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
          jest.spyOn(Order, 'create').mockResolvedValue(Order.build({
            ...setup.instance.orders[0].dataValues,
            created_by: setup.instance.users[0].id,
            updated_by: setup.instance.users[0].id,
          }));
        }

        // Given:
        let values = {
          quote_id: setup.instance.quotes[0].id,
          type: 'work',
          status: 'working',
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
          quote_id: 'kfkdnfkdfnkdfnkdfnkdfnkdfndkfnkdfn',
          code: 'ed'
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
        jest.spyOn(Order, 'create').mockRejectedValue(ERROR_MOCK);

        // Given:
        let values = {
          quote_id: setup.instance.quotes[0].id,
          type: 'work',
          status: 'working'
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

  describe("get order:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - order is found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Order, 'findByPk').mockResolvedValue(setup.instance.orders[0]);
        }

        // Given:
        let order_id = setup.instance.orders[0].id;
        let options = {};

        // When:
        let res = await request("get", `${API_BASE}/${order_id}`).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - order id param is malformed`, async () => {
        // Given:
        let order_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111dd';

        // When:
        let res = await request("get", `${API_BASE}/${order_id}`);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - order is not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Order, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let order_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';

        // When:
        let res = await request("get", `${API_BASE}/${order_id}`);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - order is trying to be found`, async () => {
        // Mock:
        jest.spyOn(Order, 'findByPk').mockRejectedValue(ERROR_MOCK);

        // Given:
        let order_id = setup.instance.orders[0].id;
        let endpoint = `${API_BASE}/${order_id}`;
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

  describe("update order:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - values are valid`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Order, 'findByPk').mockResolvedValue({
            update: async (values, options) => Order.build({
              ...setup.instance.orders[0].dataValues,
              ...values,
              updated_at: new Date().toISOString()
            })
          });
        }

        // Given:
        let order_id = setup.instance.orders[0].id;
        let values = { status: 'cancelled' };
        let endpoint = `${API_BASE}/${order_id}`;

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - order id param is malformed`, async () => {
        // Given:
        let order_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let values = null;
        let endpoint = `${API_BASE}/${order_id}`;

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - order is not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Order, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let order_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
        let values = { status: 'cancelled' };
        let endpoint = `${API_BASE}/${order_id}`;

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - order was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Order, 'findByPk').mockRejectedValue(ERROR_MOCK);

        // Given:
        let order_id = setup.instance.orders[0].id;
        let values = { status: 'cancelled' };
        let endpoint = `${API_BASE}/${order_id}`;

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - order was trying to be updated`, async () => {
        // Mock:
        jest.spyOn(Order, 'findByPk').mockResolvedValue({
          update: async (payload, options) => {
            throw ERROR_MOCK;
          }
        });

        // Given:
        let order_id = setup.instance.orders[0].id;
        let values = { status: 'cancelled' };
        let endpoint = `${API_BASE}/${order_id}`;

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe("delete order:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - order is deleted without options`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Order, 'findByPk').mockResolvedValue({
            destroy: async (options) => {
              let order = setup.instance.orders[0];
              order.deleted_at = new Date().toISOString();
              return order;
            }
          });
        }

        // Given:
        let order_id = setup.instance.orders[0].id;
        let endpoint = `${API_BASE}/${order_id}`;
        let options = {}

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - order is deleted with the force option as true`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Order, 'findByPk').mockResolvedValue({
            destroy: async (options) => {
              let order = setup.instance.orders[0];
              order.deleted_at = new Date().toISOString();
              return order;
            }
          });
        }

        // Given:
        let order_id = setup.instance.orders[0].id;
        let endpoint = `${API_BASE}/${order_id}`;
        let options = { force: true }

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - order is deleted with the force option as false`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Order, 'findByPk').mockResolvedValue({
            destroy: async (options) => {
              let order = setup.instance.orders[0];
              order.deleted_at = new Date().toISOString();
              return order;
            }
          });
        }

        // Given:
        let order_id = setup.instance.orders[0].id;
        let endpoint = `${API_BASE}/${order_id}`;
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
      it(`${uuid()} - order id param is malformed`, async () => {
        // Given:
        let order_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let endpoint = `${API_BASE}/${order_id}`;
        let options = {}

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - order is not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Order, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let order_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
        let endpoint = `${API_BASE}/${order_id}`;
        let options = {}

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - order was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Order, 'findByPk').mockRejectedValue(ERROR_MOCK);

        // Given:
        let order_id = setup.instance.orders[0].id;
        let endpoint = `${API_BASE}/${order_id}`;
        let options = {}

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - order was trying to be deleted`, async () => {
        // Mock:
        jest.spyOn(Order, 'findByPk').mockResolvedValue({
          destroy: async (options) => {
            throw ERROR_MOCK;
          }
        });

        // Given:
        let order_id = setup.instance.orders[0].id;
        let endpoint = `${API_BASE}/${order_id}`;
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
          jest.spyOn(Order, 'findByPk').mockResolvedValue({
            getItems: async payload => setup.instance.items
          });
        }

        // Given:
        let order_id = setup.instance.orders[0].id;
        let endpoint = `${API_BASE}/${order_id}/items`;
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
          jest.spyOn(Order, 'findByPk').mockResolvedValue({
            getItems: async payload => setup.instance.items
          });
        }

        // Given:
        let order_id = setup.instance.orders[0].id;
        let endpoint = `${API_BASE}/${order_id}/items`;
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
          jest.spyOn(Order, 'findByPk').mockResolvedValue({
            getItems: async payload => setup.instance.items
          });
        }

        // Given:
        let order_id = setup.instance.orders[0].id;
        let endpoint = `${API_BASE}/${order_id}/items`;
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
      it(`${uuid()} - order param id is malformed`, async () => {
        // Given:
        let order_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let endpoint = `${API_BASE}/${order_id}/items`;
        let options = {};

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - order is not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Order, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let order_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
        let endpoint = `${API_BASE}/${order_id}/items`;
        let options = {};

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - order was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Order, 'findByPk').mockRejectedValue(new Error('error mocked.'));

        // Given:
        let order_id = setup.instance.orders[0].id;
        let endpoint = `${API_BASE}/${order_id}/items`;
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
        jest.spyOn(Order, 'findByPk').mockResolvedValue({
          getItems: async (options) => {
            throw new Error('error mocked.');
          }
        });

        // Given:
        let order_id = setup.instance.orders[0].id;
        let endpoint = `${API_BASE}/${order_id}/items`;
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
          jest.spyOn(Order, 'findByPk').mockResolvedValue({
            addItems: async payload => []
          });
        }

        // Given:
        let order_id = setup.instance.orders[0].id;
        let items = setup.instance.items.map(item => item.id);
        let endpoint = `${API_BASE}/${order_id}/items`;

        // When:
        let res = await request("post", endpoint).send({ items });

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBe(null);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - order param id is malformed`, async () => {
        // Given:
        let order_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let items = setup.instance.items.map(item => item.id);
        let endpoint = `${API_BASE}/${order_id}/items`;

        // When:
        let res = await request("post", endpoint).send({ items });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - items id are malformed`, async () => {
        // Given:
        let order_id = setup.instance.orders[0].id;
        let items = [
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s'
        ];
        let endpoint = `${API_BASE}/${order_id}/items`;

        // When:
        let res = await request("post", endpoint).send({ items });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - order is not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Order, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let order_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
        let items = setup.instance.items.map(item => item.id);
        let endpoint = `${API_BASE}/${order_id}/items`;

        // When:
        let res = await request("post", endpoint).send({ items });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - order was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Order, 'findByPk').mockRejectedValue(new Error('error mocked.'));

        // Given:
        let order_id = setup.instance.orders[0].id;
        let items = setup.instance.items.map(item => item.id);
        let endpoint = `${API_BASE}/${order_id}/items`;

        // When:
        let res = await request("post", endpoint).send({ items });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - items were trying to be set`, async () => {
        // Setup:
        jest.spyOn(Order, 'findByPk').mockResolvedValue({
          addItems: async (options) => {
            throw new Error('error mocked.');
          }
        });

        // Given:
        let order_id = setup.instance.orders[0].id;
        let items = setup.instance.items.map(item => item.id);
        let endpoint = `${API_BASE}/${order_id}/items`;

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
          jest.spyOn(Order, 'findByPk').mockResolvedValue({
            getItems: async (options) => setup.instance.items[0]
          });
        }

        // Given:
        let order_id = setup.instance.orders[0].id;
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${order_id}/items/${item_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBe(null);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - order param id is malformed`, async () => {
        // Given:
        let order_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${order_id}/items/${item_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - item param id is malformed`, async () => {
        // Given:
        let order_id = setup.instance.orders[0].id;
        let item_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let endpoint = `${API_BASE}/${order_id}/items/${item_id}`;

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
          jest.spyOn(Order, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let order_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${order_id}/items/${item_id}`;

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
          jest.spyOn(Order, 'findByPk').mockResolvedValue({
            getItems: async (options) => null
          });
        }

        // Given:
        let order_id = setup.instance.orders[0].id;
        let item_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
        let endpoint = `${API_BASE}/${order_id}/items/${item_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - order was trying to be found`, async () => {
        // Setup:
        jest.spyOn(Order, 'findByPk').mockRejectedValue(new Error('error mocked.'));

        // Given:
        let order_id = setup.instance.orders[0].id;
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${order_id}/items/${item_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - item was trying to be found`, async () => {
        // Setup:
        jest.spyOn(Order, 'findByPk').mockResolvedValue({
          getItems: async (options) => {
            throw new Error('error mocked.');
          }
        });

        // Given:
        let order_id = setup.instance.orders[0].id;
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${order_id}/items/${item_id}`;

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
          jest.spyOn(Order, 'findByPk').mockResolvedValue({
            getItems: async (options) => ({ mocked: 'yes' }),
            addItem: async (values, options) => setup.instance.items[0]
          });
        }

        // Given:
        let order_id = setup.instance.orders[0].id;
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${order_id}/items/${item_id}`;
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
      it(`${uuid()} - order param id is malformed`, async () => {
        // Given:
        let order_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${order_id}/items/${item_id}`;
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
        let order_id = setup.instance.orders[0].id;
        let item_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let endpoint = `${API_BASE}/${order_id}/items/${item_id}`;
        let values = { extra: { units: 20 } };

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - order is not found`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Order, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let order_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${order_id}/items/${item_id}`;
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
          jest.spyOn(Order, 'findByPk').mockResolvedValue({
            getItems: async (options) => null
          });
        }

        // Given:
        let order_id = setup.instance.orders[0].id;
        let item_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
        let endpoint = `${API_BASE}/${order_id}/items/${item_id}`;
        let values = { extra: { units: 20 } };

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - order was trying to be found`, async () => {
        // Setup:
        jest.spyOn(Order, 'findByPk').mockRejectedValue(new Error('error mocked.'));

        // Given:
        let order_id = setup.instance.orders[0].id;
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${order_id}/items/${item_id}`;
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
        jest.spyOn(Order, 'findByPk').mockResolvedValue({
          getItems: async (options) => {
            throw new Error('error mocked.');
          }
        });

        // Given:
        let order_id = setup.instance.orders[0].id;
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${order_id}/items/${item_id}`;
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
        jest.spyOn(Order, 'findByPk').mockResolvedValue({
          getItems: async (options) => ({}),
          addItem: async (uuid, options) => {
            throw new Error('error mocked.');
          }
        });

        // Given:
        let order_id = setup.instance.orders[0].id;
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${order_id}/items/${item_id}`;
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
          jest.spyOn(Order, 'findByPk').mockResolvedValue({
            getItems: async (payload, options) => ({}),
            removeItem: async (payload, options) => setup.instance.items[0]
          });
        }

        // Given:
        let order_id = setup.instance.orders[0].id;
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${order_id}/items/${item_id}`;
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
      it(`${uuid()} - order param id is malformed`, async () => {
        // Given:
        let order_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${order_id}/items/${item_id}`;
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
        let order_id = setup.instance.orders[0].id;
        let item_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let endpoint = `${API_BASE}/${order_id}/items/${item_id}`;
        let options = {};

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - order is not found`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Order, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let order_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${order_id}/items/${item_id}`;
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
          jest.spyOn(Order, 'findByPk').mockResolvedValue({
            getItems: async (options) => null
          });
        }

        // Given:
        let order_id = setup.instance.orders[0].id;
        let item_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
        let endpoint = `${API_BASE}/${order_id}/items/${item_id}`;
        let options = {};

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - order was trying to be found`, async () => {
        // Setup:
        jest.spyOn(Order, 'findByPk').mockRejectedValue(new Error('error mocked.'));

        // Given:
        let order_id = setup.instance.orders[0].id;
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${order_id}/items/${item_id}`;
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
        jest.spyOn(Order, 'findByPk').mockResolvedValue({
          getItems: async (options) => {
            throw new Error('error mocked.');
          }
        });

        // Given:
        let order_id = setup.instance.orders[0].id;
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${order_id}/items/${item_id}`;
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
        jest.spyOn(Order, 'findByPk').mockResolvedValue({
          getItems: async (options) => ({}),
          removeItem: async (uuid, options) => {
            throw new Error('error mocked.');
          }
        });

        // Given:
        let order_id = setup.instance.orders[0].id;
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${order_id}/items/${item_id}`;
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

  describe('get departments', () => {
    describe('should return data when:', () => {
      it(`${uuid()} - query is: empty`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Order, 'findByPk').mockResolvedValue({
            getDepartments: async payload => setup.instance.departments
          });
        }

        // Given:
        let order_id = setup.instance.orders[0].id;
        let endpoint = `${API_BASE}/${order_id}/departments`;
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
          jest.spyOn(Order, 'findByPk').mockResolvedValue({
            getDepartments: async payload => setup.instance.departments
          });
        }

        // Given:
        let order_id = setup.instance.orders[0].id;
        let endpoint = `${API_BASE}/${order_id}/departments`;
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
          jest.spyOn(Order, 'findByPk').mockResolvedValue({
            getDepartments: async payload => setup.instance.departments
          });
        }

        // Given:
        let order_id = setup.instance.orders[0].id;
        let endpoint = `${API_BASE}/${order_id}/departments`;
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
      it(`${uuid()} - order param id is malformed`, async () => {
        // Given:
        let order_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let endpoint = `${API_BASE}/${order_id}/departments`;
        let options = {};

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - order is not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Order, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let order_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
        let endpoint = `${API_BASE}/${order_id}/departments`;
        let options = {};

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - order was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Order, 'findByPk').mockRejectedValue(new Error('error mocked.'));

        // Given:
        let order_id = setup.instance.orders[0].id;
        let endpoint = `${API_BASE}/${order_id}/departments`;
        let options = {};

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - departments were trying to be found`, async () => {
        // Setup:
        jest.spyOn(Order, 'findByPk').mockResolvedValue({
          getDepartments: async (options) => {
            throw new Error('error mocked.');
          }
        });

        // Given:
        let order_id = setup.instance.orders[0].id;
        let endpoint = `${API_BASE}/${order_id}/departments`;
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

  describe('set departments', () => {
    describe('should return data when:', () => {
      it(`${uuid()} - departments are set`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Order, 'findByPk').mockResolvedValue({
            addDepartments: async payload => []
          });
        }

        // Given:
        let order_id = setup.instance.orders[0].id;
        let departments = setup.instance.departments.map(department => department.id);
        let endpoint = `${API_BASE}/${order_id}/departments`;

        // When:
        let res = await request("post", endpoint).send({ departments });

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBe(null);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - order param id is malformed`, async () => {
        // Given:
        let order_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let departments = setup.instance.departments.map(department => department.id);
        let endpoint = `${API_BASE}/${order_id}/departments`;

        // When:
        let res = await request("post", endpoint).send({ departments });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - departments id are malformed`, async () => {
        // Given:
        let order_id = setup.instance.orders[0].id;
        let departments = [
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s'
        ];
        let endpoint = `${API_BASE}/${order_id}/departments`;

        // When:
        let res = await request("post", endpoint).send({ departments });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - order is not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Order, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let order_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
        let departments = setup.instance.departments.map(department => department.id);
        let endpoint = `${API_BASE}/${order_id}/departments`;

        // When:
        let res = await request("post", endpoint).send({ departments });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - order was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Order, 'findByPk').mockRejectedValue(new Error('error mocked.'));

        // Given:
        let order_id = setup.instance.orders[0].id;
        let departments = setup.instance.departments.map(department => department.id);
        let endpoint = `${API_BASE}/${order_id}/departments`;

        // When:
        let res = await request("post", endpoint).send({ departments });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - departments were trying to be set`, async () => {
        // Setup:
        jest.spyOn(Order, 'findByPk').mockResolvedValue({
          addDepartments: async (options) => {
            throw new Error('error mocked.');
          }
        });

        // Given:
        let order_id = setup.instance.orders[0].id;
        let departments = setup.instance.departments.map(department => department.id);
        let endpoint = `${API_BASE}/${order_id}/departments`;

        // When:
        let res = await request("post", endpoint).send({ departments });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe('get department', () => {
    describe('should return data when:', () => {
      it(`${uuid()} - department is found`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Order, 'findByPk').mockResolvedValue({
            getDepartments: async (options) => setup.instance.departments[0]
          });
        }

        // Given:
        let order_id = setup.instance.orders[0].id;
        let department_id = setup.instance.departments[0].id;
        let endpoint = `${API_BASE}/${order_id}/departments/${department_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBe(null);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - order param id is malformed`, async () => {
        // Given:
        let order_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let department_id = setup.instance.departments[0].id;
        let endpoint = `${API_BASE}/${order_id}/departments/${department_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - department param id is malformed`, async () => {
        // Given:
        let order_id = setup.instance.orders[0].id;
        let department_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let endpoint = `${API_BASE}/${order_id}/departments/${department_id}`;

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
          jest.spyOn(Order, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let order_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
        let department_id = setup.instance.departments[0].id;
        let endpoint = `${API_BASE}/${order_id}/departments/${department_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - department is not found`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Order, 'findByPk').mockResolvedValue({
            getDepartments: async (options) => null
          });
        }

        // Given:
        let order_id = setup.instance.orders[0].id;
        let department_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
        let endpoint = `${API_BASE}/${order_id}/departments/${department_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - order was trying to be found`, async () => {
        // Setup:
        jest.spyOn(Order, 'findByPk').mockRejectedValue(new Error('error mocked.'));

        // Given:
        let order_id = setup.instance.orders[0].id;
        let department_id = setup.instance.departments[0].id;
        let endpoint = `${API_BASE}/${order_id}/departments/${department_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - department was trying to be found`, async () => {
        // Setup:
        jest.spyOn(Order, 'findByPk').mockResolvedValue({
          getDepartments: async (options) => {
            throw new Error('error mocked.');
          }
        });

        // Given:
        let order_id = setup.instance.orders[0].id;
        let department_id = setup.instance.departments[0].id;
        let endpoint = `${API_BASE}/${order_id}/departments/${department_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe('update department', () => {
    describe('should return data when:', () => {
      it(`${uuid()} - department is found and values are valid`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Order, 'findByPk').mockResolvedValue({
            getDepartments: async (options) => ({ mocked: 'yes' }),
            addDepartment: async (values, options) => setup.instance.departments[0]
          });
        }

        // Given:
        let order_id = setup.instance.orders[0].id;
        let department_id = setup.instance.departments[0].id;
        let endpoint = `${API_BASE}/${order_id}/departments/${department_id}`;
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
      it(`${uuid()} - order param id is malformed`, async () => {
        // Given:
        let order_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let department_id = setup.instance.departments[0].id;
        let endpoint = `${API_BASE}/${order_id}/departments/${department_id}`;
        let values = { extra: { units: 20 } };

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - department param id is malformed`, async () => {
        // Given:
        let order_id = setup.instance.orders[0].id;
        let department_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let endpoint = `${API_BASE}/${order_id}/departments/${department_id}`;
        let values = { extra: { units: 20 } };

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - order is not found`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Order, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let order_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
        let department_id = setup.instance.departments[0].id;
        let endpoint = `${API_BASE}/${order_id}/departments/${department_id}`;
        let values = { extra: { units: 20 } };

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - department is not found`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Order, 'findByPk').mockResolvedValue({
            getDepartments: async (options) => null
          });
        }

        // Given:
        let order_id = setup.instance.orders[0].id;
        let department_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
        let endpoint = `${API_BASE}/${order_id}/departments/${department_id}`;
        let values = { extra: { units: 20 } };

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - order was trying to be found`, async () => {
        // Setup:
        jest.spyOn(Order, 'findByPk').mockRejectedValue(new Error('error mocked.'));

        // Given:
        let order_id = setup.instance.orders[0].id;
        let department_id = setup.instance.departments[0].id;
        let endpoint = `${API_BASE}/${order_id}/departments/${department_id}`;
        let values = { extra: { units: 20 } };

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - department was trying to be found`, async () => {
        // Setup:
        jest.spyOn(Order, 'findByPk').mockResolvedValue({
          getDepartments: async (options) => {
            throw new Error('error mocked.');
          }
        });

        // Given:
        let order_id = setup.instance.orders[0].id;
        let department_id = setup.instance.departments[0].id;
        let endpoint = `${API_BASE}/${order_id}/departments/${department_id}`;
        let values = { extra: { units: 20 } };

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - department was trying to be updated`, async () => {
        // Setup:
        jest.spyOn(Order, 'findByPk').mockResolvedValue({
          getDepartments: async (options) => ({}),
          addDepartment: async (uuid, options) => {
            throw new Error('error mocked.');
          }
        });

        // Given:
        let order_id = setup.instance.orders[0].id;
        let department_id = setup.instance.departments[0].id;
        let endpoint = `${API_BASE}/${order_id}/departments/${department_id}`;
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

  describe('remove department', () => {
    describe('should return data when:', () => {
      it(`${uuid()} - department is found and values are valid`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Order, 'findByPk').mockResolvedValue({
            getDepartments: async (payload, options) => ({}),
            removeDepartment: async (payload, options) => setup.instance.departments[0]
          });
        }

        // Given:
        let order_id = setup.instance.orders[0].id;
        let department_id = setup.instance.departments[0].id;
        let endpoint = `${API_BASE}/${order_id}/departments/${department_id}`;
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
      it(`${uuid()} - order param id is malformed`, async () => {
        // Given:
        let order_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let department_id = setup.instance.departments[0].id;
        let endpoint = `${API_BASE}/${order_id}/departments/${department_id}`;
        let options = {};

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - department param id is malformed`, async () => {
        // Given:
        let order_id = setup.instance.orders[0].id;
        let department_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let endpoint = `${API_BASE}/${order_id}/departments/${department_id}`;
        let options = {};

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - order is not found`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Order, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let order_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
        let department_id = setup.instance.departments[0].id;
        let endpoint = `${API_BASE}/${order_id}/departments/${department_id}`;
        let options = {};

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - department is not found`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Order, 'findByPk').mockResolvedValue({
            getDepartments: async (options) => null
          });
        }

        // Given:
        let order_id = setup.instance.orders[0].id;
        let department_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
        let endpoint = `${API_BASE}/${order_id}/departments/${department_id}`;
        let options = {};

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - order was trying to be found`, async () => {
        // Setup:
        jest.spyOn(Order, 'findByPk').mockRejectedValue(new Error('error mocked.'));

        // Given:
        let order_id = setup.instance.orders[0].id;
        let department_id = setup.instance.departments[0].id;
        let endpoint = `${API_BASE}/${order_id}/departments/${department_id}`;
        let options = {};

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - department was trying to be found`, async () => {
        // Setup:
        jest.spyOn(Order, 'findByPk').mockResolvedValue({
          getDepartments: async (options) => {
            throw new Error('error mocked.');
          }
        });

        // Given:
        let order_id = setup.instance.orders[0].id;
        let department_id = setup.instance.departments[0].id;
        let endpoint = `${API_BASE}/${order_id}/departments/${department_id}`;
        let options = {};

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - department was trying to be removed`, async () => {
        // Setup:
        jest.spyOn(Order, 'findByPk').mockResolvedValue({
          getDepartments: async (options) => ({}),
          removeDepartment: async (uuid, options) => {
            throw new Error('error mocked.');
          }
        });

        // Given:
        let order_id = setup.instance.orders[0].id;
        let department_id = setup.instance.departments[0].id;
        let endpoint = `${API_BASE}/${order_id}/departments/${department_id}`;
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

  describe('get employees', () => {
    describe('should return data when:', () => {
      it(`${uuid()} - query is: empty`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Order, 'findByPk').mockResolvedValue({
            getEmployees: async payload => setup.instance.employees
          });
        }

        // Given:
        let order_id = setup.instance.orders[0].id;
        let endpoint = `${API_BASE}/${order_id}/employees`;
        let options = {};

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBe(null);
      });
      it(`${uuid()} - query is: firstname=dknd`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Order, 'findByPk').mockResolvedValue({
            getEmployees: async payload => setup.instance.employees
          });
        }

        // Given:
        let order_id = setup.instance.orders[0].id;
        let endpoint = `${API_BASE}/${order_id}/employees`;
        let options = { search: { firstname: 'dknd' } };

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBe(null);
      });
      it(`${uuid()} - query is: firstname like %disk%`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Order, 'findByPk').mockResolvedValue({
            getEmployees: async payload => setup.instance.employees
          });
        }

        // Given:
        let order_id = setup.instance.orders[0].id;
        let endpoint = `${API_BASE}/${order_id}/employees`;
        let options = { search: { firstname: { like: '%disk%' } } };

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBe(null);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - order param id is malformed`, async () => {
        // Given:
        let order_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let endpoint = `${API_BASE}/${order_id}/employees`;
        let options = {};

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - order is not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Order, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let order_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
        let endpoint = `${API_BASE}/${order_id}/employees`;
        let options = {};

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - order was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Order, 'findByPk').mockRejectedValue(new Error('error mocked.'));

        // Given:
        let order_id = setup.instance.orders[0].id;
        let endpoint = `${API_BASE}/${order_id}/employees`;
        let options = {};

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - employees were trying to be found`, async () => {
        // Setup:
        jest.spyOn(Order, 'findByPk').mockResolvedValue({
          getEmployees: async (options) => {
            throw new Error('error mocked.');
          }
        });

        // Given:
        let order_id = setup.instance.orders[0].id;
        let endpoint = `${API_BASE}/${order_id}/employees`;
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

  describe('set employees', () => {
    describe('should return data when:', () => {
      it(`${uuid()} - employees are set`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Order, 'findByPk').mockResolvedValue({
            addEmployees: async payload => []
          });
        }

        // Given:
        let order_id = setup.instance.orders[0].id;
        let employees = setup.instance.employees.map(employee => employee.id);
        let endpoint = `${API_BASE}/${order_id}/employees`;

        // When:
        let res = await request("post", endpoint).send({ employees });

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBe(null);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - order param id is malformed`, async () => {
        // Given:
        let order_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let employees = setup.instance.employees.map(employee => employee.id);
        let endpoint = `${API_BASE}/${order_id}/employees`;

        // When:
        let res = await request("post", endpoint).send({ employees });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - employees id are malformed`, async () => {
        // Given:
        let order_id = setup.instance.orders[0].id;
        let employees = [
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s'
        ];
        let endpoint = `${API_BASE}/${order_id}/employees`;

        // When:
        let res = await request("post", endpoint).send({ employees });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - order is not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Order, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let order_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
        let employees = setup.instance.employees.map(employee => employee.id);
        let endpoint = `${API_BASE}/${order_id}/employees`;

        // When:
        let res = await request("post", endpoint).send({ employees });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - order was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Order, 'findByPk').mockRejectedValue(new Error('error mocked.'));

        // Given:
        let order_id = setup.instance.orders[0].id;
        let employees = setup.instance.employees.map(employee => employee.id);
        let endpoint = `${API_BASE}/${order_id}/employees`;

        // When:
        let res = await request("post", endpoint).send({ employees });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - employees were trying to be set`, async () => {
        // Setup:
        jest.spyOn(Order, 'findByPk').mockResolvedValue({
          addEmployees: async (options) => {
            throw new Error('error mocked.');
          }
        });

        // Given:
        let order_id = setup.instance.orders[0].id;
        let employees = setup.instance.employees.map(employee => employee.id);
        let endpoint = `${API_BASE}/${order_id}/employees`;

        // When:
        let res = await request("post", endpoint).send({ employees });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe('get employee', () => {
    describe('should return data when:', () => {
      it(`${uuid()} - employee is found`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Order, 'findByPk').mockResolvedValue({
            getEmployees: async (options) => setup.instance.employees[0]
          });
        }

        // Given:
        let order_id = setup.instance.orders[0].id;
        let employee_id = setup.instance.employees[0].id;
        let endpoint = `${API_BASE}/${order_id}/employees/${employee_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBe(null);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - order param id is malformed`, async () => {
        // Given:
        let order_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let employee_id = setup.instance.employees[0].id;
        let endpoint = `${API_BASE}/${order_id}/employees/${employee_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - employee param id is malformed`, async () => {
        // Given:
        let order_id = setup.instance.orders[0].id;
        let employee_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let endpoint = `${API_BASE}/${order_id}/employees/${employee_id}`;

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
          jest.spyOn(Order, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let order_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
        let employee_id = setup.instance.employees[0].id;
        let endpoint = `${API_BASE}/${order_id}/employees/${employee_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - employee is not found`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Order, 'findByPk').mockResolvedValue({
            getEmployees: async (options) => null
          });
        }

        // Given:
        let order_id = setup.instance.orders[0].id;
        let employee_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
        let endpoint = `${API_BASE}/${order_id}/employees/${employee_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - order was trying to be found`, async () => {
        // Setup:
        jest.spyOn(Order, 'findByPk').mockRejectedValue(new Error('error mocked.'));

        // Given:
        let order_id = setup.instance.orders[0].id;
        let employee_id = setup.instance.employees[0].id;
        let endpoint = `${API_BASE}/${order_id}/employees/${employee_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - employee was trying to be found`, async () => {
        // Setup:
        jest.spyOn(Order, 'findByPk').mockResolvedValue({
          getEmployees: async (options) => {
            throw new Error('error mocked.');
          }
        });

        // Given:
        let order_id = setup.instance.orders[0].id;
        let employee_id = setup.instance.employees[0].id;
        let endpoint = `${API_BASE}/${order_id}/employees/${employee_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe('update employee', () => {
    describe('should return data when:', () => {
      it(`${uuid()} - employee is found and values are valid`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Order, 'findByPk').mockResolvedValue({
            getEmployees: async (options) => ({ mocked: 'yes' }),
            addEmployee: async (values, options) => setup.instance.employees[0]
          });
        }

        // Given:
        let order_id = setup.instance.orders[0].id;
        let employee_id = setup.instance.employees[0].id;
        let endpoint = `${API_BASE}/${order_id}/employees/${employee_id}`;
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
      it(`${uuid()} - order param id is malformed`, async () => {
        // Given:
        let order_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let employee_id = setup.instance.employees[0].id;
        let endpoint = `${API_BASE}/${order_id}/employees/${employee_id}`;
        let values = { extra: { units: 20 } };

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - employee param id is malformed`, async () => {
        // Given:
        let order_id = setup.instance.orders[0].id;
        let employee_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let endpoint = `${API_BASE}/${order_id}/employees/${employee_id}`;
        let values = { extra: { units: 20 } };

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - order is not found`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Order, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let order_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
        let employee_id = setup.instance.employees[0].id;
        let endpoint = `${API_BASE}/${order_id}/employees/${employee_id}`;
        let values = { extra: { units: 20 } };

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - employee is not found`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Order, 'findByPk').mockResolvedValue({
            getEmployees: async (options) => null
          });
        }

        // Given:
        let order_id = setup.instance.orders[0].id;
        let employee_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
        let endpoint = `${API_BASE}/${order_id}/employees/${employee_id}`;
        let values = { extra: { units: 20 } };

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - order was trying to be found`, async () => {
        // Setup:
        jest.spyOn(Order, 'findByPk').mockRejectedValue(new Error('error mocked.'));

        // Given:
        let order_id = setup.instance.orders[0].id;
        let employee_id = setup.instance.employees[0].id;
        let endpoint = `${API_BASE}/${order_id}/employees/${employee_id}`;
        let values = { extra: { units: 20 } };

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - employee was trying to be found`, async () => {
        // Setup:
        jest.spyOn(Order, 'findByPk').mockResolvedValue({
          getEmployees: async (options) => {
            throw new Error('error mocked.');
          }
        });

        // Given:
        let order_id = setup.instance.orders[0].id;
        let employee_id = setup.instance.employees[0].id;
        let endpoint = `${API_BASE}/${order_id}/employees/${employee_id}`;
        let values = { extra: { units: 20 } };

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - employee was trying to be updated`, async () => {
        // Setup:
        jest.spyOn(Order, 'findByPk').mockResolvedValue({
          getEmployees: async (options) => ({}),
          addEmployee: async (uuid, options) => {
            throw new Error('error mocked.');
          }
        });

        // Given:
        let order_id = setup.instance.orders[0].id;
        let employee_id = setup.instance.employees[0].id;
        let endpoint = `${API_BASE}/${order_id}/employees/${employee_id}`;
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

  describe('remove employee', () => {
    describe('should return data when:', () => {
      it(`${uuid()} - employee is found and values are valid`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Order, 'findByPk').mockResolvedValue({
            getEmployees: async (payload, options) => ({}),
            removeEmployee: async (payload, options) => setup.instance.employees[0]
          });
        }

        // Given:
        let order_id = setup.instance.orders[0].id;
        let employee_id = setup.instance.employees[0].id;
        let endpoint = `${API_BASE}/${order_id}/employees/${employee_id}`;
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
      it(`${uuid()} - order param id is malformed`, async () => {
        // Given:
        let order_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let employee_id = setup.instance.employees[0].id;
        let endpoint = `${API_BASE}/${order_id}/employees/${employee_id}`;
        let options = {};

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - employee param id is malformed`, async () => {
        // Given:
        let order_id = setup.instance.orders[0].id;
        let employee_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let endpoint = `${API_BASE}/${order_id}/employees/${employee_id}`;
        let options = {};

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - order is not found`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Order, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let order_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
        let employee_id = setup.instance.employees[0].id;
        let endpoint = `${API_BASE}/${order_id}/employees/${employee_id}`;
        let options = {};

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - employee is not found`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Order, 'findByPk').mockResolvedValue({
            getEmployees: async (options) => null
          });
        }

        // Given:
        let order_id = setup.instance.orders[0].id;
        let employee_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
        let endpoint = `${API_BASE}/${order_id}/employees/${employee_id}`;
        let options = {};

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - order was trying to be found`, async () => {
        // Setup:
        jest.spyOn(Order, 'findByPk').mockRejectedValue(new Error('error mocked.'));

        // Given:
        let order_id = setup.instance.orders[0].id;
        let employee_id = setup.instance.employees[0].id;
        let endpoint = `${API_BASE}/${order_id}/employees/${employee_id}`;
        let options = {};

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - employee was trying to be found`, async () => {
        // Setup:
        jest.spyOn(Order, 'findByPk').mockResolvedValue({
          getEmployees: async (options) => {
            throw new Error('error mocked.');
          }
        });

        // Given:
        let order_id = setup.instance.orders[0].id;
        let employee_id = setup.instance.employees[0].id;
        let endpoint = `${API_BASE}/${order_id}/employees/${employee_id}`;
        let options = {};

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - employee was trying to be removed`, async () => {
        // Setup:
        jest.spyOn(Order, 'findByPk').mockResolvedValue({
          getEmployees: async (options) => ({}),
          removeEmployee: async (uuid, options) => {
            throw new Error('error mocked.');
          }
        });

        // Given:
        let order_id = setup.instance.orders[0].id;
        let employee_id = setup.instance.employees[0].id;
        let endpoint = `${API_BASE}/${order_id}/employees/${employee_id}`;
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

  afterEach(setup.after_each);
  afterAll(setup.after_all);
});
