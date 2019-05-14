import { setup, scenario } from '../setup/order.setup';
import { request } from 'test/utils';

const API_BASE = `/api/v1/orders`;

describe("Order Service:", () => {
  beforeAll(setup.before_all);
  beforeEach(setup.before_each);
  afterEach(setup.after_each);
  afterAll(setup.after_all);

  describe("get orders", () => {
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
      for (let { id, description, mock, input, then } of scenario.get_orders.fail) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.get_orders.mock) {
            await scenario.get_orders.mock({ fail: true, description });
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

  describe("create orders:", () => {
    describe('should return data when:', () => {
      for (let { id, description, mock, input, then } of scenario.create_orders.pass) {
        it(`${id} - ${description}`, async () => {
          // Given:
          if (mock) {
            await mock(await input());
          } else if (scenario.create_orders.mock) {
            await scenario.create_orders.mock({ fail: false, description });
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
      for (let { id, description, mock, input, then } of scenario.create_orders.fail) {
        it(`${id} - ${description}`, async () => {
          // Given:
          if (mock) {
            await mock(await input());
          } else if (scenario.create_orders.mock) {
            await scenario.create_orders.mock({ fail: true, description });
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
          let { order_id } = await input();

          // When:
          let res = await request("get", `${API_BASE}/${order_id}`);

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
      for (let { id, description, mock, input, then } of scenario.get_order.fail) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.get_order.mock) {
            await scenario.get_order.mock({ fail: true, description });
          }

          // Given:
          let { order_id } = await input();

          // When:
          let res = await request("get", `${API_BASE}/${order_id}`);

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

  describe("update order:", () => {
    describe('should return data when:', () => {
      for (let { id, description, mock, input, then } of scenario.update_order.pass) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.update_order.mock) {
            await scenario.update_order.mock({ fail: false, description });
          }

          // Given:
          let { order_id, values } = await input();
          let endpoint = `${API_BASE}/${order_id}`;

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
      for (let { id, description, mock, input, then } of scenario.update_order.fail) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.update_order.mock) {
            await scenario.update_order.mock({ fail: true, description });
          }

          // Given:
          let { order_id, values } = await input();
          let endpoint = `${API_BASE}/${order_id}`;

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

  describe("delete order:", () => {
    describe('should return data object empty when:', () => {
      for (let { id, description, mock, input, then } of scenario.delete_order.pass) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.delete_order.mock) {
            await scenario.delete_order.mock({ fail: false, description });
          }

          // Given:
          let { order_id, query } = await input();
          let endpoint = `${API_BASE}/${order_id}`;

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
      for (let { id, description, mock, input, then } of scenario.delete_order.fail) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.delete_order.mock) {
            await scenario.delete_order.mock({ fail: true, description });
          }

          // Given:
          let { order_id, query } = await input();
          let endpoint = `${API_BASE}/${order_id}`;

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
          let { order_id, query } = await input();
          let endpoint = `${API_BASE}/${order_id}/items`;

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
          let { order_id, query } = await input();
          let endpoint = `${API_BASE}/${order_id}/items`;

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
          let { order_id, items } = await input();
          let endpoint = `${API_BASE}/${order_id}/items`;

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
          let { order_id, items } = await input();
          let endpoint = `${API_BASE}/${order_id}/items`;

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
          let { order_id, item_id } = await input();
          let endpoint = `${API_BASE}/${order_id}/items/${item_id}`;

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
          let { order_id, item_id } = await input();
          let endpoint = `${API_BASE}/${order_id}/items/${item_id}`;

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
          let { order_id, item_id, values } = await input();
          let endpoint = `${API_BASE}/${order_id}/items/${item_id}`;

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
          let { order_id, item_id, values } = await input();
          let endpoint = `${API_BASE}/${order_id}/items/${item_id}`;

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
          let { order_id, item_id } = await input();
          let endpoint = `${API_BASE}/${order_id}/items/${item_id}`;

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
          let { order_id, item_id } = await input();
          let endpoint = `${API_BASE}/${order_id}/items/${item_id}`;

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

  describe("get departments:", () => {
    describe('should return data when:', () => {
      for (let { id, description, mock, input, then } of scenario.get_departments.pass) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.get_departments.mock) {
            await scenario.get_departments.mock({ fail: false, description });
          }

          // Given:
          let { order_id, query } = await input();
          let endpoint = `${API_BASE}/${order_id}/departments`;

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
      for (let { id, description, mock, input, then } of scenario.get_departments.fail) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.get_departments.mock) {
            await scenario.get_departments.mock({ fail: true, description });
          }

          // Given:
          let { order_id, query } = await input();
          let endpoint = `${API_BASE}/${order_id}/departments`;

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

  describe("set departments:", () => {
    describe('should return data when:', () => {
      for (let { id, description, mock, input, then } of scenario.set_departments.pass) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.set_departments.mock) {
            await scenario.set_departments.mock({ fail: false, description });
          }

          // Given:
          let { order_id, departments } = await input();
          let endpoint = `${API_BASE}/${order_id}/departments`;

          // When:
          let res = await request("post", endpoint).send({ values: departments });

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
      for (let { id, description, mock, input, then } of scenario.set_departments.fail) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.set_departments.mock) {
            await scenario.set_departments.mock({ fail: true, description });
          }

          // Given:
          let { order_id, departments } = await input();
          let endpoint = `${API_BASE}/${order_id}/departments`;

          // When:
          let res = await request("post", endpoint).send({ values: departments });

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

  describe("get department:", () => {
    describe('should return data when:', () => {
      for (let { id, description, mock, input, then } of scenario.get_department.pass) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.get_department.mock) {
            await scenario.get_department.mock({ fail: false, description });
          }

          // Given:
          let { order_id, department_id } = await input();
          let endpoint = `${API_BASE}/${order_id}/departments/${department_id}`;

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
      for (let { id, description, mock, input, then } of scenario.get_department.fail) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.get_department.mock) {
            await scenario.get_department.mock({ fail: true, description });
          }

          // Given:
          let { order_id, department_id } = await input();
          let endpoint = `${API_BASE}/${order_id}/departments/${department_id}`;

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

  describe("update department:", () => {
    describe('should return data when:', () => {
      for (let { id, description, mock, input, then } of scenario.update_department.pass) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.update_department.mock) {
            await scenario.update_department.mock({ fail: false, description });
          }

          // Given:
          let { order_id, department_id, values } = await input();
          let endpoint = `${API_BASE}/${order_id}/departments/${department_id}`;

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
      for (let { id, description, mock, input, then } of scenario.update_department.fail) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.update_department.mock) {
            await scenario.update_department.mock({ fail: true, description });
          }

          // Given:
          let { order_id, department_id, values } = await input();
          let endpoint = `${API_BASE}/${order_id}/departments/${department_id}`;

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

  describe("remove department:", () => {
    describe('should return data when:', () => {
      for (let { id, description, mock, input, then } of scenario.remove_department.pass) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.remove_department.mock) {
            await scenario.remove_department.mock({ fail: false, description });
          }

          // Given:
          let { order_id, department_id } = await input();
          let endpoint = `${API_BASE}/${order_id}/departments/${department_id}`;

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
      for (let { id, description, mock, input, then } of scenario.remove_department.fail) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.remove_department.mock) {
            await scenario.remove_department.mock({ fail: true, description });
          }

          // Given:
          let { order_id, department_id } = await input();
          let endpoint = `${API_BASE}/${order_id}/departments/${department_id}`;

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

  describe("get employees:", () => {
    describe('should return data when:', () => {
      for (let { id, description, mock, input, then } of scenario.get_employees.pass) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.get_employees.mock) {
            await scenario.get_employees.mock({ fail: false, description });
          }

          // Given:
          let { order_id, query } = await input();
          let endpoint = `${API_BASE}/${order_id}/employees`;

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
      for (let { id, description, mock, input, then } of scenario.get_employees.fail) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.get_employees.mock) {
            await scenario.get_employees.mock({ fail: true, description });
          }

          // Given:
          let { order_id, query } = await input();
          let endpoint = `${API_BASE}/${order_id}/employees`;

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

  describe("set employees:", () => {
    describe('should return data when:', () => {
      for (let { id, description, mock, input, then } of scenario.set_employees.pass) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.set_employees.mock) {
            await scenario.set_employees.mock({ fail: false, description });
          }

          // Given:
          let { order_id, employees } = await input();
          let endpoint = `${API_BASE}/${order_id}/employees`;

          // When:
          let res = await request("post", endpoint).send({ values: employees });

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
      for (let { id, description, mock, input, then } of scenario.set_employees.fail) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.set_employees.mock) {
            await scenario.set_employees.mock({ fail: true, description });
          }

          // Given:
          let { order_id, employees } = await input();
          let endpoint = `${API_BASE}/${order_id}/employees`;

          // When:
          let res = await request("post", endpoint).send({ values: employees });

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

  describe("get employee:", () => {
    describe('should return data when:', () => {
      for (let { id, description, mock, input, then } of scenario.get_employee.pass) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.get_employee.mock) {
            await scenario.get_employee.mock({ fail: false, description });
          }

          // Given:
          let { order_id, employee_id } = await input();
          let endpoint = `${API_BASE}/${order_id}/employees/${employee_id}`;

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
      for (let { id, description, mock, input, then } of scenario.get_employee.fail) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.get_employee.mock) {
            await scenario.get_employee.mock({ fail: true, description });
          }

          // Given:
          let { order_id, employee_id } = await input();
          let endpoint = `${API_BASE}/${order_id}/employees/${employee_id}`;

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

  describe("update employee:", () => {
    describe('should return data when:', () => {
      for (let { id, description, mock, input, then } of scenario.update_employee.pass) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.update_employee.mock) {
            await scenario.update_employee.mock({ fail: false, description });
          }

          // Given:
          let { order_id, employee_id, values } = await input();
          let endpoint = `${API_BASE}/${order_id}/employees/${employee_id}`;

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
      for (let { id, description, mock, input, then } of scenario.update_employee.fail) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.update_employee.mock) {
            await scenario.update_employee.mock({ fail: true, description });
          }

          // Given:
          let { order_id, employee_id, values } = await input();
          let endpoint = `${API_BASE}/${order_id}/employees/${employee_id}`;

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

  describe("remove employee:", () => {
    describe('should return data when:', () => {
      for (let { id, description, mock, input, then } of scenario.remove_employee.pass) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.remove_employee.mock) {
            await scenario.remove_employee.mock({ fail: false, description });
          }

          // Given:
          let { order_id, employee_id } = await input();
          let endpoint = `${API_BASE}/${order_id}/employees/${employee_id}`;

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
      for (let { id, description, mock, input, then } of scenario.remove_employee.fail) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.remove_employee.mock) {
            await scenario.remove_employee.mock({ fail: true, description });
          }

          // Given:
          let { order_id, employee_id } = await input();
          let endpoint = `${API_BASE}/${order_id}/employees/${employee_id}`;

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
