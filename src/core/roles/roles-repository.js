module.exports = database => Object.freeze({
  findAll (options) {
    return database.models.Role.findAll(
      database.queryBuilder(options)
    );
  },

  create (data) {
    return database.models.Role.create(data);
  },

  findByPk ({ role_id, options }) {
    return database.models.Role.findByPk(
      role_id,
      database.queryBuilder(options)
    );
  },

  update ({ role_id, data, options }) {
    return database.models.Role.update(data, {
      where: { id: role_id },
      returning: true,
      plain: true,
      ...options
    }).then(result => result.pop());
  },

  destroy ({ role_id, options }) {
    return database.models.Role.destroy({
      where: { id: role_id },
      returning: true,
      plain: true,
      ...options
    });
  },

  getPermissions ({ role, options }) {
    return role.getPermissions(database.queryBuilder(options));
  },

  addPermissions ({ role_id, permissions }) {
    return database.models.RolePermission.bulkCreate(
      permissions.map(permission_id => ({
        role_id,
        permission_id
      }))
    );
  },

  getPermission ({ role, permission_id, options }) {
    return role.getPermissions({
      plain: true,
      ...database.queryBuilder({
        id: permission_id,
        ...options
      })
    });
  },

  updatePermission ({ role_id, permission_id, data, options }) {
    return database.models.RolePermission.update(data, {
      where: { role_id, permission_id },
      returning: true,
      plain: true,
      ...options
    }).then(result => result.pop());
  },

  removePermission ({ role_id, permission_id, options }) {
    return database.models.RolePermission.destroy({
      where: { role_id, permission_id },
      returning: true,
      plain: true,
      ...options
    });
  }
});
