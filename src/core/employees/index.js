// dependencies:
const database = require('src/providers/postgres');
const schema = require('src/utils/validator');
const Datalizer = require('@ncardez/datalizer');
const Validator = require('./employees-validator');
const Repository = require('./employees-repository');
const Service = require('./employees-service');
const Controller = require('./employees-controller');

// compose:
const repository = Repository(database);
const validator = Validator({ schema, Datalizer });
const service = Service({ repository, validator });
const controller = Controller(service);

module.exports = controller;
