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

  const employeeAssociations = [ 'quotes', 'user', 'supervisors' ];

  return Object.freeze({
    getSupervisors: new Datalizer({
      query: schema.QUERY({
        id: schema.UUID({ $optional: true, $deny: true }),
        code: schema.CODE({ $optional: true }),
        firstname: schema.TEXT_FILTER({ $optional: true }),
        lastname: schema.TEXT_FILTER({ $optional: true }),
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

    getSupervisor: new Datalizer({
      params: schema.PARAMS({ supervisor: schema.UUID() }, { $length: 1 }),
      query: schema.QUERY({
        attributes: schema.ATTRIBUTES(employeeAttributes),
        include: schema.INCLUDE(employeeAssociations),
        paranoid: schema.BOOLEAN({ $optional: true }),
      }, { $max: 18 })
    }),

    getEmployees: new Datalizer({
      params: schema.PARAMS({ supervisor: schema.UUID() }, { $length: 1 }),
      query: schema.QUERY({
        id: schema.UUID({ $optional: true, $deny: true }),
        code: schema.CODE({ $optional: true }),
        firstname: schema.TEXT_FILTER({ $optional: true }),
        lastname: schema.TEXT_FILTER({ $optional: true }),
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
    })
  });
};
