module.exports = database => Object.freeze({
  findAll (options) {
    return database.models.Permission.findAll(
      database.queryBuilder(options)
    );
  },

  create (data) {
    return database.models.Permission.create(data);
  },

  findByPk ({ permission_id, options }) {
    return database.models.Permission.findByPk(
      permission_id,
      database.queryBuilder(options)
    );
  },

  update ({ permission_id, data, options }) {
    return database.models.Permission.update(data, {
      where: { id: permission_id },
      returning: true,
      plain: true,
      ...options
    }).then(result => result.pop());
  },

  destroy ({ permission_id, options }) {
    return database.models.Permission.destroy({
      where: { id: permission_id },
      returning: true,
      plain: true,
      ...options
    });
  }
});
