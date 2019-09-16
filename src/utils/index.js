const middlewares = require('./middlewares');
const helpers = require('./helpers');
const logger = require('./logger');
const shared = require('./validator');

module.exports = {
  ...middlewares,
  ...helpers,
  logger: { options: logger },
  validator: { schema: { shared } }
};

// TODO: tokenBlackListValidation
// TODO: validateSession (redis)
// TODO: validateCookie (cookie-parser)
// TODO: validateWS (socket.io)
// TODO: validateEvents (kafka)
// TODO: validateAgainstXSS
// TODO: OAuth2Validation
