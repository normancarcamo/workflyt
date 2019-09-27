import { F } from './stocks-types';

export const StockRepository:F.repository = (database) => ({
  async getStocks (options) {
    return await database.models.Stock.findAll(options);
  },

  async createStock (values) {
    return await database.models.Stock.create(values);
  },

  async getStock (stock_id, options, throwNotFound) {
    let stock = await database.models.Stock.findByPk(
      stock_id,
      database.queryBuilder(options)
    );

    if (throwNotFound && !stock) {
      throw new Error('Not found');
    } else {
      return stock;
    }
  },

  async updateStock (stock_id, values, options) {
    let stock = await this.getStock(stock_id, null, true);
    return await stock.update(values, options);
  },

  async deleteStock (stock_id, options) {
    let stock = await this.getStock(stock_id, null, true);
    return await stock.destroy(options);
  }
});
