import { F } from './workers-types';

export const WorkerController:F.controller = (service, validator, helpers) => ({
  getWorkers: [
    helpers.validateRights('get workers'),
    helpers.validateInput(validator.getWorkers),
    function handler (req, res, next) {
      service.getWorkers(req.query)
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  createWorker: [
    helpers.validateRights('create worker'),
    helpers.validateInput(validator.createWorker),
    function handler (req, res, next) {
      service.createWorker(req.body)
        .then(result => res.status(201).json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getWorker: [
    helpers.validateRights('get worker'),
    helpers.validateInput(validator.getWorker),
    function handler (req, res, next) {
      let worker_id = req.params.worker;
      let options = req.query;
      service.getWorker(worker_id, options)
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  updateWorker: [
    helpers.validateRights('update worker'),
    helpers.validateInput(validator.updateWorker),
    function handler (req, res, next) {
      let worker_id = req.params.worker;
      let values = req.body;
      let options = req.query;
      service.updateWorker(worker_id, values, options)
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  deleteWorker: [
    helpers.validateRights('delete worker'),
    helpers.validateInput(validator.deleteWorker),
    function handler (req, res, next) {
      let worker_id = req.params.worker;
      let options = req.query;
      service.deleteWorker(worker_id, options)
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getSupervisors: [
    helpers.validateRights('get supervisors from worker'),
    helpers.validateInput(validator.getSupervisors),
    function handler (req, res, next) {
      let worker_id = req.params.worker;
      let options = req.query;
      service.getSupervisors(worker_id, options)
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  addSupervisors: [
    helpers.validateRights('add supervisors to worker'),
    helpers.validateInput(validator.addSupervisors),
    function handler (req, res, next) {
      let worker_id = req.params.worker;
      let supervisors = req.body.supervisors;
      service.addSupervisors(worker_id, supervisors)
        .then(result => res.status(201).json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getSupervisor: [
    helpers.validateRights('get supervisor from worker'),
    helpers.validateInput(validator.getSupervisor),
    function handler (req, res, next) {
      let worker_id = req.params.worker;
      let supervisor_id = req.params.supervisor;
      let options = req.query;
      service.getSupervisor(worker_id, supervisor_id, options)
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  updateSupervisor: [
    helpers.validateRights('update supervisor from worker'),
    helpers.validateInput(validator.updateSupervisor),
    function handler (req, res, next) {
      let worker_id = req.params.worker;
      let supervisor_id = req.params.supervisor;
      let values = req.body;
      let options = req.query;
      service.updateSupervisor(worker_id, supervisor_id, values, options)
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  deleteSupervisor: [
    helpers.validateRights('delete supervisor from worker'),
    helpers.validateInput(validator.deleteSupervisor),
    function handler (req, res, next) {
      let worker_id = req.params.worker;
      let supervisor_id = req.params.supervisor;
      let options = req.query;
      service.deleteSupervisor(worker_id, supervisor_id, options)
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getJobs: [
    helpers.validateRights('get jobs from worker'),
    helpers.validateInput(validator.getJobs),
    function handler (req, res, next) {
      let worker_id = req.params.worker;
      let options = req.query;
      service.getJobs(worker_id, options)
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  addJobs: [
    helpers.validateRights('add jobs to worker'),
    helpers.validateInput(validator.addJobs),
    function handler (req, res, next) {
      let worker_id = req.params.worker;
      let jobs = req.body.jobs;
      service.addJobs(worker_id, jobs)
        .then(result => res.status(201).json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getJob: [
    helpers.validateRights('get job from worker'),
    helpers.validateInput(validator.getJob),
    function handler (req, res, next) {
      let worker_id = req.params.worker;
      let job_id = req.params.job;
      let options = req.query;
      service.getJob(worker_id, job_id, options)
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  updateJob: [
    helpers.validateRights('update job from worker'),
    helpers.validateInput(validator.updateJob),
    function handler (req, res, next) {
      let worker_id = req.params.worker;
      let job_id = req.params.job;
      let values = req.body;
      let options = req.query;
      service.updateJob(worker_id, job_id, values, options)
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  deleteJob: [
    helpers.validateRights('delete job from worker'),
    helpers.validateInput(validator.deleteJob),
    function handler (req, res, next) {
      let worker_id = req.params.worker;
      let job_id = req.params.job;
      let options = req.query;
      service.deleteJob(worker_id, job_id, options)
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getQuotes: [
    helpers.validateRights('get quotes from worker'),
    helpers.validateInput(validator.getQuotes),
    function handler (req, res, next) {
      let worker_id = req.params.worker;
      let options = req.query;
      service.getQuotes(worker_id, options)
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getQuote: [
    helpers.validateRights('get quote from worker'),
    helpers.validateInput(validator.getQuote),
    function handler (req, res, next) {
      let worker_id = req.params.worker;
      let quote_id = req.params.quote;
      let options = req.query;
      service.getQuote(worker_id, quote_id, options)
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getUser: [
    helpers.validateRights('get user from worker'),
    helpers.validateInput(validator.getUser),
    function handler (req, res, next) {
      let worker_id = req.params.worker;
      let options = req.query;
      service.getUser(worker_id, options)
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ]
});
