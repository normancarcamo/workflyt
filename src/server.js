import http from 'http';
import Logger from '@playscode/fns/lib/logger'
import { exec } from "child_process";
import db from "src/db/models";

const log = new Logger("server");

// START:
db.sync().then(() => {
  const server = http.createServer(require('./app').default);

  server.listen(process.env.SERVER_PORT, () => {
    log.info("Server running and database synced.");
    process.on("SIGTERM", closeServerGracefully(server));
    process.on("SIGINT", closeServerGracefully(server));
  });

  server.on('error', err => {
    if (err.code === 'EADDRINUSE') exec(`sh nodemon.sh`);
    else log.error({ error: err }, err.message);
  });
}).catch(err => log.error({ error: err }, err.message));

// STOP:
function closeServerGracefully(server) {
  return function() {
    if (!server.isClosed) {
      server.close(function(err) {
        if (err) {
          log.error({ error: err }, err.message);
          process.exit(1);
        } else {
          server.isClosed = true;
          log.info('Server stopped.');
          db.sequelize.close().then(() => {
            log.info('Database closed.');
          }).catch(err => {
            log.error({ error: err }, err.message);
            process.exit(1);
          });
        }
      });
    }
  }
}

process.on("unhandledRejection", error => {
  log.error({ error }, `unhandledRejection -> ${error.message}`);
});

process.on("uncaughtException", error => {
  log.error({ error }, `uncaughtException -> ${error.message}`);
});
