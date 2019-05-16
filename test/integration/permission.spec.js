import setup_factory from './index';
import db from 'src/db/models';
import { request } from 'test/utils';
import uuid from 'uuid/v4';

const IS_INTEGRATION_MOCK = JSON.parse(process.env.MOCK);
const ERROR_MOCK = new Error('error mocked.');
const API_BASE = '/api/v1/permissions';
const setup = setup_factory(db, IS_INTEGRATION_MOCK);
const { Permission } = db.sequelize.models;

describe("Permission Service:", () => {
  beforeAll(setup.before_all);
  beforeEach(setup.before_each);

  // --------------------------------------------------------------------------

  describe("get permissions:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - query is: {}`, async () => {
        // Given:
        let querystring = {};

        // When:
        let res = await request("get", API_BASE).query(querystring);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - query is: { search: {} }`, async () => {
        // Given:
        let querystring = { search: {} };

        // When:
        let res = await request("get", API_BASE).query(querystring);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - query is: undefined`, async () => {
        // Given:
        let querystring = { search: undefined };

        // When:
        let res = await request("get", API_BASE).query(querystring);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - query is: { search: { name: 'ccccc' } }`, async () => {
        // Given:
        let querystring = { search: { name: 'ccccc' } };

        // When:
        let res = await request("get", API_BASE).query(querystring);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - query is: { search: { name: { like: '%vvv%' } } }`, async () => {
        // Given:
        let querystring = { search: { name: { like: '%vvv%' } } };

        // When:
        let res = await request("get", API_BASE).query(querystring);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - query validation fail`, async () => {
        // Given:
        let querystring = { search: null };

        // When:
        let res = await request("get", API_BASE).query(querystring);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - Action throw error`, async () => {
        // Mock:
        jest.spyOn(Permission, 'findAll').mockRejectedValue(ERROR_MOCK);

        // Given:
        let querystring = { search: { name: { eq: 'Permission A' } } };

        // When:
        let res = await request("get", API_BASE).query(querystring);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe("create permissions:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - values are valid`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Permission, 'create').mockResolvedValue(setup.instance.permissions[0]);
        }

        // Given:
        let values = { name: 'demo' };

        // When:
        let res = await request("post", API_BASE).send({ values });

        // Then:
        expect(res.statusCode).toEqual(201);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - is created by a specific user`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Permission, 'create').mockResolvedValue(Permission.build({
            ...setup.instance.permissions[0].dataValues,
            created_by: setup.instance.users[0].id,
            updated_by: setup.instance.users[0].id,
          }));
        }

        // Given:
        let values = {
          name: 'demo',
          created_by: setup.instance.users[0].id,
          updated_by: setup.instance.users[0].id
        };

        // When:
        let res = await request("post", API_BASE).send({ values });

        // Then:
        expect(res.statusCode).toEqual(201);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
        expect(res.body.data.created_by).toEqual(setup.instance.users[0].id);
        expect(res.body.data.updated_by).toEqual(setup.instance.users[0].id);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - values are not valid`, async () => {
        // Given:
        let values = null;

        // When:
        let res = await request("post", API_BASE).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - value "name" is not valid`, async () => {
        // Given:
        let values = { name: '' };

        // When:
        let res = await request("post", API_BASE).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - action throw error`, async () => {
        // Mock:
        jest.spyOn(Permission, 'create').mockRejectedValue(ERROR_MOCK);

        // Given:
        let values = { name: 'Permission A' };

        // When:
        let res = await request("post", API_BASE).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe("get Permission:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - Permission is found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Permission, 'findByPk').mockResolvedValue(setup.instance.permissions[0]);
        }

        // Given:
        let Permission_id = setup.instance.permissions[0].id;

        // When:
        let res = await request("get", `${API_BASE}/${Permission_id}`);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - Permission id param is malformed`, async () => {
        // Given:
        let Permission_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111dd';

        // When:
        let res = await request("get", `${API_BASE}/${Permission_id}`);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - Permission is not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Permission, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let Permission_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';

        // When:
        let res = await request("get", `${API_BASE}/${Permission_id}`);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe("update Permission:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - values are valid`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Permission, 'findByPk').mockResolvedValue({
            update: async (payload, options) => Permission.build({
              ...setup.instance.permissions[0].dataValues,
              ...payload
            })
          });
        }

        // Given:
        let Permission_id = setup.instance.permissions[0].id;
        let values = { name: 'Permission A' };
        let endpoint = `${API_BASE}/${Permission_id}`;

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - values are not valid`, async () => {
        // Given:
        let Permission_id = setup.instance.permissions[0].id;
        let values = null;
        let endpoint = `${API_BASE}/${Permission_id}`;

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - Permission is not found`, async () => {
        // Mock:
        jest.spyOn(Permission, 'findByPk').mockResolvedValue(null);

        // Given:
        let Permission_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
        let values = { name: 'Permission A' };
        let endpoint = `${API_BASE}/${Permission_id}`;

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - Permission was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Permission, 'findByPk').mockRejectedValue(ERROR_MOCK);

        // Given:
        let Permission_id = setup.instance.permissions[0].id;
        let values = { name: 'Permission A' };
        let endpoint = `${API_BASE}/${Permission_id}`;

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - Permission was trying to be updated`, async () => {
        // Mock:
        jest.spyOn(Permission, 'findByPk').mockResolvedValue({
          update: async (payload, options) => {
            throw ERROR_MOCK;
          }
        });

        // Given:
        let Permission_id = setup.instance.permissions[0].id;
        let values = { name: 'Permission A' };
        let endpoint = `${API_BASE}/${Permission_id}`;

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe("delete Permission:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - Permission is deleted without options`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Permission, 'findByPk').mockResolvedValue({
            destroy: async (options) => {
              let Permission = setup.instance.permissions[0];
              Permission.deleted_at = new Date().toISOString();
              return Permission;
            }
          });
        }

        // Given:
        let Permission_id = setup.instance.permissions[0].id;
        let endpoint = `${API_BASE}/${Permission_id}`;
        let options = {}

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - Permission is deleted with the force option as true`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Permission, 'findByPk').mockResolvedValue({
            destroy: async (options) => {
              let Permission = setup.instance.permissions[0];
              Permission.deleted_at = new Date().toISOString();
              return Permission;
            }
          });
        }

        // Given:
        let Permission_id = setup.instance.permissions[0].id;
        let endpoint = `${API_BASE}/${Permission_id}`;
        let options = { force: true }

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - Permission is deleted with the force option as false`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Permission, 'findByPk').mockResolvedValue({
            destroy: async (options) => {
              let Permission = setup.instance.permissions[0];
              Permission.deleted_at = new Date().toISOString();
              return Permission;
            }
          });
        }

        // Given:
        let Permission_id = setup.instance.permissions[0].id;
        let endpoint = `${API_BASE}/${Permission_id}`;
        let options = { force: false }

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - Permission id param is malformed`, async () => {
        // Given:
        let Permission_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let endpoint = `${API_BASE}/${Permission_id}`;
        let options = {}

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - Permission is not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Permission, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let Permission_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
        let endpoint = `${API_BASE}/${Permission_id}`;
        let options = {}

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - Permission was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Permission, 'findByPk').mockRejectedValue(ERROR_MOCK);

        // Given:
        let Permission_id = setup.instance.permissions[0].id;
        let endpoint = `${API_BASE}/${Permission_id}`;
        let options = {}

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - Permission was trying to be deleted`, async () => {
        // Mock:
        jest.spyOn(Permission, 'findByPk').mockResolvedValue({
          destroy: async (options) => {
            throw ERROR_MOCK;
          }
        });

        // Given:
        let Permission_id = setup.instance.permissions[0].id;
        let endpoint = `${API_BASE}/${Permission_id}`;
        let options = {}

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  // --------------------------------------------------------------------------

  afterEach(setup.after_each);
  afterAll(setup.after_all);
});
