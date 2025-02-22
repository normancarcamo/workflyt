const faker = require('faker');

module.exports = [
  // AREA:
  'get areas',
  'create areas',
  'get area',
  'update area',
  'delete area',
  'get subareas from area',
  'add subareas to area',
  'get subarea from area',
  'update subarea from area',
  'delete subarea from area',
  'get workers from area',
  'add workers to area',
  'get worker from area',
  'update worker from area',
  'delete worker from area',
  'get services from area',
  'add services to area',
  'get service from area',
  'delete service from area',

  // CATEGORY:
  'get categories',
  'create categories',
  'get category',
  'update category',
  'delete category',
  'get materials from category',
  'add materials to category',
  'get material from category',
  'delete material from category',

  // CLIENT:
  'get clients',
  'create clients',
  'get client',
  'update client',
  'delete client',
  'get quotes from client',
  'add quotes to client',
  'get quote from client',

  // COMPANY:
  'get companies',
  'create companies',
  'get company',
  'update company',
  'delete company',

  // JOB:
  'get jobs',
  'create jobs',
  'get job',
  'update job',
  'delete job',
  'get materials from job',
  'add materials to job',
  'get material from job',
  'update material from job',
  'delete material from job',
  'get subjobs from job',
  'add subjobs to job',
  'get subjob from job',
  'update subjob from job',
  'delete subjob from job',
  'get workers from job',
  'add workers to job',
  'get worker from job',
  'update worker from job',
  'delete worker from job',

  // MATERIAL:
  'get materials',
  'create materials',
  'get material',
  'update material',
  'delete material',
  'get stocks from material',
  'add stocks to material',
  'get stock from material',

  // ORDER:
  'get orders',
  'create orders',
  'get order',
  'update order',
  'delete order',
  'get jobs from order',
  'add jobs to order',
  'get job from order',
  'update job from order',
  'delete job from order',

  // PERMISSION:
  'get permissions',
  'create permissions',
  'get permission',
  'update permission',
  'delete permission',

  // QUOTE:
  'get quotes',
  'create quotes',
  'get quote',
  'update quote',
  'delete quote',
  'get orders from quote',
  'add orders to quote',
  'get order from quote',
  'update order from quote',
  'delete order from quote',
  'get services from quote',
  'add services to quote',
  'get service from quote',
  'update service from quote',
  'delete service from quote',

  // ROLE:
  'get roles',
  'create roles',
  'get role',
  'update role',
  'delete role',
  'get permissions from role',
  'add permissions to role',
  'get permission from role',
  'update permission from role',
  'delete permission from role',

  // SERVICE:
  'get services',
  'create services',
  'get service',
  'update service',
  'delete service',

  // STOCK:
  'get stocks',
  'create stocks',
  'get stock',
  'update stock',
  'delete stock',

  // SUPPLIER:
  'get suppliers',
  'create suppliers',
  'get supplier',
  'update supplier',
  'delete supplier',
  'get materials from supplier',
  'add materials to supplier',
  'get material from supplier',
  'update material from supplier',
  'delete material from supplier',

  // USER:
  'get users',
  'create users',
  'get user',
  'update user',
  'delete user',
  'get roles from user',
  'add roles to user',
  'get role from user',
  'update role from user',
  'delete role from user',

  // WAREHOUSE:
  'get warehouses',
  'create warehouses',
  'get warehouse',
  'update warehouse',
  'delete warehouse',
  'get materials from warehouse',
  'add materials to warehouse',
  'get material from warehouse',
  'update material from warehouse',
  'delete material from warehouse',

  // WORKER:
  'get workers',
  'create workers',
  'get worker',
  'update worker',
  'delete worker',
  'get user from worker',
  'set user to worker',
  'delete user from worker',
  'get quotes from worker',
  'add quotes to worker',
  'get quote from worker',
  'get supervisors from worker',
  'add supervisors to worker',
  'get supervisor from worker',
  'update supervisor from worker',
  'delete supervisor from worker',
  'get jobs from worker',
  'add jobs to worker',
  'get job from worker',
  'update job from worker',
  'delete job from worker',
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
