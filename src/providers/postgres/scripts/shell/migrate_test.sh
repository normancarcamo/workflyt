#!/bin/bash

psql -U dev -d workflyt_test -h 127.0.0.1 -f src/providers/postgres/scripts/sql/pre.sql -v ON_ERROR_STOP=ON
NODE_ENV=test
node src/providers/postgres/fakers/index.js test
node_modules/.bin/babel-node node_modules/.bin/sequelize db:migrate
psql -U dev -d workflyt_test -h 127.0.0.1 -f src/providers/postgres/scripts/sql/post.sql -v ON_ERROR_STOP=ON
node_modules/.bin/babel-node node_modules/.bin/sequelize db:seed:all
