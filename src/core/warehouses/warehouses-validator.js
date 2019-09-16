const Datalizer = require('@ncardez/datalizer');
const schema = require('src/utils/validator');

export const warehouse = {
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
  associations: [ 'materials' ]
};

export const material = {
  attributes: [
    'id',
    'category_id',
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
  associations: [ 'stocks' ]
};

export const getWarehouses = new Datalizer({
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
    attributes: schema.ATTRIBUTES(warehouse.attributes),
    paranoid: schema.BOOLEAN({ $optional: true }),
    limit: schema.LIMIT({ $optional: true }),
    offset: schema.OFFSET({ $optional: true }),
    sort_by: schema.ENUM(warehouse.attributes),
    order_by: schema.ORDER_BY({ $optional: true })
  }, { $max: 20 })
});

export const createWarehouse = new Datalizer({
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
}, { addKey: false });

export const getWarehouse = new Datalizer({
  params: schema.PARAMS(
    { warehouse: schema.UUID() },
    { $length: 1 }
  ),
  query: schema.QUERY({
    attributes: schema.ATTRIBUTES(warehouse.attributes),
    include: schema.INCLUDE(warehouse.associations),
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 10 })
});

export const updateWarehouse = new Datalizer({
  params: schema.PARAMS(
    { warehouse: schema.UUID() },
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
}, { addKey: false });

export const deleteWarehouse = new Datalizer({
  params: schema.PARAMS(
    { warehouse: schema.UUID() },
    { $length: 1 }
  ),
  query: schema.QUERY({
    force: schema.BOOLEAN({ $optional: true }),
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 2 })
});

export const getMaterials = new Datalizer({
  params: schema.PARAMS(
    { warehouse: schema.UUID() },
    { $length: 1 }
  ),
  query: schema.QUERY({
    id: schema.UUID({ $optional: true, $deny: true }),
    category_id: schema.UUID({ $optional: true }),
    code: schema.CODE({ $optional: true }),
    name: schema.TEXT_FILTER({ $optional: true }),
    extra: schema.EXTRA({ $optional: true }),
    created_at: schema.DATE_FILTER({ $optional: true }),
    updated_at: schema.DATE_FILTER({ $optional: true }),
    deleted_at: schema.DATE_FILTER({ $optional: true }),
    created_by: schema.UUID({ $optional: true }),
    updated_by: schema.UUID({ $optional: true }),
    deleted_by: schema.UUID({ $optional: true }),
    attributes: schema.ATTRIBUTES(material.attributes),
    paranoid: schema.BOOLEAN({ $optional: true }),
    limit: schema.LIMIT({ $optional: true }),
    offset: schema.OFFSET({ $optional: true }),
    sort_by: schema.ENUM(material.attributes),
    order_by: schema.ORDER_BY({ $optional: true })
  }, { $max: 30 })
});

export const addMaterials = new Datalizer({
  params: schema.PARAMS(
    { warehouse: schema.UUID() },
    { $length: 1 }
  ),
  body: schema.BODY(
    { materials: schema.UUID_ARRAY() },
    { $length: 1 }
  )
});

export const getMaterial = new Datalizer({
  params: schema.PARAMS(
    { warehouse: schema.UUID(), material: schema.UUID() },
    { $length: 2 }
  ),
  query: schema.QUERY({
    attributes: schema.ATTRIBUTES(material.attributes),
    include: schema.INCLUDE(material.associations),
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 20 })
});

export const updateMaterial = new Datalizer({
  params: schema.PARAMS(
    { warehouse: schema.UUID(), material: schema.UUID() },
    { $length: 2 }
  ),
  query: schema.QUERY({
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 1, $optional: true }),
  body: schema.BODY({
    quote_id: schema.UUID({ $optional: true, $deny: true }),
    material_id: schema.UUID({ $optional: true, $deny: true }),
    extra: schema.EXTRA({ $optional: true }),
    created_at: schema.DATE({ $optional: true }),
    updated_at: schema.DATE({ $optional: true }),
    deleted_at: schema.DATE({ $optional: true }),
    created_by: schema.UUID({ $optional: true }),
    updated_by: schema.UUID({ $optional: true }),
    deleted_by: schema.UUID({ $optional: true })
  }, { $max: 9, $empty: false })
});

export const deleteMaterial = new Datalizer({
  params: schema.PARAMS(
    { warehouse: schema.UUID(), material: schema.UUID() },
    { $length: 2 }
  ),
  query: schema.QUERY({
    force: schema.BOOLEAN({ $optional: true }),
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 2 })
});
