const jsonwebtoken = require('jsonwebtoken');
const bcrypt = require('bcrypt');

export async function comparePassword({ raw, hash, errorCode }) {
  let isValid = false;

  try {
    isValid = await bcrypt.compare(raw, hash);
  } catch (error) {
    error.status = 500;
    error.code = errorCode;
    throw error;
  }

  if (isValid) {
    return true;
  } else {
    let error = new Error('Forbidden.');
    error.status = 403;
    error.code = errorCode;
    throw error;
  }
}

export async function hashPassword({ password, salt = 10, errorCode }) {
  try {
    return await bcrypt.hash(password, salt);
  } catch (error) {
    error.status = 500;
    error.code = errorCode;
    throw error;
  }
}

export function signToken({ payload, secret, errorCode }) {
  try {
    return jsonwebtoken.sign(payload, secret);
  } catch (error) {
    error.status = 500;
    error.code = errorCode;
    throw error;
  }
}

export function invokeCallback(callback) {
  callback && callback();
}

export function onServerListen(logger, database, callback) {
  return function() {
    logger.info('Server is connected.');
    database.sequelize.authenticate().then(() => {
      logger.info('Database is connected.');
      invokeCallback(callback);
    }).catch(err => {
      logger.error({ err }, 'Unable to connect to the database.');
      invokeCallback(callback);
    });
  }
}

export function onServerError(logger, exec) {
  return function(err) {
    if (err.code === 'EADDRINUSE') {
      exec(`sh nodemon.sh`);
    } else {
      logger.error({ err }, err.message);
    }
  }
}

export function onServerClose(logger, database, callback) {
  return function(err) {
    if (err) {
      logger.error({ err }, err.message);
      invokeCallback(callback);
    } else {
      logger.info('Server is now closed.');
      database.sequelize.close().then(() => {
        logger.info('Database is now closed.');
        invokeCallback(callback);
      }).catch(err => {
        logger.error({ err }, err.message);
        invokeCallback(callback);
      });
    }
  }
}

export function onProcessStop(server, logger, database, callback) {
  return function() {
    if (server.listening) {
      server.close(onServerClose(logger, database, () => {
        server.listening = false;
        invokeCallback(callback);
      }));
    } else {
      invokeCallback(callback);
    }
  }
}

export function onProcessError(logger) {
  return function(err) {
    logger.error({ err }, err.message)
  }
}
