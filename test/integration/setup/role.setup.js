import uuid from 'uuid/v4';
import setup_factory from './index';
import db from 'src/db/models';

const is_mocked = JSON.parse(process.env.MOCK);
const setup = setup_factory(db, is_mocked, 'Role'), scenario = {};
const { Role } = db.sequelize.models;

scenario.get_roles = {
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
      description: 'Query validation fail',
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
      return jest.spyOn(Role, 'findAll')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Role, 'findAll')
        .mockResolvedValue([]);
    }
  }
};

scenario.create_roles = {
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
      description: `Role is created by a specific user`,
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
      description: 'Query validation fail',
      input: async () => ({ values: { name: '' } })
    },
    {
      id: uuid(),
      description: 'Action create throw error',
      input: async () => ({ values: { name: 'demo' } })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Action create throw error') {
      return jest.spyOn(Role, 'createMany')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Role, 'createMany')
        .mockImplementation(async (values, options) => {
        if (Array.isArray(values)) {
          return values.reduce((initial, values) => {
            initial.push(Role.build(values, options));
            return initial;
          }, []);
        } else {
          return Role.build(values, options);
        }
      });
    }
  }
};

scenario.get_role = {
  pass: [
    {
      id: uuid(),
      description: 'Role is found',
      input: async () => ({ role_id: setup.instance.roles[0].id })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Role id param is malformed',
      input: async () => ({
        role_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s'
      })
    },
    {
      id: uuid(),
      description: 'Role is not found',
      input: async () => ({
        role_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111'
      })
    },
    {
      id: uuid(),
      description: 'Role was trying to be found',
      input: async () => ({
        role_id: setup.instance.roles[0].id
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Role is not found' && is_mocked) {
      return jest.spyOn(Role, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Role was trying to be found') {
      return jest.spyOn(Role, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Role, 'findByPk')
        .mockResolvedValue(setup.instance.roles[0]);
    }
  }
};

scenario.update_role = {
  pass: [
    {
      id: uuid(),
      description: 'Role is updated',
      input: async () => ({
        role_id: setup.instance.roles[0].id,
        values: { name: 'Role A' }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Role id param is malformed',
      input: async () => ({
        role_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        values: { name: 'Role A' }
      })
    },
    {
      id: uuid(),
      description: 'Role is not found',
      input: async () => ({
        role_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        values: { name: 'Role A' }
      })
    },
    {
      id: uuid(),
      description: 'Role was trying to be found',
      input: async () => ({
        role_id: setup.instance.roles[0].id,
        values: { name: 'Role A' }
      })
    },
    {
      id: uuid(),
      description: 'Role was trying to be updated',
      input: async () => ({
        role_id: setup.instance.roles[0].id,
        values: { name: 'Role A' }
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Role is not found' && is_mocked) {
      return jest.spyOn(Role, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Role was trying to be found') {
      return jest.spyOn(Role, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Role was trying to be updated') {
      return jest.spyOn(Role, 'findByPk').mockResolvedValue({
        update: async payload => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Role, 'findByPk').mockResolvedValue({
        update: async (payload, options) => Role.build({
          ...setup.instance.roles[0].dataValues,
          ...payload
        }, options)
      });
    }
  }
};

scenario.delete_role = {
  pass: [
    {
      id: uuid(),
      description: 'Role is deleted without options',
      input: async () => ({
        role_id: setup.instance.roles[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Role is deleted using force option as true',
      input: async () => ({
        role_id: setup.instance.roles[0].id,
        query: { force: true }
      })
    },
    {
      id: uuid(),
      description: 'Role is deleted using force option as false',
      input: async () => ({
        role_id: setup.instance.roles[0].id,
        query: { force: false }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Role id param is malformed',
      input: async () => ({
        role_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Role is not found',
      input: async () => ({
        role_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Role was trying to be found',
      input: async () => ({
        role_id: setup.instance.roles[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Role was trying to be removed',
      input: async () => ({
        role_id: setup.instance.roles[0].id,
        query: {}
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Role is not found' && is_mocked) {
      return jest.spyOn(Role, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Role was trying to be found') {
      return jest.spyOn(Role, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Role was trying to be removed') {
      return jest.spyOn(Role, 'findByPk').mockResolvedValue({
        destroy: async payload => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Role, 'findByPk').mockResolvedValue({
        destroy: async payload => {
          if (payload.force) {
            return [];
          } else {
            setup.instance.roles[0].deleted_at = new Date().toISOString();
            return setup.instance.roles[0];
          }
        }
      });
    }
  }
};

scenario.get_permissions = {
  pass: [
    {
      id: uuid(),
      description: 'Query is: empty',
      input: async () => ({
        role_id: setup.instance.roles[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Query is: name=dknd',
      input: async () => ({
        role_id: setup.instance.roles[0].id,
        query: { search: { name: 'dknd' } }
      })
    },
    {
      id: uuid(),
      description: 'Query is: name like %disk%',
      input: async () => ({
        role_id: setup.instance.roles[0].id,
        query: { search: { name: { like: '%disk%' } } }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Role param id is malformed',
      input: async () => ({
        role_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Role is not found',
      input: async () => ({
        role_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Role was trying to be found',
      input: async () => ({
        role_id: setup.instance.roles[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Permissions were trying to be found',
      input: async () => ({
        role_id: setup.instance.roles[0].id,
        query: {}
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Role is not found' && is_mocked) {
      return jest.spyOn(Role, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Role was trying to be found') {
      return jest.spyOn(Role, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Permissions were trying to be found') {
      return jest.spyOn(Role, 'findByPk').mockResolvedValue({
        getPermissions: async (options) => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Role, 'findByPk').mockResolvedValue({
        getPermissions: async payload => setup.instance.permissions
      });
    }
  }
};

scenario.set_permissions = {
  pass: [
    {
      id: uuid(),
      description: 'Permissions are set',
      input: async () => ({
        role_id: setup.instance.roles[0].id,
        permissions: [ setup.instance.permissions[0].id ]
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Role param id is malformed',
      input: async () => ({
        role_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        permissions: [ setup.instance.permissions[0].id ]
      })
    },
    {
      id: uuid(),
      description: 'Permissions ids are malformed',
      input: async () => ({
        role_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        permissions: [
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s'
        ]
      })
    },
    {
      id: uuid(),
      description: 'Role is not found',
      input: async () => ({
        role_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        permissions: [ setup.instance.permissions[0].id ]
      })
    },
    {
      id: uuid(),
      description: 'Role was trying to be found',
      input: async () => ({
        role_id: setup.instance.roles[0].id,
        permissions: [ setup.instance.permissions[0].id ]
      })
    },
    {
      id: uuid(),
      description: 'Permissions cannot be set',
      input: async () => ({
        role_id: setup.instance.roles[0].id,
        permissions: [ setup.instance.permissions[0].id ]
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Role is not found' && is_mocked) {
      return jest.spyOn(Role, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Role was trying to be found') {
      return jest.spyOn(Role, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Permissions cannot be set') {
      return jest.spyOn(Role, 'findByPk').mockResolvedValue({
        addPermissions: async (permissions) => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Role, 'findByPk').mockResolvedValue({
        addPermissions: async payload => []
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
        role_id: setup.instance.roles[0].id,
        permission_id: setup.instance.permissions[0].id
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Role param id is malformed',
      input: async () => ({
        role_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
        permission_id: setup.instance.permissions[0].id
      })
    },
    {
      id: uuid(),
      description: 'Permission param id is malformed',
      input: async () => ({
        role_id: setup.instance.roles[0].id,
        permission_id: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefcaaaaaa'
      })
    },
    {
      id: uuid(),
      description: 'Role is not found',
      input: async () => ({
        role_id: 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d',
        permission_id: setup.instance.permissions[0].id
      })
    },
    {
      id: uuid(),
      description: 'Permission is not found',
      input: async () => ({
        role_id: setup.instance.roles[0].id,
        permission_id: 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d'
      })
    },
    {
      id: uuid(),
      description: 'Role was trying to be found',
      input: async () => ({
        role_id: setup.instance.roles[0].id,
        permission_id: setup.instance.permissions[0].id
      })
    },
    {
      id: uuid(),
      description: 'Permission was trying to be found',
      input: async () => ({
        role_id: setup.instance.roles[0].id,
        permission_id: setup.instance.permissions[0].id
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Role is not found' && is_mocked) {
      return jest.spyOn(Role, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Permission is not found') {
      return jest.spyOn(Role, 'findByPk').mockResolvedValue({
        getPermissions: async (options) => null
      });
    }
    if (description === 'Role was trying to be found') {
      return jest.spyOn(Role, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Permission was trying to be found') {
      return jest.spyOn(Role, 'findByPk').mockResolvedValue({
        getPermissions: async (options) => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Role, 'findByPk').mockResolvedValue({
        getPermissions: async (options) => {
          return setup.instance.permissions[0]
        }
      });
    }
  }
};

scenario.update_permission = {
  pass: [
    {
      id: uuid(),
      description: 'Permission is found',
      input: async () => ({
        role_id: setup.instance.roles[0].id,
        permission_id: setup.instance.permissions[0].id,
        values: { extra: { units: 20 } }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Role param id is malformed',
      input: async () => ({
        role_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
        permission_id: setup.instance.permissions[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Permission param id is malformed',
      input: async () => ({
        role_id: setup.instance.roles[0].id,
        permission_id: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefcaaaaaa',
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Role is not found',
      input: async () => ({
        role_id: 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d',
        permission_id: setup.instance.permissions[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Permission is not found',
      input: async () => ({
        role_id: setup.instance.roles[0].id,
        permission_id: 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d',
        values: { extra: { units: 21 } }
      })
    },
    {
      id: uuid(),
      description: 'Role was trying to be found',
      input: async () => ({
        role_id: setup.instance.roles[0].id,
        permission_id: setup.instance.permissions[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Permission was trying to be found',
      input: async () => ({
        role_id: setup.instance.roles[0].id,
        permission_id: setup.instance.permissions[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Permission was trying to be updated',
      input: async () => ({
        role_id: setup.instance.roles[0].id,
        permission_id: setup.instance.permissions[0].id,
        values: { extra: { units: 20 } }
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Role is not found' && is_mocked) {
      return jest.spyOn(Role, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Permission is not found' && is_mocked) {
      return jest.spyOn(Role, 'findByPk').mockResolvedValue({
        getPermissions: async (options) => null
      });
    }
    if (description === 'Role was trying to be found') {
      return jest.spyOn(Role, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Permission was trying to be found') {
      return jest.spyOn(Role, 'findByPk').mockResolvedValue({
        getPermissions: async (options) => {
          throw new Error('error mocked.');
        }
      });
    }
    if (description === 'Permission was trying to be updated') {
      return jest.spyOn(Role, 'findByPk').mockResolvedValue({
        getPermissions: async payload => ({
          RolePermissions: {
            update: async (payload, options) => {
              throw new Error('error mocked.');
            }
          }
        }),
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Role, 'findByPk').mockResolvedValue({
        getPermissions: async payload => ({
          RolePermissions: {
            update: async (payload, options) => {
              return setup.instance.permissions
            }
          }
        }),
      });
    }
  }
};

scenario.remove_permission = {
  pass: [
    {
      id: uuid(),
      description: 'Permission is found',
      input: async () => ({
        role_id: setup.instance.roles[0].id,
        permission_id: setup.instance.permissions[0].id
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Role param id is malformed',
      input: async () => ({
        role_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
        permission_id: setup.instance.permissions[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Permission param id is malformed',
      input: async () => ({
        role_id: setup.instance.roles[0].id,
        permission_id: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefcaaaaaa',
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Role is not found',
      input: async () => ({
        role_id: 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d',
        permission_id: setup.instance.permissions[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Permission is not found',
      input: async () => ({
        role_id: setup.instance.roles[0].id,
        permission_id: 'f5eacdd2-95e8-4fa9-a19a-7f581a5ee67d',
        values: { extra: { units: 21 } }
      })
    },
    {
      id: uuid(),
      description: 'Role was trying to be found',
      input: async () => ({
        role_id: setup.instance.roles[0].id,
        permission_id: setup.instance.permissions[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Permission was trying to be found',
      input: async () => ({
        role_id: setup.instance.roles[0].id,
        permission_id: setup.instance.permissions[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Permission was trying to be removed',
      input: async () => ({
        role_id: setup.instance.roles[0].id,
        permission_id: setup.instance.permissions[0].id,
        values: { extra: { units: 20 } }
      })
    }
  ],
  mock: async ({ fail, description }) => {
    if (description === 'Role is not found' && is_mocked) {
      return jest.spyOn(Role, 'findByPk')
        .mockResolvedValue(null);
    }
    if (description === 'Permission is not found' && is_mocked) {
      return jest.spyOn(Role, 'findByPk').mockResolvedValue({
        getPermissions: async (options) => null
      });
    }
    if (description === 'Role was trying to be found') {
      return jest.spyOn(Role, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (description === 'Permission was trying to be found') {
      return jest.spyOn(Role, 'findByPk').mockResolvedValue({
        getPermissions: async (options) => {
          throw new Error('error mocked.');
        }
      });
    }
    if (description === 'Permission was trying to be removed') {
      return jest.spyOn(Role, 'findByPk').mockResolvedValue({
        getPermissions: async (options) => ({}),
        removePermission: async (uuid, options) => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(Role, 'findByPk').mockResolvedValue({
        getPermissions: async (payload, options) => ({}),
        removePermission: async (payload, options) => {
          return setup.instance.permissions[0];
        }
      });
    }
  }
};

module.exports.scenario = scenario;

module.exports.setup = setup;
