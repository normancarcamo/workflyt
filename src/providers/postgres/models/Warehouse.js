export function Schema(DataTypes) {
  return {
    name: "Warehouse",
    attributes: {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        unique: true,
        defaultValue: DataTypes.UUIDV4,
        validate: { isUUID: 4 }
      },
      code: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        defaultValue: 'unset',
        validate: { notEmpty: true }
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: { len: [2, 100], notEmpty: true }
      },
      extra: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        validate: { isDate: true }
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW,
        validate: { isDate: true }
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true
      },
      created_by: {
        type: DataTypes.UUID,
        allowNull: true,
        unique: false,
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      updated_by: {
        type: DataTypes.UUID,
        allowNull: true,
        unique: false,
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      deleted_by: {
        type: DataTypes.UUID,
        allowNull: true,
        unique: false,
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      }
    },
    options: {
      schema: "public",
      tableName: "warehouse"
    }
  }
}

export function Model(sequelize, DataTypes) {
  const { name, attributes, options } = Schema(DataTypes);
  const Warehouse = sequelize.define(name, attributes, options);

  Warehouse.associate = function(models) {
    Warehouse.belongsToMany(models.Material, {
      as: { singular: 'material', plural: 'materials' },
      through: models.WarehouseMaterial,
      foreignKey: "warehouse_id",
      otherKey: "material_id",
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  }

  return Warehouse;
}

export default Model;
