module.exports = database => Object.freeze({
  findAll (options) {
    return database.models.Employee.findAll(
      database.queryBuilder({ is_supervisor: 1, ...options })
    );
  },

  findByPk ({ supervisor_id, options }) {
    return database.models.Employee.findOne(
      database.queryBuilder({
        is_supervisor: 1,
        id: supervisor_id,
        ...options
      })
    );
  },

  getEmployees ({ supervisor, options }) {
    return supervisor.getEmployees(database.queryBuilder(options));
  }
});
