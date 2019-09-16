module.exports = ({ service, validator, helpers }) => Object.freeze({
  getJobs: [
    helpers.validateRights('get jobs'),
    helpers.validateInput(validator.getJobs),
    function handler (req, res, next) {
      service.getJobs(req.query)
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  createJob: [
    helpers.validateRights('create job'),
    helpers.validateInput(validator.createJob),
    function handler (req, res, next) {
      service.createJob(req.body)
        .then(result => res.status(201).json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getJob: [
    helpers.validateRights('get job'),
    helpers.validateInput(validator.getJob),
    function handler (req, res, next) {
      let job_id = req.params.job;
      let options = req.query;
      service.getJob({ job_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  updateJob: [
    helpers.validateRights('update job'),
    helpers.validateInput(validator.updateJob),
    function handler (req, res, next) {
      let job_id = req.params.job;
      let values = req.body;
      let options = req.query;
      service.updateJob({ job_id, values, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  deleteJob: [
    helpers.validateRights('delete job'),
    helpers.validateInput(validator.deleteJob),
    function handler (req, res, next) {
      let job_id = req.params.job;
      let options = req.query;
      service.deleteJob({ job_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getSubjobs: [
    helpers.validateRights('get subjobs from job'),
    helpers.validateInput(validator.getSubjobs),
    function handler (req, res, next) {
      let job_id = req.params.job;
      let options = req.query;
      service.getSubjobs({ job_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  addSubjobs: [
    helpers.validateRights('add subjobs to job'),
    helpers.validateInput(validator.addSubjobs),
    function handler (req, res, next) {
      let job_id = req.params.job;
      let subjobs = req.body.subjobs;
      service.addSubjobs({ job_id, subjobs })
        .then(result => res.status(201).json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getSubjob: [
    helpers.validateRights('get subjob from job'),
    helpers.validateInput(validator.getSubjob),
    function handler (req, res, next) {
      let job_id = req.params.job;
      let subjob_id = req.params.subjob;
      let options = req.query;
      service.getSubjob({ job_id, subjob_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  updateSubjob: [
    helpers.validateRights('update subjob from job'),
    helpers.validateInput(validator.updateSubjob),
    function handler (req, res, next) {
      let job_id = req.params.job;
      let subjob_id = req.params.subjob;
      let values = req.body;
      let options = req.query;
      service.updateSubjob({ job_id, subjob_id, values, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  deleteSubjob: [
    helpers.validateRights('delete subjob from job'),
    helpers.validateInput(validator.deleteSubjob),
    function handler (req, res, next) {
      let job_id = req.params.job;
      let subjob_id = req.params.subjob;
      let options = req.query;
      service.deleteSubjob({ job_id, subjob_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getWorkers: [
    helpers.validateRights('get workers from job'),
    helpers.validateInput(validator.getWorkers),
    function handler (req, res, next) {
      let job_id = req.params.job;
      let options = req.query;
      service.getWorkers({ job_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  addWorkers: [
    helpers.validateRights('add workers to job'),
    helpers.validateInput(validator.addWorkers),
    function handler (req, res, next) {
      let job_id = req.params.job;
      let workers = req.body.workers;
      service.addWorkers({ job_id, workers })
        .then(result => res.status(201).json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getWorker: [
    helpers.validateRights('get worker from job'),
    helpers.validateInput(validator.getWorker),
    function handler (req, res, next) {
      let job_id = req.params.job;
      let worker_id = req.params.worker;
      let options = req.query;
      service.getWorker({ job_id, worker_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  updateWorker: [
    helpers.validateRights('update worker from job'),
    helpers.validateInput(validator.updateWorker),
    function handler (req, res, next) {
      let job_id = req.params.job;
      let worker_id = req.params.worker;
      let values = req.body;
      let options = req.query;
      service.updateWorker({ job_id, worker_id, values, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  deleteWorker: [
    helpers.validateRights('delete worker from job'),
    helpers.validateInput(validator.deleteWorker),
    function handler (req, res, next) {
      let job_id = req.params.job;
      let worker_id = req.params.worker;
      let options = req.query;
      service.deleteWorker({ job_id, worker_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getMaterials: [
    helpers.validateRights('get materials from job'),
    helpers.validateInput(validator.getMaterials),
    function handler (req, res, next) {
      let job_id = req.params.job;
      let options = req.query;
      service.getMaterials({ job_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  addMaterials: [
    helpers.validateRights('add materials to job'),
    helpers.validateInput(validator.addMaterials),
    function handler (req, res, next) {
      let job_id = req.params.job;
      let materials = req.body.materials;
      service.addMaterials({ job_id, materials })
        .then(result => res.status(201).json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getMaterial: [
    helpers.validateRights('get material from job'),
    helpers.validateInput(validator.getMaterial),
    function handler (req, res, next) {
      let job_id = req.params.job;
      let material_id = req.params.material;
      let options = req.query;
      service.getMaterial({ job_id, material_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  updateMaterial: [
    helpers.validateRights('update material from job'),
    helpers.validateInput(validator.updateMaterial),
    function handler (req, res, next) {
      let job_id = req.params.job;
      let material_id = req.params.material;
      let values = req.body;
      let options = req.query;
      service.updateMaterial({ job_id, material_id, values, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  deleteMaterial: [
    helpers.validateRights('delete material from job'),
    helpers.validateInput(validator.deleteMaterial),
    function handler (req, res, next) {
      let job_id = req.params.job;
      let material_id = req.params.material;
      let options = req.query;
      service.deleteMaterial({ job_id, material_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ]
});
