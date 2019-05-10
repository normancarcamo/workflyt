import { setup, scenario } from '../setup/permission.setup';
import { request } from 'test/utils';

const API_BASE = `/api/v1/permissions`;

describe("Permission Service:", () => {
  beforeAll(setup.before_all);
  beforeEach(setup.before_each);
  afterEach(setup.after_each);
  afterAll(setup.after_all);

  describe("get permissions", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.get_permissions.pass) {
        it(description, async () => {
          // Setup:
          await scenario.get_permissions.mock({ input, fail: false, stage: description });

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
      for (let { id, description, input } of scenario.get_permissions.fail) {
        it(description, async () => {
          // Setup:
          await scenario.get_permissions.mock({ input, fail: true, stage: description });

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

  describe("create permissions:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.create_permissions.pass) {
        it(description, async () => {
          // Given:
          await scenario.create_permissions.mock({ input, fail: false, stage: description });

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
      for (let { id, description, input } of scenario.create_permissions.fail) {
        it(description, async () => {
          // Given:
          await scenario.create_permissions.mock({ input, fail: true, stage: description });

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

  describe("get permission:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.get_permission.pass) {
        it(description, async () => {
          // Setup:
          await scenario.get_permission.mock({ input, fail: false, stage: description });

          // Given:
          let { permission_id } = await input();

          // When:
          let res = await request("get", `${API_BASE}/${permission_id}`);

          // Then:
          expect(res.statusCode).toEqual(200);
          expect(res.body.data).toBeDefined();
          expect(res.body.error).toBeOneOf([ undefined, null ]);
        });
      }
    });
    describe('should return error when:', () => {
      for (let { id, description, input } of scenario.get_permission.fail) {
        it(description, async () => {
          // Setup:
          await scenario.get_permission.mock({ input, fail: true, stage: description });

          // Given:
          let { permission_id } = await input();

          // When:
          let res = await request("get", `${API_BASE}/${permission_id}`);

          // Then:
          expect(res.statusCode).toBeWithin(400, 522);
          expect(res.body.error).toBeDefined();
          expect(res.body.data).toBeOneOf([ undefined, null ]);
        });
      }
    });
  });

  describe("update permission:", () => {
    describe('should return data when:', () => {
      for (let { id, description, input } of scenario.update_permission.pass) {
        it(description, async () => {
          // Setup:
          await scenario.update_permission.mock({ input, fail: false, stage: description });

          // Given:
          let { permission_id, values } = await input();
          let endpoint = `${API_BASE}/${permission_id}`;

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
      for (let { id, description, input } of scenario.update_permission.fail) {
        it(description, async () => {
          // Setup:
          await scenario.update_permission.mock({ input, fail: true, stage: description });

          // Given:
          let { permission_id, values } = await input();
          let endpoint = `${API_BASE}/${permission_id}`;

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

  describe("delete permission:", () => {
    describe('should return data object empty when:', () => {
      for (let { id, description, input } of scenario.delete_permission.pass) {
        it(description, async () => {
          // Setup:
          await scenario.delete_permission.mock({ input, fail: false, stage: description });

          // Given:
          let { permission_id, query } = await input();
          let endpoint = `${API_BASE}/${permission_id}`;

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
      for (let { id, description, input } of scenario.delete_permission.fail) {
        it(description, async () => {
          // Setup:
          await scenario.delete_permission.mock({ input, fail: true, stage: description });

          // Given:
          let { permission_id, query } = await input();
          let endpoint = `${API_BASE}/${permission_id}`;

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
