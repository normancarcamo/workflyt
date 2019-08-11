module.exports = database => Object.freeze({
  findAll (options) {
    return database.models.Order.findAll(
      database.queryBuilder(options)
    );
  },

  create (data) {
    return database.models.Order.create(data);
  },

  findByPk ({ order_id, options }) {
    return database.models.Order.findByPk(
      order_id,
      database.queryBuilder(options)
    );
  },

  update ({ order_id, data, options }) {
    return database.models.Order.update(data, {
      where: { id: order_id },
      returning: true,
      plain: true,
      ...options
    }).then(result => result.pop());
  },

  destroy ({ order_id, options }) {
    return database.models.Order.destroy({
      where: { id: order_id },
      returning: true,
      plain: true,
      ...options
    });
  },

  getItems ({ order, options }) {
    return order.getItems(database.queryBuilder(options));
  },

  addItems ({ order_id, items }) {
    return database.models.OrderItem.bulkCreate(
      items.map(item_id => ({
        order_id,
        item_id
      }))
    );
  },

  getItem ({ order, item_id, options }) {
    return order.getItems({
      plain: true,
      ...database.queryBuilder({
        id: item_id,
        ...options
      })
    });
  },

  updateItem ({ order_id, item_id, data, options }) {
    return database.models.OrderItem.update(data, {
      where: { order_id, item_id },
      returning: true,
      plain: true,
      ...options
    }).then(result => result.pop());
  },

  removeItem ({ order_id, item_id, options }) {
    return database.models.OrderItem.destroy({
      where: { order_id, item_id },
      returning: true,
      plain: true,
      ...options
    });
  },

  getDepartments ({ order, options }) {
    return order.getDepartments(database.queryBuilder(options));
  },

  addDepartments ({ order_id, departments }) {
    return database.models.OrderDepartment.bulkCreate(
      departments.map(department_id => ({
        order_id,
        department_id
      }))
    );
  },

  getDepartment ({ order, department_id, options }) {
    return order.getDepartments({
      plain: true,
      ...database.queryBuilder({
        id: department_id,
        ...options
      })
    });
  },

  updateDepartment ({ order_id, department_id, data, options }) {
    return database.models.OrderDepartment.update(data, {
      where: { order_id, department_id },
      returning: true,
      plain: true,
      ...options
    }).then(result => result.pop());
  },

  removeDepartment ({ order_id, department_id, options }) {
    return database.models.OrderDepartment.destroy({
      where: { order_id, department_id },
      returning: true,
      plain: true,
      ...options
    });
  },

  getEmployees ({ order, options }) {
    return order.getEmployees(database.queryBuilder(options));
  },

  addEmployees ({ order_id, employees }) {
    return database.models.OrderEmployee.bulkCreate(
      employees.map(employee_id => ({
        order_id,
        employee_id
      }))
    );
  },

  getEmployee ({ order, employee_id, options }) {
    return order.getEmployees({
      plain: true,
      ...database.queryBuilder({
        id: employee_id,
        ...options
      })
    });
  },

  updateEmployee ({ order_id, employee_id, data, options }) {
    return database.models.OrderEmployee.update(data, {
      where: { order_id, employee_id },
      returning: true,
      plain: true,
      ...options
    }).then(result => result.pop());
  },

  removeEmployee ({ order_id, employee_id, options }) {
    return database.models.OrderEmployee.destroy({
      where: { order_id, employee_id },
      returning: true,
      plain: true,
      ...options
    });
  }
});
