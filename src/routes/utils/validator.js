const { ValidationError } = require("@playscode/fns/lib/errors");
const base = require("joi");
const xss = require("@ncardez/joi-xss");
const Joi = base.extend(xss("object"), xss("array"), xss("string"));

// Schemas --------------------------------------------------------------------

const operators = [
  "eq", "ne", "gte", "gt", "lte", "lt", "not", "is", "in", "notIn", "like",
  "notLike", "iLike", "notILike", "regexp", "notRegexp", "iRegexp",
  "notIRegexp", "between", "notBetween", "overlap", "contains", "contained",
  "adjacent", "strictLeft", "strictRight", "noExtendRight", "noExtendLeft",
  "and", "or", "any", "all", "values", "col", "placeholder", "join", "raw"
];

const alt = schema => operators.reduce((initial, name, index) => {
  initial.append({ [name]: schema.label(name).optional() });
  return initial;
}, Joi.object().keys({}));

const fields = Joi.array().label("fields").optional();

const limit = Joi.number()
  .positive()
  .integer()
  .label("limit")
  .default(20)
  .optional();

const offset = Joi.number()
  .positive()
  .integer()
  .label("offset")
  .optional();

const search = Joi.object().label("search").optional();

const include = Joi.array()
  .items(Joi.string().label("include").max(30))
  .single(true)
  .min(0)
  .unique()
  .sparse(false)
  .optional()
  .label("include");

const order_by = Joi.string()
  .label("order_by")
  .max(50)
  .optional();

const sort = Joi.string()
  .valid("asc", "desc")
  .label("sort")
  .max(4)
  .optional();

const force = Joi.boolean()
  .label('force')
  .optional();

const paranoid = Joi.boolean()
  .label('paranoid')
  .optional();

const prematch = Joi.boolean()
  .label('prematch')
  .optional();

const date = Joi.date()
  .min('1-1-1970')
  .max('now')
  .label("date")
  .example("2018-12-28 07:43:29");

// composed:
const date_range = Joi.object({
  from: date.label("from").required(),
  to: date.label('to').greater(Joi.ref('from')).required()
}).optional().empty({});

// composed:
const date_try = Joi.alternatives().try(
  date,
  date_range,
  alt(date).empty({}).label('date_try')
).label('date_alternatives');

const values = Joi.object()
  .required()
  .empty({})
  .unknown(true)
  .label("values")

const id = Joi.string()
  .required()
  .empty('')
  .uuid({ version: [ 'uuidv4' ] })
  .label("id")
  .example("10ba038e-48da-487b-96e8-8d3b99b6d18a");

const name = Joi.string()
  .trim()
  .min(2)
  .max(100)
  .empty('')
  .required()
  .label("name")
  .example("example-name");

const code = Joi.string()
  .trim()
  .length(10)
  .empty('')
  .optional()
  .label("code")
  .allow(null)
  .example("CAT0000001", "CAT0000002");

const extra = Joi.object()
  .unknown(true)
  .optional()
  .allow(null)
  .label("extra")
  .example({});

// composed:
const created_at = date
  .label("created_at")
  .optional();

// composed:
const updated_at = date
  .label("updated_at")
  .optional();

// composed:
const deleted_at = date
  .label("deleted_at")
  .allow(null)
  .optional();

// composed:
const bulk = {};

bulk.id = Joi.array()
  .optional()
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

const request = Joi.object()
  .required()
  .empty({})
  .unknown(true)
  .label("request");

const headers = Joi.object({
  'content-type': Joi.string(),
  'host': Joi.string()
}).unknown(true);

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

// composed:
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
  name,
  code,
  extra,
  created_at,
  updated_at,
  deleted_at,
  bulk,
  request,
  headers,
  body,
  params,
  query,
  alt
};

module.exports.Joi = Joi;
