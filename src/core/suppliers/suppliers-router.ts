import { methodNotAllowed } from 'src/utils/middlewares';
import { F } from './suppliers-types';
import { Router } from 'express';

export const SupplierRouter:F.router = (controller) => {
  let router = Router();

  router.route('/suppliers')
    .get(controller.getSuppliers)
    .post(controller.createSupplier)
    .all(methodNotAllowed);

  router.route('/suppliers/:supplier')
    .get(controller.getSupplier)
    .patch(controller.updateSupplier)
    .delete(controller.deleteSupplier)
    .all(methodNotAllowed);

  router.route('/suppliers/:supplier/materials')
    .get(controller.getMaterials)
    .put(controller.addMaterials)
    .all(methodNotAllowed);

  router.route('/suppliers/:supplier/materials/:material')
    .get(controller.getMaterial)
    .patch(controller.updateMaterial)
    .delete(controller.deleteMaterial)
    .all(methodNotAllowed);

  return router;
};
