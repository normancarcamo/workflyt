import { Joi, schema } from "src/utils/validator";

export const getEmployees = schema.request.keys({
  headers: schema.headers,
  query: schema.query.append({
    fields: Joi.array().items(Joi.string().valid(
      "id", "supervisor_id", "department_id", "code",
      "firstname", "lastname", "extra",
      "created_at", "updated_at", "deleted_at",
      "created_by", "updated_by", "deleted_by"
    ), Joi.any().strip()).max(13),
    search: Joi.object({
      id: schema.id.forbidden(),
      supervisor_id: schema.id,
      departement_id: schema.id,
      code: schema.code,
      firstname: schema.look_up(Joi.string().max(100)),
      lastname: schema.look_up(Joi.string().max(100)),
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

export const createEmployees = schema.request.keys({
  headers: schema.headers,
  body: schema.body.keys({
    values: schema.bulk.values.items(schema.values.keys({
      id: schema.id.allow(null),
      supervisor_id: schema.id.allow(null),
      department_id: schema.id.required(),
      code: schema.code,
      firstname: schema.name.required(),
      lastname: schema.name.required(),
      extra: schema.extra,
      created_at: schema.created_at,
      updated_at: schema.updated_at,
      deleted_at: schema.deleted_at,
      created_by: schema.created_by,
      updated_by: schema.updated_by,
      deleted_by: schema.deleted_by,
    }).unknown(false))
  })
});

export const getEmployee = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ employee: schema.id.required() }),
});

export const updateEmployee = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ employee: schema.id.required() }),
  body: schema.body.keys({
    values: schema.values.keys({
      id: schema.id.forbidden(),
      supervisor_id: schema.id.allow(null),
      department_id: schema.id,
      code: schema.code,
      firstname: schema.name,
      lastname: schema.name,
      extra: schema.extra,
      created_at: schema.created_at,
      updated_at: schema.updated_at,
      deleted_at: schema.deleted_at,
      created_by: schema.created_by,
      updated_by: schema.updated_by,
      deleted_by: schema.deleted_by,
    }).unknown(false)
  })
});

export const deleteEmployee = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ employee: schema.id.required() }),
  query: schema.query.keys({ force: schema.force })
});

export const setUser = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ employee: schema.id.required() }),
  body: schema.body.keys({ values: schema.id.required() })
});

export const getUser = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({
    employee: schema.id.required(),
    user: schema.id.required()
  })
});

export const getQuotes = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ employee: schema.id.required() }),
  query: schema.query.append({
    fields: Joi.array().items(Joi.string().valid(
      "id", "customer_id", "salesman_id", "code",
      "subject", "status", "extra",
      "created_at", "updated_at", "deleted_at",
      "created_by", "updated_by", "deleted_by",
    ), Joi.any().strip()).max(13),
    search: Joi.object({
      id: schema.id.forbidden(),
      customer_id: schema.id,
      salesman_id: schema.id,
      code: schema.code,
      subject: schema.look_up(schema.desc),
      status: Joi.string().valid(
        "open", "confirmed", "other", "approved",
        "pending", "awaiting", "authorized",
        "cancelled", "done"
      ),
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

export const setQuotes = schema.request.keys({
  headers: schema.headers,
  query: schema.query,
  params: schema.params.keys({ employee: schema.id.required() }),
  body: schema.body.keys({ values: schema.bulk.id.required() })
});

export const getQuote = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({
    employee: schema.id.required(),
    quote: schema.id.required()
  })
});
