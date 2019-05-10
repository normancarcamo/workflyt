import { setup, scenario } from '../setup/item.setup';
import { request } from 'test/utils';

const API_BASE = `/api/v1/items`;

describe("Item Service", () => {
  beforeAll(setup.before_all);
  beforeEach(setup.before_each);
  afterEach(setup.after_each);
  afterAll(setup.after_all);

  describe("get items", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.get_items.pass) {
        it(description, async () => {
          // Setup:
          await scenario.get_items.mock({ input, fail: false, stage: description });

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
      for (let { id, description, input } of scenario.get_items.fail) {
        it(description, async () => {
          // Setup:
          await scenario.get_items.mock({ input, fail: true, stage: description });

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

  describe("create items:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.create_items.pass) {
        it(description, async () => {
          // Given:
          await scenario.create_items.mock({ input, fail: false, stage: description });

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
      for (let { id, description, input } of scenario.create_items.fail) {
        it(description, async () => {
          // Given:
          await scenario.create_items.mock({ input, fail: true, stage: description });

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

  describe("get item:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.get_item.pass) {
        it(description, async () => {
          // Setup:
          await scenario.get_item.mock({ input, fail: false, stage: description });

          // Given:
          let { item_id } = await input();

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
          await scenario.get_item.mock({ input, fail: true, stage: description });

          // Given:
          let { item_id } = await input();

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
          await scenario.update_item.mock({ input, fail: false, stage: description });

          // Given:
          let { item_id, values } = await input();
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
          await scenario.update_item.mock({ input, fail: true, stage: description });

          // Given:
          let { item_id, values } = await input();
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
          await scenario.delete_item.mock({ input, fail: false, stage: description });

          // Given:
          let { item_id, query } = await input();
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
          await scenario.delete_item.mock({ input, fail: true, stage: description });

          // Given:
          let { item_id, query } = await input();
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

  describe("get stocks:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.get_stocks.pass) {
        it(description, async () => {
          // Setup:
          await scenario.get_stocks.mock({
            input,
            fail: false,
            stage: description
          });

          // Given:
          let { item_id, query } = await input();
          let endpoint = `${API_BASE}/${item_id}/stocks`;

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
      for (let { id, description, input } of scenario.get_stocks.fail) {
        it(description, async () => {
          // Setup:
          await scenario.get_stocks.mock({
            input,
            fail: true,
            stage: description
          });

          // Given:
          let { item_id, query } = await input();
          let endpoint = `${API_BASE}/${item_id}/stocks`;

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

  describe("set stocks:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.set_stocks.pass) {
        it(description, async () => {
          // Setup:
          await scenario.set_stocks.mock({
            input,
            fail: false,
            stage: description
          });

          // Given:
          let { item_id, stocks } = await input();
          let endpoint = `${API_BASE}/${item_id}/stocks`;

          // When:
          let res = await request("post", endpoint).send({ values: stocks });

          // Then:
          expect(res.statusCode).toEqual(200);
          expect(res.body.data).toBeDefined();
          expect(res.body.error).toBeOneOf([ undefined, null ]);
        });
      }
    });
    describe('should return error when:', () => {
      for (let { id, description, input } of scenario.set_stocks.fail) {
        it(description, async () => {
          // Setup:
          await scenario.set_stocks.mock({
            input,
            fail: true,
            stage: description
          });

          // Given:
          let { item_id, stocks } = await input();
          let endpoint = `${API_BASE}/${item_id}/stocks`;

          // When:
          let res = await request("post", endpoint).send({ values: stocks });

          // Then:
          expect(res.statusCode).toBeWithin(400, 522);
          expect(res.body.error).toBeDefined();
          expect(res.body.data).toBeOneOf([ undefined, null ]);
        });
      }
    });
  });

  describe("get stock:", () => {
    describe('should return success when:', () => {
      for (let { id, description, input } of scenario.get_stock.pass) {
        it(description, async () => {
          // Setup:
          await scenario.get_stock.mock({
            input,
            fail: false,
            stage: description
          });

          // Given:
          let { item_id, stock_id } = await input();
          let endpoint = `${API_BASE}/${item_id}/stocks/${stock_id}`;

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
      for (let { id, description, input } of scenario.get_stock.fail) {
        it(description, async () => {
          // Setup:
          await scenario.get_stock.mock({
            input,
            fail: true,
            stage: description
          });

          // Given:
          let { item_id, stock_id } = await input();
          let endpoint = `${API_BASE}/${item_id}/stocks/${stock_id}`;

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
});
