import uuid from 'uuid/v4';
import setup_factory from './index';
import db from 'src/db/models';

const is_mocked = JSON.parse(process.env.MOCK);
const setup = setup_factory(db, is_mocked, 'Permission'), scenario = {};
const { Permission } = db.sequelize.models;

scenario.get_permissions = {
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
      return jest.spyOn(Permission, 'findAll')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (!fail && is_mocked){
      return jest.spyOn(Permission, 'findAll')
        .mockResolvedValue([]);
    }
  }
};

scenario.create_permissions = {
  pass: [
    {
      id: uuid(),
      description: 'Values has been sent using array',
      input: async () => ({ values: [{ name: 'nenene' }] })
    },
    {
      id: uuid(),
      description: 'Values has been sent using object',
      input: async () => ({ values: { name: 'nenene' } })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Validation fails using invalid data in array',
      input: async () => ({
        values: [
          { unknow_property: 'nenene' },
          { name: '' }
        ]
      })
    },
    {
      id: uuid(),
      description: 'Validation fails using invalid data in object',
      input: async () => ({ values: { name: '' } })
    },
    {
      id: uuid(),
      description: 'Action throws error',
      input: async () => ({ values: { name: 'nenene' } })
    },
    {
      id: uuid(),
      description: `Permission is created by a specific user`,
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
  mock: async ({ fail, description }) => {
    if (description === 'Action throws error') {
      return jest.spyOn(Permission, 'createMany')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Permission, 'createMany')
        .mockImplementation(async (values, options) => {
        if (Array.isArray(values)) {
          return values.reduce((initial, values, index) => {
            initial.push(Permission.build(values, options));
            return initial;
          }, []);
        } else {
          return Permission.build(values, options);
        }
      });
    }
  }
};

scenario.get_permission = {
  pass: [
    {
      id: uuid(),
      description: 'Permission is found',
      input: async () => ({
        permission_id: setup.instance.permissions[0].id
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Permission param id is malformed',
      input: async () => ({
        permission_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s'
      })
    },
    {
      id: uuid(),
      description: 'Permission was not found',
      input: async () => ({
        permission_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111'
      })
    },
    {
      id: uuid(),
      description: 'Permission find throws error',
      input: async () => ({
        permission_id: setup.instance.permissions[0].id
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Permission was not found' && is_mocked) {
      return jest.spyOn(Permission, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Permission find throws error') {
      return jest.spyOn(Permission, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Permission, 'findByPk')
        .mockResolvedValue(setup.instance.permissions[0]);
    }
  }
};

scenario.update_permission = {
  pass: [
    {
      id: uuid(),
      description: 'Permission is updated',
      input: async () => ({
        permission_id: setup.instance.permissions[0].id,
        values: { name: 'new name' }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Permission param id is malformed',
      input: async () => ({
        permission_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        values: { name: 'new name' }
      })
    },
    {
      id: uuid(),
      description: 'Permission was not found',
      input: async () => ({
        permission_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        values: { name: 'new name' }
      })
    },
    {
      id: uuid(),
      description: 'Permission find throws error',
      input: async () => ({
        permission_id: setup.instance.permissions[0].id,
        values: { name: 'new name' }
      })
    },
    {
      id: uuid(),
      description: 'Permission update throws error',
      input: async () => ({
        permission_id: setup.instance.permissions[0].id,
        values: { name: 'new name' }
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Permission was not found' && is_mocked) {
      return jest.spyOn(Permission, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Permission find throws error') {
      return jest.spyOn(Permission, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Permission update throws error') {
      return jest.spyOn(Permission, 'findByPk').mockResolvedValue({
        update: async payload => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Permission, 'findByPk').mockResolvedValue({
        update: async (values, options) => {
          return Permission.build({
            ...setup.instance.permissions[0].dataValues,
            ...values,
            updated_at: new Date().toISOString()
          }, options);
        }
      });
    }
  }
};

scenario.delete_permission = {
  pass: [
    {
      id: uuid(),
      description: 'Permission is deleted without options',
      input: async () => ({
        permission_id: setup.instance.permissions[0].id
      })
    },
    {
      id: uuid(),
      description: 'Permission is deleted with force option as false',
      input: async () => ({
        permission_id: setup.instance.permissions[0].id,
        query: { force: false }
      })
    },
    {
      id: uuid(),
      description: 'Permission is deleted with force option as true',
      input: async () => ({
        permission_id: setup.instance.permissions[0].id,
        query: { force: true }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Permission param id is malformed',
      input: async () => ({
        permission_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        query: { force: true }
      })
    },
    {
      id: uuid(),
      description: 'Permission was not found',
      input: async () => ({
        permission_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111'
      })
    },
    {
      id: uuid(),
      description: 'Permission find throws error',
      input: async () => ({
        permission_id: setup.instance.permissions[0].id
      })
    },
    {
      id: uuid(),
      description: 'Permission delete throws error',
      input: async () => ({
        permission_id: setup.instance.permissions[0].id
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Permission was not found' && is_mocked) {
      return jest.spyOn(Permission, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Permission find throws error') {
      return jest.spyOn(Permission, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Permission delete throws error') {
      return jest.spyOn(Permission, 'findByPk').mockResolvedValue({
        destroy: payload => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Permission, 'findByPk').mockResolvedValue({
        destroy: async payload => {
          if (payload.force) {
            return [];
          } else {
            const now = new Date().toISOString();
            setup.instance.permissions[0].updated_at = now;
            setup.instance.permissions[0].deleted_at = now;
            return [setup.instance.permissions[0]];
          }
        }
      });
    }
  }
};

module.exports.scenario = scenario;

module.exports.setup = setup;
