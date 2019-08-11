const faker = require('faker');
const quotes = require('./quote');

module.exports = [
  {
    id: faker.random.uuid(),
    quote_id: quotes[0].id,
    code: 'ORD-19/001',
    type: 'work',
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
    quote_id: quotes[1].id,
    code: 'ORD-19/002',
    type: 'work',
    status: 'awaiting',
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
    quote_id: quotes[2].id,
    code: 'ORD-19/003',
    type: 'work',
    status: 'done',
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
    quote_id: null,
    code: 'ORD-19/003',
    type: 'installation',
    status: 'done',
    extra: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    created_by: null,
    updated_by: null,
    deleted_by: null
  }
];
