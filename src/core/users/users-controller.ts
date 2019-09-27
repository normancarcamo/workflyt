import { F } from './users-types';

export const UserController:F.controller = (service, validator, helpers) => ({
  getUsers: [
    helpers.validateRights('get users'),
    helpers.validateInput(validator.getUsers),
    function handler (req, res, next) {
      service.getUsers(req.query)
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  createUser: [
    helpers.validateRights('create user'),
    helpers.validateInput(validator.createUser),
    function handler (req, res, next) {
      let values = req.body;
      let options = {};
      service.createUser(values, options)
        .then(result => res.status(201).json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getUser: [
    helpers.validateRights('get user'),
    helpers.validateInput(validator.getUser),
    function handler (req, res, next) {
      let user_id = req.params.user;
      let options = req.query;
      service.getUser(user_id, options)
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  updateUser: [
    helpers.validateRights('update user'),
    helpers.validateInput(validator.updateUser),
    function handler (req, res, next) {
      let user_id = req.params.user;
      let values = req.body;
      let options = req.query;
      service.updateUser(user_id, values, options)
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  deleteUser: [
    helpers.validateRights('delete user'),
    helpers.validateInput(validator.deleteUser),
    function handler (req, res, next) {
      let user_id = req.params.user;
      let options = req.query;
      service.deleteUser(user_id, options)
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getRoles: [
    helpers.validateRights('get roles from user'),
    helpers.validateInput(validator.getRoles),
    function handler (req, res, next) {
      let user_id = req.params.user;
      let options = req.query;
      service.getRoles(user_id, options)
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  addRoles: [
    helpers.validateRights('add roles to user'),
    helpers.validateInput(validator.addRoles),
    function handler (req, res, next) {
      let user_id = req.params.user;
      let roles = req.body.roles;
      service.addRoles(user_id, roles)
        .then(result => res.status(201).json({ success: true, data: result }))
        .catch(next);
    }
  ],

  getRole: [
    helpers.validateRights('get role from user'),
    helpers.validateInput(validator.getRole),
    function handler (req, res, next) {
      let user_id = req.params.user;
      let role_id = req.params.role;
      let options = req.query;
      service.getRole(user_id, role_id, options)
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  updateRole: [
    helpers.validateRights('update role from user'),
    helpers.validateInput(validator.updateRole),
    function handler (req, res, next) {
      let user_id = req.params.user;
      let role_id = req.params.role;
      let values = req.body;
      let options = req.query;
      service.updateRole(user_id, role_id, values, options)
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ],

  deleteRole: [
    helpers.validateRights('delete role from user'),
    helpers.validateInput(validator.deleteRole),
    function handler (req, res, next) {
      let user_id = req.params.user;
      let role_id = req.params.role;
      let options = req.query;
      service.deleteRole(user_id, role_id, options)
        .then(result => res.json({ success: true, data: result }))
        .catch(next);
    }
  ]
});
