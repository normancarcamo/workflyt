import db from 'src/db/models';
import Datalizer from "@ncardez/datalizer";
import * as shared from './index';

const itemAssociations = Object.keys(db.sequelize.models.Item.associations);
const itemAttributes = Object.keys(db.sequelize.models.Item.attributes);
const stockAssociations = Object.keys(db.sequelize.models.Stock.associations);
const stockAttributes = Object.keys(db.sequelize.models.Stock.attributes);

const getItems = new Datalizer({
  query: shared.QUERY({
    id: shared.UUID({ $optional: true, $forbidden: true }),
    parent_id: shared.UUID({ $optional: true }),
    code: shared.CODE({ $optional: true }),
    name: shared.TEXT_FILTER({ $optional: true }),
    type: shared.ENUM([ 'service', 'product', 'material' ]),
    stock: shared.NUMBER_FILTER({ $optional: true }),
    price: shared.PRICE_FILTER({ $optional: true }),
    extra: shared.EXTRA({ $optional: true }),
    created_at: shared.DATE_FILTER({ $optional: true }),
    updated_at: shared.DATE_FILTER({ $optional: true }),
    deleted_at: shared.DATE_FILTER({ $optional: true }),
    created_by: shared.UUID({ $optional: true }),
    updated_by: shared.UUID({ $optional: true }),
    deleted_by: shared.UUID({ $optional: true }),
    limit: shared.LIMIT({ $optional: true }),
    offset: shared.OFFSET({ $optional: true }),
    attributes: shared.ATTRIBUTES(itemAttributes),
    include: shared.INCLUDE(itemAssociations),
    sort_by: shared.ENUM(itemAttributes),
    order_by: shared.ORDER_BY({ $optional: true })
  }, { $max: 30 })
});

const createItems = new Datalizer({
  body: shared.BODY({
    id: shared.UUID({ $optional: true, $null: true }),
    category_id: shared.UUID({ $optional: true, $null: true }),
    code: shared.CODE({ $optional: true }),
    name: shared.TEXT({ $empty: false, $min: 2 }),
    type: shared.ENUM(
      ['service', 'product', 'material' ],
      { $default: 'service' }
    ),
    stock: shared.NUMBER({
      $integer: true,
      $positive: true,
      $optional: true,
      $default: 0,
      $zero: true
    }),
    price: shared.PRICE({ $optional: true }),
    extra: shared.EXTRA({ $optional: true }),
    created_at: shared.DATE({ $optional: true }),
    updated_at: shared.DATE({ $optional: true }),
    deleted_at: shared.DATE({ $optional: true }),
    created_by: shared.UUID({ $optional: true }),
    updated_by: shared.UUID({ $optional: true }),
    deleted_by: shared.UUID({ $optional: true })
  }, { $empty: false, $max: 14 })
});

const getItem = new Datalizer({
  params: shared.PARAMS({
    item: shared.UUID()
  }, { $length: 1 }),
  query: shared.QUERY({
    attributes: shared.ATTRIBUTES(itemAttributes),
    include: shared.INCLUDE(itemAssociations),
    paranoid: shared.BOOLEAN({ $optional: true })
  }, { $max: 3 })
});

const updateItem = new Datalizer({
  params: shared.PARAMS({
    item: shared.UUID()
  }, { $length: 1 }),
  body: shared.BODY({
    id: shared.UUID({ $optional: true, $deny: true }),
    category_id: shared.UUID({ $optional: true, $null: true }),
    code: shared.CODE({ $optional: true }),
    name: shared.TEXT({ $optional: true, $empty: false, $min: 2 }),
    type: shared.ENUM(
      ['service', 'product', 'material'],
      { $default: 'service' }
    ),
    stock: shared.NUMBER({
      $integer: true,
      $positive: true,
      $optional: true,
      $default: 0,
      $zero: true
    }),
    price: shared.PRICE({ $optional: true }),
    extra: shared.EXTRA({ $optional: true }),
    created_at: shared.DATE({ $optional: true }),
    updated_at: shared.DATE({ $optional: true }),
    deleted_at: shared.DATE({ $optional: true }),
    created_by: shared.UUID({ $optional: true }),
    updated_by: shared.UUID({ $optional: true }),
    deleted_by: shared.UUID({ $optional: true })
  }, { $max: 14, $empty: true })
});

const deleteItem = new Datalizer({
  params: shared.PARAMS({
    item: shared.UUID()
  }, { $length: 1 }),
  query: shared.QUERY({
    force: shared.BOOLEAN({ $optional: true }),
    paranoid: shared.BOOLEAN({ $optional: true }),
  }, { $max: 2 })
});

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
    limit: shared.LIMIT({ $optional: true }),
    offset: shared.OFFSET({ $optional: true }),
    attributes: shared.ATTRIBUTES(stockAttributes),
    include: shared.INCLUDE(stockAssociations),
    sort_by: shared.ENUM(stockAttributes),
    order_by: shared.ORDER_BY({ $optional: true })
  }, { $max: 30 })
});

const setStocks = new Datalizer({
  params: shared.PARAMS(
    { item: shared.UUID() },
    { $length: 1 }
  ),
  body: shared.BODY(
    { stocks: shared.UUID_ARRAY() },
    { $length: 1 }
  )
});

const getStock = new Datalizer({
  params: shared.PARAMS(
    { item: shared.UUID(), stock: shared.UUID() },
    { $length: 2 }
  ),
  query: shared.QUERY({
    attributes: shared.ATTRIBUTES(stockAttributes),
    include: shared.INCLUDE(stockAssociations),
    paranoid: shared.BOOLEAN({ $optional: true })
  }, { $max: 3 })
});

export default {
  getItems: shared.validate(getItems),
  createItems: shared.validate(createItems),
  getItem: shared.validate(getItem),
  updateItem: shared.validate(updateItem),
  deleteItem: shared.validate(deleteItem),
  getStocks: shared.validate(getStocks),
  setStocks: shared.validate(setStocks),
  getStock: shared.validate(getStock)
};
