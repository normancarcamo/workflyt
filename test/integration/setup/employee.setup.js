import uuid from 'uuid/v4';
import setup_factory from './index';
import db from 'src/db/models';

const is_mocked = JSON.parse(process.env.MOCK);
const setup = setup_factory(db, is_mocked, 'Employee'), scenario = {};
const { Employee } = db.sequelize.models;

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
      input: async () => ({ search: { firstname: { like: '%vvv%' } } })
    },
    {
      id: uuid(),
      description: 'include user association',
      input: async () => ({ include: 'user' }),
      mock: async input => {
        if (is_mocked) {
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
      },
      then: async res => {
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined().toBeArray();
        expect(res.body.data[0]).toBeObject().toContainKey('user');
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      }
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
      description: 'Action throw error',
      input: async () => ({ search: { firstname: { like: '%vvvvv%' } } })
    },
    {
      id: uuid(),
      description: 'include a non existent association',
      input: async () => ({ include: 'ddddd' })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Action throw error') {
      return jest.spyOn(Employee, 'findAll')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Employee, 'findAll')
        .mockResolvedValue([]);
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
          firstname: 'Norman',
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
          firstname: 'Norman',
          lastname: 'Carcamo',
          department_id:  setup.instance.departments[0].id
        }
      })
    },
    {
      id: uuid(),
      description: `is created by a specific user`,
      input: async () => ({
        values: {
          department_id:  setup.instance.departments[0].id,
          firstname: 'kanem1',
          lastname: 'dkanem',
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
      description: 'Values are sent as an array but validation fail',
      input: async () => ({
        values: [{
          firstname: 'Norman',
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
          firstname: '',
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
          firstname: 'Norman',
          lastname: 'Carcamo',
          department_id:  setup.instance.departments[0].id
        }
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Values are sent but action create fail') {
      return jest.spyOn(Employee, 'createMany')
        .mockRejectedValue(new Error('error mocked.'));
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
      input: async () => ({ employee_id: setup.instance.employees[0].id }),
      mock: async () => {
        if (is_mocked) {
          jest.spyOn(Employee, 'findByPk').mockResolvedValue(
            setup.instance.employees[0]
          );
        }
      }
    },
    {
      id: uuid(),
      description: 'Employee is found and include user',
      input: async () => ({
        employee_id: setup.instance.employees[0].id,
        options: { include: 'user' }
      }),
      mock: async (input) => {
        const employee = setup.instance.employees[0].dataValues;
        const user = await setup.instance.employees[0].getUser();
        employee.user = user.dataValues;
        jest.spyOn(Employee, 'findByPk').mockResolvedValue(employee);
      },
      then: async (res) => {
        expect(res.statusCode).toEqual(200);
        expect(res.body.data).toBeDefined();
        expect(res.body.data.user).toBeDefined();
        expect(res.body.error).toBeOneOf([ undefined, null ]);
      },
    },
    {
      id: uuid(),
      description: 'Employee is found and include user + quotes',
      input: async () => ({
        employee_id: setup.instance.employees[0].id,
        options: { include: 'user,quotes' }
      }),
      mock: async () => {
        if (is_mocked) {
          jest.spyOn(Employee, 'findByPk')
            .mockResolvedValue(setup.instance.employees[0]);
        }
      }
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Employee id param is malformed',
      input: async () => ({
        employee_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        options: {}
      })
    },
    {
      id: uuid(),
      description: 'Employee is not found',
      input: async () => ({
        employee_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc119',
        options: {}
      }),
      mock: async () => {
        jest.spyOn(Employee, 'findByPk').mockResolvedValue(null);
      }
    },
    {
      id: uuid(),
      description: 'Employee was trying to be found',
      input: async () => ({
        employee_id: setup.instance.employees[0].id,
        options: {}
      }),
      mock: async () => {
        jest.spyOn(Employee, 'findByPk')
          .mockRejectedValue(new Error('error mocked.'));
      }
    },
    {
      id: uuid(),
      description: 'Include a non existent association',
      input: async () => ({
        employee_id: setup.instance.employees[0].id,
        options: { include: 'demo' }
      })
    }
  ]
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
      description: 'Employee id param is malformed',
      input: async () => ({
        employee_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        values: { firstname: 'Enmanuel' }
      })
    },
    {
      id: uuid(),
      description: 'Employee is not found',
      input: async () => ({
        employee_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        values: { firstname: 'Enmanuel' }
      })
    },
    {
      id: uuid(),
      description: 'Employee was trying to be found',
      input: async () => ({
        employee_id: setup.instance.employees[0].id,
        values: { firstname: 'Enmanuel' }
      })
    },
    {
      id: uuid(),
      description: 'Employee was trying to be updated',
      input: async () => ({
        employee_id: setup.instance.employees[0].id,
        values: { firstname: 'Enmanuel' }
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Employee is not found' && is_mocked) {
      return jest.spyOn(Employee, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Employee was trying to be found') {
      return jest.spyOn(Employee, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Employee was trying to be updated') {
      return jest.spyOn(Employee, 'findByPk').mockResolvedValue({
        update: async payload => {
          throw new Error('error mocked.');
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
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Employee id param is malformed',
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
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Employee is not found' && is_mocked) {
      return jest.spyOn(Employee, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Employee was trying to be found') {
      return jest.spyOn(Employee, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Employee was trying to be deleted') {
      return jest.spyOn(Employee, 'findByPk').mockResolvedValue({
        destroy: async payload => {
          throw new Error('error mocked.');
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

scenario.get_user = {
  pass: [
    {
      id: uuid(),
      description: 'User is found',
      input: async () => ({
        employee_id: setup.instance.employees[0].id
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Employee id param is malformed',
      input: async () => ({
        employee_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll'
      })
    },
    {
      id: uuid(),
      description: 'Employee is not found',
      input: async () => ({
        employee_id: '19734cd8-cbb9-4017-a6df-33a97872959a'
      })
    },
    {
      id: uuid(),
      description: 'Employee is trying to be found',
      input: async () => ({
        employee_id: setup.instance.employees[0].id
      })
    },
    {
      id: uuid(),
      description: 'User is trying to be found',
      input: async () => ({
        employee_id: setup.instance.employees[0].id
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Employee is not found' && is_mocked) {
      return jest.spyOn(Employee, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Employee is trying to be found') {
      return jest.spyOn(Employee, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'User is trying to be found') {
      return jest.spyOn(Employee, 'findByPk').mockResolvedValue({
        getUser: async payload => {
          throw new Error('error mocked.');
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

scenario.set_user = {
  pass: [
    {
      id: uuid(),
      description: 'User are set',
      input: async () => ({
        employee_id: setup.instance.employees[0].id,
        user: setup.instance.users[0].id
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Employee id param is malformed',
      input: async () => ({
        employee_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        user: setup.instance.users[0].id
      })
    },
    {
      id: uuid(),
      description: 'Employee is not found',
      input: async () => ({
        employee_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        user: setup.instance.users[0].id
      })
    },
    {
      id: uuid(),
      description: 'Employee was trying to be found',
      input: async () => ({
        employee_id: setup.instance.employees[0].id,
        user: setup.instance.users[0].id
      })
    },
    {
      id: uuid(),
      description: 'User cannot be set',
      input: async () => ({
        employee_id: setup.instance.employees[0].id,
        user: setup.instance.users[0].id
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Employee is not found' && is_mocked) {
      return jest.spyOn(Employee, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Employee was trying to be found') {
      return jest.spyOn(Employee, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'User cannot be set') {
      return jest.spyOn(Employee, 'findByPk').mockResolvedValue({
        setUser: async payload => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Employee, 'findByPk').mockResolvedValue({
        setUser: async (payload, options) => setup.instance.users[0]
      });
    }
  }
};

scenario.remove_user = {
  pass: [
    {
      id: uuid(),
      description: 'User is removed',
      input: async () => ({
        employee_id: setup.instance.employees[0].id
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Employee id param is malformed',
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
    {
      id: uuid(),
      description: 'User cannot be removed',
      input: async () => ({
        employee_id: setup.instance.employees[0].id
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Employee is not found' && is_mocked) {
      return jest.spyOn(Employee, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Employee was trying to be found') {
      return jest.spyOn(Employee, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'User cannot be removed') {
      return jest.spyOn(Employee, 'findByPk').mockResolvedValue({
        setUser: async payload => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Employee, 'findByPk').mockResolvedValue({
        setUser: async (payload, options) => setup.instance.users[0]
      });
    }
  }
};

scenario.get_quotes = {
  pass: [
    {
      id: uuid(),
      description: 'Query is: empty',
      input: async () => ({
        employee_id: setup.instance.employees[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Query is: subject=dknd',
      input: async () => ({
        employee_id: setup.instance.employees[0].id,
        query: { search: { subject: 'dknd' } }
      })
    },
    {
      id: uuid(),
      description: 'Query is: subject like %disk%',
      input: async () => ({
        employee_id: setup.instance.employees[0].id,
        query: { search: { subject: { like: '%disk%' } } }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Employee id param is malformed',
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
  mock: async ({ fail, description }) => {
    if (description === 'Employee is not found' && is_mocked) {
      return jest.spyOn(Employee, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Employee was trying to be found') {
      return jest.spyOn(Employee, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Quotes were trying to be retrieved') {
      return jest.spyOn(Employee, 'findByPk').mockResolvedValue({
        getQuotes: async payload => {
          throw new Error('error mocked.');
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
      description: 'Quotes are set',
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
      description: 'Quotes cannot be set',
      input: async () => ({
        employee_id: setup.instance.employees[0].id,
        quotes: setup.instance.quotes.map(quote => quote.id)
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Employee is not found' && is_mocked) {
      return jest.spyOn(Employee, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Employee was trying to be found') {
      return jest.spyOn(Employee, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Quotes cannot be set') {
      return jest.spyOn(Employee, 'findByPk').mockResolvedValue({
        addQuotes: async payload => {
          throw new Error('error mocked.');
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
      description: 'Quote is found',
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
        employee_id: '19734cd8-cbb9-4017-a6df-33a97872959a',
        quote_id: setup.instance.quotes[0].id
      })
    },
    {
      id: uuid(),
      description: 'Quote is not found',
      input: async () => ({
        employee_id: setup.instance.employees[0].id,
        quote_id: '19734cd8-cbb9-4017-a6df-33a97872959a'
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
  mock: async ({ fail, description }) => {
    if (description === 'Employee is not found' && is_mocked) {
      return jest.spyOn(Employee, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Quote is not found' && is_mocked) {
      return jest.spyOn(Employee, 'findByPk').mockResolvedValue({
        getQuotes: async payload => null
      });
    }
    if (description === 'Employee was trying to be found') {
      return jest.spyOn(Employee, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Quote was trying to be found') {
      return jest.spyOn(Employee, 'findByPk').mockResolvedValue({
        getQuotes: async options => {
          throw new Error('error mocked.');
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
