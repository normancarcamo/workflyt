const areas = require('./area.js');
const workers = require('./worker.js');

module.exports = [
  {
    area_id: areas.find(a => a.name === 'Administración').id,
    worker_id: workers.find(a => a.firstname.includes('Denis')).id,
    extra: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    created_by: null,
    updated_by: null,
    deleted_by: null
  },
  {
    area_id: areas.find(a => a.name === 'Administración').id,
    worker_id: workers.find(a => a.firstname.includes('Javier')).id,
    extra: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    created_by: null,
    updated_by: null,
    deleted_by: null
  },
  {
    area_id: areas.find(a => a.name === 'Arte').id,
    worker_id: workers.find(a => a.firstname.includes('Danilo')).id,
    extra: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    created_by: null,
    updated_by: null,
    deleted_by: null
  },
  {
    area_id: areas.find(a => a.name === 'Arte').id,
    worker_id: workers.find(a => a.lastname.includes('Berrios')).id,
    extra: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    created_by: null,
    updated_by: null,
    deleted_by: null
  },
  {
    area_id: areas.find(a => a.name === 'Ventas').id,
    worker_id: workers.find(a => a.firstname.includes('Jorge')).id,
    extra: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    created_by: null,
    updated_by: null,
    deleted_by: null
  },
  {
    area_id: areas.find(a => a.name === 'Ventas').id,
    worker_id: workers.find(a => a.firstname.includes('Denis')).id,
    extra: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    created_by: null,
    updated_by: null,
    deleted_by: null
  },
  {
    area_id: areas.find(a => a.name === 'Ventas').id,
    worker_id: workers.find(a => a.firstname.includes('Javier')).id,
    extra: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    created_by: null,
    updated_by: null,
    deleted_by: null
  },
  {
    area_id: areas.find(a => a.name === 'Impresión').id,
    worker_id: workers.find(a => a.firstname.includes('Erick')).id,
    extra: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    created_by: null,
    updated_by: null,
    deleted_by: null
  },
  {
    area_id: areas.find(a => a.name === 'Impresión').id,
    worker_id: workers.find(a =>
      a.firstname.includes('Luís') && a.lastname.includes('Lopez')
    ).id,
    extra: {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    created_by: null,
    updated_by: null,
    deleted_by: null
  },
];
