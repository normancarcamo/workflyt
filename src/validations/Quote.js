import { Joi, schema, validate } from "./index";

module.exports.schema = {};

module.exports.schema.getQuotes = schema.request.keys({
  headers: schema.headers,
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

module.exports.schema.createQuotes = schema.request.keys({
  headers: schema.headers,
  body: schema.body.keys({
    values: schema.bulk.values.items(
      schema.values.keys({
        id: schema.id,
        customer_id: schema.id.required(),
        salesman_id: schema.id.required(),
        subject: schema.name.default('No subject description'),
        code: schema.code,
        status: Joi.string().valid(
          "open", "confirmed", "other", "approved",
          "pending", "awaiting", "authorized",
          "cancelled", "done"
        ).default('awaiting'),
        extra: schema.extra,
        created_at: schema.created_at,
        updated_at: schema.updated_at,
        deleted_at: schema.deleted_at,
        created_by: schema.created_by,
        updated_by: schema.updated_by,
        deleted_by: schema.deleted_by,
      }).unknown(false)
    ).required()
  })
});

module.exports.schema.getQuote = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ quote: schema.id.required() }),
});

module.exports.schema.updateQuote = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ quote: schema.id.required() }),
  body: schema.body.keys({
    values: schema.values.keys({
      id: schema.id.forbidden(),
      customer_id: schema.id.forbidden(),
      salesman_id: schema.id.forbidden(),
      subject: schema.name.default('No subject description'),
      code: schema.code,
      status: Joi.string().valid(
        "open", "confirmed", "other", "approved",
        "pending", "awaiting", "authorized",
        "cancelled", "done"
      ).default('awaiting'),
      extra: schema.extra,
      created_at: schema.created_at,
      updated_at: schema.updated_at,
      deleted_at: schema.deleted_at,
      created_by: schema.created_by,
      updated_by: schema.updated_by,
      deleted_by: schema.deleted_by
    })
  })
});

module.exports.schema.deleteQuote = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ quote: schema.id.required() }),
  query: schema.query.keys({ force: schema.force })
});

module.exports.schema.getItems = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ quote: schema.id.required() }),
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
  params: schema.params.keys({ quote: schema.id.required() }),
  body: schema.body.keys({ items: schema.bulk.id.required() })
});

module.exports.schema.getItem = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({
    quote: schema.id.required(),
    item: schema.id.required()
  })
});

module.exports.schema.updateItem = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({
    quote: schema.id.required(),
    item: schema.id.required()
  }),
  body: schema.body.keys({
    values: schema.values.keys({
      quote_id: schema.id.forbidden(),
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
    quote: schema.id.required(),
    item: schema.id.required()
  })
});

module.exports.schema.getOrders = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ quote: schema.id.required() }),
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

module.exports.schema.setOrders = schema.request.keys({
  headers: schema.headers,
  query: schema.query,
  params: schema.params.keys({ quote: schema.id.required() }),
  body: schema.body.keys({ orders: schema.bulk.id.required() })
});

module.exports.schema.getOrder = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({
    quote: schema.id.required(),
    order: schema.id.required()
  })
});

module.exports.validate = validate;
