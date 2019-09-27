import { F } from './clients-types';

export const ClientService:F.service = (repository) => ({
  async getClients (options) {
    return await repository.getClients(options);
  },

  async createClient (values) {
    return await repository.createClient(values);
  },

  async getClient (client_id, options) {
    return await repository.getClient(client_id, options, true);
  },

  async updateClient (client_id, values, options) {
    return await repository.updateClient(client_id, values, options);
  },

  async deleteClient (client_id, options) {
    return await repository.deleteClient(client_id, options);
  },

  async getQuotes (client_id, options) {
    return await repository.getQuotes(client_id, options);
  },

  async getQuote (client_id, quote_id, options) {
    return await repository.getQuote(client_id, quote_id, options, true);
  }
});
