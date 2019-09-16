// dependencies:
const database = require('src/providers/postgres');
const helpers = require('src/utils');
const validator = require('./permissions-validator');
const Repository = require('./permissions-repository');
const Service = require('./permissions-service');
const Controller = require('./permissions-controller');
const Router = require('./permissions-router');

// compose:
const repository = Repository({ database });
const service = Service({ repository });
const controller = Controller({ service, validator, helpers });
const router = Router(controller);

module.exports = router;
