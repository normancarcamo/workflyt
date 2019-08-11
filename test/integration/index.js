const supertest = require('supertest');
const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const uuid = require('uuid/v4');
const db = require('src/providers/postgres');

const setup = {};

setup.db = db;

setup.models = setup.db.sequelize.models;

setup.data = {
  category: require('src/providers/postgres/fixtures/test/category.json'),
  company: require('src/providers/postgres/fixtures/test/company.json'),
  customer: require('src/providers/postgres/fixtures/test/customer.json'),
  department_employee: require('src/providers/postgres/fixtures/test/department_employee.json'),
  department: require('src/providers/postgres/fixtures/test/department.json'),
  employee_supervisor: require('src/providers/postgres/fixtures/test/employee_supervisor.json'),
  employee: require('src/providers/postgres/fixtures/test/employee.json'),
  item: require('src/providers/postgres/fixtures/test/item.json'),
  order_department: require('src/providers/postgres/fixtures/test/order_department.json'),
  order_employee: require('src/providers/postgres/fixtures/test/order_employee.json'),
  order_item: require('src/providers/postgres/fixtures/test/order_item.json'),
  order: require('src/providers/postgres/fixtures/test/order.json'),
  permission: require('src/providers/postgres/fixtures/test/permission.json'),
  quote_item: require('src/providers/postgres/fixtures/test/quote_item.json'),
  quote: require('src/providers/postgres/fixtures/test/quote.json'),
  role_permission: require('src/providers/postgres/fixtures/test/role_permission.json'),
  role: require('src/providers/postgres/fixtures/test/role.json'),
  stock: require('src/providers/postgres/fixtures/test/stock.json'),
  supplier_item: require('src/providers/postgres/fixtures/test/supplier_item.json'),
  supplier: require('src/providers/postgres/fixtures/test/supplier.json'),
  user_role: require('src/providers/postgres/fixtures/test/user_role.json'),
  user: require('src/providers/postgres/fixtures/test/user.json'),
  warehouse_item: require('src/providers/postgres/fixtures/test/warehouse_item.json'),
  warehouse: require('src/providers/postgres/fixtures/test/warehouse.json')
};

setup.genToken = function(data) {
  return jsonwebtoken.sign({
    sub: uuid(),
    username: 'tester',
    password: 'a0123456789z',
    roles: [],
    permissions: [],
    ...data
  }, process.env.JWT_SECRET);
}

setup.logResponse = function(res) {
  console.log('------------------------------------------------------------\n',
    JSON.stringify({
      ok: res.ok,
      xhr: res.xhr,
      redirect: res.redirect,
      accepted: res.accepted,
      badRequest: res.badRequest,
      clientError: res.clientError,
      serverError: res.serverError,
      forbidden: res.forbidden,
      unauthorized: res.unauthorized,
      info: res.info,
      notFound: res.notFound,
      notAcceptable: res.notAcceptable,
      noContent: res.noContent,
      charset: res.charset,
      files: res.files,
      links: res.links,
      readable: res.readable,
      redirects: res.redirects,
      type: res.type,
      status: res.status,
      statusType: res.statusType,
      statusCode: res.statusCode,
      body: res.body,
      error: res.error
    }, null, 2),
    '\n-----------------------------------------------------------------------'
  );
}

setup.is_mocked = JSON.parse(typeof process.env.MOCK === 'undefined'
  ? false
  : process.env.MOCK);

setup.scenario = {};

setup.instance = {};

setup.restoreMocks = async function() {
  if (jest.isMockFunction(db.sequelize.transaction)) {
    db.sequelize.transaction.mockRestore();
  }
  if (jest.isMockFunction(db.sequelize.query)) {
    db.sequelize.query.mockRestore();
  }
  if (jest.isMockFunction(jsonwebtoken.verify)) {
    jsonwebtoken.verify.mockRestore();
  }
  if (jest.isMockFunction(jsonwebtoken.sign)) {
    jsonwebtoken.sign.mockRestore();
  }
  if (jest.isMockFunction(bcrypt.compare)) {
    bcrypt.compare.mockRestore();
  }
  if (jest.isMockFunction(bcrypt.hash)) {
    bcrypt.hash.mockRestore();
  }

  Object.keys(setup.models).forEach(model => {
    Object.keys(setup.models[model]).forEach(method => {
      if (jest.isMockFunction(setup.models[model][method])) {
        setup.models[model][method].mockRestore();
      }
    });
  });
}

setup.destroyModels = async function() {
  if (!setup.is_mocked) {
    try {
      for (let model in setup.models) {
        await setup.models[model].destroy({ where: {}, force: true, });
      }
    } catch (error) {
      console.error(`(setup.destroyModels) ${error.name}: ${error.message}`);
    }
  }
}

