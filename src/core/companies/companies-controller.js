module.exports = service => Object.freeze({
  async getCompanies (request, response, next) {
    let result = await service.getCompanies(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async createCompanies (request, response, next) {
    let result = await service.createCompanies(request);
    if (result.error) {
      next(result.error);
    } else {
      response.status(201).json(result);
    }
  },

  async getCompany (request, response, next) {
    let result = await service.getCompany(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async updateCompany (request, response, next) {
    let result = await service.updateCompany(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async deleteCompany (request, response, next) {
    let result = await service.deleteCompany(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  }
});
