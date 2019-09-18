import { Request, Response, NextFunction } from 'express';
import { IAuthService, IAuthController, IAuthValidator } from './auth-interfaces';
import { IUtils } from 'src/utils/interfaces';

export const AuthController = ({ service, helpers, validator }:{ service:IAuthService, validator:IAuthValidator, helpers:IUtils }):IAuthController => ({
  signIn: [
    helpers.validateInput(validator.signIn),
    function handler (req:Request, res:Response, next:NextFunction):void {
      let username:string = req.body.username;
      let password:string = req.body.password;
      service.signIn({ username, password })
        .then((result:any) => res.json({ success: true, data: result }))
        .catch(next);
    }
  ]
});
