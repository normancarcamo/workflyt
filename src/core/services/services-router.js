const middlewares = require('src/utils/middlewares');
const express = require('express');

module.exports = controller => {
  const router = express.Router();

  router.route('/services')
    .get(controller.getServices)
    .post(controller.createService)
    .all(middlewares.methodNotAllowed);

  router.route('/services/:service')
    .get(controller.getService)
    .patch(controller.updateService)
    .delete(controller.deleteService)
    .all(middlewares.methodNotAllowed);

  router.route('/services/:service/jobs')
    .get(controller.getJobs)
    .all(middlewares.methodNotAllowed);

  router.route('/services/:service/jobs/:job')
    .get(controller.getJob)
    .all(middlewares.methodNotAllowed);

  return router;
};
