module.exports = ({ service, validator, helpers }) => Object.freeze({
  getWarehouses: [
    helpers.validateRights('get warehouses'),
    helpers.validateInput(validator.getWarehouses),
    function handler (req, res, next) {
      service.getWarehouses(req.query)
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  createWarehouse: [
    helpers.validateRights('create warehouse'),
    helpers.validateInput(validator.createWarehouse),
    function handler (req, res, next) {
      service.createWarehouse(req.body)
        .then(result => res.status(201).json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getWarehouse: [
    helpers.validateRights('get warehouse'),
    helpers.validateInput(validator.getWarehouse),
    function handler (req, res, next) {
      let warehouse_id = req.params.warehouse;
      let options = req.query;
      service.getWarehouse({ warehouse_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  updateWarehouse: [
    helpers.validateRights('update warehouse'),
    helpers.validateInput(validator.updateWarehouse),
    function handler (req, res, next) {
      let warehouse_id = req.params.warehouse;
      let values = req.body;
      let options = req.query;
      service.updateWarehouse({ warehouse_id, values, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  deleteWarehouse: [
    helpers.validateRights('delete warehouse'),
    helpers.validateInput(validator.deleteWarehouse),
    function handler (req, res, next) {
      let warehouse_id = req.params.warehouse;
      let options = req.query;
      service.deleteWarehouse({ warehouse_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getMaterials: [
    helpers.validateRights('get materials from warehouse'),
    helpers.validateInput(validator.getMaterials),
    function handler (req, res, next) {
      let warehouse_id = req.params.warehouse;
      let options = req.query;
      service.getMaterials({ warehouse_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  addMaterials: [
    helpers.validateRights('add materials to warehouse'),
    helpers.validateInput(validator.addMaterials),
    function handler (req, res, next) {
      let warehouse_id = req.params.warehouse;
      let materials = req.body.materials;
      service.addMaterials({ warehouse_id, materials })
        .then(result => res.status(201).json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getMaterial: [
    helpers.validateRights('get material from warehouse'),
    helpers.validateInput(validator.getMaterial),
    function handler (req, res, next) {
      let warehouse_id = req.params.warehouse;
      let material_id = req.params.material;
      let options = req.query;
      service.getMaterial({ warehouse_id, material_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  updateMaterial: [
    helpers.validateRights('update material from warehouse'),
    helpers.validateInput(validator.updateMaterial),
    function handler (req, res, next) {
      let warehouse_id = req.params.warehouse;
      let material_id = req.params.material;
      let values = req.body;
      let options = req.query;
      service.updateMaterial({ warehouse_id, material_id, values, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  deleteMaterial: [
    helpers.validateRights('delete material from warehouse'),
    helpers.validateInput(validator.deleteMaterial),
    function handler (req, res, next) {
      let warehouse_id = req.params.warehouse;
      let material_id = req.params.material;
      let options = req.query;
      service.deleteMaterial({ warehouse_id, material_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ]
});