setup.associateModels = async function(options) {
  if (setup.is_mocked) {
    // department + employees: [M:N]
    for (let department of setup.instance.departments) {
      department.getEmployees = async options => {
        let collection = [];

        for (let row of setup.data.department_employee) {
          if (row.department_id === department.id) {
            collection.push(row.employee_id);
          }
        }

        for (let employee of setup.data.employee) {
          let index = collection.indexOf(employee.id);
          if (index > -1) {
            collection[index] = employee;
          }
        }

        return collection;
      }
    }

    // category + items: [1:M]
    for (let category of setup.instance.categories) {
      category.getItems = async () => setup.instance.items.filter(
        item => item.category_id === category.id
      );
    }

    // suppliers + items: [M:N]
    for (let supplier of setup.instance.suppliers) {
      supplier.getItems = async options => {
        let collection = [];

        for (let row of setup.data.supplier_item) {
          if (row.supplier_id === supplier.id) {
            collection.push(row.item_id);
          }
        }

        for (let item of setup.data.item) {
          let index = collection.indexOf(item.id);
          if (index > -1) {
            collection[index] = item;
          }
        }

        return collection;
      }
    }

    // warehouses + items: [M:N]
    for (let warehouse of setup.instance.warehouses) {
      warehouse.getItems = async options => {
        let collection = [];

        for (let row of setup.data.warehouse_item) {
          if (row.warehouse_id === warehouse.id) {
            collection.push(row.item_id);
          }
        }

        for (let item of setup.data.item) {
          let index = collection.indexOf(item.id);
          if (index > -1) {
            collection[index] = item;
          }
        }

        return collection;
      }
    }

    // customer + quotes: [1:M]
    for (let customer of setup.instance.customers) {
      customer.getQuotes = async () => setup.instance.quotes.filter(
        quote => quote.customer_id === customer.id
      );
    }

    // employees + user: [1:1]
    for (let employee of setup.instance.employees) {
      employee.getUser = async () => setup.instance.users.find(
        user => user.employee_id === employee.id
      );
    }

    // employee + quotes: [1:M]
    for (let employee of setup.instance.employees) {
      employee.getQuotes = async () => setup.instance.quotes.filter(
        quote => quote.salesman_id === employee.id
      );
    }

    // employees + supervisors: [M:N]
    for (let employee of setup.instance.employees) {
      if (employee.is_supervisor === 0) {
        employee.getSupervisors = async options => {
          let collection = [];

          for (let row of setup.data.employee_supervisor) {
            if (row.employee_id === employee.id) {
              collection.push(row.supervisor_id);
            }
          }

          for (let supervisor of setup.data.employee) {
            let index = collection.indexOf(supervisor.id);
            if (index > -1) {
              collection[index] = supervisor;
            }
          }

          return collection;
        }
      } else {
        employee.getEmployees = async options => {
          let collection = [];

          for (let row of setup.data.employee_supervisor) {
            if (row.supervisor_id === employee.id) {
              collection.push(row.employee_id);
            }
          }

          for (let employee of setup.data.employee) {
            let index = collection.indexOf(employee.id);
            if (index > -1) {
              collection[index] = employee;
            }
          }

          return collection;
        }
      }
    }

    // users + roles: [M:N]
    for (let user of setup.instance.users) {
      user.getRoles = async options => {
        let collection = [];

        for (let row of setup.data.user_role) {
          if (row.user_id === user.id) {
            collection.push(row.role_id);
          }
        }

        for (let role of setup.data.role) {
          let index = collection.indexOf(role.id);
          if (index > -1) {
            collection[index] = role;
          }
        }

        return collection;
      }
    }

    // roles + permissions: [M:N]
    for (let role of setup.instance.roles) {
      role.getPermissions = async options => {
        let collection = [];

        for (let row of setup.data.role_permission) {
          if (row.role_id === role.id) {
            collection.push(row.permission_id);
          }
        }

        for (let permission of setup.data.permission) {
          let index = collection.indexOf(permission.id);
          if (index > -1) {
            collection[index] = permission;
          }
        }

        return collection;
      }
    }

    // item + stocks: [1:M]
    for (let item of setup.instance.items) {
      item.getStocks = async () => setup.instance.stocks.filter(
        stock => stock.item_id === item.id
      );
    }

    // orders + items: [M:N]
    for (let order of setup.instance.orders) {
      order.getItems = async options => {
        let collection = [];

        for (let row of setup.data.order_item) {
          if (row.order_id === order.id) {
            collection.push(row.item_id);
          }
        }

        for (let item of setup.data.item) {
          let index = collection.indexOf(item.id);
          if (index > -1) {
            collection[index] = item;
          }
        }

        return collection;
      }
    }

    // orders + departments: [M:N]
    for (let order of setup.instance.orders) {
      order.getDepartments = async options => {
        let collection = [];

        for (let row of setup.data.order_department) {
          if (row.order_id === order.id) {
            collection.push(row.department_id);
          }
        }

        for (let department of setup.data.department) {
          let index = collection.indexOf(department.id);
          if (index > -1) {
            collection[index] = department;
          }
        }

        return collection;
      }
    }

    // orders + employees: [M:N]
    for (let order of setup.instance.orders) {
      order.getEmployees = async options => {
        let collection = [];

        for (let row of setup.data.order_employee) {
          if (row.order_id === order.id) {
            collection.push(row.employee_id);
          }
        }

        for (let employee of setup.data.employee) {
          let index = collection.indexOf(employee.id);
          if (index > -1) {
            collection[index] = employee;
          }
        }

        return collection;
      }
    }

    // quotes + items: [M:N]
    for (let quote of setup.instance.quotes) {
      quote.getItems = async options => {
        let collection = [];

        for (let row of setup.data.quote_item) {
          if (row.quote_id === quote.id) {
            collection.push(row.item_id);
          }
        }

        for (let item of setup.data.item) {
          let index = collection.indexOf(item.id);
          if (index > -1) {
            collection[index] = item;
          }
        }

        return collection;
      }
    }

    // quote + orders: [1:M]
    for (let quote of setup.instance.quotes) {
      quote.getOrders = async () => setup.instance.orders.filter(
        order => order.quote_id === quote.id
      );
    }
  } else {
    // category + items: [1:M]
    for (let category of setup.instance.categories) {
      await category.addItems(setup.instance.items.find(
        i => i.category_id === category.id
      ), options);
    }

    // warehouses + items: [M:N]
    for (let row of setup.data.warehouse_item) {
      await setup.instance.warehouses.find(
        w => w.id === row.warehouse_id
      ).addItems(setup.instance.items.find(
        i => i.id === row.item_id
      ), options);
    }

    // suppliers + items: [M:N]
    for (let row of setup.data.supplier_item) {
      await setup.instance.suppliers.find(
        s => s.id === row.supplier_id
      ).addItems(setup.instance.items.find(
        i => i.id === row.item_id
      ), options);
    }

    // department + employees: [M:N]
    for (let row of setup.data.department_employee) {
      await setup.instance.departments.find(
        d => d.id === row.department_id
      ).addEmployees(setup.instance.employees.find(
        e => e.id === row.employee_id
      ), options);
    }

    // employee + user: [1:1]
    for (let employee of setup.instance.employees) {
      await employee.setUser(setup.instance.users.find(
        u => u.employee_id === employee.id
      ), options);
    }

    // employee + quotes: [1:M]
    for (let employee of setup.instance.employees) {
      await employee.addQuotes(setup.instance.quotes.find(
        q => q.salesman_id === employee.id
      ), options);
    }

    // employees + supervisors: [M:N]
    for (let row of setup.data.employee_supervisor) {
      await setup.instance.employees.find(
        e => e.id === row.employee_id
      ).addSupervisors(setup.instance.employees.find(
        e => e.id === row.supervisor_id
      ), options);
    }

    // users + roles: [M:N]
    for (let row of setup.data.user_role) {
      await setup.instance.users.find(
        u => u.id === row.user_id
      ).addRoles(setup.instance.roles.find(
        r => r.id === row.role_id
      ), options);
    }

    // roles + permissions: [M:N]
    for (let row of setup.data.role_permission) {
      await setup.instance.roles.find(
        r => r.id === row.role_id
      ).addPermissions(setup.instance.permissions.find(
        p => p.id === row.permission_id
      ), options);
    }

    // item + stocks: [1:M]
    for (let item of setup.instance.items) {
      await item.addStocks(setup.instance.stocks.find(
        s => s.item_id === item.id
      ), options);
    }

    // customer + quotes: [1:M]
    for (let customer of setup.instance.customers) {
      await customer.addQuotes(setup.instance.quotes.find(
        q => q.customer_id === customer.id
      ), options);
    }

    // orders + items: [M:N]
    for (let row of setup.data.order_item) {
      await setup.instance.orders.find(
        o => o.id === row.order_id
      ).addItems(setup.instance.items.find(
        i => i.id === row.item_id
      ), options);
    }

    // orders + departments: [M:N]
    for (let row of setup.data.order_department) {
      await setup.instance.orders.find(
        o => o.id === row.order_id
      ).addDepartments(setup.instance.departments.find(
        d => d.id === row.department_id
      ), options);
    }

    // orders + employees: [M:N]
    for (let row of setup.data.order_employee) {
      await setup.instance.orders.find(
        o => o.id === row.order_id
      ).addEmployees(setup.instance.employees.find(
        e => e.id === row.employee_id
      ), options);
    }

    // quotes + items: [M:N]
    for (let row of setup.data.quote_item) {
      await setup.instance.quotes.find(
        q => q.id === row.quote_id
      ).addItems(setup.instance.items.find(
        i => i.id === row.item_id
      ), options);
    }

    // quote + orders: [1:M]
    for (let quote of setup.instance.quotes) {
      await quote.addOrders(setup.instance.orders.find(
        o => o.quote_id === quote.id
      ), options);
    }
  }
}

