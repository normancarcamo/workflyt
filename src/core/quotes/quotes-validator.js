module.exports = ({ schema, Datalizer }) => {
  const quoteAttributes = [
    'id',
    'customer_id',
    'salesman_id',
    'code',
    'subject',
    'status',
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

  const orderAttributes = [
    'id',
    'quote_id',
    'code',
    'type',
    'status',
    'extra',
    'created_at',
    'updated_at',
    'deleted_at',
    'created_by',
    'updated_by',
    'deleted_by'
  ];

  const quoteAssociations = [ 'orders', 'items' ];

  const itemAssociations = [ 'stocks' ];

  const orderAssociations = [ 'quote', 'departments', 'items', 'employees' ];

  return Object.freeze({
    getQuotes: new Datalizer({
      query: schema.QUERY({
        id: schema.UUID({ $optional: true, $deny: true }),
        customer_id: schema.UUID({ $optional: true }),
        salesman_id: schema.UUID({ $optional: true }),
        code: schema.CODE({ $optional: true }),
        subject: schema.TEXT_FILTER({ $optional: true, $max: 100 }),
        status: schema.ENUM([
          'open', 'confirmed', 'other', 'approved',
          'pending', 'awaiting', 'authorized',
          'cancelled', 'done'
        ]),
        extra: schema.EXTRA({ $optional: true }),
        created_at: schema.DATE_FILTER({ $optional: true }),
        updated_at: schema.DATE_FILTER({ $optional: true }),
        deleted_at: schema.DATE_FILTER({ $optional: true }),
        created_by: schema.UUID({ $optional: true }),
        updated_by: schema.UUID({ $optional: true }),
        deleted_by: schema.UUID({ $optional: true }),
        attributes: schema.ATTRIBUTES(quoteAttributes),
        include: schema.INCLUDE(quoteAssociations),
        paranoid: schema.BOOLEAN({ $optional: true }),
        limit: schema.LIMIT({ $optional: true }),
        offset: schema.OFFSET({ $optional: true }),
        sort_by: schema.ENUM(quoteAttributes),
        order_by: schema.ORDER_BY({ $optional: true })
      }, { $max: 30 })
    }),

    createQuotes: new Datalizer({
      body: schema.BODY({
        id: schema.UUID({ $optional: true, $null: true }),
        customer_id: schema.UUID(),
        salesman_id: schema.UUID(),
        subject: schema.TEXT({
          $optional: true,
          $max: 100,
          $empty: false,
          $min: 2,
          $default: 'No subject description'
        }),
        code: schema.CODE({ $optional: true }),
        status: schema.ENUM([
          'open', 'confirmed', 'other', 'approved',
          'pending', 'awaiting', 'authorized',
          'cancelled', 'done'
        ], { $default: 'awaiting' }),
        extra: schema.EXTRA({ $optional: true }),
        created_at: schema.DATE({ $optional: true }),
        updated_at: schema.DATE({ $optional: true }),
        deleted_at: schema.DATE({ $optional: true }),
        created_by: schema.UUID({ $optional: true }),
        updated_by: schema.UUID({ $optional: true }),
        deleted_by: schema.UUID({ $optional: true }),
      }, { $max: 13, $empty: false })
    }),

    getQuote: new Datalizer({
      params: schema.PARAMS(
        { quote: schema.UUID() },
        { $length: 1 }
      ),
      query: schema.QUERY({
        attributes: schema.ATTRIBUTES(quoteAttributes),
        include: schema.INCLUDE(quoteAssociations),
        paranoid: schema.BOOLEAN({ $optional: true })
      }, { $max: 15 })
    }),

    updateQuote: new Datalizer({
      params: schema.PARAMS(
        { quote: schema.UUID() },
        { $length: 1 }
      ),
      query: schema.QUERY({
        paranoid: schema.BOOLEAN({ $optional: true })
      }, { $max: 1, $optional: true }),
      body: schema.BODY({
        id: schema.UUID({ $optional: true, $deny: true }),
        customer_id: schema.UUID({ $optional: true }),
        salesman_id: schema.UUID({ $optional: true }),
        subject: schema.TEXT({
          $optional: true,
          $max: 100,
          $empty: false,
          $min: 2,
          $default: 'No subject description'
        }),
        code: schema.CODE({ $optional: true }),
        status: schema.ENUM([
          'open', 'confirmed', 'other', 'approved',
          'pending', 'awaiting', 'authorized',
          'cancelled', 'done'
        ], { $default: 'awaiting' }),
        extra: schema.EXTRA({ $optional: true }),
        created_at: schema.DATE({ $optional: true }),
        updated_at: schema.DATE({ $optional: true }),
        deleted_at: schema.DATE({ $optional: true }),
        created_by: schema.UUID({ $optional: true }),
        updated_by: schema.UUID({ $optional: true }),
        deleted_by: schema.UUID({ $optional: true }),
      }, { $max: 13, $empty: false })
    }),

    deleteQuote: new Datalizer({
      params: schema.PARAMS(
        { quote: schema.UUID() },
        { $length: 1 }
      ),
      query: schema.QUERY({
        force: schema.BOOLEAN({ $optional: true }),
        paranoid: schema.BOOLEAN({ $optional: true })
      }, { $max: 2 })
    }),

    getItems: new Datalizer({
      params: schema.PARAMS(
        { quote: schema.UUID() },
        { $length: 1 }
      ),
      query: schema.QUERY({
        id: schema.UUID({ $optional: true, $deny: true }),
        category_id: schema.UUID({ $optional: true }),
        code: schema.CODE({ $optional: true }),
        name: schema.TEXT_FILTER({ $optional: true }),
        type: schema.ENUM(['service', 'product', 'material']),
        stock: schema.NUMBER_FILTER({ $optional: true }),
        price: schema.PRICE_FILTER({ $optional: true }),
        extra: schema.EXTRA({ $optional: true }),
        created_at: schema.DATE_FILTER({ $optional: true }),
        updated_at: schema.DATE_FILTER({ $optional: true }),
        deleted_at: schema.DATE_FILTER({ $optional: true }),
        created_by: schema.UUID({ $optional: true }),
        updated_by: schema.UUID({ $optional: true }),
        deleted_by: schema.UUID({ $optional: true }),
        attributes: schema.ATTRIBUTES(itemAttributes),
        include: schema.INCLUDE(itemAssociations),
        paranoid: schema.BOOLEAN({ $optional: true }),
        limit: schema.LIMIT({ $optional: true }),
        offset: schema.OFFSET({ $optional: true }),
        sort_by: schema.ENUM(itemAttributes),
        order_by: schema.ORDER_BY({ $optional: true })
      }, { $max: 30 })
    }),

    addItems: new Datalizer({
      params: schema.PARAMS(
        { quote: schema.UUID() },
        { $length: 1 }
      ),
      body: schema.BODY(
        { items: schema.UUID_ARRAY() },
        { $length: 1 }
      )
    }),

    getItem: new Datalizer({
      params: schema.PARAMS(
        { quote: schema.UUID(), item: schema.UUID() },
        { $length: 2 }
      ),
      query: schema.QUERY({
        attributes: schema.ATTRIBUTES(itemAttributes),
        include: schema.INCLUDE(itemAssociations),
        paranoid: schema.BOOLEAN({ $optional: true })
      }, { $max: 20 })
    }),

    updateItem: new Datalizer({
      params: schema.PARAMS(
        { quote: schema.UUID(), item: schema.UUID() },
        { $length: 2 }
      ),
      query: schema.QUERY({
        paranoid: schema.BOOLEAN({ $optional: true })
      }, { $max: 1, $optional: true }),
      body: schema.BODY({
        quote_id: schema.UUID({ $optional: true, $deny: true }),
        item_id: schema.UUID({ $optional: true, $deny: true }),
        extra: schema.EXTRA({ $optional: true }),
        created_at: schema.DATE({ $optional: true }),
        updated_at: schema.DATE({ $optional: true }),
        deleted_at: schema.DATE({ $optional: true }),
        created_by: schema.UUID({ $optional: true }),
        updated_by: schema.UUID({ $optional: true }),
        deleted_by: schema.UUID({ $optional: true })
      }, { $max: 9, $empty: false })
    }),

    removeItem: new Datalizer({
      params: schema.PARAMS(
        { quote: schema.UUID(), item: schema.UUID() },
        { $length: 2 }
      ),
      query: schema.QUERY({
        force: schema.BOOLEAN({ $optional: true }),
        paranoid: schema.BOOLEAN({ $optional: true })
      }, { $max: 2 })
    }),

    getOrders: new Datalizer({
      params: schema.PARAMS(
        { quote: schema.UUID() },
        { $length: 1 }
      ),
      query: schema.QUERY({
        id: schema.UUID({ $optional: true, $deny: true }),
        quote_id: schema.UUID({ $optional: true }),
        code: schema.CODE({ $optional: true }),
        type: schema.ENUM(['work', 'installation']),
        status: schema.ENUM([ 'awaiting', 'working', 'cancelled', 'done' ]),
        extra: schema.EXTRA({ $optional: true }),
        created_at: schema.DATE_FILTER({ $optional: true }),
        updated_at: schema.DATE_FILTER({ $optional: true }),
        deleted_at: schema.DATE_FILTER({ $optional: true }),
        created_by: schema.UUID({ $optional: true }),
        updated_by: schema.UUID({ $optional: true }),
        deleted_by: schema.UUID({ $optional: true }),
        attributes: schema.ATTRIBUTES(orderAttributes),
        include: schema.INCLUDE(orderAssociations),
        paranoid: schema.BOOLEAN({ $optional: true }),
        limit: schema.LIMIT({ $optional: true }),
        offset: schema.OFFSET({ $optional: true }),
        sort_by: schema.ENUM(orderAttributes),
        order_by: schema.ORDER_BY({ $optional: true })
      }, { $max: 30 })
    }),

    addOrders: new Datalizer({
      params: schema.PARAMS(
        { quote: schema.UUID() },
        { $length: 1 }
      ),
      body: schema.BODY(
        { orders: schema.UUID_ARRAY() },
        { $length: 1 }
      )
    }),

    getOrder: new Datalizer({
      params: schema.PARAMS(
        { quote: schema.UUID(), order: schema.UUID() },
        { $length: 2 }
      ),
      query: schema.QUERY({
        attributes: schema.ATTRIBUTES(orderAttributes),
        include: schema.INCLUDE(orderAssociations),
        paranoid: schema.BOOLEAN({ $optional: true })
      }, { $max: 20 })
    })
  });
};
