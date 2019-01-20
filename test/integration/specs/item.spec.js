import { setup, scenario } from '../setup/item.setup';
import { request } from 'test/utils';

const API_BASE = `/api/v1/items`;

describe("Item Service", () => {
  beforeAll(setup.before_all);
  beforeEach(setup.before_each);

  describe("get items", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.get_items.pass) {
        it(description, async () => {
          // Setup:
          scenario.get_items.mock({ input, fail: false });

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
      for (let { id, description, input } of scenario.get_items.fail) {
        it(description, async () => {
          // Setup:
          scenario.get_items.mock({ input, fail: true });

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

  describe("create items:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.create_items.pass) {
        it(description, async () => {
          // Given:
          scenario.create_items.mock({ input, fail: false });

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
      for (let { id, description, input } of scenario.create_items.fail) {
        it(description, async () => {
          // Given:
          scenario.create_items.mock({ input, fail: true });

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

  describe("get item:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.get_item.pass) {
        it(description, async () => {
          // Setup:
          scenario.get_item.mock({ input, fail: false });

          // Given:
          let { item_id } = input();

          // When:
          let res = await request("get", `${API_BASE}/${item_id}`);

          // Then:
          expect(res.statusCode).toEqual(200);
          expect(res.body.data).toBeDefined();
          expect(res.body.error).toBeOneOf([ undefined, null ]);
        });
      }
    });
    describe('should return error when:', () => {
      for (let { id, description, input } of scenario.get_item.fail) {
        it(description, async () => {
          // Setup:
          scenario.get_item.mock({ input, fail: true });

          // Given:
          let { item_id } = input();

          // When:
          let res = await request("get", `${API_BASE}/${item_id}`);

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
          let { item_id, values } = input();
          let endpoint = `${API_BASE}/${item_id}`;

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
      for (let { id, description, input } of scenario.update_item.fail) {
        it(description, async () => {
          // Setup:
          scenario.update_item.mock({ input, fail: true });

          // Given:
          let { item_id, values } = input();
          let endpoint = `${API_BASE}/${item_id}`;

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

  describe("delete item:", () => {
    describe('should return data object empty when:', () => {
      for (let { id, description, input } of scenario.delete_item.pass) {
        it(description, async () => {
          // Setup:
          scenario.delete_item.mock({ input, fail: false });

          // Given:
          let { item_id, query } = input();
          let endpoint = `${API_BASE}/${item_id}`;

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
      for (let { id, description, input } of scenario.delete_item.fail) {
        it(description, async () => {
          // Setup:
          scenario.delete_item.mock({ input, fail: true });

          // Given:
          let { item_id, query } = input();
          let endpoint = `${API_BASE}/${item_id}`;

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

  describe("get types:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.get_types.pass) {
        it(description, async () => {
          // Setup:
          scenario.get_types.mock({ input, fail: false });

          // Given:
          let { item_id, query} = input();
          let endpoint = `${API_BASE}/${item_id}/types`;

          // When:
          let res = await request("get", endpoint).query(query);

          // Then:
          expect(res.statusCode).toEqual(200);
          expect(res.body.data).toBeDefined();
          expect(res.body.error).toBeOneOf([ undefined, null ]);
        });
      }
    });
    describe('should return error when:', () => {
      for (let { id, description, input } of scenario.get_types.fail) {
        it(description, async () => {
          // Setup:
          scenario.get_types.mock({ input, fail: true });

          // Given:
          let { item_id, query} = input();
          let endpoint = `${API_BASE}/${item_id}/types`;

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

  describe("add types:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.add_types.pass) {
        it(description, async () => {
          // Setup:
          scenario.add_types.mock({ input, fail: false });

          // Given:
          let { item_id, types } = input();
          let endpoint = `${API_BASE}/${item_id}/types`;

          // When:
          let res = await request("post", endpoint).send({ values: types });

          // Then:
          expect(res.statusCode).toEqual(200);
          expect(res.body.data).toBeDefined();
          expect(res.body.error).toBeOneOf([ undefined, null ]);
        });
      }
    });
    describe('should return error when:', () => {
      for (let { id, description, input } of scenario.add_types.fail) {
        it(description, async () => {
          // Setup:
          scenario.add_types.mock({ input, fail: true });

          // Given:
          let { item_id, types } = input();
          let endpoint = `${API_BASE}/${item_id}/types`;

          // When:
          let res = await request("post", endpoint).send({ values: types });

          // Then:
          expect(res.statusCode).toBeWithin(400, 522);
          expect(res.body.error).toBeDefined();
          expect(res.body.data).toBeOneOf([ undefined, null ]);
        });
      }
    });
  });

  describe("get type:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.get_type.pass) {
        it(description, async () => {
          // Setup:
          scenario.get_type.mock({ input, fail: false });

          // Given:
          let { item_id, type_id } = input();
          let endpoint = `${API_BASE}/${item_id}/types/${type_id}`;

          // When:
          let res = await request("get", endpoint);

          // Then:
          expect(res.statusCode).toEqual(200);
          expect(res.body.data).toBeDefined();
          expect(res.body.error).toBeOneOf([ undefined, null ]);
        });
      }
    });
    describe('should return error when:', () => {
      for (let { id, description, input } of scenario.get_type.fail) {
        it(description, async () => {
          // Setup:
          scenario.get_type.mock({ input, fail: true });

          // Given:
          let { item_id, type_id } = input();
          let endpoint = `${API_BASE}/${item_id}/types/${type_id}`;

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

  describe("update type:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.update_type.pass) {
        it(description, async () => {
          // Setup:
          scenario.update_type.mock({ input, fail: false });

          // Given:
          let { item_id, type_id, values } = input();
          let endpoint = `${API_BASE}/${item_id}/types/${type_id}`;

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
      for (let { id, description, input } of scenario.update_type.fail) {
        it(description, async () => {
          // Setup:
          scenario.update_type.mock({ input, fail: true });

          // Given:
          let { item_id, type_id, values } = input();
          let endpoint = `${API_BASE}/${item_id}/types/${type_id}`;

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

  describe("remove type:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.remove_type.pass) {
        it(description, async () => {
          // Setup:
          scenario.remove_type.mock({ input, fail: false });

          // Given:
          let { item_id, type_id } = input();
          let endpoint = `${API_BASE}/${item_id}/types/${type_id}`;

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
      for (let { id, description, input } of scenario.remove_type.fail) {
        it(description, async () => {
          // Setup:
          scenario.remove_type.mock({ input, fail: true });

          // Given:
          let { item_id, type_id } = input();
          let endpoint = `${API_BASE}/${item_id}/types/${type_id}`;

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

  afterEach(setup.after_each);
  afterAll(setup.after_all);
});
