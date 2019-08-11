module.exports = service => Object.freeze({
  async getDepartments (request, response, next) {
    let result = await service.getDepartments(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async createDepartments (request, response, next) {
    let result = await service.createDepartments(request);
    if (result.error) {
      next(result.error);
    } else {
      response.status(201).json(result);
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

  async deleteDepartment (request, response, next) {
    let result = await service.deleteDepartment(request);
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
