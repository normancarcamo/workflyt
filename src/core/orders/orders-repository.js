module.exports = ({ database }) => ({
  async getOrders (options) {
    return await database.models.Order.findAll(options);
  },

  async createOrder (values) {
    return await database.models.Order.create(values);
  },

  async getOrder ({ order_id, options }, assert) {
    let order = await database.models.Order.findByPk(
      order_id,
      database.queryBuilder(options)
    );

    if (assert && !order) {
      throw new Error('Not found');
    } else {
      return order;
    }
  },

  async updateOrder ({ order_id, values, options }) {
    let order = await this.getOrder({ order_id }, true);
    return await order.update(values, options);
  },

  async deleteOrder ({ order_id, options }) {
    let order = await this.getOrder({ order_id }, true);
    return await order.destroy(options);
  },

  async getJobs ({ order_id, options }) {
    let order = await this.getOrder({ order_id }, true);
    return await order.getJobs(database.queryBuilder(options));
  },

  async getJob ({ order_id, job_id, options }, assert) {
    let order = await this.getOrder({ order_id }, true);

    let job = await order.getJobs({
      plain: true,
      ...database.queryBuilder({
        id: job_id,
        ...options
      })
    });

    if (assert && !job) {
      throw new Error('Not found');
    } else {
      return job;
    }
  }
});
