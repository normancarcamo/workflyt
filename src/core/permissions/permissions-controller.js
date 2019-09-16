module.exports = ({ service, validator, helpers }) => Object.freeze({
  getPermissions: [
    helpers.validateRights('get permissions'),
    helpers.validateInput(validator.getPermissions),
    function handler (req, res, next) {
      service.getPermissions(req.query)
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  createPermission: [
    helpers.validateRights('create permission'),
    helpers.validateInput(validator.createPermission),
    function handler (req, res, next) {
      service.createPermission(req.body)
        .then(result => res.status(201).json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getPermission: [
    helpers.validateRights('get permission'),
    helpers.validateInput(validator.getPermission),
    function handler (req, res, next) {
      let permission_id = req.params.permission;
      let options = req.query;
      service.getPermission({ permission_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  updatePermission: [
    helpers.validateRights('update permission'),
    helpers.validateInput(validator.updatePermission),
    function handler (req, res, next) {
      let permission_id = req.params.permission;
      let values = req.body;
      let options = req.query;
      service.updatePermission({ permission_id, values, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  deletePermission: [
    helpers.validateRights('delete permission'),
    helpers.validateInput(validator.deletePermission),
    function handler (req, res, next) {
      let permission_id = req.params.permission;
      let options = req.query;
      service.deletePermission({ permission_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ]
});
