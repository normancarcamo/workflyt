// dependencies:
const database = require('src/providers/postgres');
const schema = require('src/utils/validator');
const Datalizer = require('@ncardez/datalizer');
const Validator = require('./supervisors-validator');
const Repository = require('./supervisors-repository');
const Service = require('./supervisors-service');
const Controller = require('./supervisors-controller');

// compose:
const repository = Repository(database);
const validator = Validator({ schema, Datalizer });
const service = Service({ repository, validator });
const controller = Controller(service);

module.exports = controller;
