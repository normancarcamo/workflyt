import { setup, scenario } from '../setup/customer.setup';
import { request } from 'test/utils';

const API_BASE = `/api/v1/customers`;

describe("Customer Service:", () => {
  beforeAll(setup.before_all);
  beforeEach(setup.before_each);
  afterEach(setup.after_each);
  afterAll(setup.after_all);

  describe("get customers", () => {
    describe('should return data when:', () => {
      for (let { id, description, mock, input, then } of scenario.get_customers.pass) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.get_customers.mock) {
            await scenario.get_customers.mock({ fail: false, description });
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
      for (let { id, description, mock, input, then } of scenario.get_customers.fail) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.get_customers.mock) {
            await scenario.get_customers.mock({ fail: true, description });
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

  describe("create customers:", () => {
    describe('should return data when:', () => {
      for (let { id, description, mock, input, then } of scenario.create_customers.pass) {
        it(`${id} - ${description}`, async () => {
          // Given:
          if (mock) {
            await mock(await input());
          } else if (scenario.create_customers.mock) {
            await scenario.create_customers.mock({ fail: false, description });
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
      for (let { id, description, mock, input, then } of scenario.create_customers.fail) {
        it(`${id} - ${description}`, async () => {
          // Given:
          if (mock) {
            await mock(await input());
          } else if (scenario.create_customers.mock) {
            await scenario.create_customers.mock({ fail: true, description });
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

  describe("get customer:", () => {
    describe('should return data when:', () => {
      for (let { id, description, mock, input, then } of scenario.get_customer.pass) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.get_customer.mock) {
            await scenario.get_customer.mock({ fail: false, description });
          }

          // Given:
          let { customer_id } = await input();

          // When:
          let res = await request("get", `${API_BASE}/${customer_id}`);

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
      for (let { id, description, mock, input, then } of scenario.get_customer.fail) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.get_customer.mock) {
            await scenario.get_customer.mock({ fail: true, description });
          }

          // Given:
          let { customer_id } = await input();

          // When:
          let res = await request("get", `${API_BASE}/${customer_id}`);

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

  describe("update customer:", () => {
    describe('should return data when:', () => {
      for (let { id, description, mock, input, then } of scenario.update_customer.pass) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.update_customer.mock) {
            await scenario.update_customer.mock({ fail: false, description });
          }

          // Given:
          let { customer_id, values } = await input();
          let endpoint = `${API_BASE}/${customer_id}`;

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
      for (let { id, description, mock, input, then } of scenario.update_customer.fail) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.update_customer.mock) {
            await scenario.update_customer.mock({ fail: true, description });
          }

          // Given:
          let { customer_id, values } = await input();
          let endpoint = `${API_BASE}/${customer_id}`;

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

  describe("delete customer:", () => {
    describe('should return data when:', () => {
      for (let { id, description, mock, input, then } of scenario.delete_customer.pass) {
        it(`${id} - ${description}`, async () => {

          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.delete_customer.mock) {
            await scenario.delete_customer.mock({ fail: false, description });
          }

          // Given:
          let { customer_id, query } = await input();
          let endpoint = `${API_BASE}/${customer_id}`;

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
      for (let { id, description, mock, input, then } of scenario.delete_customer.fail) {
        it(`${id} - ${description}`, async () => {

          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.delete_customer.mock) {
            await scenario.delete_customer.mock({ fail: true, description });
          }

          // Given:
          let { customer_id, query } = await input();
          let endpoint = `${API_BASE}/${customer_id}`;

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

  describe("get quotes:", () => {
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
          let { customer_id, query } = await input();
          let endpoint = `${API_BASE}/${customer_id}/quotes`;

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
      for (let { id, description, mock, input, then } of scenario.get_quotes.fail) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.get_quotes.mock) {
            await scenario.get_quotes.mock({ fail: true, description });
          }

          // Given:
          let { customer_id, query } = await input();
          let endpoint = `${API_BASE}/${customer_id}/quotes`;

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

  describe("set quotes:", () => {
    describe('should return data when:', () => {
      for (let { id, description, mock, input, then } of scenario.set_quotes.pass) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.set_quotes.mock) {
            await scenario.set_quotes.mock({ fail: false, description });
          }

          // Given:
          let { customer_id, quotes } = await input();
          let endpoint = `${API_BASE}/${customer_id}/quotes`;

          // When:
          let res = await request("post", endpoint).send({ values: quotes });

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
      for (let { id, description, mock, input, then } of scenario.set_quotes.fail) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.set_quotes.mock) {
            await scenario.set_quotes.mock({ fail: true, description });
          }

          // Given:
          let { customer_id, quotes } = await input();
          let endpoint = `${API_BASE}/${customer_id}/quotes`;

          // When:
          let res = await request("post", endpoint).send({ values: quotes });

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
          let { customer_id, quote_id } = await input();
          let endpoint = `${API_BASE}/${customer_id}/quotes/${quote_id}`;

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
      for (let { id, description, mock, input, then } of scenario.get_quote.fail) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.get_quote.mock) {
            await scenario.get_quote.mock({ fail: true, description });
          }

          // Given:
          let { customer_id, quote_id } = await input();
          let endpoint = `${API_BASE}/${customer_id}/quotes/${quote_id}`;

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
