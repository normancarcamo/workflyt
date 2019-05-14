import uuid from 'uuid/v4';
import setup_factory from './index';
import db from 'src/db/models';

const is_mocked = JSON.parse(process.env.MOCK);
const setup = setup_factory(db, is_mocked, 'Order'), scenario = {};
const { Order } = db.sequelize.models;

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
      description: 'query sent is: { search: { code: "ccccc" } }',
      input: async () => ({ search: { code: 'ccccc' } })
    },
    {
      id: uuid(),
      description: 'query sent is: { search: { code: { like: "%vvvvv%" } } }',
      input: async () => ({ search: { code: { like: '%vvvvv%' } } })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Order query validation fails',
      input: async () => ({ search: null })
    },
    {
      id: uuid(),
      description: 'Action throw error',
      input: async () => ({ search: { code: { eq: 'model' } } })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Action throw error') {
      return jest.spyOn(Order, 'findAll')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (!fail && is_mocked) {
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
    },
    {
      id: uuid(),
      description: `Order is created by a specific user`,
      input: async () => ({
        values: {
          quote_id: setup.instance.quotes[0].id,
          type: 'work',
          status: 'working',
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
      description: 'Order validation fail using values with array',
      input: async () => ({
        values: [{
          quote_id: 'kfkdnfkdfnkdfnkdfnkdfnkdfndkfnkdfn',
          code: 'ed'
        }]
      })
    },
    {
      id: uuid(),
      description: 'Order validation fail using values with object',
      input: async () => ({
        values: {
          quote_id: 'kfkdnfkdfnkdfnkdfnkdfnkdfndkfnkdfn',
          code: 'ed'
        }
      })
    },
    {
      id: uuid(),
      description: 'Action throw error',
      input: async () => ({
        values: {
          quote_id: setup.instance.quotes[0].id,
          type: 'work',
          status: 'working'
        }
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Action throw error') {
      return jest.spyOn(Order, 'createMany')
        .mockRejectedValue(new Error('error mocked.'));
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
          return Order.build(values, options);
        }
      });
    }
  }
};

scenario.get_order = {
  pass: [
    {
      id: uuid(),
      description: 'Order is found',
      input: async () => ({ order_id: setup.instance.orders[0].id })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Order param id is malformed',
      input: async () => ({
        order_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s'
      })
    },
    {
      id: uuid(),
      description: 'Order is not found',
      input: async () => ({
        order_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111'
      })
    },
    {
      id: uuid(),
      description: 'Order is trying to be found',
      input: async () => ({ order_id: setup.instance.orders[0].id })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Order is not found' && is_mocked) {
      return jest.spyOn(Order, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Order is trying to be found') {
      return jest.spyOn(Order, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
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
      description: 'Order param id is malformed',
      input: async () => ({
        order_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        values: { status: 'cancelled' }
      })
    },
    {
      id: uuid(),
      description: 'Order is not found',
      input: async () => ({
        order_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        values: { status: 'cancelled' }
      })
    },
    {
      id: uuid(),
      description: 'Order is trying to be found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        values: { status: 'cancelled' }
      })
    },
    {
      id: uuid(),
      description: 'Order is trying to be updated',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        values: { status: 'cancelled' }
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Order is not found' && is_mocked) {
      return jest.spyOn(Order, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Order is trying to be found') {
      return jest.spyOn(Order, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Order is trying to be updated') {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        update: async (values, options) => {
          throw new Error('error mocked.');
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
      description: 'Order param id is malformed',
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
  mock: async ({ fail, description }) => {
    if (fail && description === 'Order is not found') {
      return jest.spyOn(Order, 'findByPk')
        .mockResolvedValue(null);
    }
    if (fail && description === 'Order is trying to be found') {
      return jest.spyOn(Order, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (fail && description === 'Order is trying to be deleted') {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        destroy: async (options) => {
          throw new Error('error mocked.');
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

scenario.get_items = {
  pass: [
    {
      id: uuid(),
      description: 'Query is: empty',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Query is: name=dknd',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        query: { search: { name: 'dknd' } }
      })
    },
    {
      id: uuid(),
      description: 'Query is: name like %disk%',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        query: { search: { name: { like: '%disk%' } } }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Order param id is malformed',
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
  mock: async ({ fail, description }) => {
    if (description === 'Order is not found' && is_mocked) {
      return jest.spyOn(Order, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Order was trying to be found') {
      return jest.spyOn(Order, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Items were trying to be found') {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getItems: async (options) => {
          throw new Error('error mocked.');
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
      description: 'Items are set',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        items: setup.instance.items.map(item => item.id)
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Order param id is malformed',
      input: async () => ({
        order_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        items: setup.instance.items.map(item => item.id)
      })
    },
    {
      id: uuid(),
      description: 'Items ids are malformed',
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
      description: 'Items cannot be set',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        items: setup.instance.items.map(item => item.id)
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Order is not found' && is_mocked) {
      return jest.spyOn(Order, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Order was trying to be found') {
      return jest.spyOn(Order, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Items cannot be set') {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        addItems: async (items) => {
          throw new Error('error mocked.');
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
      description: 'Item is found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        item_id: setup.instance.items[0].id
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Order param id is malformed',
      input: async () => ({
        order_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
        item_id: setup.instance.items[0].id
      })
    },
    {
      id: uuid(),
      description: 'Item param id is malformed',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        item_id: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefcaaaaaa'
      })
    },
    {
      id: uuid(),
      description: 'Order is not found',
      input: async () => ({
        order_id: 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d',
        item_id: setup.instance.items[0].id
      })
    },
    {
      id: uuid(),
      description: 'Item is not found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        item_id: 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d'
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
  mock: async ({ fail, description }) => {
    if (description === 'Order is not found' && is_mocked) {
      return jest.spyOn(Order, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Item is not found' && is_mocked) {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getItems: async (options) => null
      });
    }
    if (description === 'Order was trying to be found') {
      return jest.spyOn(Order, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Item was trying to be found') {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getItems: async (options) => {
          throw new Error('error mocked.');
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
      description: 'Item is found',
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
      description: 'Order param id is malformed',
      input: async () => ({
        order_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
        item_id: setup.instance.items[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Item param id is malformed',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        item_id: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefcaaaaaa',
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Order is not found',
      input: async () => ({
        order_id: 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d',
        item_id: setup.instance.items[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Item is not found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        item_id: 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d',
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
  mock: async ({ fail, description }) => {
    if (description === 'Order is not found' && is_mocked) {
      return jest.spyOn(Order, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Item is not found' && is_mocked) {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getItems: async (options) => null
      });
    }
    if (description === 'Order was trying to be found') {
      return jest.spyOn(Order, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Item was trying to be found') {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getItems: async (options) => {
          throw new Error('error mocked.');
        }
      });
    }
    if (description === 'Item was trying to be updated') {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getItems: async (options) => ({}),
        addItem: async (uuid, options) => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
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
        order_id: setup.instance.orders[0].id,
        item_id: setup.instance.items[0].id
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Order param id is malformed',
      input: async () => ({
        order_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
        item_id: setup.instance.items[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Item param id is malformed',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        item_id: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefcaaaaaa',
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Order is not found',
      input: async () => ({
        order_id: 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d',
        item_id: setup.instance.items[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Item is not found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        item_id: 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d',
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
  mock: async ({ fail, description }) => {
    if (description === 'Order is not found' && is_mocked) {
      return jest.spyOn(Order, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Item is not found' && is_mocked) {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getItems: async (options) => null
      });
    }
    if (description === 'Order was trying to be found') {
      return jest.spyOn(Order, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Item was trying to be found') {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getItems: async (options) => {
          throw new Error('error mocked.');
        }
      });
    }
    if (description === 'Item was trying to be removed') {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getItems: async (options) => ({}),
        removeItem: async (uuid, options) => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getItems: async (payload, options) => ({}),
        removeItem: async (payload, options) => setup.instance.items[0]
      });
    }
  }
};

scenario.get_departments = {
  pass: [
    {
      id: uuid(),
      description: 'Query is: empty',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Query is: name=dknd',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        query: { search: { name: 'dknd' } }
      })
    },
    {
      id: uuid(),
      description: 'Query is: name like %disk%',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        query: { search: { name: { like: '%disk%' } } }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Order param id is malformed',
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
  mock: async ({ fail, description }) => {
    if (description === 'Order is not found' && is_mocked) {
      return jest.spyOn(Order, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Order was trying to be found') {
      return jest.spyOn(Order, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Departments were trying to be found') {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getDepartments: async (options) => {
          throw new Error('error mocked.');
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
      description: 'Departments are set',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        departments: setup.instance.departments.map(dep => dep.id)
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Order param id is malformed',
      input: async () => ({
        order_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        departments: setup.instance.departments.map(dep => dep.id)
      })
    },
    {
      id: uuid(),
      description: 'Departments ids is malformed',
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
        departments: setup.instance.departments.map(dep => dep.id)
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
      description: 'Departments cannot be set',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        departments: setup.instance.departments.map(dep => dep.id)
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Order is not found' && is_mocked) {
      return jest.spyOn(Order, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Order was trying to be found') {
      return jest.spyOn(Order, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Departments cannot be set') {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        addDepartments: async (departments) => {
          throw new Error('error mocked.');
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
      description: 'Department is found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        department_id: setup.instance.departments[0].id
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Order param id is malformed',
      input: async () => ({
        order_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
        department_id: setup.instance.departments[0].id
      })
    },
    {
      id: uuid(),
      description: 'Department param id is malformed',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        department_id: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefcaaaaaa'
      })
    },
    {
      id: uuid(),
      description: 'Order is not found',
      input: async () => ({
        order_id: 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d',
        department_id: setup.instance.departments[0].id
      })
    },
    {
      id: uuid(),
      description: 'Department is not found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        department_id: 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d'
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
  mock: async ({ fail, description }) => {
    if (description === 'Order is not found' && is_mocked) {
      return jest.spyOn(Order, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Department is not found' && is_mocked) {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getDepartments: async (options) => null
      });
    }
    if (description === 'Order was trying to be found') {
      return jest.spyOn(Order, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Department was trying to be found') {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getDepartments: async (options) => {
          throw new Error('error mocked.');
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
      description: 'Department is found',
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
      description: 'Order param id is malformed',
      input: async () => ({
        order_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
        department_id: setup.instance.departments[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Department param id is malformed',
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
        order_id: 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d',
        department_id: setup.instance.departments[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Department is not found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        department_id: 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d',
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
  mock: async ({ fail, description }) => {
    if (description === 'Order is not found' && is_mocked) {
      return jest.spyOn(Order, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Department is not found' && is_mocked) {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getDepartments: async (options) => null
      });
    }
    if (description === 'Order was trying to be found') {
      return jest.spyOn(Order, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Department was trying to be found') {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getDepartments: async (options) => {
          throw new Error('error mocked.');
        }
      });
    }
    if (description === 'Department was trying to be updated') {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getDepartments: async (options) => ({}),
        addDepartment: async (uuid, options) => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getDepartments: async (options) => ({ mocked: 'yes' }),
        addDepartment: async (values, options) => {
          return setup.instance.departments[0];
        }
      });
    }
  }
};

scenario.remove_department = {
  pass: [
    {
      id: uuid(),
      description: 'Department is found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        department_id: setup.instance.departments[0].id
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Order param id is malformed',
      input: async () => ({
        order_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
        department_id: setup.instance.departments[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Department param id is malformed',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        department_id: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefcaaaaaa',
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Order is not found',
      input: async () => ({
        order_id: 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d',
        department_id: setup.instance.departments[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Department is not found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        department_id: 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d',
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
  mock: async ({ fail, description }) => {
    if (description === 'Order is not found' && is_mocked) {
      return jest.spyOn(Order, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Department is not found' && is_mocked) {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getDepartments: async (options) => null
      });
    }
    if (description === 'Order was trying to be found') {
      return jest.spyOn(Order, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Department was trying to be found') {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getDepartments: async (options) => {
          throw new Error('error mocked.');
        }
      });
    }
    if (description === 'Department was trying to be removed') {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getDepartments: async (options) => ({}),
        removeDepartment: async (uuid, options) => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getDepartments: async (payload, options) => ({}),
        removeDepartment: async (payload, options) => {
          return setup.instance.departments[0]
        }
      });
    }
  }
};

scenario.get_employees = {
  pass: [
    {
      id: uuid(),
      description: 'Query is: empty',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Query is: firstname=dknd',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        query: { search: { firstname: 'dknd' } }
      })
    },
    {
      id: uuid(),
      description: 'Query is: firstname like %disk%',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        query: { search: { firstname: { like: '%disk%' } } }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Order param id is malformed',
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
  mock: async ({ fail, description }) => {
    if (description === 'Order is not found' && is_mocked) {
      return jest.spyOn(Order, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Order was trying to be found') {
      return jest.spyOn(Order, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Employees were trying to be found') {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getEmployees: async (options) => {
          throw new Error('error mocked.');
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
      description: 'Employees are set',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        employees: setup.instance.employees.map(employee => employee.id)
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Order param id is malformed',
      input: async () => ({
        order_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        employees: setup.instance.employees.map(employee => employee.id)
      })
    },
    {
      id: uuid(),
      description: 'Employees ids are malformed',
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
      description: 'Employees cannot be set',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        employees: setup.instance.employees.map(employee => employee.id)
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Order is not found' && is_mocked) {
      return jest.spyOn(Order, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Order was trying to be found') {
      return jest.spyOn(Order, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Employees cannot be set') {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        addEmployees: async (employees) => {
          throw new Error('error mocked.');
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
      description: 'Employee is found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        employee_id: setup.instance.employees[0].id
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Order param id is malformed',
      input: async () => ({
        order_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
        employee_id: setup.instance.employees[0].id
      })
    },
    {
      id: uuid(),
      description: 'Employee param id is malformed',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        employee_id: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefcaaaaaa'
      })
    },
    {
      id: uuid(),
      description: 'Order is not found',
      input: async () => ({
        order_id: 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d',
        employee_id: setup.instance.employees[0].id
      })
    },
    {
      id: uuid(),
      description: 'Employee is not found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        employee_id: 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d'
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
  mock: async ({ fail, description }) => {
    if (description === 'Order is not found' && is_mocked) {
      return jest.spyOn(Order, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Employee is not found' && is_mocked) {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getEmployees: async (options) => null
      });
    }
    if (description === 'Order was trying to be found') {
      return jest.spyOn(Order, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Employee was trying to be found') {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getEmployees: async (options) => {
          throw new Error('error mocked.');
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
      description: 'Employee is found',
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
      description: 'Order param id is malformed',
      input: async () => ({
        order_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
        employee_id: setup.instance.employees[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Employee param id is malformed',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        employee_id: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefcaaaaaa',
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Order is not found',
      input: async () => ({
        order_id: 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d',
        employee_id: setup.instance.employees[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Employee is not found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        employee_id: 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d',
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
  mock: async ({ fail, description }) => {
    if (description === 'Order is not found' && is_mocked) {
      return jest.spyOn(Order, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Employee is not found' && is_mocked) {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getEmployees: async (options) => null
      });
    }
    if (description === 'Order was trying to be found') {
      return jest.spyOn(Order, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Employee was trying to be found') {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getEmployees: async (options) => {
          throw new Error('error mocked.');
        }
      });
    }
    if (description === 'Employee was trying to be updated') {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getEmployees: async (options) => ({}),
        addEmployee: async (uuid, options) => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getEmployees: async (options) => ({ mocked: 'yes' }),
        addEmployee: async (values, options) => {
          return setup.instance.employees[0];
        }
      });
    }
  }
};

scenario.remove_employee = {
  pass: [
    {
      id: uuid(),
      description: 'Employee is found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        employee_id: setup.instance.employees[0].id
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Order param id is malformed',
      input: async () => ({
        order_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
        employee_id: setup.instance.employees[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Employee param id is malformed',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        employee_id: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefcaaaaaa',
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Order is not found',
      input: async () => ({
        order_id: 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d',
        employee_id: setup.instance.employees[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Employee is not found',
      input: async () => ({
        order_id: setup.instance.orders[0].id,
        employee_id: 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d',
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
  mock: async ({ fail, description }) => {
    if (description === 'Order is not found' && is_mocked) {
      return jest.spyOn(Order, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Employee is not found' && is_mocked) {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getEmployees: async (options) => null
      });
    }
    if (description === 'Order was trying to be found') {
      return jest.spyOn(Order, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Employee was trying to be found') {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getEmployees: async (options) => {
          throw new Error('error mocked.');
        }
      });
    }
    if (description === 'Employee was trying to be removed') {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getEmployees: async (options) => ({}),
        removeEmployee: async (uuid, options) => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Order, 'findByPk').mockResolvedValue({
        getEmployees: async (payload, options) => ({}),
        removeEmployee: async (payload, options) => {
          return setup.instance.employees[0];
        }
      });
    }
  }
};

module.exports.scenario = scenario;

module.exports.setup = setup;
