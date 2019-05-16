import setup_factory from './index';
import db from 'src/db/models';
import { request } from 'test/utils';
import uuid from 'uuid/v4';

const IS_INTEGRATION_MOCK = JSON.parse(process.env.MOCK);
const ERROR_MOCK = new Error('error mocked.');
const API_BASE = '/api/v1/employees';
const setup = setup_factory(db, IS_INTEGRATION_MOCK);
const { Employee } = db.sequelize.models;

describe("Employee Service:", () => {
  beforeAll(setup.before_all);
  beforeEach(setup.before_each);

  // --------------------------------------------------------------------------

  describe("get employees:", () => {
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
      it(`${uuid()} - query is: { search: { firstname: 'ccccc' } }`, async () => {
        // Given:
        let querystring = { search: { firstname: 'ccccc' } };

        // When:
        let res = await request("get", API_BASE).query(querystring);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - query is: { search: { firstname: { like: '%vvvvv%' } } }`, async () => {
        // Given:
        let querystring = { search: { firstname: { like: '%vvvvv%' } } };

        // When:
        let res = await request("get", API_BASE).query(querystring);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - include user association`, async () => {
        if (IS_INTEGRATION_MOCK) {
          const result = [];

          for (const employee of setup.instance.employees) {
            const data = employee.dataValues;
            if (employee.getUser) {
              const user = await employee.getUser();
              if (user) {
                data.user = user.dataValues;
              }
            }
            result.push(data);
          }

          jest.spyOn(Employee, 'findAll').mockResolvedValue(result);
        }

        // Given:
        let querystring = { include: 'user' };

        // When:
        let res = await request("get", API_BASE).query(querystring);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined().toBeArray();
        expect(res.body.data[0]).toBeObject().toContainKey('user');
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
        jest.spyOn(Employee, 'findAll').mockRejectedValue(ERROR_MOCK);

        // Given:
        let querystring = { search: { name: 'bbbbb' } };

        // When:
        let res = await request("get", API_BASE).query(querystring);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - include a non existent association`, async () => {
        // Given:
        let querystring = { include: 'ddddd' };

        // When:
        let res = await request("get", API_BASE).query(querystring);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe("create employee:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - values are valid`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Employee, 'create').mockResolvedValue(setup.instance.employees[0]);
        }

        // Given:
        let values = {
          firstname: 'Norman',
          lastname: 'Carcamo',
          department_id:  setup.instance.departments[0].id
        };

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
          jest.spyOn(Employee, 'create').mockResolvedValue(Employee.build({
            ...setup.instance.employees[0].dataValues,
            created_by: setup.instance.users[0].id,
            updated_by: setup.instance.users[0].id,
          }));
        }

        // Given:
        let values = {
          department_id:  setup.instance.departments[0].id,
          firstname: 'Norman',
          lastname: 'Carcamo',
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
      it(`${uuid()} - values are null`, async () => {
        // Given:
        let values = null;

        // When:
        let res = await request("post", API_BASE).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - value "lastname" is not valid`, async () => {
        // Given:
        let values = {
          firstname: 'Jonh',
          lastname: '',
          department_id:  setup.instance.departments[0].id
        };

        // When:
        let res = await request("post", API_BASE).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - action throw error`, async () => {
        // Mock:
        jest.spyOn(Employee, 'create').mockRejectedValue(ERROR_MOCK);

        // Given:
        let values = {
          firstname: 'Jonh',
          lastname: 'Doe',
          department_id:  setup.instance.departments[0].id
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

  describe("get employee:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - employee is found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Employee, 'findByPk').mockResolvedValue(setup.instance.employees[0]);
        }

        // Given:
        let employee_id = setup.instance.employees[0].id;
        let options = {};

        // When:
        let res = await request("get", `${API_BASE}/${employee_id}`).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - employee is found and include user`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          let employee = setup.instance.employees[0].dataValues;
          let user = await setup.instance.employees[0].getUser();
          employee.user = user.dataValues;
          jest.spyOn(Employee, 'findByPk').mockResolvedValue(employee);
        }

        // Given:
        let employee_id = setup.instance.employees[0].id;
        let options = { include: 'user' };

        // When:
        let res = await request("get", `${API_BASE}/${employee_id}`).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.data.user).toBeDefined().toBeObject();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - employee is found and include user + quotes`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          let employee = setup.instance.employees[0].dataValues;
          let user = await setup.instance.employees[0].getUser();
          let quotes = await setup.instance.employees[0].getQuotes();
          employee.user = user;
          employee.quotes = quotes;
          jest.spyOn(Employee, 'findByPk').mockResolvedValue(employee);
        }

        // Given:
        let employee_id = setup.instance.employees[0].id;
        let options = { include: 'user,quotes' };

        // When:
        let res = await request("get", `${API_BASE}/${employee_id}`).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.data.user).toBeDefined();
        expect(res.body.data.quotes).toBeDefined().toBeArray();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - employee id param is malformed`, async () => {
        // Given:
        let employee_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111dd';

        // When:
        let res = await request("get", `${API_BASE}/${employee_id}`);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - employee is not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Employee, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let employee_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';

        // When:
        let res = await request("get", `${API_BASE}/${employee_id}`);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - employee was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Employee, 'findByPk').mockRejectedValue(ERROR_MOCK);

        // Given:
        let employee_id = setup.instance.employees[0].id;
        let endpoint = `${API_BASE}/${employee_id}`;
        let options = {};

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - include a non existent association`, async () => {
        // Given:
        let employee_id = setup.instance.employees[0].id;
        let endpoint = `${API_BASE}/${employee_id}`;
        let options = { include: 'demo' };

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe("update employee:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - values are valid`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Employee, 'findByPk').mockResolvedValue({
            update: async (values, options) => Employee.build({
              ...setup.instance.employees[0].dataValues,
              ...values,
              updated_at: new Date().toISOString()
            })
          });
        }

        // Given:
        let employee_id = setup.instance.employees[0].id;
        let values = { firstname: 'doe' };
        let endpoint = `${API_BASE}/${employee_id}`;

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
    });
    describe('should return error when:', () => {
      it(`${uuid()} - employee id param is malformed`, async () => {
        // Given:
        let employee_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let values = null;
        let endpoint = `${API_BASE}/${employee_id}`;

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - employee is not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Employee, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let employee_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
        let values = { firstname: 'Employee A' };
        let endpoint = `${API_BASE}/${employee_id}`;

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - employee was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Employee, 'findByPk').mockRejectedValue(ERROR_MOCK);

        // Given:
        let employee_id = setup.instance.employees[0].id;
        let values = { firstname: 'Employee A' };
        let endpoint = `${API_BASE}/${employee_id}`;

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - employee was trying to be updated`, async () => {
        // Mock:
        jest.spyOn(Employee, 'findByPk').mockResolvedValue({
          update: async (payload, options) => {
            throw ERROR_MOCK;
          }
        });

        // Given:
        let employee_id = setup.instance.employees[0].id;
        let values = { firstname: 'Employee A' };
        let endpoint = `${API_BASE}/${employee_id}`;

        // When:
        let res = await request("put", endpoint).send({ values });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe("delete employee:", () => {
    describe('should return data when:', () => {
      it(`${uuid()} - employee is deleted without options`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Employee, 'findByPk').mockResolvedValue({
            destroy: async (options) => {
              let employee = setup.instance.employees[0];
              employee.deleted_at = new Date().toISOString();
              return employee;
            }
          });
        }

        // Given:
        let employee_id = setup.instance.employees[0].id;
        let endpoint = `${API_BASE}/${employee_id}`;
        let options = {}

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - employee is deleted with the force option as true`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Employee, 'findByPk').mockResolvedValue({
            destroy: async (options) => {
              let employee = setup.instance.employees[0];
              employee.deleted_at = new Date().toISOString();
              return employee;
            }
          });
        }

        // Given:
        let employee_id = setup.instance.employees[0].id;
        let endpoint = `${API_BASE}/${employee_id}`;
        let options = { force: true }

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - employee is deleted with the force option as false`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Employee, 'findByPk').mockResolvedValue({
            destroy: async (options) => {
              let employee = setup.instance.employees[0];
              employee.deleted_at = new Date().toISOString();
              return employee;
            }
          });
        }

        // Given:
        let employee_id = setup.instance.employees[0].id;
        let endpoint = `${API_BASE}/${employee_id}`;
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
      it(`${uuid()} - employee id param is malformed`, async () => {
        // Given:
        let employee_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let endpoint = `${API_BASE}/${employee_id}`;
        let options = {}

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - employee is not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Employee, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let employee_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
        let endpoint = `${API_BASE}/${employee_id}`;
        let options = {}

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - employee was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Employee, 'findByPk').mockRejectedValue(ERROR_MOCK);

        // Given:
        let employee_id = setup.instance.employees[0].id;
        let endpoint = `${API_BASE}/${employee_id}`;
        let options = {}

        // When:
        let res = await request("delete", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - employee was trying to be deleted`, async () => {
        // Mock:
        jest.spyOn(Employee, 'findByPk').mockResolvedValue({
          destroy: async (options) => {
            throw ERROR_MOCK;
          }
        });

        // Given:
        let employee_id = setup.instance.employees[0].id;
        let endpoint = `${API_BASE}/${employee_id}`;
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

  describe("get user:", () => {
    describe("should return data when:", () => {
      it(`${uuid()} - user is found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Employee, 'findByPk').mockResolvedValue({
            getUser: async payload => setup.instance.users[0]
          });
        }

        // Given:
        let employee_id = setup.instance.employees[0].id;
        let endpoint = `${API_BASE}/${employee_id}/user`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
    });
    describe("should return error when:", () => {
      it(`${uuid()} - employee id param is malformed`, async () => {
        // Given:
        let employee_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll';
        let endpoint = `${API_BASE}/${employee_id}/user`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - employee is not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Employee, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let employee_id = '19734cd8-cbb9-4017-a6df-33a97872959a';
        let endpoint = `${API_BASE}/${employee_id}/user`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - employee is trying to be found`, async () => {
        // Mock:
        jest.spyOn(Employee, 'findByPk').mockRejectedValue(new Error('error mocked.'));

        // Given:
        let employee_id = setup.instance.employees[0].id;
        let endpoint = `${API_BASE}/${employee_id}/user`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - user is trying to be found`, async () => {
        // Mock:
        jest.spyOn(Employee, 'findByPk').mockResolvedValue({
          getUser: async payload => {
            throw new Error('error mocked.');
          }
        });

        // Given:
        let employee_id = setup.instance.employees[0].id;
        let endpoint = `${API_BASE}/${employee_id}/user`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe("set user:", () => {
    describe("should return data when:", () => {
      it(`${uuid()} - user is set`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Employee, 'findByPk').mockResolvedValue({
            setUser: async (payload, options) => setup.instance.users[0]
          });
        }

        // Given:
        let employee_id = setup.instance.employees[0].id;
        let user = setup.instance.users[0].id;
        let endpoint = `${API_BASE}/${employee_id}/user`;

        // When:
        let res = await request("post", endpoint).send({ user });

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
    });
    describe("should return error when:", () => {
      it(`${uuid()} - employee id param is malformed`, async () => {
        // Given:
        let employee_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll';
        let user = setup.instance.users[0].id;
        let endpoint = `${API_BASE}/${employee_id}/user`;

        // When:
        let res = await request("post", endpoint).send({ user });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - employee is not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Employee, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let employee_id = '19734cd8-cbb9-4017-a6df-33a97872959a';
        let user = setup.instance.users[0].id;
        let endpoint = `${API_BASE}/${employee_id}/user`;

        // When:
        let res = await request("post", endpoint).send({ user });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - employee is trying to be found`, async () => {
        // Mock:
        jest.spyOn(Employee, 'findByPk').mockRejectedValue(new Error('error mocked.'));

        // Given:
        let employee_id = setup.instance.employees[0].id;
        let user = setup.instance.users[0].id;
        let endpoint = `${API_BASE}/${employee_id}/user`;

        // When:
        let res = await request("post", endpoint).send({ user });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - user is trying to be found`, async () => {
        // Mock:
        jest.spyOn(Employee, 'findByPk').mockResolvedValue({
          getUser: async payload => {
            throw new Error('error mocked.');
          }
        });

        // Given:
        let employee_id = setup.instance.employees[0].id;
        let user = setup.instance.users[0].id;
        let endpoint = `${API_BASE}/${employee_id}/user`;

        // When:
        let res = await request("post", endpoint).send({ user });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - user is trying to be set`, async () => {
        // Mock:
        jest.spyOn(Employee, 'findByPk').mockResolvedValue({
          setUser: async payload => {
            throw new Error('error mocked.');
          }
        });

        // Given:
        let employee_id = setup.instance.employees[0].id;
        let user = setup.instance.users[0].id;
        let endpoint = `${API_BASE}/${employee_id}/user`;

        // When:
        let res = await request("post", endpoint).send({ user });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe("remove user:", () => {
    describe("should return data when:", () => {
      it(`${uuid()} - user is found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Employee, 'findByPk').mockResolvedValue({
            setUser: async payload => setup.instance.users[0]
          });
        }

        // Given:
        let employee_id = setup.instance.employees[0].id;
        let endpoint = `${API_BASE}/${employee_id}/user`;

        // When:
        let res = await request("delete", endpoint);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
    });
    describe("should return error when:", () => {
      it(`${uuid()} - employee id param is malformed`, async () => {
        // Given:
        let employee_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll';
        let endpoint = `${API_BASE}/${employee_id}/user`;

        // When:
        let res = await request("delete", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - employee is not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Employee, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let employee_id = '19734cd8-cbb9-4017-a6df-33a97872959a';
        let endpoint = `${API_BASE}/${employee_id}/user`;

        // When:
        let res = await request("delete", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - employee is trying to be found`, async () => {
        // Mock:
        jest.spyOn(Employee, 'findByPk').mockRejectedValue(new Error('error mocked.'));

        // Given:
        let employee_id = setup.instance.employees[0].id;
        let endpoint = `${API_BASE}/${employee_id}/user`;

        // When:
        let res = await request("delete", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - user is trying to be removed`, async () => {
        // Mock:
        jest.spyOn(Employee, 'findByPk').mockResolvedValue({
          setUser: async payload => {
            throw new Error('error mocked.');
          }
        });

        // Given:
        let employee_id = setup.instance.employees[0].id;
        let endpoint = `${API_BASE}/${employee_id}/user`;

        // When:
        let res = await request("delete", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  // --------------------------------------------------------------------------

  describe("get quotes:", () => {
    describe("should return data when:", () => {
      it(`${uuid()} - query is: {}`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Employee, 'findByPk').mockResolvedValue({
            getQuotes: async (options) => setup.instance.quotes
          });
        }

        // Given:
        let employee_id = setup.instance.employees[0].id;
        let endpoint = `${API_BASE}/${employee_id}/quotes`;
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
          jest.spyOn(Employee, 'findByPk').mockResolvedValue({
            getQuotes: async (options) => setup.instance.quotes
          });
        }

        // Given:
        let employee_id = setup.instance.employees[0].id;
        let endpoint = `${API_BASE}/${employee_id}/quotes`;
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
          jest.spyOn(Employee, 'findByPk').mockResolvedValue({
            getQuotes: async (options) => setup.instance.quotes
          });
        }

        // Given:
        let employee_id = setup.instance.employees[0].id;
        let endpoint = `${API_BASE}/${employee_id}/quotes`;
        let options = { search: undefined }

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - query is: { search: { subject: 'ccccc' } }`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Employee, 'findByPk').mockResolvedValue({
            getQuotes: async (options) => setup.instance.quotes
          });
        }

        // Given:
        let employee_id = setup.instance.employees[0].id;
        let endpoint = `${API_BASE}/${employee_id}/quotes`;
        let options = { search: { subject: 'ccccc' } }

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - query is: { search: { subject: { like: '%vv%' } } }`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Employee, 'findByPk').mockResolvedValue({
            getQuotes: async (options) => setup.instance.quotes
          });
        }

        // Given:
        let employee_id = setup.instance.employees[0].id;
        let endpoint = `${API_BASE}/${employee_id}/quotes`;
        let options = { search: { subject: { like: '%vv%' } } }

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
    });
    describe("should return error when:", () => {
      it(`${uuid()} - employee id param is malformed`, async () => {
        // Given:
        let employee_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let endpoint = `${API_BASE}/${employee_id}/quotes`;
        let options = { search: { subject: 'demo' } };

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - employee is not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Employee, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let employee_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
        let endpoint = `${API_BASE}/${employee_id}/quotes`;
        let options = { search: { subject: 'demo' } };

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - employee was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Employee, 'findByPk').mockRejectedValue(ERROR_MOCK);

        // Given:
        let employee_id = setup.instance.employees[0].id;
        let endpoint = `${API_BASE}/${employee_id}/quotes`;
        let options = { search: { subject: 'demo' } };

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - quotes were trying to be found`, async () => {
        // Mock:
        jest.spyOn(Employee, 'findByPk').mockResolvedValue({
          getQuotes: async (options) => { throw ERROR_MOCK; }
        });

        // Given:
        let employee_id = setup.instance.employees[0].id;
        let endpoint = `${API_BASE}/${employee_id}/quotes`;
        let options = { search: { subject: 'demodd' } };

        // When:
        let res = await request("get", endpoint).query(options);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe("set quotes:", () => {
    describe("should return data when:", () => {
      it(`${uuid()} - quotes are set to a employee`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Employee, 'findByPk').mockResolvedValue({
            addQuotes: async (payload, options) => payload
          });
        }

        // Given:
        let employee_id = setup.instance.employees[0].id;
        let quotes = setup.instance.quotes.map(q => q.id);
        let endpoint = `${API_BASE}/${employee_id}/quotes`;

        // When:
        let res = await request("post", endpoint).send({ quotes });

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
    });
    describe("should return error when:", () => {
      it(`${uuid()} - employee id param is malformed`, async () => {
        // Given:
        let employee_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s';
        let quotes = setup.instance.quotes.map(e => e.id);
        let endpoint = `${API_BASE}/${employee_id}/quotes`;

        // When:
        let res = await request("post", endpoint).send({ quotes });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - quotes ids values are malformed`, async () => {
        // Given:
        let employee_id = setup.instance.employees[0].id;
        let quotes = [ '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s' ];
        let endpoint = `${API_BASE}/${employee_id}/quotes`;

        // When:
        let res = await request("post", endpoint).send({ quotes });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - employee is not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Employee, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let employee_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111';
        let quotes = setup.instance.quotes.map(e => e.id);
        let endpoint = `${API_BASE}/${employee_id}/quotes`;

        // When:
        let res = await request("post", endpoint).send({ quotes });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - employee was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Employee, 'findByPk').mockRejectedValue(ERROR_MOCK);

        // Given:
        let employee_id = setup.instance.employees[0].id;
        let quotes = setup.instance.quotes.map(e => e.id);
        let endpoint = `${API_BASE}/${employee_id}/quotes`;

        // When:
        let res = await request("post", endpoint).send({ quotes });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - quotes were trying to be set`, async () => {
        // Mock:
        jest.spyOn(Employee, 'findByPk').mockResolvedValue({
          addQuotes: async (payload, options) => {
            throw ERROR_MOCK;
          }
        });

        // Given:
        let employee_id = setup.instance.employees[0].id;
        let quotes = setup.instance.quotes.map(e => e.id);
        let endpoint = `${API_BASE}/${employee_id}/quotes`;

        // When:
        let res = await request("post", endpoint).send({ quotes });

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
    });
  });

  describe("get quote:", () => {
    describe("should return data when:", () => {
      it(`${uuid()} - quote is found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Employee, 'findByPk').mockResolvedValue({
            getQuotes: async payload => setup.instance.quotes[0]
          });
        }

        // Given:
        let employee_id = setup.instance.employees[0].id;
        let quote_id = setup.instance.quotes[0].id;
        let endpoint = `${API_BASE}/${employee_id}/quotes/${quote_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      });
    });
    describe("should return error when:", () => {
      it(`${uuid()} - employee id param is malformed`, async () => {
        // Given:
        let employee_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll';
        let quote_id = setup.instance.quotes[0].id;
        let endpoint = `${API_BASE}/${employee_id}/quotes/${quote_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - quote id param is malformed`, async () => {
        // Given:
        let employee_id = setup.instance.employees[0].id;
        let quote_id = '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll';
        let endpoint = `${API_BASE}/${employee_id}/quotes/${quote_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - employee is not found`, async () => {
        // Mock:
        if (IS_INTEGRATION_MOCK) {
          jest.spyOn(Employee, 'findByPk').mockResolvedValue(null);
        }

        // Given:
        let employee_id = '5dc8dfea-34c1-4280-bb5e-d18af9296fc1';
        let quote_id = setup.instance.quotes[0].id;
        let endpoint = `${API_BASE}/${employee_id}/quotes/${quote_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - quote is not found`, async () => {
        // Mock:
        jest.spyOn(Employee, 'findByPk').mockResolvedValue({
          getQuotes: async payload => null
        });

        // Given:
        let employee_id = setup.instance.employees[0].id;
        let quote_id = '5dc8dfea-34c1-4280-bb5e-d18af9296fc1';
        let endpoint = `${API_BASE}/${employee_id}/quotes/${quote_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - employee was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Employee, 'findByPk').mockRejectedValue(ERROR_MOCK);

        // Given:
        let employee_id = setup.instance.employees[0].id;
        let quote_id = setup.instance.quotes[0].id;
        let endpoint = `${API_BASE}/${employee_id}/quotes/${quote_id}`;

        // When:
        let res = await request("get", endpoint);

        // Then:
        expect(res.statusCode).toBeWithin(400, 522);
        expect(res.body.error).toBeDefined();
        expect(res.body.data).toBeOneOf([ undefined, null ]);
      });
      it(`${uuid()} - quote was trying to be found`, async () => {
        // Mock:
        jest.spyOn(Employee, 'findByPk').mockResolvedValue({
          getQuotes: async payload => {
            throw ERROR_MOCK;
          }
        });

        // Given:
        let employee_id = setup.instance.employees[0].id;
        let quote_id = setup.instance.quotes[0].id;
        let endpoint = `${API_BASE}/${employee_id}/quotes/${quote_id}`;

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
