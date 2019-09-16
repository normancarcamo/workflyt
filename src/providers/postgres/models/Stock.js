export function Schema(DataTypes) {
  return {
    name: "Stock",
    attributes: {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        unique: true,
        defaultValue: DataTypes.UUIDV4,
        validate: { isUUID: 4 }
      },
      material_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: false,
        references: {
          model: {
            schema: "public",
            tableName: "material"
          },
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        validate: { isUUID: 4 }
      },
      entries: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
          len: [1, 15],
          isInt: true,
          notEmpty: true
        }
      },
      exits: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
          len: [1, 15],
          isInt: true,
          notEmpty: true
        }
      },
      stocks: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          min: 0,
          len: [1, 15],
          isInt: true,
          notEmpty: true
        }
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
      tableName: "stock"
    }
  }
}

export function Model(sequelize, DataTypes) {
  const { name, attributes, options } = Schema(DataTypes);
  const Stock = sequelize.define(name, attributes, options);

  Stock.associate = function(models) {
    Stock.belongsTo(models.Material, {
      as: "material",
      foreignKey: "material_id"
    });
  }

  return Stock;
}

export default Model;
