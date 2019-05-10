import uuid from 'uuid/v4';
import setup_factory from './index';
import db from "src/db/models";
import { is } from '@playscode/fns';

const is_mocked = JSON.parse(process.env.MOCK);
const setup = setup_factory(db, is_mocked), scenario = {};
const { User } = db.sequelize.models;

// ----------------------------------------------------------------------------

scenario.get_users = {
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
      description: "query sent is: { search: { username: 'ccccc' } }",
      input: async () => ({ search: { username: 'ccccc' } })
    },
    {
      id: uuid(),
      description: "query sent is: { search: { username: { like: '%vvv%' } } }",
      input: async () => ({ search: { username: { like: '%vvv%' } } })
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
      description: 'User search action throw error',
      input: async () => ({ search: { username: { eq: 'ssss' } } })
    }
  ],
  mock: async ({ input, fail, stage }) => {
    if (stage === 'User search action throw error') {
      return jest.spyOn(User, 'findAll')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (!fail && is_mocked) {
      return jest.spyOn(User, 'findAll')
        .mockResolvedValue([]);
    }
  }
};

scenario.create_users = {
  pass: [
    {
      id: uuid(),
      description: 'Values are sent as array',
      input: async () => ({
        values: [{
          employee_id: null,
          username: 'bingo',
          password: 'mdmdmd'
        }]
      })
    },
    {
      id: uuid(),
      description: 'Values are sent as object',
      input: async () => ({
        values: {
          employee_id: null,
          username: 'bingo',
          password: 'mdmdmd'
        }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'Query validation fail',
      input: async () => ({
        values: {
          employee_id: null,
          username: '',
          password: 'mdmdmd'
        }
      })
    },
    {
      id: uuid(),
      description: 'Action create throw error',
      input: async () => ({
        values: {
          employee_id: null,
          username: 'bingo',
          password: 'nanana'
        }
      })
    }
  ],
  mock: async ({ input, fail, stage }) => {
    if (stage === 'Action create throw error' && is_mocked) {
      return jest.spyOn(User, 'createMany')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (!fail && is_mocked) {
      return jest.spyOn(User, 'createMany')
        .mockImplementation(async (values, options) => {
        if (Array.isArray(values)) {
          return values.reduce((initial, values) => {
            initial.push(User.build(values, options));
            return initial;
          }, []);
        } else {
          return User.build(values, options);
        }
      });
    }
  },
};

scenario.get_user = {
  pass: [
    {
      id: uuid(),
      description: 'User is found',
      input: async () => ({ user_id: setup.instance.users[0].id })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'User id param is malformed',
      input: async () => ({
        user_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s'
      })
    },
    {
      id: uuid(),
      description: 'User is not found',
      input: async () => ({
        user_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111'
      })
    },
    {
      id: uuid(),
      description: 'User was trying to be found',
      input: async () => ({
        user_id: setup.instance.users[0].id
      })
    },
  ],
  mock: async ({ input, fail, stage }) => {
    if (stage === 'User is not found' && is_mocked) {
      return jest.spyOn(User, 'findByPk').mockResolvedValue(null);
    }
    if (stage === 'User was trying to be found') {
      return jest.spyOn(User, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (!fail && is_mocked) {
      return jest.spyOn(User, 'findByPk')
        .mockResolvedValue(setup.instance.users[0]);
    }
  }
};

scenario.update_user = {
  pass: [
    {
      id: uuid(),
      description: 'User is updated',
      input: async () => ({
        user_id: setup.instance.users[0].id,
        values: { username: 'User A' }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'User id param is malformed',
      input: async () => ({
        user_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        values: { username: 'User A' }
      })
    },
    {
      id: uuid(),
      description: 'User is not found',
      input: async () => ({
        user_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        values: { username: 'User A' }
      })
    },
    {
      id: uuid(),
      description: 'User was trying to be found',
      input: async () => ({
        user_id: setup.instance.users[0].id,
        values: { username: 'User A' }
      })
    },
    {
      id: uuid(),
      description: 'User was trying to be updated',
      input: async () => ({
        user_id: setup.instance.users[0].id,
        values: { username: 'User A' }
      })
    },
  ],
  mock: async ({ input, fail, stage }) => {
    if (stage === 'User is not found' && is_mocked) {
      return jest.spyOn(User, 'findByPk').mockResolvedValue(null);
    }
    if (stage === 'User was trying to be retrieved') {
      return jest.spyOn(User, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (stage === 'User was trying to be updated') {
      return jest.spyOn(User, 'findByPk').mockResolvedValue({
        update: async payload => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(User, 'findByPk').mockResolvedValue({
        update: async (payload, options) => User.build({
          ...setup.instance.users[0].dataValues,
          ...payload
        }, options)
      });
    }
  }
};

scenario.delete_user = {
  pass: [
    {
      id: uuid(),
      description: 'User is deleted without options',
      input: async () => ({
        user_id: setup.instance.users[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'User is deleted using force option as true',
      input: async () => ({
        user_id: setup.instance.users[0].id,
        query: { force: true }
      })
    },
    {
      id: uuid(),
      description: 'User is deleted using force option as false',
      input: async () => ({
        user_id: setup.instance.users[0].id,
        query: { force: false }
      })
    },
  ],
  fail: [
    {
      id: uuid(),
      description: 'User id param is malformed',
      input: async () => ({
        user_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'User is not found',
      input: async () => ({
        user_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'User was trying to be found',
      input: async () => ({
        user_id: setup.instance.users[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'User was trying to be removed',
      input: async () => ({
        user_id: setup.instance.users[0].id,
        query: {}
      })
    },
  ],
  mock: async ({ input, fail, stage }) => {
    if (stage === 'User is not found' && is_mocked) {
      return jest.spyOn(User, 'findByPk').mockResolvedValue(null);
    }
    if (stage === 'User was trying to be found') {
      return jest.spyOn(User, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (stage === 'User was trying to be removed') {
      return jest.spyOn(User, 'findByPk').mockResolvedValue({
        destroy: async payload => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(User, 'findByPk').mockResolvedValue({
        destroy: async payload => {
          if (payload.force) {
            return [];
          } else {
            setup.instance.users[0].deleted_at = new Date().toISOString();
            return setup.instance.users[0];
          }
        }
      });
    }
  }
};

// ----------------------------------------------------------------------------

scenario.get_roles = {
  pass: [
    {
      id: uuid(),
      description: "Query is: empty",
      input: async () => ({
        user_id: setup.instance.users[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: "Query is: name='dknd'",
      input: async () => ({
        user_id: setup.instance.users[0].id,
        query: { search: { name: 'dknd' } }
      })
    },
    {
      id: uuid(),
      description: "Query is: name like %disk%",
      input: async () => ({
        user_id: setup.instance.users[0].id,
        query: { search: { name: { like: '%disk%' } } }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'User param id validation fail',
      input: async () => ({
        user_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'User is not found',
      input: async () => ({
        user_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'User was trying to be found',
      input: async () => ({
        user_id: setup.instance.users[0].id,
        query: {}
      })
    },
    {
      id: uuid(),
      description: 'Roles were trying to be found',
      input: async () => ({
        user_id: setup.instance.users[0].id,
        query: {}
      })
    }
  ],
  mock: async ({ input, fail, stage }) => {
    if (fail && stage === 'User is not found') {
      return jest.spyOn(User, 'findByPk')
        .mockResolvedValue(null);
    }
    if (fail && stage === 'User was trying to be found') {
      return jest.spyOn(User, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (fail && stage === 'Roles were trying to be found') {
      return jest.spyOn(User, 'findByPk').mockResolvedValue({
        getRoles: async (options) => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(User, 'findByPk').mockResolvedValue({
        getRoles: async payload => setup.instance.roles
      });
    }
  }
};

scenario.set_roles = {
  pass: [
    {
      id: uuid(),
      description: "Roles are set",
      input: async () => ({
        user_id: setup.instance.users[0].id,
        roles: setup.instance.roles.map(role => role.id)
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'User param id malformed',
      input: async () => ({
        user_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
        roles: setup.instance.roles.map(role => role.id)
      })
    },
    {
      id: uuid(),
      description: 'Roles ids malformed',
      input: async () => ({
        user_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        roles: [
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s',
          '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111s'
        ]
      })
    },
    {
      id: uuid(),
      description: 'User is not found',
      input: async () => ({
        user_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aefc111',
        roles: setup.instance.roles.map(role => role.id)
      })
    },
    {
      id: uuid(),
      description: 'User was trying to be found',
      input: async () => ({
        user_id: setup.instance.users[0].id,
        roles: setup.instance.roles.map(role => role.id)
      })
    },
    {
      id: uuid(),
      description: "Roles cannot be set",
      input: async () => ({
        user_id: setup.instance.users[0].id,
        roles: setup.instance.roles.map(role => role.id)
      })
    },
  ],
  mock: async ({ input, fail, stage }) => {
    if (stage === 'User is not found' && is_mocked) {
      return jest.spyOn(User, 'findByPk')
        .mockResolvedValue(null);
    }
    if (stage === 'User was trying to be found') {
      return jest.spyOn(User, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (stage === 'Roles cannot be set') {
      return jest.spyOn(User, 'findByPk').mockResolvedValue({
        addRoles: async (roles) => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(User, 'findByPk').mockResolvedValue({
        addRoles: async payload => []
      });
    }
  }
};

scenario.get_role = {
  pass: [
    {
      id: uuid(),
      description: "Role is found",
      input: async () => ({
        user_id: setup.instance.users[0].id,
        role_id: setup.instance.roles[0].id
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'User param id is invalid',
      input: async () => ({
        user_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
        role_id: setup.instance.roles[0].id
      })
    },
    {
      id: uuid(),
      description: 'Role param id is invalid',
      input: async () => ({
        user_id: setup.instance.users[0].id,
        role_id: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefcaaaaaa'
      })
    },
    {
      id: uuid(),
      description: 'User is not found',
      input: async () => ({
        user_id: setup.instance.users[0].id,
        role_id: setup.instance.roles[0].id
      })
    },
    {
      id: uuid(),
      description: 'Role is not found',
      input: async () => ({
        user_id: setup.instance.users[0].id,
        role_id: setup.instance.roles[0].id
      })
    },
    {
      id: uuid(),
      description: 'User was trying to be found',
      input: async () => ({
        user_id: setup.instance.users[0].id,
        role_id: setup.instance.roles[0].id
      })
    },
    {
      id: uuid(),
      description: 'Role was trying to be found',
      input: async () => ({
        user_id: setup.instance.users[0].id,
        role_id: setup.instance.roles[0].id
      })
    }
  ],
  mock: async ({ input, fail, stage }) => {
    if (fail && stage === 'User is not found') {
      return jest.spyOn(User, 'findByPk')
        .mockResolvedValue(null);
    }
    if (fail && stage === 'Role is not found') {
      return jest.spyOn(User, 'findByPk').mockResolvedValue({
        getRoles: async (options) => null
      });
    }
    if (fail && stage === 'User was trying to be found') {
      return jest.spyOn(User, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (fail && stage === 'Role was trying to be found') {
      return jest.spyOn(User, 'findByPk').mockResolvedValue({
        getRoles: async (options) => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(User, 'findByPk').mockResolvedValue({
        getRoles: async (options) => setup.instance.roles[0]
      });
    }
  }
};

scenario.update_role = {
  pass: [
    {
      id: uuid(),
      description: "Role is found",
      input: async () => ({
        user_id: setup.instance.users[0].id,
        role_id: setup.instance.roles[0].id,
        values: { extra: { units: 20 } }
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'User param id is invalid',
      input: async () => ({
        user_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
        role_id: setup.instance.roles[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Role param id is invalid',
      input: async () => ({
        user_id: setup.instance.users[0].id,
        role_id: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefcaaaaaa',
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'User is not found',
      input: async () => ({
        user_id: setup.instance.users[0].id,
        role_id: setup.instance.roles[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Role is not found',
      input: async () => ({
        user_id: setup.instance.users[0].id,
        role_id: setup.instance.roles[0].id,
        values: { extra: { units: 21 } }
      })
    },
    {
      id: uuid(),
      description: 'User was trying to be found',
      input: async () => ({
        user_id: setup.instance.users[0].id,
        role_id: setup.instance.roles[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Role was trying to be found',
      input: async () => ({
        user_id: setup.instance.users[0].id,
        role_id: setup.instance.roles[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Role was trying to be updated',
      input: async () => ({
        user_id: setup.instance.users[0].id,
        role_id: setup.instance.roles[0].id,
        values: { extra: { units: 20 } }
      })
    }
  ],
  mock: async ({ input, fail, stage }) => {
    if (fail && stage === 'User is not found') {
      return jest.spyOn(User, 'findByPk')
        .mockResolvedValue(null);
    }
    if (fail && stage === 'Role is not found') {
      return jest.spyOn(User, 'findByPk').mockResolvedValue({
        getRoles: async (options) => null
      });
    }
    if (fail && stage === 'User was trying to be found') {
      return jest.spyOn(User, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (fail && stage === 'Role was trying to be found') {
      return jest.spyOn(User, 'findByPk').mockResolvedValue({
        getRoles: async (options) => {
          throw new Error('error mocked.');
        }
      });
    }
    if (fail && stage === 'Role was trying to be updated') {
      return jest.spyOn(User, 'findByPk').mockResolvedValue({
        getRoles: async (options) => ({
          UserRoles: {
            update: async (uuid, options) => {
              throw new Error('error mocked.');
            }
          }
        }),
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(User, 'findByPk').mockResolvedValue({
        getRoles: async (options) => ({
          UserRoles: {
            update: async (values, options) => setup.instance.roles[0]
          }
        }),
      });
    }
  }
};

scenario.remove_role = {
  pass: [
    {
      id: uuid(),
      description: "Role is found",
      input: async () => ({
        user_id: setup.instance.users[0].id,
        role_id: setup.instance.roles[0].id
      })
    }
  ],
  fail: [
    {
      id: uuid(),
      description: 'User param id is invalid',
      input: async () => ({
        user_id: '11bf5b37-e0b1-42e0-8dcf-dc8c4aeflllllll',
        role_id: setup.instance.roles[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Role param id is invalid',
      input: async () => ({
        user_id: setup.instance.users[0].id,
        role_id: '11bf5b37-e0b8-42e0-8dcf-dc8c4aefcaaaaaa',
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'User is not found',
      input: async () => ({
        user_id: setup.instance.users[0].id,
        role_id: setup.instance.roles[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Role is not found',
      input: async () => ({
        user_id: setup.instance.users[0].id,
        role_id: setup.instance.roles[0].id,
        values: { extra: { units: 21 } }
      })
    },
    {
      id: uuid(),
      description: 'User was trying to be found',
      input: async () => ({
        user_id: setup.instance.users[0].id,
        role_id: setup.instance.roles[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Role was trying to be found',
      input: async () => ({
        user_id: setup.instance.users[0].id,
        role_id: setup.instance.roles[0].id,
        values: { extra: { units: 20 } }
      })
    },
    {
      id: uuid(),
      description: 'Role was trying to be removed',
      input: async () => ({
        user_id: setup.instance.users[0].id,
        role_id: setup.instance.roles[0].id,
        values: { extra: { units: 20 } }
      })
    }
  ],
  mock: async ({ input, fail, stage }) => {
    if (fail && stage === 'User is not found') {
      return jest.spyOn(User, 'findByPk')
        .mockResolvedValue(null);
    }
    if (fail && stage === 'Role is not found') {
      return jest.spyOn(User, 'findByPk').mockResolvedValue({
        getRoles: async (options) => null
      });
    }
    if (fail && stage === 'User was trying to be found') {
      return jest.spyOn(User, 'findByPk')
        .mockRejectedValue(new Error('error mocked.'));
    }
    if (fail && stage === 'Role was trying to be found') {
      return jest.spyOn(User, 'findByPk').mockResolvedValue({
        getRoles: async (options) => {
          throw new Error('error mocked.');
        }
      });
    }
    if (fail && stage === 'Role was trying to be removed') {
      return jest.spyOn(User, 'findByPk').mockResolvedValue({
        getRoles: async (options) => ({}),
        removeRole: async (uuid, options) => {
          throw new Error('error mocked.');
        }
      });
    }
    if (!fail && is_mocked) {
      return jest.spyOn(User, 'findByPk').mockResolvedValue({
        getRoles: (payload, options) => Promise.resolve({}),
        removeRole: async (payload, options) => setup.instance.roles[0]
      });
    }
  }
};

// ----------------------------------------------------------------------------

module.exports.scenario = scenario;

module.exports.setup = setup;
