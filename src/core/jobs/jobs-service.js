module.exports = ({ repository }) => ({
  async getJobs (options) {
    return await repository.getJobs(options);
  },

  async createJob (values) {
    return await repository.createJob(values);
  },

  async getJob ({ job_id, options }) {
    return await repository.getJob({ job_id, options }, true);
  },

  async updateJob ({ job_id, values, options }) {
    return await repository.updateJob({ job_id, values, options });
  },

  async deleteJob ({ job_id, options }) {
    return await repository.deleteJob({ job_id, options });
  },

  async getSubjobs ({ job_id, options }) {
    return await repository.getSubjobs({ job_id, options });
  },

  async addSubjobs ({ job_id, subjobs }) {
    return await repository.addSubjobs({ job_id, subjobs });
  },

  async getSubjob ({ job_id, subjob_id, options }) {
    return await repository.getSubjob({ job_id, subjob_id, options }, true);
  },

  async updateSubjob ({ job_id, subjob_id, values, options }) {
    return await repository.updateSubjob({ job_id, subjob_id, values, options });
  },

  async deleteSubjob ({ job_id, subjob_id, options }) {
    return await repository.deleteSubjob({ job_id, subjob_id, options });
  },

  async getWorkers ({ job_id, options }) {
    return await repository.getWorkers({ job_id, options });
  },

  async addWorkers ({ job_id, workers }) {
    return await repository.addWorkers({ job_id, workers });
  },

  async getWorker ({ job_id, worker_id, options }) {
    return await repository.getWorker({ job_id, worker_id, options }, true);
  },

  async updateWorker ({ job_id, worker_id, values, options }) {
    return await repository.updateWorker({ job_id, worker_id, values, options });
  },

  async deleteWorker ({ job_id, worker_id, options }) {
    return await repository.deleteWorker({ job_id, worker_id, options });
  },

  async getMaterials ({ job_id, options }) {
    return await repository.getMaterials({ job_id, options });
  },

  async addMaterials ({ job_id, materials }) {
    return await repository.addMaterials({ job_id, materials });
  },

  async getMaterial ({ job_id, material_id, options }) {
    return await repository.getMaterial({ job_id, material_id, options }, true);
  },

  async updateMaterial ({ job_id, material_id, values, options }) {
    return await repository.updateMaterial({ job_id, material_id, values, options });
  },

  async deleteMaterial ({ job_id, material_id, options }) {
    return await repository.deleteMaterial({ job_id, material_id, options });
  }
});
