module.exports = database => Object.freeze({
  findUserWithRoles: ({ username }) => {
    return database.sequelize.query(`
      SELECT
        u.*,
        array_remove(array_agg(DISTINCT r.name), null) roles,
        array_remove(array_agg(DISTINCT p.name), null) permissions
      FROM users AS u
      JOIN user_role AS ur ON (ur.user_id = u.id AND ur.deleted_at IS NULL)
      JOIN role AS r ON (r.id = ur.role_id AND r.deleted_at IS NULL)
      JOIN role_permission AS rp ON (rp.role_id = r.id AND rp.deleted_at IS NULL)
      JOIN permission AS p ON (p.id = rp.permission_id AND p.deleted_at IS NULL)
      WHERE u.deleted_at IS NULL AND u.username = ?
      GROUP BY u.id;
    `, {
      model: database.models.User,
      mapToModel: true,
      plain: true,
      raw: true,
      replacements: [ username ],
      type: database.Sequelize.QueryTypes.SELECT
    });
  },

  findUserByUsername: ({ username }) => {
    return database.models.User.findOne({
      where: { username },
      plain: true,
      raw: true
    });
  },

  createUser: ({ username, password }) => {
    return database.models.User.create({
      username,
      password
    }).then(user => user.dataValues);
  }
});
