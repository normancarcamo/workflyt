module.exports = database => Object.freeze({
  findAll (options) {
    return database.models.Supplier.findAll(
      database.queryBuilder(options)
    );
  },

  create (data) {
    return database.models.Supplier.create(data);
  },

  findByPk ({ supplier_id, options }) {
    return database.models.Supplier.findByPk(
      supplier_id,
      database.queryBuilder(options)
    );
  },

  update ({ supplier_id, data, options }) {
    return database.models.Supplier.update(data, {
      where: { id: supplier_id },
      returning: true,
      plain: true,
      ...options
    }).then(result => result.pop());
  },

  destroy ({ supplier_id, options }) {
    return database.models.Supplier.destroy({
      where: { id: supplier_id },
      returning: true,
      plain: true,
      ...options
    });
  },

  getItems ({ supplier, options }) {
    return supplier.getItems(database.queryBuilder(options));
  },

  addItems ({ supplier_id, items }) {
    return database.models.SupplierItem.bulkCreate(
      items.map(item_id => ({
        supplier_id,
        item_id
      }))
    );
  },

  getItem ({ supplier, item_id, options }) {
    return supplier.getItems(
      database.queryBuilder({
        plain: true,
        id: item_id,
        ...options
      })
    );
  },

  updateItem ({ supplier_id, item_id, data, options }) {
    return database.models.SupplierItem.update(data, {
      where: { supplier_id, item_id },
      returning: true,
      plain: true,
      ...options
    }).then(result => result.pop());
  },

  removeItem ({ supplier_id, item_id, options }) {
    return database.models.SupplierItem.destroy({
      where: { supplier_id, item_id },
      returning: true,
      plain: true,
      ...options
    });
  }
});
