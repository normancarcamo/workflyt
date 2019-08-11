module.exports = database => Object.freeze({
  findAll (options) {
    return database.models.User.findAll(database.queryBuilder(options));
  },

  create (data) {
    return database.models.User
      .create(data)
      .then(user => user.dataValues);
  },

  findByUsername ({ username, options }) {
    return database.models.User.findOne(
      database.queryBuilder({ username, ...options })
    );
  },

  findByPk ({ user_id, options }) {
    return database.models.User.findByPk(
      user_id, database.queryBuilder(options)
    );
  },

  update ({ user_id, data, options }) {
    return database.models.User.update(data, {
      where: { id: user_id },
      returning: true,
      plain: true,
      ...options
    }).then(result => result.pop());
  },

  destroy ({ user_id, options }) {
    return database.models.User.destroy({
      where: { id: user_id },
      returning: true,
      plain: true,
      ...options
    });
  },

  getRoles ({ user, options }) {
    return user.getRoles(database.queryBuilder(options));
  },

  addRoles ({ user_id, roles }) {
    return database.models.UserRole.bulkCreate(
      roles.map(role_id => ({
        user_id,
        role_id
      }))
    );
  },

  getRole ({ user, role_id, options }) {
    return user.getRoles(
      database.queryBuilder({
        plain: true,
        id: role_id,
        ...options
      })
    );
  },

  updateRole ({ user_id, role_id, data, options }) {
    return database.models.UserRole.update(data, {
      where: { user_id, role_id },
      returning: true,
      plain: true,
      ...options
    }).then(result => result.pop());
  },

  removeRole ({ user_id, role_id, options }) {
    return database.models.UserRole.destroy({
      where: { user_id, role_id },
      returning: true,
      plain: true,
      ...options
    });
  }
});
