import uuid from 'uuid/v4';
import setup_factory from './index';
import db from 'src/db/models';

const is_mocked = JSON.parse(process.env.MOCK);
const setup = setup_factory(db, is_mocked, 'Item'), scenario = {};
const { Item } = db.sequelize.models;

scenario.get_items = {
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
      description: 'Action throw error',
      input: async () => ({ search: { name: { eq: 'model' } } })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Action throw error') {
      return jest.spyOn(Item, 'findAll')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Item, 'findAll')
        .mockResolvedValue([]);
    }
  }
};

scenario.create_items = {
  pass: [
    {
      id: uuid(),
      description: 'Values are sent as array',
      input: async () => ({ values: [{ name: 'aaaaa' }] })
    },
    {
      id: uuid(),
      description: 'Values are sent as object',
      input: async () => ({ values: { name: 'bbbbbb' } })
    },
    {
      id: uuid(),
      description: `Item is created by a specific user`,
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
      description: 'Values are sent as array but validation fail',
      input: async () => ({ values: [{ name: '' }] })
    },
    {
      id: uuid(),
      description: 'Values are sent as object but validation fail',
      input: async () => ({ values: { name: '' } })
    },
    {
      id: uuid(),
      description: 'Action throw error',
      input: async () => ({ values: { name: 'demo' } })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Action throw error') {
      return jest.spyOn(Item, 'createMany')
        .mockImplementation(new Error('error mocked.'));
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Item, 'createMany')
        .mockImplementation((values, options) => {
        if (Array.isArray(values)) {
          return values.reduce((initial, values) => {
            initial.push(Item.build(values, options));
            return initial;
          }, []);
        } else {
          return Item.build(values, options);
        }
      });
    }
  }
};

