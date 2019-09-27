import { F } from './areas-types';

export const AreaService:F.service = (repository) => ({
  async getAreas (options) {
    return await repository.getAreas(options);
  },

  async createArea (values, options) {
    return await repository.createArea(values, options);
  },

  async getArea (area_id, options) {
    return await repository.getArea(area_id, options, true);
  },

  async updateArea (area_id, values, options) {
    return await repository.updateArea(area_id, values, options);
  },

  async deleteArea (area_id, options) {
    return await repository.deleteArea(area_id, options);
  },

  async getSubareas (area_id, options) {
    return await repository.getSubareas(area_id, options);
  },

  async addSubareas (area_id, subareas) {
    return await repository.addSubareas(area_id, subareas);
  },

  async getSubarea (area_id, subarea_id, options) {
    return await repository.getSubarea(area_id, subarea_id, options, true);
  },

  async updateSubarea (area_id, subarea_id, values, options) {
    return await repository.updateSubarea(area_id, subarea_id, values, options);
  },

  async deleteSubarea (area_id, subarea_id, options) {
    return await repository.deleteSubarea(area_id, subarea_id, options);
  },

  async getWorkers (area_id, options) {
    return await repository.getWorkers(area_id, options);
  },

  async addWorkers (area_id, workers) {
    return await repository.addWorkers(area_id, workers);
  },

  async getWorker (area_id, worker_id, options) {
    return await repository.getWorker(area_id, worker_id, options, true);
  },

  async updateWorker (area_id, worker_id, values, options) {
    return await repository.updateWorker(area_id, worker_id, values, options);
  },

  async deleteWorker (area_id, worker_id, options) {
    return await repository.deleteWorker(area_id, worker_id, options);
  },

  async getServices (area_id, options) {
    return await repository.getServices(area_id, options);
  },

  async getService (area_id, service_id, options) {
    return await repository.getService(area_id, service_id, options, true);
  }
});
