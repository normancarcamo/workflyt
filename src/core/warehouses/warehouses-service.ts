import { F } from './warehouses-types';

export const WarehouseService:F.service = (repository) => ({
  async getWarehouses (options) {
    return await repository.getWarehouses(options);
  },

  async createWarehouse (values) {
    return await repository.createWarehouse(values);
  },

  async getWarehouse (warehouse_id, options) {
    return await repository.getWarehouse(warehouse_id, options, true);
  },

  async updateWarehouse (warehouse_id, values, options) {
    return await repository.updateWarehouse(warehouse_id, values, options);
  },

  async deleteWarehouse (warehouse_id, options) {
    return await repository.deleteWarehouse(warehouse_id, options);
  },

  async getMaterials (warehouse_id, options) {
    return await repository.getMaterials(warehouse_id, options);
  },

  async addMaterials (warehouse_id, materials) {
    return await repository.addMaterials(warehouse_id, materials);
  },

  async getMaterial (warehouse_id, material_id, options) {
    return await repository.getMaterial(warehouse_id, material_id, options, true);
  },

  async updateMaterial (warehouse_id, material_id, values, options) {
    return await repository.updateMaterial(warehouse_id, material_id, values, options);
  },

  async deleteMaterial (warehouse_id, material_id, options) {
    return await repository.deleteMaterial(warehouse_id, material_id, options);
  }
});
