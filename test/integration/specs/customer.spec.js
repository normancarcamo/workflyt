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
      for (let { id, description, input } of scenario.get_customers.pass) {
        it(description, async () => {
          // Setup:
          await scenario.get_customers.mock({ input, fail: false, stage: description });

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
      for (let { id, description, input } of scenario.get_customers.fail) {
        it(description, async () => {
          // Setup:
          await scenario.get_customers.mock({ input, fail: true, stage: description });

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

  describe("create customers:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.create_customers.pass) {
        it(description, async () => {
          // Given:
          await scenario.create_customers.mock({ input, fail: false, stage: description });

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
      for (let { id, description, input } of scenario.create_customers.fail) {
        it(description, async () => {
          // Given:
          await scenario.create_customers.mock({ input, fail: true, stage: description });

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

  describe("get customer:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.get_customer.pass) {
        it(description, async () => {
          // Setup:
          await scenario.get_customer.mock({ input, fail: false, stage: description });

          // Given:
          let { customer_id } = await input();

          // When:
          let res = await request("get", `${API_BASE}/${customer_id}`);

          // Then:
          expect(res.statusCode).toEqual(200);
          expect(res.body.data).toBeDefined();
          expect(res.body.error).toBeOneOf([ undefined, null ]);
        });
      }
    });
    describe('should return error when:', () => {
      for (let { id, description, input } of scenario.get_customer.fail) {
        it(description, async () => {
          // Setup:
          await scenario.get_customer.mock({ input, fail: true, stage: description });

          // Given:
          let { customer_id } = await input();

          // When:
          let res = await request("get", `${API_BASE}/${customer_id}`);

          // Then:
          expect(res.statusCode).toBeWithin(400, 522);
          expect(res.body.error).toBeDefined();
          expect(res.body.data).toBeOneOf([ undefined, null ]);
        });
      }
    });
  });

  describe("update customer:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.update_customer.pass) {
        it(description, async () => {
          // Setup:
          await scenario.update_customer.mock({ input, fail: false, stage: description });

          // Given:
          let { customer_id, values } = await input();
          let endpoint = `${API_BASE}/${customer_id}`;

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
      for (let { id, description, input } of scenario.update_customer.fail) {
        it(description, async () => {
          // Setup:
          await scenario.update_customer.mock({ input, fail: true, stage: description });

          // Given:
          let { customer_id, values } = await input();
          let endpoint = `${API_BASE}/${customer_id}`;

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

  describe("delete customer:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.delete_customer.pass) {
        it(description, async () => {

          // Setup:
          await scenario.delete_customer.mock({ input, fail: false, stage: description });

          // Given:
          let { customer_id, query } = await input();
          let endpoint = `${API_BASE}/${customer_id}`;

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
      for (let { id, description, input } of scenario.delete_customer.fail) {
        it(description, async () => {

          // Setup:
          await scenario.delete_customer.mock({ input, fail: true, stage: description });

          // Given:
          let { customer_id, query } = await input();
          let endpoint = `${API_BASE}/${customer_id}`;

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

  describe("get quotes:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.get_quotes.pass) {
        it(description, async () => {
          // Setup:
          await scenario.get_quotes.mock({ input, fail: false, stage: description });

          // Given:
          let { customer_id, query } = await input();
          let endpoint = `${API_BASE}/${customer_id}/quotes`;

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
      for (let { id, description, input } of scenario.get_quotes.fail) {
        it(description, async () => {
          // Setup:
          await scenario.get_quotes.mock({ input, fail: true, stage: description });

          // Given:
          let { customer_id, query } = await input();
          let endpoint = `${API_BASE}/${customer_id}/quotes`;

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

  describe("set quotes:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.set_quotes.pass) {
        it(description, async () => {
          // Setup:
          await scenario.set_quotes.mock({ input, fail: false, stage: description });

          // Given:
          let { customer_id, quotes } = await input();
          let endpoint = `${API_BASE}/${customer_id}/quotes`;

          // When:
          let res = await request("post", endpoint).send({ values: quotes });

          // Then:
          expect(res.statusCode).toEqual(200);
          expect(res.body.data).toBeDefined();
          expect(res.body.error).toBeOneOf([ undefined, null ]);
        });
      }
    });
    describe('should return error when:', () => {
      for (let { id, description, input } of scenario.set_quotes.fail) {
        it(description, async () => {
          // Setup:
          await scenario.set_quotes.mock({ input, fail: true, stage: description });

          // Given:
          let { customer_id, quotes } = await input();
          let endpoint = `${API_BASE}/${customer_id}/quotes`;

          // When:
          let res = await request("post", endpoint).send({ values: quotes });

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
          let { customer_id, quote_id } = await input();
          let endpoint = `${API_BASE}/${customer_id}/quotes/${quote_id}`;

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
      for (let { id, description, input } of scenario.get_quote.fail) {
        it(description, async () => {
          // Setup:
          await scenario.get_quote.mock({ input, fail: true, stage: description });

          // Given:
          let { customer_id, quote_id } = await input();
          let endpoint = `${API_BASE}/${customer_id}/quotes/${quote_id}`;

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
