import { Joi, schema, validate } from "./index";

module.exports.schema = {};

module.exports.schema.getOrders = schema.request.keys({
  headers: schema.headers,
  query: schema.query.append({
    fields: Joi.array().items(Joi.string().valid(
      "id", "quote_id", "code", "type", "status", "extra",
      "created_at", "updated_at", "deleted_at",
      "created_by", "updated_by", "deleted_by"
    ), Joi.any().strip()).max(12),
    search: Joi.object({
      id: schema.id.forbidden(),
      quote_id: schema.id,
      code: schema.look_up(Joi.string().max(20)),
      type: Joi.string().valid("work", "installation")
        .default("work"),
      status: Joi.string().valid("awaiting", "working", "cancelled", "done")
        .default("awaiting"),
      extra: schema.extra,
      created_at: schema.date_try,
      updated_at: schema.date_try,
      deleted_at: schema.date_try,
      created_by: schema.look_up(schema.id),
      updated_by: schema.look_up(schema.id),
      deleted_by: schema.look_up(schema.id)
    }).unknown(false)
  })
});

module.exports.schema.createOrders = schema.request.keys({
  headers: schema.headers,
  body: schema.body.keys({
    values: schema.bulk.values.items(
      schema.values.keys({
        id: schema.id.allow(null),
        quote_id: schema.id.required(),
        code: schema.code,
        type: Joi.string().valid("work", "installation")
          .default("service"),
        status: Joi.string().valid("awaiting", "working", "cancelled", "done")
          .default("awaiting"),
        extra: schema.extra,
        created_at: schema.created_at,
        updated_at: schema.updated_at,
        deleted_at: schema.deleted_at,
        created_by: schema.created_by,
        updated_by: schema.updated_by,
        deleted_by: schema.deleted_by
      }).unknown(false).required()
    )
  })
});

module.exports.schema.getOrder = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ order: schema.id.required() }),
});

module.exports.schema.updateOrder = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ order: schema.id.required() }),
  body: schema.body.keys({
    values: schema.values.keys({
      id: schema.id.forbidden(),
      quote_id: schema.id.forbidden(),
      code: schema.code,
      type: Joi.string().valid("work", "installation")
        .default("service"),
      status: Joi.string().valid("awaiting", "working", "cancelled", "done")
        .default("awaiting"),
      extra: schema.extra,
      created_at: schema.created_at,
      updated_at: schema.updated_at,
      deleted_at: schema.deleted_at,
      created_by: schema.created_by,
      updated_by: schema.updated_by,
      deleted_by: schema.deleted_by
    }).unknown(false).required()
  })
});

module.exports.schema.deleteOrder = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ order: schema.id.required() }),
  query: schema.query.keys({ force: schema.force })
});

module.exports.schema.getItems = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ order: schema.id.required() }),
  query: schema.query.append({
    fields: Joi.array().items(Joi.string().valid(
      "id", "category_id", "code", "name",
      "type","stock", "price", "extra",
      "created_at", "updated_at", "deleted_at",
      "created_by", "updated_by", "deleted_by"
    ), Joi.any().strip()).max(11),
    search: Joi.object({
      id: schema.id.forbidden(),
      category_id: schema.id,
      code: schema.look_up(Joi.string().max(20)),
      name: schema.look_up(Joi.string().max(100)),
      type: Joi.string().valid("service", "product", "material"),
      stock: Joi.number().default(0),
      price: Joi.number().precision(2).default(0.0),
      extra: schema.extra,
      created_at: schema.date_try,
      updated_at: schema.date_try,
      deleted_at: schema.date_try,
      created_by: schema.look_up(schema.id),
      updated_by: schema.look_up(schema.id),
      deleted_by: schema.look_up(schema.id)
    }).unknown(false)
  })
});

module.exports.schema.setItems = schema.request.keys({
  headers: schema.headers,
  query: schema.query,
  params: schema.params.keys({ order: schema.id.required() }),
  body: schema.body.keys({ values: schema.bulk.id.required() })
});

module.exports.schema.getItem = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({
    order: schema.id.required(),
    item: schema.id.required()
  })
});

