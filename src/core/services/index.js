// dependencies:
const database = require('src/providers/postgres');
const helpers = require('src/utils');
const validator = require('./services-validator');
const Repository = require('./services-repository');
const Service = require('./services-service');
const Controller = require('./services-controller');
const Router = require('./services-router');

// compose:
const repository = Repository({ database });
const service = Service({ repository });
const controller = Controller({ service, validator, helpers });
const router = Router(controller);

module.exports = router;
