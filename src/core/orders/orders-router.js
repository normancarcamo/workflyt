const middlewares = require('src/utils/middlewares');
const express = require('express');

module.exports = controller => {
  const router = express.Router();

  router.route('/orders')
    .get(controller.getOrders)
    .post(controller.createOrder)
    .all(middlewares.methodNotAllowed);

  router.route('/orders/:order')
    .get(controller.getOrder)
    .patch(controller.updateOrder)
    .delete(controller.deleteOrder)
    .all(middlewares.methodNotAllowed);

  router.route('/orders/:order/jobs')
    .get(controller.getJobs)
    .all(middlewares.methodNotAllowed);

  router.route('/orders/:order/jobs/:job')
    .get(controller.getJob)
    .all(middlewares.methodNotAllowed);

  return router;
};
