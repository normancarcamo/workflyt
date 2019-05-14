import uuid from 'uuid/v4';
import setup_factory from './index';
import db from 'src/db/models';

const is_mocked = JSON.parse(process.env.MOCK);
const setup = setup_factory(db, is_mocked, 'Customer'), scenario = {};
const { Customer } = db.sequelize.models;

scenario.get_customers = {
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
      return jest.spyOn(Customer, 'findAll')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Customer, 'findAll')
        .mockResolvedValue([]);
    }
  }
};

scenario.create_customers = {
  pass: [
    {
      id: uuid(),
      description: 'Values are sent as array',
      input: async () => ({ values: [{ name: 'sps' }] })
    },
    {
      id: uuid(),
      description: 'Values are sent as object',
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
      description: 'Invalid values were sent using array',
      input: async () => ({ values: [ { name: '' } ] })
    },
    {
      id: uuid(),
      description: 'Invalid values were sent using object',
      input: async () => ({ values: { name: '' } })
    },
    {
      id: uuid(),
      description: 'Action throws error',
      input: async () => ({ values: { name: 'elct' } })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Action throws error') {
      return jest.spyOn(Customer, 'createMany')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Customer, 'createMany')
        .mockImplementation(async (values, options) => {
        if (Array.isArray(values)) {
          return values.reduce((initial, values, index) => {
            initial.push(Customer.build(values, options));
            return initial;
          }, []);
        } else {
          return Customer.build(values, options);
        }
      });
    }
  }
};

