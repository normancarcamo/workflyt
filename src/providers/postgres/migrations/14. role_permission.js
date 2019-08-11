const { Schema } = require('../models/RolePermission');

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
    return queryInterface.dropTable(schema.name.toLowerCase());
  }
};
