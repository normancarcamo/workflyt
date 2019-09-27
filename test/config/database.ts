import { entityType } from './types';

const f = async ():Promise<void> => {};

const models = <entityType> [
  'Area',
  'Category',
  'Company',
  'Client',
  'Job',
  'Material',
  'Order',
  'Permission',
  'Quote',
  'Role',
  'Service',
  'Stock',
  'Supplier',
  'User',
  'Warehouse',
  'Worker'
].reduce((acc:any, model:string) => {
  acc[model] = {
    findAll: f,
    findByPk: f,
    findOne: f,
    create: f,
    update: f,
    destroy: f
  };
  return acc;
}, {});

export default () => Object.freeze({
  pathModels: __dirname,
  Sequelize: { QueryTypes: { SELECT: 'SELECT' } },
  sequelize: { query: f, authenticate: f, close: f },
  models,
  queryBuilder: (criteria:object) => criteria,
  query: async () => {
    console.log('LLAMADA!')
  }
});
