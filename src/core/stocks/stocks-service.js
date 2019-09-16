module.exports = ({ repository }) => ({
  async getStocks (options) {
    return await repository.getStocks(options);
  },

  async createStock (values) {
    return await repository.createStock(values);
  },

  async getStock ({ stock_id, options }) {
    return await repository.getStock({ stock_id, options }, true);
  },

  async updateStock ({ stock_id, values, options }) {
    return await repository.updateStock({ stock_id, values, options });
  },

  async deleteStock ({ stock_id, options }) {
    return await repository.deleteStock({ stock_id, options });
  }
});
