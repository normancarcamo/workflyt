module.exports = ({ schema, Datalizer }) => {
  const numberType = {
    $optional: true,
    $positive: true,
    $integer: true,
    $zero: true,
    $default: 0
  };

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

  return Object.freeze({
    getStocks: new Datalizer({
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
        attributes: schema.ATTRIBUTES(stockAttributes),
        paranoid: schema.BOOLEAN({ $optional: true }),
        limit: schema.LIMIT({ $optional: true }),
        offset: schema.OFFSET({ $optional: true }),
        sort_by: schema.ENUM(stockAttributes),
        order_by: schema.ORDER_BY({ $optional: true })
      }, { $max: 30 })
    }),

    createStocks: new Datalizer({
      body: schema.BODY({
        id: schema.UUID({ $optional: true, $null: true }),
        item_id: schema.UUID(),
        entries: schema.NUMBER(numberType),
        exits: schema.NUMBER(numberType),
        stock: schema.NUMBER(numberType),
        extra: schema.EXTRA({ $optional: true }),
        created_at: schema.DATE({ $optional: true }),
        updated_at: schema.DATE({ $optional: true }),
        deleted_at: schema.DATE({ $optional: true }),
        created_by: schema.UUID({ $optional: true }),
        updated_by: schema.UUID({ $optional: true }),
        deleted_by: schema.UUID({ $optional: true }),
      }, { $max: 12, $empty: false })
    }),

    getStock: new Datalizer({
      params: schema.PARAMS(
        { stock: schema.UUID() },
        { $length: 1 }
      ),
      query: schema.QUERY({
        attributes: schema.ATTRIBUTES(stockAttributes),
        paranoid: schema.BOOLEAN({ $optional: true })
      }, { $max: 15 })
    }),

    updateStock: new Datalizer({
      params: schema.PARAMS(
        { stock: schema.UUID() },
        { $length: 1 }
      ),
      query: schema.QUERY({
        paranoid: schema.BOOLEAN({ $optional: true })
      }, { $max: 1, $optional: true }),
      body: schema.BODY({
        id: schema.UUID({ $optional: true, $deny: true }),
        item_id: schema.UUID({ $optional: true, $deny: true }),
        entries: schema.NUMBER(numberType),
        exits: schema.NUMBER(numberType),
        stock: schema.NUMBER({ ...numberType, $deny: true }),
        extra: schema.EXTRA({ $optional: true }),
        created_at: schema.DATE({ $optional: true }),
        updated_at: schema.DATE({ $optional: true }),
        deleted_at: schema.DATE({ $optional: true }),
        created_by: schema.UUID({ $optional: true }),
        updated_by: schema.UUID({ $optional: true }),
        deleted_by: schema.UUID({ $optional: true }),
      })
    }),

    deleteStock: new Datalizer({
      params: schema.PARAMS(
        { stock: schema.UUID() },
        { $length: 1 }
      ),
      query: schema.QUERY({
        force: schema.BOOLEAN({ $optional: true }),
        paranoid: schema.BOOLEAN({ $optional: true })
      }, { $max: 2 })
    })
  });
};
