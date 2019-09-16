const middlewares = require('src/utils/middlewares');
const express = require('express');

module.exports = controller => {
  const router = express.Router();

  router.route('/users')
    .get(controller.getUsers)
    .post(controller.createUser)
    .all(middlewares.methodNotAllowed);

  router.route('/users/:user')
    .get(controller.getUser)
    .patch(controller.updateUser)
    .delete(controller.deleteUser)
    .all(middlewares.methodNotAllowed);

  router.route('/users/:user/roles')
    .get(controller.getRoles)
    .put(controller.addRoles)
    .all(middlewares.methodNotAllowed);

  router.route('/users/:user/roles/:role')
    .get(controller.getRole)
    .patch(controller.updateRole)
    .delete(controller.deleteRole)
    .all(middlewares.methodNotAllowed);

  return router;
};
