const { Schema } = require('../models/Job');

module.exports = {
  up: (queryInterface, Sequelize) => {
    const { name, attributes, options } = Schema(Sequelize);
    return queryInterface.createTable(
      options.tableName,
      attributes,
      options
    ).then(() => queryInterface.addConstraint('job', ['progress'], {
      type: 'check',
      where: {
        progress: {
          [Sequelize.Op.between]: [ 0, 100 ]
        }
      }
    }));
  },

  down: (queryInterface, Sequelize) => {
    const { options } = Schema(Sequelize);
    return queryInterface.dropTable(options.tableName);
  }
};
