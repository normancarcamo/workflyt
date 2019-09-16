const faker = require('faker');
const areas = require('./area');
const data = [];

data.push({
  id: faker.random.uuid(),
  area_id: areas.find(a => a.name === 'Arte').id,
  code: 'SER/001',
  name: 'Diseño de arte',
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
  area_id: areas.find(a => a.name === 'Impresión').id,
  code: 'SER/002',
  name: 'Impresión de arte',
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
  area_id: areas.find(a => a.name === 'Corte').id,
  code: 'SER/003',
  name: 'Corte de impresión',
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
  area_id: areas.find(a => a.name === 'Producción').id,
  code: 'SER/004',
  name: 'Pegado de stickers',
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
  area_id: areas.find(a => a.name === 'Madera').id,
  code: 'SER/005',
  name: 'Madera',
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
  area_id: areas.find(a => a.name === 'Entregas').id,
  code: 'SER/006',
  name: 'Instalación',
  extra: {},
  created_at: new Date('2018-05-06').toISOString(),
  updated_at: new Date().toISOString(),
  deleted_at: null,
  created_by: null,
  updated_by: null,
  deleted_by: null
});

module.exports = data;
