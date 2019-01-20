# !/bin/bash

export NODE_ENV=$1

npm run remove

npm run create

npm install

npm run build

[[ $NODE_ENV != "production" ]] && npm run test

if [[ $2 != "setup" ]]
then
  pm2 startOrReload ecosystem.config.js --env $NODE_ENV --update-env
fi
