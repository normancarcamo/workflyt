import { Joi, schema, validate } from "./index";

module.exports.schema = {};

module.exports.schema.getWarehouses = schema.request.keys({
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

module.exports.schema.createWarehouses = schema.request.keys({
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

module.exports.schema.getWarehouse = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ warehouse: schema.id.required() })
});

module.exports.schema.updateWarehouse = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ warehouse: schema.id.required() }),
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

module.exports.schema.deleteWarehouse = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ warehouse: schema.id.required() }),
  query: schema.query.keys({ force: schema.force })
});

module.exports.schema.getItems = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ warehouse: schema.id.required() }),
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
  params: schema.params.keys({ warehouse: schema.id.required() }),
  body: schema.body.keys({ items: schema.bulk.id.required() })
});

module.exports.schema.getItem = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({
    warehouse: schema.id.required(),
    item: schema.id.required()
  })
});

module.exports.schema.updateItem = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({
    warehouse: schema.id.required(),
    item: schema.id.required()
  }),
  body: schema.body.keys({
    values: schema.values.keys({
      warehouse_id: schema.id.forbidden(),
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
    warehouse: schema.id.required(),
    item: schema.id.required()
  })
});

module.exports.validate = validate;
