export function UUID(extra?:object):object {
  return {
    $type: "string",
    $uuid: "v4",
    ...extra
  };
}

export function UUID_ARRAY(extra?:object):object {
  return {
    $type: "array",
    $empty: false,
    $max: 100,
    $items: { ...UUID(extra) }
  };
}

export function ENUM(elements:string[], extra?:object):object {
  return {
    $type: "string",
    $optional: true,
    $enum: elements,
    ...extra
  };
}

export function CODE(extra?:object):object {
  return {
    $type: "string",
    $min: 5,
    $max: 20,
    $trim: "all",
    $empty: false,
    $null: true,
    $match: /^[A-Z][A-Z][A-Z](\-[0-9][0-9])?\/[0-9]+$/,
    ...extra
  };
}

export function TEXT(extra?:object):object {
  return {
    $type: "string",
    $max: 60,
    $match: /^(\%|[a-zA-Z0-9]|\ñ|\Ñ|\Á|\É|\Í|\Ó|\Ú|\á|\é|\í|\ó|\ú|\,|\'|\"|\(|\)|\.)+[a-zA-Z0-9\ñ\Ñ|\Á|\É|\Í|\Ó|\Ú|\á|\é|\í|\ó|\ú|\'|\"|\(|\)|\,\_\-\s\%\.]*$/,
    ...extra
  };
}

export function TEXT_FILTER(extra?:object):object {
  let schema = <any>TEXT(extra);

  schema.$alternative = {
    $type: "object",
    $unknown: false,
    $optional: true,
    $empty: false,
    $keys: {
      like:       { ...TEXT(extra) },
      notLike:    { ...TEXT(extra) },
      iLike:      { ...TEXT(extra) },
      notILike:   { ...TEXT(extra) },
      startsWith: { ...TEXT(extra) },
      endsWith:   { ...TEXT(extra) },
      substring:  { ...TEXT(extra) },
      regexp:     { ...TEXT(extra) },
      notRegexp:  { ...TEXT(extra) },
      iRegexp:    { ...TEXT(extra) },
      notIRegexp: { ...TEXT(extra) }
    }
  };

  return schema;
}

export function DATE(extra?:object):object {
  return {
    $type: "string",
    $date: true,
    $iso: true,
    $min: new Date("1970-01-01").toISOString(),
    ...extra
  };
}

export function DATE_FILTER(extra?:object):object {
  let schema = <any>DATE(extra);

  schema.$alternative = {
    $type: "object",
    $unknow: false,
    $max: 5,
    $optional: true,
    $keys: {
      gt:  { ...DATE(extra) },
      gte: { ...DATE(extra) },
      lt:  { ...DATE(extra) },
      lte: { ...DATE(extra) },
      between: {
        $type: "array",
        $empty: false,
        $length: 2,
        $optional: true,
        $items: { ...DATE(extra) }
      }
    }
  };

  return schema;
}

export function NUMBER(extra?:object):object {
  return {
    $type: "number",
    $finite: true,
    $parse: true,
    ...extra
  };
}

export function NUMBER_FILTER(extra?:object):object {
  let schema = <any>NUMBER(extra);

  schema.$alternative = {
    $type: "object",
    $unknow: false,
    $max: 5,
    $optional: true,
    $keys: {
      gt:  { ...NUMBER(extra) },
      gte: { ...NUMBER(extra) },
      lt:  { ...NUMBER(extra) },
      lte: { ...NUMBER(extra) },
      between: {
        $type: "array",
        $empty: false,
        $length: 2,
        $optional: true,
        $items: { ...NUMBER(extra) }
      }
    }
  };

  return schema;
}

export function PASS(extra?:object):object {
  return {
    $type: "string",
    $trim: "all",
    $min: 5,
    $empty: false,
    ...extra
  };
}

export function EXTRA(extra?:object):object {
  return {
    $type: "object",
    $null: true,
    ...extra
  };
}

export function ATTRIBUTES(elements:string[] = []):object {
  return {
    $type: "string",
    $optional: true,
    $trim: "all",
    $empty: false,
    $split: { $value: ",", $transform: true },
    $in: elements,
    $max: 60,
    $or: {
      $type: "array",
      $max: 11,
      $items: {
        $type: "string",
        $empty: false,
        $trim: "all",
        $max: 20
      }
    }
  };
}

export function INCLUDE(associations:string[] = []):object {
  return {
    $type: "string",
    $optional: true,
    $trim: "all",
    $empty: false,
    $split: { $value: ",", $transform: true },
    $in: associations,
    $max: 30,
    $or: {
      $type: "array",
      $max: 20,
      $items: {
        $type: "string",
        $empty: false,
        $trim: "all",
        $max: 20
      }
    }
  };
}

export function BOOLEAN(extra?:object):object {
  return {
    $type: "boolean",
    $parse: true,
    ...extra
  };
}

export function OFFSET(extra?:object):object {
  return NUMBER({
    $integer: true,
    $negative: false,
    $default: 0,
    $finite: true,
    $zero: true,
    ...extra
  });
}

export function LIMIT(extra?:object):object {
  return NUMBER({
    $integer: true,
    $negative: false,
    $default: 10,
    $max: 100,
    $finite: true,
    $zero: false,
    ...extra
  });
}

export function ORDER_BY(extra?:object):object {
  return {
    $type: "string",
    $enum: [ "asc", "desc" ],
    $default: "asc",
    $empty: false,
    ...extra
  };
}

export function QUERY(keys:object, extra?:object):object {
  return {
    $type: "object",
    $unknown: false,
    $keys: keys,
    ...extra
  };
}

export function BODY(keys:object, extra?:object):object {
  return {
    $type: "object",
    $unknown: false,
    $keys: keys,
    ...extra
  };
}

export function PARAMS(keys:object, extra?:object):object {
  return {
    $type: "object",
    $unknown: false,
    $empty: false,
    $keys: keys,
    ...extra
  };
}
