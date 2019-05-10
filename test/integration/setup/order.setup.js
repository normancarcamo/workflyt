import uuid from 'uuid/v4';
import setup_factory from './index';
import db from "src/db/models";
import { is } from '@playscode/fns';

const is_mocked = JSON.parse(process.env.MOCK);
const setup = setup_factory(db, is_mocked), scenario = {};
const { Order } = db.sequelize.models;

// ----------------------------------------------------------------------------

scenario.get_orders = {
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
      description: "query sent is: { search: { code: 'ccccc' } }",
      input: async () => ({ search: { code: 'ccccc' } })
    },
    {
      id: uuid(),
      description: "query sent is: { search: { code: { like: '%vvvvv%' } } }",
      input: async () => ({ search: { code: { like: '%vvvvv%' } } })
    },
  ],
  fail: [
    {
      id: uuid(),
      description: 'Order query validation fails',
      input: async () => ({ search: null })
    },
    {
      id: uuid(),
      description: 'Order query throws error',
      input: async () => ({ search: { code: { eq: 'model' } } })
    },
  ],
  mock: async ({ input, fail, stage }) => {
    if (fail) {
      return jest.spyOn(Order, 'findAll')
        .mockRejectedValue(new Error('Order query error mocked'));
    } else {
      return jest.spyOn(Order, 'findAll')
        .mockResolvedValue([]);
    }
  }
};

scenario.create_orders = {
  pass: [
    {
      id: uuid(),
      description: 'Values has been sent using an array',
      input: async () => ({
        values: [{
          quote_id: setup.instance.quotes[0].id,
          type: 'work',
          status: 'working'
        }]
      })
    },
    {
      id: uuid(),
      description: 'Values has been sent using an object',
      input: async () => ({
        values: {
          quote_id: setup.instance.quotes[0].id,
          type: 'work',
          status: 'working'
        }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Order validation fail using values with array',
      input: async () => ({
        values: [{
          quote_id: setup.instance.quotes[0].id,
          code: 'ed'
        }]
      })
    },
    {
      id: uuid(),
      description: 'Order validation fail using values with object',
      input: async () => ({
        values: {
          quote_id: setup.instance.quotes[0].id,
          code: 'ed'
        }
      })
    },
    {
      id: uuid(),
      description: 'Order create throws error',
      input: async () => ({
        values: {
          quote_id: setup.instance.quotes[0].id,
          type: 'work',
          status: 'working'
        }
      })
    }
  ],
  mock: async ({ input, fail, stage }) => {
    if (fail && stage === 'Order create throws error') {
      return jest.spyOn(Order, 'createMany')
        .mockRejectedValue(new Error('Order create error mocked'));
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Order, 'createMany')
        .mockImplementation(async (values, options) => {
        if (Array.isArray(values)) {
          return values.reduce((initial, values, index) => {
            initial.push(Order.build(values, options));
            return initial;
          }, []);
        } else {
          return Order.build({ code: 'ORI-19/000081', ...values });
        }
      });
    }
  }
};

scenario.get_order = {
  pass: [
    {
      id: uuid(),
      description: 'order is found',
      input: async () => ({ order_id: setup.instance.orders[0].id })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Order param id validation fails',
      input: async () => ({
        order_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s'
      })
    },
    {
      id: uuid(),
      description: 'Order was not found',
      input: async () => ({
        order_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111'
      })
    },
    {
      id: uuid(),
      description: 'Order retrieval throws error',
      input: async () => ({ order_id: setup.instance.orders[0].id })
    }
  ],
  mock: async ({ input, fail, stage }) => {
    if (fail && stage === 'Order was not found') {
      return jest.spyOn(Order, 'findByPk')
        .mockResolvedValue(null);
    }
    if (fail && stage === 'Order retrieval throws error') {
      return jest.spyOn(Order, 'findByPk')
        .mockRejectedValue(new Error('Order error mocked'));
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Order, 'findByPk')
        .mockResolvedValue(setup.instance.orders[0]);
    }
  }
};

