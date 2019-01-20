"use strict";

module.exports = function(DataTypes) {
  return {
    name: "Order",
    attributes: {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        unique: true,
        defaultValue: DataTypes.UUIDV4
      },
      quote_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: {
            tableName: "quote",
            schema: "nz"
          },
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      code: {
        type: DataTypes.STRING(10),
        allowNull: false,
        unique: true,
        defaultValue: "unset"
      },
      type: {
        type: DataTypes.ENUM([ "work", "installation" ]),
        allowNull: false,
        defaultValue: "work"
      },
      status: {
        type: DataTypes.ENUM([ "awaiting", "working", "canceled", "done" ]),
        allowNull: false,
        defaultValue: "awaiting"
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
      tableName: "order"
    }
  }
}
