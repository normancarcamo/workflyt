import { Request, Response, NextFunction } from 'express';
import { Idatabase } from 'src/providers/postgres/types';
import { VerifyOptions } from 'jsonwebtoken';
import { Logger, LoggerOptions } from 'pino';
import { Server } from 'http';
import { ChildProcess } from 'child_process';

export interface IFunction <T> {
  (): T
}

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

export interface IHandler  {
  (req:IRequest, res:Response, next:NextFunction):any
}

export interface IHandlerError  {
  (context:IError, req:IRequest, res:Response, next:NextFunction):void
}

// middlewares.ts -------------------------------------------------------------

export interface ItrackTime {
  ():IHandler
}

export interface IlogResponse {
  (logger:Logger):IHandler
}

export interface IhandleError {
  ():IHandlerError
}

export interface IhandleNotFound {
  ():IHandler
}

export interface ImethodNotAllowed {
  ():IHandler
}

export interface IvalidateToken {
  (jsonwebtoken:IJsonWebToken):IHandler
}

export interface IvalidateRights {
  (name:string):IHandler
}

export interface IvalidateInput {
  (schema:IValidator):IHandler
}

export interface IMiddlewares {
  trackTime:ItrackTime
  logResponse:IlogResponse
  handleError:IhandleError
  handleNotFound:IhandleNotFound
  methodNotAllowed:ImethodNotAllowed
  validateToken:IvalidateToken
  validateRights:IvalidateRights
  validateInput:IvalidateInput
}

// helpers.ts -----------------------------------------------------------------

export interface IcomparePassword {
  (raw:string, hash:string):Promise<boolean>
}

export interface IhashPassword {
  (password:string, salt:number):Promise<string>
}

export interface IsignToken {
  (payload:any, secret:string):string
}

export interface IinvokeCallback {
  (callback?:Function):void
}

export interface IonServerListen {
  (logger:Logger, database:Idatabase, callback?:Function): () => void
}

export interface IonServerError {
  (logger:Logger, exec:(command:string) => ChildProcess): (err:any) => void
}

export interface IonServerClose {
  (logger:Logger, database:Idatabase, callback?:Function): (err:any) => void
}

export interface IonProcessStop {
  (server:Server, logger:Logger, database:Idatabase, callback?:Function): () => void
}

export interface IonProcessError {
  (logger:Logger): (err:any) => void
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

export type TSchema = { attributes: string[]; associations?: string[]; };

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
