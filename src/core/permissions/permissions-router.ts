import { methodNotAllowed } from 'src/utils/middlewares';
import { F } from './permissions-types';
import { Router } from 'express';

export const PermissionRouter:F.router = (controller) => {
  let router = Router();

  router.route('/permissions')
    .get(controller.getPermissions)
    .post(controller.createPermission)
    .all(methodNotAllowed);

  router.route('/permissions/:permission')
    .get(controller.getPermission)
    .patch(controller.updatePermission)
    .delete(controller.deletePermission)
    .all(methodNotAllowed);

  return router;
};
