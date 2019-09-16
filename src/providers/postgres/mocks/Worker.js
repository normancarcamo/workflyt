const SequelizeMock = require('sequelize-mock');
const dbMock = new SequelizeMock();

const Worker = dbMock.define('Worker', {
  code: 'WRK/001',
  firstname: 'fake firstname',
  lastname: 'fake lastname',
  extra: {},
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null,
  created_by: null,
  updated_by: null,
  deleted_by: null
}, {
  schema: "public",
  tableName: "worker"
});

module.exports = Worker;
