import setup_factory from './index';
import db from 'src/db/models';
import { request } from 'test/utils';
import uuid from 'uuid/v4';

const IS_INTEGRATION_MOCK = JSON.parse(process.env.MOCK);
const ERROR_MOCK = new Error('error mocked.');
const API_BASE = '/api/v1/departments';
const setup = setup_factory(db, IS_INTEGRATION_MOCK);
const { Department } = db.sequelize.models;

describe("Department Service:", () => {
  beforeAll(setup.before_all);
  beforeEach(setup.before_each);

  // --------------------------------------------------------------------------

  describe("get departments:", () => {
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
      it(`${uuid()} - query is: { search: { name: { like: '%vvvvv%' } } }`, async () => {
        // Given:
        let querystring = { search: { name: { like: '%vvvvv%' } } };

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
      it(`${uuid()} - action throw error`, async () => {
        // Mock:
        jest.spyOn(Department, 'findAll').mockRejectedValue(ERROR_MOCK);

        // Given:
        let querystring = { search: { name: 'bbbbb' } };

        // When:
        let res = await request("get", API_BASE).query(querystring);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe("create departments:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - values are valid`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Department, 'create').mockResolvedValue(setup.instance.departments[0]);
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
          jest.spyOn(Department, 'create').mockResolvedValue(Department.build({
            ...setup.instance.departments[0].dataValues,
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
        jest.spyOn(Department, 'create').mockRejectedValue(ERROR_MOCK);

        // Given:
        let values = { name: 'Department A' };

        // When:
        let res = await request("post", API_BASE).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe("get Department:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - Department is found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Department, 'findByPk').mockResolvedValue(setup.instance.departments[0]);
        }

        // Given:
        let department_id = setup.instance.departments[0].id;

        // When:
        let res = await request("get", `${API_BASE}/${department_id}`);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - Department id param is malformed`, async () => {
        // Given:
        let department_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111dd';

        // When:
        let res = await request("get", `${API_BASE}/${department_id}`);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - Department is not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Department, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let department_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';

        // When:
        let res = await request("get", `${API_BASE}/${department_id}`);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe("update Department:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - values are valid`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Department, 'findByPk').mockResolvedValue({
            update: async (payload, options) => Department.build({
              ...setup.instance.departments[0].dataValues,
              ...payload
            })
          });
        }

        // Given:
        let department_id = setup.instance.departments[0].id;
        let values = { name: 'Department A' };
        let endpoint = `${API_BASE}/${department_id}`;

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
        let department_id = setup.instance.departments[0].id;
        let values = null;
        let endpoint = `${API_BASE}/${department_id}`;

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - Department is not found`, async () => {
        // Mock:
        jest.spyOn(Department, 'findByPk').mockResolvedValue(null);

        // Given:
        let department_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
        let values = { name: 'Department A' };
        let endpoint = `${API_BASE}/${department_id}`;

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - Department was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Department, 'findByPk').mockRejectedValue(ERROR_MOCK);

        // Given:
        let department_id = setup.instance.departments[0].id;
        let values = { name: 'Department A' };
        let endpoint = `${API_BASE}/${department_id}`;

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - Department was trying to be updated`, async () => {
        // Mock:
        jest.spyOn(Department, 'findByPk').mockResolvedValue({
          update: async (payload, options) => {
            throw ERROR_MOCK;
          }
        });

        // Given:
        let department_id = setup.instance.departments[0].id;
        let values = { name: 'Department A' };
        let endpoint = `${API_BASE}/${department_id}`;

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe("delete Department:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - Department is deleted without options`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Department, 'findByPk').mockResolvedValue({
            destroy: async (options) => {
              let Department = setup.instance.departments[0];
              Department.deleted_at = new Date().toISOString();
              return Department;
            }
          });
        }

        // Given:
        let department_id = setup.instance.departments[0].id;
        let endpoint = `${API_BASE}/${department_id}`;
        let options = {}

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - Department is deleted with the force option as true`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Department, 'findByPk').mockResolvedValue({
            destroy: async (options) => {
              let Department = setup.instance.departments[0];
              Department.deleted_at = new Date().toISOString();
              return Department;
            }
          });
        }

        // Given:
        let department_id = setup.instance.departments[0].id;
        let endpoint = `${API_BASE}/${department_id}`;
        let options = { force: true }

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - Department is deleted with the force option as false`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Department, 'findByPk').mockResolvedValue({
            destroy: async (options) => {
              let Department = setup.instance.departments[0];
              Department.deleted_at = new Date().toISOString();
              return Department;
            }
          });
        }

        // Given:
        let department_id = setup.instance.departments[0].id;
        let endpoint = `${API_BASE}/${department_id}`;
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
      it(`${uuid()} - Department id param is malformed`, async () => {
        // Given:
        let department_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let endpoint = `${API_BASE}/${department_id}`;
        let options = {}

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - Department is not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Department, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let department_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
        let endpoint = `${API_BASE}/${department_id}`;
        let options = {}

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - Department was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Department, 'findByPk').mockRejectedValue(ERROR_MOCK);

        // Given:
        let department_id = setup.instance.departments[0].id;
        let endpoint = `${API_BASE}/${department_id}`;
        let options = {}

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - Department was trying to be deleted`, async () => {
        // Mock:
        jest.spyOn(Department, 'findByPk').mockResolvedValue({
          destroy: async (options) => {
            throw ERROR_MOCK;
          }
        });

        // Given:
        let department_id = setup.instance.departments[0].id;
        let endpoint = `${API_BASE}/${department_id}`;
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

  describe("get employees:", () => {
    describe("should return data when:", () => {
      it(`${uuid()} - query is: {}`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Department, 'findByPk').mockResolvedValue({
            getEmployees: async (options) => setup.instance.employees
          });
        }

        // Given:
        let department_id = setup.instance.departments[0].id;
        let endpoint = `${API_BASE}/${department_id}/employees`;
        let options = {}

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - query is: { search: {} }`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Department, 'findByPk').mockResolvedValue({
            getEmployees: async (options) => setup.instance.employees
          });
        }

        // Given:
        let department_id = setup.instance.departments[0].id;
        let endpoint = `${API_BASE}/${department_id}/employees`;
        let options = { search: {} }

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - query is: { search: undefined }`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Department, 'findByPk').mockResolvedValue({
            getEmployees: async (options) => setup.instance.employees
          });
        }

        // Given:
        let department_id = setup.instance.departments[0].id;
        let endpoint = `${API_BASE}/${department_id}/employees`;
        let options = { search: undefined }

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - query is: { search: { firstname: 'ccccc' } }`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Department, 'findByPk').mockResolvedValue({
            getEmployees: async (options) => setup.instance.employees
          });
        }

        // Given:
        let department_id = setup.instance.departments[0].id;
        let endpoint = `${API_BASE}/${department_id}/employees`;
        let options = { search: { firstname: 'ccccc' } }

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - query is: { search: { firstname: { like: '%vv%' } } }`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Department, 'findByPk').mockResolvedValue({
            getEmployees: async (options) => setup.instance.employees
          });
        }

        // Given:
        let department_id = setup.instance.departments[0].id;
        let endpoint = `${API_BASE}/${department_id}/employees`;
        let options = { search: { firstname: { like: '%vv%' } } }

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
    });
    describe("should return error when:", () => {
      it(`${uuid()} - department id param is malformed`, async () => {
        // Given:
        let department_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let endpoint = `${API_BASE}/${department_id}/employees`;
        let options = { search: { firstname: 'demo' } };

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - department is not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Department, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let department_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
        let endpoint = `${API_BASE}/${department_id}/employees`;
        let options = { search: { firstname: 'demo' } };

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - department was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Department, 'findByPk').mockRejectedValue(ERROR_MOCK);

        // Given:
        let department_id = setup.instance.departments[0].id;
        let endpoint = `${API_BASE}/${department_id}/employees`;
        let options = { search: { firstname: 'demo' } };

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - employees were trying to be found`, async () => {
        // Mock:
        jest.spyOn(Department, 'findByPk').mockResolvedValue({
          getEmployees: async (options) => { throw ERROR_MOCK; }
        });

        // Given:
        let department_id = setup.instance.departments[0].id;
        let endpoint = `${API_BASE}/${department_id}/employees`;
        let options = { search: { firstname: 'demodd' } };

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe("set employees:", () => {
    describe("should return data when:", () => {
      it(`${uuid()} - employees are set to a department`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Department, 'findByPk').mockResolvedValue({
            addEmployees: async (payload, options) => payload
          });
        }

        // Given:
        let department_id = setup.instance.departments[0].id;
        let employees = setup.instance.employees.map(e => e.id);
        let endpoint = `${API_BASE}/${department_id}/employees`;

        // When:
        let res = await request("post", endpoint).send({ employees });

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
    });
    describe("should return error when:", () => {
      it(`${uuid()} - department id param is malformed`, async () => {
        // Given:
        let department_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let employees = setup.instance.employees.map(e => e.id);
        let endpoint = `${API_BASE}/${department_id}/employees`;

        // When:
        let res = await request("post", endpoint).send({ employees });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - employees ids values are malformed`, async () => {
        // Given:
        let department_id = setup.instance.departments[0].id;
        let employees = [ '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s' ];
        let endpoint = `${API_BASE}/${department_id}/employees`;

        // When:
        let res = await request("post", endpoint).send({ employees });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - department is not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Department, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let department_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
        let employees = setup.instance.employees.map(e => e.id);
        let endpoint = `${API_BASE}/${department_id}/employees`;

        // When:
        let res = await request("post", endpoint).send({ employees });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - department was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Department, 'findByPk').mockRejectedValue(ERROR_MOCK);

        // Given:
        let department_id = setup.instance.departments[0].id;
        let employees = setup.instance.employees.map(e => e.id);
        let endpoint = `${API_BASE}/${department_id}/employees`;

        // When:
        let res = await request("post", endpoint).send({ employees });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - employees were trying to be set`, async () => {
        // Mock:
        jest.spyOn(Department, 'findByPk').mockResolvedValue({
          addEmployees: async (payload, options) => {
            throw ERROR_MOCK;
          }
        });

        // Given:
        let department_id = setup.instance.departments[0].id;
        let employees = setup.instance.employees.map(e => e.id);
        let endpoint = `${API_BASE}/${department_id}/employees`;

        // When:
        let res = await request("post", endpoint).send({ employees });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe("get employee:", () => {
    describe("should return data when:", () => {
      it(`${uuid()} - employee is found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Department, 'findByPk').mockResolvedValue({
            getEmployees: async payload => setup.instance.employees[0]
          });
        }

        // Given:
        let department_id = setup.instance.departments[0].id;
        let employee_id = setup.instance.employees[0].id;
        let endpoint = `${API_BASE}/${department_id}/employees/${employee_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
    });
    describe("should return error when:", () => {
      it(`${uuid()} - department id param is malformed`, async () => {
        // Given:
        let department_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll';
        let employee_id = setup.instance.employees[0].id;
        let endpoint = `${API_BASE}/${department_id}/employees/${employee_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - employee id param is malformed`, async () => {
        // Given:
        let department_id = setup.instance.departments[0].id;
        let employee_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll';
        let endpoint = `${API_BASE}/${department_id}/employees/${employee_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - department is not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Department, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let department_id = '5dc8dfea-34c1-4280-bb5e-d18af9296fc1';
        let employee_id = setup.instance.employees[0].id;
        let endpoint = `${API_BASE}/${department_id}/employees/${employee_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - employee is not found`, async () => {
        // Mock:
        jest.spyOn(Department, 'findByPk').mockResolvedValue({
          getEmployees: async payload => null
        });

        // Given:
        let department_id = setup.instance.departments[0].id;
        let employee_id = '5dc8dfea-34c1-4280-bb5e-d18af9296fc1';
        let endpoint = `${API_BASE}/${department_id}/employees/${employee_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - department was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Department, 'findByPk').mockRejectedValue(ERROR_MOCK);

        // Given:
        let department_id = setup.instance.departments[0].id;
        let employee_id = setup.instance.employees[0].id;
        let endpoint = `${API_BASE}/${department_id}/employees/${employee_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - employee was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Department, 'findByPk').mockResolvedValue({
          getEmployees: async payload => {
            throw ERROR_MOCK;
          }
        });

        // Given:
        let department_id = setup.instance.departments[0].id;
        let employee_id = setup.instance.employees[0].id;
        let endpoint = `${API_BASE}/${department_id}/employees/${employee_id}`;

        // When:
        let res = await request("get", endpoint);

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
