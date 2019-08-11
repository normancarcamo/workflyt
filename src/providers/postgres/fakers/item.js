const faker = require('faker');
const categories = require('./category');

module.exports = [
  {
    id: faker.random.uuid(),
    category_id: categories.find(e => e.name === 'Design').id,
    code: 'SRV/001',
    name: 'Logo design',
    type: 'service',
    stock: 357,
    price: 698.30,
    extra: {},
    created_at: new Date('2019-01-01').toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    created_by: null,
    updated_by: null,
    deleted_by: null
  },
  {
    id: faker.random.uuid(),
    category_id: categories.find(e => e.name === 'Design').id,
    code: 'SER/002',
    name: 'Sign for traffic 4x24',
    type: 'service',
    stock: 66,
    price: 547.50,
    extra: {},
    created_at: new Date('2019-05-21').toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    created_by: null,
    updated_by: null,
    deleted_by: null
  },
  {
    id: faker.random.uuid(),
    category_id: categories.find(e => e.name === 'Design').id,
    code: 'SER/003',
    name: 'Stickers design',
    type: 'service',
    stock: 0,
    price: 500.43,
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
    category_id: categories.find(e => e.name === 'Design').id,
    code: 'SER/004',
    name: 'Banner design',
    type: 'service',
    stock: 0,
    price: 500.49,
    extra: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    created_by: null,
    updated_by: null,
    deleted_by: null
  }
];
