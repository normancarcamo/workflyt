module.exports = ({ repository, helpers }) => ({
  async getUsers (options) {
    return await repository.getUsers(options);
  },

  async createUser ({ values, options }) {
    let userFound = await repository.getUserByUsername({
      username: values.username
    });

    if (userFound) {
      throw new Error('Forbidden');
    }

    let userCreated = await repository.createUser({
      values: {
        username: values.username,
        password: await helpers.hashPassword({
          password: values.password
        })
      },
      options
    });

    userCreated.password = undefined;

    return userCreated;
  },

  async getUser ({ user_id, options }) {
    return await repository.getUser({ user_id, options, throwNotFound: true });
  },

  async updateUser ({ user_id, values, options }) {
    return await repository.updateUser({ user_id, values, options });
  },

  async deleteUser ({ user_id, options }) {
    return await repository.deleteUser({ user_id, options });
  },

  async getRoles ({ user_id, options }) {
    return await repository.getRoles({ user_id, options });
  },

  async addRoles ({ user_id, roles }) {
    return await repository.addRoles({ user_id, roles });
  },

  async getRole ({ user_id, role_id, options }) {
    return await repository.getRole({ user_id, role_id, options, throwNotFound: true });
  },

  async updateRole ({ user_id, role_id, values, options }) {
    return await repository.updateRole({ user_id, role_id, values, options });
  },

  async deleteRole ({ user_id, role_id, options }) {
    return await repository.deleteRole({ user_id, role_id, options });
  }
});
