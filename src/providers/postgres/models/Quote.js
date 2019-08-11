export function Schema(DataTypes) {
  return {
    name: "Quote",
    attributes: {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        unique: true,
        defaultValue: DataTypes.UUIDV4,
        validate: { isUUID: 4 }
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
        onDelete: "CASCADE",
        validate: { isUUID: 4 }
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
        onDelete: "CASCADE",
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
        type: DataTypes.STRING,
        allowNull: true,
        unique: false,
        defaultValue: 'No subject',
        validate: { len: [2, 100], notEmpty: true }
      },
      status: {
        type: DataTypes.ENUM([
          "open", "confirmed", "other", "approved",
          "pending", "awaiting", "authorized",
          "cancelled", "done"
        ]),
        allowNull: false,
        defaultValue: "awaiting",
        validate: {
          isIn: [[
            "open", "confirmed", "other", "approved",
            "pending", "awaiting", "authorized",
            "cancelled", "done"
          ]],
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
      tableName: "quote"
    }
  }
}

export function Model(sequelize, DataTypes) {
  const { name, attributes, options } = Schema(DataTypes);
  const Quote = sequelize.define(name, attributes, options);

  Quote.associate = function(models) {
    Quote.hasMany(models.Order, {
      as: {
        singular: "order",
        plural: "orders"
      },
      foreignKey: "quote_id",
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    Quote.belongsTo(models.Customer, {
      as: "customer",
      foreignKey: "customer_id"
    });
    Quote.belongsTo(models.Employee, {
      as: "Salesman",
      foreignKey: "salesman_id"
    });
    Quote.belongsToMany(models.Item, {
      as: {
        singular: "item",
        plural: "items"
      },
      through: models.QuoteItem,
      foreignKey: "quote_id",
      otherKey: "item_id",
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  }

  return Quote;
}

export default Model;
