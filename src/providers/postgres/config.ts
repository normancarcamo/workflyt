import { IConfig } from './types';

const config = {
  dialect: "postgres",
  migrationStorageTableSchema: "sequelize_schema",
  logging: false,
  version: false,
  quoteIdentifiers: true,
  pool: { max: 5, idle: 30000, acquire: 60000 },
  sync: { force: false },
  define: {
    charset: "utf8",
    engine: "InnoDB",
    dialectOptions: { collate: "utf8_general_ci", useUTC: false },
    createdAt: "created_at",
    updatedAt: "updated_at",
    deletedAt: "deleted_at",
    timestamps: true,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    version: false
  }
};

export default <IConfig> {
  development: config,
  test: config,
  stage: config,
  production: config
};

// More info about the options used by sequelize-cli:
// https://github.com/sequelize/cli/blob/master/docs/README.md
// https://sequelize.org/master/manual/migrations.html
