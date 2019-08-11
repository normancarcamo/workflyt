module.exports = database => Object.freeze({
  findAll (options) {
    return database.models.Customer.findAll(
      database.queryBuilder(options)
    );
  },

  create (data) {
    return database.models.Customer.create(data);
  },

  findByPk ({ customer_id, options }) {
    return database.models.Customer.findByPk(
      customer_id, database.queryBuilder(options)
    );
  },

  update ({ customer_id, data, options }) {
    return database.models.Customer.update(data, {
      where: { id: customer_id },
      returning: true,
      plain: true,
      ...options
    }).then(result => result[1]);
  },

  destroy ({ customer_id, options }) {
    return database.models.Customer.destroy({
      where: { id: customer_id },
      returning: true,
      plain: true,
      ...options
    });
  },

  getQuotes ({ customer_id, options }) {
    return database.models.Quote.findAll(database.queryBuilder({
      customer_id,
      ...options
    }));
  },

  addQuotes ({ customer_id, quotes, options }) {
    return database.models.Quote.update({ customer_id }, {
      where: {
        id: {
          [database.Sequelize.Op.in]: [ ...quotes ]
        }
      },
      returning: true,
      ...options
    }).then(result => result[1]);
  },

  getQuote ({ customer_id, quote_id, options }) {
    return database.models.Quote.findOne(database.queryBuilder({
      id: quote_id,
      customer_id,
      ...options
    }));
  }
});
