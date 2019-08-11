module.exports = database => Object.freeze({
  findAll (options) {
    return database.models.Category.findAll(
      database.queryBuilder(options)
    );
  },

  create (data) {
    return database.models.Category.create(data);
  },

  findByPk ({ category_id, options }) {
    return database.models.Category.findByPk(
      category_id, database.queryBuilder(options)
    );
  },

  update ({ category_id, data, options }) {
    return database.models.Category.update(data, {
      where: { id: category_id },
      returning: true,
      plain: true,
      ...options
    }).then(result => result[1]);
  },

  destroy ({ category_id, options }) {
    return database.models.Category.destroy({
      where: { id: category_id },
      returning: true,
      plain: true,
      ...options
    });
  },

  getItems ({ category_id, options }) {
    return database.models.Item.findAll(database.queryBuilder({
      category_id, ...options
    }));
  },

  addItems ({ category_id, items, options }) {
    return database.models.Item.update({ category_id }, {
      where: {
        id: {
          [database.Sequelize.Op.in]: [ ...items || [] ]
        }
      },
      returning: true,
      ...options
    }).then(result => result[1]);
  },

  getItem ({ category_id, item_id, options }) {
    return database.models.Item.findOne(database.queryBuilder({
      id: item_id,
      category_id,
      ...options
    }));
  },

  removeItem ({ category_id, item_id, options }) {
    return database.models.Item.update(
      { category_id: null },
      {
        where: { id: item_id, category_id },
        returning: true,
        plain: true,
        ...options
      }
    ).then(result => result[1]);
  }
});