scenario.update_order = {
  pass: [
    {
      id: uuid(),
      description: 'Order was updated',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        values: { status: 'cancelled' }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Order param id validation fail',
      input: async () => ({
        order_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        values: { status: 'cancelled' }
      })
    },
    {
      id: uuid(),
      description: 'Order was not found',
      input: async () => ({
        order_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        values: { status: 'cancelled' }
      })
    },
    {
      id: uuid(),
      description: 'Order throw error during retrieve',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        values: { status: 'cancelled' }
      })
    },
    {
      id: uuid(),
      description: 'Order throw error during update',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        values: { status: 'cancelled' }
      })
    },
  ],
  mock: async ({ input, fail, stage }) => {
    if (fail && stage === 'Order was not found') {
      return jest.spyOn(Order, 'findByPk')
        .mockResolvedValue(null);
    }
    if (fail && stage === 'Order throw error during retrieve') {
      return jest.spyOn(Order, 'findByPk')
        .mockRejectedValue(new Error('Order error mocked'));
    }
    if (fail && stage === 'Order throw error during update') {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        update: async (values, options) => {
          throw new Error('Order error mocked');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        update: async (values, option) => ({
          ...setup.instance.orders[0].dataValues,
          ...values,
          updated_at: '2019-01-06T06:33:36.709Z'
        })
      });
    }
  }
};

