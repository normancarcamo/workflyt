module.exports = ({ repository, validator }) => Object.freeze({
  async getWarehouses (request) {
    if (!request.token.permissions.includes('get warehouses')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C15H01-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.getWarehouses.validate({
        query: request.query
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C15H01-01';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.findAll(data.query);
    } catch (error) {
      error.status = 500;
      error.code = 'C15H01-02';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async createWarehouses (request) {
    if (!request.token.permissions.includes('create warehouses')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C15H02-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.createWarehouses.validate({
        body: request.body
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C15H02-01';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.create(data.body);
    } catch (error) {
      error.status = 500;
      error.code = 'C15H02-02';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async getWarehouse (request) {
    if (!request.token.permissions.includes('get warehouse')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C15H03-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.getWarehouse.validate({
        params: request.params,
        query: request.query
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C15H03-01';
      return { success: false, error: error };
    }

    let warehouse = null;

    try {
      warehouse = await repository.findByPk({
        warehouse_id: data.params.warehouse,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C15H03-02';
      return { success: false, error: error };
    }

    if (!warehouse) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C15H03-03';
      return { success: false, error: error };
    }

    return { success: true, data: warehouse };
  },

  async updateWarehouse (request) {
    if (!request.token.permissions.includes('update warehouse')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C15H04-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.updateWarehouse.validate({
        params: request.params,
        query: request.query,
        body: request.body
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C15H04-01';
      return { success: false, error: error };
    }

    let warehouse = null;

    try {
      warehouse = await repository.findByPk({
        warehouse_id: data.params.warehouse
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C15H04-02';
      return { success: false, error: error };
    }

    if (!warehouse) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C15H04-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.update({
        warehouse_id: data.params.warehouse,
        data: data.body,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C15H04-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async deleteWarehouse (request) {
    if (!request.token.permissions.includes('delete warehouse')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C15H05-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.deleteWarehouse.validate({
        params: request.params,
        query: request.query
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C15H05-01';
      return { success: false, error: error };
    }

    let warehouse = null;

    try {
      warehouse = await repository.findByPk({
        warehouse_id: data.params.warehouse
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C15H05-02';
      return { success: false, error: error };
    }

    if (!warehouse) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C15H05-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.destroy({
        warehouse_id: data.params.warehouse,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C15H05-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async getItems (request) {
    if (!request.token.permissions.includes('get items from warehouse')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C15H06-00';
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
      error.code = 'C15H06-01';
      return { success: false, error: error };
    }

    let warehouse = null;

    try {
      warehouse = await repository.findByPk({
        warehouse_id: data.params.warehouse
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C15H06-02';
      return { success: false, error: error };
    }

    if (!warehouse) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C15H06-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.getItems({
        warehouse: warehouse,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C15H06-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async addItems (request) {
    if (!request.token.permissions.includes('add items to warehouse')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C15H07-00';
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
      error.code = 'C15H07-01';
      return { success: false, error: error };
    }

    let warehouse = null;

    try {
      warehouse = await repository.findByPk({
        warehouse_id: data.params.warehouse
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C15H07-02';
      return { success: false, error: error };
    }

    if (!warehouse) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C15H07-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.addItems({
        warehouse_id: data.params.warehouse,
        items: data.body.items
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C15H07-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async getItem (request) {
    if (!request.token.permissions.includes('get item from warehouse')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C15H08-00';
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
      error.code = 'C15H08-01';
      return { success: false, error: error };
    }

    let warehouse = null;

    try {
      warehouse = await repository.findByPk({
        warehouse_id: data.params.warehouse
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C15H08-02';
      return { success: false, error: error };
    }

    if (!warehouse) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C15H08-03';
      return { success: false, error: error };
    }

    let item = null;

    try {
      item = await repository.getItem({
        warehouse: warehouse,
        item_id: data.params.item,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C15H08-04';
      return { success: false, error: error };
    }

    if (!item) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C15H08-05';
      return { success: false, error: error };
    }

    return { success: true, data: item };
  },

  async updateItem (request) {
    if (!request.token.permissions.includes('update item from warehouse')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C15H09-00';
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
      error.code = 'C15H09-01';
      return { success: false, error: error };
    }

    let warehouse = null;

    try {
      warehouse = await repository.findByPk({
        warehouse_id: data.params.warehouse
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C15H09-02';
      return { success: false, error: error };
    }

    if (!warehouse) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C15H09-03';
      return { success: false, error: error };
    }

    let item = null;

    try {
      item = await repository.getItem({
        warehouse: warehouse,
        item_id: data.params.item
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C15H09-04';
      return { success: false, error: error };
    }

    if (!item) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C15H09-05';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.updateItem({
        warehouse_id: data.params.warehouse,
        item_id: data.params.item,
        data: data.body,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C15H09-06';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async removeItem (request) {
    if (!request.token.permissions.includes('remove item from warehouse')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C15H10-00';
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
      error.code = 'C15H10-01';
      return { success: false, error: error };
    }

    let warehouse = null;

    try {
      warehouse = await repository.findByPk({
        warehouse_id: data.params.warehouse
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C15H10-02';
      return { success: false, error: error };
    }

    if (!warehouse) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C15H10-03';
      return { success: false, error: error };
    }

    let item = null;

    try {
      item = await repository.getItem({
        warehouse: warehouse,
        item_id: data.params.item
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C15H10-04';
      return { success: false, error: error };
    }

    if (!item) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C15H10-05';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.removeItem({
        warehouse_id: data.params.warehouse,
        item_id: data.params.item,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C15H10-06';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  }
});
