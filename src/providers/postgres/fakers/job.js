const faker = require('faker');
const services = require('./service');
const orders = require('./order');
const data = [];

data.push({
  id: faker.random.uuid(),
  service_id: services.find(s => s.name.includes('Diseño de arte')).id,
  order_id: orders.find(s => s.code === 'ORD-19/001').id,
  code: 'JOB/001',
  details: faker.lorem.words(),
  status: 'working',
  priority: 'medium',
  progress: Math.ceil(Math.random() * 90) / 2,
  units: Math.ceil(Math.random() * 10),
  extra: {},
  created_at: new Date('2018-05-06').toISOString(),
  updated_at: new Date().toISOString(),
  deleted_at: null,
  created_by: null,
  updated_by: null,
  deleted_by: null
});

data.push({
  id: faker.random.uuid(),
  service_id: services.find(s => s.name.includes('Impresión de arte')).id,
  order_id: orders.find(s => s.code === 'ORD-19/002').id,
  code: 'JOB/002',
  details: faker.lorem.words(),
  status: 'working',
  priority: 'medium',
  progress: Math.ceil(Math.random() * 90) / 2,
  units: Math.ceil(Math.random() * 10),
  extra: {},
  created_at: new Date('2018-05-21').toISOString(),
  updated_at: new Date().toISOString(),
  deleted_at: null,
  created_by: null,
  updated_by: null,
  deleted_by: null
});

data.push({
  id: faker.random.uuid(),
  service_id: services.find(s => s.name.includes('Instalación')).id,
  order_id: orders.find(s => s.code === 'ORD-19/002').id,
  code: 'JOB/003',
  details: 'demo',
  status: 'working',
  priority: 'high',
  progress: Math.ceil(Math.random() * 90) / 2,
  units: Math.ceil(Math.random() * 10),
  extra: {},
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  deleted_at: null,
  created_by: null,
  updated_by: null,
  deleted_by: null
});

data.push({
  id: faker.random.uuid(),
  service_id: services.find(s => s.name.includes('Corte de impresión')).id,
  order_id: orders.find(s => s.code === 'ORD-19/002').id,
  code: 'JOB/004',
  details: faker.lorem.words(),
  status: 'working',
  priority: 'low',
  progress: Math.ceil(Math.random() * 90) / 2,
  units: Math.ceil(Math.random() * 10),
  extra: {},
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  deleted_at: null,
  created_by: null,
  updated_by: null,
  deleted_by: null
});

data.push({
  id: faker.random.uuid(),
  service_id: services.find(s => s.name.includes('Pegado de stickers')).id,
  order_id: orders.find(s => s.code === 'ORD-19/002').id,
  code: 'JOB/005',
  details: faker.lorem.words(),
  status: 'awaiting',
  priority: 'low',
  progress: Math.ceil(Math.random() * 90) / 2,
  units: Math.ceil(Math.random() * 10),
  extra: {},
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  deleted_at: null,
  created_by: null,
  updated_by: null,
  deleted_by: null
});

module.exports = data;
