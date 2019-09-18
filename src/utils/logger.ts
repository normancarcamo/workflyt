import uuid from "uuid/v4";
import os from "os";
import Pino, { LoggerOptions } from "pino";

export default <LoggerOptions> {
  base: {
    instance: uuid(),
    pid: process.pid,
    hostname: os.hostname(),
    hostport: JSON.parse(<string>process.env.SERVER_PORT),
    hostip: process.env.SERVER_HOST,
    env: <string>process.env.NODE_ENV
  },
  enabled: JSON.parse(<string>process.env.LOG_ENABLED),
  name: <string>process.env.APP_NAME,
  level: <string>process.env.LOG_LEVEL,
  prettyPrint: JSON.parse(<string>process.env.LOG_PRETTY_PRINT),
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
  }
};