scenario.delete_order = {
  pass: [
    {
      id: uuid(),
      description: 'Order is deleted',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Order is deleted using force option as false',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        query: { force: false }
      })
    },
    {
      id: uuid(),
      description: 'order is deleted using force option as true',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        query: { force: true }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Order param id validation fail',
      input: async () => ({
        order_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Order is not found',
      input: async () => ({
        order_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Order is trying to be found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Order is trying to be deleted',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        query: {}
      })
    }
  ],
  mock: async ({ input, fail, stage }) => {
    if (fail && stage === 'Order is not found') {
      return jest.spyOn(Order, 'findByPk')
        .mockResolvedValue(null);
    }
    if (fail && stage === 'Order is trying to be found') {
      return jest.spyOn(Order, 'findByPk')
        .mockRejectedValue(new Error('Order error mocked'));
    }
    if (fail && stage === 'Order is trying to be deleted') {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        destroy: async (options) => {
          throw new Error('Order error mocked');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        destroy: async (options) => {
          if (options.force) {
            return [];
          } else {
            const now = new Date().toISOString();
            setup.instance.orders[0].updated_at = now;
            setup.instance.orders[0].deleted_at = now;
            return setup.instance.orders[0];
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
        order_id: setup.instance.orders[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: "Query is: name='dknd'",
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        query: { search: { name: 'dknd' } }
      })
    },
    {
      id: uuid(),
      description: "Query is: name like %disk%",
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        query: { search: { name: { like: '%disk%' } } }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Order param id validation fail',
      input: async () => ({
        order_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Order is not found',
      input: async () => ({
        order_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Order was trying to be found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Items were trying to be found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        query: {}
      })
    }
  ],
  mock: async ({ input, fail, stage }) => {
    if (fail && stage === 'Order is not found') {
      return jest.spyOn(Order, 'findByPk')
        .mockResolvedValue(null);
    }
    if (fail && stage === 'Order was trying to be found') {
      return jest.spyOn(Order, 'findByPk')
        .mockRejectedValue(new Error('Order error mocked'));
    }
    if (fail && stage === 'Items were trying to be found') {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getItems: async (options) => {
          throw new Error('Order.getItems error mocked');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
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
        order_id: setup.instance.orders[0].id,
        items: setup.instance.items.map(item => item.id)
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Order param id validation fail',
      input: async () => ({
        order_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        items: setup.instance.items.map(item => item.id)
      })
    },
    {
      id: uuid(),
      description: 'Items ids validation fail',
      input: async () => ({
        order_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        items: [
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s'
        ]
      })
    },
    {
      id: uuid(),
      description: 'Order is not found',
      input: async () => ({
        order_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        items: setup.instance.items.map(item => item.id)
      })
    },
    {
      id: uuid(),
      description: 'Order was trying to be found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: "Items cannot be set",
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        items: setup.instance.items.map(item => item.id)
      })
    },
  ],
  mock: async ({ input, fail, stage }) => {
    if (fail && stage === 'Order is not found') {
      return jest.spyOn(Order, 'findByPk')
        .mockResolvedValue(null);
    }
    if (fail && stage === 'Order was trying to be found') {
      return jest.spyOn(Order, 'findByPk')
        .mockRejectedValue(new Error('Order error mocked'));
    }
    if (fail && stage === 'Items cannot be set') {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        addItems: async (items) => {
          throw new Error('Order.addItems error mocked');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
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
        order_id: setup.instance.orders[0].id,
        item_id: setup.instance.items[0].id
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Order param id is invalid',
      input: async () => ({
        order_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
        item_id: setup.instance.items[0].id
      })
    },
    {
      id: uuid(),
      description: 'Item param id is invalid',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        item_id: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefcaaaaaa'
      })
    },
    {
      id: uuid(),
      description: 'Order is not found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        item_id: setup.instance.items[0].id
      })
    },
    {
      id: uuid(),
      description: 'Item is not found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        item_id: setup.instance.items[0].id
      })
    },
    {
      id: uuid(),
      description: 'Order was trying to be found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        item_id: setup.instance.items[0].id
      })
    },
    {
      id: uuid(),
      description: 'Item was trying to be found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        item_id: setup.instance.items[0].id
      })
    }
  ],
  mock: async ({ input, fail, stage }) => {
    if (fail && stage === 'Order is not found') {
      return jest.spyOn(Order, 'findByPk')
        .mockResolvedValue(null);
    }
    if (fail && stage === 'Item is not found') {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getItems: async (options) => null
      });
    }
    if (fail && stage === 'Order was trying to be found') {
      return jest.spyOn(Order, 'findByPk')
        .mockRejectedValue(new Error('Order.findByPk error mocked'));
    }
    if (fail && stage === 'Item was trying to be found') {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getItems: async (options) => {
          throw new Error('Order.getItems error mocked');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
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
        order_id: setup.instance.orders[0].id,
        item_id: setup.instance.items[0].id,
        values: { extra: { units: 20 } }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Order param id is invalid',
      input: async () => ({
        order_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
        item_id: setup.instance.items[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Item param id is invalid',
      input: async () => {
        return {
          order_id: setup.instance.orders[0].id,
          item_id: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefcaaaaaa',
          values: { extra: { units: 20 } }
        }
      }
    },
    {
      id: uuid(),
      description: 'Order is not found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        item_id: setup.instance.items[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Item is not found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        item_id: setup.instance.items[0].id,
        values: { extra: { units: 21 } }
      })
    },
    {
      id: uuid(),
      description: 'Order was trying to be found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        item_id: setup.instance.items[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Item was trying to be found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        item_id: setup.instance.items[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Item was trying to be updated',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        item_id: setup.instance.items[0].id,
        values: { extra: { units: 20 } }
      })
    }
  ],
  mock: async ({ input, fail, stage }) => {
    if (fail && stage === 'Order is not found') {
      return jest.spyOn(Order, 'findByPk')
        .mockResolvedValue(null);
    }
    if (fail && stage === 'Item is not found') {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getItems: async (options) => null
      });
    }
    if (fail && stage === 'Order was trying to be found') {
      return jest.spyOn(Order, 'findByPk')
        .mockRejectedValue(new Error('Order.findByPk error mocked'));
    }
    if (fail && stage === 'Item was trying to be found') {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getItems: async (options) => {
          throw new Error('Order.getItems error mocked');
        }
      });
    }
    if (fail && stage === 'Item was trying to be updated') {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getItems: async (options) => ({}),
        addItem: async (uuid, options) => {
          throw new Error('req.order.addItem error mocked');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
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
        let order = setup.instance.orders[0];
        let item = setup.instance.items[0];
        return {
          order_id: order.id,
          item_id: item.id
        }
      }
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Order param id is invalid',
      input: async () => ({
        order_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
        item_id: setup.instance.items[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Item param id is invalid',
      input: async () => {
        return {
          order_id: setup.instance.orders[0].id,
          item_id: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefcaaaaaa',
          values: { extra: { units: 20 } }
        }
      }
    },
    {
      id: uuid(),
      description: 'Order is not found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        item_id: setup.instance.items[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Item is not found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        item_id: setup.instance.items[0].id,
        values: { extra: { units: 21 } }
      })
    },
    {
      id: uuid(),
      description: 'Order was trying to be found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        item_id: setup.instance.items[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Item was trying to be found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        item_id: setup.instance.items[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Item was trying to be removed',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        item_id: setup.instance.items[0].id,
        values: { extra: { units: 20 } }
      })
    }
  ],
  mock: async ({ input, fail, stage }) => {
    if (fail && stage === 'Order is not found') {
      return jest.spyOn(Order, 'findByPk')
        .mockResolvedValue(null);
    }
    if (fail && stage === 'Item is not found') {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getItems: async (options) => null
      });
    }
    if (fail && stage === 'Order was trying to be found') {
      return jest.spyOn(Order, 'findByPk')
        .mockRejectedValue(new Error('Order.findByPk error mocked'));
    }
    if (fail && stage === 'Item was trying to be found') {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getItems: async (options) => {
          throw new Error('Order.getItems error mocked');
        }
      });
    }
    if (fail && stage === 'Item was trying to be removed') {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getItems: async (options) => ({}),
        removeItem: async (uuid, options) => {
          throw new Error('req.order.removeItem error mocked');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getItems: (payload, options) => Promise.resolve({}),
        removeItem: async (payload, options) => setup.instance.items[0]
      });
    }
  }
};

