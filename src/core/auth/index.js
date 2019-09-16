// dependencies:
const database = require('src/providers/postgres');
const helpers = require('src/utils');
const validator = require('./auth-validator');
const Repository = require('./auth-repository');
const UserRepository = require('../users/users-repository');
const Service = require('./auth-service');
const Controller = require('./auth-controller');
const Router = require('./auth-router');

// compose:
const repository = Repository({ User: UserRepository({ database }) });
const service = Service({ repository, helpers });
const controller = Controller({ service, validator, helpers });
const router = Router(controller);

module.exports = router;
