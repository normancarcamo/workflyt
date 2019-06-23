import db from "src/db/models";
import { ValidationError } from "@playscode/fns/lib/errors";

const { Op } = db.Sequelize;

const transformFilter = operator => {
  return (schema, values, value, context) => {
    let key = schema.$state.$path.slice(-2)[0];
    values.query[key][db.Sequelize.Op[operator]] = value;
    delete values.query[key][operator];
  }
}

const transformQuery = (schema, values, value, context) => {
  let result = { where: {} };
  let options = [
    'attributes', 'include', 'force',
    'limit', 'offset', 'order_by',
    'sort', 'paranoid', 'prematch','sort_by'
  ];

  for (let key in values.query) {
    if (options.indexOf(key) < 0) {
      result.where[key] = values.query[key];
    } else {
      result[key] = values.query[key];
    }
  }

  if (result.sort_by) {
    let order = [ result.sort_by, result.order_by || 'asc' ];
    result.sort_by = undefined;
    result.order_by = undefined;
    result.order = [ order ];
  }

  values.query = result;
};

export function UUID(opts) {
  return {
    $type: 'string',
    $uuid: 'v4',
    ...opts
  };
}

export function UUID_ARRAY(opts) {
  return {
    $type: 'array',
    $empty: false,
    $max: 100,
    $items: { ...UUID(opts) }
  };
}

export function ENUM(elements, opts) {
  return {
    $type: 'string',
    $optional: true,
    $enum: elements,
    ...opts
  }
}

export function CODE(opts) {
  return {
    $type: 'string',
    $min: 5,
    $max: 20,
    $trim: 'all',
    $empty: false,
    $null: true,
    $default: 'unset',
    $match: /^[A-Z][A-Z][A-Z]\/[0-9]+$/,
    ...opts
  };
}

export function TEXT(opts) {
  return {
    $type: 'string',
    $max: 30,
    ...opts
  };
}

export function TEXT_FILTER(opts) {
  const schema = TEXT(opts);

  schema.$alternative = {
    $type: 'object',
    $unknown: false,
    $optional: true,
    $empty: false,
    $keys: {
      like: {
        ...TEXT(opts),
        $transform: transformFilter('like')
      },
      notLike: {
        ...TEXT(opts),
        $transform: transformFilter('notLike')
      },
      iLike: {
        ...TEXT(opts),
        $transform: transformFilter('iLike')
      },
      notILike: {
        ...TEXT(opts),
        $transform: transformFilter('notILike')
      },
      startsWith: {
        ...TEXT(opts),
        $transform: transformFilter('startsWith')
      },
      endsWith: {
        ...TEXT(opts),
        $transform: transformFilter('endsWith')
      },
      substring: {
        ...TEXT(opts),
        $transform: transformFilter('substring')
      },
      regexp: {
        ...TEXT(opts),
        $transform: transformFilter('regexp')
      },
      notRegexp: {
        ...TEXT(opts),
        $transform: transformFilter('notRegexp')
      },
      iRegexp: {
        ...TEXT(opts),
        $transform: transformFilter('iRegexp')
      },
      notIRegexp: {
        ...TEXT(opts),
        $transform: transformFilter('notIRegexp')
      },
    }
  };

  return schema;
}

export function DATE(opts) {
  return {
    $type: 'string',
    $date: true,
    $iso: true,
    $min: new Date('1970-01-01').toISOString(),
    ...opts
  };
}

export function DATE_FILTER(opts) {
  const schema = DATE(opts);

  schema.$alternative = {
    $type: 'object',
    $unknow: false,
    $max: 5,
    $optional: true,
    $keys: {
      gt: {
        ...DATE(opts),
        $transform: transformFilter('gt')
      },
      gte: {
        ...DATE(opts),
        $transform: transformFilter('gte')
      },
      lt: {
        ...DATE(opts),
        $transform: transformFilter('lt')
      },
      lte: {
        ...DATE(opts),
        $transform: transformFilter('lte')
      },
      between: {
        $type: 'array',
        $empty: false,
        $length: 2,
        $optional: true,
        $items: { ...DATE(opts) },
        $transform: transformFilter('between')
      }
    }
  };

  return schema;
}

