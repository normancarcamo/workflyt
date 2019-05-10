import { Joi, schema } from "src/utils/validator";

export const getPermissions = schema.request.keys({
  headers: schema.headers,
  query: schema.query.append({
    fields: Joi.array().items(Joi.string().valid(
      "id", "code", "name", "extra",
      "created_at", "updated_at", "deleted_at",
      "created_by", "updated_by", "deleted_by"
    ), Joi.any().strip()).max(10),
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

export const createPermissions = schema.request.keys({
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

export const getPermission = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ permission: schema.id.required() })
});

export const updatePermission = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ permission: schema.id }),
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

export const deletePermission = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ permission: schema.id.required() }),
  query: schema.query.keys({ force: schema.force })
});
