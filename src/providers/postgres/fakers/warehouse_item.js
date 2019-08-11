const warehouses = require('./warehouse.js');
const items = require('./item.js');

module.exports = [
  {
    warehouse_id: warehouses[0].id,
    item_id: items[0].id,
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
    item_id: items[1].id,
    extra: { units: 11 },
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    deleted_at: null,
    created_by: null,
    updated_by: null,
    deleted_by: null
  }
];
