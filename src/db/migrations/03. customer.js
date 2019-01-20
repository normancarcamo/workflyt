"use strict";

const Schema = require("../schemas/customer");

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
