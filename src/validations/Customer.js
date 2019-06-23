import db from 'src/db/models';
import Datalizer from "@ncardez/datalizer";
import * as shared from './index';

const { Customer, Quote } = db.sequelize.models;

const customerAssociations = Object.keys(Customer.associations);
const customerAttributes = Object.keys(Customer.attributes);
const quoteAssociations = Object.keys(Quote.associations);
const quoteAttributes = Object.keys(Quote.attributes);

const getCustomers = new Datalizer({
  query: shared.QUERY({
    id: shared.UUID({ $optional: true, $forbidden: true }),
    code: shared.CODE({ $optional: true }),
    name: shared.TEXT_FILTER({ $optional: true, $max: 100 }),
    extra: shared.EXTRA({ $optional: true }),
    created_at: shared.DATE_FILTER({ $optional: true }),
    updated_at: shared.DATE_FILTER({ $optional: true }),
    deleted_at: shared.DATE_FILTER({ $optional: true }),
    created_by: shared.UUID({ $optional: true }),
    updated_by: shared.UUID({ $optional: true }),
    deleted_by: shared.UUID({ $optional: true }),
    offset: shared.OFFSET({ $optional: true }),
    limit: shared.LIMIT({ $optional: true }),
    attributes: shared.ATTRIBUTES(customerAttributes),
    include: shared.INCLUDE(customerAssociations),
    paranoid: shared.BOOLEAN({ $optional: true }),
    sort_by: shared.ENUM(customerAttributes),
    order_by: shared.ORDER_BY({ $optional: true })
  }, { max: 30 })
});

const createCustomer = new Datalizer({
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
    deleted_by: shared.UUID({ $optional: true })
  }, { $max: 10 })
});

const getCustomer = new Datalizer({
  params: shared.PARAMS({ customer: shared.UUID() }, { $length: 1 }),
  query: shared.QUERY({
    attributes: shared.ATTRIBUTES(customerAttributes),
    include: shared.INCLUDE(customerAssociations),
    paranoid: shared.BOOLEAN({ $optional: true })
  }, { $max: 20 })
});

const updateCustomer = new Datalizer({
  params: shared.PARAMS({ customer: shared.UUID() }, { $length: 1 }),
  body: shared.BODY({
    id: shared.UUID({ $optional: true, $forbidden: true }),
    code: shared.CODE({ $optional: true }),
    name: shared.TEXT({ $optional: true, $empty: false, $min: 2 }),
    extra: shared.EXTRA({ $optional: true }),
    created_at: shared.DATE({ $optional: true }),
    updated_at: shared.DATE({ $optional: true }),
    deleted_at: shared.DATE({ $optional: true }),
    created_by: shared.UUID({ $optional: true }),
    updated_by: shared.UUID({ $optional: true }),
    deleted_by: shared.UUID({ $optional: true })
  }, { $max: 10, $empty: false })
});

const deleteCustomer = new Datalizer({
  params: shared.PARAMS({ customer: shared.UUID() }, { $length: 1 }),
  query: shared.QUERY({
    force: shared.BOOLEAN({ $optional: true }),
    paranoid: shared.BOOLEAN({ $optional: true }),
  }, { $max: 2 })
});

const getQuotes = new Datalizer({
  params: shared.PARAMS({ customer: shared.UUID() }, { $length: 1 }),
  query: shared.QUERY({
    id: shared.UUID({ $optional: true, $forbidden: true }),
    code: shared.CODE({ $optional: true }),
    subject: shared.TEXT_FILTER({ $optional: true, $max: 100 }),
    status: shared.ENUM([
      "open", "confirmed", "other", "approved", "pending",
      "awaiting", "authorized", "cancelled", "done"
    ]),
    extra: shared.EXTRA({ $optional: true }),
    created_at: shared.DATE_FILTER({ $optional: true }),
    updated_at: shared.DATE_FILTER({ $optional: true }),
    deleted_at: shared.DATE_FILTER({ $optional: true }),
    created_by: shared.UUID({ $optional: true }),
    updated_by: shared.UUID({ $optional: true }),
    deleted_by: shared.UUID({ $optional: true }),
    offset: shared.OFFSET({ $optional: true }),
    limit: shared.LIMIT({ $optional: true }),
    attributes: shared.ATTRIBUTES(quoteAttributes),
    include: shared.INCLUDE(quoteAssociations),
    paranoid: shared.BOOLEAN({ $optional: true }),
    sort_by: shared.ENUM(quoteAttributes),
    order_by: shared.ORDER_BY({ $optional: true })
  }, { $max: 30 })
});

const setQuotes = new Datalizer({
  params: shared.PARAMS({ customer: shared.UUID() }, { $length: 1 }),
  body: shared.BODY({ quotes: shared.UUID_ARRAY() }, { $length: 1 })
});

const getQuote = new Datalizer({
  params: shared.PARAMS({
    customer: shared.UUID(),
    quote: shared.UUID()
  }, { $length: 2 }),
  query: shared.QUERY({
    paranoid: shared.BOOLEAN({ $optional: true }),
    attributes: shared.ATTRIBUTES(quoteAttributes),
    include: shared.INCLUDE(quoteAssociations)
  }, { $max: 20 })
});

export default {
  getCustomers: shared.validate(getCustomers),
  createCustomer: shared.validate(createCustomer),
  getCustomer: shared.validate(getCustomer),
  updateCustomer: shared.validate(updateCustomer),
  deleteCustomer: shared.validate(deleteCustomer),
  getQuotes: shared.validate(getQuotes),
  setQuotes: shared.validate(setQuotes),
  getQuote: shared.validate(getQuote)
};
