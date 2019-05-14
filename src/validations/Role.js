import { Joi, schema, validate } from "./index";

module.exports.schema = {};

module.exports.schema.getRoles = schema.request.keys({
  headers: schema.headers,
  query: schema.query.append({
    fields: Joi.array().items(Joi.string().valid(
      "id", "code", "name", "extra",
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

module.exports.schema.createRoles = schema.request.keys({
  headers: schema.headers,
  body: schema.body.keys({
    values: schema.bulk.values.items(
      schema.values.keys({
        id: schema.id.allow(null),
        code: schema.code,
        name: schema.name.required(),
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

module.exports.schema.getRole = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ role: schema.id.required() })
});

module.exports.schema.updateRole = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ role: schema.id.required() }),
  body: schema.body.keys({
    values: schema.values.keys({
      id: schema.id.forbidden(),
      code: schema.code,
      name: schema.name,
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

module.exports.schema.deleteRole = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ role: schema.id.required() }),
  query: schema.query.keys({ force: schema.force })
});

module.exports.schema.getPermissions = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ role: schema.id.required() }),
  query: schema.query.append({
    fields: Joi.array().items(Joi.string().valid(
      "id", "code", "name", "extra",
      "created_at", "updated_at", "deleted_at",
      "created_by", "updated_by", "deleted_by"
    ), Joi.any().strip()).max(11),
    search: Joi.object({
      id: schema.id.forbidden(),
      code: schema.code,
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

module.exports.schema.setPermissions = schema.request.keys({
  headers: schema.headers,
  query: schema.query,
  params: schema.params.keys({ role: schema.id.required() }),
  body: schema.body.keys({ values: schema.bulk.id })
});

module.exports.schema.getPermission = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({
    role: schema.id.required(),
    permission: schema.id.required()
  })
});

module.exports.schema.updatePermission = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({
    role: schema.id.required(),
    permission: schema.id.required()
  }),
  body: schema.body.keys({
    values: schema.values.keys({
      role_id: schema.id.forbidden(),
      permission_id: schema.id.forbidden(),
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

module.exports.schema.removePermission = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({
    role: schema.id.required(),
    permission: schema.id.required()
  })
});

module.exports.validate = validate;
