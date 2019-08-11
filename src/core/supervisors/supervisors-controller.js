module.exports = service => Object.freeze({
  async getSupervisors (request, response, next) {
    let result = await service.getSupervisors(request);
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

  async getEmployees (request, response, next) {
    let result = await service.getEmployees(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  }
});
