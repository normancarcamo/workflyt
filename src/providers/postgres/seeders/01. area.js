const Schema = require('../schemas/Area');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const { name, attributes, options } = Schema(Sequelize);
    return queryInterface.bulkInsert(
      options,
      process.env.NODE_ENV === 'test'
        ? require('../fixtures/test/area')
        : require('../fixtures/dev/area'),
      {},
      { extra: { type: new Sequelize.JSON() } }
    );
  },
  down: (queryInterface, Sequelize) => {}
};
