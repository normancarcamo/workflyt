import { F } from './materials-types';

export const MaterialRepository:F.repository = (database) => ({
  async getMaterials (options) {
    return await database.models.Material.findAll(options);
  },

  async createMaterial (values) {
    return await database.models.Material.create(values);
  },

  async getMaterial (material_id, options, throwNotFound) {
    let material = await database.models.Material.findByPk(
      material_id,
      database.queryBuilder(options)
    );

    if (throwNotFound && !material) {
      throw new Error('Not found');
    } else {
      return material;
    }
  },

  async updateMaterial (material_id, values, options) {
    let material = await this.getMaterial(material_id, null, true);
    return await material.update(values, options);
  },

  async deleteMaterial (material_id, options) {
    let material = await this.getMaterial(material_id, null, true);
    return await material.destroy(options);
  },

  async getStocks (material_id, options) {
    let material = await this.getMaterial(material_id, null, true);
    return await material.getStocks(database.queryBuilder(options));
  },

  async getStock (material_id, stock_id, options, throwNotFound) {
    let material = await this.getMaterial(material_id, null, true);

    let stock = await material.getStocks({
      plain: true,
      ...database.queryBuilder({
        id: stock_id,
        ...options
      })
    });

    if (throwNotFound && !stock) {
      throw new Error('Not found');
    } else {
      return stock;
    }
  }
});