module.exports.schema.updateItem = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({
    order: schema.id.required(),
    item: schema.id.required()
  }),
  body: schema.body.keys({
    values: schema.values.keys({
      order_id: schema.id.forbidden(),
      item_id: schema.id.forbidden(),
      extra: schema.extra,
      created_at: schema.created_at,
      updated_at: schema.updated_at,
      deleted_at: schema.deleted_at,
      created_by: schema.created_by,
      updated_by: schema.updated_by,
      deleted_by: schema.deleted_by
    }).unknown(false)
  })
});

module.exports.schema.removeItem = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({
    order: schema.id.required(),
    item: schema.id.required()
  })
});

module.exports.schema.getDepartments = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ order: schema.id.required() }),
  query: schema.query.append({
    fields: Joi.array().items(Joi.string().valid(
      "id", "code", "name", "extra",
      "created_at", "updated_at", "deleted_at",
      "created_by", "updated_by", "deleted_by"
    ), Joi.any().strip()).max(11),
    search: Joi.object({
      id: schema.id.forbidden(),
      code: schema.look_up(Joi.string().max(20)),
      name: schema.look_up(Joi.string().max(100)),
      extra: schema.extra,
      created_at: schema.date_try,
      updated_at: schema.date_try,
      deleted_at: schema.date_try,
      created_by: schema.look_up(schema.id),
      updated_by: schema.look_up(schema.id),
      deleted_by: schema.look_up(schema.id)
    }).unknown(false)
  })
});

module.exports.schema.setDepartments = schema.request.keys({
  headers: schema.headers,
  query: schema.query,
  params: schema.params.keys({ order: schema.id.required() }),
  body: schema.body.keys({ values: schema.bulk.id.required() })
});

module.exports.schema.getDepartment = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({
    order: schema.id.required(),
    department: schema.id.required()
  })
});

module.exports.schema.updateDepartment = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({
    order: schema.id.required(),
    department: schema.id.required()
  }),
  body: schema.body.keys({
    values: schema.values.keys({
      order_id: schema.id.forbidden(),
      department_id: schema.id.forbidden(),
      extra: schema.extra,
      created_at: schema.created_at,
      updated_at: schema.updated_at,
      deleted_at: schema.deleted_at,
      created_by: schema.created_by,
      updated_by: schema.updated_by,
      deleted_by: schema.deleted_by
    }).unknown(false)
  })
});

module.exports.schema.removeDepartment = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({
    order: schema.id.required(),
    department: schema.id.required()
  })
});

module.exports.schema.getEmployees = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ order: schema.id.required() }),
  query: schema.query.append({
    fields: Joi.array().items(Joi.string().valid(
      "id", "code", "name", "extra",
      "created_at", "updated_at", "deleted_at",
      "created_by", "updated_by", "deleted_by"
    ), Joi.any().strip()).max(11),
    search: Joi.object({
      id: schema.id.forbidden(),
      supervisor_id: schema.id,
      departement_id: schema.id,
      code: schema.look_up(Joi.string().max(20)),
      firstname: schema.look_up(Joi.string().max(50)),
      lastname: schema.look_up(Joi.string().max(50)),
      extra: schema.extra,
      created_at: schema.date_try,
      updated_at: schema.date_try,
      deleted_at: schema.date_try,
      created_by: schema.look_up(schema.id),
      updated_by: schema.look_up(schema.id),
      deleted_by: schema.look_up(schema.id),
    }).unknown(false)
  })
});

module.exports.schema.setEmployees = schema.request.keys({
  headers: schema.headers,
  query: schema.query,
  params: schema.params.keys({ order: schema.id.required() }),
  body: schema.body.keys({ values: schema.bulk.id.required() })
});

module.exports.schema.getEmployee = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({
    order: schema.id.required(),
    employee: schema.id.required()
  })
});

module.exports.schema.updateEmployee = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({
    order: schema.id.required(),
    employee: schema.id.required()
  }),
  body: schema.body.keys({
    values: schema.values.keys({
      order_id: schema.id.forbidden(),
      employee_id: schema.id.forbidden(),
      extra: schema.extra,
      created_at: schema.created_at,
      updated_at: schema.updated_at,
      deleted_at: schema.deleted_at,
      created_by: schema.created_by,
      updated_by: schema.updated_by,
      deleted_by: schema.deleted_by
    }).unknown(false)
  })
});

module.exports.schema.removeEmployee = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({
    order: schema.id.required(),
    employee: schema.id.required()
  })
});

module.exports.validate = validate;
