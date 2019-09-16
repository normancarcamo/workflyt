module.exports = function(DataTypes) {
  return {
    name: "Service",
    attributes: {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        unique: true,
        defaultValue: DataTypes.UUIDV4,
        validate: { isUUID: 4 }
      },
      area_id: {
        type: DataTypes.UUID,
        allowNull: false,
        unique: false,
        references: {
          model: {
            schema: "public",
            tableName: "area"
          },
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
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
      tableName: "service"
    }
  }
}
