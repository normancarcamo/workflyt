import { F } from './quotes-types';

export const QuoteRepository:F.repository = (database) => ({
  async getQuotes (options) {
    return await database.models.Quote.findAll(options);
  },

  async createQuote (values) {
    return await database.models.Quote.create(values);
  },

  async getQuote (quote_id, options, throwNotFound) {
    let quote = await database.models.Quote.findByPk(
      quote_id,
      database.queryBuilder(options)
    );

    if (throwNotFound && !quote) {
      throw new Error('Not found');
    } else {
      return quote;
    }
  },

  async updateQuote (quote_id, values, options) {
    let quote = await this.getQuote(quote_id, null, true);
    return await quote.update(values, options);
  },

  async deleteQuote (quote_id, options) {
    let quote = await this.getQuote(quote_id, null, true);
    return await quote.destroy(options);
  },

  async getServices (quote_id, options) {
    let quote = await this.getQuote(quote_id, null, true);
    return await quote.getServices(database.queryBuilder(options));
  },

  async addServices (quote_id, services) {
    let quote = await this.getQuote(quote_id, null, true);
    return await quote.addServices(services);
  },

  async getService (quote_id, service_id, options, throwNotFound) {
    let quote = await this.getQuote(quote_id, null, true);

    let service = await quote.getServices({
      plain: true,
      ...database.queryBuilder({
        id: service_id,
        ...options
      })
    });

    if (throwNotFound && !service) {
      throw new Error('Not found');
    } else {
      return service;
    }
  },

  async updateService (quote_id, service_id, values, options) {
    let service = await this.getService(quote_id, service_id, null, true);
    return await service.QuoteService.update(values, options);
  },

  async deleteService (quote_id, service_id, options) {
    let service = await this.getService(quote_id, service_id, null, true);
    return await service.QuoteService.destroy(options);
  },

  async getOrders (quote_id, options) {
    let quote = await this.getQuote(quote_id, null, true);
    return await quote.getOrders(database.queryBuilder(options));
  },

  async getOrder (quote_id, order_id, options, throwNotFound) {
    let quote = await this.getQuote(quote_id, null, true);

    let order = await quote.getOrders({
      plain: true,
      ...database.queryBuilder({
        id: order_id,
        ...options
      })
    });

    if (throwNotFound && !order) {
      throw new Error('Not found');
    } else {
      return order;
    }
  }
});
