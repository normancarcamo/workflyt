const { ValidationError } = require("@playscode/fns/lib/errors");
const base = require("joi");
const xss = require("@ncardez/joi-xss");
const Joi = base.extend(
  xss("object"),
  xss("array"),
  xss("string")
);

// Schemas --------------------------------------------------------------------

const alt = schema => {
  return [
    "eq", "ne", "gte", "gt", "lte", "lt", "not", "is", "in", "notIn", "like",
    "notLike", "iLike", "notILike", "regexp", "notRegexp", "iRegexp",
    "notIRegexp", "between", "notBetween", "overlap", "contains", "contained",
    "adjacent", "strictLeft", "strictRight", "noExtendRight", "noExtendLeft",
    "and", "or", "any", "all", "values", "col", "placeholder", "join", "raw"
  ].reduce((object, operator) => {
    object.append({ [operator]: schema.label(operator) });
    return object;
  }, Joi.object({}));
};

const fields = Joi.array().label("fields");

const limit = Joi.number().positive().integer().label("limit").default(20);

const offset = Joi.number().positive().integer().label("offset");

const search = Joi.object().label("search");

const include = Joi.array()
  .items(Joi.string().label("include").max(30))
  .single(true)
  .min(0)
  .unique()
  .sparse(false)
  .label("include");

const order_by = Joi.string().label("order_by").max(50);

const sort = Joi.string().valid("asc", "desc").label("sort").max(4);

const force = Joi.boolean().label('force').options({ convert: true });

const paranoid = Joi.boolean().label('paranoid').options({ convert: true });

const prematch = Joi.boolean().label('prematch').options({ convert: true });

const date = Joi.date()
  .min('1-1-1970')
  .label("date")
  .example("2018-12-28 07:43:29");

const date_range = Joi.object({
  from: date.label("from").required(),
  to: date.label('to').greater(Joi.ref('from')).required()
}).min(1);

const date_try = Joi.alternatives().try(date, date_range, alt(date).min(1));

const id = Joi.string()
  .uuid({ version: [ 'uuidv4' ] })
  .empty()
  .example("10ba038e-48da-487b-96e8-8d3b99b6d18a")
  .label("id")
;

const id_try = Joi.alternatives().try(id, alt(id).min(1));

const name = Joi.string().trim().min(2).max(100).empty().label("name");

const pass = Joi.string().trim().min(5).empty().label("pass");

const desc = Joi.string().trim().max(250).empty();

const code = Joi.string()
  .min(5)
  .max(30)
  .trim()
  .empty()
  .allow(null)
  .default('unset')
  .example(
    "CAT/001", "COM/002", "CUS/003", "DEP/004", "EMP/005", "MAT/006",
    "PRO/007", "SER/008", "ORI/009", "ORW/010", "PER/011", "QUO/19-012",
    "ROL/013", "SUP/014", "USR/015", "WRH/016"
  ).label("code")
;

const extra = Joi.object().unknown().allow(null).label("extra").example({});

const created_at = date.label("created_at");

const updated_at = date.label("updated_at");

const deleted_at = date.label("deleted_at").allow(null);

const created_by = id.label("created_by").allow(null);

const updated_by = id.label("updated_by").allow(null);

const deleted_by = id.label("deleted_by").allow(null);

const values = Joi.object().required().min(1).unknown().label("values");

const number_positive = Joi.number().default(0).integer().positive();

const bulk = {};

bulk.id = Joi.array()
  .items(id)
  .single(true)
  .min(1)
  .unique()
  .sparse(false)
  .label("bulk_id");

bulk.values = Joi.array()
  .required()
  .single(true)
  .min(1)
  .unique()
  .sparse(false)
  .label("bulk_values");

const enums = (values, use) => Joi.string().valid(values).default(use);

const request = Joi.object().required().min(1).unknown().label("request");

const headers = Joi.object({
  'content-type': Joi.string(),
  'host': Joi.string()
}).unknown();

const body = Joi.object()
  .required()
  .unknown(false)
  .options({ stripUnknown: { arrays: true, objects: true } })
  .xss({ stripIgnoreTag: true, deep: true })
  .label("body");

const params = Joi.object()
  .required()
  .unknown(false)
  .options({ stripUnknown: { arrays: true, objects: true } })
  .xss({ stripIgnoreTag: true, deep: true })
  .label("params");

const query = Joi.object()
  .required()
  .keys({
    fields,
    search,
    include,
    limit,
    offset,
    order_by,
    sort,
    prematch,
    force,
    paranoid
  })
  .unknown(false)
  .options({ stripUnknown: { arrays: true, objects: true } })
  .xss({ stripIgnoreTag: true, deep: true })
  .label("query");

const look_up = s => Joi.alternatives().try(s, alt(s))

// Middlewares ----------------------------------------------------------------

module.exports.validate = function(schema) {
  return function (req, res, next) {
    schema.validate(req, { abortEarly: false }, (err, value) => {
      if (err) {
        next(new ValidationError("Invalid Input.", { details: err.details }));
      } else {
        next();
      }
    });
  }
}

// Others ---------------------------------------------------------------------

module.exports.schema = {
  fields,
  limit,
  offset,
  search,
  include,
  order_by,
  sort,
  force,
  paranoid,
  prematch,
  date,
  date_range,
  date_try,
  values,
  id,
  id_try,
  name,
  pass,
  code,
  extra,
  created_at,
  updated_at,
  deleted_at,
  created_by,
  updated_by,
  deleted_by,
  bulk,
  request,
  headers,
  body,
  params,
  query,
  alt,
  look_up,
  enum: enums,
  desc: desc,
  subject: desc,
  notes: desc,
  number_positive
};

module.exports.Joi = Joi;
