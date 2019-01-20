import { Joi, schema, validate } from "src/routes/utils/validator";
import prematch from "src/routes/utils/prematcher";
import db from "src/db/models";

const { Item } = db.sequelize.models;

// schemas --------------------------------------------------------------------

export const get_categories = schema.request.keys({
  headers: schema.headers,
  query: schema.query.append({
    fields: Joi.array().items(Joi.string().valid(
      "id",
      "code",
      "name",
      "parent_id",
      "created_at",
      "updated_at",
      "deleted_at"
    )).max(6).optional(),
    search: Joi.object({
      code: Joi.alternatives().try(
        Joi.string().trim().max(10).optional(),
        schema.alt(Joi.string().trim().max(10).optional()).label('code')
      ).label('code'),
      name: Joi.alternatives().try(
        Joi.string().trim().max(100).optional(),
        schema.alt(Joi.string().trim().max(100).optional())
      ).label('name'),
      parent_id: schema.id.label("parent_id").optional(),
      created_at: schema.date_try.label("created_at").optional(),
      updated_at: schema.date_try.label("updated_at").optional(),
      deleted_at: schema.date_try.label("deleted_at").optional(),
    }).optional()
  })
});

export const create_categories = schema.request.keys({
  headers: schema.headers,
  body: schema.body.keys({
    values: schema.bulk.values.items(schema.values.keys({
      parent_id: schema.id.optional().allow(null).label("parent_id"),
      code: schema.code,
      name: schema.name.required(),
      extra: schema.extra,
      created_at: schema.created_at,
      updated_at: schema.updated_at,
      deleted_at: schema.deleted_at
    }))
  })
});

export const get_category = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ category: schema.id })
});

export const update_category = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ category: schema.id }),
  body: schema.body.keys({
    values: schema.values.keys({
      parent_id: schema.id.optional().allow(null).label("parent_id"),
      code: schema.code,
      name: schema.name.optional(),
      extra: schema.extra,
      created_at: schema.created_at,
      updated_at: schema.updated_at,
      deleted_at: schema.deleted_at
    })
  })
});

export const delete_category = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ category: schema.id }),
  query: schema.query.keys({ force: schema.force })
});

export const add_items = schema.request.keys({
  headers: schema.headers,
  query: schema.query,
  params: schema.params.keys({ category: schema.id }),
  body: schema.body.keys({ values: schema.bulk.id })
});

export const get_items = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ category: schema.id }),
  query: schema.query.append({
    fields: Joi.array().items(Joi.string().valid(
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

export const get_item = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ category: schema.id, item: schema.id })
});

// middlewares ----------------------------------------------------------------

export default {
  // category:
  get_categories: validate(get_categories),
  create_categories: validate(create_categories),
  get_category: validate(get_category),
  update_category: validate(update_category),
  delete_category: validate(delete_category),
  // item:
  add_items: [ validate(add_items), prematch(Item) ],
  get_items: validate(get_items),
  get_item: validate(get_item)
};
