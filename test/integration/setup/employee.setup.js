import uuid from 'uuid/v4';
import setup_factory from './index';
import db from "src/db/models";
import { is } from '@playscode/fns';

const is_mocked = JSON.parse(process.env.MOCK);
const setup = setup_factory(db, is_mocked), scenario = {};
const { Employee } = db.sequelize.models;

// /api/v1/employees?role=salesman
scenario.get_employees = {
  pass: [
    {
      id: uuid(),
      description: 'query is: {}',
      input: async () => ({})
    },
    {
      id: uuid(),
      description: 'query is: { search: {} }',
      input: async () => ({ search: {} })
    },
    {
      id: uuid(),
      description: 'query is: undefined',
      input: async () => ({ search: undefined })
    },
    {
      id: uuid(),
      description: "query is: { search: { firstname: 'ccccc' } }",
      input: async () => ({ search: { firstname: 'ccccc' } })
    },
    {
      id: uuid(),
      description: "query is: { search: { firstname: { like: '%vvv%' } } }",
      input: async () => ({ search: { demo: { like: '%vvv%' } } })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Query validation fail',
      input: async () => ({ search: null })
    },
    {
      id: uuid(),
      description: 'Query search throws error',
      input: async () => ({ search: { firstname: { like: '%vvvvv%' } } })
    },
  ],
  mock: async ({ input, fail, stage }) => {
    if (fail) {
      jest.spyOn(Employee, 'findAll').mockRejectedValue(new Error('Mocked'));
    } else {
      jest.spyOn(Employee, 'findAll').mockResolvedValue([]);
    }
  }
};

scenario.create_employees = {
  pass: [
    {
      id: uuid(),
      description: 'Values are sent as array',
      input: async () => ({
        values: [{
          firstname: "Norman",
          lastname: 'Carcamo',
          department_id:  setup.instance.departments[0].id
        }]
      })
    },
    {
      id: uuid(),
      description: 'Values are sent as object',
      input: async () => ({
        values: {
          firstname: "Norman",
          lastname: 'Carcamo',
          department_id:  setup.instance.departments[0].id
        }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Values are sent as an array but validation fail',
      input: async () => ({
        values: [{
          firstname: "Norman",
          lastname: '',
          department_id:  setup.instance.departments[0].id
        }]
      })
    },
    {
      id: uuid(),
      description: 'Values are sent as object but validation fail',
      input: async () => ({
        values: {
          firstname: "",
          lastname: 'Carcamo',
          department_id:  setup.instance.departments[0].id
        }
      })
    },
    {
      id: uuid(),
      description: 'Values are sent but action create fail',
      input: async () => ({
        values: {
          firstname: "Norman",
          lastname: "Carcamo",
          department_id:  setup.instance.departments[0].id
        }
      })
    }
  ],
  mock: async ({ input, fail, stage }) => {
    if (stage === 'Values are sent but action create fail') {
      return jest.spyOn(Employee, 'createMany')
        .mockRejectedValue(new Error('Employee.create error mocked.'));
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Employee, 'createMany')
        .mockImplementation(async (values, options) => {
        if (Array.isArray(values)) {
          return values.reduce((initial, values) => {
            initial.push(Employee.build(values, options));
            return initial;
          }, []);
        } else {
          return Employee.build(values);
        }
      });
    }
  }
};

scenario.get_employee = {
  pass: [
    {
      id: uuid(),
      description: 'Employee is found',
      input: async () => ({ employee_id: setup.instance.employees[0].id })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Employee id param is invalid',
      input: async () => ({
        employee_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s'
      })
    },
    {
      id: uuid(),
      description: 'Employee is not found',
      input: async () => ({
        employee_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111'
      })
    },
    {
      id: uuid(),
      description: 'Employee was trying to be found',
      input: async () => ({
        employee_id: setup.instance.employees[0].id
      })
    },
  ],
  mock: async ({ input, fail, stage }) => {
    if (stage === 'Employee is not found' && is_mocked) {
      return jest.spyOn(Employee, 'findByPk').mockResolvedValue(null);
    }
    if (stage === 'Employee was trying to be found') {
      return jest.spyOn(Employee, 'findByPk')
        .mockRejectedValue(new Error('Employee.findByPk error mocked.'));
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Employee, 'findByPk')
        .mockResolvedValue(setup.instance.employees[0]);
    }
  }
};

