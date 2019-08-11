module.exports = service => Object.freeze({
  async getCategories (request, response, next) {
    let result = await service.getCategories(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async createCategories (request, response, next) {
    let result = await service.createCategories(request);
    if (result.error) {
      next(result.error);
    } else {
      response.status(201).json(result);
    }
  },

  async getCategory (request, response, next) {
    let result = await service.getCategory(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async updateCategory (request, response, next) {
    let result = await service.updateCategory(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async deleteCategory (request, response, next) {
    let result = await service.deleteCategory(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async getItems (request, response, next) {
    let result = await service.getItems(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async addItems (request, response, next) {
    let result = await service.addItems(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async getItem (request, response, next) {
    let result = await service.getItem(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async removeItem (request, response, next) {
    let result = await service.removeItem(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  }
});
