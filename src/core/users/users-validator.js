module.exports = ({ schema, Datalizer }) => {
  const userAttributes = [
    'id',
    'employee_id',
    'code',
    'username',
    'extra',
    'created_at',
    'updated_at',
    'deleted_at',
    'created_by',
    'updated_by',
    'deleted_by'
  ];

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

  const userAssociations = [ 'roles' ];

  const roleAssociations = [ 'permissions' ];

  return Object.freeze({
    getUsers: new Datalizer({
      query: schema.QUERY({
        id: schema.UUID({ $optional: true, $deny: true }),
        employee_id: schema.UUID({ $optional: true }),
        code: schema.CODE({ $optional: true }),
        username: schema.TEXT_FILTER({ $optional: true }),
        extra: schema.EXTRA({ $optional: true }),
        created_at: schema.DATE_FILTER({ $optional: true }),
        updated_at: schema.DATE_FILTER({ $optional: true }),
        deleted_at: schema.DATE_FILTER({ $optional: true }),
        created_by: schema.UUID({ $optional: true }),
        updated_by: schema.UUID({ $optional: true }),
        deleted_by: schema.UUID({ $optional: true }),
        attributes: schema.ATTRIBUTES(userAttributes),
        include: schema.ATTRIBUTES(userAssociations),
        paranoid: schema.BOOLEAN({ $optional: true }),
        offset: schema.OFFSET({ $optional: true }),
        limit: schema.LIMIT({ $optional: true }),
        sort_by: schema.ENUM(userAttributes),
        order_by: schema.ORDER_BY({ $optional: true })
      }, { $max: 32 })
    }),

    createUsers: new Datalizer({
      body: schema.BODY({
        id: schema.UUID({ $optional: true, $null: true }),
        employee_id: schema.UUID({ $optional: true, $null: true }),
        code: schema.CODE({ $optional: true }),
        username: schema.TEXT({ $empty: false, $min: 2 }),
        password: schema.PASS(),
        extra: schema.EXTRA({ $optional: true }),
        created_at: schema.DATE_FILTER({ $optional: true }),
        updated_at: schema.DATE_FILTER({ $optional: true }),
        deleted_at: schema.DATE_FILTER({ $optional: true }),
        created_by: schema.UUID({ $optional: true }),
        updated_by: schema.UUID({ $optional: true }),
        deleted_by: schema.UUID({ $optional: true })
      }, { $max: 12, $empty: false })
    }),

    getUser: new Datalizer({
      params: schema.PARAMS(
        { user: schema.UUID() },
        { $length: 1 }
      ),
      query: schema.QUERY({
        attributes: schema.ATTRIBUTES(userAttributes),
        include: schema.ATTRIBUTES(userAssociations),
        paranoid: schema.BOOLEAN({ $optional: true })
      })
    }),

    updateUser: new Datalizer({
      params: schema.PARAMS(
        { user: schema.UUID() },
        { $length: 1 }
      ),
      query: schema.QUERY({
        paranoid: schema.BOOLEAN({ $optional: true })
      }, { $max: 1, $optional: true }),
      body: schema.BODY({
        id: schema.UUID({ $optional: true, $deny: true }),
        employee_id: schema.UUID({ $optional: true, $null: true }),
        code: schema.CODE({ $optional: true }),
        username: schema.TEXT({ $optional: true, $empty: false, $min: 2 }),
        password: schema.PASS({ $optional: true, $empty: false, $min: 5 }),
        extra: schema.EXTRA({ $optional: true }),
        created_at: schema.DATE({ $optional: true }),
        updated_at: schema.DATE({ $optional: true }),
        deleted_at: schema.DATE({ $optional: true }),
        created_by: schema.UUID({ $optional: true }),
        updated_by: schema.UUID({ $optional: true }),
        deleted_by: schema.UUID({ $optional: true }),
      }, { $max: 12, $empty: false })
    }),

    deleteUser: new Datalizer({
      params: schema.PARAMS(
        { user: schema.UUID() },
        { $length: 1 }
      ),
      query: schema.QUERY({
        force: schema.BOOLEAN({ $optional: true }),
        paranoid: schema.BOOLEAN({ $optional: true })
      }, { $max: 2 })
    }),

    getRoles: new Datalizer({
      params: schema.PARAMS(
        { user: schema.UUID() },
        { $length: 1 }
      ),
      query: schema.QUERY({
        id: schema.UUID({ $optional: true, $deny: true }),
        code: schema.CODE({ $optional: true }),
        name: schema.TEXT_FILTER({ $optional: true, $max: 100 }),
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
      }, { $max: 26 })
    }),

    addRoles: new Datalizer({
      params: schema.PARAMS(
        { user: schema.UUID() },
        { $length: 1 }
      ),
      body: schema.BODY(
        { roles: schema.UUID_ARRAY() },
        { $length: 1 }
      )
    }),

    getRole: new Datalizer({
      params: schema.PARAMS(
        { user: schema.UUID(), role: schema.UUID() },
        { $length: 2 }
      ),
      query: schema.QUERY({
        attributes: schema.ATTRIBUTES(roleAttributes),
        include: schema.INCLUDE(roleAssociations),
        paranoid: schema.BOOLEAN({ $optional: true })
      }, { $max: 16 })
    }),

    updateRole: new Datalizer({
      params: schema.PARAMS(
        { user: schema.UUID(), role: schema.UUID() },
        { $length: 2 }
      ),
      query: schema.QUERY({
        paranoid: schema.BOOLEAN({ $optional: true })
      }, { $max: 1, $optional: true }),
      body: schema.BODY({
        user_id: schema.UUID({ $optional: true, $deny: true }),
        role_id: schema.UUID({ $optional: true, $deny: true }),
        extra: schema.EXTRA({ $optional: true }),
        created_at: schema.DATE({ $optional: true }),
        updated_at: schema.DATE({ $optional: true }),
        deleted_at: schema.DATE({ $optional: true }),
        created_by: schema.UUID({ $optional: true }),
        updated_by: schema.UUID({ $optional: true }),
        deleted_by: schema.UUID({ $optional: true })
      }, { $max: 9, $empty: false })
    }),

    removeRole: new Datalizer({
      params: schema.PARAMS(
        { user: schema.UUID(), role: schema.UUID() },
        { $length: 2 }
      ),
      query: schema.QUERY({
        force: schema.BOOLEAN({ $optional: true }),
        paranoid: schema.BOOLEAN({ $optional: true })
      }, { $max: 2 })
    })
  });
};
