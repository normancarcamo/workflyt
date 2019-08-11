module.exports = ({ repository, validator }) => Object.freeze({
  async getOrders (request) {
    if (!request.token.permissions.includes('get orders')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C08H01-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.getOrders.validate({ query: request.query });
    } catch (error) {
      error.status = 400;
      error.code = 'C08H01-01';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.findAll(data.query);
    } catch (error) {
      error.status = 500;
      error.code = 'C08H01-02';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async createOrders (request) {
    if (!request.token.permissions.includes('create orders')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C08H02-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.createOrders.validate({ body: request.body });
    } catch (error) {
      error.status = 400;
      error.code = 'C08H02-01';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.create(data.body);
    } catch (error) {
      error.status = 500;
      error.code = 'C08H02-02';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async getOrder (request) {
    if (!request.token.permissions.includes('get order')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C08H03-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.getOrder.validate({
        params: request.params,
        query: request.query
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C08H03-01';
      return { success: false, error: error };
    }

    let order = null;

    try {
      order = await repository.findByPk({
        order_id: data.params.order,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C08H03-02';
      return { success: false, error: error };
    }

    if (!order) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C08H03-03';
      return { success: false, error: error };
    }

    return { success: true, data: order };
  },

  async updateOrder (request) {
    if (!request.token.permissions.includes('update order')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C08H04-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.updateOrder.validate({
        params: request.params,
        query: request.query,
        body: request.body,
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C08H04-01';
      return { success: false, error: error };
    }

    let order = null;

    try {
      order = await repository.findByPk({ order_id: data.params.order });
    } catch (error) {
      error.status = 500;
      error.code = 'C08H04-02';
      return { success: false, error: error };
    }

    if (!order) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C08H04-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.update({
        order_id: data.params.order,
        data: data.body,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C08H04-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async deleteOrder (request) {
    if (!request.token.permissions.includes('delete order')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C08H05-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.deleteOrder.validate({
        params: request.params,
        query: request.query
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C08H05-01';
      return { success: false, error: error };
    }

    let order = null;

    try {
      order = await repository.findByPk({ order_id: data.params.order });
    } catch (error) {
      error.status = 500;
      error.code = 'C08H05-02';
      return { success: false, error: error };
    }

    if (!order) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C08H05-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.destroy({
        order_id: data.params.order,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C08H05-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async getItems (request) {
    if (!request.token.permissions.includes('get items from order')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C08H06-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.getItems.validate({
        params: request.params,
        query: request.query
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C08H06-01';
      return { success: false, error: error };
    }

    let order = null;

    try {
      order = await repository.findByPk({ order_id: data.params.order });
    } catch (error) {
      error.status = 500;
      error.code = 'C08H06-02';
      return { success: false, error: error };
    }

    if (!order) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C08H06-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.getItems({
        order: order,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C08H06-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async addItems (request) {
    if (!request.token.permissions.includes('add items to order')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C08H07-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.addItems.validate({
        params: request.params,
        body: request.body
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C08H07-01';
      return { success: false, error: error };
    }

    let order = null;

    try {
      order = await repository.findByPk({ order_id: data.params.order });
    } catch (error) {
      error.status = 500;
      error.code = 'C08H07-02';
      return { success: false, error: error };
    }

    if (!order) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C08H07-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.addItems({
        order_id: data.params.order,
        items: data.body.items
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C08H07-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async getItem (request) {
    if (!request.token.permissions.includes('get item from order')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C08H08-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.getItem.validate({
        params: request.params,
        query: request.query
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C08H08-01';
      return { success: false, error: error };
    }

    let order = null;

    try {
      order = await repository.findByPk({ order_id: data.params.order });
    } catch (error) {
      error.status = 500;
      error.code = 'C08H08-02';
      return { success: false, error: error };
    }

    if (!order) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C08H08-03';
      return { success: false, error: error };
    }

    let item = null;

    try {
      item = await repository.getItem({
        order: order,
        item_id: data.params.item,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C08H08-04';
      return { success: false, error: error };
    }

    if (!item) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C08H08-05';
      return { success: false, error: error };
    }

    return { success: true, data: item };
  },

  async updateItem (request) {
    if (!request.token.permissions.includes('update item from order')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C08H09-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.updateItem.validate({
        params: request.params,
        query: request.query,
        body: request.body
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C08H09-01';
      return { success: false, error: error };
    }

    let order = null;

    try {
      order = await repository.findByPk({ order_id: data.params.order });
    } catch (error) {
      error.status = 500;
      error.code = 'C08H09-02';
      return { success: false, error: error };
    }

    if (!order) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C08H09-03';
      return { success: false, error: error };
    }

    let item = null;

    try {
      item = await repository.getItem({
        order: order,
        item_id: data.params.item
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C08H09-04';
      return { success: false, error: error };
    }

    if (!item) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C08H09-05';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.updateItem({
        order_id: data.params.order,
        item_id: data.params.item,
        data: data.body,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C08H09-06';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async removeItem (request) {
    if (!request.token.permissions.includes('remove item from order')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C08H10-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.removeItem.validate({
        params: request.params,
        query: request.query
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C08H10-01';
      return { success: false, error: error };
    }

    let order = null;

    try {
      order = await repository.findByPk({ order_id: data.params.order });
    } catch (error) {
      error.status = 500;
      error.code = 'C08H10-02';
      return { success: false, error: error };
    }

    if (!order) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C08H10-03';
      return { success: false, error: error };
    }

    let item = null;

    try {
      item = await repository.getItem({
        order: order,
        item_id: data.params.item
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C08H10-04';
      return { success: false, error: error };
    }

    if (!item) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C08H10-05';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.removeItem({
        order_id: data.params.order,
        item_id: data.params.item,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C08H10-06';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async getDepartments (request) {
    if (!request.token.permissions.includes('get departments from order')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C08H11-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.getDepartments.validate({
        params: request.params,
        query: request.query
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C08H11-01';
      return { success: false, error: error };
    }

    let order = null;

    try {
      order = await repository.findByPk({ order_id: data.params.order });
    } catch (error) {
      error.status = 500;
      error.code = 'C08H11-02';
      return { success: false, error: error };
    }

    if (!order) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C08H11-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.getDepartments({
        order: order,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C08H11-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async addDepartments (request) {
    if (!request.token.permissions.includes('add departments to order')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C08H12-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.addDepartments.validate({
        params: request.params,
        body: request.body
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C08H12-01';
      return { success: false, error: error };
    }

    let order = null;

    try {
      order = await repository.findByPk({ order_id: data.params.order });
    } catch (error) {
      error.status = 500;
      error.code = 'C08H12-02';
      return { success: false, error: error };
    }

    if (!order) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C08H12-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.addDepartments({
        order_id: data.params.order,
        departments: data.body.departments
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C08H12-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async getDepartment (request) {
    if (!request.token.permissions.includes('get department from order')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C08H13-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.getDepartment.validate({
        params: request.params,
        query: request.query
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C08H13-01';
      return { success: false, error: error };
    }

    let order = null;

    try {
      order = await repository.findByPk({ order_id: data.params.order });
    } catch (error) {
      error.status = 500;
      error.code = 'C08H13-02';
      return { success: false, error: error };
    }

    if (!order) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C08H13-03';
      return { success: false, error: error };
    }

    let department = null;

    try {
      department = await repository.getDepartment({
        order: order,
        department_id: data.params.department,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C08H13-04';
      return { success: false, error: error };
    }

    if (!department) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C08H13-05';
      return { success: false, error: error };
    }

    return { success: true, data: department };
  },

  async updateDepartment (request) {
    if (!request.token.permissions.includes('update department from order')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C08H14-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.updateDepartment.validate({
        params: request.params,
        query: request.query,
        body: request.body
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C08H14-01';
      return { success: false, error: error };
    }

    let order = null;

    try {
      order = await repository.findByPk({ order_id: data.params.order });
    } catch (error) {
      error.status = 500;
      error.code = 'C08H14-02';
      return { success: false, error: error };
    }

    if (!order) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C08H14-03';
      return { success: false, error: error };
    }

    let department = null;

    try {
      department = await repository.getDepartment({
        order: order,
        department_id: data.params.department
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C08H14-04';
      return { success: false, error: error };
    }

    if (!department) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C08H14-05';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.updateDepartment({
        order_id: data.params.order,
        department_id: data.params.department,
        data: data.body,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C08H14-06';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async removeDepartment (request) {
    if (!request.token.permissions.includes('remove department from order')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C08H15-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.removeDepartment.validate({
        params: request.params,
        query: request.query
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C08H15-01';
      return { success: false, error: error };
    }

    let order = null;

    try {
      order = await repository.findByPk({ order_id: data.params.order });
    } catch (error) {
      error.status = 500;
      error.code = 'C08H15-02';
      return { success: false, error: error };
    }

    if (!order) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C08H15-03';
      return { success: false, error: error };
    }

    let department = null;

    try {
      department = await repository.getDepartment({
        order: order,
        department_id: data.params.department
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C08H15-04';
      return { success: false, error: error };
    }

    if (!department) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C08H15-05';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.removeDepartment({
        order_id: data.params.order,
        department_id: data.params.department,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C08H15-06';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async getEmployees (request) {
    if (!request.token.permissions.includes('get employees from order')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C08H16-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.getEmployees.validate({
        params: request.params,
        query: request.query
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C08H16-01';
      return { success: false, error: error };
    }

    let order = null;

    try {
      order = await repository.findByPk({ order_id: data.params.order });
    } catch (error) {
      error.status = 500;
      error.code = 'C08H16-02';
      return { success: false, error: error };
    }

    if (!order) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C08H16-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.getEmployees({
        order: order,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C08H16-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async addEmployees (request) {
    if (!request.token.permissions.includes('add employees to order')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C08H17-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.addEmployees.validate({
        params: request.params,
        body: request.body
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C08H17-01';
      return { success: false, error: error };
    }

    let order = null;

    try {
      order = await repository.findByPk({ order_id: data.params.order });
    } catch (error) {
      error.status = 500;
      error.code = 'C08H17-02';
      return { success: false, error: error };
    }

    if (!order) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C08H17-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.addEmployees({
        order_id: data.params.order,
        employees: data.body.employees
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C08H17-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async getEmployee (request) {
    if (!request.token.permissions.includes('get employee from order')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C08H18-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.getEmployee.validate({
        params: request.params,
        query: request.query
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C08H18-01';
      return { success: false, error: error };
    }

    let order = null;

    try {
      order = await repository.findByPk({ order_id: data.params.order });
    } catch (error) {
      error.status = 500;
      error.code = 'C08H18-02';
      return { success: false, error: error };
    }

    if (!order) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C08H18-03';
      return { success: false, error: error };
    }

    let employee = null;

    try {
      employee = await repository.getEmployee({
        order: order,
        employee_id: data.params.employee,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C08H18-04';
      return { success: false, error: error };
    }

    if (!employee) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C08H18-05';
      return { success: false, error: error };
    }

    return { success: true, data: employee };
  },

  async updateEmployee (request) {
    if (!request.token.permissions.includes('update employee from order')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C08H19-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.updateEmployee.validate({
        params: request.params,
        query: request.query,
        body: request.body
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C08H19-01';
      return { success: false, error: error };
    }

    let order = null;

    try {
      order = await repository.findByPk({ order_id: data.params.order });
    } catch (error) {
      error.status = 500;
      error.code = 'C08H19-02';
      return { success: false, error: error };
    }

    if (!order) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C08H19-03';
      return { success: false, error: error };
    }

    let employee = null;

    try {
      employee = await repository.getEmployee({
        order: order,
        employee_id: data.params.employee
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C08H19-04';
      return { success: false, error: error };
    }

    if (!employee) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C08H19-05';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.updateEmployee({
        order_id: data.params.order,
        employee_id: data.params.employee,
        data: data.body,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C08H19-06';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async removeEmployee (request) {
    if (!request.token.permissions.includes('remove employee from order')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C08H20-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.removeEmployee.validate({
        params: request.params,
        query: request.query
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C08H20-01';
      return { success: false, error: error };
    }

    let order = null;

    try {
      order = await repository.findByPk({ order_id: data.params.order });
    } catch (error) {
      error.status = 500;
      error.code = 'C08H20-02';
      return { success: false, error: error };
    }

    if (!order) {
      let error = new Error('Not found');
      error.status = 404;
      error.code = 'C08H20-03';
      return { success: false, error: error };
    }

    let employee = null;

    try {
      employee = await repository.getEmployee({
        order: order,
        employee_id: data.params.employee
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C08H20-04';
      return { success: false, error: error };
    }

    if (!employee) {
      let error = new Error('Not found');
      error.status = 404;
      error.code = 'C08H20-05';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.removeEmployee({
        order_id: data.params.order,
        employee_id: data.params.employee,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C08H20-06';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  }
});
