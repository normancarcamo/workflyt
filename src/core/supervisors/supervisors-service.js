module.exports = ({ repository, validator }) => Object.freeze({
  async getSupervisors (request) {
    if (!request.token.permissions.includes('get supervisors')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'S-SPV-H01-E01';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.getSupervisors.validate({
        query: request.query
      });
    } catch (error) {
      error.status = 400;
      error.code = 'S-SPV-H01-E02';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.findAll(data.query);
    } catch (error) {
      error.status = 500;
      error.code = 'S-SPV-H01-E03';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async getSupervisor (request) {
    if (!request.token.permissions.includes('get supervisor')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'S-SPV-H02-E01';
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
      error.code = 'S-SPV-H02-E02';
      return { success: false, error: error };
    }

    let supervisor = null;

    try {
      supervisor = await repository.findByPk({
        supervisor_id: data.params.supervisor,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'S-SPV-H02-E03';
      return { success: false, error: error };
    }

    if (!supervisor) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'S-SPV-H02-E04';
      return { success: false, error: error };
    }

    return { success: true, data: supervisor };
  },

  async getEmployees (request) {
    if (!request.token.permissions.includes('get employees from supervisor')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'S-SPV-H03-E01';
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
      error.code = 'S-SPV-H03-E02';
      return { success: false, error: error };
    }

    let supervisor = null;

    try {
      supervisor = await repository.findByPk({
        supervisor_id: data.params.supervisor
      });
    } catch (error) {
      error.status = 500;
      error.code = 'S-SPV-H03-E03';
      return { success: false, error: error };
    }

    if (!supervisor) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'S-SPV-H03-E04';
      return { success: false, error: error };
    }

    let employees = null;

    try {
      employees = await repository.getEmployees({
        supervisor: supervisor,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'S-SPV-H03-E05';
      return { success: false, error: error };
    }

    return { success: true, data: employees };
  }
});
