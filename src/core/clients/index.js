// dependencies:
const database = require('src/providers/postgres');
const helpers = require('src/utils');
const validator = require('./clients-validator');
const Repository = require('./clients-repository');
const Service = require('./clients-service');
const Controller = require('./clients-controller');
const Router = require('./clients-router');

// compose:
const repository = Repository({ database });
const service = Service({ repository });
const controller = Controller({ service, validator, helpers });
const router = Router(controller);

module.exports = router;
