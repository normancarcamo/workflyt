const faker = require('faker');
const bcrypt = require('bcrypt');
const employees = require('./employee.js');

module.exports = [
  {
    id: faker.random.uuid(),
    code: 'USR/001',
    username: 'lberrios',
    employee_id: employees[0].id,
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
    code: 'USR/002',
    username: 'dbric',
    employee_id: employees[1].id,
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
    code: 'USR/003',
    username: 'dvasquez',
    employee_id: employees[3].id,
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
    code: 'USR/004',
    username: 'jvasquez',
    employee_id: employees[2].id,
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
    code: 'USR/005',
    username: 'jbogran',
    employee_id: employees[4].id,
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
    code: 'USR/006',
    username: 'ncarcamo',
    employee_id: null,
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
    code: 'USR/007',
    username: 'tester',
    employee_id: null,
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
