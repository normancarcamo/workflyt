const Datalizer = require('@ncardez/datalizer');
const schema = require('src/utils/validator');

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

export const stock = {
  attributes: [
    'id',
    'material_id',
    'entries',
    'exits',
    'stocks',
    'extra',
    'created_at',
    'updated_at',
    'deleted_at',
    'created_by',
    'updated_by',
    'deleted_by'
  ]
};

export const getMaterials = new Datalizer({
  query: schema.QUERY({
    id: schema.UUID({ $optional: true, $forbidden: true }),
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
    limit: schema.LIMIT({ $optional: true }),
    offset: schema.OFFSET({ $optional: true }),
    attributes: schema.ATTRIBUTES(material.attributes),
    sort_by: schema.ENUM(material.attributes),
    order_by: schema.ORDER_BY({ $optional: true })
  }, { $max: 30 })
});

export const createMaterial = new Datalizer({
  body: schema.BODY({
    id: schema.UUID({ $optional: true, $null: true }),
    category_id: schema.UUID({ $optional: true, $null: true }),
    code: schema.CODE({ $optional: true }),
    name: schema.TEXT({ $empty: false, $min: 2 }),
    extra: schema.EXTRA({ $optional: true }),
    created_at: schema.DATE({ $optional: true }),
    updated_at: schema.DATE({ $optional: true }),
    deleted_at: schema.DATE({ $optional: true }),
    created_by: schema.UUID({ $optional: true }),
    updated_by: schema.UUID({ $optional: true }),
    deleted_by: schema.UUID({ $optional: true })
  }, { $empty: false, $max: 14 })
}, { addKey: false });

export const getMaterial = new Datalizer({
  params: schema.PARAMS({ material: schema.UUID() }, { $length: 1 }),
  query: schema.QUERY({
    attributes: schema.ATTRIBUTES(material.attributes),
    include: schema.INCLUDE(material.associations),
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 3 })
});

export const updateMaterial = new Datalizer({
  params: schema.PARAMS(
    { material: schema.UUID() },
    { $length: 1 }
  ),
  query: schema.QUERY(
    { paranoid: schema.BOOLEAN({ $optional: true }) },
    { $max: 1, $optional: true }
  ),
  body: schema.BODY({
    id: schema.UUID({ $optional: true, $deny: true }),
    category_id: schema.UUID({ $optional: true, $null: true }),
    code: schema.CODE({ $optional: true }),
    name: schema.TEXT({ $optional: true, $empty: false, $min: 2 }),
    extra: schema.EXTRA({ $optional: true }),
    created_at: schema.DATE({ $optional: true }),
    updated_at: schema.DATE({ $optional: true }),
    deleted_at: schema.DATE({ $optional: true }),
    created_by: schema.UUID({ $optional: true }),
    updated_by: schema.UUID({ $optional: true }),
    deleted_by: schema.UUID({ $optional: true })
  }, { $max: 14, $empty: true })
}, { addKey: false });

export const deleteMaterial = new Datalizer({
  params: schema.PARAMS({ material: schema.UUID() }, { $length: 1 }),
  query: schema.QUERY({
    force: schema.BOOLEAN({ $optional: true }),
    paranoid: schema.BOOLEAN({ $optional: true }),
  }, { $max: 2 })
});

export const getStocks = new Datalizer({
  params: schema.PARAMS({ material: schema.UUID() }, { $length: 1 }),
  query: schema.QUERY({
    id: schema.UUID({ $optional: true, $deny: true }),
    material_id: schema.UUID({ $optional: true }),
    entries: schema.NUMBER_FILTER({
      $optional: true,
      $integer: true,
      $positive: true,
      $zero: true
    }),
    exits: schema.NUMBER_FILTER({
      $optional: true,
      $integer: true,
      $positive: true,
      $zero: true
    }),
    stocks: schema.NUMBER_FILTER({
      $optional: true,
      $integer: true,
      $positive: true,
      $zero: true
    }),
    extra: schema.EXTRA({ $optional: true }),
    created_at: schema.DATE_FILTER({ $optional: true }),
    updated_at: schema.DATE_FILTER({ $optional: true }),
    deleted_at: schema.DATE_FILTER({ $optional: true }),
    created_by: schema.UUID({ $optional: true }),
    updated_by: schema.UUID({ $optional: true }),
    deleted_by: schema.UUID({ $optional: true }),
    limit: schema.LIMIT({ $optional: true }),
    offset: schema.OFFSET({ $optional: true }),
    attributes: schema.ATTRIBUTES(stock.attributes),
    sort_by: schema.ENUM(stock.attributes),
    order_by: schema.ORDER_BY({ $optional: true })
  }, { $max: 30 })
});

export const getStock = new Datalizer({
  params: schema.PARAMS(
    { material: schema.UUID(), stock: schema.UUID() },
    { $length: 2 }
  ),
  query: schema.QUERY({
    attributes: schema.ATTRIBUTES(stock.attributes),
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 3 })
});
