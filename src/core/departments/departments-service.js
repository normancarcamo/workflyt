module.exports = ({ repository, validator }) => Object.freeze({
  async getDepartments (request) {
    if (!request.token.permissions.includes('get departments')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C05H01-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.getDepartments.validate({ query: request.query });
    } catch (error) {
      error.status = 400;
      error.code = 'C05H01-01';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.findAll(data.query);
    } catch (error) {
      error.status = 500;
      error.code = 'C05H01-02';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async createDepartments (request) {
    if (!request.token.permissions.includes('create departments')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C05H02-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.createDepartments.validate({ body: request.body });
    } catch (error) {
      error.status = 400;
      error.code = 'C05H02-01';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.create(data.body);
    } catch (error) {
      error.status = 500;
      error.code = 'C05H02-02';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async getDepartment (request) {
    if (!request.token.permissions.includes('get department')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C05H03-00';
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
      error.code = 'C05H03-01';
      return { success: false, error: error };
    }

    let department = null;

    try {
      department = await repository.findByPk({
        department_id: data.params.department,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C05H03-02';
      return { success: false, error: error };
    }

    if (!department) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C05H03-03';
      return { success: false, error: error };
    }

    return { success: true, data: department };
  },

  async updateDepartment (request) {
    if (!request.token.permissions.includes('update department')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C05H04-00';
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
      error.code = 'C05H04-01';
      return { success: false, error: error };
    }

    let department = null;

    try {
      department = await repository.findByPk({
        department_id: data.params.department
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C05H04-02';
      return { success: false, error: error };
    }

    if (!department) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C05H04-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.update({
        department_id: data.params.department,
        data: data.body,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C05H04-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async deleteDepartment (request) {
    if (!request.token.permissions.includes('delete department')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C05H05-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.deleteDepartment.validate({
        params: request.params,
        query: request.query
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C05H05-01';
      return { success: false, error: error };
    }

    let department = null;

    try {
      department = await repository.findByPk({
        department_id: data.params.department
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C05H05-02';
      return { success: false, error: error };
    }

    if (!department) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C05H05-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.destroy({
        department_id: data.params.department,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C05H05-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async getEmployees (request) {
    if (!request.token.permissions.includes('get employees from department')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C05H06-00';
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
      error.code = 'C05H06-01';
      return { success: false, error: error };
    }

    let department = null;

    try {
      department = await repository.findByPk({
        department_id: data.params.department
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C05H06-02';
      return { success: false, error: error };
    }

    if (!department) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C05H06-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.getEmployees({
        department: department,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C05H06-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async addEmployees (request) {
    if (!request.token.permissions.includes('add employees to department')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C05H07-00';
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
      error.code = 'C05H07-01';
      return { success: false, error: error };
    }

    let department = null;

    try {
      department = await repository.findByPk({
        department_id: data.params.department
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C05H07-02';
      return { success: false, error: error };
    }

    if (!department) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C05H07-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.addEmployees({
        department_id: data.params.department,
        employees: data.body.employees
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C05H07-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async getEmployee (request) {
    if (!request.token.permissions.includes('get employee from department')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C05H08-00';
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
      error.code = 'C05H08-01';
      return { success: false, error: error };
    }

    let department = null;

    try {
      department = await repository.findByPk({
        department_id: data.params.department
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C05H08-02';
      return { success: false, error: error };
    }

    if (!department) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C05H08-03';
      return { success: false, error: error };
    }

    let employee = null;

    try {
      employee = await repository.getEmployee({
        department: department,
        employee_id: data.params.employee,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C05H08-04';
      return { success: false, error: error };
    }

    if (!employee) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C05H08-05';
      return { success: false, error: error };
    }

    return { success: true, data: employee };
  },

  async updateEmployee (request) {
    if (!request.token.permissions.includes('update employee from department')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C05H09-00';
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
      error.code = 'C05H09-01';
      return { success: false, error: error };
    }

    let department = null;

    try {
      department = await repository.findByPk({
        department_id: data.params.department
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C05H09-02';
      return { success: false, error: error };
    }

    if (!department) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C05H09-03';
      return { success: false, error: error };
    }

    let employee = null;

    try {
      employee = await repository.getEmployee({
        department: department,
        employee_id: data.params.employee
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C05H09-04';
      return { success: false, error: error };
    }

    if (!employee) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C05H09-05';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.updateEmployee({
        department_id: data.params.department,
        employee_id: data.params.employee,
        data: data.body,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C05H09-06';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async removeEmployee (request) {
    if (!request.token.permissions.includes('remove employee from department')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C05H10-00';
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
      error.code = 'C05H10-01';
      return { success: false, error: error };
    }

    let department = null;

    try {
      department = await repository.findByPk({
        department_id: data.params.department
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C05H10-02';
      return { success: false, error: error };
    }

    if (!department) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C05H10-03';
      return { success: false, error: error };
    }

    let employee = null;

    try {
      employee = await repository.getEmployee({
        department: department,
        employee_id: data.params.employee
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C05H10-04';
      return { success: false, error: error };
    }

    if (!employee) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C05H10-05';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.removeEmployee({
        department_id: data.params.department,
        employee_id: data.params.employee,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C05H10-06';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  }
});
