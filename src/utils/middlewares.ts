import { Logger } from 'pino';
import {
  IMiddleware, IMiddlewareError,
  IJsonWebToken, IError, IValidator
} from './interfaces';

export function trackTime ():IMiddleware {
  return function (req, res, next) {
    req.start = Date.now();
    next();
  };
};

export function logResponse (logger:Logger):IMiddleware {
  return function (req, res, next) {
    res.on("finish", ():void => {
      if (process.env.LOG_ENABLED === "true") {
        let responseTime:string = `${Date.now() - req.start}ms`;
        let logLevel:string;
        let err:any;
        let msg:string;

        if (req.error) {
          err = req.error;
          logLevel = err.status >= 400 && err.status < 500 ? "warn" : "error";
          msg = err.message;
        } else {
          logLevel = "info";
          msg = "Request completed.";
        }

        logger[logLevel]({ req, res, err, responseTime }, msg);
      }
    });
    next();
  };
};

export function handleError():IMiddlewareError {
  return function (ctx, req, res, next) {
    if (ctx.message.includes("Forbidden")) {
      ctx.reason = ctx.message;
      ctx.status = 403;
      ctx.message = "Forbidden.";
    } else if (ctx.message.includes("Not found")) {
      ctx.reason = ctx.message;
      ctx.status = 404;
      ctx.message = "Not found.";
    } else if (ctx.message.includes("Method Not allowed")) {
      ctx.status = 405;
      ctx.code = 405;
      ctx.message = "Method Not allowed";
    } else if (ctx.name === "SequelizeUniqueConstraintError") {
      ctx.reason = ctx.message;
      ctx.status = 400;
      ctx.message = "Validation error";
    } else if (ctx.name === "SequelizeConnectionError") {
      ctx.reason = ctx.message;
      ctx.status = 502;
      ctx.message = "Bad Gateway.";
    }

    const isProduction:boolean = process.env.NODE_ENV === "production";

    req.error = {
      ...isProduction ? undefined : ctx,
      name: isProduction ? undefined : ctx.name,
      message: ctx.message,
      reason: isProduction ? undefined : ctx.reason,
      code: ctx.code,
      status: ctx.status
    };

    res.status(ctx.status).json({ success: false, error: req.error });
  };
};

export function handleNotFound():IMiddleware {
  return function (req, res, next) {
    next(new Error("Not found."));
  };
};

export function methodNotAllowed():IMiddleware {
  return function (req, res, next) {
    return next(new Error("Method Not allowed."));
  };
};

export function validateToken(jsonwebtoken:IJsonWebToken):IMiddleware {
  return function (req, res, next) {
    let publicRoutes:string[] = [
      "/auth/signin",
      "/auth/signout", // <-- pending use case to implement!
    ];

    if (publicRoutes.includes(req.url)) {
      return next();
    }

    let token:string = req.headers.authorization || '';

    if (!token) {
      let error = new Error("Unauthorized") as IError;
      error.status = 401;
      error.code = "MVT01"; // token authorization header not found
      return next(error);
    }

    if (!token.startsWith("Bearer ")) {
      let error = new Error("Unauthorized") as IError;
      error.status = 401;
      error.code = "MVT02"; // invalid token prefix
      return next(error);
    }

    token = token.slice(7, token.length);

    if (!token) {
      let error = new Error("Unauthorized") as IError;
      error.status = 401;
      error.code = "MVT03"; // invalid token
      return next(error);
    }

    try {
      // jsonwebtoken.verify()
      req.token = jsonwebtoken.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      error.reason = error.message;
      error.message = "Unauthorized";
      error.status = 401;
      error.code = "MVT04"; // invalid signature
      return next(error);
    }

    if (!req.token.sub) {
      let error = new Error("Unauthorized") as IError;
      error.status = 401;
      error.code = "MVT05"; // invalid subject
      return next(error);
    }

    if (!Array.isArray(req.token.roles)) {
      let error = new Error("Unauthorized") as IError;
      error.status = 401;
      error.code = "MVT06"; // invalid roles
      return next(error);
    }

    if (!Array.isArray(req.token.permissions)) {
      let error = new Error("Unauthorized") as IError;
      error.status = 401;
      error.code = "MVT07"; // invalid permissions
      return next(error);
    }

    next();
  };
};

export function validateRights(name:string):IMiddleware {
  return function (req, res, next) {
    if (req.token.permissions.includes(name)) {
      next();
    } else {
      next(new Error("Forbidden"));
    }
  };
};

export function validateInput(schema:IValidator):IMiddleware {
  return async function (req, res, next) {
    try {
      let result = await schema.validate({
        query: req.query,
        body: req.body,
        params: req.params,
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
};
