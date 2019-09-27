import { Idatabase } from '../providers/postgres/types';
import { ChildProcess } from 'child_process';
import jsonwebtoken from 'jsonwebtoken';
import { Logger } from 'pino';
import { Server } from 'http';
import bcrypt from 'bcrypt';

export async function comparePassword (raw:string, hash:string):Promise<boolean> {
  let match:boolean = await bcrypt.compare(raw, hash);
  if (match) {
    return true;
  } else {
    throw new Error('Forbidden.');
  }
}

export async function hashPassword (password:string, salt:number):Promise<string> {
  return await bcrypt.hash(password, salt);
}

export function signToken (payload:any, secret:string):string {
  return jsonwebtoken.sign(payload, secret);
}

export function invokeCallback (callback?:Function):void {
  callback && callback();
}

export function onServerListen (logger:Logger, database:Idatabase, callback?:Function) {
  return function ():void {
    logger.info("Server is connected.");
    database.sequelize.authenticate().then(() => {
      logger.info("Database is connected.");
      invokeCallback(callback);
    }).catch((err:any) => {
      logger.error({ err }, "Unable to connect to the database.");
      invokeCallback(callback);
    });
  };
}

export function onServerError (logger:Logger, exec:(command:string) => ChildProcess) {
  return function (err:any):void {
    if (err.code === "EADDRINUSE") {
      exec(`sh nodemon.sh`);
    } else {
      logger.error({ err }, err.message);
    }
  };
}

export function onServerClose (logger:Logger, database:Idatabase, callback?:Function) {
  return function (err:any):void {
    if (err) {
      logger.error({ err }, err.message);
      invokeCallback(callback);
    } else {
      logger.info("Server is now closed.");
      database.sequelize.close().then(() => {
        logger.info("Database is now closed.");
        invokeCallback(callback);
      }).catch((err:any) => {
        logger.error({ err }, err.message);
        invokeCallback(callback);
      });
    }
  };
}

export function onProcessStop (server:Server, logger:Logger, database:Idatabase, callback?:Function) {
  return function ():void {
    if (server.listening) {
      server.close(onServerClose(logger, database, () => {
        invokeCallback(callback);
      }));
    } else {
      invokeCallback(callback);
    }
  };
}

export function onProcessError (logger:Logger) {
  return function (err:any):void {
    logger.error({ err }, err.message);
  }
}
