import { setup, scenario } from '../setup/company.setup';
import { request } from 'test/utils';

const API_BASE = `/api/v1/companies`;

describe("Company Service", () => {
  beforeAll(setup.before_all);
  beforeEach(setup.before_each);
  afterEach(setup.after_each);
  afterAll(setup.after_all);

  describe("get companies", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.get_companies.pass) {
        it(description, async () => {
          // Setup:
          await scenario.get_companies.mock({ input, fail: false, stage: description });

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
      for (let { id, description, input } of scenario.get_companies.fail) {
        it(description, async () => {
          // Setup:
          await scenario.get_companies.mock({ input, fail: true, stage: description });

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

  describe("create companies:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.create_companies.pass) {
        it(description, async () => {
          // Given:
          await scenario.create_companies.mock({ input, fail: false, stage: description });

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
      for (let { id, description, input } of scenario.create_companies.fail) {
        it(description, async () => {
          // Given:
          await scenario.create_companies.mock({ input, fail: true, stage: description });

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

  describe("get company:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.get_company.pass) {
        it(description, async () => {
          // Setup:
          await scenario.get_company.mock({ input, fail: false, stage: description });

          // Given:
          let { company_id } = await input();

          // When:
          let res = await request("get", `${API_BASE}/${company_id}`);

          // Then:
          expect(res.statusCode).toEqual(200);
          expect(res.body.data).toBeDefined();
          expect(res.body.error).toBeOneOf([ undefined, null ]);
        });
      }
    });
    describe('should return error when:', () => {
      for (let { id, description, input } of scenario.get_company.fail) {
        it(description, async () => {
          // Setup:
          await scenario.get_company.mock({ input, fail: true, stage: description });

          // Given:
          let { company_id } = await input();

          // When:
          let res = await request("get", `${API_BASE}/${company_id}`);

          // Then:
          expect(res.statusCode).toBeWithin(400, 522);
          expect(res.body.error).toBeDefined();
          expect(res.body.data).toBeOneOf([ undefined, null ]);
        });
      }
    });
  });

  describe("update company:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.update_company.pass) {
        it(description, async () => {
          // Setup:
          await scenario.update_company.mock({ input, fail: false, stage: description });

          // Given:
          let { company_id, values } = await input();
          let endpoint = `${API_BASE}/${company_id}`;

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
      for (let { id, description, input } of scenario.update_company.fail) {
        it(description, async () => {
          // Setup:
          await scenario.update_company.mock({ input, fail: true, stage: description });

          // Given:
          let { company_id, values } = await input();
          let endpoint = `${API_BASE}/${company_id}`;

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

  describe("delete company:", () => {
    describe('should return data object empty when:', () => {
      for (let { id, description, input } of scenario.delete_company.pass) {
        it(description, async () => {
          // Setup:
          await scenario.delete_company.mock({ input, fail: false, stage: description });

          // Given:
          let { company_id, query } = await input();
          let endpoint = `${API_BASE}/${company_id}`;

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
      for (let { id, description, input } of scenario.delete_company.fail) {
        it(description, async () => {
          // Setup:
          await scenario.delete_company.mock({ input, fail: true, stage: description });

          // Given:
          let { company_id, query } = await input();
          let endpoint = `${API_BASE}/${company_id}`;

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
});
