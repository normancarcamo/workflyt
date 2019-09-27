import { F } from './materials-types';

export const MaterialService:F.service = (repository) => ({
  async getMaterials (options) {
    return await repository.getMaterials(options);
  },

  async createMaterial (values) {
    return await repository.createMaterial(values);
  },

  async getMaterial (material_id, options) {
    return await repository.getMaterial(material_id, options, true);
  },

  async updateMaterial (material_id, values, options) {
    return await repository.updateMaterial(material_id, values, options);
  },

  async deleteMaterial (material_id, options) {
    return await repository.deleteMaterial(material_id, options);
  },

  async getStocks (material_id, options) {
    return await repository.getStocks(material_id, options);
  },

  async getStock (material_id, stock_id, options) {
    return await repository.getStock(material_id, stock_id, options, true);
  }
});
