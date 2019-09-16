// dependencies:
const database = require('src/providers/postgres');
const helpers = require('src/utils');
const validator = require('./areas-validator');
const Repository = require('./areas-repository');
const Service = require('./areas-service');
const Controller = require('./areas-controller');
const Router = require('./areas-router');

// compose:
const repository = Repository({ database });
const service = Service({ repository });
const controller = Controller({ service, validator, helpers });
const router = Router(controller);

module.exports = router;
