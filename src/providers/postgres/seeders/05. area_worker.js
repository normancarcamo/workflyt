const { Schema } = require('../models/AreaWorker');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const { name, attributes, options } = Schema(Sequelize);
    return queryInterface.bulkInsert(
      options,
      process.env.NODE_ENV === 'test'
        ? require('../fixtures/test/area_worker')
        : require('../fixtures/dev/area_worker'),
      {},
      { extra: { type: new Sequelize.JSON() } }
    );
  },
  down: (queryInterface, Sequelize) => {}
};
