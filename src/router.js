const AuthController = require('./core/auth');
const CategoryController = require('./core/categories');
const CompanyController = require('./core/companies');
const CustomerController = require('./core/customers');
const DepartmentController = require('./core/departments');
const EmployeeController = require('./core/employees');
const ItemController = require('./core/items');
const OrderController = require('./core/orders');
const PermissionController = require('./core/permissions');
const QuoteController = require('./core/quotes');
const RoleController = require('./core/roles');
const StockController = require('./core/stocks');
const SupervisorController = require('./core/supervisors');
const SupplierController = require('./core/suppliers');
const UserController = require('./core/users');
const WarehouseController = require('./core/warehouses');
const middlewares = require('./utils/middlewares');
const express = require('express');

const router = express.Router();

// AUTH:
router
  .route('/auth/signin')
  .post(AuthController.signIn)
  .all(middlewares.onMethodNotAllowed);
router
  .route('/auth/signup')
  .post(AuthController.signUp)
  .all(middlewares.onMethodNotAllowed);

// CATEGORIES:
router
  .route('/categories')
  .get(CategoryController.getCategories)
  .post(CategoryController.createCategories)
  .all(middlewares.onMethodNotAllowed);
router
  .route('/categories/:category')
  .get(CategoryController.getCategory)
  .put(CategoryController.updateCategory)
  .delete(CategoryController.deleteCategory)
  .all(middlewares.onMethodNotAllowed);
router
  .route('/categories/:category/items')
  .get(CategoryController.getItems)
  .post(CategoryController.addItems)
  .all(middlewares.onMethodNotAllowed);
router
  .route('/categories/:category/items/:item')
  .get(CategoryController.getItem)
  .delete(CategoryController.removeItem)
  .all(middlewares.onMethodNotAllowed);

// COMPANIES:
router
  .route('/companies')
  .get(CompanyController.getCompanies)
  .post(CompanyController.createCompanies)
  .all(middlewares.onMethodNotAllowed);
router
  .route('/companies/:company')
  .get(CompanyController.getCompany)
  .put(CompanyController.updateCompany)
  .delete(CompanyController.deleteCompany)
  .all(middlewares.onMethodNotAllowed);

// CUSTOMERS:
router
  .route('/customers')
  .get(CustomerController.getCustomers)
  .post(CustomerController.createCustomers)
  .all(middlewares.onMethodNotAllowed);
router
  .route('/customers/:customer')
  .get(CustomerController.getCustomer)
  .put(CustomerController.updateCustomer)
  .delete(CustomerController.deleteCustomer)
  .all(middlewares.onMethodNotAllowed);
router
  .route('/customers/:customer/quotes')
  .get(CustomerController.getQuotes)
  .post(CustomerController.addQuotes)
  .all(middlewares.onMethodNotAllowed);
router
  .route('/customers/:customer/quotes/:quote')
  .get(CustomerController.getQuote)
  .all(middlewares.onMethodNotAllowed);

// DEPARTMENTS:
router
  .route('/departments')
  .get(DepartmentController.getDepartments)
  .post(DepartmentController.createDepartments)
  .all(middlewares.onMethodNotAllowed);
router
  .route('/departments/:department')
  .get(DepartmentController.getDepartment)
  .put(DepartmentController.updateDepartment)
  .delete(DepartmentController.deleteDepartment)
  .all(middlewares.onMethodNotAllowed);
router
  .route('/departments/:department/employees')
  .get(DepartmentController.getEmployees)
  .post(DepartmentController.addEmployees)
  .all(middlewares.onMethodNotAllowed);
router
  .route('/departments/:department/employees/:employee')
  .get(DepartmentController.getEmployee)
  .put(DepartmentController.updateEmployee)
  .delete(DepartmentController.removeEmployee)
  .all(middlewares.onMethodNotAllowed);

// EMPLOYEES:
router
  .route('/employees')
  .get(EmployeeController.getEmployees)
  .post(EmployeeController.createEmployees)
  .all(middlewares.onMethodNotAllowed);
router
  .route('/employees/:employee')
  .get(EmployeeController.getEmployee)
  .put(EmployeeController.updateEmployee)
  .delete(EmployeeController.deleteEmployee)
  .all(middlewares.onMethodNotAllowed);
router
  .route('/employees/:employee/user')
  .get(EmployeeController.getUser)
  .post(EmployeeController.setUser)
  .delete(EmployeeController.removeUser)
  .all(middlewares.onMethodNotAllowed);
