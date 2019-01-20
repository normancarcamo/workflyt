NODE_ENV=development
node_modules/.bin/sequelize db:migrate
node src/db/fakers/index.js
node_modules/.bin/sequelize db:seed:all
