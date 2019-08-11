export function Schema(DataTypes) {
  return {
    name: "User",
    attributes: {
      id: {
        type: DataTypes.UUID,
        primaryKey: true,
        allowNull: false,
        unique: true,
        defaultValue: DataTypes.UUIDV4,
        validate: { isUUID: 4 }
      },
      employee_id: {
        type: DataTypes.UUID,
        allowNull: true,
        unique: false,
        references: {
          model: {
            tableName: "employee",
            schema: "public"
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
      username: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: true,
        validate: { len: [2, 100], notEmpty: true }
      },
      password: {
        type: DataTypes.STRING(250),
        allowNull: false,
        validate: { len: [5, 250], notEmpty: true }
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
      tableName: "users"
    }
  }
}

export function Model(sequelize, DataTypes) {
  const { name, attributes, options } = Schema(DataTypes);
  const User = sequelize.define(name, attributes, options);

  User.associate = function(models) {
    User.hasOne(models.Category, {
      foreignKey: "created_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.Category, {
      foreignKey: "updated_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.Category, {
      foreignKey: "deleted_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    User.hasOne(models.Company, {
      foreignKey: "created_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.Company, {
      foreignKey: "updated_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.Company, {
      foreignKey: "deleted_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    User.hasOne(models.Customer, {
      foreignKey: "created_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.Customer, {
      foreignKey: "updated_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.Customer, {
      foreignKey: "deleted_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    User.hasOne(models.Department, {
      foreignKey: "created_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.Department, {
      foreignKey: "updated_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.Department, {
      foreignKey: "deleted_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    User.belongsTo(models.Employee, {
      as: "employee",
      foreignKey: "employee_id"
    });
    User.hasOne(models.Employee, {
      foreignKey: "created_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.Employee, {
      foreignKey: "updated_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.Employee, {
      foreignKey: "deleted_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    User.hasOne(models.EmployeeSupervisor, {
      foreignKey: "created_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.EmployeeSupervisor, {
      foreignKey: "updated_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.EmployeeSupervisor, {
      foreignKey: "deleted_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    User.hasOne(models.DepartmentEmployee, {
      foreignKey: "created_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.DepartmentEmployee, {
      foreignKey: "updated_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.DepartmentEmployee, {
      foreignKey: "deleted_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    User.hasOne(models.Item, {
      foreignKey: "created_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.Item, {
      foreignKey: "updated_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.Item, {
      foreignKey: "deleted_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    User.hasOne(models.OrderDepartment, {
      foreignKey: "created_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.OrderDepartment, {
      foreignKey: "updated_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.OrderDepartment, {
      foreignKey: "deleted_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    User.hasOne(models.OrderEmployee, {
      foreignKey: "created_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.OrderEmployee, {
      foreignKey: "updated_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.OrderEmployee, {
      foreignKey: "deleted_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    User.hasOne(models.OrderItem, {
      foreignKey: "created_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.OrderItem, {
      foreignKey: "updated_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.OrderItem, {
      foreignKey: "deleted_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    User.hasOne(models.Order, {
      foreignKey: "created_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.Order, {
      foreignKey: "updated_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.Order, {
      foreignKey: "deleted_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    User.hasOne(models.Permission, {
      foreignKey: "created_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.Permission, {
      foreignKey: "updated_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.Permission, {
      foreignKey: "deleted_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    User.hasOne(models.QuoteItem, {
      foreignKey: "created_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.QuoteItem, {
      foreignKey: "updated_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.QuoteItem, {
      foreignKey: "deleted_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    User.hasOne(models.Quote, {
      foreignKey: "created_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.Quote, {
      foreignKey: "updated_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.Quote, {
      foreignKey: "deleted_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    User.hasOne(models.RolePermission, {
      foreignKey: "created_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.RolePermission, {
      foreignKey: "updated_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.RolePermission, {
      foreignKey: "deleted_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    User.belongsToMany(models.Role, {
      as: {
        singular: "role",
        plural: "roles",
      },
      through: models.UserRole,
      foreignKey: "user_id",
      otherKey: "role_id",
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    User.hasOne(models.Role, {
      foreignKey: "created_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.Role, {
      foreignKey: "updated_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.Role, {
      foreignKey: "deleted_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    User.hasOne(models.Stock, {
      foreignKey: "created_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.Stock, {
      foreignKey: "updated_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.Stock, {
      foreignKey: "deleted_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    User.hasOne(models.SupplierItem, {
      foreignKey: "created_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.SupplierItem, {
      foreignKey: "updated_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.SupplierItem, {
      foreignKey: "deleted_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    User.hasOne(models.Supplier, {
      foreignKey: "created_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.Supplier, {
      foreignKey: "updated_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.Supplier, {
      foreignKey: "deleted_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    User.hasOne(models.UserRole, {
      foreignKey: "created_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.UserRole, {
      foreignKey: "updated_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.UserRole, {
      foreignKey: "deleted_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    User.hasOne(models.User, {
      foreignKey: "created_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.User, {
      foreignKey: "updated_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.User, {
      foreignKey: "deleted_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    User.hasOne(models.WarehouseItem, {
      foreignKey: "created_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.WarehouseItem, {
      foreignKey: "updated_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.WarehouseItem, {
      foreignKey: "deleted_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    User.hasOne(models.Warehouse, {
      foreignKey: "created_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.Warehouse, {
      foreignKey: "updated_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.Warehouse, {
      foreignKey: "deleted_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  }

  return User;
}

export default Model;
