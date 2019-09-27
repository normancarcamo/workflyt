import { methodNotAllowed } from 'src/utils/middlewares';
import { F } from './workers-types';
import { Router } from 'express';

export const WorkerRouter:F.router = (controller) => {
  let router = Router();

  router.route('/workers')
    .get(controller.getWorkers)
    .post(controller.createWorker)
    .all(methodNotAllowed);

  router.route('/workers/:worker')
    .get(controller.getWorker)
    .patch(controller.updateWorker)
    .delete(controller.deleteWorker)
    .all(methodNotAllowed);

  router.route('/workers/:worker/supervisors')
    .get(controller.getSupervisors)
    .put(controller.addSupervisors)
    .all(methodNotAllowed);

  router.route('/workers/:worker/supervisors/:supervisor')
    .get(controller.getSupervisor)
    .patch(controller.updateSupervisor)
    .delete(controller.deleteSupervisor)
    .all(methodNotAllowed);

  router.route('/workers/:worker/jobs')
    .get(controller.getJobs)
    .put(controller.addJobs)
    .all(methodNotAllowed);

  router.route('/workers/:worker/jobs/:job')
    .get(controller.getJob)
    .patch(controller.updateJob)
    .delete(controller.deleteJob)
    .all(methodNotAllowed);

  router.route('/workers/:worker/quotes')
    .get(controller.getQuotes)
    .all(methodNotAllowed);

  router.route('/workers/:worker/quotes/:quote')
    .get(controller.getQuote)
    .all(methodNotAllowed);

  router.route('/workers/:worker/user')
    .get(controller.getUser)
    .all(methodNotAllowed);

  return router;
};
