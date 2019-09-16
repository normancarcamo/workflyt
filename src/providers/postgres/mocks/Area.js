const SequelizeMock = require('sequelize-mock');
const Worker = require('./Worker.js');
const Service = require('./Service.js');

const dbMock = new SequelizeMock();

const Area = dbMock.define('Area', {
  code: 'ARE/001',
  name: 'fake area name',
  extra: {},
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null,
  created_by: null,
  updated_by: null,
  deleted_by: null
}, {
  schema: "public",
  tableName: "area"
});

module.exports = Area;
