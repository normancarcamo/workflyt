module.exports = service => Object.freeze({
  async signIn (request, response, next) {
    let result = await service.signIn(request);
    if (result.error) {
      next(result.error);
    } else {
      response.json(result);
    }
  },

  async signUp (request, response, next) {
    let result = await service.signUp(request);
    if (result.error) {
      next(result.error);
    } else {
      response.status(201).json(result);
    }
  }
});
