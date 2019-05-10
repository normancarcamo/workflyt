import { Joi, schema } from "src/utils/validator";

export const getUsers = schema.request.keys({
  headers: schema.headers,
  query: schema.query.append({
    fields: Joi.array().items(Joi.string().valid(
      "id", "code", "username", "extra",
      "created_at", "updated_at", "deleted_at",
      "created_by", "updated_by", "deleted_by"
    ), Joi.any().strip()).max(10),
    search: Joi.object({
      id: schema.id.forbidden(),
      employee_id: schema.id,
      code: schema.look_up(Joi.string().max(20)),
      username: schema.look_up(Joi.string().max(100)),
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

export const createUsers = schema.request.keys({
  headers: schema.headers,
  body: schema.body.keys({
    values: schema.bulk.values.items(
      schema.values.keys({
        id: schema.id.allow(null),
        employee_id: schema.id.allow(null),
        code: schema.code,
        username: schema.name.required(),
        password: schema.pass.required(),
        extra: schema.extra,
        created_at: schema.created_at,
        updated_at: schema.updated_at,
        deleted_at: schema.deleted_at,
        created_by: schema.created_by,
        updated_by: schema.updated_by,
        deleted_by: schema.deleted_by
      }).unknown(false)
    )
  })
});

export const getUser = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ user: schema.id.required() })
});

export const updateUser = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ user: schema.id.required() }),
  body: schema.body.keys({
    values: schema.values.keys({
      id: schema.id.forbidden(),
      employee_id: schema.id.allow(null),
      code: schema.code,
      username: schema.name,
      password: schema.pass,
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

export const deleteUser = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ user: schema.id.required() }),
  query: schema.query.keys({ force: schema.force })
});

export const getRoles = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ user: schema.id.required() }),
  query: schema.query.append({
    fields: Joi.array().items(Joi.string().valid(
      "id", "code", "username", "extra",
      "created_at", "updated_at", "deleted_at",
      "created_by", "updated_by", "deleted_by"
    ), Joi.any().strip()).max(10),
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

export const setRoles = schema.request.keys({
  headers: schema.headers,
  query: schema.query,
  params: schema.params.keys({ user: schema.id.required() }),
  body: schema.body.keys({ values: schema.bulk.id.required() })
});

export const getRole = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({
    user: schema.id.required(),
    role: schema.id.required()
  })
});

export const updateRole = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({
    user: schema.id.required(),
    role: schema.id.required()
  }),
  body: schema.body.keys({
    values: schema.values.keys({
      user_id: schema.id.forbidden(),
      role_id: schema.id.forbidden(),
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

export const removeRole = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({
    user: schema.id.required(),
    role: schema.id.required()
  })
});
