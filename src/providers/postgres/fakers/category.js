const faker = require("faker");
const data = [];

data.push({
  id: faker.random.uuid(),
  parent_id: null,
  code: 'CAT/001',
  name: 'Art',
  extra: {},
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  deleted_at: null,
  created_by: null,
  updated_by: null,
  deleted_by: null
})

data.push({
  id: faker.random.uuid(),
  parent_id: data[0].id,
  code: 'CAT/002',
  name: 'Design',
  extra: {},
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  deleted_at: null,
  created_by: null,
  updated_by: null,
  deleted_by: null
})

module.exports = data;
