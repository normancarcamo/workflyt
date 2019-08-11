module.exports = service => Object.freeze({
  async getItems (request, response, next) {
    let result = await service.getItems(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async createItems (request, response, next) {
    let result = await service.createItems(request);
    if (result.error) {
      next(result.error);
    } else {
      response.status(201).json(result);
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

  async deleteItem (request, response, next) {
    let result = await service.deleteItem(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async getStocks (request, response, next) {
    let result = await service.getStocks(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async addStocks (request, response, next) {
    let result = await service.addStocks(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async getStock (request, response, next) {
    let result = await service.getStock(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  }
});
