module.exports = ({ schema, Datalizer }) => {
  const companyAttributes = [
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

  return Object.freeze({
    getCompanies: new Datalizer({
      query: schema.QUERY({
        id: schema.UUID({ $optional: true, $forbidden: true }),
        code: schema.CODE({ $optional: true }),
        name: schema.TEXT_FILTER({ $optional: true }),
        extra: schema.EXTRA({ $optional: true }),
        created_at: schema.DATE_FILTER({ $optional: true }),
        updated_at: schema.DATE_FILTER({ $optional: true }),
        deleted_at: schema.DATE_FILTER({ $optional: true }),
        created_by: schema.UUID({ $optional: true }),
        updated_by: schema.UUID({ $optional: true }),
        deleted_by: schema.UUID({ $optional: true }),
        attributes: schema.ATTRIBUTES(companyAttributes),
        paranoid: schema.BOOLEAN({ $optional: true }),
        offset: schema.OFFSET({ $optional: true }),
        limit: schema.LIMIT({ $optional: true }),
        sort_by: schema.ENUM(companyAttributes),
        order_by: schema.ORDER_BY({ $optional: true })
      }, { $max: 24 })
    }),

    createCompanies: new Datalizer({
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
    }),

    getCompany: new Datalizer({
      params: schema.PARAMS({ company: schema.UUID() }, { $length: 1 }),
      query: schema.QUERY({
        attributes: schema.ATTRIBUTES(companyAttributes),
        paranoid: schema.BOOLEAN({ $optional: true })
      }, { $max: 11 })
    }),

    updateCompany: new Datalizer({
      params: schema.PARAMS({ company: schema.UUID() }, { $length: 1 }),
      query: schema.QUERY({
        paranoid: schema.BOOLEAN({ $optional: true })
      }, { $max: 1, $optional: true }),
      body: schema.BODY({
        id: schema.UUID({ $optional: true }),
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

    deleteCompany: new Datalizer({
      params: schema.PARAMS({ company: schema.UUID() }, { $length: 1 }),
      query: schema.QUERY({
        force: schema.BOOLEAN({ $optional: true }),
        paranoid: schema.BOOLEAN({ $optional: true }),
      }, { $max: 2 })
    })
  });
};
