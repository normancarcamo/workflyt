"use strict";

const Schema = require("../schemas/quote");

module.exports = {
  up: (queryInterface, Sequelize) => {
    const { name, attributes, options } = Schema(Sequelize);
    return queryInterface.createTable(
      name.toLowerCase(),
      attributes,
      options
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(schema.name.toLowerCase());
  }
};
