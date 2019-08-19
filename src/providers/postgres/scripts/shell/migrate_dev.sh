#!/bin/bash

psql -U developer -d workflyt_dev -h localhost -p 5480 -f src/providers/postgres/scripts/sql/pre.sql -v ON_ERROR_STOP=ON
NODE_ENV=development
node src/providers/postgres/fakers/index.js dev
node_modules/.bin/babel-node node_modules/.bin/sequelize db:migrate
psql -U developer -d workflyt_dev -h localhost -p 5480 -f src/providers/postgres/scripts/sql/post.sql -v ON_ERROR_STOP=ON
node_modules/.bin/babel-node node_modules/.bin/sequelize db:seed:all