// ----------------------------------------------------------------------------

scenario.get_departments = {
  pass: [
    {
      id: uuid(),
      description: "Query is: empty",
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: "Query is: name='dknd'",
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        query: { search: { name: 'dknd' } }
      })
    },
    {
      id: uuid(),
      description: "Query is: name like %disk%",
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        query: { search: { name: { like: '%disk%' } } }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Order param id validation fail',
      input: async () => ({
        order_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Order is not found',
      input: async () => ({
        order_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Order was trying to be found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Departments were trying to be found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        query: {}
      })
    }
  ],
  mock: async ({ input, fail, stage }) => {
    if (fail && stage === 'Order is not found') {
      return jest.spyOn(Order, 'findByPk')
        .mockResolvedValue(null);
    }
    if (fail && stage === 'Order was trying to be found') {
      return jest.spyOn(Order, 'findByPk')
        .mockRejectedValue(new Error('Order error mocked'));
    }
    if (fail && stage === 'Departments were trying to be found') {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getDepartments: async (options) => {
          throw new Error('Order.getDepartments error mocked');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getDepartments: async payload => setup.instance.departments
      });
    }
  }
};

scenario.set_departments = {
  pass: [
    {
      id: uuid(),
      description: "Departments are set",
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        departments: setup.instance.departments.map(department => department.id)
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Order param id validation fail',
      input: async () => ({
        order_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        departments: setup.instance.departments.map(department => department.id)
      })
    },
    {
      id: uuid(),
      description: 'Departments ids validation fail',
      input: async () => ({
        order_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        departments: [
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s'
        ]
      })
    },
    {
      id: uuid(),
      description: 'Order is not found',
      input: async () => ({
        order_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        departments: setup.instance.departments.map(department => department.id)
      })
    },
    {
      id: uuid(),
      description: 'Order was trying to be found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: "Departments cannot be set",
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        departments: setup.instance.departments.map(department => department.id)
      })
    },
  ],
  mock: async ({ input, fail, stage }) => {
    if (fail && stage === 'Order is not found') {
      return jest.spyOn(Order, 'findByPk')
        .mockResolvedValue(null);
    }
    if (fail && stage === 'Order was trying to be found') {
      return jest.spyOn(Order, 'findByPk')
        .mockRejectedValue(new Error('Order error mocked'));
    }
    if (fail && stage === 'Departments cannot be set') {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        addDepartments: async (departments) => {
          throw new Error('Order.addDepartments error mocked');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        addDepartments: async payload => []
      });
    }
  }
};

scenario.get_department = {
  pass: [
    {
      id: uuid(),
      description: "Department is found",
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        department_id: setup.instance.departments[0].id
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Order param id is invalid',
      input: async () => ({
        order_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
        department_id: setup.instance.departments[0].id
      })
    },
    {
      id: uuid(),
      description: 'Department param id is invalid',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        department_id: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefcaaaaaa'
      })
    },
    {
      id: uuid(),
      description: 'Order is not found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        department_id: setup.instance.departments[0].id
      })
    },
    {
      id: uuid(),
      description: 'Department is not found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        department_id: setup.instance.departments[0].id
      })
    },
    {
      id: uuid(),
      description: 'Order was trying to be found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        department_id: setup.instance.departments[0].id
      })
    },
    {
      id: uuid(),
      description: 'Department was trying to be found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        department_id: setup.instance.departments[0].id
      })
    }
  ],
  mock: async ({ input, fail, stage }) => {
    if (fail && stage === 'Order is not found') {
      return jest.spyOn(Order, 'findByPk')
        .mockResolvedValue(null);
    }
    if (fail && stage === 'Department is not found') {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getDepartments: async (options) => null
      });
    }
    if (fail && stage === 'Order was trying to be found') {
      return jest.spyOn(Order, 'findByPk')
        .mockRejectedValue(new Error('Order.findByPk error mocked'));
    }
    if (fail && stage === 'Department was trying to be found') {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getDepartments: async (options) => {
          throw new Error('Order.getDepartments error mocked');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getDepartments: async (options) => setup.instance.departments[0]
      });
    }
  }
};

