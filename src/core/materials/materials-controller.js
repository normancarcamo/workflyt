module.exports = ({ service, validator, helpers }) => Object.freeze({
  getMaterials: [
    helpers.validateRights('get materials'),
    helpers.validateInput(validator.getMaterials),
    function handler (req, res, next) {
      service.getMaterials(req.query)
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  createMaterial: [
    helpers.validateRights('create material'),
    helpers.validateInput(validator.createMaterial),
    function handler (req, res, next) {
      service.createMaterial(req.body)
        .then(result => res.status(201).json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getMaterial: [
    helpers.validateRights('get material'),
    helpers.validateInput(validator.getMaterial),
    function handler (req, res, next) {
      let material_id = req.params.material;
      let options = req.query;
      service.getMaterial({ material_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  updateMaterial: [
    helpers.validateRights('update material'),
    helpers.validateInput(validator.updateMaterial),
    function handler (req, res, next) {
      let material_id = req.params.material;
      let values = req.body;
      let options = req.query;
      service.updateMaterial({ material_id, values, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  deleteMaterial: [
    helpers.validateRights('delete material'),
    helpers.validateInput(validator.deleteMaterial),
    function handler (req, res, next) {
      let material_id = req.params.material;
      let options = req.query;
      service.deleteMaterial({ material_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getStocks: [
    helpers.validateRights('get stocks from material'),
    helpers.validateInput(validator.getStocks),
    function handler (req, res, next) {
      let material_id = req.params.material;
      let options = req.query;
      service.getStocks({ material_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getStock: [
    helpers.validateRights('get stock from material'),
    helpers.validateInput(validator.getStock),
    function handler (req, res, next) {
      let material_id = req.params.material;
      let stock_id = req.params.stock;
      let options = req.query;
      service.getStock({ material_id, stock_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ]
});
