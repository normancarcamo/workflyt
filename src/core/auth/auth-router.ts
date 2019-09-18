import { methodNotAllowed } from 'src/utils/middlewares';
import { IAuthController } from './auth-interfaces';
import { Router } from 'express';

export const AuthRouter = (controller:IAuthController):Router => {
  let router = Router();

  router.route('/auth/signin')
    .post(controller.signIn)
    .all(methodNotAllowed);

  return router;
};
