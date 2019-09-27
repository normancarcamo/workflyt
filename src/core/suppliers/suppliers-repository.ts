import { F } from './suppliers-types';

export const SupplierRepository:F.repository = (database) => ({
  async getSuppliers (options) {
    return await database.models.Supplier.findAll(options);
  },

  async createSupplier (values) {
    return await database.models.Supplier.create(values);
  },

  async getSupplier (supplier_id, options, throwNotFound) {
    let supplier = await database.models.Supplier.findByPk(
      supplier_id,
      database.queryBuilder(options)
    );

    if (throwNotFound && !supplier) {
      throw new Error('Not found');
    } else {
      return supplier;
    }
  },

  async updateSupplier (supplier_id, values, options) {
    let supplier = await this.getSupplier(supplier_id, null, true);
    return await supplier.update(values, options);
  },

  async deleteSupplier (supplier_id, options) {
    let supplier = await this.getSupplier(supplier_id, null, true);
    return await supplier.destroy(options);
  },

  async getMaterials (supplier_id, options) {
    let supplier = await this.getSupplier(supplier_id, null, true);
    return await supplier.getMaterials(database.queryBuilder(options));
  },

  async addMaterials (supplier_id, materials) {
    let supplier = await this.getSupplier(supplier_id, null, true);
    return await supplier.addMaterials(materials);
  },

  async getMaterial (supplier_id, material_id, options, throwNotFound) {
    let supplier = await this.getSupplier(supplier_id, null, true);

    let material = await supplier.getMaterials({
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

  async updateMaterial (supplier_id, material_id, values, options) {
    let material = await this.getMaterial(supplier_id, material_id, null, true);
    return await material.SupplierMaterial.update(values, options);
  },

  async deleteMaterial (supplier_id, material_id, options) {
    let material = await this.getMaterial(supplier_id, material_id, null, true);
    return await material.SupplierMaterial.destroy(options);
  }
});
