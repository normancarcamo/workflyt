import { F } from './services-types';

export const ServiceController:F.controller = (service, validator, helpers) => ({
  getServices: [
    helpers.validateRights('get services'),
    helpers.validateInput(validator.getServices),
    function handler (req, res, next) {
      service.getServices(req.query)
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  createService: [
    helpers.validateRights('create service'),
    helpers.validateInput(validator.createService),
    function handler (req, res, next) {
      service.createService(req.body)
        .then(result => res.status(201).json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getService: [
    helpers.validateRights('get service'),
    helpers.validateInput(validator.getService),
    function handler (req, res, next) {
      let service_id = req.params.service;
      let options = req.query;
      service.getService(service_id, options)
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  updateService: [
    helpers.validateRights('update service'),
    helpers.validateInput(validator.updateService),
    function handler (req, res, next) {
      let service_id = req.params.service;
      let values = req.body;
      let options = req.query;
      service.updateService(service_id, values, options)
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  deleteService: [
    helpers.validateRights('delete service'),
    helpers.validateInput(validator.deleteService),
    function handler (req, res, next) {
      let service_id = req.params.service;
      let options = req.query;
      service.deleteService(service_id, options)
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getJobs: [
    helpers.validateRights('get jobs from service'),
    helpers.validateInput(validator.getJobs),
    function handler (req, res, next) {
      let service_id = req.params.service;
      let options = req.query;
      service.getJobs(service_id, options)
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getJob: [
    helpers.validateRights('get job from service'),
    helpers.validateInput(validator.getJob),
    function handler (req, res, next) {
      let service_id = req.params.service;
      let job_id = req.params.job;
      let options = req.query;
      service.getJob(service_id, job_id, options)
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ]
});
