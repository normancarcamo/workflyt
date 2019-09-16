// dependencies:
const database = require('src/providers/postgres');
const helpers = require('src/utils');
const validator = require('./materials-validator');
const Repository = require('./materials-repository');
const Service = require('./materials-service');
const Controller = require('./materials-controller');
const Router = require('./materials-router');

// compose:
const repository = Repository({ database });
const service = Service({ repository });
const controller = Controller({ service, validator, helpers });
const router = Router(controller);

module.exports = router;
