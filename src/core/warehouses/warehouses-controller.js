module.exports = service => Object.freeze({
  async getWarehouses (request, response, next) {
    let result = await service.getWarehouses(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async createWarehouses (request, response, next) {
    let result = await service.createWarehouses(request);
    if (result.error) {
      next(result.error);
    } else {
      response.status(201).json(result);
    }
  },

  async getWarehouse (request, response, next) {
    let result = await service.getWarehouse(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async updateWarehouse (request, response, next) {
    let result = await service.updateWarehouse(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async deleteWarehouse (request, response, next) {
    let result = await service.deleteWarehouse(request);
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

  async updateItem (request, response, next) {
    let result = await service.updateItem(request);
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
