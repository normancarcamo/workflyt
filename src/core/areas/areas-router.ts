import { methodNotAllowed } from 'src/utils/middlewares';
import { F } from './areas-types';
import { Router } from 'express';

export const AreaRouter:F.router = (controller) => {
  let router = Router();

  router.route('/areas')
    .get(controller.getAreas)
    .post(controller.createArea)
    .all(methodNotAllowed);

  router.route('/areas/:area')
    .get(controller.getArea)
    .patch(controller.updateArea)
    .delete(controller.deleteArea)
    .all(methodNotAllowed);

  router.route('/areas/:area/subareas')
    .get(controller.getSubareas)
    .put(controller.addSubareas)
    .all(methodNotAllowed);

  router.route('/areas/:area/subareas/:subarea')
    .get(controller.getSubarea)
    .patch(controller.updateSubarea)
    .delete(controller.deleteSubarea)
    .all(methodNotAllowed);

  router.route('/areas/:area/workers')
    .get(controller.getWorkers)
    .put(controller.addWorkers)
    .all(methodNotAllowed);

  router.route('/areas/:area/workers/:worker')
    .get(controller.getWorker)
    .patch(controller.updateWorker)
    .delete(controller.deleteWorker)
    .all(methodNotAllowed);

  router.route('/areas/:area/services')
    .get(controller.getServices)
    .all(methodNotAllowed);

  router.route('/areas/:area/services/:service')
    .get(controller.getService)
    .all(methodNotAllowed);

  return router;
};
