const Datalizer = require('@ncardez/datalizer');
const schema = require('src/utils/validator');

export const permission = {
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
  ]
};

export const getPermissions = new Datalizer({
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
    attributes: schema.ATTRIBUTES(permission.attributes),
    paranoid: schema.BOOLEAN({ $optional: true }),
    limit: schema.LIMIT({ $optional: true }),
    offset: schema.OFFSET({ $optional: true }),
    sort_by: schema.ENUM(permission.attributes),
    order_by: schema.ORDER_BY({ $optional: true })
  }, { $max: 20 })
});

export const createPermission = new Datalizer({
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
    deleted_by: schema.UUID({ $optional: true })
  }, { $max: 10, $empty: false })
}, { addkey: false });

export const getPermission = new Datalizer({
  params: schema.PARAMS(
    { permission: schema.UUID() },
    { $length: 1 }
  ),
  query: schema.QUERY({
    attributes: schema.ATTRIBUTES(permission.attributes),
    paranoid: schema.BOOLEAN({ $optional: true }),
  }, { $max: 13 })
});

export const updatePermission = new Datalizer({
  params: schema.PARAMS(
    { permission: schema.UUID() },
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
    deleted_by: schema.UUID({ $optional: true })
  }, { $max: 10, $empty: true })
}, { addkey: false });

export const deletePermission = new Datalizer({
  params: schema.PARAMS(
    { permission: schema.UUID() },
    { $length: 1 }
  ),
  query: schema.QUERY({
    force: schema.BOOLEAN({ $optional: true }),
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 2 })
})
