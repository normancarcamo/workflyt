module.exports = ({ database }) => ({
  async getCategories (options) {
    return await database.models.Category.findAll(options);
  },

  async createCategory (values) {
    return await database.models.Category.create(values);
  },

  async getCategory ({ category_id, options }, assert) {
    let category = await database.models.Category.findByPk(
      category_id,
      database.queryBuilder(options)
    );

    if (assert && !category) {
      throw new Error('Not found');
    } else {
      return category;
    }
  },

  async updateCategory ({ category_id, values, options }) {
    let category = await this.getCategory({ category_id }, true);
    return await category.update(values, options);
  },

  async deleteCategory ({ category_id, options }) {
    let category = await this.getCategory({ category_id }, true);
    return await category.destroy(options);
  },

  async getMaterials ({ category_id, options }) {
    let category = await this.getCategory({ category_id }, true);
    return await category.getMaterials(database.queryBuilder(options));
  },

  async getMaterial ({ category_id, material_id, options }, assert) {
    let category = await this.getCategory({ category_id }, true);

    let material = await category.getMaterials({
      plain: true,
      ...database.queryBuilder({
        id: material_id,
        ...options
      })
    });

    if (assert && !material) {
      throw new Error('Not found');
    } else {
      return material;
    }
  }
});
