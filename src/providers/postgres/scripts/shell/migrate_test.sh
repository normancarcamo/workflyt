#!/bin/bash

psql -U tester -d workflyt_test -h localhost -p 5481 -f src/providers/postgres/scripts/sql/pre.sql -v ON_ERROR_STOP=ON
NODE_ENV=test
node src/providers/postgres/fakers/index.js test
node_modules/.bin/babel-node node_modules/.bin/sequelize db:migrate
psql -U tester -d workflyt_test -h localhost -p 5481 -f src/providers/postgres/scripts/sql/post.sql -v ON_ERROR_STOP=ON
node_modules/.bin/babel-node node_modules/.bin/sequelize db:seed:all
