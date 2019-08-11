const faker = require("faker");

module.exports = [
  {
    id: faker.random.uuid(),
    code: 'CMP/001',
    name: 'Imprimarcas',
    extra: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    created_by: null,
    updated_by: null,
    deleted_by: null
  }
]
