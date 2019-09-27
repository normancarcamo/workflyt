import { F } from './quotes-types';

export const QuoteService:F.service = (repository) => ({
  async getQuotes (options) {
    return await repository.getQuotes(options);
  },

  async createQuote (values) {
    return await repository.createQuote(values);
  },

  async getQuote (quote_id, options) {
    return await repository.getQuote(quote_id, options, true);
  },

  async updateQuote (quote_id, values, options) {
    return await repository.updateQuote(quote_id, values, options);
  },

  async deleteQuote (quote_id, options) {
    return await repository.deleteQuote(quote_id, options);
  },

  async getServices (quote_id, options) {
    return await repository.getServices(quote_id, options);
  },

  async addServices (quote_id, services) {
    return await repository.addServices(quote_id, services);
  },

  async getService (quote_id, service_id, options) {
    return await repository.getService(quote_id, service_id, options, true);
  },

  async updateService (quote_id, service_id, values, options) {
    return await repository.updateService(quote_id, service_id, values, options);
  },

  async deleteService (quote_id, service_id, options) {
    return await repository.deleteService(quote_id, service_id, options);
  },

  async getOrders (quote_id, options) {
    return await repository.getOrders(quote_id, options);
  },

  async getOrder (quote_id, order_id, options) {
    return await repository.getOrder(quote_id, order_id, options, true);
  }
});
