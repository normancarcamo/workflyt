module.exports = service => Object.freeze({
  async getCustomers (request, response, next) {
    let result = await service.getCustomers(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async createCustomers (request, response, next) {
    let result = await service.createCustomers(request);
    if (result.error) {
      next(result.error);
    } else {
      response.status(201).json(result);
    }
  },

  async getCustomer (request, response, next) {
    let result = await service.getCustomer(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async updateCustomer (request, response, next) {
    let result = await service.updateCustomer(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async deleteCustomer (request, response, next) {
    let result = await service.deleteCustomer(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async getQuotes (request, response, next) {
    let result = await service.getQuotes(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async addQuotes (request, response, next) {
    let result = await service.addQuotes(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async getQuote (request, response, next) {
    let result = await service.getQuote(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  }
});
