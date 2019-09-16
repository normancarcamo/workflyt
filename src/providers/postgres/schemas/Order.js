module.exports = function(DataTypes) {
  return {
    name: "Order",
    attributes: {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        unique: true,
        defaultValue: DataTypes.UUIDV4,
        validate: { isUUID: 4 }
      },
      quote_id: {
        type: DataTypes.UUID,
        allowNull: true,
        unique: 'unique_order',
        references: {
          model: {
            tableName: "quote",
            schema: "public"
          },
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
        validate: { isUUID: 4 }
      },
      code: {
        type: DataTypes.STRING(20),
        allowNull: false,
        unique: true,
        defaultValue: 'unset',
        validate: { notEmpty: true }
      },
      subject: {
        type: DataTypes.STRING(100),
        allowNull: true,
        unique: false,
        defaultValue: 'No extra details',
        validate: { len: [2, 150], notEmpty: true }
      },
      status: {
        type: DataTypes.ENUM([ "awaiting", "working", "cancelled", "done" ]),
        allowNull: false,
        defaultValue: "awaiting",
        validate: {
          isIn: [[ "awaiting", "working", "cancelled", "done" ]],
          notEmpty: true
        }
      },
      priority: {
        type: DataTypes.ENUM([ "high", "medium", "low" ]),
        allowNull: false,
        defaultValue: "low",
        validate: {
          isIn: [[ "high", "medium", "low" ]],
          notEmpty: true
        }
      },
      progress: {
        type: DataTypes.DECIMAL(5, 2),
        allowNull: false,
        defaultValue: 0.0,
        validate: {
          isDecimal: true,
          min: 0,
          max: 100,
          notEmpty: true
        }
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
      tableName: "orders",
      uniqueKeys: {
        unique_order: {
          fields: [ 'id', 'quote_id' ]
        }
      }
    }
  }
}
