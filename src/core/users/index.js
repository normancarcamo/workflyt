// dependencies:
const database = require('src/providers/postgres');
const schema = require('src/utils/validator');
const Datalizer = require('@ncardez/datalizer');
const bcrypt = require('bcrypt');
const Adapter = require('./users-adapter');
const Validator = require('./users-validator');
const Repository = require('./users-repository');
const Service = require('./users-service');
const Controller = require('./users-controller');

// compose:
const repository = Repository(database);
const validator = Validator({ schema, Datalizer });
const adapter = Adapter({ bcrypt });
const service = Service({ repository, validator, adapter });
const controller = Controller(service);

module.exports = controller;
