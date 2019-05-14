import uuid from 'uuid/v4';

import json_category from 'src/db/fixtures/category.json';
import json_company from 'src/db/fixtures/company.json';
import json_item from 'src/db/fixtures/item.json';
import json_supplier from 'src/db/fixtures/supplier.json';
import json_supplier_item from 'src/db/fixtures/supplier_item.json';
import json_warehouse from 'src/db/fixtures/warehouse.json';
import json_warehouse_item from 'src/db/fixtures/warehouse_item.json';
import json_department from 'src/db/fixtures/department.json';
import json_employee from 'src/db/fixtures/employee.json';
import json_customer from 'src/db/fixtures/customer.json';
import json_quote from 'src/db/fixtures/quote.json';
import json_quote_item from 'src/db/fixtures/quote_item.json';
import json_user from 'src/db/fixtures/user.json';
import json_user_role from 'src/db/fixtures/user_role.json';
import json_role from 'src/db/fixtures/role.json';
import json_role_permission from 'src/db/fixtures/role_permission.json';
import json_permission from 'src/db/fixtures/permission.json';
import json_stock from 'src/db/fixtures/stock.json';
import json_order from 'src/db/fixtures/order.json';
import json_order_department from 'src/db/fixtures/order_department.json';
import json_order_item from 'src/db/fixtures/order_item.json';
import json_order_employee from 'src/db/fixtures/order_employee.json';

const is_mocked = JSON.parse(process.env.MOCK);

