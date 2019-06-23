import db from 'src/db/models';
import Datalizer from "@ncardez/datalizer";
import * as shared from './index';

const { Employee, User, Quote } = db.sequelize.models;

const employeeAssociations = Object.keys(Employee.associations);
const employeeAttributes = Object.keys(Employee.attributes);
const userAssociations = Object.keys(User.associations);
const userAttributes = Object.keys(User.attributes);
const quoteAssociations = Object.keys(Quote.associations);
const quoteAttributes = Object.keys(Quote.attributes);

const getEmployees = new Datalizer({
  query: shared.QUERY({
    id: shared.UUID({ $optional: true, $deny: true }),
    supervisor_id: shared.UUID({ $optional: true }),
    departement_id: shared.UUID({ $optional: true }),
    code: shared.CODE({ $optional: true }),
    firstname: shared.TEXT_FILTER({ $optional: true }),
    lastname: shared.TEXT_FILTER({ $optional: true }),
    extra: shared.EXTRA({ $optional: true }),
    created_at: shared.DATE_FILTER({ $optional: true }),
    updated_at: shared.DATE_FILTER({ $optional: true }),
    deleted_at: shared.DATE_FILTER({ $optional: true }),
    created_by: shared.UUID({ $optional: true }),
    updated_by: shared.UUID({ $optional: true }),
    deleted_by: shared.UUID({ $optional: true }),
    attributes: shared.ATTRIBUTES(employeeAttributes),
    include: shared.INCLUDE(employeeAssociations),
    paranoid: shared.BOOLEAN({ $optional: true }),
    offset: shared.OFFSET({ $optional: true }),
    limit: shared.LIMIT({ $optional: true }),
    sort_by: shared.ENUM(employeeAttributes),
    order_by: shared.ORDER_BY({ $optional: true })
  }, { $max: 36 })
});

const createEmployees = new Datalizer({
  body: shared.BODY({
    id: shared.UUID({ $optional: true, $null: true }),
    supervisor_id: shared.UUID({ $optional: true, $null: true }),
    department_id: shared.UUID(),
    code: shared.CODE({ $optional: true }),
    firstname: shared.TEXT({ $empty: false, $min: 2 }),
    lastname: shared.TEXT({ $empty: false, $min: 2 }),
    extra: shared.EXTRA({ $optional: true }),
    created_at: shared.DATE({ $optional: true }),
    updated_at: shared.DATE({ $optional: true }),
    deleted_at: shared.DATE({ $optional: true }),
    created_by: shared.UUID({ $optional: true }),
    updated_by: shared.UUID({ $optional: true }),
    deleted_by: shared.UUID({ $optional: true })
  }, { $max: 13, $empty: false })
});

const getEmployee = new Datalizer({
  params: shared.PARAMS({ employee: shared.UUID() }, { $length: 1 }),
  query: shared.QUERY({
    attributes: shared.ATTRIBUTES(employeeAttributes),
    include: shared.INCLUDE(employeeAssociations),
    paranoid: shared.BOOLEAN({ $optional: true }),
  }, { $max: 18 })
});

const updateEmployee = new Datalizer({
  params: shared.PARAMS({ employee: shared.UUID() }, { $length: 1 }),
  body: shared.BODY({
    id: shared.UUID({ $optional: true, $deny: true }),
    supervisor_id: shared.UUID({ $optional: true, $deny: true }),
    department_id: shared.UUID({ $optional: true, $deny: true }),
    code: shared.CODE({ $optional: true }),
    firstname: shared.TEXT({ $optional: true, $empty: false, $min: 2 }),
    lastname: shared.TEXT({ $optional: true, $empty: false, $min: 2 }),
    extra: shared.EXTRA({ $optional: true }),
    created_at: shared.DATE({ $optional: true }),
    updated_at: shared.DATE({ $optional: true }),
    deleted_at: shared.DATE({ $optional: true }),
    created_by: shared.UUID({ $optional: true }),
    updated_by: shared.UUID({ $optional: true }),
    deleted_by: shared.UUID({ $optional: true })
  }, { $empty: false, $max: 13 })
});

const deleteEmployee = new Datalizer({
  params: shared.PARAMS(
    { employee: shared.UUID() },
    { $length: 1 }
  ),
  query: shared.QUERY({
    force: shared.BOOLEAN({ $optional: true }),
    paranoid: shared.BOOLEAN({ $optional: true })
  }, { $max: 2 })
});

const getUser = new Datalizer({
  params: shared.PARAMS({ employee: shared.UUID() }, { $length: 1 }),
  query: shared.QUERY({
    attributes: shared.ATTRIBUTES(userAttributes),
    include: shared.INCLUDE(userAssociations),
    paranoid: shared.BOOLEAN({ $optional: true })
  }, { $max: 20 })
});

const setUser = new Datalizer({
  params: shared.PARAMS({ employee: shared.UUID() }, { $length: 1 }),
  body: shared.BODY({ user: shared.UUID() }, { $length: 1 })
});

const removeUser = new Datalizer({
  params: shared.PARAMS(
    { employee: shared.UUID() },
    { $length: 1 }
  )
});

const getQuotes = new Datalizer({
  params: shared.PARAMS({ employee: shared.UUID() }, { $length: 1 }),
  query: shared.QUERY({
    id: shared.UUID({ $optional: true, $deny: true }),
    customer_id: shared.UUID({ $optional: true }),
    salesman_id: shared.UUID({ $optional: true }),
    code: shared.CODE({ $optional: true }),
    subject: shared.TEXT_FILTER({ $optional: true }),
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
    attributes: shared.ATTRIBUTES(quoteAttributes),
    include: shared.INCLUDE(quoteAssociations),
    paranoid: shared.BOOLEAN({ $optional: true }),
    limit: shared.LIMIT({ $optional: true }),
    offset: shared.OFFSET({ $optional: true }),
    sort_by: shared.ENUM(quoteAttributes),
    order_by: shared.ORDER_BY({ $optional: true })
  }, { $max: 34 })
});

const setQuotes = new Datalizer({
  params: shared.PARAMS({ employee: shared.UUID() }, { $length: 1 }),
  body: shared.BODY({ quotes: shared.UUID_ARRAY() }, { $length: 1 })
});

const getQuote = new Datalizer({
  params: shared.PARAMS(
    { employee: shared.UUID(), quote: shared.UUID() },
    { $length: 2 }
  ),
  query: shared.QUERY({
    attributes: shared.ATTRIBUTES(quoteAttributes),
    include: shared.INCLUDE(quoteAssociations),
    paranoid: shared.BOOLEAN({ $optional: true })
  }, { $max: 20 })
});

export default {
  getEmployees: shared.validate(getEmployees),
  createEmployees: shared.validate(createEmployees),
  getEmployee: shared.validate(getEmployee),
  updateEmployee: shared.validate(updateEmployee),
  deleteEmployee: shared.validate(deleteEmployee),
  getUser: shared.validate(getUser),
  setUser: shared.validate(setUser),
  removeUser: shared.validate(removeUser),
  getQuotes: shared.validate(getQuotes),
  setQuotes: shared.validate(setQuotes),
  getQuote: shared.validate(getQuote)
};
