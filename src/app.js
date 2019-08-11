const express = require('express');
const cookieParser = require('cookie-parser');
const compression = require('compression');
const router = require('./router');
const middlewares = require('./utils/middlewares');

const app = express();

app.set('x-powered-by', false);
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(compression());
app.use(middlewares.onRequestStart);
app.use(middlewares.validateToken);
app.use('/v1', router);
app.use(middlewares.onRequestNotFound);
app.use(middlewares.onRequestError);

module.exports = app;
