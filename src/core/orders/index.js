// dependencies:
const database = require('src/providers/postgres');
const helpers = require('src/utils');
const validator = require('./orders-validator');
const Repository = require('./orders-repository');
const Service = require('./orders-service');
const Controller = require('./orders-controller');
const Router = require('./orders-router');

// compose:
const repository = Repository({ database });
const service = Service({ repository });
const controller = Controller({ service, validator, helpers });
const router = Router(controller);

module.exports = router;
