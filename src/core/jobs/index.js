// dependencies:
const database = require('src/providers/postgres');
const helpers = require('src/utils');
const validator = require('./jobs-validator');
const Repository = require('./jobs-repository');
const Service = require('./jobs-service');
const Controller = require('./jobs-controller');
const Router = require('./jobs-router');

// compose:
const repository = Repository({ database });
const service = Service({ repository });
const controller = Controller({ service, validator, helpers });
const router = Router(controller);

module.exports = router;
