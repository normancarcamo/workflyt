module.exports = ({ repository, validator }) => Object.freeze({
  async getCompanies (request) {
    if (!request.token.permissions.includes('get companies')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C03H01-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.getCompanies.validate({
        query: request.query
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C03H01-01';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.findAll(data.query);
    } catch (error) {
      error.status = 500;
      error.code = 'C03H01-02';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async createCompanies (request) {
    if (!request.token.permissions.includes('create companies')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C03H02-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.createCompanies.validate({
        body: request.body
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C03H02-01';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.create(data.body);
    } catch (error) {
      error.status = 500;
      error.code = 'C03H02-02';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async getCompany (request) {
    if (!request.token.permissions.includes('get company')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C03H03-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.getCompany.validate({
        params: request.params,
        query: request.query
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C03H03-01';
      return { success: false, error: error };
    }

    let company = null;

    try {
      company = await repository.findByPk({
        company_id: data.params.company,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C03H03-02';
      return { success: false, error: error };
    }

    if (!company) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C03H03-03';
      return { success: false, error: error };
    }

    return { success: true, data: company };
  },

  async updateCompany (request) {
    if (!request.token.permissions.includes('update company')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C03H04-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.updateCompany.validate({
        params: request.params,
        query: request.query,
        body: request.body
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C03H04-01';
      return { success: false, error: error };
    }

    let company = null;

    try {
      company = await repository.findByPk({
        company_id: data.params.company
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C03H04-02';
      return { success: false, error: error };
    }

    if (!company) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C03H04-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.update({
        company_id: data.params.company,
        data: data.body,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C03H04-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async deleteCompany (request) {
    if (!request.token.permissions.includes('delete company')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C03H05-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.deleteCompany.validate({
        params: request.params,
        query: request.query
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C03H05-01';
      return { success: false, error: error };
    }

    let company = null;

    try {
      company = await repository.findByPk({
        company_id: data.params.company
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C03H05-02';
      return { success: false, error: error };
    }

    if (!company) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C03H05-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.destroy({
        company_id: data.params.company,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C03H05-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  }
});
