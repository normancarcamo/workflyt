import { setup, scenario } from '../setup/department.setup';
import { request } from 'test/utils';

const API_BASE = `/api/v1/departments`;

describe("Department Service:", () => {
  beforeAll(setup.before_all);
  beforeEach(setup.before_each);
  afterEach(setup.after_each);
  afterAll(setup.after_all);

  describe("get departments", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.get_departments.pass) {
        it(description, async () => {
          // Setup:
          await scenario.get_departments.mock({ input, fail: false, stage: description });

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
      for (let { id, description, input } of scenario.get_departments.fail) {
        it(description, async () => {
          // Setup:
          await scenario.get_departments.mock({ input, fail: true, stage: description });

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

  describe("create departments:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.create_departments.pass) {
        it(description, async () => {
          // Given:
          await scenario.create_departments.mock({ input, fail: false, stage: description });

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
      for (let { id, description, input } of scenario.create_departments.fail) {
        it(description, async () => {
          // Given:
          await scenario.create_departments.mock({ input, fail: true, stage: description });

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

  describe("get department:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.get_department.pass) {
        it(description, async () => {
          // Setup:
          await scenario.get_department.mock({ input, fail: false, stage: description });

          // Given:
          let { department_id } = await input();

          // When:
          let res = await request("get", `${API_BASE}/${department_id}`);

          // Then:
          expect(res.statusCode).toEqual(200);
          expect(res.body.data).toBeDefined();
          expect(res.body.error).toBeOneOf([ undefined, null ]);
        });
      }
    });
    describe('should return error when:', () => {
      for (let { id, description, input } of scenario.get_department.fail) {
        it(description, async () => {
          // Setup:
          await scenario.get_department.mock({ input, fail: true, stage: description });

          // Given:
          let { department_id } = await input();

          // When:
          let res = await request("get", `${API_BASE}/${department_id}`);

          // Then:
          expect(res.statusCode).toBeWithin(400, 522);
          expect(res.body.error).toBeDefined();
          expect(res.body.data).toBeOneOf([ undefined, null ]);
        });
      }
    });
  });

  describe("update department:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.update_department.pass) {
        it(description, async () => {
          // Setup:
          await scenario.update_department.mock({ input, fail: false, stage: description });

          // Given:
          let { department_id, values } = await input();
          let endpoint = `${API_BASE}/${department_id}`;

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
      for (let { id, description, input } of scenario.update_department.fail) {
        it(description, async () => {
          // Setup:
          await scenario.update_department.mock({ input, fail: true, stage: description });

          // Given:
          let { department_id, values } = await input();
          let endpoint = `${API_BASE}/${department_id}`;

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

  describe("delete department:", () => {
    describe('should return data object empty when:', () => {
      for (let { id, description, input } of scenario.delete_department.pass) {
        it(description, async () => {
          // Setup:
          await scenario.delete_department.mock({ input, fail: false, stage: description });

          // Given:
          let { department_id, query } = await input();
          let endpoint = `${API_BASE}/${department_id}`;

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
      for (let { id, description, input } of scenario.delete_department.fail) {
        it(description, async () => {
          // Setup:
          await scenario.delete_department.mock({ input, fail: true, stage: description });

          // Given:
          let { department_id, query } = await input();
          let endpoint = `${API_BASE}/${department_id}`;

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

  describe("get employees:", () => {
    describe('should return success when:', () => {
      for (let { id, description, input } of scenario.get_employees.pass) {
        it(description, async () => {
          // Setup:
          await scenario.get_employees.mock({ input, fail: false, state: description });

          // Given:
          let { department_id, query } = await input();
          let endpoint = `${API_BASE}/${department_id}/employees`;

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
      for (let { id, description, input } of scenario.get_employees.fail) {
        it(description, async () => {
          // Setup:
          await scenario.get_employees.mock({ input, fail: true, stage: description });

          // Given:
          let { department_id, query } = await input();
          let endpoint = `${API_BASE}/${department_id}/employees`;

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

  describe("set employees:", () => {
    describe('should return success when:', () => {
      for (let { id, description, input } of scenario.set_employees.pass) {
        it(description, async () => {
          // Setup:
          await scenario.set_employees.mock({ input, fail: false, stage: description });

          // Given:
          let { department_id, employees } = await input();
          let endpoint = `${API_BASE}/${department_id}/employees`;

          // When:
          let res = await request("post", endpoint).send({ values: employees });

          // Then:
          expect(res.statusCode).toEqual(200);
          expect(res.body.data).toBeDefined();
          expect(res.body.error).toBeOneOf([ undefined, null ]);
        });
      }
    });
    describe('should return error when:', () => {
      for (let { id, description, input } of scenario.set_employees.fail) {
        it(description, async () => {
          // Setup:
          await scenario.set_employees.mock({ input, fail: true, stage: description });

          // Given:
          let { department_id, employees } = await input();
          let endpoint = `${API_BASE}/${department_id}/employees`;

          // When:
          let res = await request("post", endpoint).send({ values: employees });

          // Then:
          expect(res.statusCode).toBeWithin(400, 522);
          expect(res.body.error).toBeDefined();
          expect(res.body.data).toBeOneOf([ undefined, null ]);
        });
      }
    });
  });

  describe("get employee:", () => {
    describe('should return success when:', () => {
      for (let { id, description, input } of scenario.get_employee.pass) {
        it(description, async () => {
          // Setup:
          await scenario.get_employee.mock({ input, fail: false, stage: description });

          // Given:
          let { department_id, employee_id } = await input();
          let endpoint = `${API_BASE}/${department_id}/employees/${employee_id}`;

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
      for (let { id, description, input } of scenario.get_employee.fail) {
        it(description, async () => {
          // Setup:
          await scenario.get_employee.mock({ input, fail: true, stage: description });

          // Given:
          let { department_id, employee_id } = await input();
          let endpoint = `${API_BASE}/${department_id}/employees/${employee_id}`;

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