scenario.get_customer = {
  pass: [
    {
      id: uuid(),
      description: 'Customer is found',
      input: async () => ({
        customer_id: setup.instance.customers[0].id
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Customer id param is malformed',
      input: async () => ({
        customer_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        values: { name: 'Customer A' }
      })
    },
    {
      id: uuid(),
      description: 'Customer was not found',
      input: async () => ({
        customer_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        values: { name: 'Customer A' }
      })
    },
    {
      id: uuid(),
      description: 'Customer was trying to be found',
      input: async () => ({
        customer_id: setup.instance.customers[0].id,
        values: { name: 'Customer A' }
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Customer was not found' && is_mocked) {
      return jest.spyOn(Customer, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Customer was trying to be found') {
      jest.spyOn(Customer, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Customer, 'findByPk')
        .mockResolvedValue(setup.instance.customers[0]);
    }
  }
};

scenario.update_customer = {
  pass: [
    {
      id: uuid(),
      description: 'Customer is updated',
      input: async () => ({
        customer_id: setup.instance.customers[0].id,
        values: { name: 'Customer A' }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Customer id param is malformed',
      input: async () => ({
        customer_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        values: { name: 'Customer A' }
      })
    },
    {
      id: uuid(),
      description: 'Customer is not found',
      input: async () => ({
        customer_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        values: { name: 'Customer A' }
      })
    },
    {
      id: uuid(),
      description: 'Customer was trying to be found',
      input: async () => ({
        customer_id: setup.instance.customers[0].id,
        values: { name: 'Customer A' }
      })
    },
    {
      id: uuid(),
      description: 'Customer was trying to be updated',
      input: async () => ({
        customer_id: setup.instance.customers[0].id,
        values: { name: 'Customer A' }
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Customer is not found' && is_mocked) {
      return jest.spyOn(Customer, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Customer was trying to be found') {
      return jest.spyOn(Customer, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Customer was trying to be updated') {
      return jest.spyOn(Customer, 'findByPk').mockResolvedValue({
        update: async payload => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Customer, 'findByPk').mockResolvedValue({
        update: async (values, options) => Customer.build({
          ...setup.instance.customers[0].dataValues,
          ...values,
          updated_at: new Date().toISOString()
        }, options)
      });
    }
  }
};

scenario.delete_customer = {
  pass: [
    {
      id: uuid(),
      description: 'Customer is deleted without options',
      input: async () => ({
        customer_id: setup.instance.customers[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Customer is deleted with force option as true',
      input: async () => ({
        customer_id: setup.instance.customers[0].id,
        query: { force: true }
      })
    },
    {
      id: uuid(),
      description: 'Customer is deleted with force option as false',
      input: async () => ({
        customer_id: setup.instance.customers[0].id,
        query: { force: false }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Customer id param is malformed',
      input: async () => ({
        customer_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Customer is not found',
      input: async () => ({
        customer_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Customer was trying to be found',
      input: async () => ({
        customer_id: setup.instance.customers[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Customer was trying to be deleted',
      input: async () => ({
        customer_id: setup.instance.customers[0].id,
        query: {}
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Customer is not found' && is_mocked) {
      return jest.spyOn(Customer, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Customer was trying to be found') {
      return jest.spyOn(Customer, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Customer was trying to be deleted') {
      return jest.spyOn(Customer, 'findByPk').mockResolvedValue({
        destroy: async payload => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Customer, 'findByPk').mockResolvedValue({
        destroy: async (options) => {
          if (options.force) {
            return [];
          } else {
            return Customer.build({
              ...setup.instance.customers[0].dataValues,
              deleted_at: new Date().toISOString()
            })
          }
        }
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
        customer_id: setup.instance.customers[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Query is: subject=dknd',
      input: async () => ({
        customer_id: setup.instance.customers[0].id,
        query: { search: { subject: 'dknd' } }
      })
    },
    {
      id: uuid(),
      description: 'Query is: subject like %disk%',
      input: async () => ({
        customer_id: setup.instance.customers[0].id,
        query: { search: { subject: { like: '%disk%' } } }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Customer id param is malformed',
      input: async () => ({
        customer_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        query: { search: { subject: 'dknd' } }
      })
    },
    {
      id: uuid(),
      description: 'Customer is not found',
      input: async () => ({
        customer_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        query: { search: { subject: 'dknd' } }
      })
    },
    {
      id: uuid(),
      description: 'Customer was trying to be found',
      input: async () => ({
        customer_id: setup.instance.customers[0].id,
        query: { search: { subject: 'dknd' } }
      })
    },
    {
      id: uuid(),
      description: 'Quotes were trying to be found',
      input: async () => ({
        customer_id: setup.instance.customers[0].id,
        query: { search: { subject: 'dknd' } }
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Customer is not found' && is_mocked) {
      return jest.spyOn(Customer, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Customer was trying to be found') {
      return jest.spyOn(Customer, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Quotes were trying to be found') {
      return jest.spyOn(Customer, 'findByPk').mockResolvedValue({
        getQuotes: async payload => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Customer, 'findByPk').mockResolvedValue({
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
        customer_id: setup.instance.customers[0].id,
        quotes: setup.instance.quotes.map(quote => quote.id)
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Customer id param is malformed',
      input: async () => ({
        customer_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        quotes: setup.instance.quotes.map(quote => quote.id)
      })
    },
    {
      id: uuid(),
      description: 'Customer is not found',
      input: async () => ({
        customer_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        quotes: setup.instance.quotes.map(quote => quote.id)
      })
    },
    {
      id: uuid(),
      description: 'Customer was trying to be found',
      input: async () => ({
        customer_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        quotes: setup.instance.quotes.map(quote => quote.id)
      })
    },
    {
      id: uuid(),
      description: 'Quotes cannot be set',
      input: async () => ({
        customer_id: setup.instance.customers[0].id,
        quotes: setup.instance.quotes.map(quote => quote.id)
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Customer is not found' && is_mocked) {
      return jest.spyOn(Customer, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Customer was trying to be found') {
      return jest.spyOn(Customer, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Quotes cannot be set') {
      return jest.spyOn(Customer, 'findByPk').mockResolvedValue({
        addQuotes: async payload => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      jest.spyOn(Customer, 'findByPk').mockResolvedValue({
        addQuotes: async payload => payload
      });
    }
  }
};

scenario.get_quote = {
  pass: [
    {
      id: uuid(),
      description: 'Category is found',
      input: async () => ({
        customer_id: setup.instance.customers[0].id,
        quote_id: setup.instance.quotes[0].id
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Customer id param is malformed',
      input: async () => ({
        customer_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
        quote_id: setup.instance.quotes[0].id
      })
    },
    {
      id: uuid(),
      description: 'Quote id param is malformed',
      input: async () => ({
        customer_id: setup.instance.customers[0].id,
        quote_id: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefcaaaaaa'
      })
    },
    {
      id: uuid(),
      description: 'Customer is not found',
      input: async () => ({
        customer_id: '19734cd8-cbb9-4017-a6df-33a97872959a',
        quote_id: setup.instance.quotes[0].id
      })
    },
    {
      id: uuid(),
      description: 'Quote is not found',
      input: async () => ({
        customer_id: setup.instance.customers[0].id,
        quote_id: '19734cd8-cbb9-4017-a6df-33a97872959a'
      })
    },
    {
      id: uuid(),
      description: 'Customer was trying to be found',
      input: async () => ({
        customer_id: setup.instance.customers[0].id,
        quote_id: setup.instance.quotes[0].id
      })
    },
    {
      id: uuid(),
      description: 'Quote was trying to be found',
      input: async () => ({
        customer_id: setup.instance.customers[0].id,
        quote_id: setup.instance.quotes[0].id
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Customer is not found' && is_mocked) {
      return jest.spyOn(Customer, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Quote is not found' && is_mocked) {
      return jest.spyOn(Customer, 'findByPk').mockResolvedValue({
        getQuotes: async (options) => null
      });
    }
    if (description === 'Customer was trying to be found') {
      return jest.spyOn(Customer, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Quote was trying to be found') {
      return jest.spyOn(Customer, 'findByPk').mockResolvedValue({
        getQuotes: async (options) => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Customer, 'findByPk').mockResolvedValue({
        getQuotes: async payload => {
          return setup.instance.quotes[0];
        }
      });
    }
  }
};

module.exports.scenario = scenario;

module.exports.setup = setup;
