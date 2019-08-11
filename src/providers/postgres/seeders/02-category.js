const { Schema } = require('../models/Category');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const { options } = Schema(Sequelize);
    return queryInterface.bulkInsert(
      options,
      process.env.NODE_ENV === 'test'
        ? require('../fixtures/test/category')
        : require('../fixtures/dev/category'),
      {},
      { extra: { type: new Sequelize.JSON() } }
    );
  },
  down: (queryInterface, Sequelize) => {}
};
