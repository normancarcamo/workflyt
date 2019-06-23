import setup_factory from './index';
import db from 'src/db/models';
import { request } from 'test/utils';
import uuid from 'uuid/v4';

const IS_INTEGRATION_MOCK = JSON.parse(process.env.MOCK);
const ERROR_MOCK = new Error('error mocked.');
const API_BASE = '/api/v1/stocks';
const setup = setup_factory(db, IS_INTEGRATION_MOCK);
const { Stock } = db.sequelize.models;

describe.skip("Stock Service:", () => {
  beforeAll(setup.before_all);
  beforeEach(setup.before_each);

  // --------------------------------------------------------------------------

  describe("get stocks:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - query is empty`, async () => {
        // Given:
        let querystring = {};

        // When:
        let res = await request("get", API_BASE).query(querystring);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - query is: { entries: 3 }`, async () => {
        // Given:
        let querystring = { entries: 3 };

        // When:
        let res = await request("get", API_BASE).query(querystring);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - query is: { exits: { gte: 5 } }`, async () => {
        // Given:
        let querystring = { exits: { gte: 5 } };

        // When:
        let res = await request("get", API_BASE).query(querystring);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null, false ]);
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
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - Action throw error`, async () => {
        // Mock:
        jest.spyOn(Stock, 'findAll').mockRejectedValue(ERROR_MOCK);

        // Given:
        let querystring = { exits: { gte: 5 } };

        // When:
        let res = await request("get", API_BASE).query(querystring);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
    });
  });

  describe("create stocks:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - values are valid`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Stock, 'create').mockResolvedValue(
            setup.instance.stocks[0]
          );
        }

        // Given:
        let values = {
          item_id: setup.instance.items[0].id,
          entries: 38
        };

        // When:
        let res = await request("post", API_BASE).send(values);

        // Then:
        expect(res.statusCode).toEqual(201);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - is created by a specific user`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Stock, 'create').mockResolvedValue(Stock.build({
            ...setup.instance.stocks[0].dataValues,
            created_by: setup.instance.users[0].id,
            updated_by: setup.instance.users[0].id,
          }));
        }

        // Given:
        let values = {
          item_id: setup.instance.items[0].id,
          entries: 38,
          created_by: setup.instance.users[0].id,
          updated_by: setup.instance.users[0].id
        };

        // When:
        let res = await request("post", API_BASE).send(values);

        // Then:
        expect(res.statusCode).toEqual(201);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null, false ]);
        expect(res.body.data.created_by).toEqual(setup.instance.users[0].id);
        expect(res.body.data.updated_by).toEqual(setup.instance.users[0].id);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - values are not valid`, async () => {
        // Given:
        let values = null;

        // When:
        let res = await request("post", API_BASE).send(values);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - value "name" is not valid`, async () => {
        // Given:
        let values = {
          item_id: setup.instance.items[0].id,
          entries: -3
        };

        // When:
        let res = await request("post", API_BASE).send(values);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - action throw error`, async () => {
        // Mock:
        jest.spyOn(Stock, 'create').mockRejectedValue(ERROR_MOCK);

        // Given:
        let values = {
          item_id: setup.instance.items[0].id,
          entries: 38
        };

        // When:
        let res = await request("post", API_BASE).send(values);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
    });
  });

  describe("get Stock:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - Stock is found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Stock, 'findByPk').mockResolvedValue(
            setup.instance.stocks[0]
          );
        }

        // Given:
        let stock_id = setup.instance.stocks[0].id;

        // When:
        let res = await request("get", `${API_BASE}/${stock_id}`);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null, false ]);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - Stock id param is malformed`, async () => {
        // Given:
        let stock_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111dd';

        // When:
        let res = await request("get", `${API_BASE}/${stock_id}`);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - Stock is not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Stock, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let stock_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';

        // When:
        let res = await request("get", `${API_BASE}/${stock_id}`);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - Stock was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Stock, 'findByPk').mockRejectedValue(ERROR_MOCK);

        // Given:
        let stock_id = setup.instance.stocks[0].id;

        // When:
        let res = await request("get", `${API_BASE}/${stock_id}`);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
    });
  });

  describe("update Stock:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - values are valid`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Stock, 'findByPk').mockResolvedValue({
            update: async (payload, options) => Stock.build({
              ...setup.instance.stocks[0].dataValues,
              ...payload
            })
          });
        }

        // Given:
        let stock_id = setup.instance.stocks[0].id;
        let values = { entries: 50 };
        let endpoint = `${API_BASE}/${stock_id}`;

        // When:
        let res = await request("put", endpoint).send(values);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null, false ]);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - values are not valid`, async () => {
        // Given:
        let stock_id = setup.instance.stocks[0].id;
        let values = null;
        let endpoint = `${API_BASE}/${stock_id}`;

        // When:
        let res = await request("put", endpoint).send(values);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - Stock is not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Stock, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let stock_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
        let values = { exits: 56 };
        let endpoint = `${API_BASE}/${stock_id}`;

        // When:
        let res = await request("put", endpoint).send(values);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - Stock was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Stock, 'findByPk').mockRejectedValue(ERROR_MOCK);

        // Given:
        let stock_id = setup.instance.stocks[0].id;
        let values = { exits: 56 };
        let endpoint = `${API_BASE}/${stock_id}`;

        // When:
        let res = await request("put", endpoint).send(values);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - Stock was trying to be updated`, async () => {
        // Mock:
        jest.spyOn(Stock, 'findByPk').mockResolvedValue({
          update: async (payload, options) => {
            throw ERROR_MOCK;
          }
        });

        // Given:
        let stock_id = setup.instance.stocks[0].id;
        let values = { exits: 56 };
        let endpoint = `${API_BASE}/${stock_id}`;

        // When:
        let res = await request("put", endpoint).send(values);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
    });
  });

  describe("delete Stock:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - is deleted without options`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Stock, 'findByPk').mockResolvedValue({
            destroy: async (options) => {
              let stock = setup.instance.stocks[0];
              stock.deleted_at = new Date().toISOString();
              return stock;
            }
          });
        }

        // Given:
        let stock_id = setup.instance.stocks[0].id;
        let endpoint = `${API_BASE}/${stock_id}`;
        let options = {}

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - is deleted with the force option as true`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Stock, 'findByPk').mockResolvedValue({
            destroy: async (options) => {
              let stock = setup.instance.stocks[0];
              stock.deleted_at = new Date().toISOString();
              return stock;
            }
          });
        }

        // Given:
        let stock_id = setup.instance.stocks[0].id;
        let endpoint = `${API_BASE}/${stock_id}`;
        let options = { force: true }

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - is deleted with the force option as false`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Stock, 'findByPk').mockResolvedValue({
            destroy: async (options) => {
              let stock = setup.instance.stocks[0];
              stock.deleted_at = new Date().toISOString();
              return stock;
            }
          });
        }

        // Given:
        let stock_id = setup.instance.stocks[0].id;
        let endpoint = `${API_BASE}/${stock_id}`;
        let options = { force: false }

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null, false ]);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - id param is malformed`, async () => {
        // Given:
        let stock_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let endpoint = `${API_BASE}/${stock_id}`;
        let options = {}

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - is not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Stock, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let stock_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
        let endpoint = `${API_BASE}/${stock_id}`;
        let options = {}

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Stock, 'findByPk').mockRejectedValue(ERROR_MOCK);

        // Given:
        let stock_id = setup.instance.stocks[0].id;
        let endpoint = `${API_BASE}/${stock_id}`;
        let options = {}

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - was trying to be deleted`, async () => {
        // Mock:
        jest.spyOn(Stock, 'findByPk').mockResolvedValue({
          destroy: async (options) => {
            throw ERROR_MOCK;
          }
        });

        // Given:
        let stock_id = setup.instance.stocks[0].id;
        let endpoint = `${API_BASE}/${stock_id}`;
        let options = {}

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
    });
  });

  // --------------------------------------------------------------------------

  afterEach(setup.after_each);
  afterAll(setup.after_all);
});