setup.buildModels = async function() {
  if (setup.is_mocked) {
    // Build:
    setup.instance.categories = setup.models.Category.build(
      setup.data.category
    );
    setup.instance.companies = setup.models.Company.build(
      setup.data.company
    );
    setup.instance.customers = setup.models.Customer.build(
      setup.data.customer
    );
    setup.instance.employees = setup.models.Employee.build(
      setup.data.employee
    );
    setup.instance.departments = setup.models.Department.build(
      setup.data.department
    );
    setup.instance.items = setup.models.Item.build(
      setup.data.item
    );
    setup.instance.quotes = setup.models.Quote.build(
      setup.data.quote
    );
    setup.instance.roles = setup.models.Role.build(
      setup.data.role
    );
    setup.instance.suppliers = setup.models.Supplier.build(
      setup.data.supplier
    );
    setup.instance.users = setup.models.User.build(
      setup.data.user
    );
    setup.instance.warehouses = setup.models.Warehouse.build(
      setup.data.warehouse
    );
    setup.instance.permissions = setup.models.Permission.build(
      setup.data.permission
    );
    setup.instance.stocks = setup.models.Stock.build(
      setup.data.stock
    );
    setup.instance.orders = setup.models.Order.build(
      setup.data.order
    );

    // Associate:
    await setup.associateModels();
  } else {
    let transaction;
    try {
      transaction = await db.sequelize.transaction();
      const options = { individualHooks: true, transaction };

      // Build:
      setup.instance.categories = await setup.models.Category.bulkCreate(
        setup.data.category,
        options
      );
      setup.instance.companies = await setup.models.Company.bulkCreate(
        setup.data.company,
        options
      );
      setup.instance.departments = await setup.models.Department.bulkCreate(
        setup.data.department,
        options
      );
      setup.instance.employees = await setup.models.Employee.bulkCreate(
        setup.data.employee,
        options
      );
      setup.instance.customers = await setup.models.Customer.bulkCreate(
        setup.data.customer,
        options
      );
      setup.instance.items = await setup.models.Item.bulkCreate(
        setup.data.item,
        options
      );
      setup.instance.permissions = await setup.models.Permission.bulkCreate(
        setup.data.permission,
        options
      );
      setup.instance.quotes = await setup.models.Quote.bulkCreate(
        setup.data.quote,
        options
      );
      setup.instance.roles = await setup.models.Role.bulkCreate(
        setup.data.role,
        options
      );
      setup.instance.stocks = await setup.models.Stock.bulkCreate(
        setup.data.stock,
        options
      );
      setup.instance.suppliers = await setup.models.Supplier.bulkCreate(
        setup.data.supplier,
        options
      );
      setup.instance.users = await setup.models.User.bulkCreate(
        setup.data.user,
        options
      );
      setup.instance.warehouses = await setup.models.Warehouse.bulkCreate(
        setup.data.warehouse,
        options
      );
      setup.instance.orders = await setup.models.Order.bulkCreate(
        setup.data.order,
        options
      );

      // Associate:
      await setup.associateModels(options);
      await transaction.commit();
    } catch (error) {
      console.error(`(setup.buildModels) ${error.name}: ${error.message}`);
      console.error(error)
      await transaction.rollbak();
    }
  }
}

