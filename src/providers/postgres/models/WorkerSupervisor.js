export function Schema(DataTypes) {
  return {
    name: "WorkerSupervisor",
    attributes: {
      worker_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
          model: {
            schema: "public",
            tableName: "worker"
          },
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        validate: { isUUID: 4 }
      },
      supervisor_id: {
        type: DataTypes.UUID,
        allowNull: false,
        primaryKey: true,
        references: {
          model: {
            schema: "public",
            tableName: "worker"
          },
          key: "id"
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
        validate: { isUUID: 4 }
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
      tableName: "worker_supervisor"
    }
  }
}

export function Model(sequelize, DataTypes) {
  const { name, attributes, options } = Schema(DataTypes);
  const WorkerSupervisor = sequelize.define(name, attributes, options);
  return WorkerSupervisor;
}

export default Model;
