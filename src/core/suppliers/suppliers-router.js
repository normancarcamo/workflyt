const middlewares = require('src/utils/middlewares');
const express = require('express');

module.exports = controller => {
  const router = express.Router();

  router.route('/suppliers')
    .get(controller.getSuppliers)
    .post(controller.createSupplier)
    .all(middlewares.methodNotAllowed);

  router.route('/suppliers/:supplier')
    .get(controller.getSupplier)
    .patch(controller.updateSupplier)
    .delete(controller.deleteSupplier)
    .all(middlewares.methodNotAllowed);

  router.route('/suppliers/:supplier/materials')
    .get(controller.getMaterials)
    .put(controller.addMaterials)
    .all(middlewares.methodNotAllowed);

  router.route('/suppliers/:supplier/materials/:material')
    .get(controller.getMaterial)
    .patch(controller.updateMaterial)
    .delete(controller.deleteMaterial)
    .all(middlewares.methodNotAllowed);

  return router;
};
