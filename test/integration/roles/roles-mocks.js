const onModule = fn => criteria => {
  let actions = Object.keys(criteria).reduce((acc, key) => {
    if (criteria[key]) {
      acc[key] = fn;
    } else {
      acc[key] = () => ({});
    }
    return acc;
  }, {});

  jest.doMock('src/core/roles/roles-repository', () => database => actions);
}

module.exports = {
  asError: onModule(() => { throw new Error('error mocked.') }),
  asNotFound: onModule(() => null),
  // -------------------------------------------------------
  rolesAreFiltered: ({ setup }) => {
    let index = 0;
    jest.doMock('src/core/roles/roles-repository', () => db => ({
      findAll: async options => {
        index += 1;

        if (index === 1) {
          return setup.instance.roles;
        }

        if (index === 2) {
          return setup.instance.roles.filter(
            role => role.name === 'Tester'
          );
        }

        if (index === 3) {
          return setup.instance.roles.filter(
            role => role.name.includes('min')
          );
        }

        if ([4,5].includes(index)) {
          let role = setup.instance.roles.find(
            role => role.name.includes('Admin')
          );
          return [{
            ...role.dataValues,
            permissions: await role.getPermissions()
          }];
        }

        if ([6,7].includes(index)) {
          let role = setup.data.role.find(
            role => role.name.includes('Admin')
          );
          return [{
            id: role.id,
            code: role.code,
            name: role.name
          }];
        }

        if (index === 8) {
          return setup.instance.roles.slice(0, 2);
        }

        if ([9,10].includes(index)) {
          return setup.instance.roles.slice(1);
        }

        return [];
      }
    }));
  },
  roleIsCreated: ({ setup }) => {
    jest.doMock('src/core/roles/roles-repository', () => db => ({
      create: data => setup.models.Role.build(data)
    }));
  },
  roleIsFound: ({ setup }) => {
    jest.doMock('src/core/roles/roles-repository', () => db => ({
      findByPk: ({ role_id, options }) => {
        return setup.instance.roles.find(
          role => role.id === role_id
        );
      }
    }));
  },
  roleIsUpdated: ({ setup }) => {
    jest.doMock('src/core/roles/roles-repository', () => db => ({
      findByPk: async ({ role_id, options }) => {
        return setup.instance.roles.find(
          role => role.id === role_id
        );
      },
      update: async ({ role_id, data }) => {
        let role = setup.instance.roles.find(role => role.id === role_id);
        return {
          ...role.dataValues,
          ...data,
          updated_at: new Date().toISOString()
        }
      }
    }));
  },
  roleIsDeleted: ({ setup }) => {
    let index = 0;
    jest.doMock('src/core/roles/roles-repository', () => db => ({
      findByPk: ({ role_id, options }) => {
        index += 1;
        if (index === 1) {
          return setup.instance.roles.find(
            role => role.id === role_id
          );
        } else {
          return null;
        }
      },
      destroy: ({ role_id, options }) => {
        let role = setup.instance.roles.find(role => role.id === role_id);
        let now = new Date().toISOString();
        role.updated_at = now;
        role.deleted_at = now;
        return role;
      }
    }));
  },
  // -------------------------------------------------------
  permissionsAreFiltered: ({ setup }) => {
    let index = 0;
    jest.doMock('src/core/roles/roles-repository', () => db => ({
      findByPk: ({ role_id, options }) => {
        return setup.instance.roles.find(
          role => role.id === role_id
        );
      },
      getPermissions: async ({ role, options }) => {
        index += 1;

        let _role = setup.instance.roles[0];
        let permissions = await _role.getPermissions({});

        if ([1].includes(index)) {
          return permissions.slice(0);
        }
        if ([2].includes(index)) {
          return permissions.filter(
            permission => permission.name === 'get roles'
          );
        }
        if ([3].includes(index)) {
          return permissions.filter(
            permission => permission.name.includes('roles')
          );
        }
        if ([4].includes(index)) {
          return permissions.slice(0, 2);
        }
        if ([5].includes(index)) {
          return permissions.slice(1, 2);
        }
        if ([6,7].includes(index)) {
          return permissions.slice(0, 1).map(permission => {
            return {
              id: permission.id,
              code: permission.code,
              name: permission.name,
              RolePermission: []
            }
          });
        }
        return [];
      }
    }))
  },
  permissionsAreAdded: ({ setup }) => {
    jest.doMock('src/core/roles/roles-repository', () => db => ({
      findByPk: ({ role_id, options }) => {
        return setup.instance.roles.find(
          role => role.id === role_id
        );
      },
      addPermissions: ({ role_id, permissions }) => {
        return permissions.map(permission_id => {
          return {
            role_id,
            permission_id,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        });
      }
    }))
  },
  permissionIsFound: ({ setup }) => {
    jest.doMock('src/core/roles/roles-repository', () => db => ({
      findByPk: ({ role_id, options }) => {
        return setup.instance.roles.find(
          role => role.id === role_id
        );
      },
      getPermission: ({ role, permission_id, options }) => {
        let permission = setup.data.permission.find(permission => permission.id === permission_id);
        let RolePermission = setup.data.role_permission.find(
          oi => oi.role_id === role.id && oi.permission_id === permission_id
        );
        return { ...permission, RolePermission };
      }
    }))
  },
  permissionIsUpdated: ({ setup }) => {
    jest.doMock('src/core/roles/roles-repository', () => db => ({
      findByPk: ({ role_id, options }) => {
        return setup.instance.roles.find(
          role => role.id === role_id
        );
      },
      getPermission: ({ role, permission_id }) => {
        let permission = setup.data.permission.find(permission => permission.id === permission_id);
        let RolePermission = setup.data.role_permission.find(
          oi => oi.role_id === role.id && oi.permission_id === permission_id
        );
        return { ...permission, RolePermission };
      },
      updatePermission: ({ role_id, permission_id, data, options }) => {
        return {
          role_id: role_id,
          permission_id: permission_id,
          ...data,
          updated_at: new Date().toISOString()
        };
      }
    }))
  },
  permissionIsRemoved: ({ setup }) => {
    let index = 0;
    jest.doMock('src/core/roles/roles-repository', () => db => ({
      findByPk: ({ role_id, options }) => {
        index += 1;
        if (index === 1) {
          return setup.instance.roles.find(
            role => role.id === role_id
          );
        } else {
          return null;
        }
      },
      getPermission: ({ role, permission_id }) => {
        let permission = setup.data.permission.find(permission => permission.id === permission_id);
        let RolePermission = setup.data.role_permission.find(
          oi => oi.role_id === role.id && oi.permission_id === permission_id
        );
        return { ...permission, RolePermission };
      },
      removePermission: ({ role_id, permission_id, options }) => {
        return {
          role_id: role_id,
          permission_id: permission_id,
          updated_at: new Date().toISOString(),
          deleted_at: new Date().toISOString()
        };
      }
    }))
  }
};
