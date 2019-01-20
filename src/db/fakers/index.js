"use strict";

const fs = require("fs");
const { to } = require("@playscode/fns");

const company = require("./company");
const category = require("./category");
const customer = require("./customer");
const department = require("./department");
const employee = require("./employee")(department);
const item = require("./item")(category); // 6
const item_type = require("./item_type")(item); // 7
const stock = require("./stock")(item); // 8
const user = require("./user")(employee); // 9
const role = require("./role"); // 10
const user_role = require("./user_role")(user, role); // 11
const permission = require("./permission"); // 12
const role_permission = require("./role_permission")(role, permission); // 13
const quote = require("./quote")(customer, employee, user, role, user_role); // 14
const quote_item = require("./quote_item")(quote, item); // 15
const order = require("./order")(quote); // 16
const order_item = require("./order_item")(order, item); // 17
const order_department = require("./order_department")(order, department); // 18
const warehouse = require("./warehouse"); // 19
const warehouse_item = require("./warehouse_item")(warehouse, item); // 20
const supplier = require("./supplier");
const supplier_item = require("./supplier_item")(supplier, item);

const path = name => `${process.cwd()}/src/db/fixtures/${name}.json`;

to.file(to.JSON(company), path("company"))
  .then(() => to.file(to.JSON(category), path("category")))
  .then(() => to.file(to.JSON(customer), path("customer")))
  .then(() => to.file(to.JSON(department), path("department")))
  .then(() => to.file(to.JSON(employee), path("employee")))
  .then(() => to.file(to.JSON(item), path("item")))
  .then(() => to.file(to.JSON(item_type), path("item_type")))
  .then(() => to.file(to.JSON(stock), path("stock")))
  .then(() => to.file(to.JSON(user), path("user")))
  .then(() => to.file(to.JSON(role), path("role")))
  .then(() => to.file(to.JSON(user_role), path("user_role")))
  .then(() => to.file(to.JSON(permission), path("permission")))
  .then(() => to.file(to.JSON(role_permission), path("role_permission")))
  .then(() => to.file(to.JSON(quote), path("quote")))
  .then(() => to.file(to.JSON(quote_item), path("quote_item")))
  .then(() => to.file(to.JSON(order), path("order")))
  .then(() => to.file(to.JSON(order_item), path("order_item")))
  .then(() => to.file(to.JSON(order_department), path("order_department")))
  .then(() => to.file(to.JSON(warehouse), path("warehouse")))
  .then(() => to.file(to.JSON(warehouse_item), path("warehouse_item")))
  .then(() => to.file(to.JSON(supplier), path("supplier")))
  .then(() => to.file(to.JSON(supplier_item), path("supplier_item")))
  .then(() => console.log('Fixtures have been created.'))
  .catch(err => console.error('Fixtures error:', err.message));