scenario.update_employee = {
  pass: [
    {
      id: uuid(),
      description: 'Employee is updated',
      input: async () => ({
        employee_id: setup.instance.employees[0].id,
        values: { firstname: 'Enmanuel' }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Employee id param is invalid',
      input: async () => ({
        employee_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        values: { firstname: 'Enmanuel' }
      })
    },
    {
      id: uuid(),
      description: 'Employee is not found',
      input: async () => {
        return {
          employee_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
          values: { firstname: 'Enmanuel' }
        }
      }
    },
    {
      id: uuid(),
      description: 'Employee was trying to be found',
      input: async () => {
        return {
          employee_id: setup.instance.employees[0].id,
          values: { firstname: 'Enmanuel' }
        }
      }
    },
    {
      id: uuid(),
      description: 'Employee was trying to be updated',
      input: async () => {
        return {
          employee_id: setup.instance.employees[0].id,
          values: { firstname: 'Enmanuel' }
        }
      }
    }
  ],
  mock: async ({ input, fail, stage }) => {
    if (stage === 'Employee is not found' && is_mocked) {
      return jest.spyOn(Employee, 'findByPk').mockResolvedValue(null);
    }
    if (stage === 'Employee was trying to be found') {
      return jest.spyOn(Employee, 'findByPk')
        .mockRejectedValue(new Error('Employee.findByPk error mocked'));
    }
    if (stage === 'Employee was trying to be updated') {
      return jest.spyOn(Employee, 'findByPk').mockResolvedValue({
        update: async payload => {
          throw new Error('Employee.findByPk error mocked');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Employee, 'findByPk').mockResolvedValue({
        update: async (values, options) => Employee.build({
          ...setup.instance.employees[0].dataValues,
          ...values,
          updated_at: new Date().toISOString()
        })
      });
    }
  }
};

scenario.delete_employee = {
  pass: [
    {
      id: uuid(),
      description: 'Employee is deleted without options',
      input: async () => ({
        employee_id: setup.instance.employees[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Employee is deleted with force option as false',
      input: async () => ({
        employee_id: setup.instance.employees[0].id,
        query: { force: false }
      })
    },
    {
      id: uuid(),
      description: 'Employee is deleted with force option as true',
      input: async () => ({
        employee_id: setup.instance.employees[0].id,
        query: { force: true }
      })
    },
  ],
  fail: [
    {
      id: uuid(),
      description: 'Employee id param is invalid',
      input: async () => ({
        employee_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Employee is not found',
      input: async () => ({
        employee_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Employee was trying to be found',
      input: async () => ({
        employee_id: setup.instance.employees[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Employee was trying to be deleted',
      input: async () => ({
        employee_id: setup.instance.employees[0].id,
        query: {}
      })
    },
  ],
  mock: async ({ input, fail, stage }) => {
    if (fail) {
      if (stage === 'employee is not found') {
        jest.spyOn(Employee, 'findByPk').mockResolvedValue(null);
      } else if (stage === 'employee was trying to be retrieved') {
        jest.spyOn(Employee, 'findByPk').mockRejectedValue(new Error('Mock Error'));
      } else if (stage === 'employee was trying to be deleted') {
        jest.spyOn(Employee, 'findByPk').mockResolvedValue({
          destroy: payload => Promise.reject(new Error('Mock Error'))
        });
      }
    } else {
      if (is_mocked) {
        jest.spyOn(Employee, 'findByPk').mockImplementation(id => {
          return Promise.resolve({
            destroy: async payload => {
              if (payload.force) {
                return [];
              } else {
                return Employee.build({
                  ...setup.instance.employees[0].dataValues,
                  deleted_at: new Date().toISOString()
                });
              }
            }
          });
        });
      }
    }
  },
  mock: async ({ input, fail, stage }) => {
    if (stage === 'Employee is not found' && is_mocked) {
      return jest.spyOn(Employee, 'findByPk').mockResolvedValue(null);
    }
    if (stage === 'Employee was trying to be found') {
      return jest.spyOn(Employee, 'findByPk')
        .mockRejectedValue(new Error('Employee.findByPk error mocked'));
    }
    if (stage === 'Employee was trying to be deleted') {
      return jest.spyOn(Employee, 'findByPk').mockResolvedValue({
        destroy: async payload => {
          throw new Error('Employee.findByPk error mocked');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Employee, 'findByPk').mockResolvedValue({
        destroy: async (values, options) => {
          const now = new Date().toISOString();
          setup.instance.employees[0].updated_at = now;
          setup.instance.employees[0].deleted_at = now;
          return setup.instance.employees[0];
        }
      });
    }
  }
};

scenario.set_user = {
  pass: [
    {
      id: uuid(),
      description: "User are set",
      input: async () => ({
        employee_id: setup.instance.employees[0].id,
        values: setup.instance.users[0].id
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Employee id param is invalid',
      input: async () => ({
        employee_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        values: setup.instance.users[0].id
      })
    },
    {
      id: uuid(),
      description: 'Employee is not found',
      input: async () => ({
        employee_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        values: setup.instance.users[0].id
      })
    },
    {
      id: uuid(),
      description: 'Employee was trying to be found',
      input: async () => ({
        employee_id: setup.instance.employees[0].id,
        values: setup.instance.users[0].id
      })
    },
    {
      id: uuid(),
      description: "User cannot be set",
      input: async () => ({
        employee_id: setup.instance.employees[0].id,
        values: setup.instance.users[0].id
      })
    },
  ],
  mock: async ({ input, fail, stage }) => {
    if (stage === 'Employee is not found' && is_mocked) {
      return jest.spyOn(Employee, 'findByPk').mockResolvedValue(null);
    }
    if (stage === 'Employee was trying to be found') {
      return jest.spyOn(Employee, 'findByPk')
        .mockRejectedValue(new Error('findByPk error mocked.'));
    }
    if (stage === 'User cannot be set') {
      return jest.spyOn(Employee, 'findByPk').mockResolvedValue({
        setUser: payload => Promise.reject(new Error('setUser error mocked.'))
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Employee, 'findByPk').mockResolvedValue({
        setUser: async (payload, options) => setup.instance.users[0]
      });
    }
  }
};

scenario.get_user = {
  pass: [
    {
      id: uuid(),
      description: "User is found",
      input: async () => ({
        employee_id: setup.instance.employees[0].id,
        user_id: setup.instance.users[0].id
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Employee id param is invalid',
      input: async () => ({
        employee_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
        user_id: setup.instance.users[0].id
      })
    },
    {
      id: uuid(),
      description: 'User id param is invalid',
      input: async () => ({
        employee_id: setup.instance.employees[0].id,
        user_id: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefcaaaaaa'
      })
    },
    {
      id: uuid(),
      description: 'Employee is not found',
      input: async () => ({
        employee_id: setup.instance.employees[0].id,
        user_id: setup.instance.users[0].id
      })
    },
    {
      id: uuid(),
      description: 'User is not found',
      input: async () => ({
        employee_id: setup.instance.employees[0].id,
        user_id: setup.instance.users[0].id
      })
    },
    {
      id: uuid(),
      description: 'Employee was trying to be found',
      input: async () => ({
        employee_id: setup.instance.employees[0].id,
        user_id: setup.instance.users[0].id
      })
    },
    {
      id: uuid(),
      description: 'User was trying to be found',
      input: async () => ({
        employee_id: setup.instance.employees[0].id,
        user_id: setup.instance.users[0].id
      })
    }
  ],
  mock: async ({ input, fail, stage }) => {
    if (stage === 'Employee is not found' && is_mocked) {
      return jest.spyOn(Employee, 'findByPk').mockResolvedValue(null);
    }
    if (stage === 'User is not found' && is_mocked) {
      return jest.spyOn(Employee, 'findByPk').mockResolvedValue({
        getUser: async payload => null
      });
    }
    if (stage === 'Employee was trying to be found') {
      return jest.spyOn(Employee, 'findByPk')
        .mockRejectedValue(new Error('findByPk error mocked.'));
    }
    if (stage === 'User was trying to be found') {
      return jest.spyOn(Employee, 'findByPk').mockResolvedValue({
        getUser: async payload => {
          throw new Error('findByPk error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Employee, 'findByPk').mockResolvedValue({
        getUser: async payload => setup.instance.users[0]
      });
    }
  }
};

scenario.get_quotes = {
  pass: [
    {
      id: uuid(),
      description: "Query is: empty",
      input: async () => {
        return {
          employee_id: setup.instance.employees[0].id,
          query: {}
        }
      }
    },
    {
      id: uuid(),
      description: "Query is: subject='dknd'",
      input: async () => {
        return {
          employee_id: setup.instance.employees[0].id,
          query: { search: { subject: 'dknd' } }
        }
      }
    },
    {
      id: uuid(),
      description: "Query is: subject like %disk%",
      input: async () => {
        return {
          employee_id: setup.instance.employees[0].id,
          query: { search: { subject: { like: '%disk%' } } }
        }
      }
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Employee id param is invalid',
      input: async () => ({
        employee_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        query: { search: { subject: 'dknd' } }
      })
    },
    {
      id: uuid(),
      description: 'Employee is not found',
      input: async () => ({
        employee_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        query: { search: { subject: 'dknd' } }
      })
    },
    {
      id: uuid(),
      description: 'Employee was trying to be found',
      input: async () => ({
        employee_id: setup.instance.employees[0].id,
        query: { search: { subject: 'dknd' } }
      })
    },
    {
      id: uuid(),
      description: 'Quotes were trying to be retrieved',
      input: async () => ({
        employee_id: setup.instance.employees[0].id,
        query: { search: { subject: 'dknd' } }
      })
    }
  ],
  mock: async ({ input, fail, stage }) => {
    if (stage === 'Employee is not found' && is_mocked) {
      return jest.spyOn(Employee, 'findByPk').mockResolvedValue(null);
    }
    if (stage === 'Employee was trying to be found') {
      return jest.spyOn(Employee, 'findByPk')
        .mockRejectedValue(new Error('findByPk error mocked.'));
    }
    if (stage === 'Quotes were trying to be retrieved') {
      return jest.spyOn(Employee, 'findByPk').mockResolvedValue({
        getQuotes: async payload => {
          throw new Error('findByPk error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Employee, 'findByPk').mockResolvedValue({
        getQuotes: async payload => setup.instance.quotes
      });
    }
  }
};

scenario.set_quotes = {
  pass: [
    {
      id: uuid(),
      description: "Quotes are set",
      input: async () => ({
        employee_id: setup.instance.employees[0].id,
        quotes: setup.instance.quotes.map(quote => quote.id)
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Employee id param is malformed',
      input: async () => ({
        employee_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        quotes: setup.instance.quotes.map(quote => quote.id)
      })
    },
    {
      id: uuid(),
      description: 'Employee is not found',
      input: async () => ({
        employee_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        quotes: setup.instance.quotes.map(quote => quote.id)
      })
    },
    {
      id: uuid(),
      description: 'Employee was trying to be found',
      input: async () => ({
        employee_id: setup.instance.employees[0].id,
        quotes: setup.instance.quotes.map(quote => quote.id)
      })
    },
    {
      id: uuid(),
      description: "Quotes cannot be set",
      input: async () => ({
        employee_id: setup.instance.employees[0].id,
        quotes: setup.instance.quotes.map(quote => quote.id)
      })
    },
  ],
  mock: async ({ input, fail, stage }) => {
    if (stage === 'Employee is not found' && is_mocked) {
      return jest.spyOn(Employee, 'findByPk').mockResolvedValue(null);
    }
    if (stage === 'Employee was trying to be found') {
      return jest.spyOn(Employee, 'findByPk').mockRejectedValue(
        new Error('Employee was trying to be found, error mocked.')
      );
    }
    if (fail && stage === 'Quotes cannot be set') {
      return jest.spyOn(Employee, 'findByPk').mockResolvedValue({
        addQuotes: async payload => {
          throw new Error('Quotes cannot be set, error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Employee, 'findByPk').mockResolvedValue({
        addQuotes: async payload => []
      });
    }
  }
};

scenario.get_quote = {
  pass: [
    {
      id: uuid(),
      description: "Quote is found",
      input: async () => ({
        employee_id: setup.instance.employees[0].id,
        quote_id: setup.instance.quotes[0].id
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Employee id param is malformed',
      input: async () => ({
        employee_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
        quote_id: setup.instance.quotes[0].id
      })
    },
    {
      id: uuid(),
      description: 'Quote id param is malformed',
      input: async () => ({
        employee_id: setup.instance.employees[0].id,
        quote_id: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefcaaaaaa'
      })
    },
    {
      id: uuid(),
      description: 'Employee is not found',
      input: async () => ({
        employee_id: setup.instance.employees[0].id,
        quote_id: setup.instance.quotes[0].id
      })
    },
    {
      id: uuid(),
      description: 'Quote is not found',
      input: async () => ({
        employee_id: setup.instance.employees[0].id,
        quote_id: setup.instance.quotes[0].id
      })
    },
    {
      id: uuid(),
      description: 'Employee was trying to be found',
      input: async () => ({
        employee_id: setup.instance.employees[0].id,
        quote_id: setup.instance.quotes[0].id
      })
    },
    {
      id: uuid(),
      description: 'Quote was trying to be found',
      input: async () => ({
        employee_id: setup.instance.employees[0].id,
        quote_id: setup.instance.quotes[0].id
      })
    }
  ],
  mock: async ({ input, fail, stage }) => {
    if (stage === 'Employee is not found' && is_mocked) {
      return jest.spyOn(Employee, 'findByPk').mockResolvedValue(null);
    }
    if (stage === 'Quote is not found' && is_mocked) {
      return jest.spyOn(Employee, 'findByPk').mockResolvedValue({
        getQuotes: async payload => null
      });
    }
    if (stage === 'Employee was trying to be found') {
      return jest.spyOn(Employee, 'findByPk')
        .mockRejectedValue(new Error('findByPk error mocked.'));
    }
    if (stage === 'Quote was trying to be found') {
      return jest.spyOn(Employee, 'findByPk').mockResolvedValue({
        getQuotes: async options => {
          throw new Error('findByPk error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Employee, 'findByPk').mockResolvedValue({
        getQuotes: async payload => setup.instance.quotes[0]
      });
    }
  }
};

module.exports.scenario = scenario;

module.exports.setup = setup;
