import setup_factory from './index';
import db from 'src/db/models';
import { request } from 'test/utils';
import uuid from 'uuid/v4';

const IS_INTEGRATION_MOCK = JSON.parse(process.env.MOCK);
const ERROR_MOCK = new Error('error mocked.');
const API_BASE = '/api/v1/users';
const setup = setup_factory(db, IS_INTEGRATION_MOCK);
const { User } = db.sequelize.models;

describe("User Service:", () => {
  beforeAll(setup.before_all);
  beforeEach(setup.before_each);

  // --------------------------------------------------------------------------

  describe("get users:", () => {
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
      it(`${uuid()} - query is: { search: { username: 'ccccc' } }`, async () => {
        // Given:
        let options = { search: { username: 'ccccc' } };

        // When:
        let res = await request("get", API_BASE).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - query is: { search: { username: { like: '%vvv%' } } }`, async () => {
        // Given:
        let options = { search: { username: { like: '%vvv%' } } };

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
        jest.spyOn(User, 'findAll').mockRejectedValue(ERROR_MOCK);

        // Given:
        let options = { search: { username: { eq: 'user a' } } };

        // When:
        let res = await request("get", API_BASE).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe("create users:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - values are valid`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(User, 'create').mockResolvedValue(setup.instance.users[0]);
        }

        // Given:
        let values = {
          employee_id: null,
          username: 'bingo',
          password: 'mdmdmd'
        };

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
          jest.spyOn(User, 'create').mockResolvedValue(User.build({
            ...setup.instance.users[0].dataValues,
            created_by: setup.instance.users[0].id,
            updated_by: setup.instance.users[0].id,
          }));
        }

        // Given:
        let values = {
          employee_id: setup.instance.employees[0].id,
          username: 'bingo',
          password: 'mdmdmd',
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
      it(`${uuid()} - value "username" is not valid`, async () => {
        // Given:
        let values = {
          employee_id: null,
          username: '',
          password: 'mdmdmd'
        };

        // When:
        let res = await request("post", API_BASE).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - value "password" is not valid`, async () => {
        // Given:
        let values = {
          employee_id: null,
          username: 'mdmdmd',
          password: ''
        };

        // When:
        let res = await request("post", API_BASE).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - action throw error`, async () => {
        // Setup:
        jest.spyOn(User, 'create').mockRejectedValue(ERROR_MOCK);

        // Given:
        let values = {
          employee_id: null,
          username: 'bingo',
          password: 'nanana'
        };

        // When:
        let res = await request("post", API_BASE).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe("get user:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - user is found`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(User, 'findByPk').mockResolvedValue(setup.instance.users[0]);
        }

        // Given:
        let user_id = setup.instance.users[0].id;

        // When:
        let res = await request("get", `${API_BASE}/${user_id}`);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - user id param is malformed`, async () => {
        // Given:
        let user_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111dd';

        // When:
        let res = await request("get", `${API_BASE}/${user_id}`);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - user is not found`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(User, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let user_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';

        // When:
        let res = await request("get", `${API_BASE}/${user_id}`);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe("update user:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - values are valid`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(User, 'findByPk').mockResolvedValue({
            update: async (payload, options) => User.build({
              ...setup.instance.users[0].dataValues,
              ...payload
            })
          });
        }

        // Given:
        let user_id = setup.instance.users[0].id;
        let values = { name: 'user a' };
        let endpoint = `${API_BASE}/${user_id}`;

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
        let user_id = setup.instance.users[0].id;
        let values = null;
        let endpoint = `${API_BASE}/${user_id}`;

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - user is not found`, async () => {
        // Setup:
        jest.spyOn(User, 'findByPk').mockResolvedValue(null);

        // Given:
        let user_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
        let values = { name: 'user a' };
        let endpoint = `${API_BASE}/${user_id}`;

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - user was trying to be found`, async () => {
        // Setup:
        jest.spyOn(User, 'findByPk').mockRejectedValue(ERROR_MOCK);

        // Given:
        let user_id = setup.instance.users[0].id;
        let values = { name: 'user a' };
        let endpoint = `${API_BASE}/${user_id}`;

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - user was trying to be updated`, async () => {
        // Setup:
        jest.spyOn(User, 'findByPk').mockResolvedValue({
          update: async (payload, options) => {
            throw ERROR_MOCK;
          }
        });

        // Given:
        let user_id = setup.instance.users[0].id;
        let values = { name: 'user a' };
        let endpoint = `${API_BASE}/${user_id}`;

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe("delete user:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - user is deleted without options`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(User, 'findByPk').mockResolvedValue({
            destroy: async (options) => {
              let user = setup.instance.users[0];
              user.deleted_at = new Date().toISOString();
              return user;
            }
          });
        }

        // Given:
        let user_id = setup.instance.users[0].id;
        let endpoint = `${API_BASE}/${user_id}`;
        let options = {}

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - user is deleted with the force option as true`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(User, 'findByPk').mockResolvedValue({
            destroy: async (options) => {
              let user = setup.instance.users[0];
              user.deleted_at = new Date().toISOString();
              return user;
            }
          });
        }

        // Given:
        let user_id = setup.instance.users[0].id;
        let endpoint = `${API_BASE}/${user_id}`;
        let options = { force: true }

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - user is deleted with the force option as false`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(User, 'findByPk').mockResolvedValue({
            destroy: async (options) => {
              let user = setup.instance.users[0];
              user.deleted_at = new Date().toISOString();
              return user;
            }
          });
        }

        // Given:
        let user_id = setup.instance.users[0].id;
        let endpoint = `${API_BASE}/${user_id}`;
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
      it(`${uuid()} - user id param is malformed`, async () => {
        // Given:
        let user_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let endpoint = `${API_BASE}/${user_id}`;
        let options = {}

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - user is not found`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(User, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let user_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
        let endpoint = `${API_BASE}/${user_id}`;
        let options = {}

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - user was trying to be found`, async () => {
        // Setup:
        jest.spyOn(User, 'findByPk').mockRejectedValue(ERROR_MOCK);

        // Given:
        let user_id = setup.instance.users[0].id;
        let endpoint = `${API_BASE}/${user_id}`;
        let options = {}

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - user was trying to be deleted`, async () => {
        // Setup:
        jest.spyOn(User, 'findByPk').mockResolvedValue({
          destroy: async (options) => {
            throw ERROR_MOCK;
          }
        });

        // Given:
        let user_id = setup.instance.users[0].id;
        let endpoint = `${API_BASE}/${user_id}`;
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

  describe('get roles', () => {
    describe('should return data when:', () => {
      it(`${uuid()} - query is: empty`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(User, 'findByPk').mockResolvedValue({
            getRoles: async payload => setup.instance.roles
          });
        }

        // Given:
        let user_id = setup.instance.users[0].id;
        let endpoint = `${API_BASE}/${user_id}/roles`;
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
          jest.spyOn(User, 'findByPk').mockResolvedValue({
            getRoles: async payload => setup.instance.roles
          });
        }

        // Given:
        let user_id = setup.instance.users[0].id;
        let endpoint = `${API_BASE}/${user_id}/roles`;
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
          jest.spyOn(User, 'findByPk').mockResolvedValue({
            getRoles: async payload => setup.instance.roles
          });
        }

        // Given:
        let user_id = setup.instance.users[0].id;
        let endpoint = `${API_BASE}/${user_id}/roles`;
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
      it(`${uuid()} - user param id is malformed`, async () => {
        // Given:
        let user_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let endpoint = `${API_BASE}/${user_id}/roles`;
        let options = {};

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - user is not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(User, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let user_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
        let endpoint = `${API_BASE}/${user_id}/roles`;
        let options = {};

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - user was trying to be found`, async () => {
        // Mock:
        jest.spyOn(User, 'findByPk').mockRejectedValue(new Error('error mocked.'));

        // Given:
        let user_id = setup.instance.users[0].id;
        let endpoint = `${API_BASE}/${user_id}/roles`;
        let options = {};

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - roles were trying to be found`, async () => {
        // Setup:
        jest.spyOn(User, 'findByPk').mockResolvedValue({
          getRoles: async (options) => {
            throw new Error('error mocked.');
          }
        });

        // Given:
        let user_id = setup.instance.users[0].id;
        let endpoint = `${API_BASE}/${user_id}/roles`;
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

  describe('set roles', () => {
    describe('should return data when:', () => {
      it(`${uuid()} - roles are set`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(User, 'findByPk').mockResolvedValue({
            addRoles: async payload => []
          });
        }

        // Given:
        let user_id = setup.instance.users[0].id;
        let roles = setup.instance.roles.map(role => role.id);
        let endpoint = `${API_BASE}/${user_id}/roles`;

        // When:
        let res = await request("post", endpoint).send({ roles });

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBe(null);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - user param id is malformed`, async () => {
        // Given:
        let user_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let roles = setup.instance.roles.map(role => role.id);
        let endpoint = `${API_BASE}/${user_id}/roles`;

        // When:
        let res = await request("post", endpoint).send({ roles });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - roles id are malformed`, async () => {
        // Given:
        let user_id = setup.instance.users[0].id;
        let roles = [
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s'
        ];
        let endpoint = `${API_BASE}/${user_id}/roles`;

        // When:
        let res = await request("post", endpoint).send({ roles });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - user is not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(User, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let user_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
        let roles = setup.instance.roles.map(role => role.id);
        let endpoint = `${API_BASE}/${user_id}/roles`;

        // When:
        let res = await request("post", endpoint).send({ roles });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - user was trying to be found`, async () => {
        // Mock:
        jest.spyOn(User, 'findByPk').mockRejectedValue(new Error('error mocked.'));

        // Given:
        let user_id = setup.instance.users[0].id;
        let roles = setup.instance.roles.map(role => role.id);
        let endpoint = `${API_BASE}/${user_id}/roles`;

        // When:
        let res = await request("post", endpoint).send({ roles });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - roles were trying to be set`, async () => {
        // Setup:
        jest.spyOn(User, 'findByPk').mockResolvedValue({
          addRoles: async (options) => {
            throw new Error('error mocked.');
          }
        });

        // Given:
        let user_id = setup.instance.users[0].id;
        let roles = setup.instance.roles.map(role => role.id);
        let endpoint = `${API_BASE}/${user_id}/roles`;

        // When:
        let res = await request("post", endpoint).send({ roles });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe('get role', () => {
    describe('should return data when:', () => {
      it(`${uuid()} - role is found`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(User, 'findByPk').mockResolvedValue({
            getRoles: async (options) => setup.instance.roles[0]
          });
        }

        // Given:
        let user_id = setup.instance.users[0].id;
        let role_id = setup.instance.roles[0].id;
        let endpoint = `${API_BASE}/${user_id}/roles/${role_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBe(null);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - user param id is malformed`, async () => {
        // Given:
        let user_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let role_id = setup.instance.roles[0].id;
        let endpoint = `${API_BASE}/${user_id}/roles/${role_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - role param id is malformed`, async () => {
        // Given:
        let user_id = setup.instance.users[0].id;
        let role_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let endpoint = `${API_BASE}/${user_id}/roles/${role_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - user is not found`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(User, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let user_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
        let role_id = setup.instance.roles[0].id;
        let endpoint = `${API_BASE}/${user_id}/roles/${role_id}`;

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
          jest.spyOn(User, 'findByPk').mockResolvedValue({
            getRoles: async (options) => null
          });
        }

        // Given:
        let user_id = setup.instance.users[0].id;
        let role_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
        let endpoint = `${API_BASE}/${user_id}/roles/${role_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - user was trying to be found`, async () => {
        // Setup:
        jest.spyOn(User, 'findByPk').mockRejectedValue(new Error('error mocked.'));

        // Given:
        let user_id = setup.instance.users[0].id;
        let role_id = setup.instance.roles[0].id;
        let endpoint = `${API_BASE}/${user_id}/roles/${role_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - role was trying to be found`, async () => {
        // Setup:
        jest.spyOn(User, 'findByPk').mockResolvedValue({
          getRoles: async (options) => {
            throw new Error('error mocked.');
          }
        });

        // Given:
        let user_id = setup.instance.users[0].id;
        let role_id = setup.instance.roles[0].id;
        let endpoint = `${API_BASE}/${user_id}/roles/${role_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe('update role', () => {
    describe('should return data when:', () => {
      it(`${uuid()} - role is found and values are valid`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(User, 'findByPk').mockResolvedValue({
            getRoles: async (options) => ({
              UserRoles: {
                update: async (values, options) => {
                  return setup.instance.roles[0];
                }
              }
            }),
          });
        }

        // Given:
        let user_id = setup.instance.users[0].id;
        let role_id = setup.instance.roles[0].id;
        let endpoint = `${API_BASE}/${user_id}/roles/${role_id}`;
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
      it(`${uuid()} - user param id is malformed`, async () => {
        // Given:
        let user_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let role_id = setup.instance.roles[0].id;
        let endpoint = `${API_BASE}/${user_id}/roles/${role_id}`;
        let values = { extra: { units: 20 } };

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - role param id is malformed`, async () => {
        // Given:
        let user_id = setup.instance.users[0].id;
        let role_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let endpoint = `${API_BASE}/${user_id}/roles/${role_id}`;
        let values = { extra: { units: 20 } };

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - user is not found`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(User, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let user_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
        let role_id = setup.instance.roles[0].id;
        let endpoint = `${API_BASE}/${user_id}/roles/${role_id}`;
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
          jest.spyOn(User, 'findByPk').mockResolvedValue({
            getRoles: async (options) => null
          });
        }

        // Given:
        let user_id = setup.instance.users[0].id;
        let role_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
        let endpoint = `${API_BASE}/${user_id}/roles/${role_id}`;
        let values = { extra: { units: 20 } };

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - user was trying to be found`, async () => {
        // Setup:
        jest.spyOn(User, 'findByPk').mockRejectedValue(new Error('error mocked.'));

        // Given:
        let user_id = setup.instance.users[0].id;
        let role_id = setup.instance.roles[0].id;
        let endpoint = `${API_BASE}/${user_id}/roles/${role_id}`;
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
        jest.spyOn(User, 'findByPk').mockResolvedValue({
          getRoles: async (options) => {
            throw new Error('error mocked.');
          }
        });

        // Given:
        let user_id = setup.instance.users[0].id;
        let role_id = setup.instance.roles[0].id;
        let endpoint = `${API_BASE}/${user_id}/roles/${role_id}`;
        let values = { extra: { units: 20 } };

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - role was trying to be updated`, async () => {
        // Setup:
        jest.spyOn(User, 'findByPk').mockResolvedValue({
          getRoles: async (options) => ({
            UserRoles: {
              update: async (uuid, options) => {
                throw new Error('error mocked.');
              }
            }
          }),
        });

        // Given:
        let user_id = setup.instance.users[0].id;
        let role_id = setup.instance.roles[0].id;
        let endpoint = `${API_BASE}/${user_id}/roles/${role_id}`;
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

  describe('remove role', () => {
    describe('should return data when:', () => {
      it(`${uuid()} - role is found and values are valid`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(User, 'findByPk').mockResolvedValue({
            getRoles: async (payload, options) => ({}),
            removeRole: async (payload, options) => setup.instance.roles[0]
          });
        }

        // Given:
        let user_id = setup.instance.users[0].id;
        let role_id = setup.instance.roles[0].id;
        let endpoint = `${API_BASE}/${user_id}/roles/${role_id}`;
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
      it(`${uuid()} - user param id is malformed`, async () => {
        // Given:
        let user_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let role_id = setup.instance.roles[0].id;
        let endpoint = `${API_BASE}/${user_id}/roles/${role_id}`;
        let options = {};

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - role param id is malformed`, async () => {
        // Given:
        let user_id = setup.instance.users[0].id;
        let role_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let endpoint = `${API_BASE}/${user_id}/roles/${role_id}`;
        let options = {};

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - user is not found`, async () => {
        // Setup:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(User, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let user_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
        let role_id = setup.instance.roles[0].id;
        let endpoint = `${API_BASE}/${user_id}/roles/${role_id}`;
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
          jest.spyOn(User, 'findByPk').mockResolvedValue({
            getRoles: async (options) => null
          });
        }

        // Given:
        let user_id = setup.instance.users[0].id;
        let role_id = 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d';
        let endpoint = `${API_BASE}/${user_id}/roles/${role_id}`;
        let options = {};

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - user was trying to be found`, async () => {
        // Setup:
        jest.spyOn(User, 'findByPk').mockRejectedValue(new Error('error mocked.'));

        // Given:
        let user_id = setup.instance.users[0].id;
        let role_id = setup.instance.roles[0].id;
        let endpoint = `${API_BASE}/${user_id}/roles/${role_id}`;
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
        jest.spyOn(User, 'findByPk').mockResolvedValue({
          getRoles: async (options) => {
            throw new Error('error mocked.');
          }
        });

        // Given:
        let user_id = setup.instance.users[0].id;
        let role_id = setup.instance.roles[0].id;
        let endpoint = `${API_BASE}/${user_id}/roles/${role_id}`;
        let options = {};

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - role was trying to be removed`, async () => {
        // Setup:
        jest.spyOn(User, 'findByPk').mockResolvedValue({
          getRoles: async (options) => ({}),
          removeRole: async (uuid, options) => {
            throw new Error('error mocked.');
          }
        });

        // Given:
        let user_id = setup.instance.users[0].id;
        let role_id = setup.instance.roles[0].id;
        let endpoint = `${API_BASE}/${user_id}/roles/${role_id}`;
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
