module.exports = ({ repository, validator }) => Object.freeze({
  async getQuotes (request) {
    if (!request.token.permissions.includes('get quotes')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C10H01-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.getQuotes.validate({ query: request.query });
    } catch (error) {
      error.status = 400;
      error.code = 'C10H01-01';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.findAll(data.query);
    } catch (error) {
      error.status = 500;
      error.code = 'C10H01-02';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async createQuotes (request) {
    if (!request.token.permissions.includes('create quotes')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C10H02-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.createQuotes.validate({ body: request.body });
    } catch (error) {
      error.status = 400;
      error.code = 'C10H02-01';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.create(data.body);
    } catch (error) {
      error.status = 500;
      error.code = 'C10H02-02';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async getQuote (request) {
    if (!request.token.permissions.includes('get quote')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C10H03-00';
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
      error.code = 'C10H03-01';
      return { success: false, error: error };
    }

    let quote = null;

    try {
      quote = await repository.findByPk({
        quote_id: data.params.quote,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C10H03-02';
      return { success: false, error: error };
    }

    if (!quote) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C10H03-03';
      return { success: false, error: error };
    }

    return { success: true, data: quote };
  },

  async updateQuote (request) {
    if (!request.token.permissions.includes('update quote')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C10H04-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.updateQuote.validate({
        params: request.params,
        query: request.query,
        body: request.body
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C10H04-01';
      return { success: false, error: error };
    }

    let quote = null;

    try {
      quote = await repository.findByPk({ quote_id: data.params.quote });
    } catch (error) {
      error.status = 500;
      error.code = 'C10H04-02';
      return { success: false, error: error };
    }

    if (!quote) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C10H04-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.update({
        quote_id: data.params.quote,
        data: data.body,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C10H04-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async deleteQuote (request) {
    if (!request.token.permissions.includes('delete quote')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C10H05-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.deleteQuote.validate({
        params: request.params,
        query: request.query
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C10H05-01';
      return { success: false, error: error };
    }

    let quote = null;

    try {
      quote = await repository.findByPk({ quote_id: data.params.quote });
    } catch (error) {
      error.status = 500;
      error.code = 'C10H05-02';
      return { success: false, error: error };
    }

    if (!quote) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C10H05-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.destroy({
        quote_id: data.params.quote,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C10H05-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async getItems (request) {
    if (!request.token.permissions.includes('get items from quote')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C10H06-00';
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
      error.code = 'C10H06-01';
      return { success: false, error: error };
    }

    let quote = null;

    try {
      quote = await repository.findByPk({ quote_id: data.params.quote });
    } catch (error) {
      error.status = 500;
      error.code = 'C10H06-02';
      return { success: false, error: error };
    }

    if (!quote) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C10H06-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.getItems({
        quote: quote,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C10H06-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async addItems (request) {
    if (!request.token.permissions.includes('add items to quote')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C10H07-00';
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
      error.code = 'C10H07-01';
      return { success: false, error: error };
    }

    let quote = null;

    try {
      quote = await repository.findByPk({ quote_id: data.params.quote });
    } catch (error) {
      error.status = 500;
      error.code = 'C10H07-02';
      return { success: false, error: error };
    }

    if (!quote) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C10H07-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.addItems({
        quote_id: data.params.quote,
        items: data.body.items
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C10H07-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async getItem (request) {
    if (!request.token.permissions.includes('get item from quote')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C10H08-00';
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
      error.code = 'C10H08-01';
      return { success: false, error: error };
    }

    let quote = null;

    try {
      quote = await repository.findByPk({ quote_id: data.params.quote });
    } catch (error) {
      error.status = 500;
      error.code = 'C10H08-02';
      return { success: false, error: error };
    }

    if (!quote) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C10H08-03';
      return { success: false, error: error };
    }

    let item = null;

    try {
      item = await repository.getItem({
        quote: quote,
        item_id: data.params.item,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C10H08-04';
      return { success: false, error: error };
    }

    if (!item) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C10H08-05';
      return { success: false, error: error };
    }

    return { success: true, data: item };
  },

  async updateItem (request) {
    if (!request.token.permissions.includes('update item from quote')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C10H09-00';
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
      error.code = 'C10H09-01';
      return { success: false, error: error };
    }

    let quote = null;

    try {
      quote = await repository.findByPk({ quote_id: data.params.quote });
    } catch (error) {
      error.status = 500;
      error.code = 'C10H09-02';
      return { success: false, error: error };
    }

    if (!quote) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C10H09-03';
      return { success: false, error: error };
    }

    let item = null;

    try {
      item = await repository.getItem({
        quote: quote,
        item_id: data.params.item
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C10H09-04';
      return { success: false, error: error };
    }

    if (!item) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C10H09-05';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.updateItem({
        quote_id: data.params.quote,
        item_id: data.params.item,
        data: data.body,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C10H09-06';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async removeItem (request) {
    if (!request.token.permissions.includes('remove item from quote')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C10H10-00';
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
      error.code = 'C10H10-01';
      return { success: false, error: error };
    }

    let quote = null;

    try {
      quote = await repository.findByPk({ quote_id: data.params.quote });
    } catch (error) {
      error.status = 500;
      error.code = 'C10H10-02';
      return { success: false, error: error };
    }

    if (!quote) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C10H10-03';
      return { success: false, error: error };
    }

    let item = null;

    try {
      item = await repository.getItem({
        quote: quote,
        item_id: data.params.item
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C10H10-04';
      return { success: false, error: error };
    }

    if (!item) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C10H10-05';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.removeItem({
        quote_id: data.params.quote,
        item_id: data.params.item,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C10H10-06';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async getOrders (request) {
    if (!request.token.permissions.includes('get orders from quote')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C10H11-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.getOrders.validate({
        params: request.params,
        query: request.query
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C10H11-01';
      return { success: false, error: error };
    }

    let quote = null;

    try {
      quote = await repository.findByPk({ quote_id: data.params.quote });
    } catch (error) {
      error.status = 500;
      error.code = 'C10H11-02';
      return { success: false, error: error };
    }

    if (!quote) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C10H11-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.getOrders({
        quote_id: data.params.quote,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C10H11-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async addOrders (request) {
    if (!request.token.permissions.includes('add orders to quote')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C10H12-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.addOrders.validate({
        params: request.params,
        body: request.body
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C10H12-01';
      return { success: false, error: error };
    }

    let quote = null;

    try {
      quote = await repository.findByPk({ quote_id: data.params.quote });
    } catch (error) {
      error.status = 500;
      error.code = 'C10H12-02';
      return { success: false, error: error };
    }

    if (!quote) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C10H12-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.addOrders({
        quote_id: data.params.quote,
        orders: data.body.orders
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C10H12-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async getOrder (request) {
    if (!request.token.permissions.includes('get order from quote')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C10H13-00';
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
      error.code = 'C10H13-01';
      return { success: false, error: error };
    }

    let quote = null;

    try {
      quote = await repository.findByPk({ quote_id: data.params.quote });
    } catch (error) {
      error.status = 500;
      error.code = 'C10H13-02';
      return { success: false, error: error };
    }

    if (!quote) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C10H13-03';
      return { success: false, error: error };
    }

    let order = null;

    try {
      order = await repository.getOrder({
        quote_id: data.params.quote,
        order_id: data.params.order,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C10H13-04';
      return { success: false, error: error };
    }

    if (!order) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C10H13-05';
      return { success: false, error: error };
    }

    return { success: true, data: order };
  }
});
