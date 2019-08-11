export function Schema(DataTypes) {
  return {
    name: "Item",
    attributes: {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        unique: true,
        defaultValue: DataTypes.UUIDV4,
        validate: { isUUID: 4 }
      },
      category_id: {
        type: DataTypes.UUID,
        allowNull: true,
        unique: false,
        references: {
          model: {
            schema: "public",
            tableName: "category"
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
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
        validate: { len: [2, 200], notEmpty: true }
      },
      type: {
        type: DataTypes.ENUM([ "service", "product", "material" ]),
        allowNull: false,
        defaultValue: "service",
        validate: {
          isIn: [[ "service", "product", "material" ]],
          notEmpty: true
        }
      },
      stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: { min: 0, len: [1, 15], isInt: true, notEmpty: true }
      },
      price: {
        type: DataTypes.NUMERIC(10,2),
        allowNull: false,
        defaultValue: 0.0,
        validate: { isDecimal: true, min: 0, len: [1, 15], notEmpty: true }
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
      tableName: "item"
    }
  }
}

export function Model(sequelize, DataTypes) {
  const { name, attributes, options } = Schema(DataTypes);
  const Item = sequelize.define(name, attributes, options);

  Item.associate = function(models) {
    Item.belongsTo(models.Category, {
      as: 'category',
      foreignKey: 'category_id'
    });
    Item.hasMany(models.Stock, {
      as: {
        singular: "stock",
        plural: "stocks"
      },
      foreignKey: "item_id",
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    Item.belongsToMany(models.Warehouse, {
      as: {
        singular: "warehouse",
        plural: "warehouses"
      },
      through: models.WarehouseItem,
      foreignKey: "item_id",
      otherKey: "warehouse_id",
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    Item.belongsToMany(models.Supplier, {
      as: {
        singular: "supplier",
        plural: "suppliers"
      },
      through: models.SupplierItem,
      foreignKey: "item_id",
      otherKey: "supplier_id",
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    Item.belongsToMany(models.Order, {
      as: {
        singular: "order",
        plural: "orders"
      },
      through: models.OrderItem,
      foreignKey: "item_id",
      otherKey: "order_id",
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    Item.belongsToMany(models.Quote, {
      as: {
        singular: "quote",
        plural: "quotes"
      },
      through: models.QuoteItem,
      foreignKey: "item_id",
      otherKey: "quote_id",
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  }

  return Item;
}

export default Model;
