const { Schema } = require('../models/JobSubjob');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const { name, attributes, options } = Schema(Sequelize);
    return queryInterface.createTable(
      options.tableName,
      attributes,
      options
    );
  },

  down: (queryInterface, Sequelize) => {
    const { options } = Schema(Sequelize);
    return queryInterface.dropTable(options.tableName);
  }
};
