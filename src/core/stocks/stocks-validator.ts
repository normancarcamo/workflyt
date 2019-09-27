import * as schema from 'src/utils/schemas';
import { TSchema } from 'src/utils/types';
import Datalizer from '@ncardez/datalizer';

export const numberType = {
  $optional: true,
  $positive: true,
  $integer: true,
  $zero: true,
  $default: 0
};

export const stock:TSchema = {
  attributes: [
    'id',
    'material_id',
    'entries',
    'exits',
    'stocks',
    'extra',
    'created_at',
    'updated_at',
    'deleted_at',
    'created_by',
    'updated_by',
    'deleted_by'
  ]
};

export const getStocks = new Datalizer({
  query: schema.QUERY({
    id: schema.UUID({ $optional: true, $deny: true }),
    material_id: schema.UUID({ $optional: true }),
    entries: schema.NUMBER_FILTER({
      $optional: true,
      $integer: true,
      $positive: true,
      $zero: true
    }),
    exits: schema.NUMBER_FILTER({
      $optional: true,
      $integer: true,
      $positive: true,
      $zero: true
    }),
    stocks: schema.NUMBER_FILTER({
      $optional: true,
      $integer: true,
      $positive: true,
      $zero: true
    }),
    extra: schema.EXTRA({ $optional: true }),
    created_at: schema.DATE_FILTER({ $optional: true }),
    updated_at: schema.DATE_FILTER({ $optional: true }),
    deleted_at: schema.DATE_FILTER({ $optional: true }),
    created_by: schema.UUID({ $optional: true }),
    updated_by: schema.UUID({ $optional: true }),
    deleted_by: schema.UUID({ $optional: true }),
    attributes: schema.ATTRIBUTES(stock.attributes),
    paranoid: schema.BOOLEAN({ $optional: true }),
    limit: schema.LIMIT({ $optional: true }),
    offset: schema.OFFSET({ $optional: true }),
    sort_by: schema.ENUM(stock.attributes),
    order_by: schema.ORDER_BY({ $optional: true })
  }, { $max: 30 })
});

export const createStock = new Datalizer({
  body: schema.BODY({
    id: schema.UUID({ $optional: true, $null: true }),
    material_id: schema.UUID(),
    entries: schema.NUMBER(numberType),
    exits: schema.NUMBER(numberType),
    stocks: schema.NUMBER(numberType),
    extra: schema.EXTRA({ $optional: true }),
    created_at: schema.DATE({ $optional: true }),
    updated_at: schema.DATE({ $optional: true }),
    deleted_at: schema.DATE({ $optional: true }),
    created_by: schema.UUID({ $optional: true }),
    updated_by: schema.UUID({ $optional: true }),
    deleted_by: schema.UUID({ $optional: true }),
  }, { $max: 12, $empty: false })
}, { addKey: false });

export const getStock = new Datalizer({
  params: schema.PARAMS(
    { stock: schema.UUID() },
    { $length: 1 }
  ),
  query: schema.QUERY({
    attributes: schema.ATTRIBUTES(stock.attributes),
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 15 })
});

export const updateStock = new Datalizer({
  params: schema.PARAMS(
    { stock: schema.UUID() },
    { $length: 1 }
  ),
  query: schema.QUERY({
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 1, $optional: true }),
  body: schema.BODY({
    id: schema.UUID({ $optional: true, $deny: true }),
    material_id: schema.UUID({ $optional: true, $deny: true }),
    entries: schema.NUMBER(numberType),
    exits: schema.NUMBER(numberType),
    stocks: schema.NUMBER({ ...numberType, $deny: true }),
    extra: schema.EXTRA({ $optional: true }),
    created_at: schema.DATE({ $optional: true }),
    updated_at: schema.DATE({ $optional: true }),
    deleted_at: schema.DATE({ $optional: true }),
    created_by: schema.UUID({ $optional: true }),
    updated_by: schema.UUID({ $optional: true }),
    deleted_by: schema.UUID({ $optional: true }),
  })
}, { addKey: false });

export const deleteStock = new Datalizer({
  params: schema.PARAMS(
    { stock: schema.UUID() },
    { $length: 1 }
  ),
  query: schema.QUERY({
    force: schema.BOOLEAN({ $optional: true }),
    paranoid: schema.BOOLEAN({ $optional: true })
  }, { $max: 2 })
});
