const warehouses = require('./warehouse.js');
const materials = require('./material.js');

module.exports = [
  {
    warehouse_id: warehouses[0].id,
    material_id: materials[0].id,
    extra: { units: 143 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    created_by: null,
    updated_by: null,
    deleted_by: null
  },
  {
    warehouse_id: warehouses[0].id,
    material_id: materials[1].id,
    extra: { units: 11 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    created_by: null,
    updated_by: null,
    deleted_by: null
  }
];
