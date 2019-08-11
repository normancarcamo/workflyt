module.exports = service => Object.freeze({
  async getStocks (request, response, next) {
    let result = await service.getStocks(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async createStocks (request, response, next) {
    let result = await service.createStocks(request);
    if (result.error) {
      next(result.error);
    } else {
      response.status(201).json(result);
    }
  },

  async getStock (request, response, next) {
    let result = await service.getStock(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async updateStock (request, response, next) {
    let result = await service.updateStock(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async deleteStock (request, response, next) {
    let result = await service.deleteStock(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  }
});
