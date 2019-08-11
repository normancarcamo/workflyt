module.exports = service => Object.freeze({
  async getRoles (request, response, next) {
    let result = await service.getRoles(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async createRoles (request, response, next) {
    let result = await service.createRoles(request);
    if (result.error) {
      next(result.error);
    } else {
      response.status(201).json(result);
    }
  },

  async getRole (request, response, next) {
    let result = await service.getRole(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async updateRole (request, response, next) {
    let result = await service.updateRole(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async deleteRole (request, response, next) {
    let result = await service.deleteRole(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async getPermissions (request, response, next) {
    let result = await service.getPermissions(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async addPermissions (request, response, next) {
    let result = await service.addPermissions(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
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

  async removePermission (request, response, next) {
    let result = await service.removePermission(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  }
});
