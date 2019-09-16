// dependencies:
const middlewares = require('src/utils/middlewares');
const express = require('express');

module.exports = controller => {
  const router = express.Router();

  router.route('/materials')
    .get(controller.getMaterials)
    .post(controller.createMaterial)
    .all(middlewares.methodNotAllowed);

  router.route('/materials/:material')
    .get(controller.getMaterial)
    .patch(controller.updateMaterial)
    .delete(controller.deleteMaterial)
    .all(middlewares.methodNotAllowed);

  router.route('/materials/:material/stocks')
    .get(controller.getStocks)
    .all(middlewares.methodNotAllowed);

  router.route('/materials/:material/stocks/:stock')
    .get(controller.getStock)
    .all(middlewares.methodNotAllowed);

  return router;
};
