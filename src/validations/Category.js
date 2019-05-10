import { Joi, schema } from "src/utils/validator";

export const getCategories = schema.request.keys({
  headers: schema.headers,
  query: schema.query.append({
    fields: Joi.array().items(Joi.string().valid(
      "id", "parent_id", "code", "name", "extra",
      "created_at", "updated_at", "deleted_at",
      "created_by", "updated_by", "deleted_by",
    ), Joi.any().strip()).max(11),
    search: Joi.object({
      id: schema.id.forbidden(),
      parent_id: schema.id,
      code: schema.code,
      name: schema.look_up(Joi.string().max(100)),
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

export const createCategories = schema.request.keys({
  headers: schema.headers,
  body: schema.body.keys({
    values: schema.values.keys({
      id: schema.id.allow(null),
      parent_id: schema.id.allow(null),
      code: schema.code,
      name: schema.name.required(),
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

export const getCategory = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ category: schema.id.required() })
});

export const updateCategory = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ category: schema.id.required() }),
  body: schema.body.keys({
    values: schema.values.keys({
      id: schema.id.forbidden(),
      parent_id: schema.id.allow(null),
      code: schema.code,
      name: schema.name,
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

export const deleteCategory = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ category: schema.id.required() }),
  query: schema.query.keys({ force: schema.force })
});

export const getItems = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ category: schema.id.required() }),
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
      code: schema.code,
      name: schema.look_up(Joi.string().max(100)),
      type: Joi.string().valid("service", "product", "material"),
      stock: schema.look_up(Joi.number().integer().positive().default(0)),
      price: schema.look_up(Joi.number().precision(2).positive().default(0.0)),
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
  params: schema.params.keys({ category: schema.id.required() }),
  body: schema.body.keys({ items: schema.bulk.id.required() })
});

export const getItem = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({
    category: schema.id.required(),
    item: schema.id.required()
  })
});

export const removeItem = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({
    category: schema.id.required(),
    item: schema.id.required()
  })
});
