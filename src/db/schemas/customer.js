"use strict";

module.exports = function(DataTypes) {
  return {
    name: "Customer",
    attributes: {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        unique: true,
        defaultValue: DataTypes.UUIDV4
      },
      code: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true,
        defaultValue: "unset"
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
      },
      extra: {
        type: DataTypes.JSONB,
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      },
      deleted_at: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    options: {
      schema: "nz",
      tableName: "customer"
    }
  }
}
