module.exports = database => Object.freeze({
  findAll (options) {
    return database.models.Company.findAll(
      database.queryBuilder(options)
    );
  },

  create (data) {
    return database.models.Company.create(data);
  },

  findByPk ({ company_id, options }) {
    return database.models.Company.findByPk(
      company_id, database.queryBuilder(options)
    );
  },

  update ({ company_id, data, options }) {
    return database.models.Company.update(data, {
      where: { id: company_id },
      returning: true,
      plain: true,
      ...options
    }).then(result => result[1]);
  },

  destroy ({ company_id, options }) {
    return database.models.Company.destroy({
      where: { id: company_id },
      returning: true,
      plain: true,
      ...options
    });
  }
});
