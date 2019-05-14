import { setup, scenario } from '../setup/warehouse.setup';
import { request } from 'test/utils';

const API_BASE = `/api/v1/warehouses`;

describe("Warehouse Service:", () => {
  beforeAll(setup.before_all);
  beforeEach(setup.before_each);
  afterEach(setup.after_each);
  afterAll(setup.after_all);

  describe("get warehouses", () => {
    describe('should return data when:', () => {
      for (let { id, description, mock, input, then } of scenario.get_warehouses.pass) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.get_warehouses.mock) {
            await scenario.get_warehouses.mock({ fail: false, description });
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
      for (let { id, description, mock, input, then } of scenario.get_warehouses.fail) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.get_warehouses.mock) {
            await scenario.get_warehouses.mock({ fail: true, description });
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

  describe("create warehouses:", () => {
    describe('should return data when:', () => {
      for (let { id, description, mock, input, then } of scenario.create_warehouses.pass) {
        it(`${id} - ${description}`, async () => {
          // Given:
          if (mock) {
            await mock(await input());
          } else if (scenario.create_warehouses.mock) {
            await scenario.create_warehouses.mock({ fail: false, description });
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
      for (let { id, description, mock, input, then } of scenario.create_warehouses.fail) {
        it(`${id} - ${description}`, async () => {
          if (mock) {
            await mock(await input());
          } else if (scenario.create_warehouses.mock) {
            await scenario.create_warehouses.mock({ fail: true, description });
          }

          // Given:
          let data = await input();

          // When:
          let res = await request("post", API_BASE).send(data);

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

  describe("get warehouse:", () => {
    describe('should return data when:', () => {
      for (let { id, description, mock, input, then } of scenario.get_warehouse.pass) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.get_warehouse.mock) {
            await scenario.get_warehouse.mock({ fail: false, description });
          }

          // Given:
          let { warehouse_id } = await input();

          // When:
          let res = await request("get", `${API_BASE}/${warehouse_id}`);

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
      for (let { id, description, mock, input, then } of scenario.get_warehouse.fail) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.get_warehouse.mock) {
            await scenario.get_warehouse.mock({ fail: true, description });
          }

          // Given:
          let { warehouse_id } = await input();

          // When:
          let res = await request("get", `${API_BASE}/${warehouse_id}`);

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

  describe("update warehouse:", () => {
    describe('should return data when:', () => {
      for (let { id, description, mock, input, then } of scenario.update_warehouse.pass) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.update_warehouse.mock) {
            await scenario.update_warehouse.mock({ fail: false, description });
          }

          // Given:
          let { warehouse_id, values } = await input();
          let endpoint = `${API_BASE}/${warehouse_id}`;

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
      for (let { id, description, mock, input, then } of scenario.update_warehouse.fail) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.update_warehouse.mock) {
            await scenario.update_warehouse.mock({ fail: true, description });
          }

          // Given:
          let { warehouse_id, values } = await input();
          let endpoint = `${API_BASE}/${warehouse_id}`;

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

  describe("delete warehouse:", () => {
    describe('should return data object empty when:', () => {
      for (let { id, description, mock, input, then } of scenario.delete_warehouse.pass) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.delete_warehouse.mock) {
            await scenario.delete_warehouse.mock({ fail: false, description });
          }

          // Given:
          let { warehouse_id, query } = await input();
          let endpoint = `${API_BASE}/${warehouse_id}`;

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
      for (let { id, description, mock, input, then } of scenario.delete_warehouse.fail) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.delete_warehouse.mock) {
            await scenario.delete_warehouse.mock({ fail: true, description });
          }

          // Given:
          let { warehouse_id, query } = await input();
          let endpoint = `${API_BASE}/${warehouse_id}`;

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
          let { warehouse_id, query } = await input();
          let endpoint = `${API_BASE}/${warehouse_id}/items`;

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
          let { warehouse_id, query } = await input();
          let endpoint = `${API_BASE}/${warehouse_id}/items`;

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
          let { warehouse_id, items } = await input();
          let endpoint = `${API_BASE}/${warehouse_id}/items`;

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
          let { warehouse_id, items } = await input();
          let endpoint = `${API_BASE}/${warehouse_id}/items`;

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
          let { warehouse_id, item_id } = await input();
          let endpoint = `${API_BASE}/${warehouse_id}/items/${item_id}`;

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
          let { warehouse_id, item_id } = await input();
          let endpoint = `${API_BASE}/${warehouse_id}/items/${item_id}`;

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
          let { warehouse_id, item_id, values } = await input();
          let endpoint = `${API_BASE}/${warehouse_id}/items/${item_id}`;

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
          let { warehouse_id, item_id, values } = await input();
          let endpoint = `${API_BASE}/${warehouse_id}/items/${item_id}`;

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
          let { warehouse_id, item_id } = await input();
          let endpoint = `${API_BASE}/${warehouse_id}/items/${item_id}`;

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
          let { warehouse_id, item_id } = await input();
          let endpoint = `${API_BASE}/${warehouse_id}/items/${item_id}`;

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
});
