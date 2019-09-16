const faker = require('faker');
const materials = require('./material');

module.exports = [
  {
    id: faker.random.uuid(),
    material_id: materials.find(i => i.code.includes('MTR/001')).id,
    entries: 5000,
    exits: 4900,
    stocks: 100,
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
    material_id: materials.find(i => i.code.includes('MTR/002')).id,
    entries: 4000,
    exits: 3950,
    stocks: 50,
    extra: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    created_by: null,
    updated_by: null,
    deleted_by: null
  }
];
