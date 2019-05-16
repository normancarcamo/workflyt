import setup_factory from './index';
import db from 'src/db/models';
import { request } from 'test/utils';
import uuid from 'uuid/v4';

const IS_INTEGRATION_MOCK = JSON.parse(process.env.MOCK);
const ERROR_MOCK = new Error('error mocked.');
const API_BASE = '/api/v1/items';
const setup = setup_factory(db, IS_INTEGRATION_MOCK);
const { Item } = db.sequelize.models;

describe("Item Service:", () => {
  beforeAll(setup.before_all);
  beforeEach(setup.before_each);

  // --------------------------------------------------------------------------

  describe("get items:", () => {
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
        jest.spyOn(Item, 'findAll').mockRejectedValue(ERROR_MOCK);

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

  describe("create item:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - values are valid`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Item, 'create').mockResolvedValue(setup.instance.items[0]);
        }

        // Given:
        let values = { name: 'Norman' };

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
          jest.spyOn(Item, 'create').mockResolvedValue(Item.build({
            ...setup.instance.items[0].dataValues,
            created_by: setup.instance.users[0].id,
            updated_by: setup.instance.users[0].id,
          }));
        }

        // Given:
        let values = {
          department_id:  setup.instance.departments[0].id,
          name: 'Norman',
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
        jest.spyOn(Item, 'create').mockRejectedValue(ERROR_MOCK);

        // Given:
        let values = { name: 'Jonh' };

        // When:
        let res = await request("post", API_BASE).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe("get item:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - item is found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Item, 'findByPk').mockResolvedValue(setup.instance.items[0]);
        }

        // Given:
        let item_id = setup.instance.items[0].id;
        let options = {};

        // When:
        let res = await request("get", `${API_BASE}/${item_id}`).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - item id param is malformed`, async () => {
        // Given:
        let item_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111dd';

        // When:
        let res = await request("get", `${API_BASE}/${item_id}`);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - item is not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Item, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let item_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';

        // When:
        let res = await request("get", `${API_BASE}/${item_id}`);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - item was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Item, 'findByPk').mockRejectedValue(ERROR_MOCK);

        // Given:
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${item_id}`;
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

  describe("update item:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - values are valid`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Item, 'findByPk').mockResolvedValue({
            update: async (values, options) => Item.build({
              ...setup.instance.items[0].dataValues,
              ...values,
              updated_at: new Date().toISOString()
            })
          });
        }

        // Given:
        let item_id = setup.instance.items[0].id;
        let values = { name: 'doe' };
        let endpoint = `${API_BASE}/${item_id}`;

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - item id param is malformed`, async () => {
        // Given:
        let item_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let values = null;
        let endpoint = `${API_BASE}/${item_id}`;

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - item is not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Item, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let item_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
        let values = { name: 'Item A' };
        let endpoint = `${API_BASE}/${item_id}`;

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - item was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Item, 'findByPk').mockRejectedValue(ERROR_MOCK);

        // Given:
        let item_id = setup.instance.items[0].id;
        let values = { name: 'Item A' };
        let endpoint = `${API_BASE}/${item_id}`;

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - item was trying to be updated`, async () => {
        // Mock:
        jest.spyOn(Item, 'findByPk').mockResolvedValue({
          update: async (payload, options) => {
            throw ERROR_MOCK;
          }
        });

        // Given:
        let item_id = setup.instance.items[0].id;
        let values = { name: 'Item A' };
        let endpoint = `${API_BASE}/${item_id}`;

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe("delete item:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - item is deleted without options`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Item, 'findByPk').mockResolvedValue({
            destroy: async (options) => {
              let item = setup.instance.items[0];
              item.deleted_at = new Date().toISOString();
              return item;
            }
          });
        }

        // Given:
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${item_id}`;
        let options = {}

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - item is deleted with the force option as true`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Item, 'findByPk').mockResolvedValue({
            destroy: async (options) => {
              let item = setup.instance.items[0];
              item.deleted_at = new Date().toISOString();
              return item;
            }
          });
        }

        // Given:
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${item_id}`;
        let options = { force: true }

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - item is deleted with the force option as false`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Item, 'findByPk').mockResolvedValue({
            destroy: async (options) => {
              let item = setup.instance.items[0];
              item.deleted_at = new Date().toISOString();
              return item;
            }
          });
        }

        // Given:
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${item_id}`;
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
      it(`${uuid()} - item id param is malformed`, async () => {
        // Given:
        let item_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let endpoint = `${API_BASE}/${item_id}`;
        let options = {}

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - item is not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Item, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let item_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
        let endpoint = `${API_BASE}/${item_id}`;
        let options = {}

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - item was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Item, 'findByPk').mockRejectedValue(ERROR_MOCK);

        // Given:
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${item_id}`;
        let options = {}

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - item was trying to be deleted`, async () => {
        // Mock:
        jest.spyOn(Item, 'findByPk').mockResolvedValue({
          destroy: async (options) => {
            throw ERROR_MOCK;
          }
        });

        // Given:
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${item_id}`;
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

  describe("get stocks:", () => {
    describe("should return data when:", () => {
      it(`${uuid()} - query is: {}`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Item, 'findByPk').mockResolvedValue({
            getStocks: async (options) => setup.instance.stocks
          });
        }

        // Given:
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${item_id}/stocks`;
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
          jest.spyOn(Item, 'findByPk').mockResolvedValue({
            getStocks: async (options) => setup.instance.stocks
          });
        }

        // Given:
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${item_id}/stocks`;
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
          jest.spyOn(Item, 'findByPk').mockResolvedValue({
            getStocks: async (options) => setup.instance.stocks
          });
        }

        // Given:
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${item_id}/stocks`;
        let options = { search: undefined }

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - query is: { search: { entries: 23 } }`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Item, 'findByPk').mockResolvedValue({
            getStocks: async (options) => setup.instance.stocks
          });
        }

        // Given:
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${item_id}/stocks`;
        let options = { search: { entries: 23 } }

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - query is: { search: { exits: { gt: 400 } } }`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Item, 'findByPk').mockResolvedValue({
            getStocks: async (options) => setup.instance.stocks
          });
        }

        // Given:
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${item_id}/stocks`;
        let options = { search: { exits: { gt: 400 } } }

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
    });
    describe("should return error when:", () => {
      it(`${uuid()} - item id param is malformed`, async () => {
        // Given:
        let item_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let endpoint = `${API_BASE}/${item_id}/stocks`;
        let options = { search: { name: 'demo' } };

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - item is not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Item, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let item_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
        let endpoint = `${API_BASE}/${item_id}/stocks`;
        let options = { search: { name: 'demo' } };

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - item was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Item, 'findByPk').mockRejectedValue(ERROR_MOCK);

        // Given:
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${item_id}/stocks`;
        let options = { search: { name: 'demo' } };

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - stocks were trying to be found`, async () => {
        // Mock:
        jest.spyOn(Item, 'findByPk').mockResolvedValue({
          getStocks: async (options) => { throw ERROR_MOCK; }
        });

        // Given:
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${item_id}/stocks`;
        let options = { search: { name: 'demodd' } };

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe("set stocks:", () => {
    describe("should return data when:", () => {
      it(`${uuid()} - stocks are set to a item`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Item, 'findByPk').mockResolvedValue({
            addStocks: async payload => payload
          });
        }

        // Given:
        let item_id = setup.instance.items[0].id;
        let stocks = setup.instance.stocks.map(q => q.id);
        let endpoint = `${API_BASE}/${item_id}/stocks`;

        // When:
        let res = await request("post", endpoint).send({ stocks });

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
    });
    describe("should return error when:", () => {
      it(`${uuid()} - item id param is malformed`, async () => {
        // Given:
        let item_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let stocks = setup.instance.stocks.map(e => e.id);
        let endpoint = `${API_BASE}/${item_id}/stocks`;

        // When:
        let res = await request("post", endpoint).send({ stocks });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - stocks ids values are malformed`, async () => {
        // Given:
        let item_id = setup.instance.items[0].id;
        let stocks = [ '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s' ];
        let endpoint = `${API_BASE}/${item_id}/stocks`;

        // When:
        let res = await request("post", endpoint).send({ stocks });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - item is not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Item, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let item_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
        let stocks = setup.instance.stocks.map(e => e.id);
        let endpoint = `${API_BASE}/${item_id}/stocks`;

        // When:
        let res = await request("post", endpoint).send({ stocks });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - item was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Item, 'findByPk').mockRejectedValue(ERROR_MOCK);

        // Given:
        let item_id = setup.instance.items[0].id;
        let stocks = setup.instance.stocks.map(e => e.id);
        let endpoint = `${API_BASE}/${item_id}/stocks`;

        // When:
        let res = await request("post", endpoint).send({ stocks });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - stocks were trying to be set`, async () => {
        // Mock:
        jest.spyOn(Item, 'findByPk').mockResolvedValue({
          addStocks: async (payload, options) => {
            throw ERROR_MOCK;
          }
        });

        // Given:
        let item_id = setup.instance.items[0].id;
        let stocks = setup.instance.stocks.map(e => e.id);
        let endpoint = `${API_BASE}/${item_id}/stocks`;

        // When:
        let res = await request("post", endpoint).send({ stocks });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe("get stock:", () => {
    describe("should return data when:", () => {
      it(`${uuid()} - stock is found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Item, 'findByPk').mockResolvedValue({
            getStocks: async payload => setup.instance.stocks[0]
          });
        }

        // Given:
        let item_id = setup.instance.items[0].id;
        let stock_id = setup.instance.stocks[0].id;
        let endpoint = `${API_BASE}/${item_id}/stocks/${stock_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
    });
    describe("should return error when:", () => {
      it(`${uuid()} - item id param is malformed`, async () => {
        // Given:
        let item_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll';
        let stock_id = setup.instance.stocks[0].id;
        let endpoint = `${API_BASE}/${item_id}/stocks/${stock_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - stock id param is malformed`, async () => {
        // Given:
        let item_id = setup.instance.items[0].id;
        let stock_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll';
        let endpoint = `${API_BASE}/${item_id}/stocks/${stock_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - item is not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Item, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let item_id = '5dc8dfea-34c1-4280-bb5e-d18af9296fc1';
        let stock_id = setup.instance.stocks[0].id;
        let endpoint = `${API_BASE}/${item_id}/stocks/${stock_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - stock is not found`, async () => {
        // Mock:
        jest.spyOn(Item, 'findByPk').mockResolvedValue({
          getStocks: async payload => null
        });

        // Given:
        let item_id = setup.instance.items[0].id;
        let stock_id = '5dc8dfea-34c1-4280-bb5e-d18af9296fc1';
        let endpoint = `${API_BASE}/${item_id}/stocks/${stock_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - item was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Item, 'findByPk').mockRejectedValue(ERROR_MOCK);

        // Given:
        let item_id = setup.instance.items[0].id;
        let stock_id = setup.instance.stocks[0].id;
        let endpoint = `${API_BASE}/${item_id}/stocks/${stock_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - stock was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Item, 'findByPk').mockResolvedValue({
          getStocks: async payload => {
            throw ERROR_MOCK;
          }
        });

        // Given:
        let item_id = setup.instance.items[0].id;
        let stock_id = setup.instance.stocks[0].id;
        let endpoint = `${API_BASE}/${item_id}/stocks/${stock_id}`;

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
