import { F } from './warehouses-types';

export const WarehouseRepository:F.repository = (database) => ({
  async getWarehouses (options) {
    return await database.models.Warehouse.findAll(options);
  },

  async createWarehouse (values) {
    return await database.models.Warehouse.create(values);
  },

  async getWarehouse (warehouse_id, options, throwNotFound) {
    let warehouse = await database.models.Warehouse.findByPk(
      warehouse_id,
      database.queryBuilder(options)
    );

    if (throwNotFound && !warehouse) {
      throw new Error('Not found');
    } else {
      return warehouse;
    }
  },

  async updateWarehouse (warehouse_id, values, options) {
    let warehouse = await this.getWarehouse(warehouse_id, null, true);
    return await warehouse.update(values, options);
  },

  async deleteWarehouse (warehouse_id, options) {
    let warehouse = await this.getWarehouse(warehouse_id, null, true);
    return await warehouse.destroy(options);
  },

  async getMaterials (warehouse_id, options) {
    let warehouse = await this.getWarehouse(warehouse_id, null, true);
    return await warehouse.getMaterials(database.queryBuilder(options));
  },

  async addMaterials (warehouse_id, materials) {
    let warehouse = await this.getWarehouse(warehouse_id, null, true);
    return await warehouse.addMaterials(materials);
  },

  async getMaterial (warehouse_id, material_id, options, throwNotFound) {
    let warehouse = await this.getWarehouse(warehouse_id, null, true);

    let material = await warehouse.getMaterials({
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
  },

  async updateMaterial (warehouse_id, material_id, values, options) {
    let material = await this.getMaterial(warehouse_id, material_id, null, true);
    return await material.WarehouseMaterial.update(values, options);
  },

  async deleteMaterial (warehouse_id, material_id, options) {
    let material = await this.getMaterial(warehouse_id, material_id, null, true);
    return await material.WarehouseMaterial.destroy(options);
  }
});
