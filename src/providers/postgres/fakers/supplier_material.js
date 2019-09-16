const suppliers = require('./supplier.js');
const materials = require('./material.js');

module.exports = [
  {
    supplier_id: suppliers[0].id,
    material_id: materials[0].id,
    extra: { units: 423 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    created_by: null,
    updated_by: null,
    deleted_by: null
  },
  {
    supplier_id: suppliers[0].id,
    material_id: materials[1].id,
    extra: { units: 211 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    created_by: null,
    updated_by: null,
    deleted_by: null
  }
];
