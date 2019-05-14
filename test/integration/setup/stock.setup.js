import uuid from 'uuid/v4';
import setup_factory from './index';
import db from 'src/db/models';

const is_mocked = JSON.parse(process.env.MOCK);
const setup = setup_factory(db, is_mocked, 'Stock'), scenario = {};
const { Stock } = db.sequelize.models;

scenario.get_stocks = {
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
      description: "query sent is: { search: { entries: 3 } }",
      input: async () => ({ search: { entries: 3 } })
    },
    {
      id: uuid(),
      description: "query sent is: { search: { exits: { gte: 5 } } }",
      input: async () => ({ search: { exits: { gte: 5 } } })
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
      input: async () => ({ search: { exits: { gte: 5 } } })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Action throw error') {
      return jest.spyOn(Stock, 'findAll')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Stock, 'findAll')
        .mockResolvedValue([]);
    }
  }
};

scenario.create_stocks = {
  pass: [
    {
      id: uuid(),
      description: 'Values are sent as array',
      input: async () => ({
        values: [{
          item_id: setup.instance.items[0].id,
          entries: 38
        }]
      })
    },
    {
      id: uuid(),
      description: 'Values are sent as object',
      input: async () => ({
        values: {
          item_id: setup.instance.items[0].id,
          entries: 38
        }
      })
    },
    {
      id: uuid(),
      description: `Stock is created by a specific user`,
      input: async () => ({
        values: {
          item_id: setup.instance.items[0].id,
          entries: 38,
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
      description: 'Query validation fail',
      input: async () => ({
        values: {
          item_id: setup.instance.items[0].id,
          exits: -3
        }
      })
    },
    {
      id: uuid(),
      description: 'Action throw error',
      input: async () => ({
        values: {
          item_id: setup.instance.items[0].id,
          exits: 45
        }
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Action throw error') {
      return jest.spyOn(Stock, 'createMany')
        .mockRejectedValue(new Error('error mocked'));
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Stock, 'createMany')
        .mockImplementation(async (values, options) => {
        if (Array.isArray(values)) {
          return values.reduce((initial, values) => {
            initial.push(Stock.build(values, options));
            return initial;
          }, []);
        } else {
          return Stock.build(values, options);
        }
      });
    }
  }
};

scenario.get_stock = {
  pass: [
    {
      id: uuid(),
      description: 'Stock is found',
      input: async () => ({ stock_id: setup.instance.stocks[0].id })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Stock id param is malformed',
      input: async () => ({
        stock_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s'
      })
    },
    {
      id: uuid(),
      description: 'Stock is not found',
      input: async () => ({
        stock_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111'
      })
    },
    {
      id: uuid(),
      description: 'Stock was trying to be found',
      input: async () => ({
        stock_id: setup.instance.stocks[0].id
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Stock is not found' && is_mocked) {
      return jest.spyOn(Stock, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Stock was trying to be found') {
      return jest.spyOn(Stock, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Stock, 'findByPk')
        .mockResolvedValue(setup.instance.stocks[0]);
    }
  }
};

scenario.update_stock = {
  pass: [
    {
      id: uuid(),
      description: 'Stock is updated',
      input: async () => ({
        stock_id: setup.instance.stocks[0].id,
        values: { stock: 34 }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Stock id param is malformed',
      input: async () => ({
        stock_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        values: { stock: 34 }
      })
    },
    {
      id: uuid(),
      description: 'Stock is not found',
      input: async () => ({
        stock_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        values: { stock: 34 }
      })
    },
    {
      id: uuid(),
      description: 'Stock was trying to be found',
      input: async () => ({
        stock_id: setup.instance.stocks[0].id,
        values: { stock: 34 }
      })
    },
    {
      id: uuid(),
      description: 'Stock was trying to be updated',
      input: async () => ({
        stock_id: setup.instance.stocks[0].id,
        values: { stock: 34 }
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Stock is not found' && is_mocked) {
      return jest.spyOn(Stock, 'findByPk').mockResolvedValue(null);
    }
    if (description === 'Stock was trying to be found') {
      return jest.spyOn(Stock, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Stock was trying to be updated') {
      return jest.spyOn(Stock, 'findByPk').mockResolvedValue({
        update: async payload => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Stock, 'findByPk').mockResolvedValue({
        update: async (payload, options) => Stock.build({
          ...setup.instance.stocks[0].dataValues,
          ...payload
        }, options)
      });
    }
  }
};

scenario.delete_stock = {
  pass: [
    {
      id: uuid(),
      description: 'Stock is deleted without options',
      input: async () => ({
        stock_id: setup.instance.stocks[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Stock is deleted using force option as true',
      input: async () => ({
        stock_id: setup.instance.stocks[0].id,
        query: { force: true }
      })
    },
    {
      id: uuid(),
      description: 'Stock is deleted using force option as false',
      input: async () => ({
        stock_id: setup.instance.stocks[0].id,
        query: { force: false }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Stock id param is malformed',
      input: async () => ({
        stock_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Stock is not found',
      input: async () => ({
        stock_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Stock was trying to be found',
      input: async () => ({
        stock_id: setup.instance.stocks[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Stock was trying to be removed',
      input: async () => ({
        stock_id: setup.instance.stocks[0].id,
        query: {}
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Stock is not found' && is_mocked) {
      return jest.spyOn(Stock, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Stock was trying to be found') {
      return jest.spyOn(Stock, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Stock was trying to be removed') {
      return jest.spyOn(Stock, 'findByPk').mockResolvedValue({
        destroy: async payload => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Stock, 'findByPk').mockResolvedValue({
        destroy: async payload => {
          if (payload.force) {
            return [];
          } else {
            setup.instance.stocks[0].deleted_at = new Date().toISOString();
            return setup.instance.stocks[0];
          }
        }
      });
    }
  }
};

module.exports.scenario = scenario;

module.exports.setup = setup;
