const faker = require('faker');
const quotes = require('./quote');

module.exports = [
  {
    id: faker.random.uuid(),
    quote_id: quotes[0].id,
    code: 'ORD-19/001',
    subject: faker.lorem.words(),
    status: 'cancelled',
    priority: 'medium',
    progress: Math.ceil(Math.random() * 90) / 2,
    extra: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: null,
    updated_by: null,
    deleted_by: null
  },
  {
    id: faker.random.uuid(),
    quote_id: quotes[1].id,
    code: 'ORD-19/002',
    subject: faker.lorem.words(),
    status: 'working',
    priority: 'low',
    progress: Math.ceil(Math.random() * 90) / 2,
    extra: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: null,
    updated_by: null,
    deleted_by: null
  },
  {
    id: faker.random.uuid(),
    quote_id: quotes[2].id,
    code: 'ORD-19/003',
    subject: faker.lorem.words(),
    status: 'done',
    priority: 'high',
    progress: Math.ceil(Math.random() * 90) / 2,
    extra: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: null,
    updated_by: null,
    deleted_by: null
  },
  {
    id: faker.random.uuid(),
    quote_id: null,
    code: 'ORD-19/004',
    subject: faker.lorem.words(),
    status: 'done',
    priority: 'low',
    progress: Math.ceil(Math.random() * 90) / 2,
    extra: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    created_by: null,
    updated_by: null,
    deleted_by: null
  }
];
