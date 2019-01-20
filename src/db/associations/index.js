export function Category(Category) {
  Category.associate = function(models) {
    Category.Items = Category.hasMany(models.Item, {
      as: {
        singular: "item",
        plural: "items"
      },
      foreignKey: 'category_id',
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    Category.Parent = Category.belongsTo(models.Category, {
      as: "parent",
      foreignKey: "parent_id",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  }
}

export function Customer(Customer) {
  Customer.associate = function(models) {
    Customer.Quotes = Customer.hasMany(models.Quote, {
      as: {
        singular: "quote",
        plural: "quotes"
      },
      foreignKey: 'customer_id',
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  }
}

export function Department(Department) {
  Department.associate = function(models) {
    Department.Employees = Department.hasMany(models.Employee, {
      as: {
        singular: "employee",
        plural: "employees"
      },
      foreignKey: "department_id",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    Department.Orders = Department.belongsToMany(models.Order, {
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

export function Stock(Stock) {
  Stock.associate = function(models) {
    Stock.Item = Stock.belongsTo(models.Item, {
      as: "item",
      foreignKey: "item_id"
    });
  }
}

export function Order(Order) {
  Order.associate = function(models) {
    Order.Quote = Order.belongsTo(models.Quote, {
      as: "quote",
      foreignKey: "quote_id"
    });
    Order.Departments = Order.belongsToMany(models.Department, {
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
    Order.Items = Order.belongsToMany(models.Item, {
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
  }
}

export function Permission(Permission) {
  Permission.associate = function(models) {
    Permission.Roles = Permission.belongsToMany(models.Role, {
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

export function Item(Item) {
  Item.associate = function(models) {
    Item.Category = Item.belongsTo(models.Category, {
      as: 'category',
      foreignKey: 'category_id'
    });
    Item.Stocks = Item.hasMany(models.Stock, {
      as: {
        singular: "stock",
        plural: "stocks"
      },
      foreignKey: "item_id",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    Item.Warehouses = Item.belongsToMany(models.Warehouse, {
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
    Item.Suppliers = Item.belongsToMany(models.Supplier, {
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
    Item.Orders = Item.belongsToMany(models.Order, {
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
    Item.Quotes = Item.belongsToMany(models.Quote, {
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
    Item.Types = Item.belongsToMany(models.Item, {
      as: {
        singular: "type",
        plural: "types"
      },
      through: models.ItemTypes,
      foreignKey: "item_id",
      otherKey: "type_id",
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  }
}

export function Quote(Quote) {
  Quote.associate = function(models) {
    Quote.Orders = Quote.hasMany(models.Order, {
      as: {
        singular: "order",
        plural: "orders"
      },
      foreignKey: "quote_id",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    Quote.Customer = Quote.belongsTo(models.Customer, {
      as: "customer",
      foreignKey: "customer_id"
    });
    Quote.Salesman = Quote.belongsTo(models.Employee, {
      as: "Salesman",
      foreignKey: "salesman_id"
    });
    Quote.Items = Quote.belongsToMany(models.Item, {
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
    Role.Users = Role.belongsToMany(models.User, {
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
    Role.Permissions = Role.belongsToMany(models.Permission, {
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

export function Supplier(Supplier) {
  Supplier.associate = function(models) {
    Supplier.Items = Supplier.belongsToMany(models.Item, {
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
    User.Roles = User.belongsToMany(models.Role, {
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
  }
}

export function Warehouse(Warehouse) {
  Warehouse.associate = function(models) {
    Warehouse.Items = Warehouse.belongsToMany(models.Item, {
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

export function Employee(Employee) {
  Employee.associate = function(models) {
    Employee.Department = Employee.belongsTo(models.Department, {
      as: "department",
      foreignKey: "department_id"
    });
    Employee.User = Employee.hasOne(models.User, {
      as: "user",
      foreignKey: "employee_id",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    Employee.Supervisor = Employee.hasOne(models.Employee, {
      as: "supervisor",
      foreignKey: "supervisor_id",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    Employee.Quotes = Employee.hasMany(models.Quote, {
      as: {
        singular: "salesman",
        plural: "salesmans"
      },
      foreignKey: "salesman_id",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  }
}
