module.exports = ({ service, validator, helpers }) => Object.freeze({
  getAreas: [
    helpers.validateRights('get areas'),
    helpers.validateInput(validator.getAreas),
    function handler (req, res, next) {
      service.getAreas(req.query)
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  createArea: [
    helpers.validateRights('create area'),
    helpers.validateInput(validator.createArea),
    function handler (req, res, next) {
      service.createArea(req.body)
        .then(result => res.status(201).json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getArea: [
    helpers.validateRights('get area'),
    helpers.validateInput(validator.getArea),
    function handler (req, res, next) {
      let area_id = req.params.area;
      let options = req.query;
      service.getArea({ area_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  updateArea: [
    helpers.validateRights('update area'),
    helpers.validateInput(validator.updateArea),
    function handler (req, res, next) {
      let area_id = req.params.area;
      let values = req.body;
      let options = req.query;
      service.updateArea({ area_id, values, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  deleteArea: [
    helpers.validateRights('delete area'),
    helpers.validateInput(validator.deleteArea),
    function handler (req, res, next) {
      let area_id = req.params.area;
      let options = req.query;
      service.deleteArea({ area_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getSubareas: [
    helpers.validateRights('get subareas from area'),
    helpers.validateInput(validator.getSubareas),
    function handler (req, res, next) {
      let area_id = req.params.area;
      let options = req.query;
      service.getSubareas({ area_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  addSubareas: [
    helpers.validateRights('add subareas to area'),
    helpers.validateInput(validator.addSubareas),
    function handler (req, res, next) {
      let area_id = req.params.area;
      let subareas = req.body.subareas;
      service.addSubareas({ area_id, subareas })
        .then(result => res.status(201).json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getSubarea: [
    helpers.validateRights('get subarea from area'),
    helpers.validateInput(validator.getSubarea),
    function handler (req, res, next) {
      let area_id = req.params.area;
      let subarea_id = req.params.subarea;
      let options = req.query;
      service.getSubarea({ area_id, subarea_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  updateSubarea: [
    helpers.validateRights('update subarea from area'),
    helpers.validateInput(validator.updateSubarea),
    function handler (req, res, next) {
      let area_id = req.params.area;
      let subarea_id = req.params.subarea;
      let values = req.body;
      let options = req.query;
      service.updateSubarea({ area_id, subarea_id, values, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  deleteSubarea: [
    helpers.validateRights('delete subarea from area'),
    helpers.validateInput(validator.deleteSubarea),
    function handler (req, res, next) {
      let area_id = req.params.area;
      let subarea_id = req.params.subarea;
      let options = req.query;
      service.deleteSubarea({ area_id, subarea_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getWorkers: [
    helpers.validateRights('get workers from area'),
    helpers.validateInput(validator.getWorkers),
    function handler (req, res, next) {
      let area_id = req.params.area;
      let options = req.query;
      service.getWorkers({ area_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  addWorkers: [
    helpers.validateRights('add workers to area'),
    helpers.validateInput(validator.addWorkers),
    function handler (req, res, next) {
      let area_id = req.params.area;
      let workers = req.body.workers;
      service.addWorkers({ area_id, workers })
        .then(result => res.status(201).json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getWorker: [
    helpers.validateRights('get worker from area'),
    helpers.validateInput(validator.getWorker),
    function handler (req, res, next) {
      let area_id = req.params.area;
      let worker_id = req.params.worker;
      let options = req.query;
      service.getWorker({ area_id, worker_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  updateWorker: [
    helpers.validateRights('update worker from area'),
    helpers.validateInput(validator.updateWorker),
    function handler (req, res, next) {
      let area_id = req.params.area;
      let worker_id = req.params.worker;
      let values = req.body;
      let options = req.query;
      service.updateWorker({ area_id, worker_id, values, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  deleteWorker: [
    helpers.validateRights('delete worker from area'),
    helpers.validateInput(validator.deleteWorker),
    function handler (req, res, next) {
      let area_id = req.params.area;
      let worker_id = req.params.worker;
      let options = req.query;
      service.deleteWorker({ area_id, worker_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getServices: [
    helpers.validateRights('get services from area'),
    helpers.validateInput(validator.getServices),
    function handler (req, res, next) {
      let area_id = req.params.area;
      let options = req.query;
      service.getServices({ area_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getService: [
    helpers.validateRights('get service from area'),
    helpers.validateInput(validator.getService),
    function handler (req, res, next) {
      let area_id = req.params.area;
      let service_id = req.params.service;
      let options = req.query;
      service.getService({ area_id, service_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ]
});
