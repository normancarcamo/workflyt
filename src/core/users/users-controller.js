module.exports = service => Object.freeze({
  async getUsers (request, response, next) {
    let result = await service.getUsers(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async createUsers (request, response, next) {
    let result = await service.createUsers(request);
    if (result.error) {
      next(result.error);
    } else {
      response.status(201).json(result);
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

  async updateUser (request, response, next) {
    let result = await service.updateUser(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async deleteUser (request, response, next) {
    let result = await service.deleteUser(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async getRoles (request, response, next) {
    let result = await service.getRoles(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async addRoles (request, response, next) {
    let result = await service.addRoles(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
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

  async removeRole (request, response, next) {
    let result = await service.removeRole(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  }
});
