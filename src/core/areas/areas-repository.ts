import { F } from './areas-types';

export const AreaRepository:F.repository = (database) => ({
  async getAreas (options) {
    return await database.models.Area.findAll(options);
  },

  async createArea (values) {
    return await database.models.Area.create(values);
  },

  async getArea (area_id, options, throwNotFound) {
    let area = await database.models.Area.findByPk(
      area_id,
      database.queryBuilder(options)
    );

    if (throwNotFound && !area) {
      throw new Error('Not found');
    } else {
      return area;
    }
  },

  async updateArea (area_id, values, options) {
    let area = await this.getArea(area_id, null, true);
    return await area.update(values, options);
  },

  async deleteArea (area_id, options) {
    let area = await this.getArea(area_id, null, true);
    return await area.destroy(options);
  },

  async getSubareas (area_id, options) {
    let area = await this.getArea(area_id, null, true);
    return await area.getSubareas(database.queryBuilder(options));
  },

  async addSubareas (area_id, subareas) {
    let area = await this.getArea(area_id, null, true);
    return await area.addSubareas(subareas);
  },

  async getSubarea (area_id, subarea_id, options, throwNotFound) {
    let area = await this.getArea(area_id, null, true);

    let subarea = await area.getSubareas({
      plain: true,
      ...database.queryBuilder({
        id: subarea_id,
        ...options
      })
    });

    if (throwNotFound && !subarea) {
      throw new Error('Not found');
    } else {
      return subarea;
    }
  },

  async updateSubarea (area_id, subarea_id, values, options) {
    let subarea = await this.getSubarea(area_id, subarea_id, null, true);
    return await subarea.AreaSubarea.update(values, options);
  },

  async deleteSubarea (area_id, subarea_id, options) {
    let subarea = await this.getSubarea(area_id, subarea_id, null, true);
    return await subarea.AreaSubarea.destroy(options);
  },

  async getWorkers (area_id, options) {
    let area = await this.getArea(area_id, null, true);
    return await area.getWorkers(database.queryBuilder(options));
  },

  async addWorkers (area_id, workers) {
    let area = await this.getArea(area_id, null, true);
    return await area.addWorkers(workers);
  },

  async getWorker (area_id, worker_id, options, throwNotFound) {
    let area = await this.getArea(area_id, null, true);

    let worker = await area.getWorkers({
      plain: true,
      ...database.queryBuilder({
        id: worker_id,
        ...options
      })
    });

    if (throwNotFound && !worker) {
      throw new Error('Not found');
    } else {
      return worker;
    }
  },

  async updateWorker (area_id, worker_id, values, options) {
    let worker = await this.getWorker(area_id, worker_id, null, true);
    return await worker.AreaWorker.update(values, options);
  },

  async deleteWorker (area_id, worker_id, options) {
    let worker = await this.getWorker(area_id, worker_id, null, true);
    return await worker.AreaWorker.destroy(options);
  },

  async getServices (area_id, options) {
    let area = await this.getArea(area_id, null, true);
    return await area.getServices(database.queryBuilder(options));
  },

  async getService (area_id, service_id, options, throwNotFound) {
    let area = await this.getArea(area_id, null, true);

    let service = await area.getServices({
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
  }
});
