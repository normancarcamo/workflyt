import { setup, scenario } from '../setup/warehouse.setup';
import { request } from 'test/utils';

const API_BASE = `/api/v1/warehouses`;

describe("Warehouse Service:", () => {
  beforeAll(setup.before_all);
  beforeEach(setup.before_each);

  // --------------------------------------------------------------------------

  describe("get warehouses", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.get_warehouses.pass) {
        it(description, async () => {
          // Setup:
          scenario.get_warehouses.mock({ input, fail: false });

          // Given:
          let querystring = input();

          // When:
          let res = await request("get", API_BASE).query(querystring);

          // Then:
          expect(res.statusCode).toEqual(200);
          expect(res.body.data).toBeDefined();
          expect(res.body.error).toBe(null);
        });
      }
    });
    describe('should return error when:', () => {
      for (let { id, description, input } of scenario.get_warehouses.fail) {
        it(description, async () => {
          // Setup:
          scenario.get_warehouses.mock({ input, fail: true });

          // Given:
          let querystring = input();

          // When:
          let res = await request("get", API_BASE).query(querystring);

          // Then:
          expect(res.statusCode).toBeWithin(400, 522);
          expect(res.body.error).toBeDefined();
          expect(res.body.data).toBeOneOf([ undefined, null ]);
        });
      }
    });
  });

  describe("create warehouses:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.create_warehouses.pass) {
        it(description, async () => {
          // Given:
          scenario.create_warehouses.mock({ input, fail: false });

          // When:
          let res = await request("post", API_BASE).send(input());

          // Then:
          expect(res.statusCode).toEqual(201);
          expect(res.body.data).toBeDefined();
          expect(res.body.error).toBeOneOf([ undefined, null ]);
        });
      }
    });
    describe('should return error when:', () => {
      for (let { id, description, input } of scenario.create_warehouses.fail) {
        it(description, async () => {
          // Given:
          scenario.create_warehouses.mock({ input, fail: true });

          // When:
          let res = await request("post", API_BASE).send(input());

          // Then:
          expect(res.statusCode).toBeWithin(400, 522);
          expect(res.body.error).toBeDefined();
          expect(res.body.data).toBeOneOf([ undefined, null ]);
        });
      }
    });
  });

  // --------------------------------------------------------------------------

  describe("get warehouse:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.get_warehouse.pass) {
        it(description, async () => {
          // Setup:
          scenario.get_warehouse.mock({ input, fail: false });

          // Given:
          let { warehouse_id } = input();

          // When:
          let res = await request("get", `${API_BASE}/${warehouse_id}`);

          // Then:
          expect(res.statusCode).toEqual(200);
          expect(res.body.data).toBeDefined();
          expect(res.body.error).toBeOneOf([ undefined, null ]);
        });
      }
    });
    describe('should return error when:', () => {
      for (let { id, description, input } of scenario.get_warehouse.fail) {
        it(description, async () => {
          // Setup:
          scenario.get_warehouse.mock({ input, fail: true });

          // Given:
          let { warehouse_id } = input();

          // When:
          let res = await request("get", `${API_BASE}/${warehouse_id}`);

          // Then:
          expect(res.statusCode).toBeWithin(400, 522);
          expect(res.body.error).toBeDefined();
          expect(res.body.data).toBeOneOf([ undefined, null ]);
        });
      }
    });
  });

  describe("update warehouse:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.update_warehouse.pass) {
        it(description, async () => {
          // Setup:
          scenario.update_warehouse.mock({ input, fail: false });

          // Given:
          let { warehouse_id, values } = input();
          let endpoint = `${API_BASE}/${warehouse_id}`;

          // When:
          let res = await request("put", endpoint).send({ values });

          // Then:
          expect(res.statusCode).toEqual(200);
          expect(res.body.data).toBeDefined();
          expect(res.body.error).toBeOneOf([ undefined, null ]);
        });
      }
    });
    describe('should return error when:', () => {
      for (let { id, description, input } of scenario.update_warehouse.fail) {
        it(description, async () => {
          // Setup:
          scenario.update_warehouse.mock({ input, fail: true });

          // Given:
          let { warehouse_id, values } = input();
          let endpoint = `${API_BASE}/${warehouse_id}`;

          // When:
          let res = await request("put", endpoint).send({ values });

          // Then:
          expect(res.statusCode).toBeWithin(400, 522);
          expect(res.body.error).toBeDefined();
          expect(res.body.data).toBeOneOf([ undefined, null ]);
        });
      }
    });
  });

  describe("delete warehouse:", () => {
    describe('should return data object empty when:', () => {
      for (let { id, description, input } of scenario.delete_warehouse.pass) {
        it(description, async () => {
          // Setup:
          scenario.delete_warehouse.mock({ input, fail: false });

          // Given:
          let { warehouse_id, query } = input();
          let endpoint = `${API_BASE}/${warehouse_id}`;

          // When:
          let res = await request("delete", endpoint).query(query);

          // Then:
          expect(res.statusCode).toEqual(200);
          expect(res.body.data).toBeDefined();
          expect(res.body.error).toBeOneOf([ undefined, null ]);
        });
      }
    });
    describe('should return error when:', () => {
      for (let { id, description, input } of scenario.delete_warehouse.fail) {
        it(description, async () => {
          // Setup:
          scenario.delete_warehouse.mock({ input, fail: true });

          // Given:
          let { warehouse_id, query } = input();
          let endpoint = `${API_BASE}/${warehouse_id}`;

          // When:
          let res = await request("delete", endpoint).query(query);

          // Then:
          expect(res.statusCode).toBeWithin(400, 522);
          expect(res.body.error).toBeDefined();
          expect(res.body.data).toBeOneOf([ undefined, null ]);
        });
      }
    });
  });

  // --------------------------------------------------------------------------

  describe("get items:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.get_items.pass) {
        it(description, async () => {
          // Setup:
          scenario.get_items.mock({ input, fail: false });

          // Given:
          let { warehouse_id, query } = input();
          let endpoint = `${API_BASE}/${warehouse_id}/items`;

          // When:
          let res = await request("get", endpoint).query(query);

          // Then:
          expect(res.statusCode).toEqual(200);
          expect(res.body.data).toBeDefined();
          expect(res.body.error).toBe(null);
        });
      }
    });
    describe('should return error when:', () => {
      for (let { id, description, input } of scenario.get_items.fail) {
        it(description, async () => {
          // Setup:
          scenario.get_items.mock({ input, fail: true });

          // Given:
          let { warehouse_id, query } = input();
          let endpoint = `${API_BASE}/${warehouse_id}/items`;

          // When:
          let res = await request("get", endpoint).query(query);

          // Then:
          expect(res.statusCode).toBeWithin(400, 522);
          expect(res.body.error).toBeDefined();
          expect(res.body.data).toBeOneOf([ undefined, null ]);
        });
      }
    });
  });

  describe("add items:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.add_items.pass) {
        it(description, async () => {
          // Setup:
          scenario.add_items.mock({ input, fail: false });

          // Given:
          let { warehouse_id, items } = input();
          let endpoint = `${API_BASE}/${warehouse_id}/items`;

          // When:
          let res = await request("post", endpoint).send({ values: items });

          // Then:
          expect(res.statusCode).toEqual(200);
          expect(res.body.data).toBeDefined();
          expect(res.body.error).toBeOneOf([ undefined, null ]);
        });
      }
    });
    describe('should return error when:', () => {
      for (let { id, description, input } of scenario.add_items.fail) {
        it(description, async () => {
          // Setup:
          scenario.add_items.mock({ input, fail: true });

          // Given:
          let { warehouse_id, items } = input();
          let endpoint = `${API_BASE}/${warehouse_id}/items`;

          // When:
          let res = await request("post", endpoint).send({ values: items });

          // Then:
          expect(res.statusCode).toBeWithin(400, 522);
          expect(res.body.error).toBeDefined();
          expect(res.body.data).toBeOneOf([ undefined, null ]);
        });
      }
    });
  });

  // --------------------------------------------------------------------------

  describe("get item:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.get_item.pass) {
        it(description, async () => {
          // Setup:
          scenario.get_item.mock({ input, fail: false });

          // Given:
          let { warehouse_id, item_id } = input();
          let endpoint = `${API_BASE}/${warehouse_id}/items/${item_id}`;

          // When:
          let res = await request("get", endpoint);

          // Then:
          expect(res.statusCode).toEqual(200);
          expect(res.body.data).toBeDefined();
          expect(res.body.error).toBe(null);
        });
      }
    });
    describe('should return error when:', () => {
      for (let { id, description, input } of scenario.get_item.fail) {
        it(description, async () => {
          // Setup:
          scenario.get_item.mock({ input, fail: true });

          // Given:
          let { warehouse_id, item_id } = input();
          let endpoint = `${API_BASE}/${warehouse_id}/items/${item_id}`;

          // When:
          let res = await request("get", endpoint);

          // Then:
          expect(res.statusCode).toBeWithin(400, 522);
          expect(res.body.error).toBeDefined();
          expect(res.body.data).toBeOneOf([ undefined, null ]);
        });
      }
    });
  });

  describe("update item:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.update_item.pass) {
        it(description, async () => {
          // Setup:
          scenario.update_item.mock({ input, fail: false });

          // Given:
          let { warehouse_id, item_id, values } = input();
          let endpoint = `${API_BASE}/${warehouse_id}/items/${item_id}`;

          // When:
          let res = await request("put", endpoint).send({ values });

          // Then:
          expect(res.statusCode).toEqual(200);
          expect(res.body.data).toBeDefined();
          expect(res.body.error).toBe(null);
        });
      }
    });
    describe('should return error when:', () => {
      for (let { id, description, input } of scenario.update_item.fail) {
        it(description, async () => {
          // Setup:
          scenario.update_item.mock({ input, fail: true });

          // Given:
          let { warehouse_id, item_id, values } = input();
          let endpoint = `${API_BASE}/${warehouse_id}/items/${item_id}`;

          // When:
          let res = await request("put", endpoint).send({ values });

          // Then:
          expect(res.statusCode).toBeWithin(400, 522);
          expect(res.body.error).toBeDefined();
          expect(res.body.data).toBeOneOf([ undefined, null ]);
        });
      }
    });
  });

  describe("remove item:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.remove_item.pass) {
        it(description, async () => {
          // Setup:
          scenario.remove_item.mock({ input, fail: false });

          // Given:
          let { warehouse_id, item_id } = input();
          let endpoint = `${API_BASE}/${warehouse_id}/items/${item_id}`;

          // When:
          let res = await request("delete", endpoint);

          // Then:
          expect(res.statusCode).toEqual(200);
          expect(res.body.data).toBeDefined();
          expect(res.body.error).toBe(null);
        });
      }
    });
    describe('should return error when:', () => {
      for (let { id, description, input } of scenario.remove_item.fail) {
        it(description, async () => {
          // Setup:
          scenario.remove_item.mock({ input, fail: true });

          // Given:
          let { warehouse_id, item_id } = input();
          let endpoint = `${API_BASE}/${warehouse_id}/items/${item_id}`;

          // When:
          let res = await request("delete", endpoint);

          // Then:
          expect(res.statusCode).toBeWithin(400, 522);
          expect(res.body.error).toBeDefined();
          expect(res.body.data).toBeOneOf([ undefined, null ]);
        });
      }
    });
  });

  // --------------------------------------------------------------------------

  afterEach(setup.after_each);
  afterAll(setup.after_all);
});
