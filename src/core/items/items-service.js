module.exports = ({ repository, validator }) => Object.freeze({
  async getItems (request) {
    if (!request.token.permissions.includes('get items')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C07H01-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.getItems.validate({ query: request.query });
    } catch (error) {
      error.status = 400;
      error.code = 'C07H01-01';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.findAll(data.query);
    } catch (error) {
      error.status = 500;
      error.code = 'C07H01-02';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async createItems (request) {
    if (!request.token.permissions.includes('create items')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C07H02-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.createItems.validate({ body: request.body });
    } catch (error) {
      error.status = 400;
      error.code = 'C07H02-01';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.create(data.body);
    } catch (error) {
      error.status = 500;
      error.code = 'C07H02-02';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async getItem (request) {
    if (!request.token.permissions.includes('get item')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C07H03-00';
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
      error.code = 'C07H03-01';
      return { success: false, error: error };
    }

    let item = null;

    try {
      item = await repository.findByPk({
        item_id: data.params.item,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C07H03-02';
      return { success: false, error: error };
    }

    if (!item) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C07H03-03';
      return { success: false, error: error };
    }

    return { success: true, data: item };
  },

  async updateItem (request) {
    if (!request.token.permissions.includes('update item')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C07H04-00';
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
      error.code = 'C07H04-01';
      return { success: false, error: error };
    }

    let item = null;

    try {
      item = await repository.findByPk({ item_id: data.params.item });
    } catch (error) {
      error.status = 500;
      error.code = 'C07H04-02';
      return { success: false, error: error };
    }

    if (!item) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C07H04-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.update({
        item_id: data.params.item,
        data: data.body,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C07H04-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async deleteItem (request) {
    if (!request.token.permissions.includes('delete item')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C07H05-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.deleteItem.validate({
        params: request.params,
        query: request.query
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C07H05-01';
      return { success: false, error: error };
    }

    let item = null;

    try {
      item = await repository.findByPk({ item_id: data.params.item });
    } catch (error) {
      error.status = 500;
      error.code = 'C07H05-02';
      return { success: false, error: error };
    }

    if (!item) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C07H05-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.destroy({
        item_id: data.params.item,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C07H05-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async getStocks (request) {
    if (!request.token.permissions.includes('get stocks from item')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C07H06-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.getStocks.validate({
        params: request.params,
        query: request.query
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C07H06-01';
      return { success: false, error: error };
    }

    let item = null;

    try {
      item = await repository.findByPk({ item_id: data.params.item });
    } catch (error) {
      error.status = 500;
      error.code = 'C07H06-02';
      return { success: false, error: error };
    }

    if (!item) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C07H06-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.getStocks({
        item_id: data.params.item,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C07H06-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async addStocks (request) {
    if (!request.token.permissions.includes('add stocks to item')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C07H07-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.addStocks.validate({
        params: request.params,
        body: request.body
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C07H07-01';
      return { success: false, error: error };
    }

    let item = null;

    try {
      item = await repository.findByPk({ item_id: data.params.item });
    } catch (error) {
      error.status = 500;
      error.code = 'C07H07-02';
      return { success: false, error: error };
    }

    if (!item) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C07H07-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.addStocks({
        item_id: data.params.item,
        stocks: data.body.stocks
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C07H07-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async getStock (request) {
    if (!request.token.permissions.includes('get stock from item')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C07H08-00';
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
      error.code = 'C07H08-01';
      return { success: false, error: error };
    }

    let item = null;

    try {
      item = await repository.findByPk({ item_id: data.params.item });
    } catch (error) {
      error.status = 500;
      error.code = 'C07H08-02';
      return { success: false, error: error };
    }

    if (!item) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C07H08-03';
      return { success: false, error: error };
    }

    let stock = null;

    try {
      stock = await repository.getStock({
        item_id: data.params.item,
        stock_id: data.params.stock,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C07H08-04';
      return { success: false, error: error };
    }

    if (!stock) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C07H08-05';
      return { success: false, error: error };
    }

    return { success: true, data: stock };
  }
});
