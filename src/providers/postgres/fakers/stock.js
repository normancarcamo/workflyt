const faker = require('faker');
const items = require('./item');

module.exports = [
  {
    id: faker.random.uuid(),
    item_id: items.find(i => i.name.includes('design')).id,
    entries: 5000,
    exits: 4900,
    stock: 100,
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
    item_id: items.find(i => i.name.includes('traffic')).id,
    entries: 4000,
    exits: 3950,
    stock: 50,
    extra: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    created_by: null,
    updated_by: null,
    deleted_by: null
  }
];
