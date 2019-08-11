export function Schema(DataTypes) {
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
        unique: false,
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
      type: {
        type: DataTypes.ENUM([ "work", "installation" ]),
        allowNull: false,
        defaultValue: "work",
        validate: {
          isIn: [[ "work", "installation" ]],
          notEmpty: true
        }
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
      tableName: "orders"
    }
  }
}

export function Model(sequelize, DataTypes) {
  const { name, attributes, options } = Schema(DataTypes);
  const Order = sequelize.define(name, attributes, options);

  Order.associate = function(models) {
    Order.belongsTo(models.Quote, {
      as: "quote",
      foreignKey: "quote_id"
    });
    Order.belongsToMany(models.Department, {
      as: {
        singular: "department",
        plural: "departments"
      },
      through: models.OrderDepartment,
      foreignKey: "order_id",
      otherKey: "department_id",
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    Order.belongsToMany(models.Item, {
      as: {
        singular: "item",
        plural: "items"
      },
      through: models.OrderItem,
      foreignKey: "order_id",
      otherKey: "item_id",
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    Order.belongsToMany(models.Employee, {
      as: {
        singular: "employee",
        plural: "employees"
      },
      through: models.OrderEmployee,
      foreignKey: "order_id",
      otherKey: "employee_id",
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  }

  return Order;
}

export default Model;
