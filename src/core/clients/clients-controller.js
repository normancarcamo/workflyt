module.exports = ({ service, validator, helpers }) => Object.freeze({
  getClients: [
    helpers.validateRights('get clients'),
    helpers.validateInput(validator.getClients),
    function handler (req, res, next) {
      service.getClients(req.query)
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  createClient: [
    helpers.validateRights('create client'),
    helpers.validateInput(validator.createClient),
    function handler (req, res, next) {
      service.createClient(req.body)
        .then(result => res.status(201).json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getClient: [
    helpers.validateRights('get client'),
    helpers.validateInput(validator.getClient),
    function handler (req, res, next) {
      let client_id = req.params.client;
      let options = req.query;
      service.getClient({ client_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  updateClient: [
    helpers.validateRights('update client'),
    helpers.validateInput(validator.updateClient),
    function handler (req, res, next) {
      let client_id = req.params.client;
      let values = req.body;
      let options = req.query;
      service.updateClient({ client_id, values, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  deleteClient: [
    helpers.validateRights('delete client'),
    helpers.validateInput(validator.deleteClient),
    function handler (req, res, next) {
      let client_id = req.params.client;
      let options = req.query;
      service.deleteClient({ client_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getQuotes: [
    helpers.validateRights('get quotes from client'),
    helpers.validateInput(validator.getQuotes),
    function handler (req, res, next) {
      let client_id = req.params.client;
      let options = req.query;
      service.getQuotes({ client_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getQuote: [
    helpers.validateRights('get quote from client'),
    helpers.validateInput(validator.getQuote),
    function handler (req, res, next) {
      let client_id = req.params.client;
      let quote_id = req.params.quote;
      let options = req.query;
      service.getQuote({ client_id, quote_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ]
});
