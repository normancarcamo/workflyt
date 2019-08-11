module.exports = database => Object.freeze({
  findAll (options) {
    return database.models.Warehouse.findAll(
      database.queryBuilder(options)
    );
  },

  create (data) {
    return database.models.Warehouse.create(data);
  },

  findByPk ({ warehouse_id, options }) {
    return database.models.Warehouse.findByPk(
      warehouse_id,
      database.queryBuilder(options)
    );
  },

  update ({ warehouse_id, data, options }) {
    return database.models.Warehouse.update(data, {
      where: { id: warehouse_id },
      returning: true,
      plain: true,
      ...options
    }).then(result => result.pop());
  },

  destroy ({ warehouse_id, options }) {
    return database.models.Warehouse.destroy({
      where: { id: warehouse_id },
      returning: true,
      plain: true,
      ...options
    });
  },

  getItems ({ warehouse, options }) {
    return warehouse.getItems(database.queryBuilder(options));
  },

  addItems ({ warehouse_id, items }) {
    return database.models.WarehouseItem.bulkCreate(
      items.map(item_id => ({
        warehouse_id,
        item_id
      }))
    );
  },

  getItem ({ warehouse, item_id, options }) {
    return warehouse.getItems(
      database.queryBuilder({
        plain: true,
        id: item_id,
        ...options
      })
    );
  },

  updateItem ({ warehouse_id, item_id, data, options }) {
    return database.models.WarehouseItem.update(data, {
      where: { warehouse_id, item_id },
      returning: true,
      plain: true,
      ...options
    }).then(result => result.pop());
  },

  removeItem ({ warehouse_id, item_id, options }) {
    return database.models.WarehouseItem.destroy({
      where: { warehouse_id, item_id },
      returning: true,
      plain: true,
      ...options
    });
  }
});