scenario.update_department = {
  pass: [
    {
      id: uuid(),
      description: "Department is found",
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        department_id: setup.instance.departments[0].id,
        values: { extra: { units: 20 } }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Order param id is invalid',
      input: async () => ({
        order_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
        department_id: setup.instance.departments[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Department param id is invalid',
      input: async () => {
        return {
          order_id: setup.instance.orders[0].id,
          department_id: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefcaaaaaa',
          values: { extra: { units: 20 } }
        }
      }
    },
    {
      id: uuid(),
      description: 'Order is not found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        department_id: setup.instance.departments[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Department is not found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        department_id: setup.instance.departments[0].id,
        values: { extra: { units: 21 } }
      })
    },
    {
      id: uuid(),
      description: 'Order was trying to be found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        department_id: setup.instance.departments[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Department was trying to be found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        department_id: setup.instance.departments[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Department was trying to be updated',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        department_id: setup.instance.departments[0].id,
        values: { extra: { units: 20 } }
      })
    }
  ],
  mock: async ({ input, fail, stage }) => {
    if (fail && stage === 'Order is not found') {
      return jest.spyOn(Order, 'findByPk')
        .mockResolvedValue(null);
    }
    if (fail && stage === 'Department is not found') {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getDepartments: async (options) => null
      });
    }
    if (fail && stage === 'Order was trying to be found') {
      return jest.spyOn(Order, 'findByPk')
        .mockRejectedValue(new Error('Order.findByPk error mocked'));
    }
    if (fail && stage === 'Department was trying to be found') {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getDepartments: async (options) => {
          throw new Error('Order.getDepartments error mocked');
        }
      });
    }
    if (fail && stage === 'Department was trying to be updated') {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getDepartments: async (options) => ({}),
        addDepartment: async (uuid, options) => {
          throw new Error('req.order.addDepartment error mocked');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getDepartments: async (options) => ({ mocked: "yes" }),
        addDepartment: async (values, options) => setup.instance.departments[0]
      });
    }
  }
};

scenario.remove_department = {
  pass: [
    {
      id: uuid(),
      description: "Department is found",
      input: async () => {
        let order = setup.instance.orders[0];
        let department = setup.instance.departments[0];
        return {
          order_id: order.id,
          department_id: department.id
        }
      }
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Order param id is invalid',
      input: async () => ({
        order_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
        department_id: setup.instance.departments[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Department param id is invalid',
      input: async () => {
        return {
          order_id: setup.instance.orders[0].id,
          department_id: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefcaaaaaa',
          values: { extra: { units: 20 } }
        }
      }
    },
    {
      id: uuid(),
      description: 'Order is not found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        department_id: setup.instance.departments[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Department is not found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        department_id: setup.instance.departments[0].id,
        values: { extra: { units: 21 } }
      })
    },
    {
      id: uuid(),
      description: 'Order was trying to be found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        department_id: setup.instance.departments[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Department was trying to be found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        department_id: setup.instance.departments[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Department was trying to be removed',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        department_id: setup.instance.departments[0].id,
        values: { extra: { units: 20 } }
      })
    }
  ],
  mock: async ({ input, fail, stage }) => {
    if (fail && stage === 'Order is not found') {
      return jest.spyOn(Order, 'findByPk')
        .mockResolvedValue(null);
    }
    if (fail && stage === 'Department is not found') {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getDepartments: async (options) => null
      });
    }
    if (fail && stage === 'Order was trying to be found') {
      return jest.spyOn(Order, 'findByPk')
        .mockRejectedValue(new Error('Order.findByPk error mocked'));
    }
    if (fail && stage === 'Department was trying to be found') {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getDepartments: async (options) => {
          throw new Error('Order.getDepartments error mocked');
        }
      });
    }
    if (fail && stage === 'Department was trying to be removed') {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getDepartments: async (options) => ({}),
        removeDepartment: async (uuid, options) => {
          throw new Error('req.order.removeDepartment error mocked');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getDepartments: (payload, options) => Promise.resolve({}),
        removeDepartment: async (payload, options) => setup.instance.departments[0]
      });
    }
  }
};

