const pkg = require('package.json');

module.exports = {
  apps : [{
    name           : pkg.name,
    script         : 'dist/server.js',
    output         : 'logs/out/logs.log',
    error          : 'logs/err/logs.log',
    log            : 'logs/all/logs.log',
    instances      : 0,
    exec_mode      : 'cluster',
    restart_delay  : 1500,
    wait_ready     : true,
    listen_timeout : 3000,
    merge_logs     : true,
    env_staging : {
      NODE_ENV     : 'production',
      LOG_LEVEL    : 'info',
      APP_NAME     : pkg.name,
      SERVER_PORT  : 3000,
      SERVER_IP    : '192.168.0.11'
    },
    env_production : {
      NODE_ENV     : 'production',
      LOG_LEVEL    : 'info',
      APP_NAME     : pkg.name,
      SERVER_PORT  : 3000,
      SERVER_IP    : '192.168.0.10'
    }
  }],
  deploy : {
    staging : {
      host          : [ 'virtual.staging' ],
      user          : 'deploy',
      ref           : 'origin/master',
      repo          : `git@virtual.services:/usr/git/${pkg.name}.git`,
      path          : `/usr/src/${pkg.name}`,
      "post-setup"  : 'bash deploy.sh staging setup',
      "post-deploy" : 'bash deploy.sh staging update'
    },
    production : {
      host          : [ 'virtual.production' ],
      user          : 'deploy',
      ref           : 'origin/master',
      repo          : `git@virtual.services:/usr/git/${pkg.name}.git`,
      path          : `/usr/src/${pkg.name}`,
      "post-setup"  : 'bash deploy.sh production setup',
      "post-deploy" : 'bash deploy.sh production update'
    }
  }
};
