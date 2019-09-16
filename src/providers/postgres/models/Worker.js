export function Schema(DataTypes) {
  return {
    name: "Worker",
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
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
      tableName: "worker",
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
  const Worker = sequelize.define(name, attributes, options);

  Worker.associate = function(models) {
    Worker.belongsToMany(models.Area, {
      as: { singular: "area", plural: "areas" },
      through: models.AreaWorker,
      foreignKey: "worker_id",
      otherKey: "area_id",
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    Worker.belongsToMany(models.Worker, {
      as: { singular: "supervisor", plural: "supervisors" },
      through: models.WorkerSupervisor,
      foreignKey: "worker_id",
      otherKey: "supervisor_id",
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    Worker.belongsToMany(models.Worker, {
      as: { singular: "worker", plural: "workers" },
      through: models.WorkerSupervisor,
      foreignKey: "supervisor_id",
      otherKey: "worker_id",
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    Worker.hasOne(models.User, {
      as: "user",
      foreignKey: "worker_id",
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
    Worker.hasMany(models.Quote, {
      as: { singular: "quote", plural: "quotes" },
      foreignKey: 'salesman_id',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
    Worker.belongsToMany(models.Job, {
      as: { singular: "job", plural: "jobs" },
      through: models.JobWorker,
      foreignKey: "worker_id",
      otherKey: "job_id",
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  }

  return Worker;
}

export default Model;