router
  .route('/employees/:employee/quotes')
  .get(EmployeeController.getQuotes)
  .post(EmployeeController.addQuotes)
  .all(middlewares.onMethodNotAllowed);
router
  .route('/employees/:employee/quotes/:quote')
  .get(EmployeeController.getQuote)
  .all(middlewares.onMethodNotAllowed);
router
  .route('/employees/:employee/supervisors')
  .get(EmployeeController.getSupervisors)
  .post(EmployeeController.addSupervisors)
  .all(middlewares.onMethodNotAllowed);
router
  .route('/employees/:employee/supervisors/:supervisor')
  .get(EmployeeController.getSupervisor)
  .put(EmployeeController.updateSupervisor)
  .delete(EmployeeController.removeSupervisor)
  .all(middlewares.onMethodNotAllowed);

// ITEMS:
router
  .route('/items')
  .get(ItemController.getItems)
  .post(ItemController.createItems)
  .all(middlewares.onMethodNotAllowed);
router
  .route('/items/:item')
  .get(ItemController.getItem)
  .put(ItemController.updateItem)
  .delete(ItemController.deleteItem)
  .all(middlewares.onMethodNotAllowed);
router
  .route('/items/:item/stocks')
  .get(ItemController.getStocks)
  .post(ItemController.addStocks)
  .all(middlewares.onMethodNotAllowed);
router
  .route('/items/:item/stocks/:stock')
  .get(ItemController.getStock)
  .all(middlewares.onMethodNotAllowed);

// ORDERS:
router
  .route('/orders')
  .get(OrderController.getOrders)
  .post(OrderController.createOrders)
  .all(middlewares.onMethodNotAllowed);
router
  .route('/orders/:order')
  .get(OrderController.getOrder)
  .put(OrderController.updateOrder)
  .delete(OrderController.deleteOrder)
  .all(middlewares.onMethodNotAllowed);
router
  .route('/orders/:order/items')
  .get(OrderController.getItems)
  .post(OrderController.addItems)
  .all(middlewares.onMethodNotAllowed);
router
  .route('/orders/:order/items/:item')
  .get(OrderController.getItem)
  .put(OrderController.updateItem)
  .delete(OrderController.removeItem)
  .all(middlewares.onMethodNotAllowed);
router
  .route('/orders/:order/departments')
  .get(OrderController.getDepartments)
  .post(OrderController.addDepartments)
  .all(middlewares.onMethodNotAllowed);
router
  .route('/orders/:order/departments/:department')
  .get(OrderController.getDepartment)
  .put(OrderController.updateDepartment)
  .delete(OrderController.removeDepartment)
  .all(middlewares.onMethodNotAllowed);
router
  .route('/orders/:order/employees')
  .get(OrderController.getEmployees)
  .post(OrderController.addEmployees)
  .all(middlewares.onMethodNotAllowed);
router
  .route('/orders/:order/employees/:employee')
  .get(OrderController.getEmployee)
  .put(OrderController.updateEmployee)
  .delete(OrderController.removeEmployee)
  .all(middlewares.onMethodNotAllowed);

// PERMISSIONS:
router
  .route('/permissions')
  .get(PermissionController.getPermissions)
  .post(PermissionController.createPermissions)
  .all(middlewares.onMethodNotAllowed);
router
  .route('/permissions/:permission')
  .get(PermissionController.getPermission)
  .put(PermissionController.updatePermission)
  .delete(PermissionController.deletePermission)
  .all(middlewares.onMethodNotAllowed);

// QUOTES:
router
  .route('/quotes')
  .get(QuoteController.getQuotes)
  .post(QuoteController.createQuotes)
  .all(middlewares.onMethodNotAllowed);
router
  .route('/quotes/:quote')
  .get(QuoteController.getQuote)
  .put(QuoteController.updateQuote)
  .delete(QuoteController.deleteQuote)
  .all(middlewares.onMethodNotAllowed);
router
  .route('/quotes/:quote/items')
  .get(QuoteController.getItems)
  .post(QuoteController.addItems)
  .all(middlewares.onMethodNotAllowed);
router
  .route('/quotes/:quote/items/:item')
  .get(QuoteController.getItem)
  .put(QuoteController.updateItem)
  .delete(QuoteController.removeItem)
  .all(middlewares.onMethodNotAllowed);
