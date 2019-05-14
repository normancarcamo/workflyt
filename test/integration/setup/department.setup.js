import uuid from 'uuid/v4';
import setup_factory from './index';
import db from 'src/db/models';

const is_mocked = JSON.parse(process.env.MOCK);
const setup = setup_factory(db, is_mocked, 'Department'), scenario = {};
const { Department } = db.sequelize.models;

scenario.get_departments = {
  pass: [
    {
      id: uuid(),
      description: 'query sent is: {}',
      input: async () => ({})
    },
    {
      id: uuid(),
      description: 'query sent is: { search: {} }',
      input: async () => ({ search: {} })
    },
    {
      id: uuid(),
      description: 'query sent is: undefined',
      input: async () => ({ search: undefined })
    },
    {
      id: uuid(),
      description: "query sent is: { search: { name: 'ccccc' } }",
      input: async () => ({ search: { name: 'ccccc' } })
    },
    {
      id: uuid(),
      description: "query sent is: { search: { name: { like: '%vvvvv%' } } }",
      input: async () => ({ search: { name: { like: '%vvvvv%' } } })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Query search validation fail',
      input: async () => ({ search: null })
    },
    {
      id: uuid(),
      description: 'Action throws error',
      input: async () => ({ search: { name: { eq: 'model' } } })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Action throws error') {
      return jest.spyOn(Department, 'findAll')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Department, 'findAll')
        .mockResolvedValue([]);
    }
  }
};

scenario.create_departments = {
  pass: [
    {
      id: uuid(),
      description: 'Valid values are sent as array',
      input: async () => ({ values: [ { name: 'sps' } ] })
    },
    {
      id: uuid(),
      description: 'Valid values are sent as object',
      input: async () => ({ values: { name: 'tgu' } })
    },
    {
      id: uuid(),
      description: `is created by a specific user`,
      input: async () => ({
        values: {
          name: 'demo',
          created_by: setup.instance.users[0].id,
          updated_by: setup.instance.users[0].id,
        }
      }),
      then: async (res) => {
        expect(res.statusCode).toEqual(201);
        expect(res.body.data).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
        expect(res.body.data.created_by).toEqual(setup.instance.users[0].id);
        expect(res.body.data.updated_by).toEqual(setup.instance.users[0].id);
      }
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Invalid values were sent as array',
      input: async () => ({ values: [ { name: '' } ] })
    },
    {
      id: uuid(),
      description: 'Invalid values were sent as object',
      input: async () => ({ values: { name: '' } })
    },
    {
      id: uuid(),
      description: 'Action throws error',
      input: async () => ({ values: { name: 'tgu' } })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Action throws error') {
      return jest.spyOn(Department, 'createMany')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Department, 'createMany')
        .mockImplementation(async (values, options) => {
        if (Array.isArray(values)) {
          return values.reduce((initial, values, index) => {
            initial.push(Department.build(values, options));
            return initial;
          }, []);
        } else {
          return Department.build(values, options);
        }
      });
    }
  }
};

