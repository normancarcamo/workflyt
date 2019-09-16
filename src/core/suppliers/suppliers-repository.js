module.exports = ({ database }) => ({
  async getSuppliers (options) {
    return await database.models.Supplier.findAll(options);
  },

  async createSupplier (values) {
    return await database.models.Supplier.create(values);
  },

  async getSupplier ({ supplier_id, options }, assert) {
    let supplier = await database.models.Supplier.findByPk(
      supplier_id,
      database.queryBuilder(options)
    );

    if (assert && !supplier) {
      throw new Error('Not found');
    } else {
      return supplier;
    }
  },

  async updateSupplier ({ supplier_id, values, options }) {
    let supplier = await this.getSupplier({ supplier_id }, true);
    return await supplier.update(values, options);
  },

  async deleteSupplier ({ supplier_id, options }) {
    let supplier = await this.getSupplier({ supplier_id }, true);
    return await supplier.destroy(options);
  },

  async getMaterials ({ supplier_id, options }) {
    let supplier = await this.getSupplier({ supplier_id }, true);
    return await supplier.getMaterials(database.queryBuilder(options));
  },

  async addMaterials ({ supplier_id, materials }) {
    let supplier = await this.getSupplier({ supplier_id }, true);
    return await supplier.addMaterials(materials);
  },

  async getMaterial ({ supplier_id, material_id, options }, assert) {
    let supplier = await this.getSupplier({ supplier_id }, true);

    let material = await supplier.getMaterials({
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

  async updateMaterial ({ supplier_id, material_id, values, options }) {
    let material = await this.getMaterial({ supplier_id, material_id }, true);
    return await material.SupplierMaterial.update(values, options);
  },

  async deleteMaterial ({ supplier_id, material_id, options }) {
    let material = await this.getMaterial({ supplier_id, material_id }, true);
    return await material.SupplierMaterial.destroy(options);
  }
});
