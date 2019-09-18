import jsonwebtoken from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {
  IcomparePassword, IhashPassword, IsignToken,
  IinvokeCallback, IonServerListen, IonServerError,
  IonServerClose, IonProcessStop, IonProcessError,
  IError
} from './interfaces';

export const comparePassword:IcomparePassword = async ({ raw, hash, errorCode }) => {
  let samePassword:boolean = false;

  try {
    samePassword = await bcrypt.compare(raw, hash);
  } catch (error) {
    error.status = 500;
    error.code = errorCode;
    throw error;
  }

  if (samePassword) {
    return true;
  } else {
    throw new Error('Forbidden.');
  }
}

export const hashPassword:IhashPassword = async ({ password, salt, errorCode }) => {
  try {
    return await bcrypt.hash(password, salt);
  } catch (error) {
    error.status = 500;
    error.code = errorCode;
    throw error;
  }
}

export const signToken:IsignToken = ({ payload, secret, errorCode }) => {
  try {
    return jsonwebtoken.sign(payload, secret);
  } catch (error) {
    error.status = 500;
    error.code = errorCode;
    throw error;
  }
}

export const invokeCallback:IinvokeCallback = (callback) => {
  callback && callback();
}

export const onServerListen:IonServerListen = (logger, database, callback) => {
  return ():void => {
    logger.info("Server is connected.");
    invokeCallback(callback);
    database.sequelize.authenticate().then(() => {
      logger.info("Database is connected.");
      invokeCallback(callback);
    }).catch((err:IError) => {
      logger.error({ err }, "Unable to connect to the database.");
      invokeCallback(callback);
    });
  };
}

export const onServerError:IonServerError = (logger, exec) => {
  return (err:IError):void => {
    if (err.code === "EADDRINUSE") {
      exec(`sh nodemon.sh`);
    } else {
      logger.error({ err }, err.message);
    }
  };
}

export const onServerClose:IonServerClose = (logger, database, callback) => {
  return (err:IError):void => {
    if (err) {
      logger.error({ err }, err.message);
      invokeCallback(callback);
    } else {
      logger.info("Server is now closed.");
      database.sequelize.close().then(() => {
        logger.info("Database is now closed.");
        invokeCallback(callback);
      }).catch((err:IError) => {
        logger.error({ err }, err.message);
        invokeCallback(callback);
      });
    }
  };
}

export const onProcessStop:IonProcessStop = (server, logger, database, callback) => {
  return ():void => {
    if (server.listening) {
      server.close(onServerClose(logger, database, () => {
        invokeCallback(callback);
      }));
    } else {
      invokeCallback(callback);
    }
  };
}

export const onProcessError:IonProcessError = (logger) => {
  return (err:IError):void => logger.error({ err }, err.message)
}
