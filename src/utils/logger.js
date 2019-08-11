const uuid = require('uuid/v4');
const os = require('os');
const Pino = require('pino');

module.exports = {
  base: {
    instance: uuid(),
    pid: process.pid,
    hostname: os.hostname(),
    hostport: JSON.parse(process.env.SERVER_PORT),
    hostip: process.env.SERVER_HOST,
    env: process.env.NODE_ENV
  },
  enabled: JSON.parse(process.env.LOG_ENABLED),
  name: process.env.APP_NAME,
  level: process.env.LOG_LEVEL,
  prettyPrint: process.env.LOG_PRETTY_PRINT,
  serializers: {
    req: req => ({
      id: uuid(),
      method: req.method,
      url: req.url,
      headers: { ...req.headers, authorization: undefined },
      remoteAddress: req.connection.remoteAddress,
      remotePort: req.connection.remotePort
    }),
    res: Pino.stdSerializers.res,
    err: Pino.stdSerializers.err
  },
  onFinish: (req, res, logger) => () => {
    if (process.env.LOG_ENABLED === 'true') {
      let responseTime = `${Date.now() - req.start}ms`;
      if (req.error) {
        let level = null;

        if (req.error.status >= 400 && req.error.status < 500) {
          level = 'warn';
        } else {
          level = 'error';
        }

        logger[level](
          { req, res, err: req.error, responseTime },
          req.error.message
        );
      } else {
        logger.info({ req, res, responseTime }, 'Request completed.');
      }
    }
  }
};
