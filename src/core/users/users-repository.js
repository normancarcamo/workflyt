module.exports = ({ database }) => ({
  async getUsers (options) {
    return await database.models.User.findAll(options);
  },

  async createUser ({ values, options }) {
    return await database.models.User.create(values, options);
  },

  async getUser ({ user_id, options, throwNotFound }) {
    let user = await database.models.User.findByPk(
      user_id,
      database.queryBuilder(options)
    );

    if (throwNotFound && !user) {
      throw new Error('Not found');
    } else {
      return user;
    }
  },

  async getUserByUsername ({ username, options, throwNotFound }) {
    let user = await database.models.User.findOne({
      where: { username },
      plain: true,
      raw: true,
      options
    });

    if (throwNotFound && !user) {
      throw new Error('Not found');
    }

    return user;
  },

  async getUserByUsernameWithRoles ({ username, options, throwNotFound }) {
    let user = await database.sequelize.query(`
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
      type: database.Sequelize.QueryTypes.SELECT,
      ...options
    });

    if (throwNotFound && !user) {
      throw new Error('Not found');
    }

    return user;
  },

  async updateUser ({ user_id, values, options }) {
    let user = await this.getUser({ user_id, throwNotFound: true });
    return await user.update(values, options);
  },

  async deleteUser ({ user_id, options }) {
    let user = await this.getUser({ user_id, throwNotFound: true });
    return await user.destroy(options);
  },

  async getRoles ({ user_id, options }) {
    let user = await this.getUser({ user_id, throwNotFound: true });
    return await user.getRoles(database.queryBuilder(options));
  },

  async addRoles ({ user_id, roles }) {
    let user = await this.getUser({ user_id, throwNotFound: true });
    return await user.addRoles(roles);
  },

  async getRole ({ user_id, role_id, options, throwNotFound }) {
    let user = await this.getUser({ user_id, throwNotFound: true });

    let role = await user.getRoles({
      plain: true,
      ...database.queryBuilder({
        id: role_id,
        ...options
      })
    });

    if (throwNotFound && !role) {
      throw new Error('Not found');
    } else {
      return role;
    }
  },

  async updateRole ({ user_id, role_id, values, options }) {
    let role = await this.getRole({ user_id, role_id, throwNotFound: true });
    return await role.UserRole.update(values, options);
  },

  async deleteRole ({ user_id, role_id, options }) {
    let role = await this.getRole({ user_id, role_id, throwNotFound: true });
    return await role.UserRole.destroy(options);
  }
});
