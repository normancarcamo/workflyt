import { Server } from 'http';
import { Request, Response, NextFunction } from 'express';
import { VerifyOptions } from 'jsonwebtoken';
import { Logger, LoggerOptions } from 'pino';
import { Idatabase } from '../providers/postgres/index';

export interface IError {
  name:string|undefined;
  message:string;
  reason?:string|undefined;
  code?:string|number;
  status:number;
  [key:string]:any;
}

export interface IJsonWebTokenSignature {
  sub:string
  roles:string[]
  permissions:string[]
}

export interface IJsonWebToken {
  verify(token: string, secretOrPublicKey: string|Buffer|undefined, options?: VerifyOptions|undefined): string|object|IJsonWebTokenSignature
}

export interface IRequest extends Request {
  start?:number|any
  error?:IError
  token?:IJsonWebToken|any
}

export interface IValidator {
  validate(values:object):Promise<{
    query:any
    body:any
    params:any
    headers?:any
  }>
}

export interface IMiddleware  {
  (req:IRequest, res:Response, next:NextFunction):any
}

export interface IMiddlewareError  {
  (context:IError, req:IRequest, res:Response, next:NextFunction):void
}

// middlewares.ts -------------------------------------------------------------

export interface IMiddlewares {
  trackTime():IMiddleware
  logResponse (logger:Logger):IMiddleware
  handleError():IMiddlewareError
  handleNotFound():IMiddleware
  methodNotAllowed():IMiddleware
  validateToken(jsonwebtoken:IJsonWebToken):IMiddleware
  validateRights(name:string):IMiddleware
  validateInput(schema:IValidator):IMiddleware
}

// helpers.ts -----------------------------------------------------------------

export interface IcomparePassword {
  (options:{ raw:string, hash:string, errorCode?:string|number }):Promise<boolean>
}

export interface IhashPassword {
  (options:{ password:string, salt:number, errorCode?:string|number }):Promise<string>
}

export interface IsignToken {
  (options:{ payload:any, secret:string, errorCode?:string|number }):string
}

export interface IinvokeCallback {
  (callback?:Function):void
}

export interface IonServerListen {
  (logger:Logger, database:Idatabase, callback?:() => void):any
}

export interface IonServerError {
  (logger:Logger, exec:(command:string) => void):any
}

export interface IonServerClose {
  (logger:Logger, database:Idatabase, callback:Function):any
}

export interface IonProcessStop {
  (server:Server, logger:Logger, database:Idatabase, callback?:Function):any
}

export interface IonProcessError {
  (logger:Logger):any
}

export interface IHelpers {
  comparePassword: IcomparePassword
  hashPassword: IhashPassword
  signToken: IsignToken
  invokeCallback: IinvokeCallback
  onServerListen: IonServerListen
  onServerError: IonServerError
  onServerClose: IonServerClose
  onProcessStop: IonProcessStop
  onProcessError: IonProcessError
}

// schemas.ts -----------------------------------------------------------------

export interface IValidatorSchema {
  UUID(extra:object):object
  UUID_ARRAY(extra:object):object
  ENUM(elements:string[], extra:object):object
  CODE(extra:object):object
  TEXT(extra:object):object
  TEXT_FILTER(extra:object):object
  DATE(extra:object):object
  DATE_FILTER(extra:object):object
  NUMBER(extra:object):object
  NUMBER_FILTER(extra:object):object
  PASS(extra:object):object
  EXTRA(extra:object):object
  ATTRIBUTES(elements:string[]):object
  INCLUDE(associations:string[]):object
  BOOLEAN(extra:object):object
  OFFSET(extra:object):object
  LIMIT(extra:object):object
  ORDER_BY(extra:object):object
  QUERY(keys:object, extra:object):object
  BODY(keys:object, extra:object):object
  PARAMS(keys:object, extra:object):object
}

// index.ts -------------------------------------------------------------------

export interface IUtils extends IMiddlewares, IHelpers {
  logger:LoggerOptions
  schema:IValidatorSchema
}
