psql -h 127.0.0.1 -U dev -d disema_test -f ./src/db/scripts/start.sql
NODE_ENV=test
node_modules/.bin/sequelize db:migrate
