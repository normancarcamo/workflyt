import db from 'src/db/models';
import Datalizer from "@ncardez/datalizer";
import * as shared from './index';

const { Order, Item, Department, Employee } = db.sequelize.models;

const orderAssociations = Object.keys(Order.associations);
const orderAttributes = Object.keys(Order.attributes);
const itemAssociations = Object.keys(Item.associations);
const itemAttributes = Object.keys(Item.attributes);
const departmentAssociations = Object.keys(Department.associations);
const departmentAttributes = Object.keys(Department.attributes);
const employeeAssociations = Object.keys(Employee.associations);
const employeeAttributes = Object.keys(Employee.attributes);

const getOrders = new Datalizer({
  query: shared.QUERY({
    id: shared.UUID({ $optional: true, $deny: true }),
    quote_id: shared.UUID({ $optional: true }),
    code: shared.CODE({ $optional: true }),
    type: shared.ENUM([ 'work', 'installation' ]),
    status: shared.ENUM([ 'awaiting', 'working', 'cancelled', 'done' ]),
    extra: shared.EXTRA({ $optional: true }),
    created_at: shared.DATE_FILTER({ $optional: true }),
    updated_at: shared.DATE_FILTER({ $optional: true }),
    deleted_at: shared.DATE_FILTER({ $optional: true }),
    created_by: shared.UUID({ $optional: true }),
    updated_by: shared.UUID({ $optional: true }),
    deleted_by: shared.UUID({ $optional: true }),
    limit: shared.LIMIT({ $optional: true }),
    offset: shared.OFFSET({ $optional: true }),
    paranoid: shared.BOOLEAN({ $optional: true }),
    attributes: shared.ATTRIBUTES(orderAttributes),
    include: shared.INCLUDE(orderAssociations),
    sort_by: shared.ENUM(orderAttributes),
    order_by: shared.ORDER_BY({ $optional: true })
  }, { $max: 30 })
});

const createOrders = new Datalizer({
  body: shared.BODY({
    id: shared.UUID({ $optional: true, $null: true }),
    quote_id: shared.UUID({ $optional: true }),
    code: shared.CODE({ $optional: true }),
    type: shared.ENUM(
      [ 'work', 'installation' ],
      { $default: 'service' }
    ),
    status: shared.ENUM(
      [ 'awaiting', 'working', 'cancelled', 'done' ],
      { $default: 'awaiting' }
    ),
    extra: shared.EXTRA({ $optional: true }),
    created_at: shared.DATE({ $optional: true }),
    updated_at: shared.DATE({ $optional: true }),
    deleted_at: shared.DATE({ $optional: true }),
    created_by: shared.UUID({ $optional: true }),
    updated_by: shared.UUID({ $optional: true }),
    deleted_by: shared.UUID({ $optional: true }),
  }, { $max: 12, $empty: false })
});

const getOrder = new Datalizer({
  params: shared.PARAMS(
    { order: shared.UUID() },
    { $length: 1 }
  ),
  query: shared.QUERY({
    attributes: shared.ATTRIBUTES(orderAttributes),
    include: shared.INCLUDE(orderAssociations),
    paranoid: shared.BOOLEAN({ $optional: true })
  }, { $max: 14 })
});

const updateOrder = new Datalizer({
  params: shared.PARAMS(
    { order: shared.UUID() },
    { $length: 1 }
  ),
  body: shared.BODY({
    id: shared.UUID({ $optional: true, $deny: true }),
    quote_id: shared.UUID({ $optional: true }),
    code: shared.CODE({ $optional: true }),
    type: shared.ENUM(
      [ 'work', 'installation' ],
      { $default: 'service' }
    ),
    status: shared.ENUM(
      [ 'awaiting', 'working', 'cancelled', 'done' ],
      { $default: 'awaiting' }
    ),
    extra: shared.EXTRA({ $optional: true }),
    created_at: shared.DATE({ $optional: true }),
    updated_at: shared.DATE({ $optional: true }),
    deleted_at: shared.DATE({ $optional: true }),
    created_by: shared.UUID({ $optional: true }),
    updated_by: shared.UUID({ $optional: true }),
    deleted_by: shared.UUID({ $optional: true }),
  }, { $max: 12, $empty: false })
});

