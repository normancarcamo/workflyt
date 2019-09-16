const { onServerListen, onServerError, onProcessStop, onProcessError } = require('./utils/helpers');
const database = require('./providers/postgres');
const { exec } = require('child_process');
const Logger = require('pino');
const http = require('http');
const app = require('./app');

const logger = new Logger(require('./utils/logger'));
const server = http.createServer(app);
const PORT = process.env.SERVER_PORT || 3000;
const HOST = process.env.SERVER_HOST;

server.listen(PORT, HOST, onServerListen(logger, database));

server.on('error', onServerError(logger, exec));

process.on('SIGTERM', onProcessStop(server, logger, database));

process.on('SIGINT', onProcessStop(server, logger, database));

process.on('unhandledRejection', onProcessError(logger));

process.on('uncaughtException', onProcessError(logger));
