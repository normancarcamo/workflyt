import { setup, scenario } from '../setup/supplier.setup';
import { request } from 'test/utils';

const API_BASE = `/api/v1/suppliers`;

describe("Supplier Service:", () => {
  beforeAll(setup.before_all);
  beforeEach(setup.before_each);
  afterEach(setup.after_each);
  afterAll(setup.after_all);

  describe("get suppliers", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.get_suppliers.pass) {
        it(description, async () => {
          // Setup:
          await scenario.get_suppliers.mock({ input, fail: false, stage: description });

          // Given:
          let querystring = await input();

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
      for (let { id, description, input } of scenario.get_suppliers.fail) {
        it(description, async () => {
          // Setup:
          await scenario.get_suppliers.mock({ input, fail: true, stage: description });

          // Given:
          let querystring = await input();

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

  describe("create suppliers:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.create_suppliers.pass) {
        it(description, async () => {
          // Given:
          await scenario.create_suppliers.mock({ input, fail: false, stage: description });

          // When:
          let res = await request("post", API_BASE).send(await input());

          // Then:
          expect(res.statusCode).toEqual(201);
          expect(res.body.data).toBeDefined();
          expect(res.body.error).toBeOneOf([ undefined, null ]);
        });
      }
    });
    describe('should return error when:', () => {
      for (let { id, description, input } of scenario.create_suppliers.fail) {
        it(description, async () => {
          // Given:
          await scenario.create_suppliers.mock({ input, fail: true, stage: description });

          // When:
          let res = await request("post", API_BASE).send(await input());

          // Then:
          expect(res.statusCode).toBeWithin(400, 522);
          expect(res.body.error).toBeDefined();
          expect(res.body.data).toBeOneOf([ undefined, null ]);
        });
      }
    });
  });

  describe("get supplier:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.get_supplier.pass) {
        it(description, async () => {
          // Setup:
          await scenario.get_supplier.mock({ input, fail: false, stage: description });

          // Given:
          let { supplier_id } = await input();

          // When:
          let res = await request("get", `${API_BASE}/${supplier_id}`);

          // Then:
          expect(res.statusCode).toEqual(200);
          expect(res.body.data).toBeDefined();
          expect(res.body.error).toBeOneOf([ undefined, null ]);
        });
      }
    });
    describe('should return error when:', () => {
      for (let { id, description, input } of scenario.get_supplier.fail) {
        it(description, async () => {
          // Setup:
          await scenario.get_supplier.mock({ input, fail: true, stage: description });

          // Given:
          let { supplier_id } = await input();

          // When:
          let res = await request("get", `${API_BASE}/${supplier_id}`);

          // Then:
          expect(res.statusCode).toBeWithin(400, 522);
          expect(res.body.error).toBeDefined();
          expect(res.body.data).toBeOneOf([ undefined, null ]);
        });
      }
    });
  });

  describe("update supplier:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.update_supplier.pass) {
        it(description, async () => {
          // Setup:
          await scenario.update_supplier.mock({ input, fail: false, stage: description });

          // Given:
          let { supplier_id, values } = await input();
          let endpoint = `${API_BASE}/${supplier_id}`;

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
      for (let { id, description, input } of scenario.update_supplier.fail) {
        it(description, async () => {
          // Setup:
          await scenario.update_supplier.mock({ input, fail: true, stage: description });

          // Given:
          let { supplier_id, values } = await input();
          let endpoint = `${API_BASE}/${supplier_id}`;

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

  describe("delete supplier:", () => {
    describe('should return data object empty when:', () => {
      for (let { id, description, input } of scenario.delete_supplier.pass) {
        it(description, async () => {
          // Setup:
          await scenario.delete_supplier.mock({ input, fail: false, stage: description });

          // Given:
          let { supplier_id, query } = await input();
          let endpoint = `${API_BASE}/${supplier_id}`;

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
      for (let { id, description, input } of scenario.delete_supplier.fail) {
        it(description, async () => {
          // Setup:
          await scenario.delete_supplier.mock({ input, fail: true, stage: description });

          // Given:
          let { supplier_id, query } = await input();
          let endpoint = `${API_BASE}/${supplier_id}`;

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

  describe("get items:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.get_items.pass) {
        it(description, async () => {
          // Setup:
          await scenario.get_items.mock({ input, fail: false, stage: description });

          // Given:
          let { supplier_id, query } = await input();
          let endpoint = `${API_BASE}/${supplier_id}/items`;

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
          await scenario.get_items.mock({ input, fail: true, stage: description });

          // Given:
          let { supplier_id, query } = await input();
          let endpoint = `${API_BASE}/${supplier_id}/items`;

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

  describe("set items:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.set_items.pass) {
        it(description, async () => {
          // Setup:
          await scenario.set_items.mock({ input, fail: false, stage: description });

          // Given:
          let { supplier_id, items } = await input();
          let endpoint = `${API_BASE}/${supplier_id}/items`;

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
      for (let { id, description, input } of scenario.set_items.fail) {
        it(description, async () => {
          // Setup:
          await scenario.set_items.mock({ input, fail: true, stage: description });

          // Given:
          let { supplier_id, items } = await input();
          let endpoint = `${API_BASE}/${supplier_id}/items`;

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

  describe("get item:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.get_item.pass) {
        it(description, async () => {
          // Setup:
          await scenario.get_item.mock({ input, fail: false, stage: description });

          // Given:
          let { supplier_id, item_id } = await input();
          let endpoint = `${API_BASE}/${supplier_id}/items/${item_id}`;

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
          await scenario.get_item.mock({ input, fail: true, stage: description });

          // Given:
          let { supplier_id, item_id } = await input();
          let endpoint = `${API_BASE}/${supplier_id}/items/${item_id}`;

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
          await scenario.update_item.mock({ input, fail: false, stage: description });

          // Given:
          let { supplier_id, item_id, values } = await input();
          let endpoint = `${API_BASE}/${supplier_id}/items/${item_id}`;

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
          await scenario.update_item.mock({ input, fail: true, stage: description });

          // Given:
          let { supplier_id, item_id, values } = await input();
          let endpoint = `${API_BASE}/${supplier_id}/items/${item_id}`;

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
          await scenario.remove_item.mock({ input, fail: false, stage: description });

          // Given:
          let { supplier_id, item_id } = await input();
          let endpoint = `${API_BASE}/${supplier_id}/items/${item_id}`;

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
          await scenario.remove_item.mock({ input, fail: true, stage: description });

          // Given:
          let { supplier_id, item_id } = await input();
          let endpoint = `${API_BASE}/${supplier_id}/items/${item_id}`;

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
});
