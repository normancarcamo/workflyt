// dependencies:
const database = require('src/providers/postgres');
const helpers = require('src/utils');
const validator = require('./users-validator');
const Repository = require('./users-repository');
const Service = require('./users-service');
const Controller = require('./users-controller');
const Router = require('./users-router');

// compose:
const repository = Repository({ database });
const service = Service({ repository, helpers });
const controller = Controller({ service, validator, helpers });
const router = Router(controller);

module.exports = router;
