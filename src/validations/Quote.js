import db from 'src/db/models';
import Datalizer from "@ncardez/datalizer";
import * as shared from './index';

const { Quote, Item, Order } = db.sequelize.models;

const quoteAssociations = Object.keys(Quote.associations);
const quoteAttributes = Object.keys(Quote.attributes);

const itemAssociations = Object.keys(Item.associations);
const itemAttributes = Object.keys(Item.attributes);

const orderAssociations = Object.keys(Order.associations);
const orderAttributes = Object.keys(Order.attributes);

const getQuotes = new Datalizer({
  query: shared.QUERY({
    id: shared.UUID({ $optional: true, $deny: true }),
    customer_id: shared.UUID({ $optional: true }),
    salesman_id: shared.UUID({ $optional: true }),
    code: shared.CODE({ $optional: true }),
    subject: shared.TEXT_FILTER({ $optional: true, $max: 100 }),
    status: shared.ENUM([
      'open', 'confirmed', 'other', 'approved',
      'pending', 'awaiting', 'authorized',
      'cancelled', 'done'
    ]),
    extra: shared.EXTRA({ $optional: true }),
    created_at: shared.DATE_FILTER({ $optional: true }),
    updated_at: shared.DATE_FILTER({ $optional: true }),
    deleted_at: shared.DATE_FILTER({ $optional: true }),
    created_by: shared.UUID({ $optional: true }),
    updated_by: shared.UUID({ $optional: true }),
    deleted_by: shared.UUID({ $optional: true }),
    attributes: shared.ATTRIBUTES(quoteAttributes),
    include: shared.INCLUDE(quoteAssociations),
    paranoid: shared.BOOLEAN({ $optional: true }),
    limit: shared.LIMIT({ $optional: true }),
    offset: shared.OFFSET({ $optional: true }),
    sort_by: shared.ENUM(quoteAttributes),
    order_by: shared.ORDER_BY({ $optional: true })
  }, { $max: 30 })
});

const createQuotes = new Datalizer({
  body: shared.BODY({
    id: shared.UUID({ $optional: true, $null: true }),
    customer_id: shared.UUID(),
    salesman_id: shared.UUID(),
    subject: shared.TEXT({
      $optional: true,
      $max: 100,
      $empty: false,
      $min: 2,
      $default: 'No subject description'
    }),
    code: shared.CODE({ $optional: true }),
    status: shared.ENUM([
      'open', 'confirmed', 'other', 'approved',
      'pending', 'awaiting', 'authorized',
      'cancelled', 'done'
    ], { $default: 'awaiting' }),
    extra: shared.EXTRA({ $optional: true }),
    created_at: shared.DATE({ $optional: true }),
    updated_at: shared.DATE({ $optional: true }),
    deleted_at: shared.DATE({ $optional: true }),
    created_by: shared.UUID({ $optional: true }),
    updated_by: shared.UUID({ $optional: true }),
    deleted_by: shared.UUID({ $optional: true }),
  }, { $max: 13, $empty: false })
});

const getQuote = new Datalizer({
  params: shared.PARAMS(
    { quote: shared.UUID() },
    { $length: 1 }
  ),
  query: shared.QUERY({
    attributes: shared.ATTRIBUTES(quoteAttributes),
    include: shared.INCLUDE(quoteAssociations),
    paranoid: shared.BOOLEAN({ $optional: true })
  }, { $max: 15 })
});

const updateQuote = new Datalizer({
  params: shared.PARAMS(
    { quote: shared.UUID() },
    { $length: 1 }
  ),
  body: shared.BODY({
    id: shared.UUID({ $optional: true, $deny: true }),
    customer_id: shared.UUID({ $optional: true }),
    salesman_id: shared.UUID({ $optional: true }),
    subject: shared.TEXT({
      $optional: true,
      $max: 100,
      $empty: false,
      $min: 2,
      $default: 'No subject description'
    }),
    code: shared.CODE({ $optional: true }),
    status: shared.ENUM([
      'open', 'confirmed', 'other', 'approved',
      'pending', 'awaiting', 'authorized',
      'cancelled', 'done'
    ], { $default: 'awaiting' }),
    extra: shared.EXTRA({ $optional: true }),
    created_at: shared.DATE({ $optional: true }),
    updated_at: shared.DATE({ $optional: true }),
    deleted_at: shared.DATE({ $optional: true }),
    created_by: shared.UUID({ $optional: true }),
    updated_by: shared.UUID({ $optional: true }),
    deleted_by: shared.UUID({ $optional: true }),
  }, { $max: 13, $empty: false })
});

