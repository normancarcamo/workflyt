import uuid from 'uuid/v4';
import setup_factory from './index';
import db from 'src/db/models';

const is_mocked = JSON.parse(process.env.MOCK);
const setup = setup_factory(db, is_mocked, 'Category'), scenario = {};
const { Category } = db.sequelize.models;

scenario.get_categories = {
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
      description: 'Query validation fails',
      input: async () => ({ search: null })
    },
    {
      id: uuid(),
      description: 'Action throw error',
      input: async () => ({ search: { name: { eq: 'Category A' } } })
    }
  ],
  mock: async ({ fail, description }) => {
    scenario.case = 'get_categories';
    if (description === 'Action throw error') {
      return jest.spyOn(Category, 'findAll')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Category, 'findAll')
        .mockResolvedValue([]);
    }
  }
};

scenario.create_categories = {
  pass: [
    {
      id: uuid(),
      description: 'Values are valid',
      input: async () => ({ values: { name: 'demo' } })
    },
    {
      id: uuid(),
      description: `Category is created by a specific user`,
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
      description: 'Values sent are invalid or malformed',
      input: async () => ({ values: null })
    },
    {
      id: uuid(),
      description: 'Query validation fails using an name invalid',
      input: async () => ({ values: { name: '' } })
    },
    {
      id: uuid(),
      description: 'Category create action throw error',
      input: async () => ({ values: { name: 'Category A' } })
    }
  ],
  mock: async ({ fail, description }) => {
    scenario.case = 'create_categories';
    if (description === 'Category create action throw error') {
      return jest.spyOn(Category, 'create')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Category, 'create').mockResolvedValue(Category.build({
        ...setup.instance.categories[0].dataValues,
        created_by: setup.instance.users[0].id,
        updated_by: setup.instance.users[0].id,
      }));
    }
  }
};