setup.restore = async function() {
  jest.resetModules();
  await setup.restoreMocks();
  await setup.destroyModels();
}

setup.assertOk = function(expect, res, status) {
  expect(res.type).toBe('application/json');
  expect(res.ok).toBe(true);
  expect(res.clientError).toBe(false);
  expect(res.serverError).toBe(false);
  expect(res.status).toBe(status);
  expect(res.body.success).toBe(true);
  expect(res.body.data).toBeDefined();
};

setup.assertError = function(expect, res, status, code) {
  expect(res.type).toBe('application/json');
  expect(res.ok).toBe(false);
  expect(res.serverError).toBe(status >= 500);
  expect(res.status).toBe(status);
  expect(res.body).toBeObject().not.toBeEmpty();
  expect(res.body.success).toBe(false);
  expect(res.body.error).toBeObject().not.toBeEmpty();
  expect(res.body.error.name).toBeDefined();
  expect(res.body.error.message).toBeDefined();
  expect(res.body.error.status).toBe(status);
  if (code) {
    expect(res.body.error.code).toBe(code);
  }
}

setup.beforeAll = setup.restore;

setup.afterAll = async () => { await db.sequelize.close(); };

setup.beforeEach = setup.buildModels;

setup.afterEach = setup.restore;

export default setup;
