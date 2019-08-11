module.exports = ({ repository, validator }) => Object.freeze({
  async getSuppliers (request) {
    if (!request.token.permissions.includes('get suppliers')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C13H01-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.getSuppliers.validate({
        query: request.query
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C13H01-01';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.findAll(data.query);
    } catch (error) {
      error.status = 500;
      error.code = 'C13H01-02';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async createSuppliers (request) {
    if (!request.token.permissions.includes('create suppliers')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C13H02-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.createSuppliers.validate({
        body: request.body
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C13H02-01';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.create(data.body);
    } catch (error) {
      error.status = 500;
      error.code = 'C13H02-02';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async getSupplier (request) {
    if (!request.token.permissions.includes('get supplier')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C13H03-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.getSupplier.validate({
        params: request.params,
        query: request.query
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C13H03-01';
      return { success: false, error: error };
    }

    let supplier = null;

    try {
      supplier = await repository.findByPk({
        supplier_id: data.params.supplier,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C13H03-02';
      return { success: false, error: error };
    }

    if (!supplier) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C13H03-03';
      return { success: false, error: error };
    }

    return { success: true, data: supplier };
  },

  async updateSupplier (request) {
    if (!request.token.permissions.includes('update supplier')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C13H04-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.updateSupplier.validate({
        params: request.params,
        query: request.query,
        body: request.body
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C13H04-01';
      return { success: false, error: error };
    }

    let supplier = null;

    try {
      supplier = await repository.findByPk({
        supplier_id: data.params.supplier
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C13H04-02';
      return { success: false, error: error };
    }

    if (!supplier) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C13H04-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.update({
        supplier_id: data.params.supplier,
        data: data.body,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C13H04-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async deleteSupplier (request) {
    if (!request.token.permissions.includes('delete supplier')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C13H05-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.deleteSupplier.validate({
        params: request.params,
        query: request.query
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C13H05-01';
      return { success: false, error: error };
    }

    let supplier = null;

    try {
      supplier = await repository.findByPk({
        supplier_id: data.params.supplier
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C13H05-02';
      return { success: false, error: error };
    }

    if (!supplier) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C13H05-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.destroy({
        supplier_id: data.params.supplier,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C13H05-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async getItems (request) {
    if (!request.token.permissions.includes('get items from supplier')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C13H06-00';
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
      error.code = 'C13H06-01';
      return { success: false, error: error };
    }

    let supplier = null;

    try {
      supplier = await repository.findByPk({
        supplier_id: data.params.supplier
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C13H06-02';
      return { success: false, error: error };
    }

    if (!supplier) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C13H06-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.getItems({
        supplier: supplier,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C13H06-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async addItems (request) {
    if (!request.token.permissions.includes('add items to supplier')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C13H07-00';
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
      error.code = 'C13H07-01';
      return { success: false, error: error };
    }

    let supplier = null;

    try {
      supplier = await repository.findByPk({
        supplier_id: data.params.supplier
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C13H07-02';
      return { success: false, error: error };
    }

    if (!supplier) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C13H07-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.addItems({
        supplier_id: data.params.supplier,
        items: data.body.items
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C13H07-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async getItem (request) {
    if (!request.token.permissions.includes('get item from supplier')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C13H08-00';
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
      error.code = 'C13H08-01';
      return { success: false, error: error };
    }

    let supplier = null;

    try {
      supplier = await repository.findByPk({
        supplier_id: data.params.supplier
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C13H08-02';
      return { success: false, error: error };
    }

    if (!supplier) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C13H08-03';
      return { success: false, error: error };
    }

    let item = null;

    try {
      item = await repository.getItem({
        supplier: supplier,
        item_id: data.params.item,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C13H08-04';
      return { success: false, error: error };
    }

    if (!item) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C13H08-05';
      return { success: false, error: error };
    }

    return { success: true, data: item };
  },

  async updateItem (request) {
    if (!request.token.permissions.includes('update item from supplier')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C13H09-00';
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
      error.code = 'C13H09-01';
      return { success: false, error: error };
    }

    let supplier = null;

    try {
      supplier = await repository.findByPk({
        supplier_id: data.params.supplier
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C13H09-02';
      return { success: false, error: error };
    }

    if (!supplier) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C13H09-03';
      return { success: false, error: error };
    }

    let item = null;

    try {
      item = await repository.getItem({
        supplier: supplier,
        item_id: data.params.item
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C13H09-04';
      return { success: false, error: error };
    }

    if (!item) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C13H09-05';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.updateItem({
        supplier_id: data.params.supplier,
        item_id: data.params.item,
        data: data.body,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C13H09-06';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async removeItem (request) {
    if (!request.token.permissions.includes('remove item from supplier')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C13H10-00';
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
      error.code = 'C13H10-01';
      return { success: false, error: error };
    }

    let supplier = null;

    try {
      supplier = await repository.findByPk({
        supplier_id: data.params.supplier
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C13H10-02';
      return { success: false, error: error };
    }

    if (!supplier) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C13H10-03';
      return { success: false, error: error };
    }

    let item = null;

    try {
      item = await repository.getItem({
        supplier: supplier,
        item_id: data.params.item
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C13H10-04';
      return { success: false, error: error };
    }

    if (!item) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C13H10-05';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.removeItem({
        supplier_id: data.params.supplier,
        item_id: data.params.item,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C13H10-06';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  }
});
