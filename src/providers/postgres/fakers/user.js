const faker = require('faker');
const bcrypt = require('bcrypt');
const workers = require('./worker.js');

module.exports = [
  {
    id: faker.random.uuid(),
    worker_id: workers[0].id,
    code: 'USR/001',
    username: 'lberrios',
    password: bcrypt.hashSync('Lberrios.2019', 10),
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
    worker_id: workers[1].id,
    code: 'USR/002',
    username: 'dbric',
    password: bcrypt.hashSync('Dbric.2019', 10),
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
    worker_id: workers[3].id,
    code: 'USR/003',
    username: 'dvasquez',
    password: bcrypt.hashSync('DVasquez.2019', 10),
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
    worker_id: workers[2].id,
    code: 'USR/004',
    username: 'jvasquez',
    password: bcrypt.hashSync('JVasquez.2019', 10),
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
    worker_id: workers[4].id,
    code: 'USR/005',
    username: 'jbogran',
    password: bcrypt.hashSync('JBogran.2019', 10),
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
    worker_id: null,
    code: 'USR/006',
    username: 'ncarcamo',
    password: bcrypt.hashSync('NCarcamo.2019', 10),
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
    worker_id: null,
    code: 'USR/007',
    username: 'tester',
    password: bcrypt.hashSync('a0123456789z', 10),
    extra: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    created_by: null,
    updated_by: null,
    deleted_by: null
  }
];
