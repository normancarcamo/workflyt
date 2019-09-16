const middlewares = require('src/utils/middlewares');
const express = require('express');

module.exports = controller => {
  const router = express.Router();

  router.route('/jobs')
    .get(controller.getJobs)
    .post(controller.createJob)
    .all(middlewares.methodNotAllowed);

  router.route('/jobs/:job')
    .get(controller.getJob)
    .patch(controller.updateJob)
    .delete(controller.deleteJob)
    .all(middlewares.methodNotAllowed);

  router.route('/jobs/:job/subjobs')
    .get(controller.getSubjobs)
    .put(controller.addSubjobs)
    .all(middlewares.methodNotAllowed);

  router.route('/jobs/:job/subjobs/:subjob')
    .get(controller.getSubjob)
    .patch(controller.updateSubjob)
    .delete(controller.deleteSubjob)
    .all(middlewares.methodNotAllowed);

  router.route('/jobs/:job/workers')
    .get(controller.getWorkers)
    .put(controller.addWorkers)
    .all(middlewares.methodNotAllowed);

  router.route('/jobs/:job/workers/:worker')
    .get(controller.getWorker)
    .patch(controller.updateWorker)
    .delete(controller.deleteWorker)
    .all(middlewares.methodNotAllowed);

  router.route('/jobs/:job/materials')
    .get(controller.getMaterials)
    .put(controller.addMaterials)
    .all(middlewares.methodNotAllowed);

  router.route('/jobs/:job/materials/:material')
    .get(controller.getMaterial)
    .patch(controller.updateMaterial)
    .delete(controller.deleteMaterial)
    .all(middlewares.methodNotAllowed);

  return router;
};
