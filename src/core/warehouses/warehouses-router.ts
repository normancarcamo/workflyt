import { methodNotAllowed } from 'src/utils/middlewares';
import { F } from './warehouses-types';
import { Router } from 'express';

export const WarehouseRouter:F.router = (controller) => {
  let router = Router();

  router.route('/warehouses')
    .get(controller.getWarehouses)
    .post(controller.createWarehouse)
    .all(methodNotAllowed);

  router.route('/warehouses/:warehouse')
    .get(controller.getWarehouse)
    .patch(controller.updateWarehouse)
    .delete(controller.deleteWarehouse)
    .all(methodNotAllowed);

  router.route('/warehouses/:warehouse/materials')
    .get(controller.getMaterials)
    .put(controller.addMaterials)
    .all(methodNotAllowed);

  router.route('/warehouses/:warehouse/materials/:material')
    .get(controller.getMaterial)
    .patch(controller.updateMaterial)
    .delete(controller.deleteMaterial)
    .all(methodNotAllowed);

  return router;
};
