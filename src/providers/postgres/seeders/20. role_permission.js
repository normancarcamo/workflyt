const { Schema } = require('../models/RolePermission');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const { name, attributes, options } = Schema(Sequelize);
    return queryInterface.bulkInsert(
      options,
      process.env.NODE_ENV === 'test'
        ? require('../fixtures/test/role_permission')
        : require('../fixtures/dev/role_permission'),
      {},
      { extra: { type: new Sequelize.JSON() } }
    );
  },
  down: (queryInterface, Sequelize) => {}
};
