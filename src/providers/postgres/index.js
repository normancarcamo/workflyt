const Sequelize = require('sequelize');
const fs = require('fs');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  use_env_variable: process.env.DATABASE_URL,
  define: {
    charset: 'utf8',
    engine: 'InnoDB',
    dialectOptions: { collate: 'utf8_general_ci', useUTC: false, },
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
    timestamps: true,
    paranoid: true,
    underscored: true,
    freezeTableName: true,
    version: false
  },
  dialect: 'postgres',
  logging: false,
  pool: { max: 5, idle: 30000, acquire: 60000 },
  version: false,
  quoteIdentifiers: true,
  sync: { force: false }
});

fs.readdirSync(`${__dirname}/models`).filter(file => (
  (file.indexOf('.') !== 0) &&
  (file !== 'index.js') &&
  (file.slice(-3) === '.js')
)).forEach(file => {
  const model = sequelize.import(`${__dirname}/models/${file}`);
  sequelize[model.name] = model;
});

Object.keys(sequelize).forEach(model => {
  if (sequelize[model].associate) {
    sequelize[model].associate(sequelize);
  };
});

const isObject = x => Object.prototype.toString.call(x) === '[object Object]';

const setOperator = data => {
  if (isObject(data)) {
    return Object.keys(data).reduce((acc, key) => {
      if (isObject(data[key])) {
        acc[key] = setOperator(data[key]);
      } else {
        if (key in Sequelize.Op) {
          acc[Sequelize.Op[key]] = data[key];
        }
      }
      return acc;
    }, {});
  } else {
    return data;
  }
};

const queryBuilder = query => {
  let criteria = {};
  let options = {};
  let additional = [
    'attributes', 'include', 'force',
    'limit', 'offset', 'order_by',
    'paranoid', 'prematch','sort_by',
    'plain','raw','returning'
  ];

  for (let key in query) {
    if (additional.includes(key)) {
      options[key] = query[key];
    } else {
      criteria[key] = setOperator(query[key]);
    }
  }

  if (options.sort_by) {
    let order = [ options.sort_by, options.order_by || 'asc' ];
    options.sort_by = undefined;
    options.order_by = undefined;
    options.order = [ order ];
  }

  return Object.defineProperties({ where: criteria, ...options }, {
    options: { enumerable: false, value: options }
  });
};

module.exports = {
  Sequelize: Sequelize,
  sequelize: sequelize,
  models: sequelize.models,
  query: sequelize.query,
  Op: Sequelize.Op,
  queryBuilder: queryBuilder
};
