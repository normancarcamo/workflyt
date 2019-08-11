module.exports = service => Object.freeze({
  async getEmployees (request, response, next) {
    let result = await service.getEmployees(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async createEmployees (request, response, next) {
    let result = await service.createEmployees(request);
    if (result.error) {
      next(result.error);
    } else {
      response.status(201).json(result);
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

  async deleteEmployee (request, response, next) {
    let result = await service.deleteEmployee(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async getUser (request, response, next) {
    let result = await service.getUser(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async setUser (request, response, next) {
    let result = await service.setUser(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async removeUser (request, response, next) {
    let result = await service.removeUser(request);
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
  },

  async getSupervisors (request, response, next) {
    let result = await service.getSupervisors(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async addSupervisors (request, response, next) {
    let result = await service.addSupervisors(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async getSupervisor (request, response, next) {
    let result = await service.getSupervisor(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async updateSupervisor (request, response, next) {
    let result = await service.updateSupervisor(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async removeSupervisor (request, response, next) {
    let result = await service.removeSupervisor(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  }
});
