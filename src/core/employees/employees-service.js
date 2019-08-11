module.exports = ({ repository, validator }) => Object.freeze({
  async getEmployees (request) {
    if (!request.token.permissions.includes('get employees')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C06H01-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.getEmployees.validate({ query: request.query });
    } catch (error) {
      error.status = 400;
      error.code = 'C06H01-01';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.findAll(data.query);
    } catch (error) {
      error.status = 500;
      error.code = 'C06H01-02';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async createEmployees (request) {
    if (!request.token.permissions.includes('create employees')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C06H02-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.createEmployees.validate({ body: request.body });
    } catch (error) {
      error.status = 400;
      error.code = 'C06H02-01';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.create(data.body);
    } catch (error) {
      error.status = 500;
      error.code = 'C06H02-02';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async getEmployee (request) {
    if (!request.token.permissions.includes('get employee')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C06H03-00';
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
      error.code = 'C06H03-01';
      return { success: false, error: error };
    }

    let employee = null;

    try {
      employee = await repository.findByPk({
        employee_id: data.params.employee,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C06H03-02';
      return { success: false, error: error };
    }

    if (!employee) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C06H03-03';
      return { success: false, error: error };
    }

    return { success: true, data: employee };
  },

  async updateEmployee (request) {
    if (!request.token.permissions.includes('update employee')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C06H04-00';
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
      error.code = 'C06H04-01';
      return { success: false, error: error };
    }

    let employee = null;

    try {
      employee = await repository.findByPk({
        employee_id: data.params.employee
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C06H04-02';
      return { success: false, error: error };
    }

    if (!employee) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C06H04-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.update({
        employee_id: data.params.employee,
        data: data.body,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C06H04-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async deleteEmployee (request) {
    if (!request.token.permissions.includes('delete employee')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C06H05-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.deleteEmployee.validate({
        params: request.params,
        query: request.query
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C06H05-01';
      return { success: false, error: error };
    }

    let employee = null;

    try {
      employee = await repository.findByPk({
        employee_id: data.params.employee
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C06H05-02';
      return { success: false, error: error };
    }

    if (!employee) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C06H05-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.destroy({
        employee_id: data.params.employee,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C06H05-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async getUser (request) {
    if (!request.token.permissions.includes('get user from employee')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C06H06-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.getUser.validate({
        params: request.params,
        query: request.query
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C06H06-01';
      return { success: false, error: error };
    }

    let employee = null;

    try {
      employee = await repository.findByPk({
        employee_id: data.params.employee
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C06H06-02';
      return { success: false, error: error };
    }

    if (!employee) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C06H06-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.getUser({
        employee_id: data.params.employee,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C06H06-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async setUser (request) {
    if (!request.token.permissions.includes('set user to employee')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C06H07-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.setUser.validate({
        params: request.params,
        body: request.body
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C06H07-01';
      return { success: false, error: error };
    }

    let employee = null;

    try {
      employee = await repository.findByPk({
        employee_id: data.params.employee
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C06H07-02';
      return { success: false, error: error };
    }

    if (!employee) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C06H07-03';
      return { success: false, error: error };
    }

    let user = null;

    try {
      user = await repository.getUser({
        user_id: data.body.user,
        employee_id: data.params.employee
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C06H07-04';
      return { success: false, error: error };
    }

    if (!user) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C06H07-05';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.setUser({
        employee_id: data.params.employee,
        user_id: user.id
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C06H07-06';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async removeUser (request) {
    if (!request.token.permissions.includes('remove user from employee')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C06H08-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.removeUser.validate({ params: request.params });
    } catch (error) {
      error.status = 400;
      error.code = 'C06H08-01';
      return { success: false, error: error };
    }

    let employee = null;

    try {
      employee = await repository.findByPk({
        employee_id: data.params.employee
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C06H08-02';
      return { success: false, error: error };
    }

    if (!employee) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C06H08-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.removeUser({
        employee_id: data.params.employee,
        options: data.options
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C06H08-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async getQuotes (request) {
    if (!request.token.permissions.includes('get quotes from employee')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C06H09-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.getQuotes.validate({
        params: request.params,
        query: request.query
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C06H09-01';
      return { success: false, error: error };
    }

    let employee = null;

    try {
      employee = await repository.findByPk({
        employee_id: data.params.employee
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C06H09-02';
      return { success: false, error: error };
    }

    if (!employee) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C06H09-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.getQuotes({
        salesman_id: data.params.employee,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C06H09-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async addQuotes (request) {
    if (!request.token.permissions.includes('add quotes to employee')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C06H10-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.addQuotes.validate({
        params: request.params,
        body: request.body
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C06H10-01';
      return { success: false, error: error };
    }

    let employee = null;

    try {
      employee = await repository.findByPk({
        employee_id: data.params.employee
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C06H10-02';
      return { success: false, error: error };
    }

    if (!employee) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C06H10-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.addQuotes({
        salesman_id: data.params.employee,
        quotes: data.body.quotes
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C06H10-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async getQuote (request) {
    if (!request.token.permissions.includes('get quote from employee')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C06H11-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.getQuote.validate({
        params: request.params,
        query: request.query
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C06H11-01';
      return { success: false, error: error };
    }

    let employee = null;

    try {
      employee = await repository.findByPk({
        employee_id: data.params.employee
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C06H11-02';
      return { success: false, error: error };
    }

    if (!employee) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C06H11-03';
      return { success: false, error: error };
    }

    let quote = null;

    try {
      quote = await repository.getQuote({
        salesman_id: data.params.employee,
        quote_id: data.params.quote,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C06H11-04';
      return { success: false, error: error };
    }

    if (!quote) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C06H11-05';
      return { success: false, error: error };
    }

    return { success: true, data: quote };
  },

  async getSupervisors (request) {
    if (!request.token.permissions.includes('get supervisors from employee')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C06H12-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.getSupervisors.validate({
        params: request.params,
        query: request.query
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C06H12-01';
      return { success: false, error: error };
    }

    let employee = null;

    try {
      employee = await repository.findByPk({
        employee_id: data.params.employee
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C06H12-02';
      return { success: false, error: error };
    }

    if (!employee) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C06H12-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.getSupervisors({
        employee: employee,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C06H12-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async addSupervisors (request) {
    if (!request.token.permissions.includes('add supervisors to employee')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C06H13-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.addSupervisors.validate({
        params: request.params,
        body: request.body
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C06H13-01';
      return { success: false, error: error };
    }

    let employee = null;

    try {
      employee = await repository.findByPk({
        employee_id: data.params.employee
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C06H13-02';
      return { success: false, error: error };
    }

    if (!employee) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C06H13-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.addSupervisors({
        employee_id: data.params.employee,
        supervisors: data.body.supervisors
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C06H13-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async getSupervisor (request) {
    if (!request.token.permissions.includes('get supervisor from employee')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C06H14-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.getSupervisor.validate({
        params: request.params,
        query: request.query
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C06H14-01';
      return { success: false, error: error };
    }

    let employee = null;

    try {
      employee = await repository.findByPk({
        employee_id: data.params.employee
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C06H14-02';
      return { success: false, error: error };
    }

    if (!employee) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C06H14-03';
      return { success: false, error: error };
    }

    let supervisor = null;

    try {
      supervisor = await repository.getSupervisor({
        employee: employee,
        supervisor_id: data.params.supervisor,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C06H14-04';
      return { success: false, error: error };
    }

    if (!supervisor) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C06H14-05';
      return { success: false, error: error };
    }

    return { success: true, data: supervisor };
  },

  async updateSupervisor (request) {
    if (!request.token.permissions.includes('update supervisor from employee')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C06H15-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.updateSupervisor.validate({
        params: request.params,
        query: request.query,
        body: request.body
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C06H15-01';
      return { success: false, error: error };
    }

    let employee = null;

    try {
      employee = await repository.findByPk({
        employee_id: data.params.employee
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C06H15-02';
      return { success: false, error: error };
    }

    if (!employee) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C06H15-03';
      return { success: false, error: error };
    }

    let supervisor = null;

    try {
      supervisor = await repository.getSupervisor({
        employee: employee,
        supervisor_id: data.params.supervisor
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C06H15-04';
      return { success: false, error: error };
    }

    if (!supervisor) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C06H15-05';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.updateSupervisor({
        employee_id: data.params.employee,
        supervisor_id: data.params.supervisor,
        data: data.body,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C06H15-06';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async removeSupervisor (request) {
    if (!request.token.permissions.includes('remove supervisor from employee')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C06H16-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.removeSupervisor.validate({
        params: request.params,
        query: request.query
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C06H16-01';
      return { success: false, error: error };
    }

    let employee = null;

    try {
      employee = await repository.findByPk({
        employee_id: data.params.employee
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C06H16-02';
      return { success: false, error: error };
    }

    if (!employee) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C06H16-03';
      return { success: false, error: error };
    }

    let supervisor = null;

    try {
      supervisor = await repository.getSupervisor({
        employee: employee,
        supervisor_id: data.params.supervisor
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C06H16-04';
      return { success: false, error: error };
    }

    if (!supervisor) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C06H16-05';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.removeSupervisor({
        employee_id: data.params.employee,
        supervisor_id: data.params.supervisor,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C06H16-06';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  }
});
