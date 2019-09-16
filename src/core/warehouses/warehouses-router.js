const middlewares = require('src/utils/middlewares');
const express = require('express');

module.exports = controller => {
  const router = express.Router();

  router.route('/warehouses')
    .get(controller.getWarehouses)
    .post(controller.createWarehouse)
    .all(middlewares.methodNotAllowed);

  router.route('/warehouses/:warehouse')
    .get(controller.getWarehouse)
    .patch(controller.updateWarehouse)
    .delete(controller.deleteWarehouse)
    .all(middlewares.methodNotAllowed);

  router.route('/warehouses/:warehouse/materials')
    .get(controller.getMaterials)
    .put(controller.addMaterials)
    .all(middlewares.methodNotAllowed);

  router.route('/warehouses/:warehouse/materials/:material')
    .get(controller.getMaterial)
    .patch(controller.updateMaterial)
    .delete(controller.deleteMaterial)
    .all(middlewares.methodNotAllowed);

  return router;
};
