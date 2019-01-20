import { Joi, schema, validate } from "src/routes/utils/validator";
import prematch from "src/routes/utils/prematcher";
import db from "src/db/models";

const { Company } = db.sequelize.models;

// schemas --------------------------------------------------------------------

export const get_companies = schema.request.keys({
  headers: schema.headers,
  query: schema.query.append({
    fields: Joi.array().items(Joi.string().valid(
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

export const create_companies = schema.request.keys({
  headers: schema.headers,
  body: schema.body.keys({
    values: schema.bulk.values.items(schema.values.keys({
      id: schema.id.optional().allow(null).label("id"),
      code: schema.code,
      name: schema.name.required(),
      extra: schema.extra,
      created_at: schema.created_at,
      updated_at: schema.updated_at,
      deleted_at: schema.deleted_at
    }))
  })
});

export const get_company = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ company: schema.id })
});

export const update_company = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ company: schema.id }),
  body: schema.body.keys({
    values: schema.values.keys({
      id: schema.id.optional().allow(null).label("id"),
      code: schema.code,
      name: schema.name.optional(),
      extra: schema.extra,
      created_at: schema.created_at,
      updated_at: schema.updated_at,
      deleted_at: schema.deleted_at
    })
  })
});

export const delete_company = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ company: schema.id }),
  query: schema.query.keys({ force: schema.force })
});

// middlewares ----------------------------------------------------------------

export default {
  // company:
  get_companies: validate(get_companies),
  create_companies: validate(create_companies),
  get_company: validate(get_company),
  update_company: validate(update_company),
  delete_company: validate(delete_company)
};
