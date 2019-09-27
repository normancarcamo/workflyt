import { Sequelize, Op } from 'sequelize';
import fs from 'fs';
import config from './config';
import queryBuilder from './QueryBuilder';
import { Idatabase, ISequelize } from './types';

let url:string = process.env.POSTGRES_URL || '';
let env:string = process.env.NODE_ENV || 'development';
let modelPath = `${__dirname}/models`;
let sequelize:ISequelize|{ [key: string]: any };

if (process.env.MOCK !== 'true') {
  sequelize = new Sequelize(url, config[env]);
} else {
  sequelize = { import() {}, query() {}, models: {} };
}

let onlyModel = (file:string):boolean => (
  (file.indexOf('.') !== 0) &&
  (file !== 'index.js') &&
  (file !== 'index.ts') &&
  (file.slice(-3) === '.js' || file.slice(-3) === '.ts')
);

let importModel = (file:string):void => {
  let model = sequelize.import(`${modelPath}/${file}`);
  if (model) {
    sequelize[model.name] = model;
  }
};

let associateModel = (name:string):void => {
  if (sequelize[name].associate) {
    sequelize[name].associate(sequelize);
  }
};

fs.readdirSync(modelPath).filter(onlyModel).forEach(importModel);

Object.keys(sequelize).forEach(associateModel);

export default <Idatabase> {
  pathModels: modelPath,
  Sequelize: Sequelize,
  sequelize: sequelize,
  models: sequelize.models,
  query: sequelize.query,
  queryBuilder: queryBuilder
};
