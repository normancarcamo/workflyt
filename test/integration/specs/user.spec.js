import { setup, scenario } from '../setup/user.setup';
import { request } from 'test/utils';

const API_BASE = `/api/v1/users`;

describe("User Service:", () => {
  beforeAll(setup.before_all);
  beforeEach(setup.before_each);
  afterEach(setup.after_each);
  afterAll(setup.after_all);

  describe("get users", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.get_users.pass) {
        it(description, async () => {
          // Setup:
          await scenario.get_users.mock({ input, fail: false, stage: description });

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
      for (let { id, description, input } of scenario.get_users.fail) {
        it(description, async () => {
          // Setup:
          await scenario.get_users.mock({ input, fail: true, stage: description });

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

  describe("create users:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.create_users.pass) {
        it(description, async () => {
          // Given:
          await scenario.create_users.mock({ input, fail: false, stage: description });

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
      for (let { id, description, input } of scenario.create_users.fail) {
        it(description, async () => {
          // Given:
          await scenario.create_users.mock({ input, fail: true, stage: description });

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

  describe("get user:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.get_user.pass) {
        it(description, async () => {
          // Setup:
          await scenario.get_user.mock({ input, fail: false, stage: description });

          // Given:
          let { user_id } = await input();

          // When:
          let res = await request("get", `${API_BASE}/${user_id}`);

          // Then:
          expect(res.statusCode).toEqual(200);
          expect(res.body.data).toBeDefined();
          expect(res.body.error).toBeOneOf([ undefined, null ]);
        });
      }
    });
    describe('should return error when:', () => {
      for (let { id, description, input } of scenario.get_user.fail) {
        it(description, async () => {
          // Setup:
          await scenario.get_user.mock({ input, fail: true, stage: description });

          // Given:
          let { user_id } = await input();

          // When:
          let res = await request("get", `${API_BASE}/${user_id}`);

          // Then:
          expect(res.statusCode).toBeWithin(400, 522);
          expect(res.body.error).toBeDefined();
          expect(res.body.data).toBeOneOf([ undefined, null ]);
        });
      }
    });
  });

  describe("update user:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.update_user.pass) {
        it(description, async () => {
          // Setup:
          await scenario.update_user.mock({ input, fail: false, stage: description });

          // Given:
          let { user_id, values } = await input();
          let endpoint = `${API_BASE}/${user_id}`;

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
      for (let { id, description, input } of scenario.update_user.fail) {
        it(description, async () => {
          // Setup:
          await scenario.update_user.mock({ input, fail: true, stage: description });

          // Given:
          let { user_id, values } = await input();
          let endpoint = `${API_BASE}/${user_id}`;

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

  describe("delete user:", () => {
    describe('should return data object empty when:', () => {
      for (let { id, description, input } of scenario.delete_user.pass) {
        it(description, async () => {
          // Setup:
          await scenario.delete_user.mock({ input, fail: false, stage: description });

          // Given:
          let { user_id, query } = await input();
          let endpoint = `${API_BASE}/${user_id}`;

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
      for (let { id, description, input } of scenario.delete_user.fail) {
        it(description, async () => {
          // Setup:
          await scenario.delete_user.mock({ input, fail: true, stage: description });

          // Given:
          let { user_id, query } = await input();
          let endpoint = `${API_BASE}/${user_id}`;

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

  describe("get roles:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.get_roles.pass) {
        it(description, async () => {
          // Setup:
          await scenario.get_roles.mock({ input, fail: false, stage: description });

          // Given:
          let { user_id, query } = await input();
          let endpoint = `${API_BASE}/${user_id}/roles`;

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
      for (let { id, description, input } of scenario.get_roles.fail) {
        it(description, async () => {
          // Setup:
          await scenario.get_roles.mock({ input, fail: true, stage: description });

          // Given:
          let { user_id, query } = await input();
          let endpoint = `${API_BASE}/${user_id}/roles`;

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

  describe("set roles:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.set_roles.pass) {
        it(description, async () => {
          // Setup:
          await scenario.set_roles.mock({ input, fail: false, stage: description });

          // Given:
          let { user_id, roles } = await input();
          let endpoint = `${API_BASE}/${user_id}/roles`;

          // When:
          let res = await request("post", endpoint).send({ values: roles });

          // Then:
          expect(res.statusCode).toEqual(200);
          expect(res.body.data).toBeDefined();
          expect(res.body.error).toBeOneOf([ undefined, null ]);
        });
      }
    });
    describe('should return error when:', () => {
      for (let { id, description, input } of scenario.set_roles.fail) {
        it(description, async () => {
          // Setup:
          await scenario.set_roles.mock({ input, fail: true, stage: description });

          // Given:
          let { user_id, roles } = await input();
          let endpoint = `${API_BASE}/${user_id}/roles`;

          // When:
          let res = await request("post", endpoint).send({ values: roles });

          // Then:
          expect(res.statusCode).toBeWithin(400, 522);
          expect(res.body.error).toBeDefined();
          expect(res.body.data).toBeOneOf([ undefined, null ]);
        });
      }
    });
  });

  describe("get role:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.get_role.pass) {
        it(description, async () => {
          // Setup:
          await scenario.get_role.mock({ input, fail: false, stage: description });

          // Given:
          let { user_id, role_id } = await input();
          let endpoint = `${API_BASE}/${user_id}/roles/${role_id}`;

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
      for (let { id, description, input } of scenario.get_role.fail) {
        it(description, async () => {
          // Setup:
          await scenario.get_role.mock({ input, fail: true, stage: description });

          // Given:
          let { user_id, role_id } = await input();
          let endpoint = `${API_BASE}/${user_id}/roles/${role_id}`;

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

  describe("update role:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.update_role.pass) {
        it(description, async () => {
          // Setup:
          await scenario.update_role.mock({ input, fail: false, stage: description });

          // Given:
          let { user_id, role_id, values } = await input();
          let endpoint = `${API_BASE}/${user_id}/roles/${role_id}`;

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
      for (let { id, description, input } of scenario.update_role.fail) {
        it(description, async () => {
          // Setup:
          await scenario.update_role.mock({ input, fail: true, stage: description });

          // Given:
          let { user_id, role_id, values } = await input();
          let endpoint = `${API_BASE}/${user_id}/roles/${role_id}`;

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

  describe("remove role:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.remove_role.pass) {
        it(description, async () => {
          // Setup:
          await scenario.remove_role.mock({ input, fail: false, stage: description });

          // Given:
          let { user_id, role_id } = await input();
          let endpoint = `${API_BASE}/${user_id}/roles/${role_id}`;

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
      for (let { id, description, input } of scenario.remove_role.fail) {
        it(description, async () => {
          // Setup:
          await scenario.remove_role.mock({ input, fail: true, stage: description });

          // Given:
          let { user_id, role_id } = await input();
          let endpoint = `${API_BASE}/${user_id}/roles/${role_id}`;

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
});
