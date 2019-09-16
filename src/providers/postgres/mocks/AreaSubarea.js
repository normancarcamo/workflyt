const SequelizeMock = require('sequelize-mock');
const Area = require('./Area.js');

const sequelize = new SequelizeMock();

const AreaSubarea = sequelize.define('AreaSubarea', {
  area_id: Area.id,
  subarea_id: Area.id,
  extra: {},
  created_at: new Date(),
  updated_at: new Date(),
  deleted_at: null,
  created_by: null,
  updated_by: null,
  deleted_by: null
}, {
  schema: "public",
  tableName: "area_subarea"
});

module.exports = AreaSubarea;
