import { Joi, schema, validate } from "src/routes/utils/validator";
import prematch from "src/routes/utils/prematcher";
import db from "src/db/models";

const { Supplier, Item } = db.sequelize.models;

// schemas --------------------------------------------------------------------

// suppplier:

export const get_suppliers = schema.request.keys({
  headers: schema.headers,
  query: schema.query.append({
    fields: Joi.array().items(Joi.string().valid(
      "id",
      "code",
      "name",
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
      created_at: schema.date_try.label("created_at").optional(),
      updated_at: schema.date_try.label("updated_at").optional(),
      deleted_at: schema.date_try.label("deleted_at").optional()
    }
  })
});

export const create_suppliers = schema.request.keys({
  headers: schema.headers,
  body: schema.body.keys({
    values: schema.bulk.values.items(schema.values.keys({
      code: schema.code,
      name: schema.name.required(),
      extra: schema.extra,
      created_at: schema.created_at,
      updated_at: schema.updated_at,
      deleted_at: schema.deleted_at
    }))
  })
});

export const get_supplier = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ supplier: schema.id }),
});

export const update_supplier = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ supplier: schema.id }),
  body: schema.body.keys({
    values: schema.values.keys({
      code: schema.code,
      name: schema.name.optional(),
      extra: schema.extra,
      created_at: schema.created_at,
      updated_at: schema.updated_at,
      deleted_at: schema.deleted_at
    })
  })
});

export const delete_supplier = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ supplier: schema.id }),
  query: schema.query.keys({ force: schema.force })
});

// supplier_item:

export const add_items = schema.request.keys({
  headers: schema.headers,
  query: schema.query,
  params: schema.params.keys({ supplier: schema.id }),
  body: schema.body.keys({ values: schema.bulk.id })
});

export const get_items = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ supplier: schema.id }),
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
  params: schema.params.keys({ supplier: schema.id, item: schema.id })
});

export const update_item = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ supplier: schema.id, item: schema.id }),
  body: schema.body.keys({
    values: schema.values.keys({
      extra: schema.extra,
      created_at: schema.created_at,
      updated_at: schema.updated_at,
      deleted_at: schema.deleted_at
    })
  })
});

export const remove_item = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ supplier: schema.id, item: schema.id })
});

// middlewares ----------------------------------------------------------------

export default {
  // supplier:
  get_suppliers: validate(get_suppliers),
  create_suppliers: validate(create_suppliers),
  get_supplier: validate(get_supplier),
  update_supplier: validate(update_supplier),
  delete_supplier: validate(delete_supplier),
  // supplier_item:
  add_items: [ validate(add_items), prematch(Item) ],
  get_items: validate(get_items),
  get_item: validate(get_item),
  update_item: validate(update_item),
  remove_item: validate(remove_item)
};
