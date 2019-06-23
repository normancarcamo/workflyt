import db from 'src/db/models';
import Datalizer from "@ncardez/datalizer";
import * as shared from './index';

const { Warehouse, Item } = db.sequelize.models;

const warehouseAssociations = Object.keys(Warehouse.associations);
const warehouseAttributes = Object.keys(Warehouse.attributes);

const itemAssociations = Object.keys(Item.associations);
const itemAttributes = Object.keys(Item.attributes);

const getWarehouses = new Datalizer({
  query: shared.QUERY({
    id: shared.UUID({ $optional: true, $deny: true }),
    code: shared.CODE({ $optional: true }),
    name: shared.TEXT_FILTER({ $optional: true }),
    extra: shared.EXTRA({ $optional: true }),
    created_at: shared.DATE_FILTER({ $optional: true }),
    updated_at: shared.DATE_FILTER({ $optional: true }),
    deleted_at: shared.DATE_FILTER({ $optional: true }),
    created_by: shared.UUID({ $optional: true }),
    updated_by: shared.UUID({ $optional: true }),
    deleted_by: shared.UUID({ $optional: true }),
    attributes: shared.ATTRIBUTES(warehouseAttributes),
    include: shared.INCLUDE(warehouseAssociations),
    paranoid: shared.BOOLEAN({ $optional: true }),
    limit: shared.LIMIT({ $optional: true }),
    offset: shared.OFFSET({ $optional: true }),
    sort_by: shared.ENUM(warehouseAttributes),
    order_by: shared.ORDER_BY({ $optional: true })
  }, { $max: 20 })
});

const createWarehouses = new Datalizer({
  body: shared.BODY({
    id: shared.UUID({ $optional: true, $null: true }),
    code: shared.CODE({ $optional: true }),
    name: shared.TEXT({ $empty: false, $min: 2 }),
    extra: shared.EXTRA({ $optional: true }),
    created_at: shared.DATE({ $optional: true }),
    updated_at: shared.DATE({ $optional: true }),
    deleted_at: shared.DATE({ $optional: true }),
    created_by: shared.UUID({ $optional: true }),
    updated_by: shared.UUID({ $optional: true }),
    deleted_by: shared.UUID({ $optional: true }),
  }, { $max: 10, $empty: false })
});

const getWarehouse = new Datalizer({
  params: shared.PARAMS(
    { warehouse: shared.UUID() },
    { $length: 1 }
  ),
  query: shared.QUERY({
    attributes: shared.ATTRIBUTES(warehouseAttributes),
    include: shared.INCLUDE(warehouseAssociations),
    paranoid: shared.BOOLEAN({ $optional: true })
  }, { $max: 10 })
});

const updateWarehouse = new Datalizer({
  params: shared.PARAMS(
    { warehouse: shared.UUID() },
    { $length: 1 }
  ),
  body: shared.BODY({
    id: shared.UUID({ $optional: true, $deny: true }),
    code: shared.CODE({ $optional: true }),
    name: shared.TEXT({ $optional: true }),
    extra: shared.EXTRA({ $optional: true }),
    created_at: shared.DATE({ $optional: true }),
    updated_at: shared.DATE({ $optional: true }),
    deleted_at: shared.DATE({ $optional: true }),
    created_by: shared.UUID({ $optional: true }),
    updated_by: shared.UUID({ $optional: true }),
    deleted_by: shared.UUID({ $optional: true }),
  }, { $max: 10, $empty: false })
});

const deleteWarehouse = new Datalizer({
  params: shared.PARAMS(
    { warehouse: shared.UUID() },
    { $length: 1 }
  ),
  query: shared.QUERY({
    force: shared.BOOLEAN({ $optional: true }),
    paranoid: shared.BOOLEAN({ $optional: true })
  }, { $max: 2 })
});

const getItems = new Datalizer({
  params: shared.PARAMS(
    { warehouse: shared.UUID() },
    { $length: 1 }
  ),
  query: shared.QUERY({
    id: shared.UUID({ $optional: true, $deny: true }),
    category_id: shared.UUID({ $optional: true }),
    code: shared.CODE({ $optional: true }),
    name: shared.TEXT_FILTER({ $optional: true }),
    type: shared.ENUM(['service', 'product', 'material']),
    stock: shared.NUMBER_FILTER({ $optional: true }),
    price: shared.PRICE_FILTER({ $optional: true }),
    extra: shared.EXTRA({ $optional: true }),
    created_at: shared.DATE_FILTER({ $optional: true }),
    updated_at: shared.DATE_FILTER({ $optional: true }),
    deleted_at: shared.DATE_FILTER({ $optional: true }),
    created_by: shared.UUID({ $optional: true }),
    updated_by: shared.UUID({ $optional: true }),
    deleted_by: shared.UUID({ $optional: true }),
    attributes: shared.ATTRIBUTES(itemAttributes),
    include: shared.INCLUDE(itemAssociations),
    paranoid: shared.BOOLEAN({ $optional: true }),
    limit: shared.LIMIT({ $optional: true }),
    offset: shared.OFFSET({ $optional: true }),
    sort_by: shared.ENUM(itemAttributes),
    order_by: shared.ORDER_BY({ $optional: true })
  }, { $max: 30 })
});

const setItems = new Datalizer({
  params: shared.PARAMS(
    { warehouse: shared.UUID() },
    { $length: 1 }
  ),
  body: shared.BODY(
    { items: shared.UUID_ARRAY() },
    { $length: 1 }
  )
});

const getItem = new Datalizer({
  params: shared.PARAMS(
    { warehouse: shared.UUID(), item: shared.UUID() },
    { $length: 2 }
  ),
  query: shared.QUERY({
    attributes: shared.ATTRIBUTES(itemAttributes),
    include: shared.INCLUDE(itemAssociations),
    paranoid: shared.BOOLEAN({ $optional: true })
  }, { $max: 20 })
});

const updateItem = new Datalizer({
  params: shared.PARAMS(
    { warehouse: shared.UUID(), item: shared.UUID() },
    { $length: 2 }
  ),
  body: shared.BODY({
    quote_id: shared.UUID({ $optional: true, $deny: true }),
    item_id: shared.UUID({ $optional: true, $deny: true }),
    extra: shared.EXTRA({ $optional: true }),
    created_at: shared.DATE({ $optional: true }),
    updated_at: shared.DATE({ $optional: true }),
    deleted_at: shared.DATE({ $optional: true }),
    created_by: shared.UUID({ $optional: true }),
    updated_by: shared.UUID({ $optional: true }),
    deleted_by: shared.UUID({ $optional: true })
  }, { $max: 9, $empty: false })
});

const removeItem = new Datalizer({
  params: shared.PARAMS(
    { warehouse: shared.UUID(), item: shared.UUID() },
    { $length: 2 }
  ),
  query: shared.QUERY({
    force: shared.BOOLEAN({ $optional: true }),
    paranoid: shared.BOOLEAN({ $optional: true })
  }, { $max: 2 })
});

export default {
  getWarehouses: shared.validate(getWarehouses),
  createWarehouses: shared.validate(createWarehouses),
  getWarehouse: shared.validate(getWarehouse),
  updateWarehouse: shared.validate(updateWarehouse),
  deleteWarehouse: shared.validate(deleteWarehouse),
  getItems: shared.validate(getItems),
  setItems: shared.validate(setItems),
  getItem: shared.validate(getItem),
  updateItem: shared.validate(updateItem),
  removeItem: shared.validate(removeItem)
};
