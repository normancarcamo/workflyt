const Datalizer = require('@ncardez/datalizer');
const schema = require('src/utils/validator');

export const user = {
  attributes: [
    'id',
    'worker_id',
    'code',
    'username',
    // 'password', omitted by security reasons...
    'extra',
    'created_at',
    'updated_at',
    'deleted_at',
    'created_by',
    'updated_by',
    'deleted_by'
  ],
  associations: [ 'roles' ]
};

export const role = {
  attributes: [
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
  ],
  associations: [ 'permissions' ]
};

export const getUsers = new Datalizer({
  query: schema.QUERY({
    id: schema.UUID({ $optional: true, $deny: true }),
    worker_id: schema.UUID({ $optional: true }),
    code: schema.CODE({ $optional: true }),
    username: schema.TEXT_FILTER({ $optional: true }),
    extra: schema.EXTRA({ $optional: true }),
    created_at: schema.DATE_FILTER({ $optional: true }),
    updated_at: schema.DATE_FILTER({ $optional: true }),
    deleted_at: schema.DATE_FILTER({ $optional: true }),
    created_by: schema.UUID({ $optional: true }),
    updated_by: schema.UUID({ $optional: true }),
    deleted_by: schema.UUID({ $optional: true }),
    attributes: schema.ATTRIBUTES(user.attributes),
    paranoid: schema.BOOLEAN({ $optional: true }),
    offset: schema.OFFSET({ $optional: true }),
    limit: schema.LIMIT({ $optional: true }),
    sort_by: schema.ENUM(user.attributes),
    order_by: schema.ORDER_BY({ $optional: true })
  }, { $max: 32 })
});
export const createUser = new Datalizer({
  body: schema.BODY({
    id: schema.UUID({ $optional: true, $null: true }),
    worker_id: schema.UUID({ $optional: true, $null: true }),
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
}, { addKey: false });
export const getUser = new Datalizer({
  params: schema.PARAMS(
    { user: schema.UUID() },
    { $length: 1 }
  ),
  query: schema.QUERY({
    attributes: schema.ATTRIBUTES(user.attributes),
    include: schema.ATTRIBUTES(user.associations),
    paranoid: schema.BOOLEAN({ $optional: true })
  })
});
export const updateUser = new Datalizer({
  params: schema.PARAMS(
    { user: schema.UUID() },
    { $length: 1 }
  ),
  query: schema.QUERY({
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 1, $optional: true }),
  body: schema.BODY({
    id: schema.UUID({ $optional: true, $deny: true }),
    worker_id: schema.UUID({ $optional: true, $null: true }),
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
}, { addKey: false });
export const deleteUser = new Datalizer({
  params: schema.PARAMS(
    { user: schema.UUID() },
    { $length: 1 }
  ),
  query: schema.QUERY({
    force: schema.BOOLEAN({ $optional: true }),
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 2 })
});
export const getRoles = new Datalizer({
  params: schema.PARAMS({ user: schema.UUID() }, { $length: 1 }),
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
    attributes: schema.ATTRIBUTES(role.attributes),
    paranoid: schema.BOOLEAN({ $optional: true }),
    limit: schema.LIMIT({ $optional: true }),
    offset: schema.OFFSET({ $optional: true }),
    sort_by: schema.ENUM(role.attributes),
    order_by: schema.ORDER_BY({ $optional: true })
  }, { $max: 26 })
});
export const addRoles = new Datalizer({
  params: schema.PARAMS({ user: schema.UUID() }, { $length: 1 }),
  body: schema.BODY({ roles: schema.UUID_ARRAY() }, { $length: 1 })
});
export const getRole = new Datalizer({
  params: schema.PARAMS(
    { user: schema.UUID(), role: schema.UUID() },
    { $length: 2 }
  ),
  query: schema.QUERY({
    attributes: schema.ATTRIBUTES(role.attributes),
    include: schema.INCLUDE(role.associations),
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 16 })
});
export const updateRole = new Datalizer({
  params: schema.PARAMS(
    { user: schema.UUID(), role: schema.UUID() },
    { $length: 2 }
  ),
  query: schema.QUERY(
    { paranoid: schema.BOOLEAN({ $optional: true }) },
    { $max: 1, $optional: true }
  ),
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
});
export const deleteRole = new Datalizer({
  params: schema.PARAMS(
    { user: schema.UUID(), role: schema.UUID() },
    { $length: 2 }
  ),
  query: schema.QUERY({
    force: schema.BOOLEAN({ $optional: true }),
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 2 })
});
