// dependencies:
const database = require('src/providers/postgres');
const helpers = require('src/utils');
const validator = require('./workers-validator');
const Repository = require('./workers-repository');
const Service = require('./workers-service');
const Controller = require('./workers-controller');
const Router = require('./workers-router');

// compose:
const repository = Repository({ database });
const service = Service({ repository });
const controller = Controller({ service, validator, helpers });
const router = Router(controller);

module.exports = router;
