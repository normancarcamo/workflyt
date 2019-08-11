module.exports = service => Object.freeze({
  async getQuotes (request, response, next) {
    let result = await service.getQuotes(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async createQuotes (request, response, next) {
    let result = await service.createQuotes(request);
    if (result.error) {
      next(result.error);
    } else {
      response.status(201).json(result);
    }
  },

  async getQuote (request, response, next) {
    let result = await service.getQuote(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async updateQuote (request, response, next) {
    let result = await service.updateQuote(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async deleteQuote (request, response, next) {
    let result = await service.deleteQuote(request);
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
  },

  async getOrders (request, response, next) {
    let result = await service.getOrders(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async addOrders (request, response, next) {
    let result = await service.addOrders(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async getOrder (request, response, next) {
    let result = await service.getOrder(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  }
});
