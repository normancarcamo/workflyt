const onModule = fn => criteria => {
  let actions = Object.keys(criteria).reduce((acc, key) => {
    if (criteria[key]) {
      acc[key] = fn;
    } else {
      acc[key] = () => ({});
    }
    return acc;
  }, {});

  jest.doMock('src/core/permissions/permissions-repository', () => database => actions);
}

module.exports = {
  asError: onModule(() => { throw new Error('error mocked.') }),
  asNotFound: onModule(() => null),
  // -------------------------------------------------------
  permissionsAreFiltered: ({ setup }) => {
    let index = 0;
    jest.doMock('src/core/permissions/permissions-repository', () => db => ({
      findAll: options => {
        index++;

        if (index === 1) {
          return setup.instance.permissions;
        }

        if (index === 2) {
          return setup.instance.permissions.filter(
            permission => permission.name === options.name
          );
        }

        if (index === 3) {
          return setup.instance.permissions.filter(
            permission => permission.name.includes(
              options.name.like.replace(/\%/g, '')
            )
          );
        }
      }
    }));
  },
  permissionIsCreated: ({ setup }) => {
    let index = 0;
    jest.doMock('src/core/permissions/permissions-repository', () => db => ({
      create: data => {
        index++;
        return setup.models.Permission.build({
          ...data,
          created_by: index === 1 ? null : data.created_by
        });
      }
    }));
  },
  permissionIsFound: ({ setup }) => {
    jest.doMock('src/core/permissions/permissions-repository', () => db => ({
      findByPk: ({ permission_id, options }) => {
        return setup.instance.permissions.find(
          permission => permission.id === permission_id
        );
      }
    }));
  },
  permissionIsUpdated: ({ setup }) => {
    jest.doMock('src/core/permissions/permissions-repository', () => db => ({
      findByPk: async ({ permission_id, options }) => {
        return setup.instance.permissions.find(
          permission => permission.id === permission_id
        );
      },
      update: async ({ permission_id, data }) => {
        let permission = setup.instance.permissions.find(
          permission => permission.id === permission_id
        );
        return {
          ...permission.dataValues,
          ...data,
          updated_at: new Date().toISOString()
        }
      }
    }));
  },
  permissionIsDeleted: ({ setup }) => {
    let index = 0;
    jest.doMock('src/core/permissions/permissions-repository', () => db => ({
      findByPk: ({ permission_id, options }) => {
        index += 1;
        if (index === 1) {
          return setup.instance.permissions.find(
            permission => permission.id === permission_id
          );
        } else {
          return null;
        }
      },
      destroy: ({ permission_id, options }) => {
        let permission = setup.instance.permissions.find(
          permission => permission.id === permission_id
        );
        let now = new Date().toISOString();
        permission.updated_at = now;
        permission.deleted_at = now;
        return permission;
      }
    }));
  }
};
