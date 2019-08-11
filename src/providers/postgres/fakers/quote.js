const faker = require('faker');
const customers = require('./customer.js');
const employees = require('./employee.js');

module.exports = [
  {
    id: faker.random.uuid(),
    customer_id: customers[0].id,
    salesman_id: employees[2].id,
    subject: 'Stickers for furniture 2x24',
    code: 'QUO-19/001',
    status: 'confirmed',
    extra: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    created_by: null,
    updated_by: null,
    deleted_by: null
  },
  {
    id: faker.random.uuid(),
    customer_id: customers[1].id,
    salesman_id: employees[3].id,
    subject: 'Stickers for frontal doors of the bank',
    code: 'QUO-19/002',
    status: 'cancelled',
    extra: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    created_by: null,
    updated_by: null,
    deleted_by: null
  },
  {
    id: faker.random.uuid(),
    customer_id: customers[2].id,
    salesman_id: employees[4].id,
    subject: 'Banner wall 129.23 x 32',
    code: 'QUO-19/003',
    status: 'open',
    extra: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    created_by: null,
    updated_by: null,
    deleted_by: null
  },
  {
    id: faker.random.uuid(),
    customer_id: customers[2].id,
    salesman_id: employees[4].id,
    subject: 'Banner door 23x3',
    code: 'QUO-19/003',
    status: 'open',
    extra: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    created_by: null,
    updated_by: null,
    deleted_by: null
  }
];
