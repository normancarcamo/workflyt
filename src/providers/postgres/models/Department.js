export function Schema(DataTypes) {
  return {
    name: "Department",
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
      tableName: "department"
    }
  }
}

export function Model(sequelize, DataTypes) {
  const { name, attributes, options } = Schema(DataTypes);
  const Department = sequelize.define(name, attributes, options);

  Department.associate = function(models) {
    Department.belongsToMany(models.Employee, {
      as: {
        singular: "employee",
        plural: "employees"
      },
      through: models.DepartmentEmployee,
      foreignKey: "department_id",
      otherKey: "employee_id",
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    Department.belongsToMany(models.Order, {
      as: {
        singular: "order",
        plural: "orders"
      },
      through: models.OrderDepartment,
      foreignKey: "department_id",
      otherKey: "order_id",
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  }

  return Department;
}

export default Model;
