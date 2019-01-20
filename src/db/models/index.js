import path from 'path';
import fs from 'fs';
import configs from '../config/postgres.js';
import Sequelize from 'sequelize';

const basename = path.basename(__filename);

let db = {
  Sequelize,
  sync: async function() {
    db.sequelize = new Sequelize(
      configs[process.env.NODE_ENV].use_env_variable,
      configs[process.env.NODE_ENV]
    );

    fs.readdirSync(__dirname).filter(file => (
      (file.indexOf('.') !== 0) &&
      (file !== basename) &&
      (file.slice(-3) === '.js')
    )).forEach(file => {
      const model = db.sequelize.import(`${__dirname}/${file}`);
      db[model.name] = model;
    });

    Object.keys(db).forEach(modelName => {
      if (db[modelName].associate) {
        db[modelName].associate(db);
      };
    });
  },
  close: async function() {
    db.sequelize && await db.sequelize.close();
  }
};

export default db;
