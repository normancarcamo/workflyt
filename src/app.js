const jsonwebtoken = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const router = require('./router');
const express = require('express');
const utils = require('./utils');
const logger = require('pino')(utils.logger.options);

const app = express();

app.set('x-powered-by', false);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(compression());
app.use(utils.trackTime());
app.use(utils.logResponse(logger));
app.use(utils.validateToken(jsonwebtoken));
app.use('/v1', router);
app.use(utils.handleNotFound());
app.use(utils.handleError());

module.exports = app;
