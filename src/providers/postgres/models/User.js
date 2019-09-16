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
      worker_id: {
        type: DataTypes.UUID,
        allowNull: true,
        unique: false,
        references: {
          model: {
            tableName: "worker",
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
    // area:
    User.hasOne(models.Area, {
      foreignKey: "created_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.Area, {
      foreignKey: "updated_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.Area, {
      foreignKey: "deleted_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // area_worker:
    User.hasOne(models.AreaWorker, {
      foreignKey: "created_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.AreaWorker, {
      foreignKey: "updated_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.AreaWorker, {
      foreignKey: "deleted_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // area_subarea:
    User.hasOne(models.AreaSubarea, {
      foreignKey: "created_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.AreaSubarea, {
      foreignKey: "updated_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.AreaSubarea, {
      foreignKey: "deleted_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // category:
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

    // client:
    User.hasOne(models.Client, {
      foreignKey: "created_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.Client, {
      foreignKey: "updated_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.Client, {
      foreignKey: "deleted_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // company:
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

    // job:
    User.hasOne(models.Job, {
      foreignKey: "created_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.Job, {
      foreignKey: "updated_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.Job, {
      foreignKey: "deleted_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // job_material:
    User.hasOne(models.JobMaterial, {
      foreignKey: "created_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.JobMaterial, {
      foreignKey: "updated_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.JobMaterial, {
      foreignKey: "deleted_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // job_subjob:
    User.hasOne(models.JobSubjob, {
      foreignKey: "created_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.JobSubjob, {
      foreignKey: "updated_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.JobSubjob, {
      foreignKey: "deleted_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // job_worker:
    User.hasOne(models.JobWorker, {
      foreignKey: "created_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.JobWorker, {
      foreignKey: "updated_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.JobWorker, {
      foreignKey: "deleted_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // material:
    User.hasOne(models.Material, {
      foreignKey: "created_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.Material, {
      foreignKey: "updated_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.Material, {
      foreignKey: "deleted_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // order:
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

    // permission:
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

    // quote:
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

    // quote_service:
    User.hasOne(models.QuoteService, {
      foreignKey: "created_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.QuoteService, {
      foreignKey: "updated_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.QuoteService, {
      foreignKey: "deleted_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // role:
    User.belongsToMany(models.Role, {
      as: { singular: "role", plural: "roles" },
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

    // role_permission:
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

    // service:
    User.hasOne(models.Service, {
      foreignKey: "created_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.Service, {
      foreignKey: "updated_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.Service, {
      foreignKey: "deleted_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // stock:
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

    // supplier:
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

    // supplier_material:
    User.hasOne(models.SupplierMaterial, {
      foreignKey: "created_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.SupplierMaterial, {
      foreignKey: "updated_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.SupplierMaterial, {
      foreignKey: "deleted_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // user:
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

    // user_role:
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

    // warehouse:
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

    // warehouse_material:
    User.hasOne(models.WarehouseMaterial, {
      foreignKey: "created_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.WarehouseMaterial, {
      foreignKey: "updated_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.WarehouseMaterial, {
      foreignKey: "deleted_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // worker:
    User.belongsTo(models.Worker, {
      as: "worker",
      foreignKey: "worker_id"
    });
    User.hasOne(models.Worker, {
      foreignKey: "created_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.Worker, {
      foreignKey: "updated_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.Worker, {
      foreignKey: "deleted_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    // worker_supervisor:
    User.hasOne(models.WorkerSupervisor, {
      foreignKey: "created_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.WorkerSupervisor, {
      foreignKey: "updated_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    User.hasOne(models.WorkerSupervisor, {
      foreignKey: "deleted_by",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  }

  return User;
}

export default Model;