// ----------------------------------------------------------------------------

scenario.get_employees = {
  pass: [
    {
      id: uuid(),
      description: "Query is: empty",
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: "Query is: firstname='dknd'",
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        query: { search: { firstname: 'dknd' } }
      })
    },
    {
      id: uuid(),
      description: "Query is: firstname like %disk%",
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        query: { search: { firstname: { like: '%disk%' } } }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Order param id validation fail',
      input: async () => ({
        order_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Order is not found',
      input: async () => ({
        order_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Order was trying to be found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Employees were trying to be found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        query: {}
      })
    }
  ],
  mock: async ({ input, fail, stage }) => {
    if (fail && stage === 'Order is not found') {
      return jest.spyOn(Order, 'findByPk')
        .mockResolvedValue(null);
    }
    if (fail && stage === 'Order was trying to be found') {
      return jest.spyOn(Order, 'findByPk')
        .mockRejectedValue(new Error('Order error mocked'));
    }
    if (fail && stage === 'Employees were trying to be found') {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getEmployees: async (options) => {
          throw new Error('Order.getEmployees error mocked');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getEmployees: async payload => setup.instance.employees
      });
    }
  }
};

scenario.set_employees = {
  pass: [
    {
      id: uuid(),
      description: "Employees are set",
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        employees: setup.instance.employees.map(employee => employee.id)
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Order param id validation fail',
      input: async () => ({
        order_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        employees: setup.instance.employees.map(employee => employee.id)
      })
    },
    {
      id: uuid(),
      description: 'Employees ids validation fail',
      input: async () => ({
        order_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        employees: [
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s'
        ]
      })
    },
    {
      id: uuid(),
      description: 'Order is not found',
      input: async () => ({
        order_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        employees: setup.instance.employees.map(employee => employee.id)
      })
    },
    {
      id: uuid(),
      description: 'Order was trying to be found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        employees: [
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc222',
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc222'
        ]
      })
    },
    {
      id: uuid(),
      description: "Employees cannot be set",
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        employees: setup.instance.employees.map(employee => employee.id)
      })
    },
  ],
  mock: async ({ input, fail, stage }) => {
    if (stage === 'Order is not found' && is_mocked) {
      return jest.spyOn(Order, 'findByPk')
        .mockResolvedValue(null);
    }
    if (stage === 'Order was trying to be found') {
      return jest.spyOn(Order, 'findByPk')
        .mockRejectedValue(new Error('Order error mocked'));
    }
    if (stage === 'Employees cannot be set') {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        addEmployees: async (employees) => {
          throw new Error('Order.addEmployees error mocked');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        addEmployees: async payload => []
      });
    }
  }
};

scenario.get_employee = {
  pass: [
    {
      id: uuid(),
      description: "Employee is found",
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        employee_id: setup.instance.employees[0].id
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Order param id is invalid',
      input: async () => ({
        order_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
        employee_id: setup.instance.employees[0].id
      })
    },
    {
      id: uuid(),
      description: 'Employee param id is invalid',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        employee_id: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefcaaaaaa'
      })
    },
    {
      id: uuid(),
      description: 'Order is not found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        employee_id: setup.instance.employees[0].id
      })
    },
    {
      id: uuid(),
      description: 'Employee is not found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        employee_id: setup.instance.employees[0].id
      })
    },
    {
      id: uuid(),
      description: 'Order was trying to be found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        employee_id: setup.instance.employees[0].id
      })
    },
    {
      id: uuid(),
      description: 'Employee was trying to be found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        employee_id: setup.instance.employees[0].id
      })
    }
  ],
  mock: async ({ input, fail, stage }) => {
    if (fail && stage === 'Order is not found') {
      return jest.spyOn(Order, 'findByPk')
        .mockResolvedValue(null);
    }
    if (fail && stage === 'Employee is not found') {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getEmployees: async (options) => null
      });
    }
    if (fail && stage === 'Order was trying to be found') {
      return jest.spyOn(Order, 'findByPk')
        .mockRejectedValue(new Error('Order.findByPk error mocked'));
    }
    if (fail && stage === 'Employee was trying to be found') {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getEmployees: async (options) => {
          throw new Error('Order.getEmployees error mocked');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getEmployees: async (options) => setup.instance.employees[0]
      });
    }
  }
};

