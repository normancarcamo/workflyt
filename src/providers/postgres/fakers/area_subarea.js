const areas = require('./area.js');
const data = [];

data.push({
  area_id: areas.find(area => area.name === 'Producción').id,
  subarea_id: areas.find(area => area.name === 'Impresión').id,
  extra: {},
  created_at: new Date('2018-05-06').toISOString(),
  updated_at: new Date().toISOString(),
  deleted_at: null,
  created_by: null,
  updated_by: null,
  deleted_by: null
});

data.push({
  area_id: areas.find(area => area.name === 'Impresión').id,
  subarea_id: areas.find(area => area.name === 'Corte').id,
  extra: {},
  created_at: new Date('2018-05-06').toISOString(),
  updated_at: new Date().toISOString(),
  deleted_at: null,
  created_by: null,
  updated_by: null,
  deleted_by: null
});

data.push({
  area_id: areas.find(area => area.name === 'Taller').id,
  subarea_id: areas.find(area => area.name === 'Soldadura').id,
  extra: {},
  created_at: new Date('2018-05-06').toISOString(),
  updated_at: new Date().toISOString(),
  deleted_at: null,
  created_by: null,
  updated_by: null,
  deleted_by: null
});

data.push({
  area_id: areas.find(area => area.name === 'Taller').id,
  subarea_id: areas.find(area => area.name === 'Pintura').id,
  extra: {},
  created_at: new Date('2018-05-06').toISOString(),
  updated_at: new Date().toISOString(),
  deleted_at: null,
  created_by: null,
  updated_by: null,
  deleted_by: null
});

data.push({
  area_id: areas.find(area => area.name === 'Taller').id,
  subarea_id: areas.find(area => area.name === 'Madera').id,
  extra: {},
  created_at: new Date('2018-05-06').toISOString(),
  updated_at: new Date().toISOString(),
  deleted_at: null,
  created_by: null,
  updated_by: null,
  deleted_by: null
});

module.exports = data;
