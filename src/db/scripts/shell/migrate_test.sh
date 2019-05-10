#!/bin/bash

psql -U dev -d workflyt_test -h 127.0.0.1 -f src/db/scripts/sql/pre.sql -v ON_ERROR_STOP=ON
NODE_ENV=test
node src/db/fakers/index.js
node_modules/.bin/sequelize db:migrate
psql -U dev -d workflyt_test -h 127.0.0.1 -f src/db/scripts/sql/post.sql -v ON_ERROR_STOP=ON
node_modules/.bin/sequelize db:seed:all
