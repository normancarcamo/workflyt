const onModule = fn => criteria => {
  let actions = Object.keys(criteria).reduce((acc, key) => {
    if (criteria[key]) {
      acc[key] = fn;
    } else {
      acc[key] = () => ({});
    }
    return acc;
  }, {});

  jest.doMock('src/core/users/users-repository', () => database => actions);
}

function compare(name) {
  return function(a, b) {
    if (a[name].toLowerCase() < b[name].toLowerCase())
      return -1;
    if (a[name].toLowerCase() > b[name].toLowerCase())
      return 1;
    return 0;
  }
}

module.exports = {
  asError: onModule(() => { throw new Error('error mocked.') }),
  asNotFound: onModule(() => null),
  bcryptThrow: () => {
    jest.doMock('bcrypt', () => ({
      hash: async (password, salt) => {
        throw new Error('error mocked.');
      }
    }));
  },
  // --------------------------------------------------------------------------
  usersAreFiltered: ({ setup }) => {
    let index = 0;
    jest.doMock('src/core/users/users-repository', () => db => ({
      findAll: async options => {
        index += 1;

        if (index === 1) {
          return setup.instance.users.slice(0);
        }

        if (index === 2) {
          return setup.instance.users.filter(
            user => user.username === 'lberrios'
          );
        }

        if (index === 3) {
          return setup.instance.users.filter(
            user => user.username.includes('bri')
          );
        }

        if (index === 4) {
          return setup.instance.users.slice(0, 2);
        }

        if (index === 5) {
          return setup.instance.users.slice(1);
        }

        if (index === 6) {
          return setup.instance.users.slice(1, 3);
        }

        return [];
      }
    }));
  },
  createRepeatedError: ({ setup, cycle }) => {
    jest.doMock('src/core/users/users-repository', () => db => ({
      create: () => {
        if (cycle._id === 1) {
          return setup.models.User.build({
            firstname: 'demo1',
            lastname: 'demo2'
          });
        } else {
          throw new Error('error mocked.');
        }
      }
    }));
  },
  userIsCreated: ({ setup }) => {
    let index = 0;
    jest.doMock('src/core/users/users-repository', () => db => ({
      findByUsername: () => null,
      create: data => {
        index += 1;
        return setup.models.User.build({
          firstname: 'Steve',
          lastname: index === 1 ? 'Knoxville' : 'Tow',
          created_by: index === 1 ? null : setup.instance.users[0].id,
          updated_by: index === 1 ? null : setup.instance.users[0].id
        });
      }
    }));
  },
  userIsFound: ({ setup, cycle }) => {
    jest.doMock('src/core/users/users-repository', () => db => ({
      findByPk: async ({ user_id }) => {
        return setup.instance.users.find(user => user.id === user_id);
      }
    }));
  },
  userIsUpdated: ({ setup }) => {
    jest.doMock('src/core/users/users-repository', () => db => ({
      findByPk: async ({ user_id }) => {
        return setup.instance.users.find(user => user.id === user_id);
      },
      update: async ({ user_id, data, options }) => {
        let user = setup.data.user.slice(0).find(user => user.id === user_id);
        return {
          ...user,
          ...data,
          updated_at: new Date().toISOString()
        };
      }
    }));
  },
  userIsDeleted: ({ setup, cycle }) => {
    let index = 0;
    jest.doMock('src/core/users/users-repository', () => db => ({
      findByPk: async ({ user_id }) => {
        index += 1;
        if (index === 1) {
          return setup.instance.users.find(user => user.id === user_id);
        } else {
          return null;
        }
      },
      destroy: ({ user_id, options }) => {
        let user = setup.data.user.slice(0).find(user => user.id === user_id);
        return {
          ...user,
          updated_at: new Date().toISOString(),
          deleted_at: new Date().toISOString()
        };
      },
    }));
  },
  userIsRejected: ({ setup }) => {
    jest.doMock('src/core/users/users-repository', () => db => ({
      findByUsername: () => null,
      create: data => {
        throw new Error('error mocked.');
      }
    }));
  },
  // --------------------------------------------------------------------------
  rolesAreFiltered: ({ setup }) => {
    let index = 0;
    jest.doMock('src/core/users/users-repository', () => db => ({
      findByPk: ({ user_id, options }) => {
        return setup.instance.users.find(
          user => user.id === user_id
        );
      },
      getRoles: async ({ user, options }) => {
        index += 1;

        let _user = setup.instance.users[0];
        let roles = await _user.getRoles({});

        if ([1].includes(index)) {
          return roles;
        }

        if ([2].includes(index)) {
          return roles.filter(
            role => role.name === options.name
          );
        }

        if ([3].includes(index)) {
          return roles.slice(0, 1);
        }

        if ([4].includes(index)) {
          return roles.slice(0, 2);
        }

        if ([5].includes(index)) {
          return roles.slice(0).sort(compare('name'));
        }

        if ([6].includes(index)) {
          return roles.slice(0).sort(compare('name')).reverse();
        }

        return [];
      }
    }))
  },
  rolesAreAdded: ({ setup }) => {
    jest.doMock('src/core/users/users-repository', () => db => ({
      findByPk: ({ user_id, options }) => {
        return setup.instance.users.find(
          user => user.id === user_id
        );
      },
      addRoles: ({ user_id, roles }) => {
        return roles.map(role_id => {
          return {
            user_id,
            role_id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        });
      }
    }))
  },
  roleIsFound: ({ setup }) => {
    jest.doMock('src/core/users/users-repository', () => db => ({
      findByPk: ({ user_id, options }) => {
        return setup.instance.users.find(
          user => user.id === user_id
        );
      },
      getRole: ({ user, role_id, options }) => {
        let role = setup.data.role.find(role => role.id === role_id);
        let UserRole = setup.data.user_role.find(
          oi => oi.user_id === user.id && oi.role_id === role_id
        );
        return { ...role, UserRole };
      }
    }))
  },
  roleIsUpdated: ({ setup }) => {
    jest.doMock('src/core/users/users-repository', () => db => ({
      findByPk: ({ user_id, options }) => {
        return setup.instance.users.find(
          user => user.id === user_id
        );
      },
      getRole: ({ user, role_id }) => {
        let role = setup.data.role.find(role => role.id === role_id);
        let UserRole = setup.data.user_role.find(
          oi => oi.user_id === user.id && oi.role_id === role_id
        );
        return { ...role, UserRole };
      },
      updateRole: ({ user_id, role_id, data, options }) => {
        return {
          user_id: user_id,
          role_id: role_id,
          ...data,
          updated_at: new Date().toISOString()
        };
      }
    }))
  },
  roleIsRemoved: ({ setup }) => {
    let index = 0;
    jest.doMock('src/core/users/users-repository', () => db => ({
      findByPk: ({ user_id, options }) => {
        index += 1;
        if (index === 1) {
          return setup.instance.users.find(
            user => user.id === user_id
          );
        } else {
          return null;
        }
      },
      getRole: ({ user, role_id }) => {
        let role = setup.data.role.find(role => role.id === role_id);
        let UserRole = setup.data.user_role.find(
          oi => oi.user_id === user.id && oi.role_id === role_id
        );
        return { ...role, UserRole };
      },
      removeRole: ({ user_id, role_id, options }) => {
        return {
          user_id: user_id,
          role_id: role_id,
          updated_at: new Date().toISOString(),
          deleted_at: new Date().toISOString()
        };
      }
    }))
  }
};
