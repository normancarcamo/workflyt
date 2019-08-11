// dependencies:
const database = require('src/providers/postgres');
const Datalizer = require('@ncardez/datalizer');
const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Repository = require('./auth-repository');
const Service = require('./auth-service');
const Validator = require('./auth-validator');
const Adapter = require('./auth-adapter');
const Controller = require('./auth-controller');

// compose:
const repository = Repository(database);
const validator = Validator({ Datalizer });
const adapter = Adapter({ bcrypt, jsonwebtoken });
const service = Service({ repository, validator, adapter });
const controller = Controller(service);

module.exports = controller;
