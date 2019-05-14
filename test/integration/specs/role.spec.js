import { setup, scenario } from '../setup/role.setup';
import { request } from 'test/utils';

const API_BASE = `/api/v1/roles`;

describe("Role Service:", () => {
  beforeAll(setup.before_all);
  beforeEach(setup.before_each);
  afterEach(setup.after_each);
  afterAll(setup.after_all);

  describe("get roles", () => {
    describe('should return data when:', () => {
      for (let { id, description, mock, input, then } of scenario.get_roles.pass) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.get_roles.mock) {
            await scenario.get_roles.mock({ fail: false, description });
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
      for (let { id, description, mock, input, then } of scenario.get_roles.fail) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.get_roles.mock) {
            await scenario.get_roles.mock({ fail: true, description });
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

  describe("create roles:", () => {
    describe('should return data when:', () => {
      for (let { id, description, mock, input, then } of scenario.create_roles.pass) {
        it(`${id} - ${description}`, async () => {
          // Given:
          if (mock) {
            await mock(await input());
          } else if (scenario.create_roles.mock) {
            await scenario.create_roles.mock({ fail: false, description });
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
      for (let { id, description, mock, input, then } of scenario.create_roles.fail) {
        it(`${id} - ${description}`, async () => {
          // Given:
          if (mock) {
            await mock(await input());
          } else if (scenario.create_roles.mock) {
            await scenario.create_roles.mock({ fail: true, description });
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

  describe("get role:", () => {
    describe('should return data when:', () => {
      for (let { id, description, mock, input, then } of scenario.get_role.pass) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.get_role.mock) {
            await scenario.get_role.mock({ fail: false, description });
          }

          // Given:
          let { role_id } = await input();

          // When:
          let res = await request("get", `${API_BASE}/${role_id}`);

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
      for (let { id, description, mock, input, then } of scenario.get_role.fail) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.get_role.mock) {
            await scenario.get_role.mock({ fail: true, description });
          }

          // Given:
          let { role_id } = await input();

          // When:
          let res = await request("get", `${API_BASE}/${role_id}`);

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

  describe("update role:", () => {
    describe('should return data when:', () => {
      for (let { id, description, mock, input, then } of scenario.update_role.pass) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.update_role.mock) {
            await scenario.update_role.mock({ fail: false, description });
          }

          // Given:
          let { role_id, values } = await input();
          let endpoint = `${API_BASE}/${role_id}`;

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
      for (let { id, description, mock, input, then } of scenario.update_role.fail) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.update_role.mock) {
            await scenario.update_role.mock({ fail: true, description });
          }

          // Given:
          let { role_id, values } = await input();
          let endpoint = `${API_BASE}/${role_id}`;

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

  describe("delete role:", () => {
    describe('should return data object empty when:', () => {
      for (let { id, description, mock, input, then } of scenario.delete_role.pass) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.delete_role.mock) {
            await scenario.delete_role.mock({ fail: false, description });
          }

          // Given:
          let { role_id, query } = await input();
          let endpoint = `${API_BASE}/${role_id}`;

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
      for (let { id, description, mock, input, then } of scenario.delete_role.fail) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.delete_role.mock) {
            await scenario.delete_role.mock({ fail: true, description });
          }

          // Given:
          let { role_id, query } = await input();
          let endpoint = `${API_BASE}/${role_id}`;

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

  describe("get permissions:", () => {
    describe('should return data when:', () => {
      for (let { id, description, mock, input, then } of scenario.get_permissions.pass) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.get_permissions.mock) {
            await scenario.get_permissions.mock({ fail: false, description });
          }

          // Given:
          let { role_id, query } = await input();
          let endpoint = `${API_BASE}/${role_id}/permissions`;

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
      for (let { id, description, mock, input, then } of scenario.get_permissions.fail) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.get_permissions.mock) {
            await scenario.get_permissions.mock({ fail: true, description });
          }

          // Given:
          let { role_id, query } = await input();
          let endpoint = `${API_BASE}/${role_id}/permissions`;

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

  describe("set permissions:", () => {
    describe('should return data when:', () => {
      for (let { id, description, mock, input, then } of scenario.set_permissions.pass) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.set_permissions.mock) {
            await scenario.set_permissions.mock({ fail: false, description });
          }

          // Given:
          let { role_id, permissions } = await input();
          let endpoint = `${API_BASE}/${role_id}/permissions`;

          // When:
          let res = await request("post", endpoint).send({
            values : permissions
          });

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
      for (let { id, description, mock, input, then } of scenario.set_permissions.fail) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.set_permissions.mock) {
            await scenario.set_permissions.mock({ fail: true, description });
          }

          // Given:
          let { role_id, permissions } = await input();
          let endpoint = `${API_BASE}/${role_id}/permissions`;

          // When:
          let res = await request("post", endpoint).send({
            values : permissions
          });

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

  describe("get permission:", () => {
    describe('should return data when:', () => {
      for (let { id, description, mock, input, then } of scenario.get_permission.pass) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.get_permission.mock) {
            await scenario.get_permission.mock({ fail: false, description });
          }

          // Given:
          let { role_id, permission_id } = await input();
          let endpoint = `${API_BASE}/${role_id}/permissions/${permission_id}`;

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
      for (let { id, description, mock, input, then } of scenario.get_permission.fail) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.get_permission.mock) {
            await scenario.get_permission.mock({ fail: true, description });
          }

          // Given:
          let { role_id, permission_id } = await input();
          let endpoint = `${API_BASE}/${role_id}/permissions/${permission_id}`;

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

  describe("update permission:", () => {
    describe('should return data when:', () => {
      for (let { id, description, mock, input, then } of scenario.update_permission.pass) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.update_permission.mock) {
            await scenario.update_permission.mock({ fail: false, description });
          }

          // Given:
          let { role_id, permission_id, values } = await input();
          let endpoint = `${API_BASE}/${role_id}/permissions/${permission_id}`;

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
      for (let { id, description, mock, input, then } of scenario.update_permission.fail) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.update_permission.mock) {
            await scenario.update_permission.mock({ fail: true, description });
          }

          // Given:
          let { role_id, permission_id, values } = await input();
          let endpoint = `${API_BASE}/${role_id}/permissions/${permission_id}`;

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

  describe("remove permission:", () => {
    describe('should return data when:', () => {
      for (let { id, description, mock, input, then } of scenario.remove_permission.pass) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.remove_permission.mock) {
            await scenario.remove_permission.mock({ fail: false, description });
          }

          // Given:
          let { role_id, permission_id } = await input();
          let endpoint = `${API_BASE}/${role_id}/permissions/${permission_id}`;

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
      for (let { id, description, mock, input, then } of scenario.remove_permission.fail) {
        it(`${id} - ${description}`, async () => {
          // Setup:
          if (mock) {
            await mock(await input());
          } else if (scenario.remove_permission.mock) {
            await scenario.remove_permission.mock({ fail: true, description });
          }

          // Given:
          let { role_id, permission_id } = await input();
          let endpoint = `${API_BASE}/${role_id}/permissions/${permission_id}`;

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
