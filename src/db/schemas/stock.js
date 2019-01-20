"use strict";

module.exports = function(DataTypes) {
  return {
    name: "Stock",
    attributes: {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        unique: true,
        defaultValue: DataTypes.UUIDV4
      },
      item_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: {
            schema: "nz",
            tableName: "item"
          },
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      entries: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      exits: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
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
      tableName: "stock"
    }
  }
}
