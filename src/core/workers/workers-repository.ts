import { F } from './workers-types';

export const WorkerRepository:F.repository = (database) => ({
  async getWorkers (options) {
    return await database.models.Worker.findAll(options);
  },

  async createWorker (values) {
    return await database.models.Worker.create(values);
  },

  async getWorker (worker_id, options, throwNotFound) {
    let worker = await database.models.Worker.findByPk(
      worker_id,
      database.queryBuilder(options)
    );

    if (throwNotFound && !worker) {
      throw new Error('Not found');
    } else {
      return worker;
    }
  },

  async updateWorker (worker_id, values, options) {
    let worker = await this.getWorker(worker_id, null, true);
    return await worker.update(values, options);
  },

  async deleteWorker (worker_id, options) {
    let worker = await this.getWorker(worker_id, null, true);
    return await worker.destroy(options);
  },

  async getSupervisors (worker_id, options) {
    let worker = await this.getWorker(worker_id, null, true);
    return await worker.getSupervisors(database.queryBuilder(options));
  },

  async addSupervisors (worker_id, supervisors) {
    let worker = await this.getWorker(worker_id, null, true);
    return await worker.addSupervisors(supervisors);
  },

  async getSupervisor (worker_id, supervisor_id, options, throwNotFound) {
    let worker = await this.getWorker(worker_id, null, true);

    let supervisor = await worker.getSupervisors({
      plain: true,
      ...database.queryBuilder({
        id: supervisor_id,
        ...options
      })
    });

    if (throwNotFound && !supervisor) {
      throw new Error('Not found');
    } else {
      return supervisor;
    }
  },

  async updateSupervisor (worker_id, supervisor_id, values, options) {
    let supervisor = await this.getSupervisor(worker_id, supervisor_id, null, true);
    return await supervisor.WorkerSupervisor.update(values, options);
  },

  async deleteSupervisor (worker_id, supervisor_id, options) {
    let supervisor = await this.getSupervisor(worker_id, supervisor_id, null, true);
    return await supervisor.WorkerSupervisor.destroy(options);
  },

  async getJobs (worker_id, options) {
    let worker = await this.getWorker(worker_id, null, true);
    return await worker.getJobs(database.queryBuilder(options));
  },

  async addJobs (worker_id, jobs) {
    let worker = await this.getWorker(worker_id, null, true);
    return await worker.addJobs(jobs);
  },

  async getJob (worker_id, job_id, options, throwNotFound) {
    let worker = await this.getWorker(worker_id, null, true);

    let job = await worker.getJobs({
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
  },

  async updateJob (worker_id, job_id, values, options) {
    let job = await this.getJob(worker_id, job_id, null, true);
    return await job.JobWorker.update(values, options);
  },

  async deleteJob (worker_id, job_id, options) {
    let job = await this.getJob(worker_id, job_id, null, true);
    return await job.JobWorker.destroy(options);
  },

  async getQuotes (worker_id, options) {
    let worker = await this.getWorker(worker_id, null, true);
    return await worker.getQuotes(database.queryBuilder(options));
  },

  async getQuote (worker_id, quote_id, options, throwNotFound) {
    let worker = await this.getWorker(worker_id, null, true);

    let quote = await worker.getQuotes({
      plain: true,
      ...database.queryBuilder({
        id: quote_id,
        ...options
      })
    });

    if (throwNotFound && !quote) {
      throw new Error('Not found');
    } else {
      return quote;
    }
  },

  async getUser (worker_id, options, throwNotFound) {
    let worker = await this.getWorker(worker_id, null, true);

    let user = await worker.getUser(database.queryBuilder(options));

    if (throwNotFound && !user) {
      throw new Error('Not found');
    } else {
      return user;
    }
  }
});
