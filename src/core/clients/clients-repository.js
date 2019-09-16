module.exports = ({ database }) => ({
  async getClients (options) {
    return await database.models.Client.findAll(options);
  },

  async createClient (values) {
    return await database.models.Client.create(values);
  },

  async getClient ({ client_id, options }, assert) {
    let client = await database.models.Client.findByPk(
      client_id,
      database.queryBuilder(options)
    );

    if (assert && !client) {
      throw new Error('Not found');
    } else {
      return client;
    }
  },

  async updateClient ({ client_id, values, options }) {
    let client = await this.getClient({ client_id }, true);
    return await client.update(values, options);
  },

  async deleteClient ({ client_id, options }) {
    let client = await this.getClient({ client_id }, true);
    return await client.destroy(options);
  },

  async getQuotes ({ client_id, options }) {
    let client = await this.getClient({ client_id }, true);
    return await client.getQuotes(database.queryBuilder(options));
  },

  async getQuote ({ client_id, quote_id, options }, assert) {
    let client = await this.getClient({ client_id }, true);

    let quote = await client.getQuotes({
      plain: true,
      ...database.queryBuilder({
        id: quote_id,
        ...options
      })
    });

    if (assert && !quote) {
      throw new Error('Not found');
    } else {
      return quote;
    }
  }
});
