import { F } from './services-types';

export const ServiceRepository:F.repository = (database) => ({
  async getServices (options) {
    return await database.models.Service.findAll(options);
  },

  async createService (values) {
    return await database.models.Service.create(values);
  },

  async getService (service_id, options, throwNotFound) {
    let service = await database.models.Service.findByPk(
      service_id,
      database.queryBuilder(options)
    );

    if (throwNotFound && !service) {
      throw new Error('Not found');
    } else {
      return service;
    }
  },

  async updateService (service_id, values, options) {
    let service = await this.getService(service_id, null, true);
    return await service.update(values, options);
  },

  async deleteService (service_id, options) {
    let service = await this.getService(service_id, null, true);
    return await service.destroy(options);
  },

  async getJobs (service_id, options) {
    let service = await this.getService(service_id, null, true);
    return await service.getJobs(database.queryBuilder(options));
  },

  async getJob (service_id, job_id, options, throwNotFound) {
    let service = await this.getService(service_id, null, true);

    let job = await service.getJobs({
      plain: true,
      ...database.queryBuilder({
        id: job_id,
        ...options
      })
    });

    if (throwNotFound && !job) {
      throw new Error('Not found');
    } else {
      return job;
    }
  }
});
