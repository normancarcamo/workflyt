module.exports = ({ repository, validator }) => Object.freeze({
  async getCategories (request) {
    if (!request.token.permissions.includes('get categories')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C02H01-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.getCategories.validate({
        query: request.query
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C02H01-01';
      return { success: false, error: error };
    }

    let categories = null;

    try {
      categories = await repository.findAll(data.query);
    } catch (error) {
      error.status = 500;
      error.code = 'C02H01-02';
      return { success: false, error: error };
    }

    return { success: true, data: categories };
  },

  async createCategories (request) {
    if (!request.token.permissions.includes('create categories')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C02H02-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.createCategories.validate({
        body: request.body
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C02H02-01';
      return { success: false, error: error };
    }

    let category = null;

    try {
      category = await repository.create(data.body);
    } catch (error) {
      error.status = 500;
      error.code = 'C02H02-02';
      return { success: false, error: error };
    }

    return { success: true, data: category };
  },

  async getCategory (request) {
    if (!request.token.permissions.includes('get category')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C02H03-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.getCategory.validate({
        params: request.params,
        query: request.query
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C02H03-01';
      return { success: false, error: error };
    }

    let category = null;

    try {
      category = await repository.findByPk({
        category_id: data.params.category,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C02H03-02';
      return { success: false, error: error };
    }

    if (!category) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C02H03-03';
      return { success: false, error: error };
    }

    return { success: true, data: category };
  },

  async updateCategory (request) {
    if (!request.token.permissions.includes('update category')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C02H04-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.updateCategory.validate({
        params: request.params,
        query: request.query,
        body: request.body
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C02H04-01';
      return { success: false, error: error };
    }

    let category = null;

    try {
      category = await repository.findByPk({
        category_id: data.params.category
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C02H04-02';
      return { success: false, error: error };
    }

    if (!category) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C02H04-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.update({
        category_id: data.params.category,
        data: data.body,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C02H04-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async deleteCategory (request) {
    if (!request.token.permissions.includes('delete category')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C02H05-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.deleteCategory.validate({
        params: request.params,
        query: request.query
      });
    } catch (error) {
      error.status = 400;
      error.code = 'C02H05-01';
      return { success: false, error: error };
    }

    let category = null;

    try {
      category = await repository.findByPk({
        category_id: data.params.category
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C02H05-02';
      return { success: false, error: error };
    }

    if (!category) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C02H05-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.destroy({
        category_id: data.params.category,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C02H05-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async getItems (request) {
    if (!request.token.permissions.includes('get items from category')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C02H06-00';
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
      error.code = 'C02H06-01';
      return { success: false, error: error };
    }

    let category = null;

    try {
      category = await repository.findByPk({
        category_id: data.params.category
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C02H06-02';
      return { success: false, error: error };
    }

    if (!category) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C02H06-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.getItems({
        category_id: data.params.category,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C02H06-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async addItems (request) {
    if (!request.token.permissions.includes('add items to category')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C02H07-00';
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
      error.code = 'C02H07-01';
      return { success: false, error: error };
    }

    let category = null;

    try {
      category = await repository.findByPk({
        category_id: data.params.category
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C02H07-02';
      return { success: false, error: error };
    }

    if (!category) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C02H07-03';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.addItems({
        category_id: data.params.category,
        items: data.body.items
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C02H07-04';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  },

  async getItem (request) {
    if (!request.token.permissions.includes('get item from category')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C02H08-00';
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
      error.code = 'C02H08-01';
      return { success: false, error: error };
    }

    let category = null;

    try {
      category = await repository.findByPk({
        category_id: data.params.category
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C02H08-02';
      return { success: false, error: error };
    }

    if (!category) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C02H08-03';
      return { success: false, error: error };
    }

    let item = null;

    try {
      item = await repository.getItem({
        category_id: data.params.category,
        item_id: data.params.item,
        options: data.query
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C02H08-04';
      return { success: false, error: error };
    }

    if (!item) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C02H08-05';
      return { success: false, error: error };
    }

    return { success: true, data: item };
  },

  async removeItem (request) {
    if (!request.token.permissions.includes('remove item from category')) {
      let error = new Error('Forbidden.');
      error.status = 403;
      error.code = 'C02H09-00';
      return { success: false, error: error };
    }

    let data = null;

    try {
      data = await validator.removeItem.validate({ params: request.params });
    } catch (error) {
      error.status = 400;
      error.code = 'C02H09-01';
      return { success: false, error: error };
    }

    let category = null;

    try {
      category = await repository.findByPk({
        category_id: data.params.category
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C02H09-02';
      return { success: false, error: error };
    }

    if (!category) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C02H09-03';
      return { success: false, error: error };
    }

    let item = null;

    try {
      item = await repository.getItem({
        category_id: data.params.category,
        item_id: data.params.item
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C02H09-04';
      return { success: false, error: error };
    }

    if (!item) {
      let error = new Error('Not found.');
      error.status = 404;
      error.code = 'C02H09-05';
      return { success: false, error: error };
    }

    let result = null;

    try {
      result = await repository.removeItem({
        category_id: data.params.category,
        item_id: data.params.item
      });
    } catch (error) {
      error.status = 500;
      error.code = 'C02H09-06';
      return { success: false, error: error };
    }

    return { success: true, data: result };
  }
});
