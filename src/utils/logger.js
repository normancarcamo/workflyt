const uuid = require("uuid/v4");
const os = require("os");
const Pino = require("pino");

const _instance = uuid();

export default function(ctx = "no context", opts) {
  var env = {
    APP_NAME: process.env.APP_NAME || "unknown",
    NODE_ENV: process.env.NODE_ENV || "unknown",
    SERVER_PORT: process.env.SERVER_PORT
      ? JSON.parse(process.env.SERVER_PORT)
      : "unknown",
    SERVER_HOST: process.env.SERVER_HOST
      ? process.env.SERVER_HOST
      : "127.0.0.1",
    LOG_ENABLED: process.env.LOG_ENABLED
      ? JSON.parse(process.env.LOG_ENABLED)
      : false,
    LOG_LEVEL: process.env.LOG_LEVEL || "error",
    LOG_PRETTY_PRINT: process.env.LOG_PRETTY_PRINT
      ? JSON.parse(process.env.LOG_PRETTY_PRINT)
      : false
  };

  return Pino({
    base: {
      instance: _instance,
      context: ctx,
      pid: process.pid,
      hostname: os.hostname(),
      hostport: env.SERVER_PORT,
      hostip: env.SERVER_HOST,
      env: env.NODE_ENV
    },
    enabled: env.LOG_ENABLED,
    name: env.APP_NAME,
    level: env.LOG_LEVEL,
    prettyPrint: env.LOG_PRETTY_PRINT,
    serializers: {
      req: function(req) {
        return {
          method: req.method,
          url: req.url,
          id: req.id,
          seq: req.seq,
          params: req.params,
          query: req.query,
          headers: req.headers,
          remoteAddress: req.connection.remoteAddress,
          remotePort: req.connection.remotePort
        }
      },
      res: function(res) {
        return {
          elapsed: `${Date.now() - res.req.start}ms`,
          status: res.statusCode,
          headers: res.getHeaders()
        }
      },
      err: Pino.stdSerializers.err
    },
    ...opts
  });
}
