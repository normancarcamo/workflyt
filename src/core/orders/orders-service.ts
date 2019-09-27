import { F } from './orders-types';

export const OrderService:F.service = (repository) => ({
  async getOrders (options) {
    return await repository.getOrders(options);
  },

  async createOrder (values) {
    return await repository.createOrder(values);
  },

  async getOrder (order_id, options) {
    return await repository.getOrder(order_id, options, true);
  },

  async updateOrder (order_id, values, options) {
    return await repository.updateOrder(order_id, values, options);
  },

  async deleteOrder (order_id, options) {
    return await repository.deleteOrder(order_id, options);
  },

  async getJobs (order_id, options) {
    return await repository.getJobs(order_id, options);
  },

  async getJob (order_id, job_id, options) {
    return await repository.getJob(order_id, job_id, options, true);
  }
});
