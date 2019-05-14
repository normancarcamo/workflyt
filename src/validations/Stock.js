import { Joi, schema, validate } from "./index";

module.exports.schema = {};

module.exports.schema.getStocks = schema.request.keys({
  headers: schema.headers,
  query: schema.query.append({
    fields: Joi.array().items(Joi.string().valid(
      "id", "code", "name", "extra",
      "created_at", "updated_at", "deleted_at",
      "created_by", "updated_by", "deleted_by"
    ), Joi.any().strip()).max(12),
    search: Joi.object({
      id: schema.id.forbidden(),
      item_id: schema.id,
      entries: schema.look_up(schema.number_positive),
      exits: schema.look_up(schema.number_positive),
      stock: schema.look_up(schema.number_positive),
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

module.exports.schema.createStocks = schema.request.keys({
  headers: schema.headers,
  body: schema.body.keys({
    values: schema.bulk.values.items(
      schema.values.keys({
        id: schema.id,
        item_id: schema.id.required(),
        entries: schema.number_positive,
        exits: schema.number_positive,
        stock: schema.number_positive,
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

module.exports.schema.getStock = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ stock: schema.id.required() })
});

module.exports.schema.updateStock = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ stock: schema.id.required() }),
  body: schema.body.keys({
    values: schema.values.keys({
      id: schema.id.forbidden(),
      item_id: schema.id.forbidden(),
      entries: schema.number_positive,
      exits: schema.number_positive,
      stock: schema.number_positive,
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

module.exports.schema.deleteStock = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ stock: schema.id.required() }),
  query: schema.query.keys({ force: schema.force })
});

module.exports.validate = validate;
