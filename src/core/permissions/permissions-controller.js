module.exports = service => Object.freeze({
  async getPermissions (request, response, next) {
    let result = await service.getPermissions(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async createPermissions (request, response, next) {
    let result = await service.createPermissions(request);
    if (result.error) {
      next(result.error);
    } else {
      response.status(201).json(result);
    }
  },

  async getPermission (request, response, next) {
    let result = await service.getPermission(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async updatePermission (request, response, next) {
    let result = await service.updatePermission(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async deletePermission (request, response, next) {
    let result = await service.deletePermission(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  }
});
