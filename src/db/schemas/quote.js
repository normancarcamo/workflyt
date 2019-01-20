"use strict";

module.exports = function(DataTypes) {
  return {
    name: "Quote",
    attributes: {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        unique: true,
        defaultValue: DataTypes.UUIDV4
      },
      customer_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: {
            schema: "nz",
            tableName: "customer"
          },
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      salesman_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: {
            schema: "nz",
            tableName: "employee"
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
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "quote"
      },
      status: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: "open"
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
      tableName: "quote"
    }
  }
}
