import { F } from './roles-types';

export const RoleRepository:F.repository = (database) => ({
  async getRoles (options) {
    return await database.models.Role.findAll(options);
  },

  async createRole (values) {
    return await database.models.Role.create(values);
  },

  async getRole (role_id, options, throwNotFound) {
    let role = await database.models.Role.findByPk(
      role_id,
      database.queryBuilder(options)
    );

    if (throwNotFound && !role) {
      throw new Error('Not found');
    } else {
      return role;
    }
  },

  async updateRole (role_id, values, options) {
    let role = await this.getRole(role_id, null, true);
    return await role.update(values, options);
  },

  async deleteRole (role_id, options) {
    let role = await this.getRole(role_id, null, true);
    return await role.destroy(options);
  },

  async getPermissions (role_id, options) {
    let role = await this.getRole(role_id, null, true);
    return await role.getPermissions(database.queryBuilder(options));
  },

  async addPermissions (role_id, permissions) {
    let role = await this.getRole(role_id, null, true);
    return await role.addPermissions(permissions);
  },

  async getPermission (role_id, permission_id, options, throwNotFound) {
    let role = await this.getRole(role_id, null, true);

    let permission = await role.getPermissions({
      plain: true,
      ...database.queryBuilder({
        id: permission_id,
        ...options
      })
    });

    if (throwNotFound && !permission) {
      throw new Error('Not found');
    } else {
      return permission;
    }
  },

  async updatePermission (role_id, permission_id, values, options) {
    let permission = await this.getPermission(role_id, permission_id, null, true);
    return await permission.RolePermission.update(values, options);
  },

  async deletePermission (role_id, permission_id, options) {
    let permission = await this.getPermission(role_id, permission_id, null, true);
    return await permission.RolePermission.destroy(options);
  }
});
