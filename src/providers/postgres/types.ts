import { Sequelize, Options, QueryOptions } from 'sequelize';

export interface ISequelize extends Sequelize {
  [key: string]: any
}

export interface IConfig {
  development:Options
  test:Options
  stage:Options
  production:Options
  [key: string]: Options
}

export interface Idatabase {
  pathModels?: string|any;
  Sequelize?: any;
  sequelize?: ISequelize|any;
  models?: { [key: string]: any }|any;
  query?: ((statement:string, options?:QueryOptions) => Promise<any>)|any;
  queryBuilder?: ((query:any) => object)|any;
}
