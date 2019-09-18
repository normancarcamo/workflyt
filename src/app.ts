import jsonwebtoken from "jsonwebtoken";
import cookieParser from "cookie-parser";
import compression from "compression";
import router from "./router";
import express from "express";
import utils from "./utils";
import pino from "pino";
import { trackTime } from './utils/middlewares';

const app = express();
const logger = pino(utils.logger);

app.set("x-powered-by", false);
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(compression());
app.use(trackTime());
app.use(utils.logResponse(logger));
app.use(utils.validateToken(jsonwebtoken));
app.use("/v1", router);
app.use(utils.handleNotFound());
app.use(utils.handleError());

export default app;
