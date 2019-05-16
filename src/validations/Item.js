import { Joi, schema, validate } from "./index";

module.exports.schema = {};

module.exports.schema.getItems = schema.request.keys({
  headers: schema.headers,
  query: schema.query.append({
    fields: Joi.array().items(Joi.string().valid(
      "id", "category_id", "code", "name",
      "type", "stock", "price", "extra",
      "created_at", "updated_at", "deleted_at",
      "created_by", "updated_by", "deleted_by",
    ), Joi.any().strip()).max(14),
    search: Joi.object({
      id: schema.id.forbidden(),
      category_id: schema.id,
      code: schema.code,
      name: schema.look_up(Joi.string().max(100)),
      type: schema.look_up(Joi.string().valid(
        "service", "product", "material"
      )),
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

module.exports.schema.createItems = schema.request.keys({
  headers: schema.headers,
  body: schema.body.keys({
    values: schema.bulk.values.items(schema.values.keys({
      id: schema.id.allow(null),
      category_id: schema.id.allow(null),
      code: schema.code,
      name: schema.name.required(),
      type: Joi.string().valid("service", "product", "material")
        .default("service"),
      stock: Joi.number().integer().positive().default(0),
      price: Joi.number().precision(2).positive().default(0.0),
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

module.exports.schema.getItem = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ item: schema.id.required() })
});

module.exports.schema.updateItem = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ item: schema.id.required() }),
  body: schema.body.keys({
    values: schema.values.keys({
      id: schema.id.forbidden(),
      category_id: schema.id.allow(null),
      code: schema.code,
      name: schema.name,
      type: Joi.string().valid("service", "product", "material"),
      stock: Joi.number().integer().positive().default(0),
      price: Joi.number().precision(2).positive().default(0.0),
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

module.exports.schema.deleteItem = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ item: schema.id.required() }),
  query: schema.query.keys({ force: schema.force })
});

module.exports.schema.getStocks = schema.request.keys({
  headers: schema.headers,
  query: schema.query.append({
    fields: Joi.array().items(Joi.string().valid(
      "id", "item_id", "entries", "exits", "stock", "extra",
      "created_at", "updated_at", "deleted_at",
      "created_by", "updated_by", "deleted_by"
    ), Joi.any().strip()).max(12),
    search: Joi.object({
      id: schema.id.forbidden(),
      item_id: schema.id,
      entries: schema.look_up(Joi.number().integer().positive().default(0)),
      exits: schema.look_up(Joi.number().integer().positive().default(0)),
      stock: schema.look_up(Joi.number().integer().positive().default(0)),
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

module.exports.schema.setStocks = schema.request.keys({
  headers: schema.headers,
  query: schema.query,
  params: schema.params.keys({ item: schema.id.required() }),
  body: schema.body.keys({ stocks: schema.bulk.id.required() })
});

module.exports.schema.getStock = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({
    item: schema.id.required(),
    stock: schema.id.required()
  })
});

module.exports.validate = validate;
