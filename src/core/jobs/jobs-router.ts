import { methodNotAllowed } from 'src/utils/middlewares';
import { F } from './jobs-types';
import { Router } from 'express';

export const JobRouter:F.router = (controller) => {
  let router = Router();

  router.route('/jobs')
    .get(controller.getJobs)
    .post(controller.createJob)
    .all(methodNotAllowed);

  router.route('/jobs/:job')
    .get(controller.getJob)
    .patch(controller.updateJob)
    .delete(controller.deleteJob)
    .all(methodNotAllowed);

  router.route('/jobs/:job/subjobs')
    .get(controller.getSubjobs)
    .put(controller.addSubjobs)
    .all(methodNotAllowed);

  router.route('/jobs/:job/subjobs/:subjob')
    .get(controller.getSubjob)
    .patch(controller.updateSubjob)
    .delete(controller.deleteSubjob)
    .all(methodNotAllowed);

  router.route('/jobs/:job/workers')
    .get(controller.getWorkers)
    .put(controller.addWorkers)
    .all(methodNotAllowed);

  router.route('/jobs/:job/workers/:worker')
    .get(controller.getWorker)
    .patch(controller.updateWorker)
    .delete(controller.deleteWorker)
    .all(methodNotAllowed);

  router.route('/jobs/:job/materials')
    .get(controller.getMaterials)
    .put(controller.addMaterials)
    .all(methodNotAllowed);

  router.route('/jobs/:job/materials/:material')
    .get(controller.getMaterial)
    .patch(controller.updateMaterial)
    .delete(controller.deleteMaterial)
    .all(methodNotAllowed);

  return router;
};
