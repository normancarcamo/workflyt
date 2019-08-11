module.exports = ({ schema, Datalizer }) => {
  const roleAttributes = [
    'id',
    'code',
    'name',
    'extra',
    'created_at',
    'updated_at',
    'deleted_at',
    'created_by',
    'updated_by',
    'deleted_by'
  ];

  const permissionAttributes = [
    'id',
    'code',
    'name',
    'extra',
    'created_at',
    'updated_at',
    'deleted_at',
    'created_by',
    'updated_by',
    'deleted_by'
  ];

  const roleAssociations = [ 'permissions' ];

  return Object.freeze({
    getRoles: new Datalizer({
      query: schema.QUERY({
        id: schema.UUID({ $optional: true, $deny: true }),
        code: schema.CODE({ $optional: true }),
        name: schema.TEXT_FILTER({ $optional: true }),
        extra: schema.EXTRA({ $optional: true }),
        created_at: schema.DATE_FILTER({ $optional: true }),
        updated_at: schema.DATE_FILTER({ $optional: true }),
        deleted_at: schema.DATE_FILTER({ $optional: true }),
        created_by: schema.UUID({ $optional: true }),
        updated_by: schema.UUID({ $optional: true }),
        deleted_by: schema.UUID({ $optional: true }),
        attributes: schema.ATTRIBUTES(roleAttributes),
        include: schema.INCLUDE(roleAssociations),
        paranoid: schema.BOOLEAN({ $optional: true }),
        limit: schema.LIMIT({ $optional: true }),
        offset: schema.OFFSET({ $optional: true }),
        sort_by: schema.ENUM(roleAttributes),
        order_by: schema.ORDER_BY({ $optional: true })
      }, { $max: 20 })
    }),

    createRoles: new Datalizer({
      body: schema.BODY({
        id: schema.UUID({ $optional: true, $null: true }),
        code: schema.CODE({ $optional: true }),
        name: schema.TEXT({ $empty: false, $min: 2 }),
        extra: schema.EXTRA({ $optional: true }),
        created_at: schema.DATE({ $optional: true }),
        updated_at: schema.DATE({ $optional: true }),
        deleted_at: schema.DATE({ $optional: true }),
        created_by: schema.UUID({ $optional: true }),
        updated_by: schema.UUID({ $optional: true }),
        deleted_by: schema.UUID({ $optional: true }),
      }, { $max: 10, $empty: false })
    }),

    getRole: new Datalizer({
      params: schema.PARAMS(
        { role: schema.UUID() },
        { $length: 1 }
      ),
      query: schema.QUERY({
        attributes: schema.ATTRIBUTES(roleAttributes),
        include: schema.INCLUDE(roleAssociations),
        paranoid: schema.BOOLEAN({ $optional: true })
      }, { $max: 10 })
    }),

    updateRole: new Datalizer({
      params: schema.PARAMS(
        { role: schema.UUID() },
        { $length: 1 }
      ),
      query: schema.QUERY({
        paranoid: schema.BOOLEAN({ $optional: true })
      }, { $max: 1, $optional: true }),
      body: schema.BODY({
        id: schema.UUID({ $optional: true, $deny: true }),
        code: schema.CODE({ $optional: true }),
        name: schema.TEXT({ $optional: true, $empty: false, $min: 2 }),
        extra: schema.EXTRA({ $optional: true }),
        created_at: schema.DATE({ $optional: true }),
        updated_at: schema.DATE({ $optional: true }),
        deleted_at: schema.DATE({ $optional: true }),
        created_by: schema.UUID({ $optional: true }),
        updated_by: schema.UUID({ $optional: true }),
        deleted_by: schema.UUID({ $optional: true }),
      }, { $max: 10, $empty: false })
    }),

    deleteRole: new Datalizer({
      params: schema.PARAMS(
        { role: schema.UUID() },
        { $length: 1 }
      ),
      query: schema.QUERY({
        force: schema.BOOLEAN({ $optional: true }),
        paranoid: schema.BOOLEAN({ $optional: true })
      }, { $max: 2 })
    }),

    getPermissions: new Datalizer({
      params: schema.PARAMS(
        { role: schema.UUID() },
        { $length: 1 }
      ),
      query: schema.QUERY({
        id: schema.UUID({ $optional: true, $deny: true }),
        code: schema.CODE({ $optional: true }),
        name: schema.TEXT_FILTER({ $optional: true }),
        extra: schema.EXTRA({ $optional: true }),
        created_at: schema.DATE_FILTER({ $optional: true }),
        updated_at: schema.DATE_FILTER({ $optional: true }),
        deleted_at: schema.DATE_FILTER({ $optional: true }),
        created_by: schema.UUID({ $optional: true }),
        updated_by: schema.UUID({ $optional: true }),
        deleted_by: schema.UUID({ $optional: true }),
        attributes: schema.ATTRIBUTES(permissionAttributes),
        paranoid: schema.BOOLEAN({ $optional: true }),
        limit: schema.LIMIT({ $optional: true }),
        offset: schema.OFFSET({ $optional: true }),
        sort_by: schema.ENUM(permissionAttributes),
        order_by: schema.ORDER_BY({ $optional: true })
      }, { $max: 20 })
    }),

    addPermissions: new Datalizer({
      params: schema.PARAMS(
        { role: schema.UUID() },
        { $length: 1 }
      ),
      body: schema.BODY(
        { permissions: schema.UUID_ARRAY() },
        { $length: 1 }
      )
    }),

    getPermission: new Datalizer({
      params: schema.PARAMS(
        { role: schema.UUID(), permission: schema.UUID() },
        { $length: 2 }
      ),
      query: schema.QUERY({
        attributes: schema.ATTRIBUTES(permissionAttributes),
        paranoid: schema.BOOLEAN({ $optional: true })
      }, { $max: 10 })
    }),

    updatePermission: new Datalizer({
      params: schema.PARAMS(
        { role: schema.UUID(), permission: schema.UUID() },
        { $length: 2 }
      ),
      query: schema.QUERY({
        paranoid: schema.BOOLEAN({ $optional: true })
      }, { $max: 1, $optional: true }),
      body: schema.BODY({
        role_id: schema.UUID({ $optional: true, $deny: true }),
        permission_id: schema.UUID({ $optional: true, $deny: true }),
        extra: schema.EXTRA({ $optional: true }),
        created_at: schema.DATE({ $optional: true }),
        updated_at: schema.DATE({ $optional: true }),
        deleted_at: schema.DATE({ $optional: true }),
        created_by: schema.UUID({ $optional: true }),
        updated_by: schema.UUID({ $optional: true }),
        deleted_by: schema.UUID({ $optional: true })
      }, { $max: 9, $empty: false })
    }),

    removePermission: new Datalizer({
      params: schema.PARAMS(
        { role: schema.UUID(), permission: schema.UUID() },
        { $length: 2 }
      ),
      query: schema.QUERY({
        force: schema.BOOLEAN({ $optional: true }),
        paranoid: schema.BOOLEAN({ $optional: true })
      }, { $max: 2 })
    })
  });
};
