import { F } from './categories-types';

export const CategoryRepository:F.repository = (database) => ({
  async getCategories (options) {
    return await database.models.Category.findAll(options);
  },

  async createCategory (values, options) {
    return await database.models.Category.create(values, options);
  },

  async getCategory (category_id, options, throwNotFound) {
    let category = await database.models.Category.findByPk(
      category_id,
      database.queryBuilder(options)
    );

    if (throwNotFound && !category) {
      throw new Error('Not found');
    } else {
      return category;
    }
  },

  async updateCategory (category_id, values, options) {
    let category = await this.getCategory(category_id, null, true);
    return await category.update(values, options);
  },

  async deleteCategory (category_id, options) {
    let category = await this.getCategory(category_id, null, true);
    return await category.destroy(options);
  },

  async getMaterials (category_id, options) {
    let category = await this.getCategory(category_id, null, true);
    return await category.getMaterials(database.queryBuilder(options));
  },

  async getMaterial (category_id, material_id, options, throwNotFound) {
    let category = await this.getCategory(category_id, null, true);

    let material = await category.getMaterials({
      plain: true,
      ...database.queryBuilder({
        id: material_id,
        ...options
      })
    });

    if (throwNotFound && !material) {
      throw new Error('Not found');
    } else {
      return material;
    }
  }
});
