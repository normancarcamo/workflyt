// dependencies:
const database = require('src/providers/postgres');
const helpers = require('src/utils');
const validator = require('./roles-validator');
const Repository = require('./roles-repository');
const Service = require('./roles-service');
const Controller = require('./roles-controller');
const Router = require('./roles-router');

// compose:
const repository = Repository({ database });
const service = Service({ repository });
const controller = Controller({ service, validator, helpers });
const router = Router(controller);

module.exports = router;
