module.exports = ({ repository, validator }) => Object.freeze({
  async getStocks (request) {
    if (!request.token.permissions.includes('get stocks')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C12H01-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.getStocks.validate({ query: request.query });
    } catch (error) {
      error.status = 400;
      error.code = 'C12H01-01';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.findAll(data.query);
    } catch (error) {
      error.status = 500;
      error.code = 'C12H01-02';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async createStocks (request) {
    if (!request.token.permissions.includes('create stocks')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C12H02-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.createStocks.validate({ body: request.body });
    } catch (error) {
      error.status = 400;
      error.code = 'C12H02-01';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.create(data.body);
    } catch (error) {
      error.status = 500;
      error.code = 'C12H02-02';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async getStock (request) {
    if (!request.token.permissions.includes('get stock')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C12H03-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.getStock.validate({
        params: request.params,
        query: request.query
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C12H03-01';
      return { success: false, error: error };
    }

    let stock = null;

    try {
      stock = await repository.findByPk({
        stock_id: data.params.stock,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C12H03-02';
      return { success: false, error: error };
    }

    if (!stock) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C12H03-03';
      return { success: false, error: error };
    }

    return { success: true, data: stock };
  },

  async updateStock (request) {
    if (!request.token.permissions.includes('update stock')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C12H04-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.updateStock.validate({
        params: request.params,
        query: request.query,
        body: request.body
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C12H04-01';
      return { success: false, error: error };
    }

    let stock = null;

    try {
      stock = await repository.findByPk({ stock_id: data.params.stock });
    } catch (error) {
      error.status = 500;
      error.code = 'C12H04-02';
      return { success: false, error: error };
    }

    if (!stock) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C12H04-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.update({
        stock_id: data.params.stock,
        data: data.body,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C12H04-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async deleteStock (request) {
    if (!request.token.permissions.includes('delete stock')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C12H05-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.deleteStock.validate({
        params: request.params,
        query: request.query
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C12H05-01';
      return { success: false, error: error };
    }

    let stock = null;

    try {
      stock = await repository.findByPk({ stock_id: data.params.stock });
    } catch (error) {
      error.status = 500;
      error.code = 'C12H05-02';
      return { success: false, error: error };
    }

    if (!stock) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C12H05-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.destroy({
        stock_id: data.params.stock,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C12H05-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  }
});
