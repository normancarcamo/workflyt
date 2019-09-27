import { methodNotAllowed } from 'src/utils/middlewares';
import { F } from './users-types';
import { Router } from 'express';

export const UserRouter:F.router = (controller) => {
  let router = Router();

  router.route('/users')
    .get(controller.getUsers)
    .post(controller.createUser)
    .all(methodNotAllowed);

  router.route('/users/:user')
    .get(controller.getUser)
    .patch(controller.updateUser)
    .delete(controller.deleteUser)
    .all(methodNotAllowed);

  router.route('/users/:user/roles')
    .get(controller.getRoles)
    .put(controller.addRoles)
    .all(methodNotAllowed);

  router.route('/users/:user/roles/:role')
    .get(controller.getRole)
    .patch(controller.updateRole)
    .delete(controller.deleteRole)
    .all(methodNotAllowed);

  return router;
};
