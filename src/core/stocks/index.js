// dependencies:
const database = require('src/providers/postgres');
const helpers = require('src/utils');
const validator = require('./stocks-validator');
const Repository = require('./stocks-repository');
const Service = require('./stocks-service');
const Controller = require('./stocks-controller');
const Router = require('./stocks-router');

// compose:
const repository = Repository({ database });
const service = Service({ repository });
const controller = Controller({ service, validator, helpers });
const router = Router(controller);

module.exports = router;
