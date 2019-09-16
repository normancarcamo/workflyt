export function Schema(DataTypes) {
  return {
    name: "Material",
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
      tableName: "material"
    }
  }
}

export function Model(sequelize, DataTypes) {
  const { name, attributes, options } = Schema(DataTypes);
  const Material = sequelize.define(name, attributes, options);

  Material.associate = function(models) {
    Material.belongsTo(models.Category, {
      as: 'category',
      foreignKey: 'category_id'
    });
    Material.hasMany(models.Stock, {
      as: { singular: "stock", plural: "stocks" },
      foreignKey: "material_id",
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    Material.belongsToMany(models.Warehouse, {
      as: { singular: "warehouse", plural: "warehouses" },
      through: models.WarehouseMaterial,
      foreignKey: "material_id",
      otherKey: "warehouse_id",
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    Material.belongsToMany(models.Supplier, {
      as: { singular: "supplier", plural: "suppliers" },
      through: models.SupplierMaterial,
      foreignKey: "material_id",
      otherKey: "supplier_id",
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    Material.belongsToMany(models.Job, {
      as: { singular: "job", plural: "jobs" },
      through: models.JobMaterial,
      foreignKey: "material_id",
      otherKey: "job_id",
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  }

  return Material;
}

export default Model;
