module.exports = function(Model, opts) {
  return function(req, res, next) {
    if (Array.isArray(req.body.id) && req.query.prematch) {
      Model
        .match(req.body.id, { type: req.query.type, ...opts })
        .then(() => next())
        .catch(next);
    } else {
      next();
    }
  }
}
