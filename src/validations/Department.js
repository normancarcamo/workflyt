import { Joi, schema, validate } from "./index";

module.exports.schema = {};

module.exports.schema.getDepartments = schema.request.keys({
  headers: schema.headers,
  query: schema.query.append({
    fields: Joi.array().items(Joi.string().valid(
      "id", "code", "name", "extra",
      "created_at", "updated_at", "deleted_at",
      "created_by", "updated_by", "deleted_by",
    ), Joi.any().strip()).max(10),
    search: Joi.object({
      id: schema.id.forbidden(),
      code: schema.code,
      name: schema.look_up(Joi.string().max(100)),
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

module.exports.schema.createDepartments = schema.request.keys({
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
        deleted_by: schema.deleted_by,
      }).unknown(false)
    )
  })
});

module.exports.schema.getDepartment = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ department: schema.id.required() }),
});

module.exports.schema.updateDepartment = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ department: schema.id.required() }),
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
      deleted_by: schema.deleted_by,
    }).unknown(false)
  })
});

module.exports.schema.deleteDepartment = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ department: schema.id.required() }),
  query: schema.query.keys({ force: schema.force })
});

module.exports.schema.getEmployees = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({ department: schema.id.required() }),
  query: schema.query.append({
    fields: Joi.array().items(Joi.string().valid(
      "id", "supervisor_id", "department_id", "code",
      "firstname", "lastname", "extra",
      "created_at", "updated_at", "deleted_at",
      "created_by", "updated_by", "deleted_by",
      ), Joi.any().strip()).max(13),
    search: Joi.object({
      id: schema.id.forbidden(),
      supervisor_id: schema.id,
      departement_id: schema.id,
      code: schema.code,
      firstname: schema.look_up(schema.name),
      lastname: schema.look_up(schema.name),
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

module.exports.schema.setEmployees = schema.request.keys({
  headers: schema.headers,
  query: schema.query,
  params: schema.params.keys({ department: schema.id.required() }),
  body: schema.body.keys({ values: schema.bulk.id.required() })
});

module.exports.schema.getEmployee = schema.request.keys({
  headers: schema.headers,
  params: schema.params.keys({
    department: schema.id.required(),
    employee: schema.id.required()
  })
});

module.exports.validate = validate;
