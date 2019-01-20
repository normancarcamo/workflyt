const base = require("joi");
const xss = require("@ncardez/joi-xss");
// const S = require("string");
// const { is } = require("@playscode/fns");
const Joi = base.extend(xss("object"), xss("array"), xss("string"));

function str(joi) {
  let base = joi.string();
  let name = "str";
  let language = {};
  let rules = [];
  let string = null;
  let keys = Object.keys(S("string").constructor.prototype);

  keys.push("xss");

  for (let name of keys) {
    language[name] = '{{msg}}';
    rules.push({
      name: name,
      params: { args: joi.any().optional() },
      validate: ({ args }, value, state, options) => {
        if (!string) { string = S(value); };

        if (Array.isArray(args)) {
          string = string[name].apply(string, args);
          return string.s;
        } else {
          // string = string[name](args);
          if (name === "xss") {
            console.log('Yeh!', args);
            string = S(xss(string.s, args));
            return string.s;
          } else {
            console.log('No')
            string = string[name](args);
            return string.s;
          }
        }
      }
    });
  }

  return { base, name, language, rules };
}

function recursive(value, args) {
  if (is.object(value)) {
    for (let key in value) {
      if (args.deep && (is.object(value[key]) || is.array(value[key]))) {
        recursive(value[key], args);
      } else {
        value[key] = xss(value[key], args);
      }
    };
  } else {
    value.forEach((element, index) => {
      if (args.deep && (is.object(element) || is.array(element))) {
        recursive(element, args);
      } else {
        value[index] = xss(element, args);
      }
    });
  }
}

function noXSS(type, name = "xss") {
  return function(joi) {
    return {
      base: joi[type](),
      name: type,
      language: { [name]: '{{msg}}' },
      rules: [{
        name: name,
        params: { args: joi.any().optional() },
        validate: ({ args }, value, state, options) => {
          if (type === "object" || type === "array") {
            recursive(value, { whiteList: [], ...args });
          } else {
            value = xss(value, { whiteList: [], ...args });
          }
          return value;
        }
      }]
    }
  }
}

// let value1 = "<p<a<b>>><p<a<b>>><p<a<b>>><p>bingo<p<a<b>>><p<a<b>>>><p<a<b>>></p>";
// let Joi = base.extend(str);
// let result = Joi.str()
  // .xss({ whiteList: [], stripIgnoreTag: true, stripIgnoreTagBody: true })
  // .escapeHTML()
  // .unescapeHTML()
  // .humanize()
  // .stripTags("")
  // .stripTags("")
  // .stripTags("")
  // .stripRight('>')
// .validate(value1);

// let Joi = base.extend(
//   noXSS("object"),
//   noXSS("array"),
//   noXSS("string")
// );

// SCHEMAS:
// let schema1 = Joi.object().unknown(true);
// let schema2 = Joi.array().items([ Joi.any() ]);
// let schema3 = Joi.string();

// FIXTURE object:
// let object = {
//   name: "<p>workfkyt</p>",
//   school: {
//     name: "<b>St. Petterson Louis III</b>",
//     bingo: [ "bingo", "nothing", "<i>okay</i>", { name: "<br>aja</br>" } ]
//   }
// };

// FIXTURE array:
// let array = [
//   "asereje",
//   "deja",
//   "deje",
//   "<script>okay</script>",
//   {
//     element1: "alc",
//     element2: "<script>olive</script>",
//     element3: "<i>nope</i>",
//     element4: [
//       "canls", "<iframe>listo</iframe>"
//     ]
//   },
//   34,
//   true
// ];

// FIXTURE string:
// let string = "<p>workfkyt</p>";

// let options = { stripIgnoreTag: true, deep: true };

// let result1 = schema1.xss(options).validate(object);
// let result2 = schema2.xss(options).validate(array);
// let result3 = schema3.xss(options).validate(string);

// console.log('--------')
// console.log(JSON.stringify(result1.value, null, 2));
// console.log('--------')
// console.log(JSON.stringify(result2.value, null, 2));
// console.log('--------')
// console.log(result3.value);

// let result = base.number().precision(2).validate(203.32323);

// let result = base.date().validate('2018-12-30T23:39:53.277Z');

// let result = base.string().validate(undefined);

// console.log('value:', result.value, '\ntype:', typeof result.value, '\nerror:', !!result.error);

// let offset = base.number().integer().positive().label("offset");
// let limit = base.number().integer().positive().label("limit");
// let result = limit.validate(2000);
// console.log('->', result.error.message);

// if (offset - limit) {
// }

let schema = {};

schema.query = Joi.object()
  .required()
  .unknown(false)
  .options({ stripUnknown: { arrays: true, objects: true } })
  .xss({ stripIgnoreTag: true, deep: true })
  .label("query");

schema.fields = Joi.object()
  .unknown(true)
  .label("fields")
  .example({ code: "CAT0000031", name: "your_fieldname" }).optional()

schema.limit = Joi.number().positive().integer().label("limit").optional();

schema.offset = Joi.number().positive().integer().label("offset").optional();

schema.search = Joi.string().label("search").max(100).optional();

schema.order_by = Joi.string().label("order_by").max(50).optional();

schema.sort = Joi.string().valid("asc", "desc").label("sort").max(4).optional();

schema.include = Joi.array()
  .items(Joi.string().label("include"))
  .single(true)
  .min(0)
  .unique()
  .sparse(false)
  .optional()
  .label("include");

let result = schema.query.keys({
  fields: schema.fields.unknown(false).keys({
    code: Joi.string().empty("").optional().label("code"),
    name: Joi.string().empty("").optional().label("name")
  }),
  limit: schema.limit,
  offset: schema.offset,
  include: schema.include,
  order_by: schema.order_by,
  sort: schema.sort
}).validate({ limit: true });

console.log('------------------------------------------------------------');
console.log('Result:', result.error ? result.error.message : result.value);
console.log('------------------------------------------------------------');
