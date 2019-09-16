export function Schema(DataTypes) {
  return {
    name: "Role",
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
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true,
        validate: { len: [2, 50], notEmpty: true }
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
      tableName: "role"
    }
  }
}

export function Model(sequelize, DataTypes) {
  const { name, attributes, options } = Schema(DataTypes);
  const Role = sequelize.define(name, attributes, options);

  Role.associate = function(models) {
    Role.belongsToMany(models.User, {
      as: { singular: "user", plural: "users" },
      through: models.UserRole,
      foreignKey: "role_id",
      otherKey: "user_id",
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    Role.belongsToMany(models.Permission, {
      as: { singular: "permission", plural: "permissions" },
      through: models.RolePermission,
      foreignKey: "role_id",
      otherKey: "permission_id",
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  }

  return Role;
}

export default Model;
