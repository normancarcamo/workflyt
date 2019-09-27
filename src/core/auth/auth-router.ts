import { methodNotAllowed } from 'src/utils/middlewares';
import { F } from './auth-types';
import { Router } from 'express';

export const AuthRouter:F.router = (controller) => {
  let router = Router();

  router.route('/auth/signin')
    .post(controller.signIn)
    .all(methodNotAllowed);

  return router;
};
