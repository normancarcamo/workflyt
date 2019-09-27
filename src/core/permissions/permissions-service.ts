import { F } from './permissions-types';

export const PermissionService:F.service = (repository) => ({
  async getPermissions (options) {
    return await repository.getPermissions(options);
  },

  async createPermission (values) {
    return await repository.createPermission(values);
  },

  async getPermission (permission_id, options) {
    return await repository.getPermission(permission_id, options, true);
  },

  async updatePermission (permission_id, values, options) {
    return await repository.updatePermission(permission_id, values, options);
  },

  async deletePermission (permission_id, options) {
    return await repository.deletePermission(permission_id, options);
  }
});
