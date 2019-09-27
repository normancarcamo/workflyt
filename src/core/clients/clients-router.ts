import { methodNotAllowed } from 'src/utils/middlewares';
import { F } from './clients-types';
import { Router } from 'express';

export const ClientRouter:F.router = (controller) => {
  let router = Router();

  router.route('/clients')
    .get(controller.getClients)
    .post(controller.createClient)
    .all(methodNotAllowed);

  router.route('/clients/:client')
    .get(controller.getClient)
    .patch(controller.updateClient)
    .delete(controller.deleteClient)
    .all(methodNotAllowed);

  router.route('/clients/:client/quotes')
    .get(controller.getQuotes)
    .all(methodNotAllowed);

  router.route('/clients/:client/quotes/:quote')
    .get(controller.getQuote)
    .all(methodNotAllowed);

  return router;
};
