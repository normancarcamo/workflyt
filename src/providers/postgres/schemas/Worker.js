module.exports = function(DataTypes) {
  return {
    name: "Worker",
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
      firstname: {
        type: DataTypes.STRING(30),
        allowNull: false,
        validate: { len: [2, 30], notEmpty: true },
        unique: 'full_name'
      },
      lastname: {
        type: DataTypes.STRING(30),
        allowNull: false,
        validate: { len: [2, 30], notEmpty: true },
        unique: 'full_name'
      },
      is_supervisor: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
      tableName: "worker",
      uniqueKeys: {
        full_name: {
          fields: [ 'firstname', 'lastname' ]
        }
      }
    }
  }
}
