'use strict';

const Schema = require("../schemas/order");
const records = require('../fixtures/order');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const { name, attributes, options } = Schema(Sequelize);
    return queryInterface.bulkInsert(options, records, {}, {
      extra: { type: new Sequelize.JSON() }
    });
  },
  down: (queryInterface, Sequelize) => {}
};
