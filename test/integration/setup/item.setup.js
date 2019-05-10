import uuid from 'uuid/v4';
import setup_factory from './index';
import db from "src/db/models";
import { is } from '@playscode/fns';

const is_mocked = JSON.parse(process.env.MOCK);
const setup = setup_factory(db, is_mocked), scenario = {};
const { Item } = db.sequelize.models;

// ----------------------------------------------------------------------------

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
    },
  ],
  fail: [
    {
      id: uuid(),
      description: 'Query validation fail',
      input: async () => ({ search: null })
    },
    {
      id: uuid(),
      description: 'Item search throw error',
      input: async () => ({ search: { name: { eq: 'model' } } })
    },
  ],
  mock: async ({ input, fail, stage }) => {
    if (fail) {
      jest.spyOn(Item, 'findAll').mockRejectedValue(new Error('Mocked'));
    } else {
      jest.spyOn(Item, 'findAll').mockResolvedValue([]);
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
      input: async () => ({ values: { name: 'bbbbb' } })
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
      description: 'Values are sent but action fail',
      input: async () => ({ values: { name: 'demo' } })
    }
  ],
  mock: async ({ input, fail, stage }) => {
    if (fail && stage === 'Values are sent but action fail') {
      return jest.spyOn(Item, 'createMany')
        .mockImplementation(new Error('Item.create error mocked'));
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
      description: 'Item param id is invalid',
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
    },
  ],
  mock: async ({ input, fail, stage }) => {
    if (stage === 'Item is not found') {
      return jest
        .spyOn(Item, 'findByPk')
        .mockResolvedValue(null);
    }
    if (stage === 'Item throw error when trying to be found') {
      return jest
        .spyOn(Item, 'findByPk')
        .mockRejectedValue(new Error('Item.findByPk error mocked'));
    }
    if (!fail && is_mocked) {
      return jest
        .spyOn(Item, 'findByPk')
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
      description: 'Item param id is invalid',
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
  mock: async ({ input, fail, stage }) => {
    if (stage === 'Item is not found' && is_mocked) {
      return jest.spyOn(Item, 'findByPk').mockResolvedValue(null);
    }
    if (stage === 'Item was trying to be found') {
      return jest
        .spyOn(Item, 'findByPk')
        .mockRejectedValue(new Error('Item.findByPk error mocked'));
    }
    if (stage === 'Item was trying to be updated') {
      return jest.spyOn(Item, 'findByPk').mockResolvedValue({
        update: async payload => {
          throw new Error('Item.findByPk error mocked');
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
      description: 'Item param id is invalid',
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
    },
  ],
  mock: async ({ input, fail, stage }) => {
    if (stage === 'Item is not found' && is_mocked) {
      return jest
        .spyOn(Item, 'findByPk')
        .mockResolvedValue(null);
    }
    if (stage === 'Item was trying to be found') {
      return jest
        .spyOn(Item, 'findByPk')
        .mockRejectedValue(new Error('Item.findByPk error mocked'));
    }
    if (stage === 'Item was trying to be deleted') {
      return jest.spyOn(Item, 'findByPk').mockResolvedValue({
        destroy: (options) => Promise.reject(new Error('destroy error mocked'))
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

// ----------------------------------------------------------------------------

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
    },
  ],
  fail: [
    {
      id: uuid(),
      description: 'Item id is invalid',
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
    },
  ],
  mock: async ({ input, fail, stage }) => {
    if (stage === 'Item is not found') {
      return jest.spyOn(Item, 'findByPk').mockResolvedValue(null);
    }
    if (stage === 'Item was trying to be found') {
      return jest.spyOn(Item, 'findByPk')
        .mockImplementation(async (id, options) => {
          throw new Error('Item.findByPk error mocked');
        });
    }
    if (stage === 'Stocks were trying to be found') {
      return jest.spyOn(Item, 'findByPk').mockResolvedValue({
        getStocks: async payload => {
          throw new Error('Item.findByPk error mocked');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Item, 'findByPk').mockResolvedValue({
        getStocks: async payload => ({ success : 'mocked' })
      });
    }
  }
};

scenario.set_stocks = {
  pass: [
    {
      id: uuid(),
      description: "Stocks are added",
      input: async () => ({
        item_id: setup.instance.items[0].id,
        stocks: setup.instance.stocks.map(stock => stock.id)
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Item param id validation fail',
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
      description: "Stocks cannot be set",
      input: async () => ({
        item_id: setup.instance.items[0].id,
        stocks: setup.instance.stocks.map(stock => stock.id)
      })
    },
  ],
  mock: async ({ input, fail, stage }) => {
    if (stage === 'Item is not found' && is_mocked) {
      return jest.spyOn(Item, 'findByPk').mockResolvedValue(null);
    }
    if (stage === 'Item was trying to be found') {
      return jest.spyOn(Item, 'findByPk')
        .mockImplementation(async (id, options) => {
          throw new Error('Item.findByPk error mocked');
        });
    }
    if (stage === 'Stocks cannot be set') {
      return jest.spyOn(Item, 'findByPk').mockResolvedValue({
        addStocks: payload => Promise.reject(new Error('Mock Error'))
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Item, 'findByPk').mockResolvedValue({
        addStocks: async payload => ({ success : 'mocked' })
      });
    }
  }
};

scenario.get_stock = {
  pass: [
    {
      id: uuid(),
      description: "Stock is found",
      input: async () => ({
        item_id: setup.instance.items[0].id,
        stock_id: setup.instance.stocks[0].id
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Item id param is invalid',
      input: async () => ({
        item_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
        stock_id: setup.instance.stocks[0].id
      })
    },
    {
      id: uuid(),
      description: 'Stock id param is invalid',
      input: async () => ({
        item_id: setup.instance.items[0].id,
        stock_id: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefcaaaaaa'
      })
    },
    {
      id: uuid(),
      description: 'Item is not found',
      input: async () => ({
        item_id: setup.instance.items[0].id,
        stock_id: setup.instance.stocks[0].id
      })
    },
    {
      id: uuid(),
      description: 'Stock is not found',
      input: async () => ({
        item_id: setup.instance.items[0].id,
        stock_id: setup.instance.stocks[0].id
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
    },
  ],
  mock: async ({ input, fail, stage }) => {
    if (stage === 'Item is not found' && is_mocked) {
      return jest.spyOn(Item, 'findByPk').mockResolvedValue(null);
    }
    if (stage === 'Stock is not found' && is_mocked) {
      return jest.spyOn(Item, 'findByPk').mockResolvedValue({
        getStocks: payload => Promise.resolve(null)
      });
    }
    if (stage === 'Item was trying to be found') {
      return jest.spyOn(Item, 'findByPk')
        .mockRejectedValue(new Error('Item.findByPk error mocked'));
    }
    if (stage === 'Stock was trying to be found') {
      return jest.spyOn(Item, 'findByPk').mockResolvedValue({
        getStocks: async payload => {
          throw new Error('Item.findByPk error mocked');
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

// ----------------------------------------------------------------------------

module.exports.scenario = scenario;

module.exports.setup = setup;