scenario.get_item = {
  pass: [
    {
      id: uuid(),
      description: 'Item is found',
      input: async () => ({ item_id: setup.instance.items[0].id })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Item id param is malformed',
      input: async () => ({
        item_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s'
      })
    },
    {
      id: uuid(),
      description: 'Item is not found',
      input: async () => ({
        item_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111'
      })
    },
    {
      id: uuid(),
      description: 'Item throw error when trying to be found',
      input: async () => ({
        item_id: setup.instance.items[0].id
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Item is not found' && is_mocked) {
      return jest.spyOn(Item, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Item throw error when trying to be found') {
      return jest.spyOn(Item, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Item, 'findByPk')
        .mockResolvedValue(setup.instance.items[0]);
    }
  }
};

scenario.update_item = {
  pass: [
    {
      id: uuid(),
      description: 'Item is updated',
      input: async () => ({
        item_id: setup.instance.items[0].id,
        values: { name: 'Item A' }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Item id param is malformed',
      input: async () => ({
        item_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        values: { name: 'Item A' }
      })
    },
    {
      id: uuid(),
      description: 'Item is not found',
      input: async () => ({
        item_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        values: { name: 'Item A' }
      })
    },
    {
      id: uuid(),
      description: 'Item was trying to be found',
      input: async () => ({
        item_id: setup.instance.items[0].id,
        values: { name: 'Item A' }
      })
    },
    {
      id: uuid(),
      description: 'Item was trying to be updated',
      input: async () => ({
        item_id: setup.instance.items[0].id,
        values: { name: 'Item A' }
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Item is not found' && is_mocked) {
      return jest.spyOn(Item, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Item was trying to be found') {
      return jest.spyOn(Item, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Item was trying to be updated') {
      return jest.spyOn(Item, 'findByPk').mockResolvedValue({
        update: async payload => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Item, 'findByPk').mockResolvedValue({
        update: async (values, options) => {
          return Item.build({
            ...setup.instance.items[0].dataValues,
            updated_at: new Date().toISOString()
          })
        }
      });
    }
  }
};

scenario.delete_item = {
  pass: [
    {
      id: uuid(),
      description: 'Item is deleted using force option as false',
      input: async () => ({
        item_id: setup.instance.items[0].id,
        query: { force: false }
      })
    },
    {
      id: uuid(),
      description: 'Item is deleted using force option as true',
      input: async () => ({
        item_id: setup.instance.items[0].id,
        query: { force: true }
      })
    },
    {
      id: uuid(),
      description: 'Item is deleted without options',
      input: async () => ({
        item_id: setup.instance.items[0].id,
        query: {}
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Item id param is malformed',
      input: async () => ({
        item_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Item is not found',
      input: async () => ({
        item_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Item was trying to be found',
      input: async () => ({
        item_id: setup.instance.items[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Item was trying to be deleted',
      input: async () => ({
        item_id: setup.instance.items[0].id,
        query: {}
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Item is not found' && is_mocked) {
      return jest.spyOn(Item, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Item was trying to be found') {
      return jest.spyOn(Item, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Item was trying to be deleted') {
      return jest.spyOn(Item, 'findByPk').mockResolvedValue({
        destroy: (options) => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Item, 'findByPk').mockResolvedValue({
        destroy: async (options) => {
          if (options.force) {
            return [];
          } else {
            const now = new Date().toISOString();
            setup.instance.items[0].deleted_at = now;
            setup.instance.items[0].updated_at = now;
            return setup.instance.items[0];
          }
        }
      });
    }
  }
};

scenario.get_stocks = {
  pass: [
    {
      id: uuid(),
      description: 'Stocks are found',
      input: async () => ({
        item_id: setup.instance.items[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Stocks has been found using entries=34',
      input: async () => ({
        item_id: setup.instance.items[0].id,
        query: {
          search: {
            entries: 34
          }
        }
      })
    },
    {
      id: uuid(),
      description: 'Stocks has been found using exits[gte]=50',
      input: async () => ({
        item_id: setup.instance.items[0].id,
        query: {
          search: {
            exits: {
              gte: 50
            }
          }
        }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Item param id is malformed',
      input: async () => ({
        item_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Item is not found',
      input: async () => ({
        item_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Item was trying to be found',
      input: async () => ({
        item_id: setup.instance.items[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Stocks were trying to be found',
      input: async () => ({
        item_id: setup.instance.items[0].id,
        query: {}
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Item is not found' && is_mocked) {
      return jest.spyOn(Item, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Item was trying to be found') {
      return jest.spyOn(Item, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Stocks were trying to be found') {
      return jest.spyOn(Item, 'findByPk').mockResolvedValue({
        getStocks: async payload => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Item, 'findByPk').mockResolvedValue({
        getStocks: async payload => payload
      });
    }
  }
};

scenario.set_stocks = {
  pass: [
    {
      id: uuid(),
      description: 'Stocks are added',
      input: async () => ({
        item_id: setup.instance.items[0].id,
        stocks: setup.instance.stocks.map(stock => stock.id)
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Item param id is malformed',
      input: async () => ({
        item_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        stocks: setup.instance.stocks.map(stock => stock.id)
      })
    },
    {
      id: uuid(),
      description: 'Item is not found',
      input: async () => ({
        item_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        stocks: setup.instance.stocks.map(stock => stock.id)
      })
    },
    {
      id: uuid(),
      description: 'Item was trying to be found',
      input: async () => ({
        item_id: setup.instance.items[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Stocks cannot be set',
      input: async () => ({
        item_id: setup.instance.items[0].id,
        stocks: setup.instance.stocks.map(stock => stock.id)
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Item is not found' && is_mocked) {
      return jest.spyOn(Item, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Item was trying to be found') {
      return jest.spyOn(Item, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Stocks cannot be set') {
      return jest.spyOn(Item, 'findByPk').mockResolvedValue({
        addStocks: async payload => {
          throw new Error('error mocked');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Item, 'findByPk').mockResolvedValue({
        addStocks: async payload => payload
      });
    }
  }
};

scenario.get_stock = {
  pass: [
    {
      id: uuid(),
      description: 'Stock is found',
      input: async () => ({
        item_id: setup.instance.items[0].id,
        stock_id: setup.instance.stocks[0].id
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Item id param is malformed',
      input: async () => ({
        item_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
        stock_id: setup.instance.stocks[0].id
      })
    },
    {
      id: uuid(),
      description: 'Stock id param is malformed',
      input: async () => ({
        item_id: setup.instance.items[0].id,
        stock_id: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefcaaaaaa'
      })
    },
    {
      id: uuid(),
      description: 'Item is not found',
      input: async () => ({
        item_id: 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d',
        stock_id: setup.instance.stocks[0].id
      })
    },
    {
      id: uuid(),
      description: 'Stock is not found',
      input: async () => ({
        item_id: setup.instance.items[0].id,
        stock_id: 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d'
      })
    },
    {
      id: uuid(),
      description: 'Item was trying to be found',
      input: async () => ({
        item_id: setup.instance.items[0].id,
        stock_id: setup.instance.stocks[0].id
      })
    },
    {
      id: uuid(),
      description: 'Stock was trying to be found',
      input: async () => ({
        item_id: setup.instance.items[0].id,
        stock_id: setup.instance.stocks[0].id
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Item is not found' && is_mocked) {
      return jest.spyOn(Item, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Stock is not found' && is_mocked) {
      return jest.spyOn(Item, 'findByPk').mockResolvedValue({
        getStocks: async payload => null
      });
    }
    if (description === 'Item was trying to be found') {
      return jest.spyOn(Item, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Stock was trying to be found') {
      return jest.spyOn(Item, 'findByPk').mockResolvedValue({
        getStocks: async payload => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Item, 'findByPk').mockResolvedValue({
        getStocks: async payload => setup.instance.stocks[0]
      });
    }
  }
};

module.exports.scenario = scenario;

module.exports.setup = setup;
