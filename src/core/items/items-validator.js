module.exports = ({ schema, Datalizer }) => {
  const itemAttributes = [
    'id',
    'category_id',
    'code',
    'name',
    'type',
    'stock',
    'price',
    'extra',
    'created_at',
    'updated_at',
    'deleted_at',
    'created_by',
    'updated_by',
    'deleted_by'
  ];

  const stockAttributes = [
    'id',
    'item_id',
    'entries',
    'exits',
    'stock',
    'extra',
    'created_at',
    'updated_at',
    'deleted_at',
    'created_by',
    'updated_by',
    'deleted_by'
  ];

  const itemAssociations = [ 'stocks' ];

  return Object.freeze({
    getItems: new Datalizer({
      query: schema.QUERY({
        id: schema.UUID({ $optional: true, $forbidden: true }),
        category_id: schema.UUID({ $optional: true }),
        code: schema.CODE({ $optional: true }),
        name: schema.TEXT_FILTER({ $optional: true }),
        type: schema.ENUM([ 'service', 'product', 'material' ]),
        stock: schema.NUMBER_FILTER({ $optional: true }),
        price: schema.PRICE_FILTER({ $optional: true }),
        extra: schema.EXTRA({ $optional: true }),
        created_at: schema.DATE_FILTER({ $optional: true }),
        updated_at: schema.DATE_FILTER({ $optional: true }),
        deleted_at: schema.DATE_FILTER({ $optional: true }),
        created_by: schema.UUID({ $optional: true }),
        updated_by: schema.UUID({ $optional: true }),
        deleted_by: schema.UUID({ $optional: true }),
        limit: schema.LIMIT({ $optional: true }),
        offset: schema.OFFSET({ $optional: true }),
        attributes: schema.ATTRIBUTES(itemAttributes),
        include: schema.INCLUDE(itemAssociations),
        sort_by: schema.ENUM(itemAttributes),
        order_by: schema.ORDER_BY({ $optional: true })
      }, { $max: 30 })
    }),

    createItems: new Datalizer({
      body: schema.BODY({
        id: schema.UUID({ $optional: true, $null: true }),
        category_id: schema.UUID({ $optional: true, $null: true }),
        code: schema.CODE({ $optional: true }),
        name: schema.TEXT({ $empty: false, $min: 2 }),
        type: schema.ENUM(
          ['service', 'product', 'material' ],
          { $default: 'service' }
        ),
        stock: schema.NUMBER({
          $integer: true,
          $positive: true,
          $optional: true,
          $default: 0,
          $zero: true
        }),
        price: schema.PRICE({ $optional: true }),
        extra: schema.EXTRA({ $optional: true }),
        created_at: schema.DATE({ $optional: true }),
        updated_at: schema.DATE({ $optional: true }),
        deleted_at: schema.DATE({ $optional: true }),
        created_by: schema.UUID({ $optional: true }),
        updated_by: schema.UUID({ $optional: true }),
        deleted_by: schema.UUID({ $optional: true })
      }, { $empty: false, $max: 14 })
    }),

    getItem: new Datalizer({
      params: schema.PARAMS({ item: schema.UUID() }, { $length: 1 }),
      query: schema.QUERY({
        attributes: schema.ATTRIBUTES(itemAttributes),
        include: schema.INCLUDE(itemAssociations),
        paranoid: schema.BOOLEAN({ $optional: true })
      }, { $max: 3 })
    }),

    updateItem: new Datalizer({
      params: schema.PARAMS(
        { item: schema.UUID() },
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
        type: schema.ENUM(
          ['service', 'product', 'material'],
          { $default: 'service' }
        ),
        stock: schema.NUMBER({
          $integer: true,
          $positive: true,
          $optional: true,
          $default: 0,
          $zero: true
        }),
        price: schema.PRICE({ $optional: true }),
        extra: schema.EXTRA({ $optional: true }),
        created_at: schema.DATE({ $optional: true }),
        updated_at: schema.DATE({ $optional: true }),
        deleted_at: schema.DATE({ $optional: true }),
        created_by: schema.UUID({ $optional: true }),
        updated_by: schema.UUID({ $optional: true }),
        deleted_by: schema.UUID({ $optional: true })
      }, { $max: 14, $empty: true })
    }),

    deleteItem: new Datalizer({
      params: schema.PARAMS({ item: schema.UUID() }, { $length: 1 }),
      query: schema.QUERY({
        force: schema.BOOLEAN({ $optional: true }),
        paranoid: schema.BOOLEAN({ $optional: true }),
      }, { $max: 2 })
    }),

    getStocks: new Datalizer({
      params: schema.PARAMS({ item: schema.UUID() }, { $length: 1 }),
      query: schema.QUERY({
        id: schema.UUID({ $optional: true, $deny: true }),
        item_id: schema.UUID({ $optional: true }),
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
        stock: schema.NUMBER_FILTER({
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
        attributes: schema.ATTRIBUTES(stockAttributes),
        sort_by: schema.ENUM(stockAttributes),
        order_by: schema.ORDER_BY({ $optional: true })
      }, { $max: 30 })
    }),

    addStocks: new Datalizer({
      params: schema.PARAMS({ item: schema.UUID() }, { $length: 1 }),
      body: schema.BODY({ stocks: schema.UUID_ARRAY() }, { $length: 1 })
    }),

    getStock: new Datalizer({
      params: schema.PARAMS(
        { item: schema.UUID(), stock: schema.UUID() },
        { $length: 2 }
      ),
      query: schema.QUERY({
        attributes: schema.ATTRIBUTES(stockAttributes),
        paranoid: schema.BOOLEAN({ $optional: true })
      }, { $max: 3 })
    })
  });
};
