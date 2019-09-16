module.exports = ({ repository }) => ({
  async getRoles (options) {
    return await repository.getRoles(options);
  },

  async createRole (values) {
    return await repository.createRole(values);
  },

  async getRole ({ role_id, options }) {
    return await repository.getRole({ role_id, options }, true);
  },

  async updateRole ({ role_id, values, options }) {
    return await repository.updateRole({ role_id, values, options });
  },

  async deleteRole ({ role_id, options }) {
    return await repository.deleteRole({ role_id, options });
  },

  async getPermissions ({ role_id, options }) {
    return await repository.getPermissions({ role_id, options });
  },

  async addPermissions ({ role_id, permissions }) {
    return await repository.addPermissions({ role_id, permissions });
  },

  async getPermission ({ role_id, permission_id, options }) {
    return await repository.getPermission({ role_id, permission_id, options }, true);
  },

  async updatePermission ({ role_id, permission_id, values, options }) {
    return await repository.updatePermission({ role_id, permission_id, values, options });
  },

  async deletePermission ({ role_id, permission_id, options }) {
    return await repository.deletePermission({ role_id, permission_id, options });
  }
});
