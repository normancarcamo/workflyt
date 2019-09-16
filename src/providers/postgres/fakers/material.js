const faker = require('faker');
const categories = require('./category');

module.exports = [
  {
    id: faker.random.uuid(),
    category_id: categories.find(e => e.name === 'clavos').id,
    code: 'MTR/001',
    name: 'Tornillo 3x5 para madera',
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
    category_id: categories.find(e => e.name === 'clavos').id,
    code: 'MTR/002',
    name: 'clavo de acero 1x3',
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
    category_id: categories.find(e => e.name === 'lonas').id,
    code: 'MTR/003',
    name: 'Brocha pequeña',
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
    category_id: categories.find(e => e.name === 'lonas').id,
    code: 'MTR/004',
    name: 'Cinta aislante',
    extra: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    created_by: null,
    updated_by: null,
    deleted_by: null
  }
];
