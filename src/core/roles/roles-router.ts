import { methodNotAllowed } from 'src/utils/middlewares';
import { F } from './roles-types';
import { Router } from 'express';

export const RoleRouter:F.router = (controller) => {
  let router = Router();

  router.route('/roles')
    .get(controller.getRoles)
    .post(controller.createRole)
    .all(methodNotAllowed);

  router.route('/roles/:role')
    .get(controller.getRole)
    .patch(controller.updateRole)
    .delete(controller.deleteRole)
    .all(methodNotAllowed);

  router.route('/roles/:role/permissions')
    .get(controller.getPermissions)
    .put(controller.addPermissions)
    .all(methodNotAllowed);

  router.route('/roles/:role/permissions/:permission')
    .get(controller.getPermission)
    .patch(controller.updatePermission)
    .delete(controller.deletePermission)
    .all(methodNotAllowed);

  return router;
};
