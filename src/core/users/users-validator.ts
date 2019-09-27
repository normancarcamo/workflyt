import Datalizer from '@ncardez/datalizer';
import { TSchema } from 'src/utils/types';
import * as s from 'src/utils/schemas';

export const user:TSchema = {
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

export const role:TSchema = {
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
  query: s.QUERY({
    id: s.UUID({ $optional: true, $deny: true }),
    worker_id: s.UUID({ $optional: true }),
    code: s.CODE({ $optional: true }),
    username: s.TEXT_FILTER({ $optional: true }),
    extra: s.EXTRA({ $optional: true }),
    created_at: s.DATE_FILTER({ $optional: true }),
    updated_at: s.DATE_FILTER({ $optional: true }),
    deleted_at: s.DATE_FILTER({ $optional: true }),
    created_by: s.UUID({ $optional: true }),
    updated_by: s.UUID({ $optional: true }),
    deleted_by: s.UUID({ $optional: true }),
    attributes: s.ATTRIBUTES(user.attributes),
    paranoid: s.BOOLEAN({ $optional: true }),
    offset: s.OFFSET({ $optional: true }),
    limit: s.LIMIT({ $optional: true }),
    sort_by: s.ENUM(user.attributes),
    order_by: s.ORDER_BY({ $optional: true })
  }, { $max: 32 })
});

export const createUser = new Datalizer({
  body: s.BODY({
    id: s.UUID({ $optional: true, $null: true }),
    worker_id: s.UUID({ $optional: true, $null: true }),
    code: s.CODE({ $optional: true }),
    username: s.TEXT({ $empty: false, $min: 2 }),
    password: s.PASS(),
    extra: s.EXTRA({ $optional: true }),
    created_at: s.DATE_FILTER({ $optional: true }),
    updated_at: s.DATE_FILTER({ $optional: true }),
    deleted_at: s.DATE_FILTER({ $optional: true }),
    created_by: s.UUID({ $optional: true }),
    updated_by: s.UUID({ $optional: true }),
    deleted_by: s.UUID({ $optional: true })
  }, { $max: 12, $empty: false })
}, { addKey: false });

export const getUser = new Datalizer({
  params: s.PARAMS(
    { user: s.UUID() },
    { $length: 1 }
  ),
  query: s.QUERY({
    attributes: s.ATTRIBUTES(user.attributes),
    include: s.ATTRIBUTES(user.associations),
    paranoid: s.BOOLEAN({ $optional: true })
  })
});

export const updateUser = new Datalizer({
  params: s.PARAMS(
    { user: s.UUID() },
    { $length: 1 }
  ),
  query: s.QUERY({
    paranoid: s.BOOLEAN({ $optional: true })
  }, { $max: 1, $optional: true }),
  body: s.BODY({
    id: s.UUID({ $optional: true, $deny: true }),
    worker_id: s.UUID({ $optional: true, $null: true }),
    code: s.CODE({ $optional: true }),
    username: s.TEXT({ $optional: true, $empty: false, $min: 2 }),
    password: s.PASS({ $optional: true, $empty: false, $min: 5 }),
    extra: s.EXTRA({ $optional: true }),
    created_at: s.DATE({ $optional: true }),
    updated_at: s.DATE({ $optional: true }),
    deleted_at: s.DATE({ $optional: true }),
    created_by: s.UUID({ $optional: true }),
    updated_by: s.UUID({ $optional: true }),
    deleted_by: s.UUID({ $optional: true }),
  }, { $max: 12, $empty: false })
}, { addKey: false });

export const deleteUser = new Datalizer({
  params: s.PARAMS(
    { user: s.UUID() },
    { $length: 1 }
  ),
  query: s.QUERY({
    force: s.BOOLEAN({ $optional: true }),
    paranoid: s.BOOLEAN({ $optional: true })
  }, { $max: 2 })
});

export const getRoles = new Datalizer({
  params: s.PARAMS({ user: s.UUID() }, { $length: 1 }),
  query: s.QUERY({
    id: s.UUID({ $optional: true, $deny: true }),
    code: s.CODE({ $optional: true }),
    name: s.TEXT_FILTER({ $optional: true, $max: 100 }),
    extra: s.EXTRA({ $optional: true }),
    created_at: s.DATE_FILTER({ $optional: true }),
    updated_at: s.DATE_FILTER({ $optional: true }),
    deleted_at: s.DATE_FILTER({ $optional: true }),
    created_by: s.UUID({ $optional: true }),
    updated_by: s.UUID({ $optional: true }),
    deleted_by: s.UUID({ $optional: true }),
    attributes: s.ATTRIBUTES(role.attributes),
    paranoid: s.BOOLEAN({ $optional: true }),
    limit: s.LIMIT({ $optional: true }),
    offset: s.OFFSET({ $optional: true }),
    sort_by: s.ENUM(role.attributes),
    order_by: s.ORDER_BY({ $optional: true })
  }, { $max: 26 })
});

export const addRoles = new Datalizer({
  params: s.PARAMS({ user: s.UUID() }, { $length: 1 }),
  body: s.BODY({ roles: s.UUID_ARRAY() }, { $length: 1 })
});

export const getRole = new Datalizer({
  params: s.PARAMS(
    { user: s.UUID(), role: s.UUID() },
    { $length: 2 }
  ),
  query: s.QUERY({
    attributes: s.ATTRIBUTES(role.attributes),
    include: s.INCLUDE(role.associations),
    paranoid: s.BOOLEAN({ $optional: true })
  }, { $max: 16 })
});

export const updateRole = new Datalizer({
  params: s.PARAMS(
    { user: s.UUID(), role: s.UUID() },
    { $length: 2 }
  ),
  query: s.QUERY(
    { paranoid: s.BOOLEAN({ $optional: true }) },
    { $max: 1, $optional: true }
  ),
  body: s.BODY({
    user_id: s.UUID({ $optional: true, $deny: true }),
    role_id: s.UUID({ $optional: true, $deny: true }),
    extra: s.EXTRA({ $optional: true }),
    created_at: s.DATE({ $optional: true }),
    updated_at: s.DATE({ $optional: true }),
    deleted_at: s.DATE({ $optional: true }),
    created_by: s.UUID({ $optional: true }),
    updated_by: s.UUID({ $optional: true }),
    deleted_by: s.UUID({ $optional: true })
  }, { $max: 9, $empty: false })
});

export const deleteRole = new Datalizer({
  params: s.PARAMS(
    { user: s.UUID(), role: s.UUID() },
    { $length: 2 }
  ),
  query: s.QUERY({
    force: s.BOOLEAN({ $optional: true }),
    paranoid: s.BOOLEAN({ $optional: true })
  }, { $max: 2 })
});
