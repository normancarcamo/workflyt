import { methodNotAllowed } from 'src/utils/middlewares';
import { F } from './quotes-types';
import { Router } from 'express';

export const QuoteRouter:F.router = (controller) => {
  let router = Router();

  router.route('/quotes')
    .get(controller.getQuotes)
    .post(controller.createQuote)
    .all(methodNotAllowed);

  router.route('/quotes/:quote')
    .get(controller.getQuote)
    .patch(controller.updateQuote)
    .delete(controller.deleteQuote)
    .all(methodNotAllowed);

  router.route('/quotes/:quote/services')
    .get(controller.getServices)
    .put(controller.addServices)
    .all(methodNotAllowed);

  router.route('/quotes/:quote/services/:service')
    .get(controller.getService)
    .patch(controller.updateService)
    .delete(controller.deleteService)
    .all(methodNotAllowed);

  router.route('/quotes/:quote/orders')
    .get(controller.getOrders)
    .all(methodNotAllowed);

  router.route('/quotes/:quote/orders/:order')
    .get(controller.getOrder)
    .all(methodNotAllowed);

  return router;
};
