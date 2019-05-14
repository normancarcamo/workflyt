import uuid from 'uuid/v4';
import setup_factory from './index';
import db from 'src/db/models';

const is_mocked = JSON.parse(process.env.MOCK);
const setup = setup_factory(db, is_mocked, 'Supplier'), scenario = {};
const { Supplier } = db.sequelize.models;

scenario.get_suppliers = {
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
      description: 'query sent is: { search: { name: "ccccc" } }',
      input: async () => ({ search: { name: 'ccccc' } })
    },
    {
      id: uuid(),
      description: 'query sent is: { search: { name: { like: "%vvv%" } } }',
      input: async () => ({ search: { name: { like: '%vvv%' } } })
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
      return jest.spyOn(Supplier, 'findAll')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Supplier, 'findAll')
        .mockResolvedValue([]);
    }
  }
};

scenario.create_suppliers = {
  pass: [
    {
      id: uuid(),
      description: 'Values are sent as array',
      input: async () => ({ values: [{ name: 'bingo' }] })
    },
    {
      id: uuid(),
      description: 'Values are sent as object',
      input: async () => ({ values: { name: 'bingo' } })
    },
    {
      id: uuid(),
      description: `Supplier is created by a specific user`,
      input: async () => ({
        values: {
          name: 'demo',
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
      description: 'Values are invalid',
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
      return jest.spyOn(Supplier, 'createMany')
        .mockRejectedValue(new Error('error mocked'));
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Supplier, 'createMany')
        .mockImplementation(async (values, options) => {
        if (Array.isArray(values)) {
          return values.reduce((initial, values) => {
            initial.push(Supplier.build(values, options));
            return initial;
          }, []);
        } else {
          return Supplier.build(values, options);
        }
      });
    }
  }
};

scenario.get_supplier = {
  pass: [
    {
      id: uuid(),
      description: 'Supplier is found',
      input: async () => ({ supplier_id: setup.instance.suppliers[0].id })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Supplier id param is malformed',
      input: async () => ({
        supplier_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s'
      })
    },
    {
      id: uuid(),
      description: 'Supplier is not found',
      input: async () => ({
        supplier_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111'
      })
    },
    {
      id: uuid(),
      description: 'Supplier was trying to be found',
      input: async () => ({
        supplier_id: setup.instance.suppliers[0].id
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Supplier is not found' && is_mocked) {
      return jest.spyOn(Supplier, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Supplier was trying to be found') {
      return jest.spyOn(Supplier, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Supplier, 'findByPk')
        .mockResolvedValue(setup.instance.suppliers[0]);
    }
  }
};

scenario.update_supplier = {
  pass: [
    {
      id: uuid(),
      description: 'Supplier is updated',
      input: async () => ({
        supplier_id: setup.instance.suppliers[0].id,
        values: { name: 'Supplier A' }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Supplier id param is malformed',
      input: async () => ({
        supplier_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        values: { name: 'Supplier A' }
      })
    },
    {
      id: uuid(),
      description: 'Supplier is not found',
      input: async () => ({
        supplier_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        values: { name: 'Supplier A' }
      })
    },
    {
      id: uuid(),
      description: 'Supplier was trying to be found',
      input: async () => ({
        supplier_id: setup.instance.suppliers[0].id,
        values: { name: 'Supplier A' }
      })
    },
    {
      id: uuid(),
      description: 'Supplier was trying to be updated',
      input: async () => ({
        supplier_id: setup.instance.suppliers[0].id,
        values: { name: 'Supplier A' }
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Supplier is not found' && is_mocked) {
      return jest.spyOn(Supplier, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Supplier was trying to be found') {
      return jest.spyOn(Supplier, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Supplier was trying to be updated') {
      return jest.spyOn(Supplier, 'findByPk').mockResolvedValue({
        update: async payload => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Supplier, 'findByPk').mockResolvedValue({
        update: async (payload, options) => Supplier.build({
          ...setup.instance.suppliers[0].dataValues,
          ...payload
        }, options)
      });
    }
  }
};

scenario.delete_supplier = {
  pass: [
    {
      id: uuid(),
      description: 'Supplier is deleted without options',
      input: async () => ({
        supplier_id: setup.instance.suppliers[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Supplier is deleted using force option as true',
      input: async () => ({
        supplier_id: setup.instance.suppliers[0].id,
        query: { force: true }
      })
    },
    {
      id: uuid(),
      description: 'Supplier is deleted using force option as false',
      input: async () => ({
        supplier_id: setup.instance.suppliers[0].id,
        query: { force: false }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Supplier id param is malformed',
      input: async () => ({
        supplier_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Supplier is not found',
      input: async () => ({
        supplier_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Supplier was trying to be found',
      input: async () => ({
        supplier_id: setup.instance.suppliers[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Supplier was trying to be removed',
      input: async () => ({
        supplier_id: setup.instance.suppliers[0].id,
        query: {}
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Supplier is not found' && is_mocked) {
      return jest.spyOn(Supplier, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Supplier was trying to be found') {
      return jest.spyOn(Supplier, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Supplier was trying to be removed') {
      return jest.spyOn(Supplier, 'findByPk').mockResolvedValue({
        destroy: async payload => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Supplier, 'findByPk').mockResolvedValue({
        destroy: async payload => {
          if (payload.force) {
            return [];
          } else {
            setup.instance.suppliers[0].deleted_at = new Date().toISOString();
            return setup.instance.suppliers[0];
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
        supplier_id: setup.instance.suppliers[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Query is: name=dknd',
      input: async () => ({
        supplier_id: setup.instance.suppliers[0].id,
        query: { search: { name: 'dknd' } }
      })
    },
    {
      id: uuid(),
      description: 'Query is: name like %disk%',
      input: async () => ({
        supplier_id: setup.instance.suppliers[0].id,
        query: { search: { name: { like: '%disk%' } } }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Supplier param id is malformed',
      input: async () => ({
        supplier_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Supplier is not found',
      input: async () => ({
        supplier_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Supplier was trying to be found',
      input: async () => ({
        supplier_id: setup.instance.suppliers[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Items were trying to be found',
      input: async () => ({
        supplier_id: setup.instance.suppliers[0].id,
        query: {}
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (fail && description === 'Supplier is not found') {
      return jest.spyOn(Supplier, 'findByPk')
        .mockResolvedValue(null);
    }
    if (fail && description === 'Supplier was trying to be found') {
      return jest.spyOn(Supplier, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (fail && description === 'Items were trying to be found') {
      return jest.spyOn(Supplier, 'findByPk').mockResolvedValue({
        getItems: async (options) => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Supplier, 'findByPk').mockResolvedValue({
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
        supplier_id: setup.instance.suppliers[0].id,
        items: setup.instance.items.map(item => item.id)
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Supplier param id is malformed',
      input: async () => ({
        supplier_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        items: setup.instance.items.map(item => item.id)
      })
    },
    {
      id: uuid(),
      description: 'Items ids are malformed',
      input: async () => ({
        supplier_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        items: [
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s'
        ]
      })
    },
    {
      id: uuid(),
      description: 'Supplier is not found',
      input: async () => ({
        supplier_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        items: setup.instance.items.map(item => item.id)
      })
    },
    {
      id: uuid(),
      description: 'Supplier was trying to be found',
      input: async () => ({
        supplier_id: setup.instance.suppliers[0].id,
        items: setup.instance.items.map(item => item.id)
      })
    },
    {
      id: uuid(),
      description: 'Items cannot be set',
      input: async () => ({
        supplier_id: setup.instance.suppliers[0].id,
        items: setup.instance.items.map(item => item.id)
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (fail && description === 'Supplier is not found') {
      return jest.spyOn(Supplier, 'findByPk')
        .mockResolvedValue(null);
    }
    if (fail && description === 'Supplier was trying to be found') {
      return jest.spyOn(Supplier, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (fail && description === 'Items cannot be set') {
      return jest.spyOn(Supplier, 'findByPk').mockResolvedValue({
        addItems: async (items) => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Supplier, 'findByPk').mockResolvedValue({
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
        supplier_id: setup.instance.suppliers[0].id,
        item_id: setup.instance.items[0].id
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Supplier param id is malformed',
      input: async () => ({
        supplier_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
        item_id: setup.instance.items[0].id
      })
    },
    {
      id: uuid(),
      description: 'Item param id is malformed',
      input: async () => ({
        supplier_id: setup.instance.suppliers[0].id,
        item_id: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefcaaaaaa'
      })
    },
    {
      id: uuid(),
      description: 'Supplier is not found',
      input: async () => ({
        supplier_id: 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d',
        item_id: setup.instance.items[0].id
      })
    },
    {
      id: uuid(),
      description: 'Item is not found',
      input: async () => ({
        supplier_id: setup.instance.suppliers[0].id,
        item_id: 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d'
      })
    },
    {
      id: uuid(),
      description: 'Supplier was trying to be found',
      input: async () => ({
        supplier_id: setup.instance.suppliers[0].id,
        item_id: setup.instance.items[0].id
      })
    },
    {
      id: uuid(),
      description: 'Item was trying to be found',
      input: async () => ({
        supplier_id: setup.instance.suppliers[0].id,
        item_id: setup.instance.items[0].id
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (fail && description === 'Supplier is not found') {
      return jest.spyOn(Supplier, 'findByPk')
        .mockResolvedValue(null);
    }
    if (fail && description === 'Item is not found') {
      return jest.spyOn(Supplier, 'findByPk').mockResolvedValue({
        getItems: async (options) => null
      });
    }
    if (fail && description === 'Supplier was trying to be found') {
      return jest.spyOn(Supplier, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (fail && description === 'Item was trying to be found') {
      return jest.spyOn(Supplier, 'findByPk').mockResolvedValue({
        getItems: async (options) => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Supplier, 'findByPk').mockResolvedValue({
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
        supplier_id: setup.instance.suppliers[0].id,
        item_id: setup.instance.items[0].id,
        values: { extra: { units: 20 } }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Supplier param id is malformed',
      input: async () => ({
        supplier_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
        item_id: setup.instance.items[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Item param id is malformed',
      input: async () => {
        return {
          supplier_id: setup.instance.suppliers[0].id,
          item_id: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefcaaaaaa',
          values: { extra: { units: 20 } }
        }
      }
    },
    {
      id: uuid(),
      description: 'Supplier is not found',
      input: async () => ({
        supplier_id: 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d',
        item_id: setup.instance.items[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Item is not found',
      input: async () => ({
        supplier_id: setup.instance.suppliers[0].id,
        item_id: 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d',
        values: { extra: { units: 21 } }
      })
    },
    {
      id: uuid(),
      description: 'Supplier was trying to be found',
      input: async () => ({
        supplier_id: setup.instance.suppliers[0].id,
        item_id: setup.instance.items[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Item was trying to be found',
      input: async () => ({
        supplier_id: setup.instance.suppliers[0].id,
        item_id: setup.instance.items[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Item was trying to be updated',
      input: async () => ({
        supplier_id: setup.instance.suppliers[0].id,
        item_id: setup.instance.items[0].id,
        values: { extra: { units: 20 } }
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (fail && description === 'Supplier is not found') {
      return jest.spyOn(Supplier, 'findByPk')
        .mockResolvedValue(null);
    }
    if (fail && description === 'Item is not found') {
      return jest.spyOn(Supplier, 'findByPk').mockResolvedValue({
        getItems: async (options) => null
      });
    }
    if (fail && description === 'Supplier was trying to be found') {
      return jest.spyOn(Supplier, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (fail && description === 'Item was trying to be found') {
      return jest.spyOn(Supplier, 'findByPk').mockResolvedValue({
        getItems: async (options) => {
          throw new Error('error mocked.');
        }
      });
    }
    if (fail && description === 'Item was trying to be updated') {
      return jest.spyOn(Supplier, 'findByPk').mockResolvedValue({
        getItems: async (options) => ({}),
        addItem: async (uuid, options) => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Supplier, 'findByPk').mockResolvedValue({
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
        supplier_id: setup.instance.suppliers[0].id,
        item_id: setup.instance.items[0].id
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Supplier param id is malformed',
      input: async () => ({
        supplier_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
        item_id: setup.instance.items[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Item param id is malformed',
      input: async () => ({
        supplier_id: setup.instance.suppliers[0].id,
        item_id: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefcaaaaaa',
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Supplier is not found',
      input: async () => ({
        supplier_id: 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d',
        item_id: setup.instance.items[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Item is not found',
      input: async () => ({
        supplier_id: setup.instance.suppliers[0].id,
        item_id: 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d',
        values: { extra: { units: 21 } }
      })
    },
    {
      id: uuid(),
      description: 'Supplier was trying to be found',
      input: async () => ({
        supplier_id: setup.instance.suppliers[0].id,
        item_id: setup.instance.items[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Item was trying to be found',
      input: async () => ({
        supplier_id: setup.instance.suppliers[0].id,
        item_id: setup.instance.items[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Item was trying to be removed',
      input: async () => ({
        supplier_id: setup.instance.suppliers[0].id,
        item_id: setup.instance.items[0].id,
        values: { extra: { units: 20 } }
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (fail && description === 'Supplier is not found') {
      return jest.spyOn(Supplier, 'findByPk')
        .mockResolvedValue(null);
    }
    if (fail && description === 'Item is not found') {
      return jest.spyOn(Supplier, 'findByPk').mockResolvedValue({
        getItems: async (options) => null
      });
    }
    if (fail && description === 'Supplier was trying to be found') {
      return jest.spyOn(Supplier, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (fail && description === 'Item was trying to be found') {
      return jest.spyOn(Supplier, 'findByPk').mockResolvedValue({
        getItems: async (options) => {
          throw new Error('error mocked.');
        }
      });
    }
    if (fail && description === 'Item was trying to be removed') {
      return jest.spyOn(Supplier, 'findByPk').mockResolvedValue({
        getItems: async (options) => ({}),
        removeItem: async (uuid, options) => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Supplier, 'findByPk').mockResolvedValue({
        getItems: async (payload, options) => ({}),
        removeItem: async (payload, options) => {
          return setup.instance.items[0];
        }
      });
    }
  }
};

module.exports.scenario = scenario;

module.exports.setup = setup;
