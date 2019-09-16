module.exports = ({ service, validator, helpers }) => Object.freeze({
  getQuotes: [
    helpers.validateRights('get quotes'),
    helpers.validateInput(validator.getQuotes),
    function handler (req, res, next) {
      service.getQuotes(req.query)
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  createQuote: [
    helpers.validateRights('create quote'),
    helpers.validateInput(validator.createQuote),
    function handler (req, res, next) {
      service.createQuote(req.body)
        .then(result => res.status(201).json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getQuote: [
    helpers.validateRights('get quote'),
    helpers.validateInput(validator.getQuote),
    function handler (req, res, next) {
      let quote_id = req.params.quote;
      let options = req.query;
      service.getQuote({ quote_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  updateQuote: [
    helpers.validateRights('update quote'),
    helpers.validateInput(validator.updateQuote),
    function handler (req, res, next) {
      let quote_id = req.params.quote;
      let values = req.body;
      let options = req.query;
      service.updateQuote({ quote_id, values, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  deleteQuote: [
    helpers.validateRights('delete quote'),
    helpers.validateInput(validator.deleteQuote),
    function handler (req, res, next) {
      let quote_id = req.params.quote;
      let options = req.query;
      service.deleteQuote({ quote_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getServices: [
    helpers.validateRights('get services from quote'),
    helpers.validateInput(validator.getServices),
    function handler (req, res, next) {
      let quote_id = req.params.quote;
      let options = req.query;
      service.getServices({ quote_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  addServices: [
    helpers.validateRights('add services to quote'),
    helpers.validateInput(validator.addServices),
    function handler (req, res, next) {
      let quote_id = req.params.quote;
      let services = req.body.services;
      service.addServices({ quote_id, services })
        .then(result => res.status(201).json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getService: [
    helpers.validateRights('get service from quote'),
    helpers.validateInput(validator.getService),
    function handler (req, res, next) {
      let quote_id = req.params.quote;
      let service_id = req.params.service;
      let options = req.query;
      service.getService({ quote_id, service_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  updateService: [
    helpers.validateRights('update service from quote'),
    helpers.validateInput(validator.updateService),
    function handler (req, res, next) {
      let quote_id = req.params.quote;
      let service_id = req.params.service;
      let values = req.body;
      let options = req.query;
      service.updateService({ quote_id, service_id, values, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  deleteService: [
    helpers.validateRights('delete service from quote'),
    helpers.validateInput(validator.deleteService),
    function handler (req, res, next) {
      let quote_id = req.params.quote;
      let service_id = req.params.service;
      let options = req.query;
      service.deleteService({ quote_id, service_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getOrders: [
    helpers.validateRights('get orders from quote'),
    helpers.validateInput(validator.getOrders),
    function handler (req, res, next) {
      let quote_id = req.params.quote;
      let options = req.query;
      service.getOrders({ quote_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getOrder: [
    helpers.validateRights('get order from quote'),
    helpers.validateInput(validator.getOrder),
    function handler (req, res, next) {
      let quote_id = req.params.quote;
      let order_id = req.params.order;
      let options = req.query;
      service.getOrder({ quote_id, order_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ]
});
