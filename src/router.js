import { methodNotAllowed } from '@playscode/fns/lib/middlewares';
import { Router } from "express";

import * as CategoryService from "src/services/Category";
import * as CompanyService from "src/services/Company";
import * as CustomerService from "src/services/Customer";
import * as DepartmentService from "src/services/Department";
import * as WarehouseService from "src/services/Warehouse";
import * as SupplierService from "src/services/Supplier";
import * as ItemService from "src/services/Item";
import * as EmployeeService from "src/services/Employee";
import * as UserService from "src/services/User";
import * as RoleService from "src/services/Role";
import * as PermissionService from "src/services/Permission";
import * as StockService from "src/services/Stock";
import * as OrderService from "src/services/Order";
import * as QuoteService from "src/services/Quote";
// import * as AuthService from 'src/services/auth';

const router = Router();

// AUTH:
// router
//   .route("/auth/signup")
//   .post(AuthService.signUp)
//   .all(methodNotAllowed);
// router
//   .route("/auth/signin")
//   .post(AuthService.signIn)
//   .all(methodNotAllowed);

// CATEGORIES:
router
  .route('/categories')
  .get(CategoryService.getCategories)
  .post(CategoryService.createCategories)
  .all(methodNotAllowed);
router
  .route('/categories/:category')
  .get(CategoryService.getCategory)
  .put(CategoryService.updateCategory)
  .delete(CategoryService.deleteCategory)
  .all(methodNotAllowed);
router
  .route('/categories/:category/items')
  .get(CategoryService.getItems)
  .post(CategoryService.setItems)
  .all(methodNotAllowed);
router
  .route('/categories/:category/items/:item')
  .get(CategoryService.getItem)
  .delete(CategoryService.removeItem)
  .all(methodNotAllowed);

// COMPANIES:
router
  .route('/companies')
  .get(CompanyService.getCompanies)
  .post(CompanyService.createCompanies)
  .all(methodNotAllowed);
router
  .route('/companies/:company')
  .get(CompanyService.getCompany)
  .put(CompanyService.updateCompany)
  .delete(CompanyService.deleteCompany)
  .all(methodNotAllowed);

// CUSTOMERS:
router
  .route('/customers')
  .get(CustomerService.getCustomers)
  .post(CustomerService.createCustomers)
  .all(methodNotAllowed);
router
  .route('/customers/:customer')
  .get(CustomerService.getCustomer)
  .put(CustomerService.updateCustomer)
  .delete(CustomerService.deleteCustomer)
  .all(methodNotAllowed);
router
  .route('/customers/:customer/quotes')
  .get(CustomerService.getQuotes)
  .post(CustomerService.setQuotes)
  .all(methodNotAllowed);
router
  .route('/customers/:customer/quotes/:quote')
  .get(CustomerService.getQuote)
  .all(methodNotAllowed);

// DEPARTMENTS:
router
  .route('/departments')
  .get(DepartmentService.getDepartments)
  .post(DepartmentService.createDepartments)
  .all(methodNotAllowed);
router
  .route('/departments/:department')
  .get(DepartmentService.getDepartment)
  .put(DepartmentService.updateDepartment)
  .delete(DepartmentService.deleteDepartment)
  .all(methodNotAllowed);
router
  .route('/departments/:department/employees')
  .get(DepartmentService.getEmployees)
  .post(DepartmentService.setEmployees)
  .all(methodNotAllowed);
router
  .route('/departments/:department/employees/:employee')
  .get(DepartmentService.getEmployee)
  .all(methodNotAllowed);

// EMPLOYEES:
router
  .route('/employees')
  .get(EmployeeService.getEmployees)
  .post(EmployeeService.createEmployees)
  .all(methodNotAllowed);
router
  .route('/employees/:employee')
  .get(EmployeeService.getEmployee)
  .put(EmployeeService.updateEmployee)
  .delete(EmployeeService.deleteEmployee)
  .all(methodNotAllowed);
router
  .route('/employees/:employee/user')
  .get(EmployeeService.getUser)
  .post(EmployeeService.setUser)
  .delete(EmployeeService.removeUser)
  .all(methodNotAllowed);
router
  .route('/employees/:employee/quotes')
  .get(EmployeeService.getQuotes)
  .post(EmployeeService.setQuotes)
  .all(methodNotAllowed);
router
  .route('/employees/:employee/quotes/:quote')
  .get(EmployeeService.getQuote)
  .all(methodNotAllowed);

// ITEMS:
router
  .route('/items')
  .get(ItemService.getItems)
  .post(ItemService.createItems)
  .all(methodNotAllowed);
router
  .route('/items/:item')
  .get(ItemService.getItem)
  .put(ItemService.updateItem)
  .delete(ItemService.deleteItem)
  .all(methodNotAllowed);
router
  .route('/items/:item/stocks')
  .get(ItemService.getStocks)
  .post(ItemService.setStocks)
  .all(methodNotAllowed);
router
  .route('/items/:item/stocks/:stock')
  .get(ItemService.getStock)
  .all(methodNotAllowed);

// ORDERS:
router
  .route('/orders')
  .get(OrderService.getOrders)
  .post(OrderService.createOrders)
  .all(methodNotAllowed);
router
  .route('/orders/:order')
  .get(OrderService.getOrder)
  .put(OrderService.updateOrder)
  .delete(OrderService.deleteOrder)
  .all(methodNotAllowed);
router
  .route('/orders/:order/items')
  .get(OrderService.getItems)
  .post(OrderService.setItems)
  .all(methodNotAllowed);
