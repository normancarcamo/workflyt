const middlewares = require('src/utils/middlewares');
const express = require('express');

module.exports = controller => {
  const router = express.Router();

  router.route('/auth/signin')
    .post(controller.signIn)
    .all(middlewares.methodNotAllowed);

  return router;
};
