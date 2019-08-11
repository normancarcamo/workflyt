module.exports = database => Object.freeze({
  findAll (options) {
    return database.models.Employee.findAll(database.queryBuilder(options));
  },

  create (data) {
    return database.models.Employee.create(data);
  },

  findByPk ({ employee_id, options }) {
    return database.models.Employee.findByPk(
      employee_id, database.queryBuilder(options)
    );
  },

  update ({ employee_id, data, options }) {
    return database.models.Employee.update(data, {
      where: { id: employee_id },
      returning: true,
      plain: true,
      ...options
    }).then(result => result.pop());
  },

  destroy ({ employee_id, options }) {
    return database.models.Employee.destroy({
      where: { id: employee_id },
      returning: true,
      plain: true,
      ...options
    });
  },

  getUser ({ employee_id, user_id, options }) {
    return database.models.User.findOne(
      database.queryBuilder({
        employee_id,
        ... user_id ? { id: user_id } : {},
        ...options
      })
    );
  },

  setUser ({ employee_id, user_id, options, user }) {
    return database.models.User.update({ employee_id }, {
      where: { id: user_id },
      returning: true,
      plain: true,
      ...options
    }).then(result => result.pop());
  },

  removeUser ({ employee_id, options }) {
    return database.models.User.update({ employee_id: null }, {
      where: { employee_id },
      returning: true,
      plain: true,
      ...options
    }).then(result => result.pop());
  },

  getQuotes ({ salesman_id, options }) {
    return database.models.Quote.findAll(
      database.queryBuilder({
        salesman_id,
        ...options
      })
    );
  },

  addQuotes ({ salesman_id, quotes, options }) {
    return database.models.Quote.update({ salesman_id }, {
      where: {
        id: {
          [database.Sequelize.Op.in]: [ ...quotes ]
        }
      },
      returning: true,
      ...options
    }).then(result => result.pop());
  },

  getQuote ({ salesman_id, quote_id, options }) {
    return database.models.Quote.findOne(
      database.queryBuilder({
        id: quote_id,
        salesman_id,
        ...options
      })
    );
  },

  getSupervisors ({ employee, options }) {
    return employee.getSupervisors(database.queryBuilder(options));
  },

  addSupervisors ({ employee_id, supervisors }) {
    return database.models.EmployeeSupervisor.bulkCreate(
      supervisors.map(supervisor_id => ({
        employee_id,
        supervisor_id
      }))
    );
  },

  getSupervisor ({ employee, supervisor_id, options }) {
    return employee.getSupervisors(database.queryBuilder({
      id: supervisor_id,
      plain: true,
      ...options
    }));
  },

  updateSupervisor ({ employee_id, supervisor_id, data, options }) {
    return database.models.EmployeeSupervisor.update(data, {
      where: { employee_id, supervisor_id },
      returning: true,
      plain: true,
      ...options
    }).then(result => result.pop());
  },

  removeSupervisor ({ employee_id, supervisor_id, options }) {
    return database.models.EmployeeSupervisor.destroy({
      where: { employee_id, supervisor_id },
      returning: true,
      plain: true,
      ...options
    });
  }
});
