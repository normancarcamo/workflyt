const Sequelize = require('sequelize');
const fs = require('fs');
const config = require('./config.js');
const queryBuilder = require('./queryBuilder.js');

const pathModels = `${__dirname}/models`;

let sequelize;

if (process.env.MOCK !== 'true') {
  sequelize = new Sequelize(
    process.env.POSTGRES_URL,
    config[process.env.NODE_ENV]
  );
} else {
  sequelize = {
    import() {},
    query() {},
    models: {}
  };
}

const onlyModel = file => (
  (file.indexOf('.') !== 0) &&
  (file !== 'index.js') &&
  (file.slice(-3) === '.js')
);

const importModel = file => {
  const model = sequelize.import(`${pathModels}/${file}`);
  if (model) {
    sequelize[model.name] = model;
  }
};

const associateModel = model => {
  if (sequelize[model].associate) {
    sequelize[model].associate(sequelize);
  };
};

fs.readdirSync(pathModels).filter(onlyModel).forEach(importModel);

Object.keys(sequelize).forEach(associateModel);

module.exports = {
  pathModels: pathModels,
  Sequelize: Sequelize,
  sequelize: sequelize,
  models: sequelize.models,
  query: sequelize.query,
  Op: Sequelize.Op,
  queryBuilder: queryBuilder(Sequelize.Op)
};
