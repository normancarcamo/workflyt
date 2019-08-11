// dependencies:
const database = require('src/providers/postgres');
const schema = require('src/utils/validator');
const Datalizer = require('@ncardez/datalizer');
const Validator = require('./quotes-validator');
const Repository = require('./quotes-repository');
const Service = require('./quotes-service');
const Controller = require('./quotes-controller');

// compose:
const repository = Repository(database);
const validator = Validator({ schema, Datalizer });
const service = Service({ repository, validator });
const controller = Controller(service);

module.exports = controller;
