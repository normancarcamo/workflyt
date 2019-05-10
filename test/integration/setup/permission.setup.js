import uuid from 'uuid/v4';
import setup_factory from './index';
import db from "src/db/models";
import { is } from '@playscode/fns';

const is_mocked = JSON.parse(process.env.MOCK);
const setup = setup_factory(db, is_mocked), scenario = {};
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
      description: 'Query fails',
      input: async () => ({ search: null })
    },
    {
      id: uuid(),
      description: 'Search error',
      input: async () => ({ search: { name: { eq: 'model' } } })
    }
  ],
  mock: async ({ input, fail, stage }) => {
    if (fail) {
      return jest.spyOn(Permission, 'findAll')
        .mockRejectedValue(new Error('Permission find mocked error'));
    } else {
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
      description: 'Permission create throws error',
      input: async () => ({ values: { name: 'nenene' } })
    }
  ],
  mock: async ({ input, fail, stage }) => {
    if (fail && stage === 'Permission create throws error') {
      return jest.spyOn(Permission, 'createMany')
        .mockRejectedValue(new Error('Permission create mocked error'));
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
      description: 'Permission param fail',
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
    },
  ],
  mock: async ({ input, fail, stage }) => {
    if (fail && stage === 'Permission was not found') {
      return jest.spyOn(Permission, 'findByPk')
        .mockResolvedValue(null);
    }
    if (fail && stage === 'Permission find throws error') {
      return jest.spyOn(Permission, 'findByPk')
        .mockRejectedValue(new Error('Not found mock error'));
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
      description: 'Permission param fail',
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
    },
  ],
  mock: async ({ input, fail, stage }) => {
    if (fail && stage === 'Permission was not found') {
      return jest.spyOn(Permission, 'findByPk')
        .mockResolvedValue(null);
    }
    if (fail && stage === 'Permission find throws error') {
      return jest.spyOn(Permission, 'findByPk')
        .mockRejectedValue(new Error('Not found mock error'));
    }
    if (fail && stage === 'Permission update throws error') {
      return jest.spyOn(Permission, 'findByPk').mockResolvedValue({
        update: payload => Promise.reject(new Error('Update mock error'))
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
    },
    {
      id: uuid(),
      description: 'Permission is deleted without options',
      input: async () => ({
        permission_id: setup.instance.permissions[0].id
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Permission param fail',
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
    },
  ],
  mock: async ({ input, fail, stage }) => {
    if (fail && stage === 'Permission was not found') {
      return jest.spyOn(Permission, 'findByPk')
        .mockResolvedValue(null);
    }
    if (fail && stage === 'Permission find throws error') {
      return jest.spyOn(Permission, 'findByPk')
        .mockRejectedValue(new Error('Mock Error'));
    }
    if (fail && stage === 'Permission delete throws error') {
      return jest.spyOn(Permission, 'findByPk').mockResolvedValue({
        destroy: payload => Promise.reject(new Error('Mock Error'))
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
