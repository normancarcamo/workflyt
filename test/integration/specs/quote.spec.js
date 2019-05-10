import { setup, scenario } from '../setup/quote.setup';
import { request } from 'test/utils';

const API_BASE = `/api/v1/quotes`;

describe("Quote Service:", () => {
  beforeAll(setup.before_all);
  beforeEach(setup.before_each);

  describe("get quotes", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.get_quotes.pass) {
        it(description, async () => {
          // Setup:
          await scenario.get_quotes.mock({ input, fail: false, stage: description });

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
      for (let { id, description, input } of scenario.get_quotes.fail) {
        it(description, async () => {
          // Setup:
          await scenario.get_quotes.mock({ input, fail: true, stage: description });

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

  describe("create quotes:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.create_quotes.pass) {
        it(description, async () => {
          // Given:
          await scenario.create_quotes.mock({ input, fail: false, stage: description });

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
      for (let { id, description, input } of scenario.create_quotes.fail) {
        it(description, async () => {
          // Given:
          await scenario.create_quotes.mock({ input, fail: true, stage: description });

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

  describe("get quote:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.get_quote.pass) {
        it(description, async () => {
          // Setup:
          await scenario.get_quote.mock({ input, fail: false, stage: description });

          // Given:
          let { quote_id } = await input();

          // When:
          let res = await request("get", `${API_BASE}/${quote_id}`);

          // Then:
          expect(res.statusCode).toEqual(200);
          expect(res.body.data).toBeDefined();
          expect(res.body.error).toBeOneOf([ undefined, null ]);
        });
      }
    });
    describe('should return error when:', () => {
      for (let { id, description, input } of scenario.get_quote.fail) {
        it(description, async () => {
          // Setup:
          await scenario.get_quote.mock({ input, fail: true, stage: description });

          // Given:
          let { quote_id } = await input();

          // When:
          let res = await request("get", `${API_BASE}/${quote_id}`);

          // Then:
          expect(res.statusCode).toBeWithin(400, 522);
          expect(res.body.error).toBeDefined();
          expect(res.body.data).toBeOneOf([ undefined, null ]);
        });
      }
    });
  });

  describe("update quote:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.update_quote.pass) {
        it(description, async () => {
          // Setup:
          await scenario.update_quote.mock({ input, fail: false, stage: description });

          // Given:
          let { quote_id, values } = await input();
          let endpoint = `${API_BASE}/${quote_id}`;

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
      for (let { id, description, input } of scenario.update_quote.fail) {
        it(description, async () => {
          // Setup:
          await scenario.update_quote.mock({ input, fail: true, stage: description });

          // Given:
          let { quote_id, values } = await input();
          let endpoint = `${API_BASE}/${quote_id}`;

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

  describe("delete quote:", () => {
    describe('should return data object empty when:', () => {
      for (let { id, description, input } of scenario.delete_quote.pass) {
        it(description, async () => {
          // Setup:
          await scenario.delete_quote.mock({ input, fail: false, stage: description });

          // Given:
          let { quote_id, query } = await input();
          let endpoint = `${API_BASE}/${quote_id}`;

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
      for (let { id, description, input } of scenario.delete_quote.fail) {
        it(description, async () => {
          // Setup:
          await scenario.delete_quote.mock({ input, fail: true, stage: description });

          // Given:
          let { quote_id, query } = await input();
          let endpoint = `${API_BASE}/${quote_id}`;

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
          let { quote_id, query } = await input();
          let endpoint = `${API_BASE}/${quote_id}/items`;

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
          let { quote_id, query } = await input();
          let endpoint = `${API_BASE}/${quote_id}/items`;

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
          let { quote_id, items } = await input();
          let endpoint = `${API_BASE}/${quote_id}/items`;

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
          let { quote_id, items } = await input();
          let endpoint = `${API_BASE}/${quote_id}/items`;

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
          let { quote_id, item_id } = await input();
          let endpoint = `${API_BASE}/${quote_id}/items/${item_id}`;

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
          let { quote_id, item_id } = await input();
          let endpoint = `${API_BASE}/${quote_id}/items/${item_id}`;

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
          let { quote_id, item_id, values } = await input();
          let endpoint = `${API_BASE}/${quote_id}/items/${item_id}`;

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
          let { quote_id, item_id, values } = await input();
          let endpoint = `${API_BASE}/${quote_id}/items/${item_id}`;

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
          let { quote_id, item_id } = await input();
          let endpoint = `${API_BASE}/${quote_id}/items/${item_id}`;

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
          let { quote_id, item_id } = await input();
          let endpoint = `${API_BASE}/${quote_id}/items/${item_id}`;

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

  describe("get orders:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.get_orders.pass) {
        it(description, async () => {
          // Setup:
          await scenario.get_orders.mock({ input, fail: false, stage: description });

          // Given:
          let { quote_id, query } = await input();
          let endpoint = `${API_BASE}/${quote_id}/orders`;

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
      for (let { id, description, input } of scenario.get_orders.fail) {
        it(description, async () => {
          // Setup:
          await scenario.get_orders.mock({ input, fail: true, stage: description });

          // Given:
          let { quote_id, query } = await input();
          let endpoint = `${API_BASE}/${quote_id}/orders`;

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

  describe("set orders:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.set_orders.pass) {
        it(description, async () => {
          // Setup:
          await scenario.set_orders.mock({ input, fail: false, stage: description });

          // Given:
          let { quote_id, orders } = await input();
          let endpoint = `${API_BASE}/${quote_id}/orders`;

          // When:
          let res = await request("post", endpoint).send({ values: orders });

          // Then:
          expect(res.statusCode).toEqual(200);
          expect(res.body.data).toBeDefined();
          expect(res.body.error).toBeOneOf([ undefined, null ]);
        });
      }
    });
    describe('should return error when:', () => {
      for (let { id, description, input } of scenario.set_orders.fail) {
        it(description, async () => {
          // Setup:
          await scenario.set_orders.mock({ input, fail: true, stage: description });

          // Given:
          let { quote_id, orders } = await input();
          let endpoint = `${API_BASE}/${quote_id}/orders`;

          // When:
          let res = await request("post", endpoint).send({ values: orders });

          // Then:
          expect(res.statusCode).toBeWithin(400, 522);
          expect(res.body.error).toBeDefined();
          expect(res.body.data).toBeOneOf([ undefined, null ]);
        });
      }
    });
  });

  describe("get order:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.get_order.pass) {
        it(description, async () => {
          // Setup:
          await scenario.get_order.mock({ input, fail: false, stage: description });

          // Given:
          let { quote_id, order_id } = await input();
          let endpoint = `${API_BASE}/${quote_id}/orders/${order_id}`;

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
      for (let { id, description, input } of scenario.get_order.fail) {
        it(description, async () => {
          // Setup:
          await scenario.get_order.mock({ input, fail: true, stage: description });

          // Given:
          let { quote_id, order_id } = await input();
          let endpoint = `${API_BASE}/${quote_id}/orders/${order_id}`;

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

  afterEach(setup.after_each);
  afterAll(setup.after_all);
});
