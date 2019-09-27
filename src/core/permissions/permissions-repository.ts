import { F } from './permissions-types';

export const PermissionRepository:F.repository = (database) => ({
  async getPermissions (options) {
    return await database.models.Permission.findAll(options);
  },

  async createPermission (values) {
    return await database.models.Permission.create(values);
  },

  async getPermission (permission_id, options, throwNotFound) {
    let permission = await database.models.Permission.findByPk(
      permission_id,
      database.queryBuilder(options)
    );

    if (throwNotFound && !permission) {
      throw new Error('Not found');
    } else {
      return permission;
    }
  },

  async updatePermission (permission_id, values, options) {
    let permission = await this.getPermission(permission_id, null, true);
    return await permission.update(values, options);
  },

  async deletePermission (permission_id, options) {
    let permission = await this.getPermission(permission_id, null, true);
    return await permission.destroy(options);
  }
});
