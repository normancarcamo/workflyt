module.exports = ({ repository }) => ({
  async getServices (options) {
    return await repository.getServices(options);
  },

  async createService (values) {
    return await repository.createService(values);
  },

  async getService ({ service_id, options }) {
    return await repository.getService({ service_id, options }, true);
  },

  async updateService ({ service_id, values, options }) {
    return await repository.updateService({ service_id, values, options });
  },

  async deleteService ({ service_id, options }) {
    return await repository.deleteService({ service_id, options });
  },

  async getJobs ({ service_id, options }) {
    return await repository.getJobs({ service_id, options });
  },

  async getJob ({ service_id, job_id, options }) {
    return await repository.getJob({ service_id, job_id, options }, true);
  }
});