const deleteOrder = new Datalizer({
  params: shared.PARAMS(
    { order: shared.UUID() },
    { $length: 1 }
  ),
  query: shared.QUERY({
    force: shared.BOOLEAN({ $optional: true }),
    paranoid: shared.BOOLEAN({ $optional: true })
  }, { $max: 2 })
});

const getItems = new Datalizer({
  params: shared.PARAMS(
    { order: shared.UUID() },
    { $length: 1 }
  ),
  query: shared.QUERY({
    id: shared.UUID({ $optional: true, $deny: true }),
    category_id: shared.UUID({ $optional: true }),
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
    attributes: shared.ATTRIBUTES(itemAttributes),
    include: shared.ATTRIBUTES(itemAssociations),
    limit: shared.LIMIT({ $optional: true }),
    offset: shared.OFFSET({ $optional: true }),
    paranoid: shared.BOOLEAN({ $optional: true }),
    sort_by: shared.ENUM(itemAttributes),
    order_by: shared.ORDER_BY({ $optional: true })
  }, { $max: 30 })
});

const setItems = new Datalizer({
  params: shared.PARAMS(
    { order: shared.UUID() },
    { $length: 1 }
  ),
  body: shared.BODY(
    { items: shared.UUID_ARRAY() },
    { $length: 1 }
  )
});

const getItem = new Datalizer({
  params: shared.PARAMS(
    { order: shared.UUID(), item: shared.UUID() },
    { $length: 2 }
  ),
  query: shared.QUERY({
    attributes: shared.ATTRIBUTES(itemAttributes),
    include: shared.ATTRIBUTES(itemAssociations),
    paranoid: shared.BOOLEAN({ $optional: true })
  }, { $max: 20 })
});

const updateItem = new Datalizer({
  params: shared.PARAMS(
    { order: shared.UUID(), item: shared.UUID() },
    { $length: 2 }
  ),
  body: shared.BODY({
    order_id: shared.UUID({ $optional: true, $deny: true }),
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
    { order: shared.UUID(), item: shared.UUID() },
    { $length: 2 }
  ),
  query: shared.QUERY({
    force: shared.BOOLEAN({ $optional: true }),
    paranoid: shared.BOOLEAN({ $optional: true })
  }, { $max: 2 })
});

const getDepartments = new Datalizer({
  params: shared.PARAMS(
    { order: shared.UUID() },
    { $length: 1 }
  ),
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
    attributes: shared.ATTRIBUTES(departmentAttributes),
    include: shared.ATTRIBUTES(departmentAssociations),
    limit: shared.LIMIT({ $optional: true }),
    offset: shared.OFFSET({ $optional: true }),
    paranoid: shared.BOOLEAN({ $optional: true }),
    sort_by: shared.ENUM(departmentAttributes),
    order_by: shared.ORDER_BY({ $optional: true })
  }, { $max: 30 })
});

const setDepartments = new Datalizer({
  params: shared.PARAMS(
    { order: shared.UUID() },
    { $length: 1 }
  ),
  body: shared.BODY(
    { departments: shared.UUID_ARRAY() },
    { $length: 1 }
  )
});

const getDepartment = new Datalizer({
  params: shared.PARAMS(
    { order: shared.UUID(), department: shared.UUID() },
    { $length: 2 }
  ),
  query: shared.QUERY({
    attributes: shared.ATTRIBUTES(departmentAttributes),
    include: shared.ATTRIBUTES(departmentAssociations),
    paranoid: shared.BOOLEAN({ $optional: true }),
  }, { $max: 30 })
});

