module.exports = ({ schema, Datalizer }) => {
  let customerAttributes = [
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

  let quoteAttributes = [
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

  let customerAssociations = [
    'quotes'
  ];

  let quoteAssociations = [
    'orders',
    'items'
  ];

  return Object.freeze({
    getCustomers: new Datalizer({
      query: schema.QUERY({
        id: schema.UUID({ $optional: true, $forbidden: true }),
        code: schema.CODE({ $optional: true }),
        name: schema.TEXT_FILTER({ $optional: true, $max: 100 }),
        extra: schema.EXTRA({ $optional: true }),
        created_at: schema.DATE_FILTER({ $optional: true }),
        updated_at: schema.DATE_FILTER({ $optional: true }),
        deleted_at: schema.DATE_FILTER({ $optional: true }),
        created_by: schema.UUID({ $optional: true }),
        updated_by: schema.UUID({ $optional: true }),
        deleted_by: schema.UUID({ $optional: true }),
        offset: schema.OFFSET({ $optional: true }),
        limit: schema.LIMIT({ $optional: true }),
        attributes: schema.ATTRIBUTES(customerAttributes),
        include: schema.INCLUDE(customerAssociations),
        paranoid: schema.BOOLEAN({ $optional: true }),
        sort_by: schema.ENUM(customerAttributes),
        order_by: schema.ORDER_BY({ $optional: true })
      }, { max: 30 })
    }),

    createCustomers: new Datalizer({
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
      }, { $max: 10 })
    }),

    getCustomer: new Datalizer({
      params: schema.PARAMS({ customer: schema.UUID() }, { $length: 1 }),
      query: schema.QUERY({
        attributes: schema.ATTRIBUTES(customerAttributes),
        include: schema.INCLUDE(customerAssociations),
        paranoid: schema.BOOLEAN({ $optional: true })
      }, { $max: 20 })
    }),

    updateCustomer: new Datalizer({
      params: schema.PARAMS({ customer: schema.UUID() }, { $length: 1 }),
      query: schema.QUERY({
        paranoid: schema.BOOLEAN({ $optional: true })
      }, { $max: 1, $optional: true }),
      body: schema.BODY({
        id: schema.UUID({ $optional: true, $forbidden: true }),
        code: schema.CODE({ $optional: true }),
        name: schema.TEXT({ $optional: true, $empty: false, $min: 2 }),
        extra: schema.EXTRA({ $optional: true }),
        created_at: schema.DATE({ $optional: true }),
        updated_at: schema.DATE({ $optional: true }),
        deleted_at: schema.DATE({ $optional: true }),
        created_by: schema.UUID({ $optional: true }),
        updated_by: schema.UUID({ $optional: true }),
        deleted_by: schema.UUID({ $optional: true })
      }, { $max: 10, $empty: false })
    }),

    deleteCustomer: new Datalizer({
      params: schema.PARAMS({ customer: schema.UUID() }, { $length: 1 }),
      query: schema.QUERY({
        force: schema.BOOLEAN({ $optional: true }),
        paranoid: schema.BOOLEAN({ $optional: true }),
      }, { $max: 2 })
    }),

    getQuotes: new Datalizer({
      params: schema.PARAMS({ customer: schema.UUID() }, { $length: 1 }),
      query: schema.QUERY({
        id: schema.UUID({ $optional: true, $forbidden: true }),
        code: schema.CODE({ $optional: true }),
        subject: schema.TEXT_FILTER({ $optional: true, $max: 100 }),
        status: schema.ENUM([
          'open', 'confirmed', 'other', 'approved', 'pending',
          'awaiting', 'authorized', 'cancelled', 'done'
        ]),
        extra: schema.EXTRA({ $optional: true }),
        created_at: schema.DATE_FILTER({ $optional: true }),
        updated_at: schema.DATE_FILTER({ $optional: true }),
        deleted_at: schema.DATE_FILTER({ $optional: true }),
        created_by: schema.UUID({ $optional: true }),
        updated_by: schema.UUID({ $optional: true }),
        deleted_by: schema.UUID({ $optional: true }),
        offset: schema.OFFSET({ $optional: true }),
        limit: schema.LIMIT({ $optional: true }),
        attributes: schema.ATTRIBUTES(quoteAttributes),
        include: schema.INCLUDE(quoteAssociations),
        paranoid: schema.BOOLEAN({ $optional: true }),
        sort_by: schema.ENUM(quoteAttributes),
        order_by: schema.ORDER_BY({ $optional: true })
      }, { $max: 30 })
    }),

    addQuotes: new Datalizer({
      params: schema.PARAMS({ customer: schema.UUID() }, { $length: 1 }),
      body: schema.BODY({ quotes: schema.UUID_ARRAY() }, { $length: 1 })
    }),

    getQuote: new Datalizer({
      params: schema.PARAMS({
        customer: schema.UUID(),
        quote: schema.UUID()
      }, { $length: 2 }),
      query: schema.QUERY({
        paranoid: schema.BOOLEAN({ $optional: true }),
        attributes: schema.ATTRIBUTES(quoteAttributes),
        include: schema.INCLUDE(quoteAssociations)
      }, { $max: 20 })
    })
  });
};
