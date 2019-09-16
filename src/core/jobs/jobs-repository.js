module.exports = ({ database }) => ({
  async getJobs (options) {
    return await database.models.Job.findAll(options);
  },

  async createJob (values) {
    return await database.models.Job.create(values);
  },

  async getJob ({ job_id, options }, assert) {
    let job = await database.models.Job.findByPk(
      job_id,
      database.queryBuilder(options)
    );

    if (assert && !job) {
      throw new Error('Not found');
    } else {
      return job;
    }
  },

  async updateJob ({ job_id, values, options }) {
    let job = await this.getJob({ job_id }, true);
    return await job.update(values, options);
  },

  async deleteJob ({ job_id, options }) {
    let job = await this.getJob({ job_id }, true);
    return await job.destroy(options);
  },

  async getSubjobs ({ job_id, options }) {
    let job = await this.getJob({ job_id }, true);
    return await job.getSubjobs(database.queryBuilder(options));
  },

  async addSubjobs ({ job_id, subjobs }) {
    let job = await this.getJob({ job_id }, true);
    return await job.addSubjobs(subjobs);
  },

  async getSubjob ({ job_id, subjob_id, options }, assert) {
    let job = await this.getJob({ job_id }, true);

    let subjob = await job.getSubjobs({
      plain: true,
      ...database.queryBuilder({
        id: subjob_id,
        ...options
      })
    });

    if (assert && !subjob) {
      throw new Error('Not found');
    } else {
      return subjob;
    }
  },

  async updateSubjob ({ job_id, subjob_id, values, options }) {
    let subjob = await this.getSubjob({ job_id, subjob_id }, true);
    return await subjob.JobSubjob.update(values, options);
  },

  async deleteSubjob ({ job_id, subjob_id, options }) {
    let subjob = await this.getSubjob({ job_id, subjob_id }, true);
    return await subjob.JobSubjob.destroy(options);
  },

  async getWorkers ({ job_id, options }) {
    let job = await this.getJob({ job_id }, true);
    return await job.getWorkers(database.queryBuilder(options));
  },

  async addWorkers ({ job_id, workers }) {
    let job = await this.getJob({ job_id }, true);
    return await job.addWorkers(workers);
  },

  async getWorker ({ job_id, worker_id, options }, assert) {
    let job = await this.getJob({ job_id }, true);

    let worker = await job.getWorkers({
      plain: true,
      ...database.queryBuilder({
        id: worker_id,
        ...options
      })
    });

    if (assert && !worker) {
      throw new Error('Not found');
    } else {
      return worker;
    }
  },

  async updateWorker ({ job_id, worker_id, values, options }) {
    let worker = await this.getWorker({ job_id, worker_id }, true);
    return await worker.JobWorker.update(values, options);
  },

  async deleteWorker ({ job_id, worker_id, options }) {
    let worker = await this.getWorker({ job_id, worker_id }, true);
    return await worker.JobWorker.destroy(options);
  },

  async getMaterials ({ job_id, options }) {
    let job = await this.getJob({ job_id }, true);
    return await job.getMaterials(database.queryBuilder(options));
  },

  async addMaterials ({ job_id, materials }) {
    let job = await this.getJob({ job_id }, true);
    return await job.addMaterials(materials);
  },

  async getMaterial ({ job_id, material_id, options }, assert) {
    let job = await this.getJob({ job_id }, true);

    let material = await job.getMaterials({
      plain: true,
      ...database.queryBuilder({
        id: material_id,
        ...options
      })
    });

    if (assert && !material) {
      throw new Error('Not found');
    } else {
      return material;
    }
  },

  async updateMaterial ({ job_id, material_id, values, options }) {
    let material = await this.getMaterial({ job_id, material_id }, true);
    return await material.JobMaterial.update(values, options);
  },

  async deleteMaterial ({ job_id, material_id, options }) {
    let material = await this.getMaterial({ job_id, material_id }, true);
    return await material.JobMaterial.destroy(options);
  }
});
