import uuid from 'uuid/v4';
import setup_factory from './index';
import db from 'src/db/models';

const is_mocked = JSON.parse(process.env.MOCK);
const setup = setup_factory(db, is_mocked, 'Quote'), scenario = {};
const { Quote } = db.sequelize.models;

scenario.get_quotes = {
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
      description: 'query sent is: { search: { subject: "ccccc" } }',
      input: async () => ({ search: { subject: 'ccccc' } })
    },
    {
      id: uuid(),
      description: 'query sent is: { search: { subject: { like: "%vvv%" } } }',
      input: async () => ({ search: { subject: { like: '%vvv%' } } })
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
      input: async () => ({ search: { subject: { eq: 'model' } } })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Action throw error') {
      return jest.spyOn(Quote, 'findAll')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Quote, 'findAll')
        .mockResolvedValue([]);
    }
  }
};

scenario.create_quotes = {
  pass: [
    {
      id: uuid(),
      description: 'Values are sent as array',
      input: async () => ({
        values: [{
          customer_id: setup.instance.customers[0].id,
          salesman_id: setup.instance.employees[0].id
        }]
      })
    },
    {
      id: uuid(),
      description: 'Values are sent as object',
      input: async () => ({
        values: {
          customer_id: setup.instance.customers[0].id,
          salesman_id: setup.instance.employees[0].id
        }
      })
    },
    {
      id: uuid(),
      description: `Quote is created by a specific user`,
      input: async () => ({
        values: {
          customer_id: setup.instance.customers[0].id,
          salesman_id: setup.instance.employees[0].id,
          subject: 'demo subject description',
          created_by: setup.instance.users[0].id,
          updated_by: setup.instance.users[0].id
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
          customer_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          salesman_id: setup.instance.employees[0].id,
        }]
      })
    },
    {
      id: uuid(),
      description: 'Values are sent as object but validation fail',
      input: async () => ({
        values: {
          customer_id: setup.instance.customers[0].id,
          salesman_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        }
      })
    },
    {
      id: uuid(),
      description: 'Action throw error',
      input: async () => ({
        values: {
          customer_id: setup.instance.customers[0].id,
          salesman_id: setup.instance.employees[0].id
        }
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Action throw error') {
      return jest.spyOn(Quote, 'createMany')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Quote, 'createMany')
        .mockImplementation(async (values, options) => {
        if (Array.isArray(values)) {
          return values.reduce((initial, values) => {
            initial.push(Quote.build(values, options));
            return initial;
          }, []);
        } else {
          return Quote.build(values, options);
        }
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
        quote_id: setup.instance.quotes[0].id
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Quote id param is malformed',
      input: async () => ({
        quote_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s'
      })
    },
    {
      id: uuid(),
      description: 'Quote is not found',
      input: async () => ({
        quote_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111'
      })
    },
    {
      id: uuid(),
      description: 'Quote was trying to be found',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Quote is not found' && is_mocked) {
      return jest.spyOn(Quote, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Quote was trying to be found') {
      return jest.spyOn(Quote, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Quote, 'findByPk')
        .mockResolvedValue(setup.instance.quotes[0]);
    }
  }
};

scenario.update_quote = {
  pass: [
    {
      id: uuid(),
      description: 'Quote is updated',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        values: { subject: 'Quote subject' }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Quote param id is malformed',
      input: async () => ({
        quote_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        values: { subject: 'Quote subject' }
      })
    },
    {
      id: uuid(),
      description: 'Quote is not found',
      input: async () => ({
        quote_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        values: { subject: 'Quote subject' }
      })
    },
    {
      id: uuid(),
      description: 'Quote was trying to be found',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        values: { subject: 'Quote subject' }
      })
    },
    {
      id: uuid(),
      description: 'Quote was trying to be updated',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        values: { subject: 'Quote subject' }
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Quote is not found' && is_mocked) {
      return jest.spyOn(Quote, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Quote was trying to be found') {
      return jest.spyOn(Quote, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Quote was trying to be updated') {
      return jest.spyOn(Quote, 'findByPk').mockResolvedValue({
        update: async payload => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Quote, 'findByPk').mockResolvedValue({
        update: async (payload, options) => Quote.build({
          ...setup.instance.quotes[0].dataValues,
          ...payload
        }, options)
      });
    }
  }
};

scenario.delete_quote = {
  pass: [
    {
      id: uuid(),
      description: 'Quote is deleted without options',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Quote is deleted using force option as true',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        query: { force: true }
      })
    },
    {
      id: uuid(),
      description: 'Quote is deleted using force option as false',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        query: { force: false }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Quote param id is malformed',
      input: async () => ({
        quote_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Quote is not found',
      input: async () => ({
        quote_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Quote was trying to be found',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Quote was trying to be removed',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        query: {}
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Quote is not found' && is_mocked) {
      return jest.spyOn(Quote, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Quote was trying to be found') {
      return jest.spyOn(Quote, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Quote was trying to be removed') {
      return jest.spyOn(Quote, 'findByPk').mockResolvedValue({
        destroy: async payload => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Quote, 'findByPk').mockResolvedValue({
        destroy: async payload => {
          if (payload.force) {
            return [];
          } else {
            setup.instance.quotes[0].deleted_at = new Date().toISOString();
            return setup.instance.quotes[0];
          }
        }
      });
    }
  }
};

scenario.get_items = {
  pass: [
    {
      id: uuid(),
      description: 'Query is: empty',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Query is: name=dknd',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        query: { search: { name: 'dknd' } }
      })
    },
    {
      id: uuid(),
      description: 'Query is: name like %disk%',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        query: { search: { name: { like: '%disk%' } } }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Quote param id is malformed',
      input: async () => ({
        quote_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Quote is not found',
      input: async () => ({
        quote_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Quote was trying to be found',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Items were trying to be found',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        query: {}
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Quote is not found' && is_mocked) {
      return jest.spyOn(Quote, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Quote was trying to be found') {
      return jest.spyOn(Quote, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Items were trying to be found') {
      return jest.spyOn(Quote, 'findByPk').mockResolvedValue({
        getItems: async (options) => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Quote, 'findByPk').mockResolvedValue({
        getItems: async payload => setup.instance.items
      });
    }
  }
};

scenario.set_items = {
  pass: [
    {
      id: uuid(),
      description: 'Items are set',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        items: setup.instance.items.map(item => item.id)
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Quote param id is malformed',
      input: async () => ({
        quote_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        items: setup.instance.items.map(item => item.id)
      })
    },
    {
      id: uuid(),
      description: 'Items ids are malformed',
      input: async () => ({
        quote_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        items: [
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s'
        ]
      })
    },
    {
      id: uuid(),
      description: 'Quote is not found',
      input: async () => ({
        quote_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        items: setup.instance.items.map(item => item.id)
      })
    },
    {
      id: uuid(),
      description: 'Quote was trying to be found',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Items cannot be set',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        items: setup.instance.items.map(item => item.id)
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Quote is not found' && is_mocked) {
      return jest.spyOn(Quote, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Quote was trying to be found') {
      return jest.spyOn(Quote, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Items cannot be set') {
      return jest.spyOn(Quote, 'findByPk').mockResolvedValue({
        addItems: async (items) => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Quote, 'findByPk').mockResolvedValue({
        addItems: async payload => []
      });
    }
  }
};

scenario.get_item = {
  pass: [
    {
      id: uuid(),
      description: 'Item is found',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        item_id: setup.instance.items[0].id
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Quote param id is malformed',
      input: async () => ({
        quote_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
        item_id: setup.instance.items[0].id
      })
    },
    {
      id: uuid(),
      description: 'Item param id is malformed',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        item_id: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefcaaaaaa'
      })
    },
    {
      id: uuid(),
      description: 'Quote is not found',
      input: async () => ({
        quote_id: 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d',
        item_id: setup.instance.items[0].id
      })
    },
    {
      id: uuid(),
      description: 'Item is not found',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        item_id: 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d'
      })
    },
    {
      id: uuid(),
      description: 'Quote was trying to be found',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        item_id: setup.instance.items[0].id
      })
    },
    {
      id: uuid(),
      description: 'Item was trying to be found',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        item_id: setup.instance.items[0].id
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Quote is not found' && is_mocked) {
      return jest.spyOn(Quote, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Item is not found' && is_mocked) {
      return jest.spyOn(Quote, 'findByPk').mockResolvedValue({
        getItems: async (options) => null
      });
    }
    if (description === 'Quote was trying to be found') {
      return jest.spyOn(Quote, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Item was trying to be found') {
      return jest.spyOn(Quote, 'findByPk').mockResolvedValue({
        getItems: async (options) => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Quote, 'findByPk').mockResolvedValue({
        getItems: async (options) => setup.instance.items[0]
      });
    }
  }
};

scenario.update_item = {
  pass: [
    {
      id: uuid(),
      description: 'Item is found',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        item_id: setup.instance.items[0].id,
        values: { extra: { units: 20 } }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Quote param id is malformed',
      input: async () => ({
        quote_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
        item_id: setup.instance.items[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Item param id is malformed',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        item_id: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefcaaaaaa',
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Quote is not found',
      input: async () => ({
        quote_id: 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d',
        item_id: setup.instance.items[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Item is not found',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        item_id: 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d',
        values: { extra: { units: 21 } }
      })
    },
    {
      id: uuid(),
      description: 'Quote was trying to be found',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        item_id: setup.instance.items[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Item was trying to be found',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        item_id: setup.instance.items[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Item was trying to be updated',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        item_id: setup.instance.items[0].id,
        values: { extra: { units: 20 } }
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Quote is not found' && is_mocked) {
      return jest.spyOn(Quote, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Item is not found' && is_mocked) {
      return jest.spyOn(Quote, 'findByPk').mockResolvedValue({
        getItems: async (options) => null
      });
    }
    if (description === 'Quote was trying to be found') {
      return jest.spyOn(Quote, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Item was trying to be found') {
      return jest.spyOn(Quote, 'findByPk').mockResolvedValue({
        getItems: async (options) => {
          throw new Error('error mocked.');
        }
      });
    }
    if (description === 'Item was trying to be updated') {
      return jest.spyOn(Quote, 'findByPk').mockResolvedValue({
        getItems: async (options) => ({}),
        addItem: async (uuid, options) => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Quote, 'findByPk').mockResolvedValue({
        getItems: async (options) => ({ mocked: 'yes' }),
        addItem: async (values, options) => setup.instance.items[0]
      });
    }
  }
};

scenario.remove_item = {
  pass: [
    {
      id: uuid(),
      description: 'Item is found',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        item_id: setup.instance.items[0].id
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Quote param id is malformed',
      input: async () => ({
        quote_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
        item_id: setup.instance.items[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Item param id is malformed',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        item_id: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefcaaaaaa',
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Quote is not found',
      input: async () => ({
        quote_id: 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d',
        item_id: setup.instance.items[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Item is not found',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        item_id: 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d',
        values: { extra: { units: 21 } }
      })
    },
    {
      id: uuid(),
      description: 'Quote was trying to be found',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        item_id: setup.instance.items[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Item was trying to be found',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        item_id: setup.instance.items[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Item was trying to be removed',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        item_id: setup.instance.items[0].id,
        values: { extra: { units: 20 } }
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Quote is not found' && is_mocked) {
      return jest.spyOn(Quote, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Item is not found' && is_mocked) {
      return jest.spyOn(Quote, 'findByPk').mockResolvedValue({
        getItems: async (options) => null
      });
    }
    if (description === 'Quote was trying to be found') {
      return jest.spyOn(Quote, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Item was trying to be found') {
      return jest.spyOn(Quote, 'findByPk').mockResolvedValue({
        getItems: async (options) => {
          throw new Error('error mocked.');
        }
      });
    }
    if (description === 'Item was trying to be removed') {
      return jest.spyOn(Quote, 'findByPk').mockResolvedValue({
        getItems: async (options) => ({}),
        removeItem: async (uuid, options) => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Quote, 'findByPk').mockResolvedValue({
        getItems: async (payload, options) => ({}),
        removeItem: async (payload, options) => setup.instance.items[0]
      });
    }
  }
};

scenario.get_orders = {
  pass: [
    {
      id: uuid(),
      description: 'query sent is: {}',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'query sent is: { search: {} }',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        query: { search: {} }
      })
    },
    {
      id: uuid(),
      description: 'query sent is: undefined',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        query: { search: undefined }
      })
    },
    {
      id: uuid(),
      description: 'query sent is: { search: { code: "ccccc" } }',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        query: { search: { code: 'ccccc' } }
      })
    },
    {
      id: uuid(),
      description: 'query sent is: { search: { code: { like: "%ccccc% } } }',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        query: { search: { code: { like: '%ccccc%' } } }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Quote id param is malformed',
      input: async () => ({
        quote_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Quote is not found',
      input: async () => ({
        quote_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Quote was trying to be found',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Orders were trying to be found',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        query: {}
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Quote is not found' && is_mocked) {
      return jest.spyOn(Quote, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Quote was trying to be found') {
      return jest.spyOn(Quote, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Orders were trying to be found') {
      return jest.spyOn(Quote, 'findByPk').mockResolvedValue({
        getOrders: async payload => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Quote, 'findByPk').mockResolvedValue({
        getOrders: async payload => ({ success : 'mocked' })
      });
    }
  }
};

scenario.set_orders = {
  pass: [
    {
      id: uuid(),
      description: 'Orders are added',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        orders: setup.instance.orders.map(order => order.id)
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Quote param id is malformed',
      input: async () => ({
        quote_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        orders: setup.instance.orders.map(order => order.id)
      })
    },
    {
      id: uuid(),
      description: 'Quote is not found',
      input: async () => ({
        quote_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        orders: setup.instance.orders.map(order => order.id)
      })
    },
    {
      id: uuid(),
      description: 'Quote was trying to be found',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Orders cannot be set',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        orders: setup.instance.orders.map(order => order.id)
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Quote is not found' && is_mocked) {
      return jest.spyOn(Quote, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Quote was trying to be found') {
      return jest.spyOn(Quote, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Orders cannot be set') {
      return jest.spyOn(Quote, 'findByPk').mockResolvedValue({
        addOrders: payload => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Quote, 'findByPk').mockResolvedValue({
        addOrders: async payload => ({ success : 'mocked' })
      });
    }
  }
};

scenario.get_order = {
  pass: [
    {
      id: uuid(),
      description: 'Order is found',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        order_id: setup.instance.orders[0].id
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Quote id param is malformed',
      input: async () => ({
        quote_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
        order_id: setup.instance.orders[0].id
      })
    },
    {
      id: uuid(),
      description: 'Order id param is malformed',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        order_id: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefcaaaaaa'
      })
    },
    {
      id: uuid(),
      description: 'Quote is not found',
      input: async () => ({
        quote_id: 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d',
        order_id: setup.instance.orders[0].id
      })
    },
    {
      id: uuid(),
      description: 'Order is not found',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        order_id: 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d'
      })
    },
    {
      id: uuid(),
      description: 'Quote was trying to be found',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        order_id: setup.instance.orders[0].id
      })
    },
    {
      id: uuid(),
      description: 'Order was trying to be found',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        order_id: setup.instance.orders[0].id
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Quote is not found' && is_mocked) {
      return jest.spyOn(Quote, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Order is not found' && is_mocked) {
      return jest.spyOn(Quote, 'findByPk').mockResolvedValue({
        getOrders: async payload => null
      });
    }
    if (description === 'Quote was trying to be found') {
      return jest.spyOn(Quote, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Order was trying to be found') {
      return jest.spyOn(Quote, 'findByPk').mockResolvedValue({
        getOrders: async payload => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Quote, 'findByPk').mockResolvedValue({
        getOrders: async payload => setup.instance.orders[0]
      });
    }
  }
};

module.exports.scenario = scenario;

module.exports.setup = setup;
