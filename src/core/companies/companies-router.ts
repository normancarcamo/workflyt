import { methodNotAllowed } from 'src/utils/middlewares';
import { F } from './companies-types';
import { Router } from 'express';

export const CompanyRouter:F.router = (controller) => {
  let router = Router();

  router.route('/companies')
    .get(controller.getCompanies)
    .post(controller.createCompany)
    .all(methodNotAllowed);

  router.route('/companies/:company')
    .get(controller.getCompany)
    .patch(controller.updateCompany)
    .delete(controller.deleteCompany)
    .all(methodNotAllowed);

  return router;
};
