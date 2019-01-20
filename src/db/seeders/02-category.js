'use strict';

const Schema = require("../schemas/category");
const records = require('../fixtures/category');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const { options } = Schema(Sequelize);
    return queryInterface.bulkInsert(options, records, {}, {
      extra: { type: new Sequelize.JSON() }
    });
  },
  down: (queryInterface, Sequelize) => {}
};
