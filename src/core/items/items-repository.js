module.exports = database => Object.freeze({
  findAll (options) {
    return database.models.Item.findAll(
      database.queryBuilder(options)
    );
  },

  create (data) {
    return database.models.Item.create(data);
  },

  findByPk ({ item_id, options }) {
    return database.models.Item.findByPk(
      item_id, database.queryBuilder(options)
    );
  },

  update ({ item_id, data, options }) {
    return database.models.Item.update(data, {
      where: { id: item_id },
      returning: true,
      plain: true,
      ...options
    }).then(result => result.pop());
  },

  destroy ({ item_id, options }) {
    return database.models.Item.destroy({
      where: { id: item_id },
      returning: true,
      plain: true,
      ...options
    });
  },

  getStocks ({ item_id, options }) {
    return database.models.Stock.findAll(
      database.queryBuilder({
        item_id,
        ...options
      })
    );
  },

  addStocks ({ item_id, stocks, options }) {
    return database.models.Stock.update({ item_id }, {
      where: {
        id: {
          [database.Sequelize.Op.in]: [ ...stocks ]
        }
      },
      returning: true,
      ...options
    }).then(result => result.pop());
  },

  getStock ({ item_id, stock_id, options }) {
    return database.models.Stock.findOne(
      database.queryBuilder({
        id: stock_id,
        item_id,
        ...options
      })
    );
  }
});
