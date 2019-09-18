import utils from "./utils";
import database from "./providers/postgres";
import { exec } from "child_process";
import pino, { Logger } from "pino";
import loggerOptions from "./utils/logger";
import http, { Server } from "http";
import app from "./app";

const logger:Logger = pino(loggerOptions);
const server:Server = http.createServer(app);
const PORT:number = Number(process.env.SERVER_PORT) || 3000;

server.listen(PORT, utils.onServerListen(logger, database));

server.on("error", utils.onServerError(logger, exec));

process.on("SIGTERM", utils.onProcessStop(server, logger, database));

process.on("SIGINT", utils.onProcessStop(server, logger, database));

process.on("unhandledRejection", utils.onProcessError(logger));

process.on("uncaughtException", utils.onProcessError(logger));
