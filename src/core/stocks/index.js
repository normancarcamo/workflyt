// dependencies:
const database = require('src/providers/postgres');
const schema = require('src/utils/validator');
const Datalizer = require('@ncardez/datalizer');
const Validator = require('./stocks-validator');
const Repository = require('./stocks-repository');
const Service = require('./stocks-service');
const Controller = require('./stocks-controller');

// compose:
const repository = Repository(database);
const validator = Validator({ schema, Datalizer });
const service = Service({ repository, validator });
const controller = Controller(service);

module.exports = controller;
