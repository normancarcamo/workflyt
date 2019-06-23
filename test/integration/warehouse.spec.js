import setup_factory from './index';
import db from 'src/db/models';
import { request } from 'test/utils';
import uuid from 'uuid/v4';

const IS_INTEGRATION_MOCK = JSON.parse(process.env.MOCK);
const ERROR_MOCK = new Error('error mocked.');
const API_BASE = '/api/v1/warehouses';
const setup = setup_factory(db, IS_INTEGRATION_MOCK);
const { Warehouse } = db.sequelize.models;

describe.skip("Warehouse Service:", () => {
  beforeAll(setup.before_all);
  beforeEach(setup.before_each);

  // --------------------------------------------------------------------------

  describe("get warehouses:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - query is empty`, async () => {
        // Given:
        let options = {};

        // When:
        let res = await request("get", API_BASE).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - query is: { name: 'ccccc' }`, async () => {
        // Given:
        let options = { name: 'ccccc' };

        // When:
        let res = await request("get", API_BASE).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - query is: { name: { like: 'vvv' } }`, async () => {
        // Given:
        let options = { name: { like: 'vvv' } };

        // When:
        let res = await request("get", API_BASE).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null, false ]);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - query validation fail`, async () => {
        // Given:
        let options = { search: null };

        // When:
        let res = await request("get", API_BASE).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - action throw error`, async () => {
        // Setup:
        jest.spyOn(Warehouse, 'findAll').mockRejectedValue(ERROR_MOCK);

        // Given:
        let options = { name: 'nanana' };

        // When:
        let res = await request("get", API_BASE).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
    });
  });

  describe("create warehouses:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - values are valid`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Warehouse, 'create').mockResolvedValue(
            setup.instance.warehouses[0]
          );
        }

        // Given:
        let values = { name: 'demo' };

        // When:
        let res = await request("post", API_BASE).send(values);

        // Then:
        expect(res.statusCode).toEqual(201);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - is created by a specific user`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Warehouse, 'create').mockResolvedValue(Warehouse.build({
            ...setup.instance.warehouses[0].dataValues,
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
        let values = { name: '' };

        // When:
        let res = await request("post", API_BASE).send(values);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - action throw error`, async () => {
        // Setup:
        jest.spyOn(Warehouse, 'create').mockRejectedValue(ERROR_MOCK);

        // Given:
        let values = { name: 'warehouse a' };

        // When:
        let res = await request("post", API_BASE).send(values);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
    });
  });

  describe("get warehouse:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - warehouse is found`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Warehouse, 'findByPk').mockResolvedValue(
            setup.instance.warehouses[0]
          );
        }

        // Given:
        let warehouse_id = setup.instance.warehouses[0].id;

        // When:
        let res = await request("get", `${API_BASE}/${warehouse_id}`);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null, false ]);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - warehouse id param is malformed`, async () => {
        // Given:
        let warehouse_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111dd';

        // When:
        let res = await request("get", `${API_BASE}/${warehouse_id}`);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - warehouse is not found`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Warehouse, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let warehouse_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';

        // When:
        let res = await request("get", `${API_BASE}/${warehouse_id}`);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
    });
  });

  describe("update warehouse:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - values are valid`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Warehouse, 'findByPk').mockResolvedValue({
            update: async (payload, options) => Warehouse.build({
              ...setup.instance.warehouses[0].dataValues,
              ...payload
            })
          });
        }

        // Given:
        let warehouse_id = setup.instance.warehouses[0].id;
        let values = { name: 'warehouse a' };
        let endpoint = `${API_BASE}/${warehouse_id}`;

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
        let warehouse_id = setup.instance.warehouses[0].id;
        let values = null;
        let endpoint = `${API_BASE}/${warehouse_id}`;

        // When:
        let res = await request("put", endpoint).send(values);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - warehouse is not found`, async () => {
        // Setup:
        jest.spyOn(Warehouse, 'findByPk').mockResolvedValue(null);

        // Given:
        let warehouse_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
        let values = { name: 'warehouse a' };
        let endpoint = `${API_BASE}/${warehouse_id}`;

        // When:
        let res = await request("put", endpoint).send(values);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - warehouse was trying to be found`, async () => {
        // Setup:
        jest.spyOn(Warehouse, 'findByPk').mockRejectedValue(ERROR_MOCK);

        // Given:
        let warehouse_id = setup.instance.warehouses[0].id;
        let values = { name: 'warehouse a' };
        let endpoint = `${API_BASE}/${warehouse_id}`;

        // When:
        let res = await request("put", endpoint).send(values);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - warehouse was trying to be updated`, async () => {
        // Setup:
        jest.spyOn(Warehouse, 'findByPk').mockResolvedValue({
          update: async (payload, options) => {
            throw ERROR_MOCK;
          }
        });

        // Given:
        let warehouse_id = setup.instance.warehouses[0].id;
        let values = { name: 'warehouse a' };
        let endpoint = `${API_BASE}/${warehouse_id}`;

        // When:
        let res = await request("put", endpoint).send(values);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
    });
  });

  describe("delete warehouse:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - is deleted without options`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Warehouse, 'findByPk').mockResolvedValue({
            destroy: async (options) => {
              let warehouse = setup.instance.warehouses[0];
              warehouse.deleted_at = new Date().toISOString();
              return warehouse;
            }
          });
        }

        // Given:
        let warehouse_id = setup.instance.warehouses[0].id;
        let endpoint = `${API_BASE}/${warehouse_id}`;
        let options = {}

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - is deleted with the force option as true`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Warehouse, 'findByPk').mockResolvedValue({
            destroy: async (options) => {
              let warehouse = setup.instance.warehouses[0];
              warehouse.deleted_at = new Date().toISOString();
              return warehouse;
            }
          });
        }

        // Given:
        let warehouse_id = setup.instance.warehouses[0].id;
        let endpoint = `${API_BASE}/${warehouse_id}`;
        let options = { force: true }

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - is deleted with the force option as false`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Warehouse, 'findByPk').mockResolvedValue({
            destroy: async (options) => {
              let warehouse = setup.instance.warehouses[0];
              warehouse.deleted_at = new Date().toISOString();
              return warehouse;
            }
          });
        }

        // Given:
        let warehouse_id = setup.instance.warehouses[0].id;
        let endpoint = `${API_BASE}/${warehouse_id}`;
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
      it(`${uuid()} - warehouse id param is malformed`, async () => {
        // Given:
        let warehouse_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let endpoint = `${API_BASE}/${warehouse_id}`;
        let options = {}

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - warehouse is not found`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Warehouse, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let warehouse_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
        let endpoint = `${API_BASE}/${warehouse_id}`;
        let options = {}

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - warehouse was trying to be found`, async () => {
        // Setup:
        jest.spyOn(Warehouse, 'findByPk').mockRejectedValue(ERROR_MOCK);

        // Given:
        let warehouse_id = setup.instance.warehouses[0].id;
        let endpoint = `${API_BASE}/${warehouse_id}`;
        let options = {}

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - warehouse was trying to be deleted`, async () => {
        // Setup:
        jest.spyOn(Warehouse, 'findByPk').mockResolvedValue({
          destroy: async (options) => {
            throw ERROR_MOCK;
          }
        });

        // Given:
        let warehouse_id = setup.instance.warehouses[0].id;
        let endpoint = `${API_BASE}/${warehouse_id}`;
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

  describe('get items', () => {
    describe('should return data when:', () => {
      it(`${uuid()} - query is: empty`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Warehouse, 'findByPk').mockResolvedValue({
            getItems: async payload => setup.instance.items
          });
        }

        // Given:
        let warehouse_id = setup.instance.warehouses[0].id;
        let endpoint = `${API_BASE}/${warehouse_id}/items`;
        let options = {};

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - query is: name=dknd`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Warehouse, 'findByPk').mockResolvedValue({
            getItems: async payload => setup.instance.items
          });
        }

        // Given:
        let warehouse_id = setup.instance.warehouses[0].id;
        let endpoint = `${API_BASE}/${warehouse_id}/items`;
        let options = { name: 'dknd' };

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - query is: name like disk`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Warehouse, 'findByPk').mockResolvedValue({
            getItems: async payload => setup.instance.items
          });
        }

        // Given:
        let warehouse_id = setup.instance.warehouses[0].id;
        let endpoint = `${API_BASE}/${warehouse_id}/items`;
        let options = { name: { like: 'disk' } };

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null, false ]);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - warehouse param id is malformed`, async () => {
        // Given:
        let warehouse_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let endpoint = `${API_BASE}/${warehouse_id}/items`;
        let options = {};

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - warehouse is not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Warehouse, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let warehouse_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
        let endpoint = `${API_BASE}/${warehouse_id}/items`;
        let options = {};

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - warehouse was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Warehouse, 'findByPk').mockRejectedValue(
          new Error('error mocked.')
        );

        // Given:
        let warehouse_id = setup.instance.warehouses[0].id;
        let endpoint = `${API_BASE}/${warehouse_id}/items`;
        let options = {};

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - items were trying to be found`, async () => {
        // Setup:
        jest.spyOn(Warehouse, 'findByPk').mockResolvedValue({
          getItems: async (options) => {
            throw new Error('error mocked.');
          }
        });

        // Given:
        let warehouse_id = setup.instance.warehouses[0].id;
        let endpoint = `${API_BASE}/${warehouse_id}/items`;
        let options = {};

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
    });
  });

  describe('set items', () => {
    describe('should return data when:', () => {
      it(`${uuid()} - items are set`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Warehouse, 'findByPk').mockResolvedValue({
            addItems: async payload => []
          });
        }

        // Given:
        let warehouse_id = setup.instance.warehouses[0].id;
        let items = setup.instance.items.map(item => item.id);
        let endpoint = `${API_BASE}/${warehouse_id}/items`;

        // When:
        let res = await request("post", endpoint).send({ items });

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null, false ]);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - warehouse param id is malformed`, async () => {
        // Given:
        let warehouse_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let items = setup.instance.items.map(item => item.id);
        let endpoint = `${API_BASE}/${warehouse_id}/items`;

        // When:
        let res = await request("post", endpoint).send({ items });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - items id are malformed`, async () => {
        // Given:
        let warehouse_id = setup.instance.warehouses[0].id;
        let items = [
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s'
        ];
        let endpoint = `${API_BASE}/${warehouse_id}/items`;

        // When:
        let res = await request("post", endpoint).send({ items });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - warehouse is not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Warehouse, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let warehouse_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
        let items = setup.instance.items.map(item => item.id);
        let endpoint = `${API_BASE}/${warehouse_id}/items`;

        // When:
        let res = await request("post", endpoint).send({ items });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - warehouse was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Warehouse, 'findByPk').mockRejectedValue(
          new Error('error mocked.')
        );

        // Given:
        let warehouse_id = setup.instance.warehouses[0].id;
        let items = setup.instance.items.map(item => item.id);
        let endpoint = `${API_BASE}/${warehouse_id}/items`;

        // When:
        let res = await request("post", endpoint).send({ items });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - items were trying to be set`, async () => {
        // Setup:
        jest.spyOn(Warehouse, 'findByPk').mockResolvedValue({
          addItems: async (options) => {
            throw new Error('error mocked.');
          }
        });

        // Given:
        let warehouse_id = setup.instance.warehouses[0].id;
        let items = setup.instance.items.map(item => item.id);
        let endpoint = `${API_BASE}/${warehouse_id}/items`;

        // When:
        let res = await request("post", endpoint).send({ items });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
    });
  });

  describe('get item', () => {
    describe('should return data when:', () => {
      it(`${uuid()} - item is found`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Warehouse, 'findByPk').mockResolvedValue({
            getItems: async (options) => setup.instance.items[0]
          });
        }

        // Given:
        let warehouse_id = setup.instance.warehouses[0].id;
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${warehouse_id}/items/${item_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null, false ]);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - warehouse param id is malformed`, async () => {
        // Given:
        let warehouse_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${warehouse_id}/items/${item_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - item param id is malformed`, async () => {
        // Given:
        let warehouse_id = setup.instance.warehouses[0].id;
        let item_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let endpoint = `${API_BASE}/${warehouse_id}/items/${item_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - warehouse is not found`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Warehouse, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let warehouse_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${warehouse_id}/items/${item_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - item is not found`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Warehouse, 'findByPk').mockResolvedValue({
            getItems: async (options) => null
          });
        }

        // Given:
        let warehouse_id = setup.instance.warehouses[0].id;
        let item_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
        let endpoint = `${API_BASE}/${warehouse_id}/items/${item_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - warehouse was trying to be found`, async () => {
        // Setup:
        jest.spyOn(Warehouse, 'findByPk').mockRejectedValue(
          new Error('error mocked.')
        );

        // Given:
        let warehouse_id = setup.instance.warehouses[0].id;
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${warehouse_id}/items/${item_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - item was trying to be found`, async () => {
        // Setup:
        jest.spyOn(Warehouse, 'findByPk').mockResolvedValue({
          getItems: async (options) => {
            throw new Error('error mocked.');
          }
        });

        // Given:
        let warehouse_id = setup.instance.warehouses[0].id;
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${warehouse_id}/items/${item_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
    });
  });

  describe('update item', () => {
    describe('should return data when:', () => {
      it(`${uuid()} - item is found and values are valid`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Warehouse, 'findByPk').mockResolvedValue({
            getItems: async (options) => ({ mocked: 'yes' }),
            addItem: async (values, options) => {
              return setup.instance.items[0];
            }
          });
        }

        // Given:
        let warehouse_id = setup.instance.warehouses[0].id;
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${warehouse_id}/items/${item_id}`;
        let values = { extra: { units: 20 } };

        // When:
        let res = await request("put", endpoint).send(values);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null, false ]);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - warehouse param id is malformed`, async () => {
        // Given:
        let warehouse_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${warehouse_id}/items/${item_id}`;
        let values = { extra: { units: 20 } };

        // When:
        let res = await request("put", endpoint).send(values);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - item param id is malformed`, async () => {
        // Given:
        let warehouse_id = setup.instance.warehouses[0].id;
        let item_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let endpoint = `${API_BASE}/${warehouse_id}/items/${item_id}`;
        let values = { extra: { units: 20 } };

        // When:
        let res = await request("put", endpoint).send(values);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - warehouse is not found`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Warehouse, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let warehouse_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${warehouse_id}/items/${item_id}`;
        let values = { extra: { units: 20 } };

        // When:
        let res = await request("put", endpoint).send(values);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - item is not found`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Warehouse, 'findByPk').mockResolvedValue({
            getItems: async (options) => null
          });
        }

        // Given:
        let warehouse_id = setup.instance.warehouses[0].id;
        let item_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
        let endpoint = `${API_BASE}/${warehouse_id}/items/${item_id}`;
        let values = { extra: { units: 20 } };

        // When:
        let res = await request("put", endpoint).send(values);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - warehouse was trying to be found`, async () => {
        // Setup:
        jest.spyOn(Warehouse, 'findByPk').mockRejectedValue(
          new Error('error mocked.')
        );

        // Given:
        let warehouse_id = setup.instance.warehouses[0].id;
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${warehouse_id}/items/${item_id}`;
        let values = { extra: { units: 20 } };

        // When:
        let res = await request("put", endpoint).send(values);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - item was trying to be found`, async () => {
        // Setup:
        jest.spyOn(Warehouse, 'findByPk').mockResolvedValue({
          getItems: async (options) => {
            throw new Error('error mocked.');
          }
        });

        // Given:
        let warehouse_id = setup.instance.warehouses[0].id;
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${warehouse_id}/items/${item_id}`;
        let values = { extra: { units: 20 } };

        // When:
        let res = await request("put", endpoint).send(values);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - item was trying to be updated`, async () => {
        // Setup:
        jest.spyOn(Warehouse, 'findByPk').mockResolvedValue({
          getItems: async (options) => ({}),
          addItem: async (uuid, options) => {
            throw new Error('error mocked.');
          }
        });

        // Given:
        let warehouse_id = setup.instance.warehouses[0].id;
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${warehouse_id}/items/${item_id}`;
        let values = { extra: { units: 20 } };

        // When:
        let res = await request("put", endpoint).send(values);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
    });
  });

  describe('remove item', () => {
    describe('should return data when:', () => {
      it(`${uuid()} - is found and values are valid`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Warehouse, 'findByPk').mockResolvedValue({
            getItems: async (payload, options) => ({}),
            removeItem: async (payload, options) => {
              return setup.instance.items[0];
            }
          });
        }

        // Given:
        let warehouse_id = setup.instance.warehouses[0].id;
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${warehouse_id}/items/${item_id}`;
        let options = {};

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null, false ]);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - warehouse param id is malformed`, async () => {
        // Given:
        let warehouse_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${warehouse_id}/items/${item_id}`;
        let options = {};

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - item param id is malformed`, async () => {
        // Given:
        let warehouse_id = setup.instance.warehouses[0].id;
        let item_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let endpoint = `${API_BASE}/${warehouse_id}/items/${item_id}`;
        let options = {};

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - warehouse is not found`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Warehouse, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let warehouse_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${warehouse_id}/items/${item_id}`;
        let options = {};

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - item is not found`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Warehouse, 'findByPk').mockResolvedValue({
            getItems: async (options) => null
          });
        }

        // Given:
        let warehouse_id = setup.instance.warehouses[0].id;
        let item_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
        let endpoint = `${API_BASE}/${warehouse_id}/items/${item_id}`;
        let options = {};

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - warehouse was trying to be found`, async () => {
        // Setup:
        jest.spyOn(Warehouse, 'findByPk').mockRejectedValue(
          new Error('error mocked.')
        );

        // Given:
        let warehouse_id = setup.instance.warehouses[0].id;
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${warehouse_id}/items/${item_id}`;
        let options = {};

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - item was trying to be found`, async () => {
        // Setup:
        jest.spyOn(Warehouse, 'findByPk').mockResolvedValue({
          getItems: async (options) => {
            throw new Error('error mocked.');
          }
        });

        // Given:
        let warehouse_id = setup.instance.warehouses[0].id;
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${warehouse_id}/items/${item_id}`;
        let options = {};

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null, false ]);
      });
      it(`${uuid()} - item was trying to be removed`, async () => {
        // Setup:
        jest.spyOn(Warehouse, 'findByPk').mockResolvedValue({
          getItems: async (options) => ({}),
          removeItem: async (uuid, options) => {
            throw new Error('error mocked.');
          }
        });

        // Given:
        let warehouse_id = setup.instance.warehouses[0].id;
        let item_id = setup.instance.items[0].id;
        let endpoint = `${API_BASE}/${warehouse_id}/items/${item_id}`;
        let options = {};

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
