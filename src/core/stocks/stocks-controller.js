module.exports = ({ service, validator, helpers }) => Object.freeze({
  getStocks: [
    helpers.validateRights('get stocks'),
    helpers.validateInput(validator.getStocks),
    function handler (req, res, next) {
      service.getStocks(req.query)
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  createStock: [
    helpers.validateRights('create stock'),
    helpers.validateInput(validator.createStock),
    function handler (req, res, next) {
      service.createStock(req.body)
        .then(result => res.status(201).json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getStock: [
    helpers.validateRights('get stock'),
    helpers.validateInput(validator.getStock),
    function handler (req, res, next) {
      let stock_id = req.params.stock;
      let options = req.query;
      service.getStock({ stock_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  updateStock: [
    helpers.validateRights('update stock'),
    helpers.validateInput(validator.updateStock),
    function handler (req, res, next) {
      let stock_id = req.params.stock;
      let values = req.body;
      let options = req.query;
      service.updateStock({ stock_id, values, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  deleteStock: [
    helpers.validateRights('delete stock'),
    helpers.validateInput(validator.deleteStock),
    function handler (req, res, next) {
      let stock_id = req.params.stock;
      let options = req.query;
      service.deleteStock({ stock_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ]
});
