module.exports = database => Object.freeze({
  findAll (options) {
    return database.models.Department.findAll(database.queryBuilder(options));
  },

  create (data) {
    return database.models.Department.create(data);
  },

  findByPk ({ department_id, options }) {
    return database.models.Department.findByPk(
      department_id, database.queryBuilder(options)
    );
  },

  update ({ department_id, data, options }) {
    return database.models.Department.update(data, {
      where: { id: department_id },
      returning: true,
      plain: true,
      ...options
    }).then(result => result[1]);
  },

  destroy ({ department_id, options }) {
    return database.models.Department.destroy({
      where: { id: department_id },
      returning: true,
      plain: true,
      ...options
    });
  },

  getEmployees ({ department, options }) {
    return department.getEmployees(database.queryBuilder(options));
  },

  addEmployees ({ department_id, employees }) {
    return database.models.DepartmentEmployee.bulkCreate(
      employees.map(employee_id => ({
        department_id,
        employee_id
      }))
    );
  },

  getEmployee ({ department, employee_id, options }) {
    return department.getEmployees({
      plain: true,
      ...database.queryBuilder({
        id: employee_id,
        ...options
      })
    });
  },

  updateEmployee ({ department_id, employee_id, data, options }) {
    return database.models.DepartmentEmployee.update(data, {
      where: { department_id, employee_id },
      returning: true,
      plain: true,
      ...options
    }).then(result => result[1]);
  },

  removeEmployee ({ department_id, employee_id, options }) {
    return database.models.DepartmentEmployee.destroy({
      where: { department_id, employee_id },
      returning: true,
      plain: true,
      ...options
    });
  }
});
