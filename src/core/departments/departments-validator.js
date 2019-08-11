module.exports = ({ schema, Datalizer }) => {

  let departmentAttributes = [
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

  let departmentAssociations = [ 'employees' ];

  let employeeAttributes = [
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

  let employeeAssociations = [ 'supervisors', 'user' ];

  return Object.freeze({
    getDepartments: new Datalizer({
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
        paranoid: schema.BOOLEAN({ $optional: true }),
        attributes: schema.ATTRIBUTES(departmentAttributes),
        include: schema.INCLUDE(departmentAssociations),
        sort_by: schema.ENUM(departmentAttributes),
        order_by: schema.ORDER_BY({ $optional: true })
      }, { $max: 30 })
    }),

    createDepartments: new Datalizer({
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

    getDepartment: new Datalizer({
      params: schema.PARAMS({ department: schema.UUID() }, { $length: 1 }),
      query: schema.QUERY({
        attributes: schema.ATTRIBUTES(departmentAttributes),
        include: schema.INCLUDE(departmentAssociations),
        paranoid: schema.BOOLEAN({ $optional: true })
      }, { $max: 20 })
    }),

    updateDepartment: new Datalizer({
      params: schema.PARAMS({ department: schema.UUID() }, { $length: 1 }),
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

    deleteDepartment: new Datalizer({
      params: schema.PARAMS({ department: schema.UUID() }, { $length: 1 }),
      query: schema.QUERY({
        force: schema.BOOLEAN({ $optional: true }),
        paranoid: schema.BOOLEAN({ $optional: true })
      }, { $max: 2 })
    }),

    getEmployees: new Datalizer({
      params: schema.PARAMS({ department: schema.UUID() }, { $length: 1 }),
      query: schema.QUERY({
        id: schema.UUID({ $optional: true, $deny: true }),
        code: schema.CODE({ $optional: true }),
        firstname: schema.TEXT_FILTER({ $optional: true }),
        lastname: schema.TEXT_FILTER({ $optional: true }),
        is_supervisor: schema.NUMBER({
          $optional: true,
          $zero: true,
          $min: 0,
          $max: 1,
          $default: 0
        }),
        extra: schema.EXTRA({ $optional: true }),
        created_at: schema.DATE_FILTER({ $optional: true }),
        updated_at: schema.DATE_FILTER({ $optional: true }),
        deleted_at: schema.DATE_FILTER({ $optional: true }),
        created_by: schema.UUID({ $optional: true }),
        updated_by: schema.UUID({ $optional: true }),
        deleted_by: schema.UUID({ $optional: true }),
        offset: schema.OFFSET({ $optional: true }),
        limit: schema.LIMIT({ $optional: true }),
        attributes: schema.ATTRIBUTES(employeeAttributes),
        paranoid: schema.BOOLEAN({ $optional: true }),
        include: schema.INCLUDE(employeeAssociations),
        sort_by: schema.ENUM(employeeAttributes),
        order_by: schema.ORDER_BY({ $optional: true })
      }, { $max: 35 })
    }),

    addEmployees: new Datalizer({
      params: schema.PARAMS({ department: schema.UUID() }, { $length: 1 }),
      body: schema.BODY({ employees: schema.UUID_ARRAY() }, { $length: 1 })
    }),

    getEmployee: new Datalizer({
      params: schema.PARAMS({
        department: schema.UUID(),
        employee: schema.UUID()
      }, { $length: 2 }),
      query: schema.QUERY({
        paranoid: schema.BOOLEAN({ $optional: true }),
        attributes: schema.ATTRIBUTES(employeeAttributes),
        include: schema.INCLUDE(employeeAssociations)
      }, { $max: 20 })
    }),

    updateEmployee: new Datalizer({
      params: schema.PARAMS(
        { department: schema.UUID(), employee: schema.UUID() },
        { $length: 2 }
      ),
      query: schema.QUERY({
        paranoid: schema.BOOLEAN({ $optional: true })
      }, { $max: 1, $optional: true }),
      body: schema.BODY({
        department_id: schema.UUID({ $optional: true, $deny: true }),
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
        { department: schema.UUID(), employee: schema.UUID() },
        { $length: 2 }
      ),
      query: schema.QUERY({
        force: schema.BOOLEAN({ $optional: true }),
        paranoid: schema.BOOLEAN({ $optional: true })
      }, { $max: 2 })
    })
  });
};
