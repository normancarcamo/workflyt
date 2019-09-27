import { methodNotAllowed } from 'src/utils/middlewares';
import { F } from './services-types';
import { Router } from 'express';

export const ServiceRouter:F.router = (controller) => {
  let router = Router();

  router.route('/services')
    .get(controller.getServices)
    .post(controller.createService)
    .all(methodNotAllowed);

  router.route('/services/:service')
    .get(controller.getService)
    .patch(controller.updateService)
    .delete(controller.deleteService)
    .all(methodNotAllowed);

  router.route('/services/:service/jobs')
    .get(controller.getJobs)
    .all(methodNotAllowed);

  router.route('/services/:service/jobs/:job')
    .get(controller.getJob)
    .all(methodNotAllowed);

  return router;
};
