// dependencies:
const database = require('src/providers/postgres');
const helpers = require('src/utils');
const validator = require('./categories-validator');
const Repository = require('./categories-repository');
const Service = require('./categories-service');
const Controller = require('./categories-controller');
const Router = require('./categories-router');

// compose:
const repository = Repository({ database });
const service = Service({ repository });
const controller = Controller({ service, validator, helpers });
const router = Router(controller);

module.exports = router;
