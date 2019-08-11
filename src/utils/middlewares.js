import jsonwebtoken from 'jsonwebtoken';
import loggerOptions from './logger.js';
import uuid from 'uuid/v4';
import Pino from 'pino';

const logger = new Pino(loggerOptions);

export function onRequestStart(req, res, next) {
  req.start = Date.now();
  res.on('finish', loggerOptions.onFinish(req, res, logger));
  next();
}

export function onRequestError(context, req, res, next) {
  let isProduction = process.env.NODE_ENV === 'production';

  // Database is down:
  if (context.name === 'SequelizeConnectionError') {
    context.reason = context.message;
    context.status = 502;
    context.message = 'Bad Gateway.';
  }

  let error = {
    name: isProduction ? undefined : context.name,
    message: context.message,
    reason: isProduction ? undefined : context.reason,
    code: context.code,
    status: context.status,
    ...isProduction ? null : context
  };

  req.error = error;

  res.status(context.status).json({
    success: false,
    error: error
  });
}

export function onRequestNotFound(req, res, next) {
  let error = new Error('Not found.');
  error.status = 404;
  error.code = 404; // resource not found
  return next(error);
}

export function onMethodNotAllowed(req, res, next) {
  let error = new Error('Method Not allowed.');
  error.status = 405;
  error.code = 405; // method on action not allowed
  return next(error);
}

export function validateToken(req, res, next) {
  let publicRoutes = [
    '/v1/auth/signin',
    '/v1/auth/signup'
  ];

  if (publicRoutes.includes(req.url)) {
    return next();
  }

  let token = req.headers.authorization;

  if (!token) {
    let error = new Error('Unauthorized');
    error.status = 401;
    error.code = 'MVT01'; // token authorization header not found
    return next(error);
  }

  if (!token.startsWith('Bearer ')) {
    let error = new Error('Unauthorized');
    error.status = 401;
    error.code = 'MVT02'; // invalid token prefix
    return next(error);
  }

  token = token.slice(7, token.length);

  if (!token) {
    let error = new Error('Unauthorized');
    error.status = 401;
    error.code = 'MVT03'; // invalid token
    return next(error);
  }

  req.token = null;

  try {
    req.token = jsonwebtoken.verify(token, process.env.JWT_SECRET);
  } catch (error) {
    error.reason = error.message;
    error.message = 'Unauthorized';
    error.status = 401;
    error.code = 'MVT04'; // invalid signature
    return next(error);
  }

  if (!req.token.sub) {
    let error = new Error('Unauthorized');
    error.status = 401;
    error.code = 'MVT05'; // invalid subject
    return next(error);
  }

  if (!Array.isArray(req.token.roles)) {
    let error = new Error('Unauthorized');
    error.status = 401;
    error.code = 'MVT06'; // invalid roles
    return next(error);
  }

  if (!Array.isArray(req.token.permissions)) {
    let error = new Error('Unauthorized');
    error.status = 401;
    error.code = 'MVT07'; // invalid permissions
    return next(error);
  }

  return next();
}
