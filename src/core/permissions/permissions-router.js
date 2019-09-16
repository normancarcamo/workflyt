const middlewares = require('src/utils/middlewares');
const express = require('express');

module.exports = controller => {
  const router = express.Router();

  router.route('/permissions')
    .get(controller.getPermissions)
    .post(controller.createPermission)
    .all(middlewares.methodNotAllowed);

  router.route('/permissions/:permission')
    .get(controller.getPermission)
    .patch(controller.updatePermission)
    .delete(controller.deletePermission)
    .all(middlewares.methodNotAllowed);

  return router;
};
