const { NotFoundError } = require("@playscode/fns/lib/errors");

module.exports = function(action, param, req, next) {
  action.then(results => {
    if (results) {
      req[param] = results;
      next();
    } else {
      let name = param[0].toUpperCase() + param.substr(1).toLowerCase();
      next(new NotFoundError(`${name} not found.`));
    }
    return null;
  }).catch(next);
}
