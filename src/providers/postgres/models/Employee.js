export function Schema(DataTypes) {
  return {
    name: "Employee",
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
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        validate: {
          isInt: true,
          min: 0,
          max: 1
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
      tableName: "employee",
      uniqueKeys: {
        full_name: {
          fields: [ 'firstname', 'lastname' ]
        }
      }
    }
  }
}

export function Model(sequelize, DataTypes) {
  const { name, attributes, options } = Schema(DataTypes);
  const Employee = sequelize.define(name, attributes, options);

  Employee.associate = function(models) {
    Employee.belongsToMany(models.Department, {
      as: {
        singular: "department",
        plural: "departments"
      },
      through: models.DepartmentEmployee,
      foreignKey: "employee_id",
      otherKey: "department_id",
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    Employee.belongsToMany(models.Employee, {
      as: {
        singular: "supervisor",
        plural: "supervisors"
      },
      through: models.EmployeeSupervisor,
      foreignKey: "employee_id",
      otherKey: "supervisor_id",
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    Employee.belongsToMany(models.Employee, {
      as: {
        singular: "employee",
        plural: "employees"
      },
      through: models.EmployeeSupervisor,
      foreignKey: "supervisor_id",
      otherKey: "employee_id",
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    Employee.hasOne(models.User, {
      as: "user",
      foreignKey: "employee_id",
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
      through: models.OrderEmployee,
      foreignKey: "employee_id",
      otherKey: "order_id",
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  }

  return Employee;
}

export default Model;
