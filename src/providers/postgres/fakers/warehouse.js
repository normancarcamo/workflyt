const faker = require('faker');

module.exports = [
  {
    id: faker.random.uuid(),
    code: 'WRH/001',
    name: 'El Prado',
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
    code: 'WRH/002',
    name: 'Villa Vieja',
    extra: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    created_by: null,
    updated_by: null,
    deleted_by: null
  }
];