router
  .route('/quotes/:quote/orders')
  .get(QuoteController.getOrders)
  .post(QuoteController.addOrders)
  .all(middlewares.onMethodNotAllowed);
router
  .route('/quotes/:quote/orders/:order')
  .get(QuoteController.getOrder)
  .all(middlewares.onMethodNotAllowed);

// ROLES:
router
  .route('/roles')
  .get(RoleController.getRoles)
  .post(RoleController.createRoles)
  .all(middlewares.onMethodNotAllowed);
router
  .route('/roles/:role')
  .get(RoleController.getRole)
  .put(RoleController.updateRole)
  .delete(RoleController.deleteRole)
  .all(middlewares.onMethodNotAllowed);
router
  .route('/roles/:role/permissions')
  .get(RoleController.getPermissions)
  .post(RoleController.addPermissions)
  .all(middlewares.onMethodNotAllowed);
router
  .route('/roles/:role/permissions/:permission')
  .get(RoleController.getPermission)
  .put(RoleController.updatePermission)
  .delete(RoleController.removePermission)
  .all(middlewares.onMethodNotAllowed);

// STOCKS:
router
  .route('/stocks')
  .get(StockController.getStocks)
  .post(StockController.createStocks)
  .all(middlewares.onMethodNotAllowed);
router
  .route('/stocks/:stock')
  .get(StockController.getStock)
  .put(StockController.updateStock)
  .delete(StockController.deleteStock)
  .all(middlewares.onMethodNotAllowed);

// SUPERVISORS:
router
  .route('/supervisors')
  .get(SupervisorController.getSupervisors)
  .all(middlewares.onMethodNotAllowed);
router
  .route('/supervisors/:supervisor')
  .get(SupervisorController.getSupervisor)
  .all(middlewares.onMethodNotAllowed);
router
  .route('/supervisors/:supervisor/employees')
  .get(SupervisorController.getEmployees)
  .all(middlewares.onMethodNotAllowed);

// SUPPLIERS:
router
  .route('/suppliers')
  .get(SupplierController.getSuppliers)
  .post(SupplierController.createSuppliers)
  .all(middlewares.onMethodNotAllowed);
router
  .route('/suppliers/:supplier')
  .get(SupplierController.getSupplier)
  .put(SupplierController.updateSupplier)
  .delete(SupplierController.deleteSupplier)
  .all(middlewares.onMethodNotAllowed);
router
  .route('/suppliers/:supplier/items')
  .get(SupplierController.getItems)
  .post(SupplierController.addItems)
  .all(middlewares.onMethodNotAllowed);
router
  .route('/suppliers/:supplier/items/:item')
  .get(SupplierController.getItem)
  .put(SupplierController.updateItem)
  .delete(SupplierController.removeItem)
  .all(middlewares.onMethodNotAllowed);

// USERS:
router
  .route('/users')
  .get(UserController.getUsers)
  .post(UserController.createUsers)
  .all(middlewares.onMethodNotAllowed);
router
  .route('/users/:user')
  .get(UserController.getUser)
  .put(UserController.updateUser)
  .delete(UserController.deleteUser)
  .all(middlewares.onMethodNotAllowed);
router
  .route('/users/:user/roles')
  .get(UserController.getRoles)
  .post(UserController.addRoles)
  .all(middlewares.onMethodNotAllowed);
router
  .route('/users/:user/roles/:role')
  .get(UserController.getRole)
  .put(UserController.updateRole)
  .delete(UserController.removeRole)
  .all(middlewares.onMethodNotAllowed);

// WAREHOUSES:
router
  .route('/warehouses')
  .get(WarehouseController.getWarehouses)
  .post(WarehouseController.createWarehouses)
  .all(middlewares.onMethodNotAllowed);
router
  .route('/warehouses/:warehouse')
  .get(WarehouseController.getWarehouse)
  .put(WarehouseController.updateWarehouse)
  .delete(WarehouseController.deleteWarehouse)
  .all(middlewares.onMethodNotAllowed);
router
  .route('/warehouses/:warehouse/items')
  .get(WarehouseController.getItems)
  .post(WarehouseController.addItems)
  .all(middlewares.onMethodNotAllowed);
router
  .route('/warehouses/:warehouse/items/:item')
  .get(WarehouseController.getItem)
  .put(WarehouseController.updateItem)
  .delete(WarehouseController.removeItem)
  .all(middlewares.onMethodNotAllowed);

module.exports = router;
