const { Schema } = require('../models/Material');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const { name, attributes, options } = Schema(Sequelize);
    return queryInterface.bulkInsert(
      options,
      process.env.NODE_ENV === 'test'
        ? require('../fixtures/test/material')
        : require('../fixtures/dev/material'),
      {},
      { extra: { type: new Sequelize.JSON() } }
    );
  },
  down: (queryInterface, Sequelize) => {}
};