scenario.get_department = {
  pass: [
    {
      id: uuid(),
      description: 'Department is found',
      input: async () => ({
        department_id: setup.instance.departments[0].id
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Department id param is malformed',
      input: async () => ({
        department_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        values: { name: 'Department A' }
      })
    },
    {
      id: uuid(),
      description: 'Department is not found',
      input: async () => ({
        department_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        values: { name: 'Department A' }
      })
    },
    {
      id: uuid(),
      description: 'Department was trying to be found',
      input: async () => ({
        department_id: setup.instance.departments[0].id,
        values: { name: 'Department A' }
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Department is not found' && is_mocked) {
      return jest.spyOn(Department, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Department was trying to be found') {
      return jest.spyOn(Department, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Department, 'findByPk')
        .mockResolvedValue(setup.instance.departments[0]);
    }
  }
};

scenario.update_department = {
  pass: [
    {
      id: uuid(),
      description: 'Department is updated',
      input: async () => ({
        department_id: setup.instance.departments[0].id,
        values: { name: 'Department B' }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Department id param is malformed',
      input: async () => ({
        department_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        values: { name: 'Department B' }
      })
    },
    {
      id: uuid(),
      description: 'Department is not found',
      input: async () => ({
        department_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        values: { name: 'Department B' }
      })
    },
    {
      id: uuid(),
      description: 'Department was trying to be found',
      input: async () => ({
        department_id: setup.instance.departments[0].id,
        values: { name: 'Department B' }
      })
    },
    {
      id: uuid(),
      description: 'Department was trying to be updated',
      input: async () => ({
        department_id: setup.instance.departments[0].id,
        values: { name: 'Department B' }
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Department is not found' && is_mocked) {
      return jest.spyOn(Department, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Department was trying to be found') {
      return jest.spyOn(Department, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Department was trying to be updated') {
      return jest.spyOn(Department, 'findByPk').mockResolvedValue({
        update: async (values, options) => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Department, 'findByPk').mockResolvedValue({
        update: async (values, options) => Department.build({
          ...setup.instance.departments[0].dataValues,
          ...values,
          updated_at: new Date().toISOString()
        }, options)
      });
    }
  }
};

scenario.delete_department = {
  pass: [
    {
      id: uuid(),
      description: 'Department is deleted without options',
      input: async () => ({
        department_id: setup.instance.departments[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Department is deleted with force option as false',
      input: async () => ({
        department_id: setup.instance.departments[0].id,
        query: { force: false }
      })
    },
    {
      id: uuid(),
      description: 'Department is deleted with force option as true',
      input: async () => ({
        department_id: setup.instance.departments[0].id,
        query: { force: true }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Department id param is malformed',
      input: async () => ({
        department_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Department is not found',
      input: async () => ({
        department_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Department was trying to be found',
      input: async () => ({
        department_id: setup.instance.departments[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Department was trying to be removed',
      input: async () => ({
        department_id: setup.instance.departments[0].id,
        query: {}
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Department is not found' && is_mocked) {
      return jest.spyOn(Department, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Department was trying to be found') {
      return jest.spyOn(Department, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Department was trying to be removed') {
      return jest.spyOn(Department, 'findByPk').mockResolvedValue({
        destroy: async payload => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Department, 'findByPk').mockResolvedValue({
        destroy: async payload => {
          if (payload.force) {
            return [];
          } else {
            const now = new Date().toISOString();
            setup.instance.departments[0].updated_at = now;
            setup.instance.departments[0].deleted_at = now;
            return setup.instance.departments[0];
          }
        }
      });
    }
  }
};

scenario.get_employees = {
  pass: [
    {
      id: uuid(),
      description: 'querys is: empty',
      input: async () => ({
        department_id: setup.instance.departments[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'query is: firstname=dknd',
      input: async () => ({
        department_id: setup.instance.departments[0].id,
        query: { search: { firstname: 'dknd' } }
      })
    },
    {
      id: uuid(),
      description: 'query is: firstname like %disk%',
      input: async () => ({
        department_id: setup.instance.departments[0].id,
        query: { search: { firstname: { like: '%disk%' } } }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Department id param is malformed',
      input: async () => ({
        department_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Department is not found',
      input: async () => ({
        department_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Department was trying to be found',
      input: async () => ({
        department_id: setup.instance.departments[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Employees were trying to be found',
      input: async () => ({
        department_id: setup.instance.departments[0].id,
        query: {}
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Department is not found' && is_mocked) {
      return jest.spyOn(Department, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Department was trying to be found') {
      return jest.spyOn(Department, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Employees were trying to be found') {
      return jest.spyOn(Department, 'findByPk').mockResolvedValue({
        getEmployees: async payload => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Department, 'findByPk').mockResolvedValue({
        getEmployees: async payload => setup.instance.employees
      });
    }
  }
};

scenario.set_employees = {
  pass: [
    {
      id: uuid(),
      description: 'Employees are set',
      input: async () => ({
        department_id: setup.instance.departments[0].id,
        employees: setup.instance.employees.map(employee => employee.id)
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Department id param is malformed',
      input: async () => ({
        department_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        employees: setup.instance.employees.map(employee => employee.id)
      })
    },
    {
      id: uuid(),
      description: 'Department is not found',
      input: async () => ({
        department_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        employees: setup.instance.employees.map(employee => employee.id)
      })
    },
    {
      id: uuid(),
      description: 'Department was trying to be found',
      input: async () => ({
        department_id: setup.instance.departments[0].id,
        employees: setup.instance.employees.map(employee => employee.id)
      })
    },
    {
      id: uuid(),
      description: 'Employees were trying to be set',
      input: async () => ({
        department_id: setup.instance.departments[0].id,
        employees: setup.instance.employees.map(employee => employee.id)
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Department is not found' && is_mocked) {
      return jest.spyOn(Department, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Department was trying to be found') {
      return jest.spyOn(Department, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Employees were trying to be set') {
      return jest.spyOn(Department, 'findByPk').mockResolvedValue({
        addEmployees: async payload => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Department, 'findByPk').mockResolvedValue({
        addEmployees: async (employees, options) => employees
      });
    }
  }
};

scenario.get_employee = {
  pass: [
    {
      id: uuid(),
      description: 'Employee is found',
      input: async () => ({
        department_id: setup.instance.departments[0].id,
        employee_id: setup.instance.employees[0].id
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Department id param is malformed',
      input: async () => ({
        department_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
        employee_id: setup.instance.employees[0].id
      })
    },
    {
      id: uuid(),
      description: 'Employee id param is malformed',
      input: async () => ({
        department_id: setup.instance.departments[0].id,
        employee_id: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefcaaaaaa'
      })
    },
    {
      id: uuid(),
      description: 'Department is not found',
      input: async () => ({
        department_id: setup.instance.employees[0].id,
        employee_id: setup.instance.employees[0].id
      })
    },
    {
      id: uuid(),
      description: 'Employee is not found',
      input: async () => ({
        department_id: setup.instance.employees[0].id,
        employee_id: setup.instance.employees[0].id
      })
    },
    {
      id: uuid(),
      description: 'Department was trying to be found',
      input: async () => ({
        department_id: setup.instance.employees[0].id,
        employee_id: setup.instance.employees[0].id
      })
    },
    {
      id: uuid(),
      description: 'Employee was trying to be found',
      input: async () => ({
        department_id: setup.instance.employees[0].id,
        employee_id: setup.instance.employees[0].id
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Department is not found') {
      return jest.spyOn(Department, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Employee is not found') {
      return jest.spyOn(Department, 'findByPk').mockResolvedValue({
        getEmployees: async options => null
      });
    }
    if (description === 'Department was trying to be found') {
      return jest.spyOn(Department, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Employee was trying to be found') {
      return jest.spyOn(Department, 'findByPk').mockResolvedValue({
        getEmployees: async payload => {
          throw new Error('error mocked.');
        }
      });
    }
    if (description === 'Employee was trying to be removed') {
      return jest.spyOn(Department, 'findByPk').mockResolvedValue({
        getEmployees: async payload => ({
          setDepartment: async payload => {
            throw new Error('error mocked.');
          }
        })
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Department, 'findByPk').mockResolvedValue({
        getEmployees: async (values) => setup.instance.employees[0]
      });
    }
  }
};

module.exports.scenario = scenario;

module.exports.setup = setup;
