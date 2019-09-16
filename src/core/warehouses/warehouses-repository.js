module.exports = ({ database }) => ({
  async getWarehouses (options) {
    return await database.models.Warehouse.findAll(options);
  },

  async createWarehouse (values) {
    return await database.models.Warehouse.create(values);
  },

  async getWarehouse ({ warehouse_id, options }, assert) {
    let warehouse = await database.models.Warehouse.findByPk(
      warehouse_id,
      database.queryBuilder(options)
    );

    if (assert && !warehouse) {
      throw new Error('Not found');
    } else {
      return warehouse;
    }
  },

  async updateWarehouse ({ warehouse_id, values, options }) {
    let warehouse = await this.getWarehouse({ warehouse_id }, true);
    return await warehouse.update(values, options);
  },

  async deleteWarehouse ({ warehouse_id, options }) {
    let warehouse = await this.getWarehouse({ warehouse_id }, true);
    return await warehouse.destroy(options);
  },

  async getMaterials ({ warehouse_id, options }) {
    let warehouse = await this.getWarehouse({ warehouse_id }, true);
    return await warehouse.getMaterials(database.queryBuilder(options));
  },

  async addMaterials ({ warehouse_id, materials }) {
    let warehouse = await this.getWarehouse({ warehouse_id }, true);
    return await warehouse.addMaterials(materials);
  },

  async getMaterial ({ warehouse_id, material_id, options }, assert) {
    let warehouse = await this.getWarehouse({ warehouse_id }, true);

    let material = await warehouse.getMaterials({
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
  },

  async updateMaterial ({ warehouse_id, material_id, values, options }) {
    let material = await this.getMaterial({ warehouse_id, material_id }, true);
    return await material.WarehouseMaterial.update(values, options);
  },

  async deleteMaterial ({ warehouse_id, material_id, options }) {
    let material = await this.getMaterial({ warehouse_id, material_id }, true);
    return await material.WarehouseMaterial.destroy(options);
  }
});
