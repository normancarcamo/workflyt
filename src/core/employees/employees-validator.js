module.exports = ({ schema, Datalizer }) => {
  const employeeAttributes = [
    'id',
    'code',
    'firstname',
    'lastname',
    'is_supervisor',
    'extra',
    'created_at',
    'updated_at',
    'deleted_at',
    'created_by',
    'updated_by',
    'deleted_by'
  ];

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

  const userAttributes = [
    'id',
    'employee_id',
    'code',
    'username',
    'extra',
    'created_at',
    'updated_at',
    'deleted_at',
    'created_by',
    'updated_by',
    'deleted_by'
  ];

  const employeeAssociations = [ 'quotes', 'user', 'supervisors' ];

  const quoteAssociations = [ 'orders', 'items' ];

  const userAssociations = [ 'roles' ];

  return Object.freeze({
    getEmployees: new Datalizer({
      query: schema.QUERY({
        id: schema.UUID({ $optional: true, $deny: true }),
        code: schema.CODE({ $optional: true }),
        firstname: schema.TEXT_FILTER({ $optional: true }),
        lastname: schema.TEXT_FILTER({ $optional: true }),
        is_supervisor: schema.NUMBER({
          $optional: true,
          $zero: true,
          $min: 0,
          $max: 1
        }),
        extra: schema.EXTRA({ $optional: true }),
        created_at: schema.DATE_FILTER({ $optional: true }),
        updated_at: schema.DATE_FILTER({ $optional: true }),
        deleted_at: schema.DATE_FILTER({ $optional: true }),
        created_by: schema.UUID({ $optional: true }),
        updated_by: schema.UUID({ $optional: true }),
        deleted_by: schema.UUID({ $optional: true }),
        attributes: schema.ATTRIBUTES(employeeAttributes),
        include: schema.INCLUDE(employeeAssociations),
        paranoid: schema.BOOLEAN({ $optional: true }),
        offset: schema.OFFSET({ $optional: true }),
        limit: schema.LIMIT({ $optional: true }),
        sort_by: schema.ENUM(employeeAttributes),
        order_by: schema.ORDER_BY({ $optional: true })
      }, { $max: 36 })
    }),

    createEmployees: new Datalizer({
      body: schema.BODY({
        id: schema.UUID({ $optional: true, $null: true }),
        code: schema.CODE({ $optional: true }),
        firstname: schema.TEXT({ $empty: false, $min: 2 }),
        lastname: schema.TEXT({ $empty: false, $min: 2 }),
        is_supervisor: schema.NUMBER({
          $optional: true,
          $zero: true,
          $min: 0,
          $max: 1,
          $default: 0
        }),
        extra: schema.EXTRA({ $optional: true }),
        created_at: schema.DATE({ $optional: true }),
        updated_at: schema.DATE({ $optional: true }),
        deleted_at: schema.DATE({ $optional: true }),
        created_by: schema.UUID({ $optional: true }),
        updated_by: schema.UUID({ $optional: true }),
        deleted_by: schema.UUID({ $optional: true })
      }, { $max: 13, $empty: false })
    }),

    getEmployee: new Datalizer({
      params: schema.PARAMS({ employee: schema.UUID() }, { $length: 1 }),
      query: schema.QUERY({
        attributes: schema.ATTRIBUTES(employeeAttributes),
        include: schema.INCLUDE(employeeAssociations),
        paranoid: schema.BOOLEAN({ $optional: true }),
      }, { $max: 18 })
    }),

    updateEmployee: new Datalizer({
      params: schema.PARAMS({ employee: schema.UUID() }, { $length: 1 }),
      query: schema.QUERY({
        paranoid: schema.BOOLEAN({ $optional: true })
      }, { $max: 1, $optional: true }),
      body: schema.BODY({
        id: schema.UUID({ $optional: true, $deny: true }),
        code: schema.CODE({ $optional: true }),
        firstname: schema.TEXT({ $optional: true, $empty: false, $min: 2 }),
        lastname: schema.TEXT({ $optional: true, $empty: false, $min: 2 }),
        is_supervisor: schema.NUMBER({
          $optional: true,
          $zero: true,
          $min: 0,
          $max: 1,
          $default: 0
        }),
        extra: schema.EXTRA({ $optional: true }),
        created_at: schema.DATE({ $optional: true }),
        updated_at: schema.DATE({ $optional: true }),
        deleted_at: schema.DATE({ $optional: true }),
        created_by: schema.UUID({ $optional: true }),
        updated_by: schema.UUID({ $optional: true }),
        deleted_by: schema.UUID({ $optional: true })
      }, { $empty: false, $max: 13 })
    }),

    deleteEmployee: new Datalizer({
      params: schema.PARAMS(
        { employee: schema.UUID() },
        { $length: 1 }
      ),
      query: schema.QUERY({
        force: schema.BOOLEAN({ $optional: true }),
        paranoid: schema.BOOLEAN({ $optional: true })
      }, { $max: 2 })
    }),

    getUser: new Datalizer({
      params: schema.PARAMS({ employee: schema.UUID() }, { $length: 1 }),
      query: schema.QUERY({
        attributes: schema.ATTRIBUTES(userAttributes),
        include: schema.INCLUDE(userAssociations),
        paranoid: schema.BOOLEAN({ $optional: true })
      }, { $max: 20 })
    }),

    setUser: new Datalizer({
      params: schema.PARAMS({ employee: schema.UUID() }, { $length: 1 }),
      body: schema.BODY({ user: schema.UUID() }, { $length: 1 })
    }),

    removeUser: new Datalizer({
      params: schema.PARAMS(
        { employee: schema.UUID() },
        { $length: 1 }
      )
    }),

    getQuotes: new Datalizer({
      params: schema.PARAMS({ employee: schema.UUID() }, { $length: 1 }),
      query: schema.QUERY({
        id: schema.UUID({ $optional: true, $deny: true }),
        customer_id: schema.UUID({ $optional: true }),
        salesman_id: schema.UUID({ $optional: true }),
        code: schema.CODE({ $optional: true }),
        subject: schema.TEXT_FILTER({ $optional: true }),
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
        attributes: schema.ATTRIBUTES(quoteAttributes),
        include: schema.INCLUDE(quoteAssociations),
        paranoid: schema.BOOLEAN({ $optional: true }),
        limit: schema.LIMIT({ $optional: true }),
        offset: schema.OFFSET({ $optional: true }),
        sort_by: schema.ENUM(quoteAttributes),
        order_by: schema.ORDER_BY({ $optional: true })
      }, { $max: 34 })
    }),

    addQuotes: new Datalizer({
      params: schema.PARAMS({ employee: schema.UUID() }, { $length: 1 }),
      body: schema.BODY({ quotes: schema.UUID_ARRAY() }, { $length: 1 })
    }),

    getQuote: new Datalizer({
      params: schema.PARAMS(
        { employee: schema.UUID(), quote: schema.UUID() },
        { $length: 2 }
      ),
      query: schema.QUERY({
        attributes: schema.ATTRIBUTES(quoteAttributes),
        include: schema.INCLUDE(quoteAssociations),
        paranoid: schema.BOOLEAN({ $optional: true })
      }, { $max: 20 })
    }),

    getSupervisors: new Datalizer({
      params: schema.PARAMS({ employee: schema.UUID() }, { $length: 1 }),
      query: schema.QUERY({
        id: schema.UUID({ $optional: true, $deny: true }),
        code: schema.CODE({ $optional: true }),
        firstname: schema.TEXT_FILTER({ $optional: true }),
        lastname: schema.TEXT_FILTER({ $optional: true }),
        is_supervisor: schema.NUMBER({
          $optional: true,
          $zero: true,
          $min: 0,
          $max: 1
        }),
        extra: schema.EXTRA({ $optional: true }),
        created_at: schema.DATE_FILTER({ $optional: true }),
        updated_at: schema.DATE_FILTER({ $optional: true }),
        deleted_at: schema.DATE_FILTER({ $optional: true }),
        created_by: schema.UUID({ $optional: true }),
        updated_by: schema.UUID({ $optional: true }),
        deleted_by: schema.UUID({ $optional: true }),
        attributes: schema.ATTRIBUTES(employeeAttributes),
        include: schema.INCLUDE(employeeAssociations),
        paranoid: schema.BOOLEAN({ $optional: true }),
        offset: schema.OFFSET({ $optional: true }),
        limit: schema.LIMIT({ $optional: true }),
        sort_by: schema.ENUM(employeeAttributes),
        order_by: schema.ORDER_BY({ $optional: true })
      }, { $max: 34 })
    }),

    addSupervisors: new Datalizer({
      params: schema.PARAMS({ employee: schema.UUID() }, { $length: 1 }),
      body: schema.BODY({ supervisors: schema.UUID_ARRAY() }, { $length: 1 })
    }),

    getSupervisor: new Datalizer({
      params: schema.PARAMS(
        { employee: schema.UUID(), supervisor: schema.UUID() },
        { $length: 2 }
      ),
      query: schema.QUERY({
        attributes: schema.ATTRIBUTES(employeeAttributes),
        include: schema.INCLUDE(employeeAssociations),
        paranoid: schema.BOOLEAN({ $optional: true })
      }, { $max: 20 })
    }),

    updateSupervisor: new Datalizer({
      params: schema.PARAMS(
        { employee: schema.UUID(), supervisor: schema.UUID() },
        { $length: 2 }
      ),
      query: schema.QUERY({
        paranoid: schema.BOOLEAN({ $optional: true })
      }, { $max: 1, $optional: true }),
      body: schema.BODY({
        order_id: schema.UUID({ $optional: true, $deny: true }),
        employee_id: schema.UUID({ $optional: true, $deny: true }),
        extra: schema.EXTRA({ $optional: true }),
        created_at: schema.DATE({ $optional: true }),
        updated_at: schema.DATE({ $optional: true }),
        deleted_at: schema.DATE({ $optional: true }),
        created_by: schema.UUID({ $optional: true }),
        updated_by: schema.UUID({ $optional: true }),
        deleted_by: schema.UUID({ $optional: true })
      }, { $max: 9, $empty: false })
    }),

    removeSupervisor: new Datalizer({
      params: schema.PARAMS(
        { employee: schema.UUID(), supervisor: schema.UUID() },
        { $length: 2 }
      ),
      query: schema.QUERY({
        force: schema.BOOLEAN({ $optional: true }),
        paranoid: schema.BOOLEAN({ $optional: true })
      }, { $max: 2 })
    })
  });
};
