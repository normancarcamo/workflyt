export function Schema(DataTypes) {
  return {
    name: "RolePermission",
    attributes: {
      role_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
          model: {
            schema: "public",
            tableName: "role"
          },
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        validate: { isUUID: 4 }
      },
      permission_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
          model: {
            schema: "public",
            tableName: "permission"
          },
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        validate: { isUUID: 4 }
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
      tableName: "role_permission"
    }
  }
}

export function Model(sequelize, DataTypes) {
  const { name, attributes, options } = Schema(DataTypes);
  const RolePermission = sequelize.define(name, attributes, options);
  return RolePermission;
}

export default Model;
