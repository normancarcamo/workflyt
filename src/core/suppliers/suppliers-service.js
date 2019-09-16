module.exports = ({ repository }) => ({
  async getSuppliers (options) {
    return await repository.getSuppliers(options);
  },

  async createSupplier (values) {
    return await repository.createSupplier(values);
  },

  async getSupplier ({ supplier_id, options }) {
    return await repository.getSupplier({ supplier_id, options }, true);
  },

  async updateSupplier ({ supplier_id, values, options }) {
    return await repository.updateSupplier({ supplier_id, values, options });
  },

  async deleteSupplier ({ supplier_id, options }) {
    return await repository.deleteSupplier({ supplier_id, options });
  },

  async getMaterials ({ supplier_id, options }) {
    return await repository.getMaterials({ supplier_id, options });
  },

  async addMaterials ({ supplier_id, materials }) {
    return await repository.addMaterials({ supplier_id, materials });
  },

  async getMaterial ({ supplier_id, material_id, options }) {
    return await repository.getMaterial({ supplier_id, material_id, options }, true);
  },

  async updateMaterial ({ supplier_id, material_id, values, options }) {
    return await repository.updateMaterial({ supplier_id, material_id, values, options });
  },

  async deleteMaterial ({ supplier_id, material_id, options }) {
    return await repository.deleteMaterial({ supplier_id, material_id, options });
  }
});