const deleteQuote = new Datalizer({
  params: shared.PARAMS(
    { quote: shared.UUID() },
    { $length: 1 }
  ),
  query: shared.QUERY({
    force: shared.BOOLEAN({ $optional: true }),
    paranoid: shared.BOOLEAN({ $optional: true })
  }, { $max: 2 })
});

const getItems = new Datalizer({
  params: shared.PARAMS(
    { quote: shared.UUID() },
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
    { quote: shared.UUID() },
    { $length: 1 }
  ),
  body: shared.BODY(
    { items: shared.UUID_ARRAY() },
    { $length: 1 }
  )
});

const getItem = new Datalizer({
  params: shared.PARAMS(
    { quote: shared.UUID(), item: shared.UUID() },
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
    { quote: shared.UUID(), item: shared.UUID() },
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
    { quote: shared.UUID(), item: shared.UUID() },
    { $length: 2 }
  ),
  query: shared.QUERY({
    force: shared.BOOLEAN({ $optional: true }),
    paranoid: shared.BOOLEAN({ $optional: true })
  }, { $max: 2 })
});

const getOrders = new Datalizer({
  params: shared.PARAMS(
    { quote: shared.UUID() },
    { $length: 1 }
  ),
  query: shared.QUERY({
    id: shared.UUID({ $optional: true, $deny: true }),
    quote_id: shared.UUID({ $optional: true }),
    code: shared.CODE({ $optional: true }),
    type: shared.ENUM(['work', 'installation']),
    status: shared.ENUM([ 'awaiting', 'working', 'cancelled', 'done' ]),
    extra: shared.EXTRA({ $optional: true }),
    created_at: shared.DATE_FILTER({ $optional: true }),
    updated_at: shared.DATE_FILTER({ $optional: true }),
    deleted_at: shared.DATE_FILTER({ $optional: true }),
    created_by: shared.UUID({ $optional: true }),
    updated_by: shared.UUID({ $optional: true }),
    deleted_by: shared.UUID({ $optional: true }),
    attributes: shared.ATTRIBUTES(orderAttributes),
    include: shared.INCLUDE(orderAssociations),
    paranoid: shared.BOOLEAN({ $optional: true }),
    limit: shared.LIMIT({ $optional: true }),
    offset: shared.OFFSET({ $optional: true }),
    sort_by: shared.ENUM(orderAttributes),
    order_by: shared.ORDER_BY({ $optional: true })
  }, { $max: 30 })
});

const setOrders = new Datalizer({
  params: shared.PARAMS(
    { quote: shared.UUID() },
    { $length: 1 }
  ),
  body: shared.BODY(
    { orders: shared.UUID_ARRAY() },
    { $length: 1 }
  )
});

const getOrder = new Datalizer({
  params: shared.PARAMS(
    { quote: shared.UUID(), order: shared.UUID() },
    { $length: 2 }
  ),
  query: shared.QUERY({
    attributes: shared.ATTRIBUTES(orderAttributes),
    include: shared.INCLUDE(orderAssociations),
    paranoid: shared.BOOLEAN({ $optional: true })
  }, { $max: 20 })
});

export default {
  getQuotes: shared.validate(getQuotes),
  createQuotes: shared.validate(createQuotes),
  getQuote: shared.validate(getQuote),
  updateQuote: shared.validate(updateQuote),
  deleteQuote: shared.validate(deleteQuote),
  getItems: shared.validate(getItems),
  setItems: shared.validate(setItems),
  getItem: shared.validate(getItem),
  updateItem: shared.validate(updateItem),
  removeItem: shared.validate(removeItem),
  getOrders: shared.validate(getOrders),
  setOrders: shared.validate(setOrders),
  getOrder: shared.validate(getOrder)
};
