import db from 'src/db/models';
import Datalizer from "@ncardez/datalizer";
import * as shared from './index';

const { Stock } = db.sequelize.models;

const stockAssociations = Object.keys(Stock.associations);
const stockAttributes = Object.keys(Stock.attributes);

const getStocks = new Datalizer({
  query: shared.QUERY({
    id: shared.UUID({ $optional: true, $deny: true }),
    item_id: shared.UUID({ $optional: true }),
    entries: shared.NUMBER_FILTER({
      $optional: true,
      $integer: true,
      $positive: true,
      $zero: true
    }),
    exits: shared.NUMBER_FILTER({
      $optional: true,
      $integer: true,
      $positive: true,
      $zero: true
    }),
    stock: shared.NUMBER_FILTER({
      $optional: true,
      $integer: true,
      $positive: true,
      $zero: true
    }),
    extra: shared.EXTRA({ $optional: true }),
    created_at: shared.DATE_FILTER({ $optional: true }),
    updated_at: shared.DATE_FILTER({ $optional: true }),
    deleted_at: shared.DATE_FILTER({ $optional: true }),
    created_by: shared.UUID({ $optional: true }),
    updated_by: shared.UUID({ $optional: true }),
    deleted_by: shared.UUID({ $optional: true }),
    attributes: shared.ATTRIBUTES(stockAttributes),
    include: shared.INCLUDE(stockAssociations),
    paranoid: shared.BOOLEAN({ $optional: true }),
    limit: shared.LIMIT({ $optional: true }),
    offset: shared.OFFSET({ $optional: true }),
    sort_by: shared.ENUM(stockAttributes),
    order_by: shared.ORDER_BY({ $optional: true })
  }, { $max: 30 })
});

const createStocks = new Datalizer({
  body: shared.BODY({
    id: shared.UUID({ $optional: true, $null: true }),
    item_id: shared.UUID(),
    entries: shared.NUMBER({ $optional: true }),
    exits: shared.NUMBER({ $optional: true }),
    stock: shared.NUMBER({ $optional: true }),
    extra: shared.EXTRA({ $optional: true }),
    created_at: shared.DATE({ $optional: true }),
    updated_at: shared.DATE({ $optional: true }),
    deleted_at: shared.DATE({ $optional: true }),
    created_by: shared.UUID({ $optional: true }),
    updated_by: shared.UUID({ $optional: true }),
    deleted_by: shared.UUID({ $optional: true }),
  }, { $max: 12, $empty: false })
});

const getStock = new Datalizer({
  params: shared.PARAMS(
    { stock: shared.UUID() },
    { $length: 1 }
  ),
  query: shared.QUERY({
    attributes: shared.ATTRIBUTES(stockAttributes),
    include: shared.INCLUDE(stockAssociations),
    paranoid: shared.BOOLEAN({ $optional: true })
  }, { $max: 15 })
});

const updateStock = new Datalizer({
  params: shared.PARAMS(
    { stock: shared.UUID() },
    { $length: 1 }
  ),
  body: shared.BODY({
    id: shared.UUID({ $optional: true, $deny: true }),
    item_id: shared.UUID({ $optional: true, $deny: true }),
    entries: shared.NUMBER({ $optional: true }),
    exits: shared.NUMBER({ $optional: true }),
    stock: shared.NUMBER({ $optional: true }),
    extra: shared.EXTRA({ $optional: true }),
    created_at: shared.DATE({ $optional: true }),
    updated_at: shared.DATE({ $optional: true }),
    deleted_at: shared.DATE({ $optional: true }),
    created_by: shared.UUID({ $optional: true }),
    updated_by: shared.UUID({ $optional: true }),
    deleted_by: shared.UUID({ $optional: true }),
  })
});

const deleteStock = new Datalizer({
  params: shared.PARAMS(
    { stock: shared.UUID() },
    { $length: 1 }
  ),
  query: shared.QUERY({
    force: shared.BOOLEAN({ $optional: true }),
    paranoid: shared.BOOLEAN({ $optional: true })
  }, { $max: 2 })
});

export default {
  getStocks: shared.validate(getStocks),
  createStocks: shared.validate(createStocks),
  getStock: shared.validate(getStock),
  updateStock: shared.validate(updateStock),
  deleteStock: shared.validate(deleteStock)
};