const updateDepartment = new Datalizer({
  params: shared.PARAMS(
    { order: shared.UUID(), department: shared.UUID() },
    { $length: 2 }
  ),
  body: shared.BODY({
    order_id: shared.UUID({ $optional: true, $deny: true }),
    department_id: shared.UUID({ $optional: true, $deny: true }),
    extra: shared.EXTRA({ $optional: true }),
    created_at: shared.DATE({ $optional: true }),
    updated_at: shared.DATE({ $optional: true }),
    deleted_at: shared.DATE({ $optional: true }),
    created_by: shared.UUID({ $optional: true }),
    updated_by: shared.UUID({ $optional: true }),
    deleted_by: shared.UUID({ $optional: true })
  }, { $max: 9, $empty: false })
});

const removeDepartment = new Datalizer({
  params: shared.PARAMS(
    { order: shared.UUID(), department: shared.UUID() },
    { $length: 2 }
  ),
  query: shared.QUERY({
    force: shared.BOOLEAN({ $optional: true }),
    paranoid: shared.BOOLEAN({ $optional: true })
  }, { $max: 2 })
});

const getEmployees = new Datalizer({
  params: shared.PARAMS(
    { order: shared.UUID() },
    { $length: 1 }
  ),
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
    include: shared.ATTRIBUTES(employeeAssociations),
    limit: shared.LIMIT({ $optional: true }),
    offset: shared.OFFSET({ $optional: true }),
    paranoid: shared.BOOLEAN({ $optional: true }),
    sort_by: shared.ENUM(employeeAttributes),
    order_by: shared.ORDER_BY({ $optional: true })
  }, { $max: 36 })
});

const setEmployees = new Datalizer({
  params: shared.PARAMS(
    { order: shared.UUID() },
    { $length: 1 }
  ),
  body: shared.BODY(
    { employees: shared.UUID_ARRAY() },
    { $length: 1 }
  )
});

const getEmployee = new Datalizer({
  params: shared.PARAMS(
    { order: shared.UUID(), employee: shared.UUID() },
    { $length: 2 }
  ),
  query: shared.QUERY({
    attributes: shared.ATTRIBUTES(employeeAttributes),
    include: shared.ATTRIBUTES(employeeAssociations),
    paranoid: shared.BOOLEAN({ $optional: true })
  }, { $max: 36 })
});

const updateEmployee = new Datalizer({
  params: shared.PARAMS(
    { order: shared.UUID(), employee: shared.UUID() },
    { $length: 2 }
  ),
  body: shared.BODY({
    order_id: shared.UUID({ $optional: true, $deny: true }),
    employee_id: shared.UUID({ $optional: true, $deny: true }),
    extra: shared.EXTRA({ $optional: true }),
    created_at: shared.DATE({ $optional: true }),
    updated_at: shared.DATE({ $optional: true }),
    deleted_at: shared.DATE({ $optional: true }),
    created_by: shared.UUID({ $optional: true }),
    updated_by: shared.UUID({ $optional: true }),
    deleted_by: shared.UUID({ $optional: true })
  }, { $max: 9, $empty: false })
});

const removeEmployee = new Datalizer({
  params: shared.PARAMS(
    { order: shared.UUID(), employee: shared.UUID() },
    { $length: 2 }
  ),
  query: shared.QUERY({
    force: shared.BOOLEAN({ $optional: true }),
    paranoid: shared.BOOLEAN({ $optional: true })
  }, { $max: 2 })
});

export default {
  getOrders: shared.validate(getOrders),
  createOrders: shared.validate(createOrders),
  getOrder: shared.validate(getOrder),
  updateOrder: shared.validate(updateOrder),
  deleteOrder: shared.validate(deleteOrder),
  getItems: shared.validate(getItems),
  setItems: shared.validate(setItems),
  getItem: shared.validate(getItem),
  updateItem: shared.validate(updateItem),
  removeItem: shared.validate(removeItem),
  getDepartments: shared.validate(getDepartments),
  setDepartments: shared.validate(setDepartments),
  getDepartment: shared.validate(getDepartment),
  updateDepartment: shared.validate(updateDepartment),
  removeDepartment: shared.validate(removeDepartment),
  getEmployees: shared.validate(getEmployees),
  setEmployees: shared.validate(setEmployees),
  getEmployee: shared.validate(getEmployee),
  updateEmployee: shared.validate(updateEmployee),
  removeEmployee: shared.validate(removeEmployee)
};
