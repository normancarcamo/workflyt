export function UUID (opts) {
  return {
    $type: 'string',
    $uuid: 'v4',
    ...opts
  };
}

export function UUID_ARRAY (opts) {
  return {
    $type: 'array',
    $empty: false,
    $max: 100,
    $items: {
      ...UUID(opts)
    }
  };
}

export function ENUM (elements, opts) {
  return {
    $type: 'string',
    $optional: true,
    $enum: elements,
    ...opts
  }
}

export function CODE (opts) {
  return {
    $type: 'string',
    $min: 5,
    $max: 20,
    $trim: 'all',
    $empty: false,
    $null: true,
    $default: 'unset',
    $match: /^[A-Z][A-Z][A-Z](\-[0-9][0-9])?\/[0-9]+$/,
    ...opts
  };
}

export function TEXT (opts) {
  return {
    $type: 'string',
    $max: 30,
    $match: /^(\%|[a-zA-Z0-9])+[a-zA-Z0-9\_\-\s\%\.]*$/,
    ...opts
  };
}

export function TEXT_FILTER (opts) {
  const schema = TEXT(opts);

  schema.$alternative = {
    $type: 'object',
    $unknown: false,
    $optional: true,
    $empty: false,
    $keys: {
      like:       { ...TEXT(opts) },
      notLike:    { ...TEXT(opts) },
      iLike:      { ...TEXT(opts) },
      notILike:   { ...TEXT(opts) },
      startsWith: { ...TEXT(opts) },
      endsWith:   { ...TEXT(opts) },
      substring:  { ...TEXT(opts) },
      regexp:     { ...TEXT(opts) },
      notRegexp:  { ...TEXT(opts) },
      iRegexp:    { ...TEXT(opts) },
      notIRegexp: { ...TEXT(opts) },
    }
  };

  return schema;
}

export function DATE (opts) {
  return {
    $type: 'string',
    $date: true,
    $iso: true,
    $min: new Date('1970-01-01').toISOString(),
    ...opts
  };
}

export function DATE_FILTER (opts) {
  const schema = DATE(opts);

  schema.$alternative = {
    $type: 'object',
    $unknow: false,
    $max: 5,
    $optional: true,
    $keys: {
      gt:  { ...DATE(opts) },
      gte: { ...DATE(opts) },
      lt:  { ...DATE(opts) },
      lte: { ...DATE(opts) },
      between: {
        $type: 'array',
        $empty: false,
        $length: 2,
        $optional: true,
        $items: { ...DATE(opts) }
      }
    }
  };

  return schema;
}

export function NUMBER (opts) {
  return {
    $type: 'number',
    $finite: true,
    $parse: true,
    ...opts
  };
}

export function NUMBER_FILTER (opts) {
  const schema = NUMBER(opts);

  schema.$alternative = {
    $type: 'object',
    $unknow: false,
    $max: 5,
    $optional: true,
    $keys: {
      gt:  { ...NUMBER(opts) },
      gte: { ...NUMBER(opts) },
      lt:  { ...NUMBER(opts) },
      lte: { ...NUMBER(opts) },
      between: {
        $type: 'array',
        $empty: false,
        $length: 2,
        $optional: true,
        $items: { ...NUMBER(opts) }
      }
    }
  };

  return schema;
}

export function PASS (opts) {
  return {
    $type: 'string',
    $trim: 'all',
    $min: 5,
    $empty: false,
    ...opts
  };
}

export function EXTRA (opts) {
  return {
    $type: 'object',
    $null: true,
    ...opts
  };
}

export function ATTRIBUTES (elements) {
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

export function INCLUDE (associations) {
  return {
    $type: 'string',
    $optional: true,
    $trim: 'all',
    $empty: false,
    $split: { $value: ',', $transform: true },
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

export function BOOLEAN (opts) {
  return {
    $type: 'boolean',
    $parse: true,
    ...opts
  }
}

export function OFFSET (opts) {
  return NUMBER({
    $integer: true,
    $negative: false,
    $default: 0,
    $finite: true,
    $zero: true,
    ...opts
  });
}

export function LIMIT (opts) {
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

export function PRICE (opts) {
  return NUMBER({
    $zero: true,
    $positive: true,
    $float: true,
    $default: 0.0,
    $decimals: 2,
    ...opts
  });
}

export function PRICE_FILTER (opts) {
  return NUMBER_FILTER(PRICE(opts))
}

export function ORDER_BY (opts) {
  return {
    $type: 'string',
    $enum: [ 'asc', 'desc' ],
    $default: 'asc',
    $empty: false,
    ...opts
  };
}

export function QUERY (keys, opts) {
  return {
    $type: 'object',
    $unknown: false,
    $keys: keys,
    ...opts
  };
}

export function BODY (keys, opts) {
  return {
    $type: 'object',
    $unknown: false,
    $keys: keys,
    ...opts
  };
}

export function PARAMS (keys, opts) {
  return {
    $type: 'object',
    $unknown: false,
    $empty: false,
    $keys: keys,
    ...opts
  }
}
