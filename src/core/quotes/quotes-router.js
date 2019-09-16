const middlewares = require('src/utils/middlewares');
const express = require('express');

module.exports = controller => {
  const router = express.Router();

  router.route('/quotes')
    .get(controller.getQuotes)
    .post(controller.createQuote)
    .all(middlewares.methodNotAllowed);

  router.route('/quotes/:quote')
    .get(controller.getQuote)
    .patch(controller.updateQuote)
    .delete(controller.deleteQuote)
    .all(middlewares.methodNotAllowed);

  router.route('/quotes/:quote/services')
    .get(controller.getServices)
    .put(controller.addServices)
    .all(middlewares.methodNotAllowed);

  router.route('/quotes/:quote/services/:service')
    .get(controller.getService)
    .patch(controller.updateService)
    .delete(controller.deleteService)
    .all(middlewares.methodNotAllowed);

  router.route('/quotes/:quote/orders')
    .get(controller.getOrders)
    .all(middlewares.methodNotAllowed);

  router.route('/quotes/:quote/orders/:order')
    .get(controller.getOrder)
    .all(middlewares.methodNotAllowed);

  return router;
};
