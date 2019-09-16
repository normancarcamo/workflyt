const UserRepository = require('src/core/users/users-repository');
const AuthRepository = require('src/core/auth/auth-repository');
const AuthService = require('src/core/auth/auth-service');
const database = require('test/config/database');
const helpers = require('src/utils');

module.exports.onBeforeEach = callback => () => {
  let repository = AuthRepository({ User: UserRepository({ database })});
  let service = AuthService({ repository, helpers });
  callback(repository, service);
};
