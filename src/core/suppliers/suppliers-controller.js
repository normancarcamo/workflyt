module.exports = service => Object.freeze({
  async getSuppliers (request, response, next) {
    let result = await service.getSuppliers(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async createSuppliers (request, response, next) {
    let result = await service.createSuppliers(request);
    if (result.error) {
      next(result.error);
    } else {
      response.status(201).json(result);
    }
  },

  async getSupplier (request, response, next) {
    let result = await service.getSupplier(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async updateSupplier (request, response, next) {
    let result = await service.updateSupplier(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async deleteSupplier (request, response, next) {
    let result = await service.deleteSupplier(request);
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
