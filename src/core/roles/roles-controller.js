module.exports = ({ service, validator, helpers }) => Object.freeze({
  getRoles: [
    helpers.validateRights('get roles'),
    helpers.validateInput(validator.getRoles),
    function handler (req, res, next) {
      service.getRoles(req.query)
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  createRole: [
    helpers.validateRights('create role'),
    helpers.validateInput(validator.createRole),
    function handler (req, res, next) {
      service.createRole(req.body)
        .then(result => res.status(201).json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getRole: [
    helpers.validateRights('get role'),
    helpers.validateInput(validator.getRole),
    function handler (req, res, next) {
      let role_id = req.params.role;
      let options = req.query;
      service.getRole({ role_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  updateRole: [
    helpers.validateRights('update role'),
    helpers.validateInput(validator.updateRole),
    function handler (req, res, next) {
      let role_id = req.params.role;
      let values = req.body;
      let options = req.query;
      service.updateRole({ role_id, values, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  deleteRole: [
    helpers.validateRights('delete role'),
    helpers.validateInput(validator.deleteRole),
    function handler (req, res, next) {
      let role_id = req.params.role;
      let options = req.query;
      service.deleteRole({ role_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getPermissions: [
    helpers.validateRights('get permissions from role'),
    helpers.validateInput(validator.getPermissions),
    function handler (req, res, next) {
      let role_id = req.params.role;
      let options = req.query;
      service.getPermissions({ role_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  addPermissions: [
    helpers.validateRights('add permissions to role'),
    helpers.validateInput(validator.addPermissions),
    function handler (req, res, next) {
      let role_id = req.params.role;
      let permissions = req.body.permissions;
      service.addPermissions({ role_id, permissions })
        .then(result => res.status(201).json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getPermission: [
    helpers.validateRights('get permission from role'),
    helpers.validateInput(validator.getPermission),
    function handler (req, res, next) {
      let role_id = req.params.role;
      let permission_id = req.params.permission;
      let options = req.query;
      service.getPermission({ role_id, permission_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  updatePermission: [
    helpers.validateRights('update permission from role'),
    helpers.validateInput(validator.updatePermission),
    function handler (req, res, next) {
      let role_id = req.params.role;
      let permission_id = req.params.permission;
      let values = req.body;
      let options = req.query;
      service.updatePermission({ role_id, permission_id, values, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  deletePermission: [
    helpers.validateRights('delete permission from role'),
    helpers.validateInput(validator.deletePermission),
    function handler (req, res, next) {
      let role_id = req.params.role;
      let permission_id = req.params.permission;
      let options = req.query;
      service.deletePermission({ role_id, permission_id, options })
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ]
});
