export function Category(Category) {
  Category.associate = function(models) {
    Category.hasMany(models.Item, {
      as: {
        singular: "item",
        plural: "items"
      },
      foreignKey: 'category_id',
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    Category.belongsTo(models.Category, {
      as: "parent",
      foreignKey: "parent_id",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  }
}

export function Customer(Customer) {
  Customer.associate = function(models) {
    Customer.hasMany(models.Quote, {
      as: {
        singular: "quote",
        plural: "quotes"
      },
      foreignKey: 'customer_id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  }
}

export function Department(Department) {
  Department.associate = function(models) {
    Department.hasMany(models.Employee, {
      as: {
        singular: "employee",
        plural: "employees"
      },
      foreignKey: "department_id",
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    Department.belongsToMany(models.Order, {
      as: {
        singular: "order",
        plural: "orders"
      },
      through: models.OrderDepartments,
      foreignKey: "department_id",
      otherKey: "order_id",
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  }
}

export function Employee(Employee) {
  Employee.associate = function(models) {
    Employee.belongsTo(models.Department, {
      as: "department",
      foreignKey: "department_id"
    });
    Employee.User = Employee.hasOne(models.User, {
      as: "user",
      foreignKey: "employee_id",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    Employee.hasOne(models.Employee, {
      as: "supervisor",
      foreignKey: "supervisor_id",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    Employee.hasMany(models.Quote, {
      as: {
        singular: "quote",
        plural: "quotes"
      },
      foreignKey: 'salesman_id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    Employee.belongsToMany(models.Order, {
      as: {
        singular: "order",
        plural: "orders"
      },
      through: models.OrderEmployees,
      foreignKey: "employee_id",
      otherKey: "order_id",
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  }
}

export function Item(Item) {
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
      through: models.WarehouseItems,
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
      through: models.SupplierItems,
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
      through: models.OrderItems,
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
      through: models.QuoteItems,
      foreignKey: "item_id",
      otherKey: "quote_id",
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  }
}

export function Order(Order) {
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
      through: models.OrderDepartments,
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
      through: models.OrderItems,
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
      through: models.OrderEmployees,
      foreignKey: "order_id",
      otherKey: "employee_id",
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  }
}

export function Permission(Permission) {
  Permission.associate = function(models) {
    Permission.belongsToMany(models.Role, {
      as: {
        singular: "role",
        plural: "roles",
      },
      through: models.RolePermissions,
      foreignKey: "permission_id",
      otherKey: "role_id",
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  }
}

export function Quote(Quote) {
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
      through: models.QuoteItems,
      foreignKey: "quote_id",
      otherKey: "item_id",
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  }
}

export function Role(Role) {
  Role.associate = function(models) {
    Role.belongsToMany(models.User, {
      as: {
        singular: "user",
        plural: "users",
      },
      through: models.UserRoles,
      foreignKey: "role_id",
      otherKey: "user_id",
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    Role.belongsToMany(models.Permission, {
      as: {
        singular: "permission",
        plural: "permissions"
      },
      through: models.RolePermissions,
      foreignKey: "role_id",
      otherKey: "permission_id",
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  }
}

export function Stock(Stock) {
  Stock.associate = function(models) {
    Stock.belongsTo(models.Item, {
      as: "item",
      foreignKey: "item_id"
    });
  }
}

export function Supplier(Supplier) {
  Supplier.associate = function(models) {
    Supplier.belongsToMany(models.Item, {
      as: {
        singular: "item",
        plural: "items",
      },
      through: models.SupplierItems,
      foreignKey: "supplier_id",
      otherKey: "item_id",
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  }
}

export function User(User) {
  User.associate = function(models) {
    User.Employee = User.belongsTo(models.Employee, {
      as: "employee",
      foreignKey: "employee_id"
    });
    User.belongsToMany(models.Role, {
      as: {
        singular: "role",
        plural: "roles",
      },
      through: models.UserRoles,
      foreignKey: "user_id",
      otherKey: "role_id",
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    User.hasOne(models.Category, {
      // as:
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

    User.hasOne(models.OrderDepartments, {
      foreignKey: "created_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.OrderDepartments, {
      foreignKey: "updated_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.OrderDepartments, {
      foreignKey: "deleted_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    User.hasOne(models.OrderEmployees, {
      foreignKey: "created_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.OrderEmployees, {
      foreignKey: "updated_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.OrderEmployees, {
      foreignKey: "deleted_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    User.hasOne(models.OrderItems, {
      foreignKey: "created_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.OrderItems, {
      foreignKey: "updated_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.OrderItems, {
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

    User.hasOne(models.QuoteItems, {
      foreignKey: "created_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.QuoteItems, {
      foreignKey: "updated_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.QuoteItems, {
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

    User.hasOne(models.RolePermissions, {
      foreignKey: "created_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.RolePermissions, {
      foreignKey: "updated_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.RolePermissions, {
      foreignKey: "deleted_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
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

    User.hasOne(models.SupplierItems, {
      foreignKey: "created_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.SupplierItems, {
      foreignKey: "updated_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.SupplierItems, {
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

    User.hasOne(models.UserRoles, {
      foreignKey: "created_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.UserRoles, {
      foreignKey: "updated_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.UserRoles, {
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

    User.hasOne(models.WarehouseItems, {
      foreignKey: "created_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.WarehouseItems, {
      foreignKey: "updated_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.WarehouseItems, {
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
}

export function Warehouse(Warehouse) {
  Warehouse.associate = function(models) {
    Warehouse.belongsToMany(models.Item, {
      as: {
        singular: 'item',
        plural: 'items',
      },
      through: models.WarehouseItems,
      foreignKey: "warehouse_id",
      otherKey: "item_id",
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  }
}
