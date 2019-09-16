const SequelizeMock = require('sequelize-mock');
const Area = require('./Area.js');

const sequelize = new SequelizeMock();

const Service = sequelize.define('Service', {
  code: 'SER/001',
  name: 'fake service name',
  extra: {},
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null,
  created_by: null,
  updated_by: null,
  deleted_by: null
}, {
  schema: "public",
  tableName: "service"
});

Service.associate = function(models) {
  Service.belongsTo(models.Area, {
    as: "area",
    foreignKey: "area_id"
  });
}

module.exports = Service;
