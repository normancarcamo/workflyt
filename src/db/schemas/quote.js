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
        allowNull: false,
        unique: false,
        references: {
          model: {
            schema: "public",
            tableName: "customer"
          },
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      salesman_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: false,
        references: {
          model: {
            schema: "public",
            tableName: "employee"
          },
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      code: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        defaultValue: 'unset'
      },
      subject: {
        type: DataTypes.STRING,
        allowNull: true,
        unique: false,
        defaultValue: 'No subject'
      },
      status: {
        type: DataTypes.ENUM([
          "open", "confirmed", "other", "approved",
          "pending", "awaiting", "authorized",
          "cancelled", "done"
        ]),
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
      tableName: "quote"
    }
  }
}
