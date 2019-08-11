const faker = require('faker');

module.exports = [
  // 1. CATEGORIES:
  'get categories',
  'create categories',
  'get category',
  'update category',
  'delete category',
  'get items from category',
  'add items to category',
  'get item from category',
  'remove item from category',

  // 2. COMPANIES:
  'get companies',
  'create companies',
  'get company',
  'update company',
  'delete company',

  // 3. CUSTOMERS:
  'get customers',
  'create customers',
  'get customer',
  'update customer',
  'delete customer',
  'get quotes from customer',
  'add quotes to customer',
  'get quote from customer',

  // 4. DEPARTMENTS:
  'get departments',
  'create departments',
  'get department',
  'update department',
  'delete department',
  'get employees from department',
  'add employees to department',
  'get employee from department',
  'update employee from department',
  'remove employee from department',

  // 5. EMPLOYEES:
  'get employees',
  'create employees',
  'get employee',
  'update employee',
  'delete employee',
  'get user from employee',
  'set user to employee',
  'remove user from employee',
  'get quotes from employee',
  'add quotes to employee',
  'get quote from employee',
  'get supervisors from employee',
  'add supervisors to employee',
  'get supervisor from employee',
  'update supervisor from employee',
  'remove supervisor from employee',

  // 6. ITEMS:
  'get items',
  'create items',
  'get item',
  'update item',
  'delete item',
  'get stocks from item',
  'add stocks to item',
  'get stock from item',

  // 7. ORDERS:
  'get orders',
  'create orders',
  'get order',
  'update order',
  'delete order',
  'get items from order',
  'add items to order',
  'get item from order',
  'update item from order',
  'remove item from order',
  'get departments from order',
  'add departments to order',
  'get department from order',
  'update department from order',
  'remove department from order',
  'get employees from order',
  'add employees to order',
  'get employee from order',
  'update employee from order',
  'remove employee from order',

  // 8. ITEMS:
  'get permissions',
  'create permissions',
  'get permission',
  'update permission',
  'delete permission',

  // 9. QUOTES:
  'get quotes',
  'create quotes',
  'get quote',
  'update quote',
  'delete quote',
  'get items from quote',
  'add items to quote',
  'get item from quote',
  'update item from quote',
  'remove item from quote',
  'get orders from quote',
  'add orders to quote',
  'get order from quote',
  'update order from quote',
  'remove order from quote',

  // 10. ROLES:
  'get roles',
  'create roles',
  'get role',
  'update role',
  'delete role',
  'get permissions from role',
  'add permissions to role',
  'get permission from role',
  'update permission from role',
  'remove permission from role',

  // 11. STOCKS:
  'get stocks',
  'create stocks',
  'get stock',
  'update stock',
  'delete stock',

  // 12. SUPPLIERS:
  'get suppliers',
  'create suppliers',
  'get supplier',
  'update supplier',
  'delete supplier',
  'get items from supplier',
  'add items to supplier',
  'get item from supplier',
  'update item from supplier',
  'remove item from supplier',

  // 13. USERS:
  'get users',
  'create users',
  'get user',
  'update user',
  'delete user',
  'get roles from user',
  'add roles to user',
  'get role from user',
  'update role from user',
  'remove role from user',

  // 14. WAREHOUSES:
  'get warehouses',
  'create warehouses',
  'get warehouse',
  'update warehouse',
  'delete warehouse',
  'get items from warehouse',
  'add items to warehouse',
  'get item from warehouse',
  'update item from warehouse',
  'remove item from warehouse'
].reduce((target, permission, index) => {
  target.push({
    id: faker.random.uuid(),
    code: `PRM/00${index+1}`,
    name: permission,
    extra: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    created_by: null,
    updated_by: null,
    deleted_by: null
  });
  return target;
}, []);
