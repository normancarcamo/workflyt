const middlewares = require('src/utils/middlewares');
const express = require('express');

module.exports = controller => {
  const router = express.Router();

  router.route('/areas')
    .get(controller.getAreas)
    .post(controller.createArea)
    .all(middlewares.methodNotAllowed);

  router.route('/areas/:area')
    .get(controller.getArea)
    .patch(controller.updateArea)
    .delete(controller.deleteArea)
    .all(middlewares.methodNotAllowed);

  router.route('/areas/:area/subareas')
    .get(controller.getSubareas)
    .put(controller.addSubareas)
    .all(middlewares.methodNotAllowed);

  router.route('/areas/:area/subareas/:subarea')
    .get(controller.getSubarea)
    .patch(controller.updateSubarea)
    .delete(controller.deleteSubarea)
    .all(middlewares.methodNotAllowed);

  router.route('/areas/:area/workers')
    .get(controller.getWorkers)
    .put(controller.addWorkers)
    .all(middlewares.methodNotAllowed);

  router.route('/areas/:area/workers/:worker')
    .get(controller.getWorker)
    .patch(controller.updateWorker)
    .delete(controller.deleteWorker)
    .all(middlewares.methodNotAllowed);

  router.route('/areas/:area/services')
    .get(controller.getServices)
    .all(middlewares.methodNotAllowed);

  router.route('/areas/:area/services/:service')
    .get(controller.getService)
    .all(middlewares.methodNotAllowed);

  return router;
};
