const middlewares = require('src/utils/middlewares');
const express = require('express');

module.exports = controller => {
  const router = express.Router();

  router.route('/workers')
    .get(controller.getWorkers)
    .post(controller.createWorker)
    .all(middlewares.methodNotAllowed);

  router.route('/workers/:worker')
    .get(controller.getWorker)
    .patch(controller.updateWorker)
    .delete(controller.deleteWorker)
    .all(middlewares.methodNotAllowed);

  router.route('/workers/:worker/supervisors')
    .get(controller.getSupervisors)
    .put(controller.addSupervisors)
    .all(middlewares.methodNotAllowed);

  router.route('/workers/:worker/supervisors/:supervisor')
    .get(controller.getSupervisor)
    .patch(controller.updateSupervisor)
    .delete(controller.deleteSupervisor)
    .all(middlewares.methodNotAllowed);

  router.route('/workers/:worker/jobs')
    .get(controller.getJobs)
    .put(controller.addJobs)
    .all(middlewares.methodNotAllowed);

  router.route('/workers/:worker/jobs/:job')
    .get(controller.getJob)
    .patch(controller.updateJob)
    .delete(controller.deleteJob)
    .all(middlewares.methodNotAllowed);

  router.route('/workers/:worker/quotes')
    .get(controller.getQuotes)
    .all(middlewares.methodNotAllowed);

  router.route('/workers/:worker/quotes/:quote')
    .get(controller.getQuote)
    .all(middlewares.methodNotAllowed);

  router.route('/workers/:worker/user')
    .get(controller.getUser)
    .all(middlewares.methodNotAllowed);

  return router;
};
