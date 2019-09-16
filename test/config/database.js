const f = async () => {};

const models = [
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
].reduce((acc, model) => {
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

const queryBuilder = criteria => criteria;
const query = f;
const authenticate = f;
const close = f;
const sequelize = { query, authenticate, close };
const SELECT = 'SELECT';
const QueryTypes = { SELECT };
const Sequelize = { QueryTypes };

const database = Object.freeze({
  queryBuilder,
  models,
  sequelize,
  Sequelize
});

module.exports = database;
