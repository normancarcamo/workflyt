// dependencies:
const database = require('src/providers/postgres');
const helpers = require('src/utils');
const validator = require('./quotes-validator');
const Repository = require('./quotes-repository');
const Service = require('./quotes-service');
const Controller = require('./quotes-controller');
const Router = require('./quotes-router');

// compose:
const repository = Repository({ database });
const service = Service({ repository });
const controller = Controller({ service, validator, helpers });
const router = Router(controller);

module.exports = router;
