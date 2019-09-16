const middlewares = require('src/utils/middlewares');
const express = require('express');

module.exports = controller => {
  const router = express.Router();

  router.route('/companies')
    .get(controller.getCompanies)
    .post(controller.createCompany)
    .all(middlewares.methodNotAllowed);

  router.route('/companies/:company')
    .get(controller.getCompany)
    .patch(controller.updateCompany)
    .delete(controller.deleteCompany)
    .all(middlewares.methodNotAllowed);

  return router;
};
