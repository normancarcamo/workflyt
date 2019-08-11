module.exports = ({ schema, Datalizer }) => {
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

  const departmentAttributes = [
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

  const orderAssociations = [ 'quote', 'departments', 'items', 'employees' ];

  const itemAssociations = [ 'stocks' ];

  const departmentAssociations = [ 'employees' ];

  const employeeAssociations = [ 'supervisors', 'user' ];

  return Object.freeze({
    getOrders: new Datalizer({
      query: schema.QUERY({
        id: schema.UUID({ $optional: true, $deny: true }),
        quote_id: schema.UUID({ $optional: true }),
        code: schema.CODE({ $optional: true }),
        type: schema.ENUM([ 'work', 'installation' ]),
        status: schema.ENUM([ 'awaiting', 'working', 'cancelled', 'done' ]),
        extra: schema.EXTRA({ $optional: true }),
        created_at: schema.DATE_FILTER({ $optional: true }),
        updated_at: schema.DATE_FILTER({ $optional: true }),
        deleted_at: schema.DATE_FILTER({ $optional: true }),
        created_by: schema.UUID({ $optional: true }),
        updated_by: schema.UUID({ $optional: true }),
        deleted_by: schema.UUID({ $optional: true }),
        limit: schema.LIMIT({ $optional: true }),
        offset: schema.OFFSET({ $optional: true }),
        paranoid: schema.BOOLEAN({ $optional: true }),
        attributes: schema.ATTRIBUTES(orderAttributes),
        include: schema.INCLUDE(orderAssociations),
        sort_by: schema.ENUM(orderAttributes),
        order_by: schema.ORDER_BY({ $optional: true })
      }, { $max: 30 })
    }),

    createOrders: new Datalizer({
      body: schema.BODY({
        id: schema.UUID({ $optional: true, $null: true }),
        quote_id: schema.UUID({ $optional: true }),
        code: schema.CODE({ $optional: true }),
        type: schema.ENUM(
          [ 'work', 'installation' ],
          { $default: 'service' }
        ),
        status: schema.ENUM(
          [ 'awaiting', 'working', 'cancelled', 'done' ],
          { $default: 'awaiting' }
        ),
        extra: schema.EXTRA({ $optional: true }),
        created_at: schema.DATE({ $optional: true }),
        updated_at: schema.DATE({ $optional: true }),
        deleted_at: schema.DATE({ $optional: true }),
        created_by: schema.UUID({ $optional: true }),
        updated_by: schema.UUID({ $optional: true }),
        deleted_by: schema.UUID({ $optional: true }),
      }, { $max: 12, $empty: false })
    }),

    getOrder: new Datalizer({
      params: schema.PARAMS(
        { order: schema.UUID() },
        { $length: 1 }
      ),
      query: schema.QUERY({
        attributes: schema.ATTRIBUTES(orderAttributes),
        include: schema.INCLUDE(orderAssociations),
        paranoid: schema.BOOLEAN({ $optional: true })
      }, { $max: 14 })
    }),

    updateOrder: new Datalizer({
      params: schema.PARAMS(
        { order: schema.UUID() },
        { $length: 1 }
      ),
      query: schema.QUERY({
        paranoid: schema.BOOLEAN({ $optional: true })
      }, { $max: 1, $optional: true }),
      body: schema.BODY({
        id: schema.UUID({ $optional: true, $deny: true }),
        quote_id: schema.UUID({ $optional: true }),
        code: schema.CODE({ $optional: true }),
        type: schema.ENUM(
          [ 'work', 'installation' ],
          { $default: 'service' }
        ),
        status: schema.ENUM(
          [ 'awaiting', 'working', 'cancelled', 'done' ],
          { $default: 'awaiting' }
        ),
        extra: schema.EXTRA({ $optional: true }),
        created_at: schema.DATE({ $optional: true }),
        updated_at: schema.DATE({ $optional: true }),
        deleted_at: schema.DATE({ $optional: true }),
        created_by: schema.UUID({ $optional: true }),
        updated_by: schema.UUID({ $optional: true }),
        deleted_by: schema.UUID({ $optional: true }),
      }, { $max: 12, $empty: false })
    }),

    deleteOrder: new Datalizer({
      params: schema.PARAMS(
        { order: schema.UUID() },
        { $length: 1 }
      ),
      query: schema.QUERY({
        force: schema.BOOLEAN({ $optional: true }),
        paranoid: schema.BOOLEAN({ $optional: true })
      }, { $max: 2 })
    }),

    getItems: new Datalizer({
      params: schema.PARAMS(
        { order: schema.UUID() },
        { $length: 1 }
      ),
      query: schema.QUERY({
        id: schema.UUID({ $optional: true, $deny: true }),
        category_id: schema.UUID({ $optional: true }),
        code: schema.CODE({ $optional: true }),
        name: schema.TEXT_FILTER({ $optional: true }),
        type: schema.ENUM([ 'service', 'product', 'material' ]), // pending to be removed
        stock: schema.NUMBER_FILTER({ $optional: true }), // pending to be removed
        price: schema.PRICE_FILTER({ $optional: true }), // pending to be removed
        extra: schema.EXTRA({ $optional: true }),
        created_at: schema.DATE_FILTER({ $optional: true }),
        updated_at: schema.DATE_FILTER({ $optional: true }),
        deleted_at: schema.DATE_FILTER({ $optional: true }),
        created_by: schema.UUID({ $optional: true }),
        updated_by: schema.UUID({ $optional: true }),
        deleted_by: schema.UUID({ $optional: true }),
        attributes: schema.ATTRIBUTES(itemAttributes),
        include: schema.ATTRIBUTES(itemAssociations),
        limit: schema.LIMIT({ $optional: true }),
        offset: schema.OFFSET({ $optional: true }),
        paranoid: schema.BOOLEAN({ $optional: true }),
        sort_by: schema.ENUM(itemAttributes),
        order_by: schema.ORDER_BY({ $optional: true })
      }, { $max: 30 })
    }),

    addItems: new Datalizer({
      params: schema.PARAMS(
        { order: schema.UUID() },
        { $length: 1 }
      ),
      body: schema.BODY(
        { items: schema.UUID_ARRAY() },
        { $length: 1 }
      )
    }),

    getItem: new Datalizer({
      params: schema.PARAMS(
        { order: schema.UUID(), item: schema.UUID() },
        { $length: 2 }
      ),
      query: schema.QUERY({
        attributes: schema.ATTRIBUTES(itemAttributes),
        include: schema.ATTRIBUTES(itemAssociations),
        paranoid: schema.BOOLEAN({ $optional: true })
      }, { $max: 20 })
    }),

    updateItem: new Datalizer({
      params: schema.PARAMS(
        { order: schema.UUID(), item: schema.UUID() },
        { $length: 2 }
      ),
      query: schema.QUERY({
        paranoid: schema.BOOLEAN({ $optional: true })
      }, { $max: 1, $optional: true }),
      body: schema.BODY({
        order_id: schema.UUID({ $optional: true, $deny: true }),
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
        { order: schema.UUID(), item: schema.UUID() },
        { $length: 2 }
      ),
      query: schema.QUERY({
        force: schema.BOOLEAN({ $optional: true }),
        paranoid: schema.BOOLEAN({ $optional: true })
      }, { $max: 2 })
    }),

    getDepartments: new Datalizer({
      params: schema.PARAMS(
        { order: schema.UUID() },
        { $length: 1 }
      ),
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
        attributes: schema.ATTRIBUTES(departmentAttributes),
        include: schema.ATTRIBUTES(departmentAssociations),
        limit: schema.LIMIT({ $optional: true }),
        offset: schema.OFFSET({ $optional: true }),
        paranoid: schema.BOOLEAN({ $optional: true }),
        sort_by: schema.ENUM(departmentAttributes),
        order_by: schema.ORDER_BY({ $optional: true })
      }, { $max: 30 })
    }),

    addDepartments: new Datalizer({
      params: schema.PARAMS(
        { order: schema.UUID() },
        { $length: 1 }
      ),
      body: schema.BODY(
        { departments: schema.UUID_ARRAY() },
        { $length: 1 }
      )
    }),

    getDepartment: new Datalizer({
      params: schema.PARAMS(
        { order: schema.UUID(), department: schema.UUID() },
        { $length: 2 }
      ),
      query: schema.QUERY({
        attributes: schema.ATTRIBUTES(departmentAttributes),
        include: schema.ATTRIBUTES(departmentAssociations),
        paranoid: schema.BOOLEAN({ $optional: true }),
      }, { $max: 30 })
    }),

    updateDepartment: new Datalizer({
      params: schema.PARAMS(
        { order: schema.UUID(), department: schema.UUID() },
        { $length: 2 }
      ),
      query: schema.QUERY({
        paranoid: schema.BOOLEAN({ $optional: true })
      }, { $max: 1, $optional: true }),
      body: schema.BODY({
        order_id: schema.UUID({ $optional: true, $deny: true }),
        department_id: schema.UUID({ $optional: true, $deny: true }),
        extra: schema.EXTRA({ $optional: true }),
        created_at: schema.DATE({ $optional: true }),
        updated_at: schema.DATE({ $optional: true }),
        deleted_at: schema.DATE({ $optional: true }),
        created_by: schema.UUID({ $optional: true }),
        updated_by: schema.UUID({ $optional: true }),
        deleted_by: schema.UUID({ $optional: true })
      }, { $max: 9, $empty: false })
    }),

    removeDepartment: new Datalizer({
      params: schema.PARAMS(
        { order: schema.UUID(), department: schema.UUID() },
        { $length: 2 }
      ),
      query: schema.QUERY({
        force: schema.BOOLEAN({ $optional: true }),
        paranoid: schema.BOOLEAN({ $optional: true })
      }, { $max: 2 })
    }),

    getEmployees: new Datalizer({
      params: schema.PARAMS(
        { order: schema.UUID() },
        { $length: 1 }
      ),
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
        include: schema.ATTRIBUTES(employeeAssociations),
        limit: schema.LIMIT({ $optional: true }),
        offset: schema.OFFSET({ $optional: true }),
        paranoid: schema.BOOLEAN({ $optional: true }),
        sort_by: schema.ENUM(employeeAttributes),
        order_by: schema.ORDER_BY({ $optional: true })
      }, { $max: 36 })
    }),

    addEmployees: new Datalizer({
      params: schema.PARAMS(
        { order: schema.UUID() },
        { $length: 1 }
      ),
      body: schema.BODY(
        { employees: schema.UUID_ARRAY() },
        { $length: 1 }
      )
    }),

    getEmployee: new Datalizer({
      params: schema.PARAMS(
        { order: schema.UUID(), employee: schema.UUID() },
        { $length: 2 }
      ),
      query: schema.QUERY({
        attributes: schema.ATTRIBUTES(employeeAttributes),
        include: schema.ATTRIBUTES(employeeAssociations),
        paranoid: schema.BOOLEAN({ $optional: true })
      }, { $max: 36 })
    }),

    updateEmployee: new Datalizer({
      params: schema.PARAMS(
        { order: schema.UUID(), employee: schema.UUID() },
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

    removeEmployee: new Datalizer({
      params: schema.PARAMS(
        { order: schema.UUID(), employee: schema.UUID() },
        { $length: 2 }
      ),
      query: schema.QUERY({
        force: schema.BOOLEAN({ $optional: true }),
        paranoid: schema.BOOLEAN({ $optional: true })
      }, { $max: 2 })
    })
  });
};
