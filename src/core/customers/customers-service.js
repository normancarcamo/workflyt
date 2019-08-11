module.exports = ({ repository, validator }) => Object.freeze({
  async getCustomers (request) {
    if (!request.token.permissions.includes('get customers')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C04H01-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.getCustomers.validate({ query: request.query });
    } catch (error) {
      error.status = 400;
      error.code = 'C04H01-01';
      return { success: false, error: error };
    }

    let customers = null;

    try {
      customers = await repository.findAll(data.query);
    } catch (error) {
      error.status = 500;
      error.code = 'C04H01-02';
      return { success: false, error: error };
    }

    return { success: true, data: customers };
  },

  async createCustomers (request) {
    if (!request.token.permissions.includes('create customers')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C04H02-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.createCustomers.validate({
        body: request.body
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C04H02-01';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.create(data.body);
    } catch (error) {
      error.status = 500;
      error.code = 'C04H02-02';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async getCustomer (request) {
    if (!request.token.permissions.includes('get customer')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C04H03-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.getCustomer.validate({
        params: request.params,
        query: request.query
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C04H03-01';
      return { success: false, error: error };
    }

    let customer = null;

    try {
      customer = await repository.findByPk({
        customer_id: data.params.customer,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C04H03-02';
      return { success: false, error: error };
    }

    if (!customer) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C04H03-03';
      return { success: false, error: error };
    }

    return { success: true, data: customer };
  },

  async updateCustomer (request) {
    if (!request.token.permissions.includes('update customer')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C04H04-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.updateCustomer.validate({
        params: request.params,
        query: request.query,
        body: request.body
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C04H04-01';
      return { success: false, error: error };
    }

    let customer = null;

    try {
      customer = await repository.findByPk({
        customer_id: data.params.customer
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C04H04-02';
      return { success: false, error: error };
    }

    if (!customer) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C04H04-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.update({
        customer_id: data.params.customer,
        data: data.body,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C04H04-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async deleteCustomer (request) {
    if (!request.token.permissions.includes('delete customer')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C04H05-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.deleteCustomer.validate({
        params: request.params,
        query: request.query
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C04H05-01';
      return { success: false, error: error };
    }

    let customer = null;

    try {
      customer = await repository.findByPk({
        customer_id: data.params.customer
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C04H05-02';
      return { success: false, error: error };
    }

    if (!customer) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C04H05-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.destroy({
        customer_id: data.params.customer,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C04H05-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async getQuotes (request) {
    if (!request.token.permissions.includes('get quotes from customer')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C04H06-00';
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
      error.code = 'C04H06-01';
      return { success: false, error: error };
    }

    let customer = null;

    try {
      customer = await repository.findByPk({
        customer_id: data.params.customer
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C04H06-02';
      return { success: false, error: error };
    }

    if (!customer) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C04H06-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.getQuotes({
        customer_id: data.params.customer,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C04H06-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async addQuotes (request) {
    if (!request.token.permissions.includes('add quotes to customer')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C04H07-00';
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
      error.code = 'C04H07-01';
      return { success: false, error: error };
    }

    let customer = null;

    try {
      customer = await repository.findByPk({
        customer_id: data.params.customer
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C04H07-02';
      return { success: false, error: error };
    }

    if (!customer) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C04H07-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.addQuotes({
        customer_id: data.params.customer,
        quotes: data.body.quotes
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C04H07-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async getQuote (request) {
    if (!request.token.permissions.includes('get quote from customer')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C04H08-00';
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
      error.code = 'C04H08-01';
      return { success: false, error: error };
    }

    let customer = null;

    try {
      customer = await repository.findByPk({
        customer_id: data.params.customer
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C04H08-02';
      return { success: false, error: error };
    }

    if (!customer) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C04H08-03';
      return { success: false, error: error };
    }

    let quote = null;

    try {
      quote = await repository.getQuote({
        customer_id: data.params.customer,
        quote_id: data.params.quote,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C04H08-04';
      return { success: false, error: error };
    }

    if (!quote) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C04H08-05';
      return { success: false, error: error };
    }

    return { success: true, data: quote };
  }
});