scenario.get_category = {
  pass: [
    {
      id: uuid(),
      description: 'Category is found',
      input: async () => ({
        category_id: setup.instance.categories[0].id
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Category id param is malformed',
      input: async () => ({
        category_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111dd'
      })
    },
    {
      id: uuid(),
      description: 'Category was not found',
      input: async () => ({
        category_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111'
      })
    }
  ],
  mock: async ({ fail, description }) => {
    scenario.case = 'get_category';
    if (description === 'Category was not found' && is_mocked) {
      return jest.spyOn(Category, 'findByPk')
        .mockResolvedValue(null);
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Category, 'findByPk')
        .mockResolvedValue(setup.instance.categories[0]);
    }
  }
};

scenario.update_category = {
  pass: [
    {
      id: uuid(),
      description: 'Values are valid',
      input: async () => ({
        category_id: setup.instance.categories[0].id,
        values: { name: 'Category A' }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Query values validation fail',
      input: async () => ({
        category_id: setup.instance.categories[0].id,
        values: null
      })
    },
    {
      id: uuid(),
      description: 'Category was not found',
      input: async () => ({
        category_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        values: { name: 'Category A' }
      })
    },
    {
      id: uuid(),
      description: 'Category was trying to be found',
      input: async () => ({
        category_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        values: { name: 'Category A' }
      })
    },
    {
      id: uuid(),
      description: 'Category was trying to be updated',
      input: async () => ({
        category_id: setup.instance.categories[0].id,
        values: { name: 'Category A' }
      })
    }
  ],
  mock: async ({ fail, description }) => {
    scenario.case = 'update_category';
    if (description === 'Category was not found' && is_mocked) {
      return jest.spyOn(Category, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Category was trying to be found') {
      return jest.spyOn(Category, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Category was trying to be updated') {
      return jest.spyOn(Category, 'findByPk').mockResolvedValue({
        update: async (payload, options) => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Category, 'findByPk').mockResolvedValue({
        update: async (payload, options) => Category.build({
          ...setup.instance.categories[0].dataValues,
          ...payload
        })
      });
    }
  }
};

scenario.delete_category = {
  pass: [
    {
      id: uuid(),
      description: 'Category is deleted without options',
      input: async () => ({
        category_id: setup.instance.categories[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Category is deleted with force option as true',
      input: async () => ({
        category_id: setup.instance.categories[0].id,
        query: { force: true }
      })
    },
    {
      id: uuid(),
      description: 'Category is deleted with force option as false',
      input: async () => ({
        category_id: setup.instance.categories[0].id,
        query: { force: false }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Category id param is malformed',
      input: async () => ({
        category_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Category was not found',
      input: async () => ({
        category_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Category was trying to be found',
      input: async () => ({
        category_id: setup.instance.categories[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Category was trying to be deleted',
      input: async () => ({
        category_id: setup.instance.categories[0].id,
        query: {}
      })
    }
  ],
  mock: async ({ fail, description }) => {
    scenario.case = 'delete_category';
    if (description === 'Category was not found' && is_mocked) {
      return jest.spyOn(Category, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Category was trying to be found') {
      return jest.spyOn(Category, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Category was trying to be deleted') {
      return jest.spyOn(Category, 'findByPk').mockResolvedValue({
        destroy: async (options) => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Category, 'findByPk').mockResolvedValue({
        destroy: async (options) => {
          let category = setup.instance.categories[0];
          category.deleted_at = new Date().toISOString();
          return category;
        }
      });
    }
  }
};

scenario.get_items = {
  pass: [
    {
      id: uuid(),
      description: 'query sent is: {}',
      input: async () => ({
        category_id: setup.instance.categories[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'query sent is: { search: {} }',
      input: async () => ({
        category_id: setup.instance.categories[0].id,
        query: { search: {} }
      })
    },
    {
      id: uuid(),
      description: 'query sent is: undefined',
      input: async () => ({
        category_id: setup.instance.categories[0].id,
        query: { search: undefined }
      })
    },
    {
      id: uuid(),
      description: "query sent is: { search: { name: 'ccccc' } }",
      input: async () => ({
        category_id: setup.instance.categories[0].id,
        query: { search: { name: 'ccccc' } }
      })
    },
    {
      id: uuid(),
      description: "query sent is: { search: { name: { like: '%vvvvv%' } } }",
      input: async () => ({
        category_id: setup.instance.categories[0].id,
        query: { search: { name: { like: '%vvvvv%' } } }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Query search validation fail',
      input: async () => ({
        category_id: setup.instance.categories[0].id,
        query: { search: null }
      })
    },
    {
      id: uuid(),
      description: 'Category was not found',
      input: async () => ({
        category_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        query: { search: { name: { eq: 'model' } } }
      })
    },
    {
      id: uuid(),
      description: 'Category was trying to be found',
      input: async () => ({
        category_id: setup.instance.categories[0].id,
        query: { search: { name: { eq: 'model' } } }
      })
    },
    {
      id: uuid(),
      description: 'Items were trying to be found',
      input: async () => ({
        category_id: setup.instance.categories[0].id,
        query: { search: { name: { eq: 'model' } } }
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Category was not found' && is_mocked) {
      return jest.spyOn(Category, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Category was trying to be found') {
      return jest.spyOn(Category, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Items were trying to be found') {
      return jest.spyOn(Category, 'findByPk').mockResolvedValue({
        getItems: async (options) => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Category, 'findByPk').mockResolvedValue({
        getItems: async (options) => setup.instance.items
      });
    }
  }
};

scenario.set_items = {
  pass: [
    {
      id: uuid(),
      description: 'Items are set to a category',
      input: async () => ({
        category_id: setup.instance.categories[0].id,
        items: setup.instance.items.map(i => i.id)
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Category id param is malformed',
      input: async () => ({
        category_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        items: setup.instance.items.map(i => i.id)
      })
    },
    {
      id: uuid(),
      description: 'Items ids values are malformed',
      input: async () => ({
        category_id: setup.instance.categories[0].id,
        items: [ '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s' ]
      })
    },
    {
      id: uuid(),
      description: 'Category is not found',
      input: async () => ({
        category_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        items: setup.instance.items.map(i => i.id)
      })
    },
    {
      id: uuid(),
      description: 'Category was trying to be found',
      input: async () => ({
        category_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        items: setup.instance.items.map(i => i.id)
      })
    },
    {
      id: uuid(),
      description: 'Items were trying to be set',
      input: async () => ({
        category_id: setup.instance.categories[0].id,
        items: setup.instance.items.map(i => i.id)
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Category is not found' && is_mocked) {
      return jest.spyOn(Category, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Category was trying to be found') {
      return jest.spyOn(Category, 'findByPk')
        .mockResolvedValue(new Error('error mocked.'));
    }
    if (description === 'Items were trying to be set') {
      return jest.spyOn(Category, 'findByPk').mockResolvedValue({
        addItems: async (payload, options) => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Category, 'findByPk').mockResolvedValue({
        addItems: async (payload, options) => payload
      });
    }
  }
};

scenario.get_item = {
  pass: [
    {
      id: uuid(),
      description: 'Category is found',
      input: async () => ({
        category_id: setup.instance.categories[0].id,
        item_id: setup.instance.items[0].id
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Category id param is malformed',
      input: async () => ({
        category_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
        item_id: setup.instance.items[0].id
      })
    },
    {
      id: uuid(),
      description: 'Item id param is malformed',
      input: async () => ({
        category_id: setup.instance.categories[0].id,
        item_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll'
      })
    },
    {
      id: uuid(),
      description: 'Category was not found',
      input: async () => ({
        category_id: '5dc8dfea-34c1-4280-bb5e-d18af9296fc1',
        item_id: setup.instance.items[0].id
      })
    },
    {
      id: uuid(),
      description: 'Item was not found',
      input: async () => ({
        category_id: setup.instance.categories[0].id,
        item_id: '5dc8dfea-34c1-4280-bb5e-d18af9296fc1'
      })
    },
    {
      id: uuid(),
      description: 'Category was trying to be found',
      input: async () => ({
        category_id: setup.instance.categories[0].id,
        item_id: setup.instance.items[0].id
      })
    },
    {
      id: uuid(),
      description: 'Item was trying to be found',
      input: async () => ({
        category_id: setup.instance.categories[0].id,
        item_id: setup.instance.items[0].id
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Category was not found' && is_mocked) {
      return jest.spyOn(Category, 'findByPk').mockResolvedValue(null);
    }
    if (description === 'Item was not found' && is_mocked) {
      return jest.spyOn(Category, 'findByPk').mockResolvedValue({
        getItems: async payload => null
      });
    }
    if (description === 'Category was trying to be found') {
      return jest.spyOn(Category, 'findByPk')
      .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Item was trying to be found') {
      return jest.spyOn(Category, 'findByPk').mockResolvedValue({
        getItems: async payload => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Category, 'findByPk').mockResolvedValue({
        getItems: async payload => setup.instance.items[0]
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
        category_id: setup.instance.categories[0].id,
        item_id: setup.instance.items[0].id
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Category id param is malformed',
      input: async () => ({
        category_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
        item_id: setup.instance.items[0].id
      })
    },
    {
      id: uuid(),
      description: 'Item id param is malformed',
      input: async () => ({
        category_id: setup.instance.categories[0].id,
        item_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll'
      })
    },
    {
      id: uuid(),
      description: 'Category was not found',
      input: async () => ({
        category_id: '5dc8dfea-34c1-4280-bb5e-d18af9296fc1',
        item_id: setup.instance.items[0].id
      })
    },
    {
      id: uuid(),
      description: 'Item was not found',
      input: async () => ({
        category_id: setup.instance.categories[0].id,
        item_id: '5dc8dfea-34c1-4280-bb5e-d18af9296fc1'
      })
    },
    {
      id: uuid(),
      description: 'Category was trying to be found',
      input: async () => ({
        category_id: setup.instance.categories[0].id,
        item_id: setup.instance.items[0].id
      })
    },
    {
      id: uuid(),
      description: 'Item was trying to be found',
      input: async () => ({
        category_id: setup.instance.categories[0].id,
        item_id: setup.instance.items[0].id
      })
    },
    {
      id: uuid(),
      description: 'Item was trying to be removed',
      input: async () => ({
        category_id: setup.instance.categories[0].id,
        item_id: setup.instance.items[0].id
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Category was not found' && is_mocked) {
      return jest.spyOn(Category, 'findByPk').mockResolvedValue(null);
    }
    if (description === 'Item was not found' && is_mocked) {
      return jest.spyOn(Category, 'findByPk').mockResolvedValue({
        getItems: async payload => null
      });
    }
    if (description === 'Category was trying to be found') {
      return jest.spyOn(Category, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Item was trying to be found') {
      return jest.spyOn(Category, 'findByPk').mockResolvedValue({
        getItems: async payload => {
          throw new Error('error mocked.');
        }
      });
    }
    if (description === 'Item was trying to be removed') {
      return jest.spyOn(Category, 'findByPk').mockResolvedValue({
        getItems: async payload => ({
          setCategory: async (payload) => {
            throw new Error('error mocked.');
          }
        })
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Category, 'findByPk').mockResolvedValue({
        getItems: async payload => ({
          setCategory: async () => {
            const now = new Date().toISOString();
            setup.instance.items[0].updated_at = now;
            setup.instance.items[0].deleted_at = now;
            return setup.instance.items[0];
          }
        })
      });
    }
  }
};

module.exports.scenario = scenario;

module.exports.setup = setup;
