const middlewares = require('src/utils/middlewares');
const express = require('express');

module.exports = controller => {
  const router = express.Router();

  router.route('/stocks')
    .get(controller.getStocks)
    .post(controller.createStock)
    .all(middlewares.methodNotAllowed);

  router.route('/stocks/:stock')
    .get(controller.getStock)
    .patch(controller.updateStock)
    .delete(controller.deleteStock)
    .all(middlewares.methodNotAllowed);

  return router;
};
