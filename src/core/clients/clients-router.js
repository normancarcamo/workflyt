// dependencies:
const middlewares = require('src/utils/middlewares');
const express = require('express');

module.exports = controller => {
  const router = express.Router();

  router.route('/clients')
    .get(controller.getClients)
    .post(controller.createClient)
    .all(middlewares.methodNotAllowed);

  router.route('/clients/:client')
    .get(controller.getClient)
    .patch(controller.updateClient)
    .delete(controller.deleteClient)
    .all(middlewares.methodNotAllowed);

  router.route('/clients/:client/quotes')
    .get(controller.getQuotes)
    .all(middlewares.methodNotAllowed);

  router.route('/clients/:client/quotes/:quote')
    .get(controller.getQuote)
    .all(middlewares.methodNotAllowed);

  return router;
};
