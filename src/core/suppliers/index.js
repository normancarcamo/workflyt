// dependencies:
const database = require('src/providers/postgres');
const schema = require('src/utils/validator');
const Datalizer = require('@ncardez/datalizer');
const Validator = require('./suppliers-validator');
const Repository = require('./suppliers-repository');
const Service = require('./suppliers-service');
const Controller = require('./suppliers-controller');

// compose:
const repository = Repository(database);
const validator = Validator({ schema, Datalizer });
const service = Service({ repository, validator });
const controller = Controller(service);

module.exports = controller;
