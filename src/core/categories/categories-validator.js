module.exports = ({ schema, Datalizer }) => {
  const categoryAttributes = [
    'id',
    'parent_id',
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

  const itemAssociations = [ 'stocks' ];

  const categoryAssociations = [ 'items', 'parent' ];

  return Object.freeze({
    getCategories: new Datalizer({
      query: schema.QUERY({
        id: schema.UUID({ $optional: true, $forbidden: true }),
        parent_id: schema.UUID({ $optional: true }),
        code: schema.CODE({ $optional: true }),
        name: schema.TEXT_FILTER({ $optional: true }),
        extra: schema.EXTRA({ $optional: true }),
        created_at: schema.DATE_FILTER({ $optional: true }),
        updated_at: schema.DATE_FILTER({ $optional: true }),
        deleted_at: schema.DATE_FILTER({ $optional: true }),
        created_by: schema.UUID({ $optional: true }),
        updated_by: schema.UUID({ $optional: true }),
        deleted_by: schema.UUID({ $optional: true }),
        offset: schema.OFFSET({ $optional: true }),
        limit: schema.LIMIT({ $optional: true }),
        attributes: schema.ATTRIBUTES(categoryAttributes),
        include: schema.INCLUDE(categoryAssociations),
        paranoid: schema.BOOLEAN({ $optional: true }),
        sort_by: schema.ENUM(categoryAttributes),
        order_by: schema.ORDER_BY({ $optional: true })
      }, { $max: 30 })
    }),

    createCategories: new Datalizer({
      body: schema.BODY({
        id: schema.UUID({ $optional: true, $null: true }),
        parent_id: schema.UUID({ $optional: true, $null: true }),
        code: schema.CODE({ $optional: true }),
        name: schema.TEXT({ $empty: false, $min: 2 }),
        extra: schema.EXTRA({ $optional: true }),
        created_at: schema.DATE({ $optional: true }),
        updated_at: schema.DATE({ $optional: true }),
        deleted_at: schema.DATE({ $optional: true }),
        created_by: schema.UUID({ $optional: true }),
        updated_by: schema.UUID({ $optional: true }),
        deleted_by: schema.UUID({ $optional: true })
      }, { $max: 11, $empty: false })
    }),

    getCategory: new Datalizer({
      params: schema.PARAMS(
        { category: schema.UUID() },
        { $length: 1 }
      ),
      query: schema.QUERY({
        attributes: schema.ATTRIBUTES(categoryAttributes),
        include: schema.INCLUDE(categoryAssociations),
        paranoid: schema.BOOLEAN({ $optional: true })
      }, { $max: 17 })
    }),

    updateCategory: new Datalizer({
      params: schema.PARAMS(
        { category: schema.UUID() },
        { $length: 1 }
      ),
      query: schema.QUERY(
        { paranoid: schema.BOOLEAN({ $optional: true }) },
        { $max: 1, $optional: true }
      ),
      body: schema.BODY({
        id: schema.UUID({ $optional: true }),
        parent_id: schema.UUID({ $optional: true, $null: true }),
        code: schema.CODE({ $optional: true }),
        name: schema.TEXT({ $optional: true, $empty: false, $min: 2 }),
        extra: schema.EXTRA({ $optional: true }),
        created_at: schema.DATE({ $optional: true }),
        updated_at: schema.DATE({ $optional: true }),
        deleted_at: schema.DATE({ $optional: true }),
        created_by: schema.UUID({ $optional: true }),
        updated_by: schema.UUID({ $optional: true }),
        deleted_by: schema.UUID({ $optional: true })
      }, { $max: 11, $empty: false })
    }),

    deleteCategory: new Datalizer({
      params: schema.PARAMS(
        { category: schema.UUID() },
        { $length: 1 }
      ),
      query: schema.QUERY({
        force: schema.BOOLEAN({ $optional: true }),
        paranoid: schema.BOOLEAN({ $optional: true }),
      }, { $max: 2 })
    }),

    getItems: new Datalizer({
      params: schema.PARAMS({ category: schema.UUID() }, { $length: 1 }),
      query: schema.QUERY({
        id: schema.UUID({ $optional: true, $forbidden: true }),
        parent_id: schema.UUID({ $optional: true }),
        code: schema.CODE({ $optional: true }),
        name: schema.TEXT_FILTER({ $optional: true }),
        type: schema.ENUM([ 'service', 'product', 'material' ]),
        stock: schema.NUMBER_FILTER({
          $optional: true,
          $integer: true,
          $positive: true
        }),
        price: schema.PRICE_FILTER({ $optional: true }),
        extra: schema.EXTRA({ $optional: true }),
        created_at: schema.DATE_FILTER({ $optional: true }),
        updated_at: schema.DATE_FILTER({ $optional: true }),
        deleted_at: schema.DATE_FILTER({ $optional: true }),
        created_by: schema.UUID({ $optional: true }),
        updated_by: schema.UUID({ $optional: true }),
        deleted_by: schema.UUID({ $optional: true }),
        offset: schema.OFFSET({ $optional: true }),
        limit: schema.LIMIT({ $optional: true }),
        attributes: schema.ATTRIBUTES(itemAttributes),
        include: schema.INCLUDE(itemAssociations),
        paranoid: schema.BOOLEAN({ $optional: true }),
        sort_by: schema.ENUM(itemAttributes),
        order_by: schema.ORDER_BY({ $optional: true }),
      }, { $max: 30 })
    }),

    addItems: new Datalizer({
      params: schema.PARAMS({ category: schema.UUID() }, { $length: 1 }),
      body: schema.BODY({ items: schema.UUID_ARRAY() }, { $length: 1 })
    }),

    getItem: new Datalizer({
      params: schema.PARAMS({
        category: schema.UUID(),
        item: schema.UUID()
      }, { $length: 2 }),
      query: schema.QUERY({
        attributes: schema.ATTRIBUTES(itemAttributes),
        include: schema.INCLUDE(itemAssociations),
        paranoid: schema.BOOLEAN({ $optional: true })
      }, { $max: 24 })
    }),

    removeItem: new Datalizer({
      params: schema.PARAMS(
        { category: schema.UUID(), item: schema.UUID() },
        { $length: 2 }
      )
    })
  });
};
