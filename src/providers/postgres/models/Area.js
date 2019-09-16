const Schema = require('../schemas/Area.js');

module.exports = function(sequelize, DataTypes) {
  const { name, attributes, options } = Schema(DataTypes);
  const Area = sequelize.define(name, attributes, options);

  Area.associate = function(models) {
    Area.belongsToMany(models.Area, {
      as: { singular: "subarea", plural: "subareas" },
      through: models.AreaSubarea,
      foreignKey: "area_id",
      otherKey: "subarea_id",
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    Area.belongsToMany(models.Area, {
      as: { singular: "area", plural: "areas" },
      through: models.AreaSubarea,
      foreignKey: "subarea_id",
      otherKey: "area_id",
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    Area.belongsToMany(models.Worker, {
      as: { singular: "worker", plural: "workers" },
      through: models.AreaWorker,
      foreignKey: "area_id",
      otherKey: "worker_id",
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    Area.hasMany(models.Service, {
      as: { singular: "service", plural: "services" },
      foreignKey: 'area_id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  };

  return Area;
}