scenario.update_employee = {
  pass: [
    {
      id: uuid(),
      description: "Employee is found",
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        employee_id: setup.instance.employees[0].id,
        values: { extra: { units: 20 } }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Order param id is invalid',
      input: async () => ({
        order_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
        employee_id: setup.instance.employees[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Employee param id is invalid',
      input: async () => {
        return {
          order_id: setup.instance.orders[0].id,
          employee_id: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefcaaaaaa',
          values: { extra: { units: 20 } }
        }
      }
    },
    {
      id: uuid(),
      description: 'Order is not found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        employee_id: setup.instance.employees[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Employee is not found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        employee_id: setup.instance.employees[0].id,
        values: { extra: { units: 21 } }
      })
    },
    {
      id: uuid(),
      description: 'Order was trying to be found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        employee_id: setup.instance.employees[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Employee was trying to be found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        employee_id: setup.instance.employees[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Employee was trying to be updated',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        employee_id: setup.instance.employees[0].id,
        values: { extra: { units: 20 } }
      })
    }
  ],
  mock: async ({ input, fail, stage }) => {
    if (fail && stage === 'Order is not found') {
      return jest.spyOn(Order, 'findByPk')
        .mockResolvedValue(null);
    }
    if (fail && stage === 'Employee is not found') {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getEmployees: async (options) => null
      });
    }
    if (fail && stage === 'Order was trying to be found') {
      return jest.spyOn(Order, 'findByPk')
        .mockRejectedValue(new Error('Order.findByPk error mocked'));
    }
    if (fail && stage === 'Employee was trying to be found') {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getEmployees: async (options) => {
          throw new Error('Order.getEmployees error mocked');
        }
      });
    }
    if (fail && stage === 'Employee was trying to be updated') {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getEmployees: async (options) => ({}),
        addEmployee: async (uuid, options) => {
          throw new Error('req.order.addEmployee error mocked');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getEmployees: async (options) => ({ mocked: "yes" }),
        addEmployee: async (values, options) => setup.instance.employees[0]
      });
    }
  }
};

scenario.remove_employee = {
  pass: [
    {
      id: uuid(),
      description: "Employee is found",
      input: async () => {
        let order = setup.instance.orders[0];
        let employee = setup.instance.employees[0];
        return {
          order_id: order.id,
          employee_id: employee.id
        }
      }
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Order param id is invalid',
      input: async () => ({
        order_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
        employee_id: setup.instance.employees[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Employee param id is invalid',
      input: async () => {
        return {
          order_id: setup.instance.orders[0].id,
          employee_id: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefcaaaaaa',
          values: { extra: { units: 20 } }
        }
      }
    },
    {
      id: uuid(),
      description: 'Order is not found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        employee_id: setup.instance.employees[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Employee is not found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        employee_id: setup.instance.employees[0].id,
        values: { extra: { units: 21 } }
      })
    },
    {
      id: uuid(),
      description: 'Order was trying to be found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        employee_id: setup.instance.employees[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Employee was trying to be found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        employee_id: setup.instance.employees[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Employee was trying to be removed',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        employee_id: setup.instance.employees[0].id,
        values: { extra: { units: 20 } }
      })
    }
  ],
  mock: async ({ input, fail, stage }) => {
    if (fail && stage === 'Order is not found') {
      return jest.spyOn(Order, 'findByPk')
        .mockResolvedValue(null);
    }
    if (fail && stage === 'Employee is not found') {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getEmployees: async (options) => null
      });
    }
    if (fail && stage === 'Order was trying to be found') {
      return jest.spyOn(Order, 'findByPk')
        .mockRejectedValue(new Error('Order.findByPk error mocked'));
    }
    if (fail && stage === 'Employee was trying to be found') {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getEmployees: async (options) => {
          throw new Error('Order.getEmployees error mocked');
        }
      });
    }
    if (fail && stage === 'Employee was trying to be removed') {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getEmployees: async (options) => ({}),
        removeEmployee: async (uuid, options) => {
          throw new Error('req.order.removeEmployee error mocked');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getEmployees: (payload, options) => Promise.resolve({}),
        removeEmployee: async (payload, options) => setup.instance.employees[0]
      });
    }
  }
};

// ----------------------------------------------------------------------------

module.exports.scenario = scenario;

module.exports.setup = setup;
