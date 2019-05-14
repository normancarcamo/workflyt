import { setup, scenario } from '../setup/employee.setup';
import { request } from 'test/utils';

const API_BASE = `/api/v1/employees`;

describe("Employee Service:", () => {
  beforeAll(setup.before_all);
  beforeEach(setup.before_each);
  afterEach(setup.after_each);
  afterAll(setup.after_all);

  describe("get employees", () => {
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
          let querystring = await input();

          // When:
          let res = await request("get", API_BASE).query(querystring);

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
      for (let { id, description, mock, input, then } of scenario.get_employees.fail) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.get_employees.mock) {
            await scenario.get_employees.mock({ fail: true, description });
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

  describe("create employees:", () => {
    describe('should return data when:', () => {
      for (let { id, description, mock, input, then } of scenario.create_employees.pass) {
        it(`${id} - ${description}`, async () => {
          // Given:
          if (mock) {
            await mock(await input());
          } else if (scenario.create_employees.mock) {
            await scenario.create_employees.mock({ fail: false, description });
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
      for (let { id, description, mock, input, then } of scenario.create_employees.fail) {
        it(`${id} - ${description}`, async () => {
          // Given:
          if (mock) {
            await mock(await input());
          } else if (scenario.create_employees.mock) {
            await scenario.create_employees.mock({ fail: true, description });
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
          let { employee_id, options } = await input();
          let endpoint = `${API_BASE}/${employee_id}`;

          // When:
          let res = await request("get", endpoint).query(options);

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
      for (let { id, description, mock, input, then } of scenario.get_employee.fail) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.get_employee.mock) {
            await scenario.get_employee.mock({ fail: true, description });
          }

          // Given:
          let { employee_id, options } = await input();
          let endpoint = `${API_BASE}/${employee_id}`;

          // When:
          let res = await request("get", endpoint).query(options);

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
          let { employee_id, values } = await input();
          let endpoint = `${API_BASE}/${employee_id}`;

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
      for (let { id, description, mock, input, then } of scenario.update_employee.fail) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.update_employee.mock) {
            await scenario.update_employee.mock({ fail: true, description });
          }

          // Given:
          let { employee_id, values } = await input();
          let endpoint = `${API_BASE}/${employee_id}`;

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

  describe("delete employee:", () => {
    describe('should return data object empty when:', () => {
      for (let { id, description, mock, input, then } of scenario.delete_employee.pass) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.delete_employee.mock) {
            await scenario.delete_employee.mock({ fail: false, description });
          }

          // Given:
          let { employee_id, query } = await input();
          let endpoint = `${API_BASE}/${employee_id}`;

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
      for (let { id, description, mock, input, then } of scenario.delete_employee.fail) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.delete_employee.mock) {
            await scenario.delete_employee.mock({ fail: true, description });
          }

          // Given:
          let { employee_id, query } = await input();
          let endpoint = `${API_BASE}/${employee_id}`;

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

  describe("get user:", () => {
    describe('should return data when:', () => {
      for (let { id, description, mock, input, then } of scenario.get_user.pass) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.get_user.mock) {
            await scenario.get_user.mock({ fail: false, description });
          }

          // Given:
          let { employee_id } = await input();
          let endpoint = `${API_BASE}/${employee_id}/user`;

          // When:
          let res = await request("get", endpoint);

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
      for (let { id, description, mock, input, then } of scenario.get_user.fail) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.get_user.mock) {
            await scenario.get_user.mock({ fail: true, description });
          }

          // Given:
          let { employee_id } = await input();
          let endpoint = `${API_BASE}/${employee_id}/user`;

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

  describe("set user:", () => {
    describe('should return data when:', () => {
      for (let { id, description, mock, input, then } of scenario.set_user.pass) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.set_user.mock) {
            await scenario.set_user.mock({ fail: false, description });
          }

          // Given:
          let { employee_id, user } = await input();
          let endpoint = `${API_BASE}/${employee_id}/user`;

          // When:
          let res = await request("post", endpoint).send({ user });

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
      for (let { id, description, mock, input, then } of scenario.set_user.fail) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.set_user.mock) {
            await scenario.set_user.mock({ fail: true, description });
          }

          // Given:
          let { employee_id, user } = await input();
          let endpoint = `${API_BASE}/${employee_id}/user`;

          // When:
          let res = await request("post", endpoint).send({ user });

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

  describe("remove user:", () => {
    describe('should return data when:', () => {
      for (let { id, description, mock, input, then } of scenario.remove_user.pass) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.remove_user.mock) {
            await scenario.remove_user.mock({ fail: false, description });
          }

          // Given:
          let { employee_id } = await input();
          let endpoint = `${API_BASE}/${employee_id}/user`;

          // When:
          let res = await request("delete", endpoint);

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
      for (let { id, description, mock, input, then } of scenario.remove_user.fail) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.remove_user.mock) {
            await scenario.remove_user.mock({ fail: true, description });
          }

          // Given:
          let { employee_id } = await input();
          let endpoint = `${API_BASE}/${employee_id}/user`;

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
          let { employee_id, query } = await input();
          let endpoint = `${API_BASE}/${employee_id}/quotes`;

          // When:
          let res = await request("get", endpoint).query(query);

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
      for (let { id, description, mock, input, then } of scenario.get_quotes.fail) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.get_quotes.mock) {
            await scenario.get_quotes.mock({ fail: true, description });
          }

          // Given:
          let { employee_id, query } = await input();
          let endpoint = `${API_BASE}/${employee_id}/quotes`;

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
          let { employee_id, quotes } = await input();
          let endpoint = `${API_BASE}/${employee_id}/quotes`;

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
          let { employee_id, quotes } = await input();
          let endpoint = `${API_BASE}/${employee_id}/quotes`;

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
          let { employee_id, quote_id } = await input();
          let endpoint = `${API_BASE}/${employee_id}/quotes/${quote_id}`;

          // When:
          let res = await request("get", endpoint);

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
          let { employee_id, quote_id } = await input();
          let endpoint = `${API_BASE}/${employee_id}/quotes/${quote_id}`;

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