router
  .route('/orders/:order/items/:item')
  .get(OrderService.getItem)
  .put(OrderService.updateItem)
  .delete(OrderService.removeItem)
  .all(methodNotAllowed);
router
  .route('/orders/:order/departments')
  .get(OrderService.getDepartments)
  .post(OrderService.setDepartments)
  .all(methodNotAllowed);
router
  .route('/orders/:order/departments/:department')
  .get(OrderService.getDepartment)
  .put(OrderService.updateDepartment)
  .delete(OrderService.removeDepartment)
  .all(methodNotAllowed);
router
  .route('/orders/:order/employees')
  .get(OrderService.getEmployees)
  .post(OrderService.setEmployees)
  .all(methodNotAllowed);
router
  .route('/orders/:order/employees/:employee')
  .get(OrderService.getEmployee)
  .put(OrderService.updateEmployee)
  .delete(OrderService.removeEmployee)
  .all(methodNotAllowed);

// PERMISSIONS:
router
  .route('/permissions')
  .get(PermissionService.getPermissions)
  .post(PermissionService.createPermissions)
  .all(methodNotAllowed);
router
  .route('/permissions/:permission')
  .get(PermissionService.getPermission)
  .put(PermissionService.updatePermission)
  .delete(PermissionService.deletePermission)
  .all(methodNotAllowed);

// QUOTES
router
  .route('/quotes')
  .get(QuoteService.getQuotes)
  .post(QuoteService.createQuotes)
  .all(methodNotAllowed);
router
  .route('/quotes/:quote')
  .get(QuoteService.getQuote)
  .put(QuoteService.updateQuote)
  .delete(QuoteService.deleteQuote)
  .all(methodNotAllowed);
router
  .route('/quotes/:quote/items')
  .get(QuoteService.getItems)
  .post(QuoteService.setItems)
  .all(methodNotAllowed);
router
  .route('/quotes/:quote/items/:item')
  .get(QuoteService.getItem)
  .put(QuoteService.updateItem)
  .delete(QuoteService.removeItem)
  .all(methodNotAllowed);
router
  .route('/quotes/:quote/orders')
  .get(QuoteService.getOrders)
  .post(QuoteService.setOrders)
  .all(methodNotAllowed);
router
  .route('/quotes/:quote/orders/:order')
  .get(QuoteService.getOrder)
  .all(methodNotAllowed);

// ROLES:
router
  .route('/roles')
  .get(RoleService.getRoles)
  .post(RoleService.createRoles)
  .all(methodNotAllowed);
router
  .route('/roles/:role')
  .get(RoleService.getRole)
  .put(RoleService.updateRole)
  .delete(RoleService.deleteRole)
  .all(methodNotAllowed);
router
  .route('/roles/:role/permissions')
  .get(RoleService.getPermissions)
  .post(RoleService.setPermissions)
  .all(methodNotAllowed);
router
  .route('/roles/:role/permissions/:permission')
  .get(RoleService.getPermission)
  .put(RoleService.updatePermission)
  .delete(RoleService.removePermission)
  .all(methodNotAllowed);

// STOCKS:
router
  .route('/stocks')
  .get(StockService.getStocks)
  .post(StockService.createStocks)
  .all(methodNotAllowed);
router
  .route('/stocks/:stock')
  .get(StockService.getStock)
  .put(StockService.updateStock)
  .delete(StockService.deleteStock)
  .all(methodNotAllowed);

// SUPPLIERS:
router
  .route('/suppliers')
  .get(SupplierService.getSuppliers)
  .post(SupplierService.createSuppliers)
  .all(methodNotAllowed);
router
  .route('/suppliers/:supplier')
  .get(SupplierService.getSupplier)
  .put(SupplierService.updateSupplier)
  .delete(SupplierService.deleteSupplier)
  .all(methodNotAllowed);
router
  .route('/suppliers/:supplier/items')
  .get(SupplierService.getItems)
  .post(SupplierService.setItems)
  .all(methodNotAllowed);
router
  .route('/suppliers/:supplier/items/:item')
  .get(SupplierService.getItem)
  .put(SupplierService.updateItem)
  .delete(SupplierService.removeItem)
  .all(methodNotAllowed);

// USERS:
router
  .route('/users')
  .get(UserService.getUsers)
  .post(UserService.createUsers)
  .all(methodNotAllowed);
router
  .route('/users/:user')
  .get(UserService.getUser)
  .put(UserService.updateUser)
  .delete(UserService.deleteUser)
  .all(methodNotAllowed);
router
  .route('/users/:user/roles')
  .get(UserService.getRoles)
  .post(UserService.setRoles)
  .all(methodNotAllowed);
router
  .route('/users/:user/roles/:role')
  .get(UserService.getRole)
  .put(UserService.updateRole)
  .delete(UserService.removeRole)
  .all(methodNotAllowed);

// WAREHOUSES:
router
  .route('/warehouses')
  .get(WarehouseService.getWarehouses)
  .post(WarehouseService.createWarehouses)
  .all(methodNotAllowed);
router
  .route('/warehouses/:warehouse')
  .get(WarehouseService.getWarehouse)
  .put(WarehouseService.updateWarehouse)
  .delete(WarehouseService.deleteWarehouse)
  .all(methodNotAllowed);
router
  .route('/warehouses/:warehouse/items')
  .get(WarehouseService.getItems)
  .post(WarehouseService.setItems)
  .all(methodNotAllowed);
router
  .route('/warehouses/:warehouse/items/:item')
  .get(WarehouseService.getItem)
  .put(WarehouseService.updateItem)
  .delete(WarehouseService.removeItem)
  .all(methodNotAllowed);

export default router;
