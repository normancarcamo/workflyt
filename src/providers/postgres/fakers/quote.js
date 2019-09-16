const faker = require('faker');
const clients = require('./client.js');
const workers = require('./worker.js');

module.exports = [
  {
    id: faker.random.uuid(),
    client_id: clients[0].id,
    salesman_id: workers[2].id,
    code: 'QUO-19/001',
    subject: 'Stickers for furniture 2x24',
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
    client_id: clients[1].id,
    salesman_id: workers[3].id,
    code: 'QUO-19/002',
    subject: 'Stickers for frontal doors of the bank',
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
    client_id: clients[2].id,
    salesman_id: workers[4].id,
    code: 'QUO-19/003',
    subject: 'Banner wall 129.23 x 32',
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
    client_id: clients[2].id,
    salesman_id: workers[4].id,
    code: 'QUO-19/004',
    subject: 'Banner door 23x3',
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
