module.exports = database => Object.freeze({
  findAll (options) {
    return database.models.Stock.findAll(
      database.queryBuilder(options)
    );
  },

  create (data) {
    return database.models.Stock.create(data);
  },

  findByPk ({ stock_id, options }) {
    return database.models.Stock.findByPk(
      stock_id,
      database.queryBuilder(options)
    );
  },

  update ({ stock_id, data, options }) {
    return database.models.Stock.update(data, {
      where: { id: stock_id },
      returning: true,
      plain: true,
      ...options
    }).then(result => result.pop());
  },

  destroy ({ stock_id, options }) {
    return database.models.Stock.destroy({
      where: { id: stock_id },
      returning: true,
      plain: true,
      ...options
    });
  }
});
