import Sequelize from 'sequelize';

const define = {
  charset: 'utf8',
  engine: 'InnoDB',
  dialectOptions: {
    collate: 'utf8_general_ci',
    useUTC: false,
  },
  createdAt: 'created_at',
  updatedAt: 'updated_at',
  deletedAt: 'deleted_at',
  timestamps: true,
  paranoid: true,
  underscored: true,
  freezeTableName: true,
  version: false
};

const pool = {
  max: 5,
  idle: 30000,
  acquire: 60000
};

const Op = Sequelize.Op;

const operatorsAliases = {
  $eq: Op.eq,
  $ne: Op.ne,
  $gte: Op.gte,
  $gt: Op.gt,
  $lte: Op.lte,
  $lt: Op.lt,
  $not: Op.not,
  $in: Op.in,
  $notIn: Op.notIn,
  $is: Op.is,
  $like: Op.like,
  $notLike: Op.notLike,
  $iLike: Op.iLike,
  $notILike: Op.notILike,
  $regexp: Op.regexp,
  $notRegexp: Op.notRegexp,
  $iRegexp: Op.iRegexp,
  $notIRegexp: Op.notIRegexp,
  $between: Op.between,
  $notBetween: Op.notBetween,
  $overlap: Op.overlap,
  $contains: Op.contains,
  $contained: Op.contained,
  $adjacent: Op.adjacent,
  $strictLeft: Op.strictLeft,
  $strictRight: Op.strictRight,
  $noExtendRight: Op.noExtendRight,
  $noExtendLeft: Op.noExtendLeft,
  $and: Op.and,
  $or: Op.or,
  $any: Op.any,
  $all: Op.all,
  $values: Op.values,
  $col: Op.col
};

export default {
  test: {
    define,
    use_env_variable: process.env.DATABASE_URL,
    operatorsAliases: false,
    dialect: 'postgres',
    logging: false,
    quoteIdentifiers: false,
    pool,
    version: false,
    sync: {
      force: true,
      match: /workflyt_test/
    },
  },
  development: {
    use_env_variable: process.env.DATABASE_URL,
    define,
    dialect: 'postgres',
    logging: false,
    operatorsAliases: false,
    pool,
    version: false,
    sync: {
      force: false,
      match: /workflyt_dev/
    },
  },
  production: {
    use_env_variable: process.env.DATABASE_URL,
    define,
    dialect: 'postgres',
    logging: false,
    operatorsAliases: false,
    pool,
    version: false,
    sync: {
      force: false,
      match: /workflyt_prod/
    },
  },
  stage: {
    use_env_variable: process.env.DATABASE_URL,
    define,
    dialect: 'postgres',
    logging: false,
    operatorsAliases: false,
    pool,
    version: false,
    sync: {
      force: false,
      match: /workflyt_stage/
    },
  }
};