export function NUMBER(opts) {
  return {
    $type: 'number',
    $finite: true,
    $parse: true,
    ...opts
  };
}

export function NUMBER_FILTER(opts) {
  const schema = NUMBER(opts);

  schema.$alternative = {
    $type: 'object',
    $unknow: false,
    $max: 5,
    $optional: true,
    $keys: {
      gt: {
        ...NUMBER(opts),
        $transform: transformFilter('gt')
      },
      gte: {
        ...NUMBER(opts),
        $transform: transformFilter('gte')
      },
      lt: {
        ...NUMBER(opts),
        $transform: transformFilter('lt')
      },
      lte: {
        ...NUMBER(opts),
        $transform: transformFilter('lte')
      },
      between: {
        $type: 'array',
        $empty: false,
        $length: 2,
        $optional: true,
        $items: { ...NUMBER(opts) },
        $transform: transformFilter('between')
      }
    }
  };

  return schema;
}

export function PASS(opts) {
  return {
    $type: 'string',
    $trim: 'all',
    $min: 5,
    $empty: false,
    ...opts
  };
}

export function EXTRA(opts) {
  return {
    $type: 'object',
    $null: true,
    ...opts
  };
}

export function ATTRIBUTES(elements) {
  return {
    $type: 'string',
    $optional: true,
    $trim: 'all',
    $empty: false,
    $split: { $value: ',', $transform: true },
    $in: elements,
    $max: 60,
    $or: {
      $type: 'array',
      $max: 11,
      $items: {
        $type: 'string',
        $empty: false,
        $trim: 'all',
        $max: 20
      }
    }
  };
}

export function INCLUDE(associations) {
  return {
    $type: 'string',
    $optional: true,
    $trim: 'all',
    $empty: false,
    $in: associations,
    $max: 30,
    $or: {
      $type: 'array',
      $max: 20,
      $items: {
        $type: 'string',
        $empty: false,
        $trim: 'all',
        $max: 20
      }
    }
  };
}

export function BOOLEAN(opts) {
  return {
    $type: 'boolean',
    $parse: true,
    ...opts
  }
}

export function OFFSET(opts) {
  return NUMBER({
    $integer: true,
    $negative: false,
    $default: 0,
    $finite: true,
    $zero: true,
    ...opts
  });
}

export function LIMIT(opts) {
  return NUMBER({
    $integer: true,
    $negative: false,
    $default: 10,
    $max: 100,
    $finite: true,
    $zero: false,
    ...opts
  });
}

export function PRICE(opts) {
  return NUMBER({
    $zero: true,
    $positive: true,
    $float: true,
    $default: 0.0,
    $decimals: 2,
    ...opts
  });
}

export function PRICE_FILTER(opts) {
  return NUMBER_FILTER(PRICE(opts))
}

export function ORDER_BY(opts) {
  return {
    $type: 'string',
    $enum: [ 'asc', 'desc' ],
    $default: 'asc',
    $empty: false,
    ...opts
  };
}

export function QUERY(keys, opts) {
  return {
    $type: 'object',
    $unknown: false,
    $keys: keys,
    $transform: transformQuery,
    ...opts
  };
}

export function BODY(keys, opts) {
  return {
    $type: 'object',
    $unknown: false,
    $keys: keys,
    ...opts
  };
}

export function PARAMS(keys, opts) {
  return {
    $type: 'object',
    $unknown: false,
    $empty: false,
    $keys: keys,
    ...opts
  }
}

export function validate(schema) {
  return function(req, res, next) {
    schema.validate({
      params: req.params,
      query: req.query,
      body: req.body,
    }).then(({ errors, values }) => {
      if (errors.length) {
        throw new ValidationError("Invalid Input.", { details: errors });
      } else {
        req.values = values;
        next();
      }
    }).catch(next);
  }
}
