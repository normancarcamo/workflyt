// dependencies:
const database = require('src/providers/postgres');
const helpers = require('src/utils');
const validator = require('./companies-validator');
const Repository = require('./companies-repository');
const Service = require('./companies-service');
const Controller = require('./companies-controller');
const Router = require('./companies-router');

// compose:
const repository = Repository({ database });
const service = Service({ repository });
const controller = Controller({ service, validator, helpers });
const router = Router(controller);

module.exports = router;
