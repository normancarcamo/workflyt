const suppliers = require('./supplier.js');
const items = require('./item.js');

module.exports = [
  {
    supplier_id: suppliers[0].id,
    item_id: items[0].id,
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
    item_id: items[1].id,
    extra: { units: 211 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    created_by: null,
    updated_by: null,
    deleted_by: null
  }
];