export default function setupFactory(db, mockService = is_mocked, suite_name) {

  const setup = {};

  setup.scenario = {};

  setup.instance = {};

  const {
    Category,
    Company,
    Customer,
    Department,
    Employee,
    Item,
    Order,
    Permission,
    Quote,
    Role,
    Stock,
    Supplier,
    User,
    Warehouse,
    OrderDepartments,
    OrderItems,
    OrderEmployees,
    QuoteItems,
    RolePermissions,
    SupplierItems,
    UserRoles,
    WarehouseItems,
  } = db.sequelize.models;

  setup.insert = async () => {
    if (mockService) {
      // Build:
      setup.instance.categories = Category.build(json_category);
      setup.instance.companies = Company.build(json_company);
      setup.instance.customers = Customer.build(json_customer);
      setup.instance.departments = Department.build(json_department);
      setup.instance.employees = Employee.build(json_employee);
      setup.instance.items = Item.build(json_item);
      setup.instance.quotes = Quote.build(json_quote);
      setup.instance.roles = Role.build(json_role);
      setup.instance.suppliers = Supplier.build(json_supplier);
      setup.instance.users = User.build(json_user);
      setup.instance.warehouses = Warehouse.build(json_warehouse);
      setup.instance.permissions = Permission.build(json_permission);
      setup.instance.stocks = Stock.build(json_stock);
      setup.instance.orders = Order.build(json_order);

      // Associate:
      setup.instance.departments[0].getEmployees = async () => setup.instance.employees;
      setup.instance.categories[0].getItems = async () => setup.instance.items;
      setup.instance.suppliers[0].getItems = async () => setup.instance.items;
      setup.instance.warehouses[0].getItems = async () => setup.instance.items;
      setup.instance.customers[0].getQuotes = async () => setup.instance.quotes;
      setup.instance.employees[0].getUser = async () => setup.instance.users[0];
      setup.instance.employees[0].getQuotes = async () => setup.instance.quotes;
      setup.instance.users[0].getRoles = async () => setup.instance.roles;
      setup.instance.roles[0].getPermissions = async () => setup.instance.permissions;
      setup.instance.items[0].getStocks = async () => setup.instance.stocks;
      setup.instance.orders[0].getItems = async () => setup.instance.items;
      setup.instance.orders[0].getDepartments = async () => setup.instance.departments;
      setup.instance.orders[0].getEmployees = async () => setup.instance.employees;
      setup.instance.quotes[0].getItems = async () => setup.instance.items;
      setup.instance.quotes[0].getOrders = async () => setup.instance.orders;
    } else {
      let transaction;
      try {
        transaction = await db.sequelize.transaction();
        const options = { individualHooks: true, transaction };

        // Build:
        setup.instance.categories = await Category.bulkCreate(json_category, options);
        setup.instance.companies = await Company.bulkCreate(json_company, options);
        setup.instance.departments = await Department.bulkCreate(json_department, options);
        setup.instance.employees = await Employee.bulkCreate(json_employee, options);
        setup.instance.customers = await Customer.bulkCreate(json_customer, options);
        setup.instance.items = await Item.bulkCreate(json_item, options);
        setup.instance.permissions = await Permission.bulkCreate(json_permission, options);
        setup.instance.quotes = await Quote.bulkCreate(json_quote, options);
        setup.instance.roles = await Role.bulkCreate(json_role, options);
        setup.instance.stocks = await Stock.bulkCreate(json_stock, options);
        setup.instance.suppliers = await Supplier.bulkCreate(json_supplier, options);
        setup.instance.users = await User.bulkCreate(json_user, options);
        setup.instance.warehouses = await Warehouse.bulkCreate(json_warehouse, options);
        setup.instance.orders = await Order.bulkCreate(json_order, options);

        // Associate:
        // N:M
        // setup.instance.quoteItems = await QuoteItems.bulkCreate(json_quote_item, options);
        // setup.instance.warehouseItems = await WarehouseItems.bulkCreate(json_warehouse_item, options);
        // setup.instance.supplierItems = await SupplierItems.bulkCreate(json_supplier_item, options);
        // setup.instance.userRoles = await UserRoles.bulkCreate(json_user_role, options);
        // setup.instance.rolePermissions = await RolePermissions.bulkCreate(json_role_permission, options);
        // setup.instance.orderDepartments = await OrderDepartments.bulkCreate(json_order_department, options);
        // setup.instance.orderItems = await OrderItems.bulkCreate(json_order_item, options);
        // setup.instance.orderEmployees = await OrderEmployees.bulkCreate(json_order_employee, options);

        await setup.instance.categories[0].setItems(setup.instance.items, options);
        await setup.instance.warehouses[0].setItems(setup.instance.items, options);
        await setup.instance.suppliers[0].setItems(setup.instance.items, options);
        await setup.instance.departments[0].setEmployees(setup.instance.employees, options);
        await setup.instance.employees[0].setUser(setup.instance.users[0], options);
        await setup.instance.employees[0].setQuotes(setup.instance.quotes, options);
        await setup.instance.users[0].setRoles(setup.instance.roles, options);
        await setup.instance.roles[0].setPermissions(setup.instance.permissions, options);
        await setup.instance.items[0].setStocks(setup.instance.stocks, options);
        await setup.instance.customers[0].setQuotes(setup.instance.quotes, options);
        await setup.instance.orders[0].setItems(setup.instance.items, options);
        await setup.instance.orders[0].setDepartments(setup.instance.departments, options);
        await setup.instance.orders[0].setEmployees(setup.instance.employees, options);
        await setup.instance.quotes[0].setItems(setup.instance.items, options);
        await setup.instance.quotes[0].setOrders(setup.instance.orders, options);

        await transaction.commit();
      } catch (error) {
        console.error('Error when trying to insert:', error);
        await transaction.rollbak();
      }
    }
  }

  setup.remove = async () => {
    if (jest.isMockFunction(db.sequelize.transaction)) {
      db.sequelize.transaction.mockRestore();
    }

    [
      'findAll',
      'create',
      'bulkCreate',
      'update',
      'destroy',
      'findByPk',
      'match',
      'findMany',
      'createMany',
      'updateMany',
      'destroyMany'
    ].forEach(method => {
      [
        Category[method],
        Company[method],
        Department[method],
        Customer[method],
        Employee[method],
        Item[method],
        Order[method],
        Permission[method],
        Quote[method],
        Role[method],
        Stock[method],
        Supplier[method],
        User[method],
        Warehouse[method],
      ].forEach(fn => {
        if (jest.isMockFunction(fn)) {
          fn.mockRestore();
        }
      });
    });

    if (!mockService) {
      try {
        const opts = { where: {}, force: true, };
        await Category.destroy(opts);
        await Department.destroy(opts);
        await Company.destroy(opts);
        await Customer.destroy(opts);
        await Employee.destroy(opts);
        await Item.destroy(opts);
        await Order.destroy(opts);
        await Permission.destroy(opts);
        await Quote.destroy(opts);
        await Role.destroy(opts);
        await Stock.destroy(opts);
        await Supplier.destroy(opts);
        await User.destroy(opts);
        await Warehouse.destroy(opts);
      } catch (error) {
        console.error('Error when trying to destroy:', error);
      }
    }
  }

  setup.before_all = setup.remove;

  setup.before_each = setup.insert;

  setup.after_each = setup.remove;

  setup.after_all = db.close;

  return setup;
}
