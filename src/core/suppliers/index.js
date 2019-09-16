// dependencies:
const database = require('src/providers/postgres');
const helpers = require('src/utils');
const validator = require('./suppliers-validator');
const Repository = require('./suppliers-repository');
const Service = require('./suppliers-service');
const Controller = require('./suppliers-controller');
const Router = require('./suppliers-router');

// compose:
const repository = Repository({ database });
const service = Service({ repository });
const controller = Controller({ service, validator, helpers });
const router = Router(controller);

module.exports = router;
