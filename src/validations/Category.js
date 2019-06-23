import db from 'src/db/models';
import Datalizer from "@ncardez/datalizer";
import * as shared from './index';

const { Category, Item } = db.sequelize.models;

const categoryAttributes = Object.keys(Category.attributes);
const categoryAssociations = Object.keys(Category.associations);
const itemAttributes = Object.keys(Item.attributes);
const itemAssociations = Object.keys(Item.associations);

const getCategories = new Datalizer({
  query: shared.QUERY({
    id: shared.UUID({ $optional: true, $forbidden: true }),
    parent_id: shared.UUID({ $optional: true }),
    code: shared.CODE({ $optional: true }),
    name: shared.TEXT_FILTER({ $optional: true }),
    extra: shared.EXTRA({ $optional: true }),
    created_at: shared.DATE_FILTER({ $optional: true }),
    updated_at: shared.DATE_FILTER({ $optional: true }),
    deleted_at: shared.DATE_FILTER({ $optional: true }),
    created_by: shared.UUID({ $optional: true }),
    updated_by: shared.UUID({ $optional: true }),
    deleted_by: shared.UUID({ $optional: true }),
    offset: shared.OFFSET({ $optional: true }),
    limit: shared.LIMIT({ $optional: true }),
    attributes: shared.ATTRIBUTES(categoryAttributes),
    include: shared.INCLUDE(categoryAssociations),
    paranoid: shared.BOOLEAN({ $optional: true }),
    sort_by: shared.ENUM(categoryAttributes),
    order_by: shared.ORDER_BY({ $optional: true })
  }, { $max: 30 })
});

const createCategories = new Datalizer({
  body: shared.BODY({
    id: shared.UUID({ $optional: true, $null: true }),
    parent_id: shared.UUID({ $optional: true, $null: true }),
    code: shared.CODE({ $optional: true }),
    name: shared.TEXT({ $empty: false, $min: 2 }),
    extra: shared.EXTRA({ $optional: true }),
    created_at: shared.DATE({ $optional: true }),
    updated_at: shared.DATE({ $optional: true }),
    deleted_at: shared.DATE({ $optional: true }),
    created_by: shared.UUID({ $optional: true }),
    updated_by: shared.UUID({ $optional: true }),
    deleted_by: shared.UUID({ $optional: true })
  }, { $max: 11, $empty: false })
});

const getCategory = new Datalizer({
  params: shared.PARAMS({ category: shared.UUID() }, { $length: 1 }),
  query: shared.QUERY({
    attributes: shared.ATTRIBUTES(categoryAttributes),
    include: shared.INCLUDE(categoryAssociations),
    paranoid: shared.BOOLEAN({ $optional: true })
  }, { $max: 17 })
});

const updateCategory = new Datalizer({
  params: shared.PARAMS({ category: shared.UUID() }, { $length: 1 }),
  body: shared.BODY({
    id: shared.UUID({ $optional: true }),
    parent_id: shared.UUID({ $optional: true, $null: true }),
    code: shared.CODE({ $optional: true }),
    name: shared.TEXT({ $optional: true, $empty: false, $min: 2 }),
    extra: shared.EXTRA({ $optional: true }),
    created_at: shared.DATE({ $optional: true }),
    updated_at: shared.DATE({ $optional: true }),
    deleted_at: shared.DATE({ $optional: true }),
    created_by: shared.UUID({ $optional: true }),
    updated_by: shared.UUID({ $optional: true }),
    deleted_by: shared.UUID({ $optional: true })
  }, { $max: 11, $empty: false })
});

const deleteCategory = new Datalizer({
  params: shared.PARAMS({ category: shared.UUID() }, { $length: 1 }),
  query: shared.QUERY({
    force: shared.BOOLEAN({ $optional: true }),
    paranoid: shared.BOOLEAN({ $optional: true }),
  }, { $max: 2 })
});

const getItems = new Datalizer({
  params: shared.PARAMS({ category: shared.UUID() }, { $length: 1 }),
  query: shared.QUERY({
    id: shared.UUID({ $optional: true, $forbidden: true }),
    parent_id: shared.UUID({ $optional: true }),
    code: shared.CODE({ $optional: true }),
    name: shared.TEXT_FILTER({ $optional: true }),
    type: shared.ENUM([ 'service', 'product', 'material' ]),
    stock: shared.NUMBER_FILTER({
      $optional: true,
      $integer: true,
      $positive: true
    }),
    price: shared.PRICE_FILTER({ $optional: true }),
    extra: shared.EXTRA({ $optional: true }),
    created_at: shared.DATE_FILTER({ $optional: true }),
    updated_at: shared.DATE_FILTER({ $optional: true }),
    deleted_at: shared.DATE_FILTER({ $optional: true }),
    created_by: shared.UUID({ $optional: true }),
    updated_by: shared.UUID({ $optional: true }),
    deleted_by: shared.UUID({ $optional: true }),
    offset: shared.OFFSET({ $optional: true }),
    limit: shared.LIMIT({ $optional: true }),
    attributes: shared.ATTRIBUTES(itemAttributes),
    include: shared.INCLUDE(itemAssociations),
    paranoid: shared.BOOLEAN({ $optional: true }),
    sort_by: shared.ENUM(categoryAttributes),
    order_by: shared.ORDER_BY({ $optional: true }),
  }, { $max: 30 })
});

const setItems = new Datalizer({
  params: shared.PARAMS({ category: shared.UUID() }, { $length: 1 }),
  body: shared.BODY({ items: shared.UUID_ARRAY() }, { $length: 1 })
});

const getItem = new Datalizer({
  params: shared.PARAMS({
    category: shared.UUID(),
    item: shared.UUID()
  }, { $length: 2 }),
  query: shared.QUERY({
    attributes: shared.ATTRIBUTES(itemAttributes),
    include: shared.INCLUDE(itemAssociations),
    paranoid: shared.BOOLEAN({ $optional: true })
  }, { $max: 24 })
});

const removeItem = new Datalizer({
  params: shared.PARAMS({
    category: shared.UUID(),
    item: shared.UUID()
  }, { $length: 2 })
});

export default {
  getCategories: shared.validate(getCategories),
  createCategories: shared.validate(createCategories),
  getCategory: shared.validate(getCategory),
  updateCategory: shared.validate(updateCategory),
  deleteCategory: shared.validate(deleteCategory),
  getItems: shared.validate(getItems),
  setItems: shared.validate(setItems),
  getItem: shared.validate(getItem),
  removeItem: shared.validate(removeItem)
};
