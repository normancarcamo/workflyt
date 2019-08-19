const http = require('http');
const { exec } = require('child_process');
const database = require('./providers/postgres');
const loggerOptions = require('./utils/logger');
const Logger = require('pino');
const app = require('./app');
const PORT = process.env.SERVER_PORT || 3000;
const HOST = process.env.SERVER_HOST;

let logger = new Logger(loggerOptions);
let isServerStopped = false;

// START:
let server = http.createServer(app);

server.listen(PORT, HOST, async function() {
  try {
    logger.info('Server is connected.');
    await database.sequelize.authenticate();
    logger.info('Database is connected.');
  } catch (err) {
    logger.error({ err }, 'Unable to connect to the database.');
  }
});

server.on('error', function(err) {
  if (err.code === 'EADDRINUSE') {
    exec(`sh nodemon.sh`);
  } else {
    logger.error({ err }, err.message);
  }
});

// STOP:
function gracefulShutdown() {
  if (!isServerStopped) {
    server.close(err => {
      if (err) {
        logger.error({ err }, err.message);
      } else {
        logger.info('Server is now closed.');
        isServerStopped = true;
        database.sequelize.close().then(() => {
          logger.info('Database is now closed.');
        }).catch(err => {
          logger.error({ err }, err.message);
        });
      }
    });
  }
}

function onUnhandledException(err) {
  logger.error({ err }, err.message)
}

process.on('SIGTERM', gracefulShutdown);

process.on('SIGINT', gracefulShutdown);

process.on('unhandledRejection', onUnhandledException);

process.on('uncaughtException', onUnhandledException);
