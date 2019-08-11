module.exports = database => Object.freeze({
  findAll (options) {
    return database.models.Quote.findAll(
      database.queryBuilder(options)
    );
  },

  create (data) {
    return database.models.Quote.create(data);
  },

  findByPk ({ quote_id, options }) {
    return database.models.Quote.findByPk(
      quote_id,
      database.queryBuilder(options)
    );
  },

  update ({ quote_id, data, options }) {
    return database.models.Quote.update(data, {
      where: { id: quote_id },
      returning: true,
      plain: true,
      ...options
    }).then(result => result.pop());
  },

  destroy ({ quote_id, options }) {
    return database.models.Quote.destroy({
      where: { id: quote_id },
      returning: true,
      plain: true,
      ...options
    });
  },

  getItems ({ quote, options }) {
    return quote.getItems(database.queryBuilder(options));
  },

  addItems ({ quote_id, items }) {
    return database.models.QuoteItem.bulkCreate(
      items.map(item_id => ({
        quote_id,
        item_id
      }))
    );
  },

  getItem ({ quote, item_id, options }) {
    return quote.getItems({
      plain: true,
      ...database.queryBuilder({
        id: item_id,
        ...options
      })
    });
  },

  updateItem ({ quote_id, item_id, data, options }) {
    return database.models.QuoteItem.update(data, {
      where: { quote_id, item_id },
      returning: true,
      plain: true,
      ...options
    }).then(result => result.pop());
  },

  removeItem ({ quote_id, item_id, options }) {
    return database.models.QuoteItem.destroy({
      where: { quote_id, item_id },
      returning: true,
      plain: true,
      ...options
    });
  },

  getOrders ({ quote_id, options }) {
    return database.models.Order.findAll(
      database.queryBuilder({ quote_id, ...options })
    );
  },

  addOrders ({ quote_id, orders, options }) {
    return database.models.Order.update({ quote_id }, {
      where: {
        id: {
          [database.Sequelize.Op.in]: [ ...orders ]
        }
      },
      returning: true,
      ...options
    }).then(result => result.pop());
  },

  getOrder ({ quote_id, order_id, options }) {
    return database.models.Order.findOne(
      database.queryBuilder({
        id: order_id,
        quote_id,
        ...options
      })
    );
  }
});
