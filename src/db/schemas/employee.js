"use strict";

module.exports = function(DataTypes) {
  return {
    name: "Employee",
    attributes: {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        unique: true,
        defaultValue: DataTypes.UUIDV4
      },
      supervisor_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: {
            tableName: "employee",
            schema: "nz"
          },
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      department_id: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
          model: {
            tableName: "department",
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
      firstname: {
        type: DataTypes.STRING(30),
        allowNull: false
      },
      lastname: {
        type: DataTypes.STRING(30),
        allowNull: false
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
      tableName: "employee"
    }
  }
}
