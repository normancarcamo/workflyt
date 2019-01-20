import { Joi, schema, validate } from "src/routes/utils/validator";
import prematch from "src/routes/utils/prematcher";
import db from "src/db/models";

const { Item } = db.sequelize.models;

// schemas --------------------------------------------------------------------

// item:

export const get_items = schema.request.keys({
  headers: schema.headers,
  query: schema.query.append({
    fields: Joi.array().items(Joi.string().valid(
      "id",
      "category_id",
      "code",
      "name",
      "type",
      "stock",
      "price",
      "extra",
      "created_at",
      "updated_at",
      "deleted_at"
    )).max(5).optional(),
    search: {
      code: Joi.alternatives().try(
        Joi.string().trim().max(10).optional(),
        schema.alt(Joi.string().trim().max(10).optional()).label('code')
      ).label('code'),
      name: Joi.alternatives().try(
        Joi.string().trim().max(100).optional(),
        schema.alt(Joi.string().trim().max(100).optional())
      ).label('name'),
      type: Joi.string().optional(),
      stock: Joi.number().default(0).label("stock").optional(),
      price: Joi.number().precision(2).default(0.0).label("price").optional(),
      created_at: schema.date_try.label("created_at").optional(),
      updated_at: schema.date_try.label("updated_at").optional(),
      deleted_at: schema.date_try.label("deleted_at").optional()
    }
  })
});

export const create_items = schema.request.keys({
  headers: schema.headers,
  body: schema.body.keys({
    values: schema.bulk.values.items(schema.values.keys({
      category_id: schema.id.optional(),
      code: schema.code.optional(),
      name: schema.name.required(),
      type: Joi.string()
        .valid("service", "product", "material").default("service").optional(),
      stock: Joi.number().default(0).label("stock").optional(),
      price: Joi.number().precision(2).default(0.0).label("price").optional(),
      extra: schema.extra,
      created_at: schema.created_at,
      updated_at: schema.updated_at,
      deleted_at: schema.deleted_at
    }))
  })
});

export const get_item = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ item: schema.id })
});

export const update_item = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ item: schema.id }),
  body: schema.body.keys({
    values: schema.values.keys({
      category_id: schema.id.optional(),
      code: schema.code.optional(),
      name: schema.name.optional(),
      type: Joi.string()
        .valid("service", "product", "material").label("type").optional(),
      stock: Joi.number().default(0).label("stock").optional(),
      price: Joi.number().precision(2).default(0.0).label("price").optional(),
      extra: schema.extra,
      created_at: schema.created_at,
      updated_at: schema.updated_at,
      deleted_at: schema.deleted_at
    })
  })
});

export const delete_item = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ item: schema.id }),
  query: schema.query.keys({ force: schema.force })
});

// item_type:

export const get_types = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ item: schema.id }),
  query: schema.query.append({
    fields: Joi.array().items(Joi.string().valid(
      "id",
      "category_id",
      "code",
      "name",
      "type",
      "stock",
      "price",
      "created_at",
      "updated_at",
      "deleted_at"
    )).max(8).optional(),
    search: {
      // id: schema.id.optional(),
      // category_id: schema.id.optional(),
      code: Joi.alternatives().try(
        Joi.string().trim().max(10).optional(),
        schema.alt(Joi.string().trim().max(10).optional()).label('code')
      ).label('code'),
      name: Joi.alternatives().try(
        Joi.string().trim().max(100).optional(),
        schema.alt(Joi.string().trim().max(100).optional())
      ).label('name'),
      type: Joi.string().valid("service", "product", "material").optional(),
      stock: Joi.number().default(0).label("stock").optional(),
      price: Joi.number().precision(2).default(0.0).label("price").optional(),
      created_at: schema.date_try.label("created_at").optional(),
      updated_at: schema.date_try.label("updated_at").optional(),
      deleted_at: schema.date_try.label("deleted_at").optional(),
    }
  })
});

export const add_types = schema.request.keys({
  headers: schema.headers,
  query: schema.query,
  params: schema.params.keys({ item: schema.id }),
  body: schema.body.keys({ values: schema.bulk.id })
});

export const get_type = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ item: schema.id, type: schema.id })
});

export const update_type = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ item: schema.id, type: schema.id }),
  body: schema.body.keys({ values: schema.values.keys({
    item_id: schema.id.optional(),
    type_id: schema.id.optional(),
    extra: schema.extra,
    created_at: schema.created_at,
    updated_at: schema.updated_at,
    deleted_at: schema.deleted_at
  }) })
});

export const remove_type = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ item: schema.id, type: schema.id })
});

// middlewares ----------------------------------------------------------------

export default {
  // item:
  get_items: validate(get_items),
  create_items: validate(create_items),
  get_item: validate(get_item),
  update_item: validate(update_item),
  delete_item: validate(delete_item),
  // item_type:
  get_types: validate(get_types),
  add_types: [ validate(add_types), prematch(Item) ],
  get_type: validate(get_type),
  update_type: validate(update_type),
  remove_type: validate(remove_type)
};
