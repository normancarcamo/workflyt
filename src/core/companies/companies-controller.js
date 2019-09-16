module.exports = ({ service, validator, helpers }) => Object.freeze({
  getCompanies: [
    helpers.validateRights('get companies'),
    helpers.validateInput(validator.getCompanies),
    function handler (req, res, next) {
      service.getCompanies(req.query)
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  createCompany: [
    helpers.validateRights('create company'),
    helpers.validateInput(validator.createCompany),
    function handler (req, res, next) {
      service.createCompany(req.body)
        .then(result => res.status(201).json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getCompany: [
    helpers.validateRights('get company'),
    helpers.validateInput(validator.getCompany),
    function handler (req, res, next) {
      let company_id = req.params.company;
      let options = req.query;
      service.getCompany({ company_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  updateCompany: [
    helpers.validateRights('update company'),
    helpers.validateInput(validator.updateCompany),
    function handler (req, res, next) {
      let company_id = req.params.company;
      let values = req.body;
      let options = req.query;
      service.updateCompany({ company_id, values, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  deleteCompany: [
    helpers.validateRights('delete company'),
    helpers.validateInput(validator.deleteCompany),
    function handler (req, res, next) {
      let company_id = req.params.company;
      let options = req.query;
      service.deleteCompany({ company_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ]
});
