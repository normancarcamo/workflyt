import { F } from './workers-types';

export const WorkerService:F.service = (repository) => ({
  async getWorkers (options) {
    return await repository.getWorkers(options);
  },

  async createWorker (values) {
    return await repository.createWorker(values);
  },

  async getWorker (worker_id, options) {
    return await repository.getWorker(worker_id, options, true);
  },

  async updateWorker (worker_id, values, options) {
    return await repository.updateWorker(worker_id, values, options);
  },

  async deleteWorker (worker_id, options) {
    return await repository.deleteWorker(worker_id, options);
  },

  async getSupervisors (worker_id, options) {
    return await repository.getSupervisors(worker_id, options);
  },

  async addSupervisors (worker_id, supervisors) {
    return await repository.addSupervisors(worker_id, supervisors);
  },

  async getSupervisor (worker_id, supervisor_id, options) {
    return await repository.getSupervisor(worker_id, supervisor_id, options, true);
  },

  async updateSupervisor (worker_id, supervisor_id, values, options) {
    return await repository.updateSupervisor(worker_id, supervisor_id, values, options);
  },

  async deleteSupervisor (worker_id, supervisor_id, options) {
    return await repository.deleteSupervisor(worker_id, supervisor_id, options);
  },

  async getJobs (worker_id, options) {
    return await repository.getJobs(worker_id, options);
  },

  async addJobs (worker_id, jobs) {
    return await repository.addJobs(worker_id, jobs);
  },

  async getJob (worker_id, job_id, options) {
    return await repository.getJob(worker_id, job_id, options, true);
  },

  async updateJob (worker_id, job_id, values, options) {
    return await repository.updateJob(worker_id, job_id, values, options);
  },

  async deleteJob (worker_id, job_id, options) {
    return await repository.deleteJob(worker_id, job_id, options);
  },

  async getQuotes (worker_id, options) {
    return await repository.getQuotes(worker_id, options);
  },

  async getQuote (worker_id, quote_id, options) {
    return await repository.getQuote(worker_id, quote_id, options, true);
  },

  async getUser (worker_id, options) {
    return await repository.getUser(worker_id, options, true);
  }
});
