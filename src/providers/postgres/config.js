const OPTIONS = {
  url: process.env.POSTGRES_URL,
  use_env_variable: process.env.POSTGRES_URL,
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
    dialectOptions: { collate: "utf8_general_ci", useUTC: false, },
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

// More info about the options used by sequelize-cli:
// https://github.com/sequelize/cli/blob/master/docs/README.md
// https://sequelize.org/master/manual/migrations.html

module.exports = {
  development: OPTIONS,
  test: OPTIONS,
  production: OPTIONS,
  stage: OPTIONS
};
