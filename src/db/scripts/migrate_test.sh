psql -U dev -d disema_test -h 127.0.0.1 -f ./src/db/scripts/start.sql
NODE_ENV=test
node_modules/.bin/sequelize db:migrate
