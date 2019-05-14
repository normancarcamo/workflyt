import { setup, scenario } from '../setup/quote.setup';
import { request } from 'test/utils';

const API_BASE = `/api/v1/quotes`;

describe("Quote Service:", () => {
  beforeAll(setup.before_all);
  beforeEach(setup.before_each);
  afterEach(setup.after_each);
  afterAll(setup.after_all);

  describe("get quotes", () => {
    describe('should return data when:', () => {
      for (let { id, description, mock, input, then } of scenario.get_quotes.pass) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.get_quotes.mock) {
            await scenario.get_quotes.mock({ fail: false, description });
          }

          // Given:
          let querystring = await input();

          // When:
          let res = await request("get", API_BASE).query(querystring);

          // Then:
          if (then) {
            await then(res);
          } else {
            expect(res.statusCode).toEqual(200);
            expect(res.body.data).toBeDefined();
            expect(res.body.error).toBe(null);
          }
        });
      }
    });
    describe('should return error when:', () => {
      for (let { id, description, mock, input, then } of scenario.get_quotes.fail) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.get_quotes.mock) {
            await scenario.get_quotes.mock({ fail: true, description });
          }

          // Given:
          let querystring = await input();

          // When:
          let res = await request("get", API_BASE).query(querystring);

          // Then:
          if (then) {
            await then(res);
          } else {
            expect(res.statusCode).toBeWithin(400, 522);
            expect(res.body.error).toBeDefined();
            expect(res.body.data).toBeOneOf([ undefined, null ]);
          }
        });
      }
    });
  });

  describe("create quotes:", () => {
    describe('should return data when:', () => {
      for (let { id, description, mock, input, then } of scenario.create_quotes.pass) {
        it(`${id} - ${description}`, async () => {
          // Given:
          if (mock) {
            await mock(await input());
          } else if (scenario.create_quotes.mock) {
            await scenario.create_quotes.mock({ fail: false, description });
          }

          // When:
          let res = await request("post", API_BASE).send(await input());

          // Then:
          if (then) {
            await then(res);
          } else {
            expect(res.statusCode).toEqual(201);
            expect(res.body.data).toBeDefined();
            expect(res.body.error).toBeOneOf([ undefined, null ]);
          }
        });
      }
    });
    describe('should return error when:', () => {
      for (let { id, description, mock, input, then } of scenario.create_quotes.fail) {
        it(`${id} - ${description}`, async () => {
          // Given:
          if (mock) {
            await mock(await input());
          } else if (scenario.create_quotes.mock) {
            await scenario.create_quotes.mock({ fail: true, description });
          }

          // When:
          let res = await request("post", API_BASE).send(await input());

          // Then:
          if (then) {
            await then(res);
          } else {
            expect(res.statusCode).toBeWithin(400, 522);
            expect(res.body.error).toBeDefined();
            expect(res.body.data).toBeOneOf([ undefined, null ]);
          }
        });
      }
    });
  });

  describe("get quote:", () => {
    describe('should return data when:', () => {
      for (let { id, description, mock, input, then } of scenario.get_quote.pass) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.get_quote.mock) {
            await scenario.get_quote.mock({ fail: false, description });
          }

          // Given:
          let { quote_id } = await input();

          // When:
          let res = await request("get", `${API_BASE}/${quote_id}`);

          // Then:
          if (then) {
            await then(res);
          } else {
            expect(res.statusCode).toEqual(200);
            expect(res.body.data).toBeDefined();
            expect(res.body.error).toBeOneOf([ undefined, null ]);
          }
        });
      }
    });
    describe('should return error when:', () => {
      for (let { id, description, mock, input, then } of scenario.get_quote.fail) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.get_quote.mock) {
            await scenario.get_quote.mock({ fail: true, description });
          }

          // Given:
          let { quote_id } = await input();

          // When:
          let res = await request("get", `${API_BASE}/${quote_id}`);

          // Then:
          if (then) {
            await then(res);
          } else {
            expect(res.statusCode).toBeWithin(400, 522);
            expect(res.body.error).toBeDefined();
            expect(res.body.data).toBeOneOf([ undefined, null ]);
          }
        });
      }
    });
  });

  describe("update quote:", () => {
    describe('should return data when:', () => {
      for (let { id, description, mock, input, then } of scenario.update_quote.pass) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.update_quote.mock) {
            await scenario.update_quote.mock({ fail: false, description });
          }

          // Given:
          let { quote_id, values } = await input();
          let endpoint = `${API_BASE}/${quote_id}`;

          // When:
          let res = await request("put", endpoint).send({ values });

          // Then:
          if (then) {
            await then(res);
          } else {
            expect(res.statusCode).toEqual(200);
            expect(res.body.data).toBeDefined();
            expect(res.body.error).toBeOneOf([ undefined, null ]);
          }
        });
      }
    });
    describe('should return error when:', () => {
      for (let { id, description, mock, input, then } of scenario.update_quote.fail) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.update_quote.mock) {
            await scenario.update_quote.mock({ fail: true, description });
          }

          // Given:
          let { quote_id, values } = await input();
          let endpoint = `${API_BASE}/${quote_id}`;

          // When:
          let res = await request("put", endpoint).send({ values });

          // Then:
          if (then) {
            await then(res);
          } else {
            expect(res.statusCode).toBeWithin(400, 522);
            expect(res.body.error).toBeDefined();
            expect(res.body.data).toBeOneOf([ undefined, null ]);
          }
        });
      }
    });
  });

  describe("delete quote:", () => {
    describe('should return data object empty when:', () => {
      for (let { id, description, mock, input, then } of scenario.delete_quote.pass) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.delete_quote.mock) {
            await scenario.delete_quote.mock({ fail: false, description });
          }

          // Given:
          let { quote_id, query } = await input();
          let endpoint = `${API_BASE}/${quote_id}`;

          // When:
          let res = await request("delete", endpoint).query(query);

          // Then:
          if (then) {
            await then(res);
          } else {
            expect(res.statusCode).toEqual(200);
            expect(res.body.data).toBeDefined();
            expect(res.body.error).toBeOneOf([ undefined, null ]);
          }
        });
      }
    });
    describe('should return error when:', () => {
      for (let { id, description, mock, input, then } of scenario.delete_quote.fail) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.delete_quote.mock) {
            await scenario.delete_quote.mock({ fail: true, description });
          }

          // Given:
          let { quote_id, query } = await input();
          let endpoint = `${API_BASE}/${quote_id}`;

          // When:
          let res = await request("delete", endpoint).query(query);

          // Then:
          if (then) {
            await then(res);
          } else {
            expect(res.statusCode).toBeWithin(400, 522);
            expect(res.body.error).toBeDefined();
            expect(res.body.data).toBeOneOf([ undefined, null ]);
          }
        });
      }
    });
  });

  describe("get items:", () => {
    describe('should return data when:', () => {
      for (let { id, description, mock, input, then } of scenario.get_items.pass) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.get_items.mock) {
            await scenario.get_items.mock({ fail: false, description });
          }

          // Given:
          let { quote_id, query } = await input();
          let endpoint = `${API_BASE}/${quote_id}/items`;

          // When:
          let res = await request("get", endpoint).query(query);

          // Then:
          if (then) {
            await then(res);
          } else {
            expect(res.statusCode).toEqual(200);
            expect(res.body.data).toBeDefined();
            expect(res.body.error).toBe(null);
          }
        });
      }
    });
    describe('should return error when:', () => {
      for (let { id, description, mock, input, then } of scenario.get_items.fail) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.get_items.mock) {
            await scenario.get_items.mock({ fail: true, description });
          }

          // Given:
          let { quote_id, query } = await input();
          let endpoint = `${API_BASE}/${quote_id}/items`;

          // When:
          let res = await request("get", endpoint).query(query);

          // Then:
          if (then) {
            await then(res);
          } else {
            expect(res.statusCode).toBeWithin(400, 522);
            expect(res.body.error).toBeDefined();
            expect(res.body.data).toBeOneOf([ undefined, null ]);
          }
        });
      }
    });
  });

  describe("set items:", () => {
    describe('should return data when:', () => {
      for (let { id, description, mock, input, then } of scenario.set_items.pass) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.set_items.mock) {
            await scenario.set_items.mock({ fail: false, description });
          }

          // Given:
          let { quote_id, items } = await input();
          let endpoint = `${API_BASE}/${quote_id}/items`;

          // When:
          let res = await request("post", endpoint).send({ values: items });

          // Then:
          if (then) {
            await then(res);
          } else {
            expect(res.statusCode).toEqual(200);
            expect(res.body.data).toBeDefined();
            expect(res.body.error).toBeOneOf([ undefined, null ]);
          }
        });
      }
    });
    describe('should return error when:', () => {
      for (let { id, description, mock, input, then } of scenario.set_items.fail) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.set_items.mock) {
            await scenario.set_items.mock({ fail: true, description });
          }

          // Given:
          let { quote_id, items } = await input();
          let endpoint = `${API_BASE}/${quote_id}/items`;

          // When:
          let res = await request("post", endpoint).send({ values: items });

          // Then:
          if (then) {
            await then(res);
          } else {
            expect(res.statusCode).toBeWithin(400, 522);
            expect(res.body.error).toBeDefined();
            expect(res.body.data).toBeOneOf([ undefined, null ]);
          }
        });
      }
    });
  });

  describe("get item:", () => {
    describe('should return data when:', () => {
      for (let { id, description, mock, input, then } of scenario.get_item.pass) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.get_item.mock) {
            await scenario.get_item.mock({ fail: false, description });
          }

          // Given:
          let { quote_id, item_id } = await input();
          let endpoint = `${API_BASE}/${quote_id}/items/${item_id}`;

          // When:
          let res = await request("get", endpoint);

          // Then:
          if (then) {
            await then(res);
          } else {
            expect(res.statusCode).toEqual(200);
            expect(res.body.data).toBeDefined();
            expect(res.body.error).toBe(null);
          }
        });
      }
    });
    describe('should return error when:', () => {
      for (let { id, description, mock, input, then } of scenario.get_item.fail) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.get_item.mock) {
            await scenario.get_item.mock({ fail: true, description });
          }

          // Given:
          let { quote_id, item_id } = await input();
          let endpoint = `${API_BASE}/${quote_id}/items/${item_id}`;

          // When:
          let res = await request("get", endpoint);

          // Then:
          if (then) {
            await then(res);
          } else {
            expect(res.statusCode).toBeWithin(400, 522);
            expect(res.body.error).toBeDefined();
            expect(res.body.data).toBeOneOf([ undefined, null ]);
          }
        });
      }
    });
  });

  describe("update item:", () => {
    describe('should return data when:', () => {
      for (let { id, description, mock, input, then } of scenario.update_item.pass) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.update_item.mock) {
            await scenario.update_item.mock({ fail: false, description });
          }

          // Given:
          let { quote_id, item_id, values } = await input();
          let endpoint = `${API_BASE}/${quote_id}/items/${item_id}`;

          // When:
          let res = await request("put", endpoint).send({ values });

          // Then:
          if (then) {
            await then(res);
          } else {
            expect(res.statusCode).toEqual(200);
            expect(res.body.data).toBeDefined();
            expect(res.body.error).toBe(null);
          }
        });
      }
    });
    describe('should return error when:', () => {
      for (let { id, description, mock, input, then } of scenario.update_item.fail) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.update_item.mock) {
            await scenario.update_item.mock({ fail: true, description });
          }

          // Given:
          let { quote_id, item_id, values } = await input();
          let endpoint = `${API_BASE}/${quote_id}/items/${item_id}`;

          // When:
          let res = await request("put", endpoint).send({ values });

          // Then:
          if (then) {
            await then(res);
          } else {
            expect(res.statusCode).toBeWithin(400, 522);
            expect(res.body.error).toBeDefined();
            expect(res.body.data).toBeOneOf([ undefined, null ]);
          }
        });
      }
    });
  });

  describe("remove item:", () => {
    describe('should return data when:', () => {
      for (let { id, description, mock, input, then } of scenario.remove_item.pass) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.remove_item.mock) {
            await scenario.remove_item.mock({ fail: false, description });
          }

          // Given:
          let { quote_id, item_id } = await input();
          let endpoint = `${API_BASE}/${quote_id}/items/${item_id}`;

          // When:
          let res = await request("delete", endpoint);

          // Then:
          if (then) {
            await then(res);
          } else {
            expect(res.statusCode).toEqual(200);
            expect(res.body.data).toBeDefined();
            expect(res.body.error).toBe(null);
          }
        });
      }
    });
    describe('should return error when:', () => {
      for (let { id, description, mock, input, then } of scenario.remove_item.fail) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.remove_item.mock) {
            await scenario.remove_item.mock({ fail: true, description });
          }

          // Given:
          let { quote_id, item_id } = await input();
          let endpoint = `${API_BASE}/${quote_id}/items/${item_id}`;

          // When:
          let res = await request("delete", endpoint);

          // Then:
          if (then) {
            await then(res);
          } else {
            expect(res.statusCode).toBeWithin(400, 522);
            expect(res.body.error).toBeDefined();
            expect(res.body.data).toBeOneOf([ undefined, null ]);
          }
        });
      }
    });
  });

  describe("get orders:", () => {
    describe('should return data when:', () => {
      for (let { id, description, mock, input, then } of scenario.get_orders.pass) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.get_orders.mock) {
            await scenario.get_orders.mock({ fail: false, description });
          }

          // Given:
          let { quote_id, query } = await input();
          let endpoint = `${API_BASE}/${quote_id}/orders`;

          // When:
          let res = await request("get", endpoint).query(query);

          // Then:
          if (then) {
            await then(res);
          } else {
            expect(res.statusCode).toEqual(200);
            expect(res.body.data).toBeDefined();
            expect(res.body.error).toBe(null);
          }
        });
      }
    });
    describe('should return error when:', () => {
      for (let { id, description, mock, input, then } of scenario.get_orders.fail) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.get_orders.mock) {
            await scenario.get_orders.mock({ fail: true, description });
          }

          // Given:
          let { quote_id, query } = await input();
          let endpoint = `${API_BASE}/${quote_id}/orders`;

          // When:
          let res = await request("get", endpoint).query(query);

          // Then:
          if (then) {
            await then(res);
          } else {
            expect(res.statusCode).toBeWithin(400, 522);
            expect(res.body.error).toBeDefined();
            expect(res.body.data).toBeOneOf([ undefined, null ]);
          }
        });
      }
    });
  });

  describe("set orders:", () => {
    describe('should return data when:', () => {
      for (let { id, description, mock, input, then } of scenario.set_orders.pass) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.set_orders.mock) {
            await scenario.set_orders.mock({ fail: false, description });
          }

          // Given:
          let { quote_id, orders } = await input();
          let endpoint = `${API_BASE}/${quote_id}/orders`;

          // When:
          let res = await request("post", endpoint).send({ values: orders });

          // Then:
          if (then) {
            await then(res);
          } else {
            expect(res.statusCode).toEqual(200);
            expect(res.body.data).toBeDefined();
            expect(res.body.error).toBeOneOf([ undefined, null ]);
          }
        });
      }
    });
    describe('should return error when:', () => {
      for (let { id, description, mock, input, then } of scenario.set_orders.fail) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.set_orders.mock) {
            await scenario.set_orders.mock({ fail: true, description });
          }

          // Given:
          let { quote_id, orders } = await input();
          let endpoint = `${API_BASE}/${quote_id}/orders`;

          // When:
          let res = await request("post", endpoint).send({ values: orders });

          // Then:
          if (then) {
            await then(res);
          } else {
            expect(res.statusCode).toBeWithin(400, 522);
            expect(res.body.error).toBeDefined();
            expect(res.body.data).toBeOneOf([ undefined, null ]);
          }
        });
      }
    });
  });

  describe("get order:", () => {
    describe('should return data when:', () => {
      for (let { id, description, mock, input, then } of scenario.get_order.pass) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.get_order.mock) {
            await scenario.get_order.mock({ fail: false, description });
          }

          // Given:
          let { quote_id, order_id } = await input();
          let endpoint = `${API_BASE}/${quote_id}/orders/${order_id}`;

          // When:
          let res = await request("get", endpoint);

          // Then:
          if (then) {
            await then(res);
          } else {
            expect(res.statusCode).toEqual(200);
            expect(res.body.data).toBeDefined();
            expect(res.body.error).toBe(null);
          }
        });
      }
    });
    describe('should return error when:', () => {
      for (let { id, description, mock, input, then } of scenario.get_order.fail) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.get_order.mock) {
            await scenario.get_order.mock({ fail: true, description });
          }

          // Given:
          let { quote_id, order_id } = await input();
          let endpoint = `${API_BASE}/${quote_id}/orders/${order_id}`;

          // When:
          let res = await request("get", endpoint);

          // Then:
          if (then) {
            await then(res);
          } else {
            expect(res.statusCode).toBeWithin(400, 522);
            expect(res.body.error).toBeDefined();
            expect(res.body.data).toBeOneOf([ undefined, null ]);
          }
        });
      }
    });
  });
});
