import { F } from './categories-types';

export const CategoryService:F.service = (repository) => ({
  async getCategories (options) {
    return await repository.getCategories(options);
  },

  async createCategory (values, options) {
    return await repository.createCategory(values, options);
  },

  async getCategory (category_id, options) {
    return await repository.getCategory(category_id, options, true);
  },

  async updateCategory (category_id, values, options) {
    return await repository.updateCategory(category_id, values, options);
  },

  async deleteCategory (category_id, options) {
    return await repository.deleteCategory(category_id, options);
  },

  async getMaterials (category_id, options) {
    return await repository.getMaterials(category_id, options);
  },

  async getMaterial (category_id, material_id, options) {
    return await repository.getMaterial(category_id, material_id, options, true);
  }
});
