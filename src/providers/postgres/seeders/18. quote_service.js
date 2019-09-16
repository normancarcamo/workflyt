const { Schema } = require('../models/QuoteService');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const { name, attributes, options } = Schema(Sequelize);
    return queryInterface.bulkInsert(
      options,
      process.env.NODE_ENV === 'test'
        ? require('../fixtures/test/quote_service')
        : require('../fixtures/dev/quote_service'),
      {},
      { extra: { type: new Sequelize.JSON() } }
    );
  },
  down: (queryInterface, Sequelize) => {}
};
