import { methodNotAllowed } from 'src/utils/middlewares';
import { F } from './stocks-types';
import { Router } from 'express';

export const StockRouter:F.router = (controller) => {
  let router = Router();

  router.route('/stocks')
    .get(controller.getStocks)
    .post(controller.createStock)
    .all(methodNotAllowed);

  router.route('/stocks/:stock')
    .get(controller.getStock)
    .patch(controller.updateStock)
    .delete(controller.deleteStock)
    .all(methodNotAllowed);

  return router;
};
