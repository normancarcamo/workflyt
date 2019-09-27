import { methodNotAllowed } from 'src/utils/middlewares';
import { F } from './materials-types';
import { Router } from 'express';

export const MaterialRouter:F.router = (controller) => {
  let router = Router();

  router.route('/materials')
    .get(controller.getMaterials)
    .post(controller.createMaterial)
    .all(methodNotAllowed);

  router.route('/materials/:material')
    .get(controller.getMaterial)
    .patch(controller.updateMaterial)
    .delete(controller.deleteMaterial)
    .all(methodNotAllowed);

  router.route('/materials/:material/stocks')
    .get(controller.getStocks)
    .all(methodNotAllowed);

  router.route('/materials/:material/stocks/:stock')
    .get(controller.getStock)
    .all(methodNotAllowed);

  return router;
};
