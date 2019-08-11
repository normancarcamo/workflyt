module.exports = service => Object.freeze({
  async getOrders (request, response, next) {
    let result = await service.getOrders(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async createOrders (request, response, next) {
    let result = await service.createOrders(request);
    if (result.error) {
      next(result.error);
    } else {
      response.status(201).json(result);
    }
  },

  async getOrder (request, response, next) {
    let result = await service.getOrder(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async updateOrder (request, response, next) {
    let result = await service.updateOrder(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async deleteOrder (request, response, next) {
    let result = await service.deleteOrder(request);
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

  async getDepartments (request, response, next) {
    let result = await service.getDepartments(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async addDepartments (request, response, next) {
    let result = await service.addDepartments(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async getDepartment (request, response, next) {
    let result = await service.getDepartment(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async updateDepartment (request, response, next) {
    let result = await service.updateDepartment(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async removeDepartment (request, response, next) {
    let result = await service.removeDepartment(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async getEmployees (request, response, next) {
    let result = await service.getEmployees(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async addEmployees (request, response, next) {
    let result = await service.addEmployees(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async getEmployee (request, response, next) {
    let result = await service.getEmployee(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async updateEmployee (request, response, next) {
    let result = await service.updateEmployee(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async removeEmployee (request, response, next) {
    let result = await service.removeEmployee(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  }
});
