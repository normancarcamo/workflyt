const Repository = require('src/core/jobs/jobs-repository');
const Service = require('src/core/jobs/jobs-service');
const ACTION_ERROR = require('test/config/errors').ERROR_BAD_GATEWAY;
const DATA = require('test/config/models');

describe('Job Service', () => {
  const database = {};
  const repository = Repository({ database });
  let service = null;

  beforeEach(async () => { service = Service({ repository }); });

  describe('getJobs', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'getJobs').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const options = {};

      // Act:
      const res = service.getJobs(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of jobs', async () => {
      // Setup:
      jest.spyOn(repository, 'getJobs').mockResolvedValue([ DATA.job ]);

      // Arrange:
      const options = {};

      // Act:
      const res = await service.getJobs(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty().toEqual([ DATA.job ]);
    });
  });

  describe('createJob', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'createJob').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const values = DATA.job;

      // Act:
      const res = service.createJob(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return job created', async () => {
      // Setup:
      jest.spyOn(repository, 'createJob').mockResolvedValue(DATA.job);

      // Arrange:
      const values = DATA.job;

      // Act:
      const res = await service.createJob(values);

      // Assert:
      expect(res).toEqual(DATA.job);
    });
  });

  describe('getJob', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'getJob').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = service.getJob({ job_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return job when is found', async () => {
      // Setup:
      jest.spyOn(repository, 'getJob').mockResolvedValue(DATA.job);

      // Arrange:
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = await service.getJob({ job_id, options });

      // Assert:
      expect(res).toEqual(DATA.job);
    });
  });

  describe('updateJob', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'updateJob').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const job_id = DATA.job.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = service.updateJob({ job_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return job updated when is found', async () => {
      // Setup:
      jest.spyOn(repository, 'updateJob').mockResolvedValue({
        extra: { enabled: true },
        updated_at: new Date('2019-10-10')
      });

      // Arrange:
      const job_id = DATA.job.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await service.updateJob({ job_id, values, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.extra).toEqual({ enabled: true });
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('deleteJob', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'deleteJob').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = service.deleteJob({ job_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return job updated when is found', async () => {
      // Setup:
      jest.spyOn(repository, 'deleteJob').mockResolvedValue({
        updated_at: new Date('2019-10-10'),
        deleted_at: new Date('2019-10-10')
      });

      // Arrange:
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = await service.deleteJob({ job_id, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('getSubjobs', () => {
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(repository, 'getSubjobs').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = service.getSubjobs({ job_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      jest.spyOn(repository, 'getSubjobs').mockResolvedValue([ DATA.subjob ]);

      // Arrange:
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = await service.getSubjobs({ job_id, options });

      // Assert:
      expect(res).toEqual([ DATA.subjob ]);
    });
  });

  describe('addSubjobs', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'addSubjobs').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const options = { job_id: DATA.job.id, subjobs: [ DATA.subjob.id ] };

      // Act:
      const res = service.addSubjobs(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations after adding them', async () => {
      // Setup:
      jest.spyOn(repository, 'addSubjobs').mockResolvedValue([ DATA.jobSubjob ]);

      // Arrange:
      const options = { job_id: DATA.job.id, subjobs: [ DATA.subjob.id ] };

      // Act:
      const res = await service.addSubjobs(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty();
      expect(res).toEqual([ DATA.jobSubjob ]);
    });
  });

  describe('getSubjob', () => {
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(repository, 'getSubjob').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const job_id = DATA.job.id;
      const subjob_id = DATA.subjob.id;
      const options = {};

      // Act:
      const res = service.getSubjob({ job_id, subjob_id, options }, true);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.subjob, JobSubjob: DATA.jobSubjob };

      // Mock:
      jest.spyOn(repository, 'getSubjob').mockResolvedValue(expected);

      // Arrange:
      const job_id = DATA.job.id;
      const subjob_id = DATA.subjob.id;
      const options = {};

      // Act:
      const res = await service.getSubjob({ job_id, subjob_id, options }, true);

      // Assert:
      expect(res).toEqual(expected)
    });
  });

  describe('updateSubjob', () => {
    it('should throw error when action fail', () => {
      // Before:
      jest.spyOn(repository, 'updateSubjob').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const job_id = DATA.job.id;
      const subjob_id = DATA.subjob.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = service.updateSubjob({ job_id, subjob_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association updated after update', async () => {
      // Before:
      jest.spyOn(repository, 'updateSubjob').mockResolvedValue({
        ...DATA.jobSubjob,
        extra: { enabled: true },
        updated_at: new Date('2019-10-10')
      });

      // Arrange:
      const job_id = DATA.jobSubjob.job_id;
      const subjob_id = DATA.jobSubjob.subjob_id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await service.updateSubjob({ job_id, subjob_id, values, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.job_id).toEqual(job_id);
      expect(res.subjob_id).toEqual(subjob_id);
      expect(res.extra).toEqual({ enabled: true });
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('deleteSubjob', () => {
    it('should throw error when action fail', () => {
      // Before:
      jest.spyOn(repository, 'deleteSubjob').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const job_id = DATA.job.id;
      const subjob_id = DATA.subjob.id;
      const options = {};

      // Act:
      const res = service.deleteSubjob({ job_id, subjob_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association deleted after delete', async () => {
      // Before:
      jest.spyOn(repository, 'deleteSubjob').mockResolvedValue({
        ...DATA.jobSubjob,
        updated_at: new Date('2019-10-10'),
        deleted_at: new Date('2019-10-10')
      });

      // Arrange:
      const job_id = DATA.jobSubjob.job_id;
      const subjob_id = DATA.jobSubjob.subjob_id;
      const options = {};

      // Act:
      const res = await service.deleteSubjob({ job_id, subjob_id, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.job_id).toEqual(job_id);
      expect(res.subjob_id).toEqual(subjob_id);
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('getWorkers', () => {
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(repository, 'getWorkers').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = service.getWorkers({ job_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      jest.spyOn(repository, 'getWorkers').mockResolvedValue([ DATA.worker ]);

      // Arrange:
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = await service.getWorkers({ job_id, options });

      // Assert:
      expect(res).toEqual([ DATA.worker ]);
    });
  });

  describe('addWorkers', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'addWorkers').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const options = { job_id: DATA.job.id, workers: [ DATA.worker.id ] };

      // Act:
      const res = service.addWorkers(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations after adding them', async () => {
      // Setup:
      jest.spyOn(repository, 'addWorkers').mockResolvedValue([ DATA.jobWorker ]);

      // Arrange:
      const options = { job_id: DATA.job.id, workers: [ DATA.worker.id ] };

      // Act:
      const res = await service.addWorkers(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty();
      expect(res).toEqual([ DATA.jobWorker ]);
    });
  });

  describe('getWorker', () => {
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(repository, 'getWorker').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const job_id = DATA.job.id;
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = service.getWorker({ job_id, worker_id, options }, true);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.worker, JobWorker: DATA.jobWorker };

      // Mock:
      jest.spyOn(repository, 'getWorker').mockResolvedValue(expected);

      // Arrange:
      const job_id = DATA.job.id;
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = await service.getWorker({ job_id, worker_id, options }, true);

      // Assert:
      expect(res).toEqual(expected)
    });
  });

  describe('updateWorker', () => {
    it('should throw error when action fail', () => {
      // Before:
      jest.spyOn(repository, 'updateWorker').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const job_id = DATA.job.id;
      const worker_id = DATA.worker.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = service.updateWorker({ job_id, worker_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association updated after update', async () => {
      // Before:
      jest.spyOn(repository, 'updateWorker').mockResolvedValue({
        ...DATA.jobWorker,
        extra: { enabled: true },
        updated_at: new Date('2019-10-10')
      });

      // Arrange:
      const job_id = DATA.jobWorker.job_id;
      const worker_id = DATA.jobWorker.worker_id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await service.updateWorker({ job_id, worker_id, values, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.job_id).toEqual(job_id);
      expect(res.worker_id).toEqual(worker_id);
      expect(res.extra).toEqual({ enabled: true });
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('deleteWorker', () => {
    it('should throw error when action fail', () => {
      // Before:
      jest.spyOn(repository, 'deleteWorker').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const job_id = DATA.job.id;
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = service.deleteWorker({ job_id, worker_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association deleted after delete', async () => {
      // Before:
      jest.spyOn(repository, 'deleteWorker').mockResolvedValue({
        ...DATA.jobWorker,
        updated_at: new Date('2019-10-10'),
        deleted_at: new Date('2019-10-10')
      });

      // Arrange:
      const job_id = DATA.jobWorker.job_id;
      const worker_id = DATA.jobWorker.worker_id;
      const options = {};

      // Act:
      const res = await service.deleteWorker({ job_id, worker_id, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.job_id).toEqual(job_id);
      expect(res.worker_id).toEqual(worker_id);
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('getMaterials', () => {
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(repository, 'getMaterials').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = service.getMaterials({ job_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      jest.spyOn(repository, 'getMaterials').mockResolvedValue([ DATA.material ]);

      // Arrange:
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = await service.getMaterials({ job_id, options });

      // Assert:
      expect(res).toEqual([ DATA.material ]);
    });
  });

  describe('addMaterials', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'addMaterials').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const options = { job_id: DATA.job.id, materials: [ DATA.material.id ] };

      // Act:
      const res = service.addMaterials(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations after adding them', async () => {
      // Setup:
      jest.spyOn(repository, 'addMaterials').mockResolvedValue([ DATA.jobMaterial ]);

      // Arrange:
      const options = { job_id: DATA.job.id, materials: [ DATA.material.id ] };

      // Act:
      const res = await service.addMaterials(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty();
      expect(res).toEqual([ DATA.jobMaterial ]);
    });
  });

  describe('getMaterial', () => {
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(repository, 'getMaterial').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const job_id = DATA.job.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = service.getMaterial({ job_id, material_id, options }, true);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.material, JobMaterial: DATA.jobMaterial };

      // Mock:
      jest.spyOn(repository, 'getMaterial').mockResolvedValue(expected);

      // Arrange:
      const job_id = DATA.job.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = await service.getMaterial({ job_id, material_id, options }, true);

      // Assert:
      expect(res).toEqual(expected)
    });
  });

  describe('updateMaterial', () => {
    it('should throw error when action fail', () => {
      // Before:
      jest.spyOn(repository, 'updateMaterial').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const job_id = DATA.job.id;
      const material_id = DATA.material.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = service.updateMaterial({ job_id, material_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association updated after update', async () => {
      // Before:
      jest.spyOn(repository, 'updateMaterial').mockResolvedValue({
        ...DATA.jobMaterial,
        extra: { enabled: true },
        updated_at: new Date('2019-10-10')
      });

      // Arrange:
      const job_id = DATA.jobMaterial.job_id;
      const material_id = DATA.jobMaterial.material_id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await service.updateMaterial({ job_id, material_id, values, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.job_id).toEqual(job_id);
      expect(res.material_id).toEqual(material_id);
      expect(res.extra).toEqual({ enabled: true });
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('deleteMaterial', () => {
    it('should throw error when action fail', () => {
      // Before:
      jest.spyOn(repository, 'deleteMaterial').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const job_id = DATA.job.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = service.deleteMaterial({ job_id, material_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association deleted after delete', async () => {
      // Before:
      jest.spyOn(repository, 'deleteMaterial').mockResolvedValue({
        ...DATA.jobMaterial,
        updated_at: new Date('2019-10-10'),
        deleted_at: new Date('2019-10-10')
      });

      // Arrange:
      const job_id = DATA.jobMaterial.job_id;
      const material_id = DATA.jobMaterial.material_id;
      const options = {};

      // Act:
      const res = await service.deleteMaterial({ job_id, material_id, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.job_id).toEqual(job_id);
      expect(res.material_id).toEqual(material_id);
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });
});
