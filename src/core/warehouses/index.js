// dependencies:
const database = require('src/providers/postgres');
const helpers = require('src/utils');
const validator = require('./warehouses-validator');
const Repository = require('./warehouses-repository');
const Service = require('./warehouses-service');
const Controller = require('./warehouses-controller');
const Router = require('./warehouses-router');

// compose:
const repository = Repository({ database });
const service = Service({ repository });
const controller = Controller({ service, validator, helpers });
const router = Router(controller);

module.exports = router;
