import { methodNotAllowed } from 'src/utils/middlewares';
import { F } from './orders-types';
import { Router } from 'express';

export const OrderRouter:F.router = (controller) => {
  let router = Router();

  router.route('/orders')
    .get(controller.getOrders)
    .post(controller.createOrder)
    .all(methodNotAllowed);

  router.route('/orders/:order')
    .get(controller.getOrder)
    .patch(controller.updateOrder)
    .delete(controller.deleteOrder)
    .all(methodNotAllowed);

  router.route('/orders/:order/jobs')
    .get(controller.getJobs)
    .all(methodNotAllowed);

  router.route('/orders/:order/jobs/:job')
    .get(controller.getJob)
    .all(methodNotAllowed);

  return router;
};
