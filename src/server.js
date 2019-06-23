import http from 'http';
import Logger from '@playscode/fns/lib/logger'
import { exec } from "child_process";
import db from "src/db/models";

const log = new Logger("server");

// START:
db.sync().then(() => {
  const server = http.createServer(require('./app').default);

  server.listen(process.env.SERVER_PORT, () => {
    console.log("Server running and database synced.");
    process.on("SIGTERM", closeServerGracefully(server));
    process.on("SIGINT", closeServerGracefully(server));
  });

  server.on('error', err => {
    if (err.code === 'EADDRINUSE') exec(`sh nodemon.sh`);
    else console.error({ error: err }, err.message);
  });
}).catch(err => console.error({ error: err }, err.message));

// STOP:
function closeServerGracefully(server) {
  return function() {
    if (!server.isClosed) {
      server.close(function(err) {
        if (err) {
          console.error({ error: err }, err.message);
          process.exit(1);
        } else {
          server.isClosed = true;
          console.info('Server stopped.');
          db.sequelize.close().then(() => {
            console.info('Database closed.');
          }).catch(err => {
            console.error({ error: err }, err.message);
            process.exit(1);
          });
        }
      });
    }
  }
}

process.on("unhandledRejection", error => {
  console.error({ error }, `unhandledRejection -> ${error.message}`);
});

process.on("uncaughtException", error => {
  console.error({ error }, `uncaughtException -> ${error.message}`);
});
