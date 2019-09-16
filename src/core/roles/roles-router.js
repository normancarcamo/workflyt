const middlewares = require('src/utils/middlewares');
const express = require('express');

module.exports = controller => {
  const router = express.Router();

  router.route('/roles')
    .get(controller.getRoles)
    .post(controller.createRole)
    .all(middlewares.methodNotAllowed);

  router.route('/roles/:role')
    .get(controller.getRole)
    .patch(controller.updateRole)
    .delete(controller.deleteRole)
    .all(middlewares.methodNotAllowed);

  router.route('/roles/:role/permissions')
    .get(controller.getPermissions)
    .put(controller.addPermissions)
    .all(middlewares.methodNotAllowed);

  router.route('/roles/:role/permissions/:permission')
    .get(controller.getPermission)
    .patch(controller.updatePermission)
    .delete(controller.deletePermission)
    .all(middlewares.methodNotAllowed);

  return router;
};
