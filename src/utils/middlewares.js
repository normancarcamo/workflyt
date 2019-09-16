export function trackTime() {
  return function(req, res, next) {
    req.start = Date.now();
    next();
  }
}

export function logResponse(logger) {
  return function(req, res, next) {
    res.on('finish', () => {
      if (process.env.LOG_ENABLED === 'true') {
        let responseTime = `${Date.now() - req.start}ms`;
        let logLevel = null;
        let err = null;
        let msg = null;

        if (req.error) {
          err = req.error;
          logLevel = err.status >= 400 && err.status < 500 ? 'warn' : 'error';
          msg = err.message;
        } else {
          logLevel = 'info';
          msg = 'Request completed.';
          err = undefined;
        }

        logger[logLevel]({
          req,
          res,
          err,
          responseTime
        }, msg);
      }
    });
    next();
  }
};

export function handleError() {
  return function(ctx, req, res, next) {
    if (ctx.message.includes('Forbidden')) {
      ctx.reason = ctx.message;
      ctx.status = 403;
      ctx.message = 'Forbidden.';
    } else if (ctx.message.includes('Not found')) {
      ctx.reason = ctx.message;
      ctx.status = 404;
      ctx.message = 'Not found.';
    } else if (ctx.name === 'SequelizeUniqueConstraintError') {
      ctx.reason = ctx.message;
      ctx.status = 400;
      ctx.message = 'Validation error';
    } else if (ctx.name === 'SequelizeConnectionError') {
      ctx.reason = ctx.message;
      ctx.status = 502;
      ctx.message = 'Bad Gateway.';
    }

    let isProduction = process.env.NODE_ENV === 'production';

    req.error = {
      name: !isProduction && ctx.name,
      message: ctx.message,
      reason: !isProduction && ctx.reason,
      code: ctx.code,
      status: ctx.status,
      ...!isProduction && ctx
    };

    res.status(ctx.status).json({ success: false, error: req.error });
  }
}

export function handleNotFound() {
  return function(req, res, next) {
    let error = new Error('Not found.');
    error.status = 404;
    error.code = 404;
    return next(error);
  }
}

export function methodNotAllowed() {
  return function(req, res, next) {
    let error = new Error('Method Not allowed.');
    error.status = 405;
    error.code = 405;
    return next(error);
  }
}

export function validateToken(jsonwebtoken) {
  return function(req, res, next) {
    let publicRoutes = [
      '/v1/auth/signin',
      '/v1/auth/signout' // <-- pending use case to implement!
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
}

export function validateRights(name) {
  return function(req, res, next) {
    if (req.token.permissions.includes(name)) {
      next();
    } else {
      let error = new Error('Forbidden');
      error.status = 403;
      next(error);
    }
  }
}

export function validateInput(schema) {
  return async function(req, res, next) {
    try {
      let result = await schema.validate({
        query: req.query,
        body: req.body,
        params: req.params
      });
      req.query = result.query;
      req.body = result.body;
      req.params = result.params;
      next();
    } catch (error) {
      error.status = 400;
      next(error);
    }
  }
}
