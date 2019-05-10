import uuid from 'uuid/v4';
import setup_factory from './index';
import db from "src/db/models";
import { is } from '@playscode/fns';

const is_mocked = JSON.parse(process.env.MOCK);
const setup = setup_factory(db, is_mocked), scenario = {};
const { Quote } = db.sequelize.models;

// ----------------------------------------------------------------------------

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
      description: "query sent is: { search: { subject: 'ccccc' } }",
      input: async () => ({ search: { subject: 'ccccc' } })
    },
    {
      id: uuid(),
      description: "query sent is: { search: { subject: { like: '%vvv%' } } }",
      input: async () => ({ search: { subject: { like: '%vvv%' } } })
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
      description: 'Quote search action throw error',
      input: async () => ({ search: { subject: { eq: 'model' } } })
    }
  ],
  mock: async ({ input, fail, stage }) => {
    if (stage === 'Quote search action throw error') {
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
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Values are sent as an array but validation fail',
      input: async () => {
        return {
          values: [{
            customer_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
            salesman_id: setup.instance.employees[0].id,
          }]
        }
      }
    },
    {
      id: uuid(),
      description: 'Values are sent as object but validation fail',
      input: async () => {
        return {
          values: {
            customer_id: setup.instance.customers[0].id,
            salesman_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          }
        }
      }
    },
    {
      id: uuid(),
      description: 'Values are sent, but action throw error',
      input: async () => {
        return {
          values: {
            customer_id: setup.instance.customers[0].id,
            salesman_id: setup.instance.employees[0].id
          }
        }
      }
    }
  ],
  mock: async ({ input, fail, stage }) => {
    if (stage === 'Values are sent, but action throw error' && is_mocked) {
      return jest.spyOn(Quote, 'createMany')
        .mockRejectedValue(new Error('error mocked'));
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
  },
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
    },
  ],
  mock: async ({ input, fail, stage }) => {
    if (stage === 'Quote is not found' && is_mocked) {
      return jest.spyOn(Quote, 'findByPk').mockResolvedValue(null);
    }
    if (stage === 'Quote was trying to be found') {
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
      description: 'Quote id param is malformed',
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
    },
  ],
  mock: async ({ input, fail, stage }) => {
    if (stage === 'Quote is not found' && is_mocked) {
      return jest.spyOn(Quote, 'findByPk').mockResolvedValue(null);
    }
    if (stage === 'Quote was trying to be retrieved') {
      return jest.spyOn(Quote, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (stage === 'Quote was trying to be updated') {
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
      input: async () => {
        return {
          quote_id: setup.instance.quotes[0].id,
          query: {}
        }
      }
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
    },
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
      description: 'Quote was trying to be removed',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        query: {}
      })
    },
  ],
  mock: async ({ input, fail, stage }) => {
    if (stage === 'Quote is not found' && is_mocked) {
      return jest.spyOn(Quote, 'findByPk').mockResolvedValue(null);
    }
    if (stage === 'Quote was trying to be found') {
      return jest.spyOn(Quote, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (stage === 'Quote was trying to be removed') {
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

// ----------------------------------------------------------------------------

scenario.get_items = {
  pass: [
    {
      id: uuid(),
      description: "Query is: empty",
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: "Query is: name='dknd'",
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        query: { search: { name: 'dknd' } }
      })
    },
    {
      id: uuid(),
      description: "Query is: name like %disk%",
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        query: { search: { name: { like: '%disk%' } } }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Quote param id validation fail',
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
  mock: async ({ input, fail, stage }) => {
    if (fail && stage === 'Quote is not found') {
      return jest.spyOn(Quote, 'findByPk')
        .mockResolvedValue(null);
    }
    if (fail && stage === 'Quote was trying to be found') {
      return jest.spyOn(Quote, 'findByPk')
        .mockRejectedValue(new Error('Quote error mocked'));
    }
    if (fail && stage === 'Items were trying to be found') {
      return jest.spyOn(Quote, 'findByPk').mockResolvedValue({
        getItems: async (options) => {
          throw new Error('Quote.getItems error mocked');
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
      description: "Items are set",
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        items: setup.instance.items.map(item => item.id)
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Quote param id validation fail',
      input: async () => ({
        quote_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        items: setup.instance.items.map(item => item.id)
      })
    },
    {
      id: uuid(),
      description: 'Items ids validation fail',
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
      description: "Items cannot be set",
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        items: setup.instance.items.map(item => item.id)
      })
    },
  ],
  mock: async ({ input, fail, stage }) => {
    if (fail && stage === 'Quote is not found') {
      return jest.spyOn(Quote, 'findByPk')
        .mockResolvedValue(null);
    }
    if (fail && stage === 'Quote was trying to be found') {
      return jest.spyOn(Quote, 'findByPk')
        .mockRejectedValue(new Error('Quote error mocked'));
    }
    if (fail && stage === 'Items cannot be set') {
      return jest.spyOn(Quote, 'findByPk').mockResolvedValue({
        addItems: async (items) => {
          throw new Error('Quote.addItems error mocked');
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
      description: "Item is found",
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        item_id: setup.instance.items[0].id
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Quote param id is invalid',
      input: async () => ({
        quote_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
        item_id: setup.instance.items[0].id
      })
    },
    {
      id: uuid(),
      description: 'Item param id is invalid',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        item_id: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefcaaaaaa'
      })
    },
    {
      id: uuid(),
      description: 'Quote is not found',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        item_id: setup.instance.items[0].id
      })
    },
    {
      id: uuid(),
      description: 'Item is not found',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        item_id: setup.instance.items[0].id
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
  mock: async ({ input, fail, stage }) => {
    if (fail && stage === 'Quote is not found') {
      return jest.spyOn(Quote, 'findByPk')
        .mockResolvedValue(null);
    }
    if (fail && stage === 'Item is not found') {
      return jest.spyOn(Quote, 'findByPk').mockResolvedValue({
        getItems: async (options) => null
      });
    }
    if (fail && stage === 'Quote was trying to be found') {
      return jest.spyOn(Quote, 'findByPk')
        .mockRejectedValue(new Error('Quote.findByPk error mocked'));
    }
    if (fail && stage === 'Item was trying to be found') {
      return jest.spyOn(Quote, 'findByPk').mockResolvedValue({
        getItems: async (options) => {
          throw new Error('Quote.getItems error mocked');
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
      description: "Item is found",
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
      description: 'Quote param id is invalid',
      input: async () => ({
        quote_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
        item_id: setup.instance.items[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Item param id is invalid',
      input: async () => {
        return {
          quote_id: setup.instance.quotes[0].id,
          item_id: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefcaaaaaa',
          values: { extra: { units: 20 } }
        }
      }
    },
    {
      id: uuid(),
      description: 'Quote is not found',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        item_id: setup.instance.items[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Item is not found',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        item_id: setup.instance.items[0].id,
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
  mock: async ({ input, fail, stage }) => {
    if (fail && stage === 'Quote is not found') {
      return jest.spyOn(Quote, 'findByPk')
        .mockResolvedValue(null);
    }
    if (fail && stage === 'Item is not found') {
      return jest.spyOn(Quote, 'findByPk').mockResolvedValue({
        getItems: async (options) => null
      });
    }
    if (fail && stage === 'Quote was trying to be found') {
      return jest.spyOn(Quote, 'findByPk')
        .mockRejectedValue(new Error('Quote.findByPk error mocked'));
    }
    if (fail && stage === 'Item was trying to be found') {
      return jest.spyOn(Quote, 'findByPk').mockResolvedValue({
        getItems: async (options) => {
          throw new Error('Quote.getItems error mocked');
        }
      });
    }
    if (fail && stage === 'Item was trying to be updated') {
      return jest.spyOn(Quote, 'findByPk').mockResolvedValue({
        getItems: async (options) => ({}),
        addItem: async (uuid, options) => {
          throw new Error('req.quote.addItem error mocked');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Quote, 'findByPk').mockResolvedValue({
        getItems: async (options) => ({ mocked: "yes" }),
        addItem: async (values, options) => setup.instance.items[0]
      });
    }
  }
};

scenario.remove_item = {
  pass: [
    {
      id: uuid(),
      description: "Item is found",
      input: async () => {
        let quote = setup.instance.quotes[0];
        let item = setup.instance.items[0];
        return {
          quote_id: quote.id,
          item_id: item.id
        }
      }
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Quote param id is invalid',
      input: async () => ({
        quote_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
        item_id: setup.instance.items[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Item param id is invalid',
      input: async () => {
        return {
          quote_id: setup.instance.quotes[0].id,
          item_id: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefcaaaaaa',
          values: { extra: { units: 20 } }
        }
      }
    },
    {
      id: uuid(),
      description: 'Quote is not found',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        item_id: setup.instance.items[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Item is not found',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        item_id: setup.instance.items[0].id,
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
  mock: async ({ input, fail, stage }) => {
    if (fail && stage === 'Quote is not found') {
      return jest.spyOn(Quote, 'findByPk')
        .mockResolvedValue(null);
    }
    if (fail && stage === 'Item is not found') {
      return jest.spyOn(Quote, 'findByPk').mockResolvedValue({
        getItems: async (options) => null
      });
    }
    if (fail && stage === 'Quote was trying to be found') {
      return jest.spyOn(Quote, 'findByPk')
        .mockRejectedValue(new Error('Quote.findByPk error mocked'));
    }
    if (fail && stage === 'Item was trying to be found') {
      return jest.spyOn(Quote, 'findByPk').mockResolvedValue({
        getItems: async (options) => {
          throw new Error('Quote.getItems error mocked');
        }
      });
    }
    if (fail && stage === 'Item was trying to be removed') {
      return jest.spyOn(Quote, 'findByPk').mockResolvedValue({
        getItems: async (options) => ({}),
        removeItem: async (uuid, options) => {
          throw new Error('req.quote.removeItem error mocked');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Quote, 'findByPk').mockResolvedValue({
        getItems: (payload, options) => Promise.resolve({}),
        removeItem: async (payload, options) => setup.instance.items[0]
      });
    }
  }
};

// ----------------------------------------------------------------------------

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
      description: "query sent is: { search: { code: 'ccccc' } }",
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        query: { search: { code: 'ccccc' } }
      })
    },
    {
      id: uuid(),
      description: "query sent is: { search: { code: { like: '%ccccc%' } } }",
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
    },
  ],
  mock: async ({ input, fail, stage }) => {
    if (stage === 'Quote is not found' && is_mocked) {
      return jest.spyOn(Quote, 'findByPk').mockResolvedValue(null);
    }
    if (stage === 'Quote was trying to be found') {
      return jest.spyOn(Quote, 'findByPk')
        .mockImplementation(async (id, options) => {
          throw new Error('error mocked.');
        });
    }
    if (stage === 'Orders were trying to be found') {
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
      description: "Orders are added",
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        orders: setup.instance.orders.map(order => order.id)
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Quote param id validation fail',
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
      description: "Orders cannot be set",
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        orders: setup.instance.orders.map(order => order.id)
      })
    },
  ],
  mock: async ({ input, fail, stage }) => {
    if (stage === 'Quote is not found' && is_mocked) {
      return jest.spyOn(Quote, 'findByPk').mockResolvedValue(null);
    }
    if (stage === 'Quote was trying to be found') {
      return jest.spyOn(Quote, 'findByPk')
        .mockImplementation(async (id, options) => {
          throw new Error('Quote.findByPk error mocked');
        });
    }
    if (stage === 'Orders cannot be set') {
      return jest.spyOn(Quote, 'findByPk').mockResolvedValue({
        addOrders: payload => Promise.reject(new Error('Mock Error'))
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
      description: "Order is found",
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        order_id: setup.instance.orders[0].id
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Quote id param is invalid',
      input: async () => ({
        quote_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
        order_id: setup.instance.orders[0].id
      })
    },
    {
      id: uuid(),
      description: 'Order id param is invalid',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        order_id: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefcaaaaaa'
      })
    },
    {
      id: uuid(),
      description: 'Quote is not found',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        order_id: setup.instance.orders[0].id
      })
    },
    {
      id: uuid(),
      description: 'Order is not found',
      input: async () => ({
        quote_id: setup.instance.quotes[0].id,
        order_id: setup.instance.orders[0].id
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
    },
  ],
  mock: async ({ input, fail, stage }) => {
    if (stage === 'Quote is not found' && is_mocked) {
      return jest.spyOn(Quote, 'findByPk').mockResolvedValue(null);
    }
    if (stage === 'Order is not found' && is_mocked) {
      return jest.spyOn(Quote, 'findByPk').mockResolvedValue({
        getOrders: payload => Promise.resolve(null)
      });
    }
    if (stage === 'Quote was trying to be found') {
      return jest.spyOn(Quote, 'findByPk')
        .mockRejectedValue(new Error('Quote.findByPk error mocked'));
    }
    if (stage === 'Order was trying to be found') {
      return jest.spyOn(Quote, 'findByPk').mockResolvedValue({
        getOrders: async payload => {
          throw new Error('Quote.findByPk error mocked');
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

// ----------------------------------------------------------------------------

module.exports.scenario = scenario;

module.exports.setup = setup;
