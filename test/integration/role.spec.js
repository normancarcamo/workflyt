import setup_factory from './index';
import db from 'src/db/models';
import { request } from 'test/utils';
import uuid from 'uuid/v4';

const IS_INTEGRATION_MOCK = JSON.parse(process.env.MOCK);
const ERROR_MOCK = new Error('error mocked.');
const API_BASE = '/api/v1/roles';
const setup = setup_factory(db, IS_INTEGRATION_MOCK);
const { Role } = db.sequelize.models;

describe("Role Service:", () => {
  beforeAll(setup.before_all);
  beforeEach(setup.before_each);

  // --------------------------------------------------------------------------

  describe("get roles:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - query is: {}`, async () => {
        // Given:
        let options = {};

        // When:
        let res = await request("get", API_BASE).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - query is: { search: {} }`, async () => {
        // Given:
        let options = { search: {} };

        // When:
        let res = await request("get", API_BASE).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - query is: undefined`, async () => {
        // Given:
        let options = { search: undefined };

        // When:
        let res = await request("get", API_BASE).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - query is: { search: { name: 'ccccc' } }`, async () => {
        // Given:
        let options = { search: { name: 'ccccc' } };

        // When:
        let res = await request("get", API_BASE).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - query is: { search: { name: { like: '%vvv%' } } }`, async () => {
        // Given:
        let options = { search: { name: { like: '%vvv%' } } };

        // When:
        let res = await request("get", API_BASE).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - query validation fail`, async () => {
        // Given:
        let options = { search: null };

        // When:
        let res = await request("get", API_BASE).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - action throw error`, async () => {
        // Setup:
        jest.spyOn(Role, 'findAll').mockRejectedValue(ERROR_MOCK);

        // Given:
        let options = { search: { name: { eq: 'role a' } } };

        // When:
        let res = await request("get", API_BASE).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe("create roles:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - values are valid`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Role, 'create').mockResolvedValue(setup.instance.roles[0]);
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
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Role, 'create').mockResolvedValue(Role.build({
            ...setup.instance.roles[0].dataValues,
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
        // Setup:
        jest.spyOn(Role, 'create').mockRejectedValue(ERROR_MOCK);

        // Given:
        let values = { name: 'role a' };

        // When:
        let res = await request("post", API_BASE).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe("get role:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - role is found`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Role, 'findByPk').mockResolvedValue(setup.instance.roles[0]);
        }

        // Given:
        let role_id = setup.instance.roles[0].id;

        // When:
        let res = await request("get", `${API_BASE}/${role_id}`);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - role id param is malformed`, async () => {
        // Given:
        let role_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111dd';

        // When:
        let res = await request("get", `${API_BASE}/${role_id}`);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - role is not found`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Role, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let role_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';

        // When:
        let res = await request("get", `${API_BASE}/${role_id}`);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe("update role:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - values are valid`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Role, 'findByPk').mockResolvedValue({
            update: async (payload, options) => Role.build({
              ...setup.instance.roles[0].dataValues,
              ...payload
            })
          });
        }

        // Given:
        let role_id = setup.instance.roles[0].id;
        let values = { name: 'role a' };
        let endpoint = `${API_BASE}/${role_id}`;

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
        let role_id = setup.instance.roles[0].id;
        let values = null;
        let endpoint = `${API_BASE}/${role_id}`;

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - role is not found`, async () => {
        // Setup:
        jest.spyOn(Role, 'findByPk').mockResolvedValue(null);

        // Given:
        let role_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
        let values = { name: 'role a' };
        let endpoint = `${API_BASE}/${role_id}`;

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - role was trying to be found`, async () => {
        // Setup:
        jest.spyOn(Role, 'findByPk').mockRejectedValue(ERROR_MOCK);

        // Given:
        let role_id = setup.instance.roles[0].id;
        let values = { name: 'role a' };
        let endpoint = `${API_BASE}/${role_id}`;

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - role was trying to be updated`, async () => {
        // Setup:
        jest.spyOn(Role, 'findByPk').mockResolvedValue({
          update: async (payload, options) => {
            throw ERROR_MOCK;
          }
        });

        // Given:
        let role_id = setup.instance.roles[0].id;
        let values = { name: 'role a' };
        let endpoint = `${API_BASE}/${role_id}`;

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe("delete role:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - role is deleted without options`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Role, 'findByPk').mockResolvedValue({
            destroy: async (options) => {
              let role = setup.instance.roles[0];
              role.deleted_at = new Date().toISOString();
              return role;
            }
          });
        }

        // Given:
        let role_id = setup.instance.roles[0].id;
        let endpoint = `${API_BASE}/${role_id}`;
        let options = {}

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - role is deleted with the force option as true`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Role, 'findByPk').mockResolvedValue({
            destroy: async (options) => {
              let role = setup.instance.roles[0];
              role.deleted_at = new Date().toISOString();
              return role;
            }
          });
        }

        // Given:
        let role_id = setup.instance.roles[0].id;
        let endpoint = `${API_BASE}/${role_id}`;
        let options = { force: true }

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - role is deleted with the force option as false`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Role, 'findByPk').mockResolvedValue({
            destroy: async (options) => {
              let role = setup.instance.roles[0];
              role.deleted_at = new Date().toISOString();
              return role;
            }
          });
        }

        // Given:
        let role_id = setup.instance.roles[0].id;
        let endpoint = `${API_BASE}/${role_id}`;
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
      it(`${uuid()} - role id param is malformed`, async () => {
        // Given:
        let role_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let endpoint = `${API_BASE}/${role_id}`;
        let options = {}

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - role is not found`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Role, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let role_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
        let endpoint = `${API_BASE}/${role_id}`;
        let options = {}

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - role was trying to be found`, async () => {
        // Setup:
        jest.spyOn(Role, 'findByPk').mockRejectedValue(ERROR_MOCK);

        // Given:
        let role_id = setup.instance.roles[0].id;
        let endpoint = `${API_BASE}/${role_id}`;
        let options = {}

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - role was trying to be deleted`, async () => {
        // Setup:
        jest.spyOn(Role, 'findByPk').mockResolvedValue({
          destroy: async (options) => {
            throw ERROR_MOCK;
          }
        });

        // Given:
        let role_id = setup.instance.roles[0].id;
        let endpoint = `${API_BASE}/${role_id}`;
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

  describe('get permissions', () => {
    describe('should return data when:', () => {
      it(`${uuid()} - query is: empty`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Role, 'findByPk').mockResolvedValue({
            getPermissions: async payload => setup.instance.permissions
          });
        }

        // Given:
        let role_id = setup.instance.roles[0].id;
        let endpoint = `${API_BASE}/${role_id}/permissions`;
        let options = {};

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBe(null);
      });
      it(`${uuid()} - query is: name=dknd`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Role, 'findByPk').mockResolvedValue({
            getPermissions: async payload => setup.instance.permissions
          });
        }

        // Given:
        let role_id = setup.instance.roles[0].id;
        let endpoint = `${API_BASE}/${role_id}/permissions`;
        let options = { search: { name: 'dknd' } };

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBe(null);
      });
      it(`${uuid()} - query is: name like %disk%`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Role, 'findByPk').mockResolvedValue({
            getPermissions: async payload => setup.instance.permissions
          });
        }

        // Given:
        let role_id = setup.instance.roles[0].id;
        let endpoint = `${API_BASE}/${role_id}/permissions`;
        let options = { search: { name: { like: '%disk%' } } };

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBe(null);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - role param id is malformed`, async () => {
        // Given:
        let role_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let endpoint = `${API_BASE}/${role_id}/permissions`;
        let options = {};

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - role is not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Role, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let role_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
        let endpoint = `${API_BASE}/${role_id}/permissions`;
        let options = {};

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - role was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Role, 'findByPk').mockRejectedValue(new Error('error mocked.'));

        // Given:
        let role_id = setup.instance.roles[0].id;
        let endpoint = `${API_BASE}/${role_id}/permissions`;
        let options = {};

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - permissions were trying to be found`, async () => {
        // Setup:
        jest.spyOn(Role, 'findByPk').mockResolvedValue({
          getPermissions: async (options) => {
            throw new Error('error mocked.');
          }
        });

        // Given:
        let role_id = setup.instance.roles[0].id;
        let endpoint = `${API_BASE}/${role_id}/permissions`;
        let options = {};

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe('set permissions', () => {
    describe('should return data when:', () => {
      it(`${uuid()} - permissions are set`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Role, 'findByPk').mockResolvedValue({
            addPermissions: async payload => []
          });
        }

        // Given:
        let role_id = setup.instance.roles[0].id;
        let permissions = setup.instance.permissions.map(permission => permission.id);
        let endpoint = `${API_BASE}/${role_id}/permissions`;

        // When:
        let res = await request("post", endpoint).send({ permissions });

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBe(null);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - role param id is malformed`, async () => {
        // Given:
        let role_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let permissions = setup.instance.permissions.map(permission => permission.id);
        let endpoint = `${API_BASE}/${role_id}/permissions`;

        // When:
        let res = await request("post", endpoint).send({ permissions });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - permissions id are malformed`, async () => {
        // Given:
        let role_id = setup.instance.roles[0].id;
        let permissions = [
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s'
        ];
        let endpoint = `${API_BASE}/${role_id}/permissions`;

        // When:
        let res = await request("post", endpoint).send({ permissions });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - role is not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Role, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let role_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
        let permissions = setup.instance.permissions.map(permission => permission.id);
        let endpoint = `${API_BASE}/${role_id}/permissions`;

        // When:
        let res = await request("post", endpoint).send({ permissions });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - role was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Role, 'findByPk').mockRejectedValue(new Error('error mocked.'));

        // Given:
        let role_id = setup.instance.roles[0].id;
        let permissions = setup.instance.permissions.map(permission => permission.id);
        let endpoint = `${API_BASE}/${role_id}/permissions`;

        // When:
        let res = await request("post", endpoint).send({ permissions });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - permissions were trying to be set`, async () => {
        // Setup:
        jest.spyOn(Role, 'findByPk').mockResolvedValue({
          addPermissions: async (options) => {
            throw new Error('error mocked.');
          }
        });

        // Given:
        let role_id = setup.instance.roles[0].id;
        let permissions = setup.instance.permissions.map(permission => permission.id);
        let endpoint = `${API_BASE}/${role_id}/permissions`;

        // When:
        let res = await request("post", endpoint).send({ permissions });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe('get permission', () => {
    describe('should return data when:', () => {
      it(`${uuid()} - permission is found`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Role, 'findByPk').mockResolvedValue({
            getPermissions: async (options) => setup.instance.permissions[0]
          });
        }

        // Given:
        let role_id = setup.instance.roles[0].id;
        let permission_id = setup.instance.permissions[0].id;
        let endpoint = `${API_BASE}/${role_id}/permissions/${permission_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBe(null);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - role param id is malformed`, async () => {
        // Given:
        let role_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let permission_id = setup.instance.permissions[0].id;
        let endpoint = `${API_BASE}/${role_id}/permissions/${permission_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - permission param id is malformed`, async () => {
        // Given:
        let role_id = setup.instance.roles[0].id;
        let permission_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let endpoint = `${API_BASE}/${role_id}/permissions/${permission_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - role is not found`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Role, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let role_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
        let permission_id = setup.instance.permissions[0].id;
        let endpoint = `${API_BASE}/${role_id}/permissions/${permission_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - permission is not found`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Role, 'findByPk').mockResolvedValue({
            getPermissions: async (options) => null
          });
        }

        // Given:
        let role_id = setup.instance.roles[0].id;
        let permission_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
        let endpoint = `${API_BASE}/${role_id}/permissions/${permission_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - role was trying to be found`, async () => {
        // Setup:
        jest.spyOn(Role, 'findByPk').mockRejectedValue(new Error('error mocked.'));

        // Given:
        let role_id = setup.instance.roles[0].id;
        let permission_id = setup.instance.permissions[0].id;
        let endpoint = `${API_BASE}/${role_id}/permissions/${permission_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - permission was trying to be found`, async () => {
        // Setup:
        jest.spyOn(Role, 'findByPk').mockResolvedValue({
          getPermissions: async (options) => {
            throw new Error('error mocked.');
          }
        });

        // Given:
        let role_id = setup.instance.roles[0].id;
        let permission_id = setup.instance.permissions[0].id;
        let endpoint = `${API_BASE}/${role_id}/permissions/${permission_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe('update permission', () => {
    describe('should return data when:', () => {
      it(`${uuid()} - permission is found and values are valid`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Role, 'findByPk').mockResolvedValue({
            getPermissions: async payload => ({
              RolePermissions: {
                update: async (payload, options) => {
                  return setup.instance.permissions
                }
              }
            }),
          });
        }

        // Given:
        let role_id = setup.instance.roles[0].id;
        let permission_id = setup.instance.permissions[0].id;
        let endpoint = `${API_BASE}/${role_id}/permissions/${permission_id}`;
        let values = { extra: { units: 20 } };

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBe(null);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - role param id is malformed`, async () => {
        // Given:
        let role_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let permission_id = setup.instance.permissions[0].id;
        let endpoint = `${API_BASE}/${role_id}/permissions/${permission_id}`;
        let values = { extra: { units: 20 } };

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - permission param id is malformed`, async () => {
        // Given:
        let role_id = setup.instance.roles[0].id;
        let permission_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let endpoint = `${API_BASE}/${role_id}/permissions/${permission_id}`;
        let values = { extra: { units: 20 } };

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - role is not found`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Role, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let role_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
        let permission_id = setup.instance.permissions[0].id;
        let endpoint = `${API_BASE}/${role_id}/permissions/${permission_id}`;
        let values = { extra: { units: 20 } };

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - permission is not found`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Role, 'findByPk').mockResolvedValue({
            getPermissions: async (options) => null
          });
        }

        // Given:
        let role_id = setup.instance.roles[0].id;
        let permission_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
        let endpoint = `${API_BASE}/${role_id}/permissions/${permission_id}`;
        let values = { extra: { units: 20 } };

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - role was trying to be found`, async () => {
        // Setup:
        jest.spyOn(Role, 'findByPk').mockRejectedValue(new Error('error mocked.'));

        // Given:
        let role_id = setup.instance.roles[0].id;
        let permission_id = setup.instance.permissions[0].id;
        let endpoint = `${API_BASE}/${role_id}/permissions/${permission_id}`;
        let values = { extra: { units: 20 } };

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - permission was trying to be found`, async () => {
        // Setup:
        jest.spyOn(Role, 'findByPk').mockResolvedValue({
          getPermissions: async (options) => {
            throw new Error('error mocked.');
          }
        });

        // Given:
        let role_id = setup.instance.roles[0].id;
        let permission_id = setup.instance.permissions[0].id;
        let endpoint = `${API_BASE}/${role_id}/permissions/${permission_id}`;
        let values = { extra: { units: 20 } };

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - permission was trying to be updated`, async () => {
        // Setup:
        jest.spyOn(Role, 'findByPk').mockResolvedValue({
          getPermissions: async payload => ({
            RolePermissions: {
              update: async (payload, options) => {
                throw new Error('error mocked.');
              }
            }
          })
        });

        // Given:
        let role_id = setup.instance.roles[0].id;
        let permission_id = setup.instance.permissions[0].id;
        let endpoint = `${API_BASE}/${role_id}/permissions/${permission_id}`;
        let values = { extra: { units: 20 } };

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe('remove permission', () => {
    describe('should return data when:', () => {
      it(`${uuid()} - permission is found and values are valid`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Role, 'findByPk').mockResolvedValue({
            getPermissions: async (payload, options) => ({}),
            removePermission: async (payload, options) => setup.instance.permissions[0]
          });
        }

        // Given:
        let role_id = setup.instance.roles[0].id;
        let permission_id = setup.instance.permissions[0].id;
        let endpoint = `${API_BASE}/${role_id}/permissions/${permission_id}`;
        let options = {};

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBe(null);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - role param id is malformed`, async () => {
        // Given:
        let role_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let permission_id = setup.instance.permissions[0].id;
        let endpoint = `${API_BASE}/${role_id}/permissions/${permission_id}`;
        let options = {};

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - permission param id is malformed`, async () => {
        // Given:
        let role_id = setup.instance.roles[0].id;
        let permission_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let endpoint = `${API_BASE}/${role_id}/permissions/${permission_id}`;
        let options = {};

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - role is not found`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Role, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let role_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
        let permission_id = setup.instance.permissions[0].id;
        let endpoint = `${API_BASE}/${role_id}/permissions/${permission_id}`;
        let options = {};

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - permission is not found`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Role, 'findByPk').mockResolvedValue({
            getPermissions: async (options) => null
          });
        }

        // Given:
        let role_id = setup.instance.roles[0].id;
        let permission_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
        let endpoint = `${API_BASE}/${role_id}/permissions/${permission_id}`;
        let options = {};

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - role was trying to be found`, async () => {
        // Setup:
        jest.spyOn(Role, 'findByPk').mockRejectedValue(new Error('error mocked.'));

        // Given:
        let role_id = setup.instance.roles[0].id;
        let permission_id = setup.instance.permissions[0].id;
        let endpoint = `${API_BASE}/${role_id}/permissions/${permission_id}`;
        let options = {};

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - permission was trying to be found`, async () => {
        // Setup:
        jest.spyOn(Role, 'findByPk').mockResolvedValue({
          getPermissions: async (options) => {
            throw new Error('error mocked.');
          }
        });

        // Given:
        let role_id = setup.instance.roles[0].id;
        let permission_id = setup.instance.permissions[0].id;
        let endpoint = `${API_BASE}/${role_id}/permissions/${permission_id}`;
        let options = {};

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - permission was trying to be removed`, async () => {
        // Setup:
        jest.spyOn(Role, 'findByPk').mockResolvedValue({
          getPermissions: async (options) => ({}),
          removePermission: async (uuid, options) => {
            throw new Error('error mocked.');
          }
        });

        // Given:
        let role_id = setup.instance.roles[0].id;
        let permission_id = setup.instance.permissions[0].id;
        let endpoint = `${API_BASE}/${role_id}/permissions/${permission_id}`;
        let options = {};

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
