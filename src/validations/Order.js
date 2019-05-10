import { Joi, schema } from "src/utils/validator";

export const getOrders = schema.request.keys({
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

export const createOrders = schema.request.keys({
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

export const getOrder = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ order: schema.id.required() }),
});

export const updateOrder = schema.request.keys({
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

export const deleteOrder = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ order: schema.id.required() }),
  query: schema.query.keys({ force: schema.force })
});

export const getItems = schema.request.keys({
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

export const setItems = schema.request.keys({
  headers: schema.headers,
  query: schema.query,
  params: schema.params.keys({ order: schema.id.required() }),
  body: schema.body.keys({ values: schema.bulk.id.required() })
});

export const getItem = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({
    order: schema.id.required(),
    item: schema.id.required()
  })
});

export const updateItem = schema.request.keys({
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

export const removeItem = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({
    order: schema.id.required(),
    item: schema.id.required()
  })
});

export const getDepartments = schema.request.keys({
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

export const setDepartments = schema.request.keys({
  headers: schema.headers,
  query: schema.query,
  params: schema.params.keys({ order: schema.id.required() }),
  body: schema.body.keys({ values: schema.bulk.id.required() })
});

export const getDepartment = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({
    order: schema.id.required(),
    department: schema.id.required()
  })
});

export const updateDepartment = schema.request.keys({
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

export const removeDepartment = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({
    order: schema.id.required(),
    department: schema.id.required()
  })
});

export const getEmployees = schema.request.keys({
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

export const setEmployees = schema.request.keys({
  headers: schema.headers,
  query: schema.query,
  params: schema.params.keys({ order: schema.id.required() }),
  body: schema.body.keys({ values: schema.bulk.id.required() })
});

export const getEmployee = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({
    order: schema.id.required(),
    employee: schema.id.required()
  })
});

export const updateEmployee = schema.request.keys({
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

export const removeEmployee = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({
    order: schema.id.required(),
    employee: schema.id.required()
  })
});
