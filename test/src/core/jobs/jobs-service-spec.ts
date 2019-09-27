import '../../../config/global';
import { JobRepository } from '../../../../src/core/jobs/jobs-repository';
import { JobService } from '../../../../src/core/jobs/jobs-service';
import { I } from '../../../../src/core/jobs/jobs-types';
import { ERROR_BAD_GATEWAY as ACTION_ERROR } from '../../../config/errors';
import * as DATA from '../../../config/models';

describe('Job Service', () => {
  let database = {};
  let repository = JobRepository(database);
  let service:I.service = JobService(repository);

  beforeEach(async () => { service = JobService(repository); });

  describe('getJobs', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.getJobs = async () => { throw ACTION_ERROR; };

      // Arrange:
      const options = {};

      // Act:
      const res = service.getJobs(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of jobs', async () => {
      // Setup:
      repository.getJobs = async () => [ DATA.job ];

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
      repository.createJob = async () => { throw ACTION_ERROR; };

      // Arrange:
      const values = DATA.job;

      // Act:
      const res = service.createJob(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return job created', async () => {
      // Setup:
      repository.createJob = async () => DATA.job;

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
      repository.getJob = async () => { throw ACTION_ERROR; };

      // Arrange:
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = service.getJob(job_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return job when is found', async () => {
      // Setup:
      repository.getJob = async () => DATA.job;

      // Arrange:
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = await service.getJob(job_id, options);

      // Assert:
      expect(res).toEqual(DATA.job);
    });
  });

  describe('updateJob', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.updateJob = async () => { throw ACTION_ERROR; };

      // Arrange:
      const job_id = DATA.job.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = service.updateJob(job_id, values, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return job updated when is found', async () => {
      // Setup:
      repository.updateJob = async () => ({
        extra: { enabled: true },
        updated_at: new Date('2019-10-10')
      });

      // Arrange:
      const job_id = DATA.job.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await service.updateJob(job_id, values, options);

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.extra).toEqual({ enabled: true });
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('deleteJob', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.deleteJob = async () => { throw ACTION_ERROR; };

      // Arrange:
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = service.deleteJob(job_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return job updated when is found', async () => {
      // Setup:
      repository.deleteJob = async () => ({
        updated_at: new Date('2019-10-10'),
        deleted_at: new Date('2019-10-10')
      });

      // Arrange:
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = await service.deleteJob(job_id, options);

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('getSubjobs', () => {
    it('should throw error when action fail', () => {
      // Mock:
      repository.getSubjobs = async () => { throw ACTION_ERROR; };

      // Arrange:
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = service.getSubjobs(job_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      repository.getSubjobs = async () => [ DATA.subjob ];

      // Arrange:
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = await service.getSubjobs(job_id, options);

      // Assert:
      expect(res).toEqual([ DATA.subjob ]);
    });
  });

  describe('addSubjobs', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.addSubjobs = async () => { throw ACTION_ERROR; };

      // Arrange:
      const job_id = DATA.job.id;
      const subjobs = [ DATA.subjob.id ];

      // Act:
      const res = service.addSubjobs(job_id, subjobs);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations after adding them', async () => {
      // Setup:
      repository.addSubjobs = async () => [ DATA.jobSubjob ];

      // Arrange:
      const job_id = DATA.job.id;
      const subjobs = [ DATA.subjob.id ];

      // Act:
      const res = await service.addSubjobs(job_id, subjobs);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty();
      expect(res).toEqual([ DATA.jobSubjob ]);
    });
  });

  describe('getSubjob', () => {
    it('should throw error when action fail', () => {
      // Mock:
      repository.getSubjob = async () => { throw ACTION_ERROR; };

      // Arrange:
      const job_id = DATA.job.id;
      const subjob_id = DATA.subjob.id;
      const options = {};

      // Act:
      const res = service.getSubjob(job_id, subjob_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.subjob, JobSubjob: DATA.jobSubjob };

      // Mock:
      repository.getSubjob = async () => expected;

      // Arrange:
      const job_id = DATA.job.id;
      const subjob_id = DATA.subjob.id;
      const options = {};

      // Act:
      const res = await service.getSubjob(job_id, subjob_id, options);

      // Assert:
      expect(res).toEqual(expected)
    });
  });

  describe('updateSubjob', () => {
    it('should throw error when action fail', () => {
      // Before:
      repository.updateSubjob = async () => { throw ACTION_ERROR; };

      // Arrange:
      const job_id = DATA.job.id;
      const subjob_id = DATA.subjob.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = service.updateSubjob(job_id, subjob_id, values, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association updated after update', async () => {
      // Before:
      repository.updateSubjob = async () => ({
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
      const res = await service.updateSubjob(job_id, subjob_id, values, options);

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
      repository.deleteSubjob = async () => { throw ACTION_ERROR; };

      // Arrange:
      const job_id = DATA.job.id;
      const subjob_id = DATA.subjob.id;
      const options = {};

      // Act:
      const res = service.deleteSubjob(job_id, subjob_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association deleted after delete', async () => {
      // Before:
      repository.deleteSubjob = async () => ({
        ...DATA.jobSubjob,
        updated_at: new Date('2019-10-10'),
        deleted_at: new Date('2019-10-10')
      });

      // Arrange:
      const job_id = DATA.jobSubjob.job_id;
      const subjob_id = DATA.jobSubjob.subjob_id;
      const options = {};

      // Act:
      const res = await service.deleteSubjob(job_id, subjob_id, options);

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
      repository.getWorkers = async () => { throw ACTION_ERROR; };

      // Arrange:
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = service.getWorkers(job_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      repository.getWorkers = async () => [ DATA.worker ];

      // Arrange:
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = await service.getWorkers(job_id, options);

      // Assert:
      expect(res).toEqual([ DATA.worker ]);
    });
  });

  describe('addWorkers', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.addWorkers = async () => { throw ACTION_ERROR; };

      // Arrange:
      const job_id = DATA.job.id;
      const workers = [ DATA.worker.id ];

      // Act:
      const res = service.addWorkers(job_id, workers);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations after adding them', async () => {
      // Setup:
      repository.addWorkers = async () => [ DATA.jobWorker ];

      // Arrange:
      const job_id = DATA.job.id;
      const workers = [ DATA.worker.id ];

      // Act:
      const res = await service.addWorkers(job_id, workers);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty();
      expect(res).toEqual([ DATA.jobWorker ]);
    });
  });

  describe('getWorker', () => {
    it('should throw error when action fail', () => {
      // Mock:
      repository.getWorker = async () => { throw ACTION_ERROR; };

      // Arrange:
      const job_id = DATA.job.id;
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = service.getWorker(job_id, worker_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.worker, JobWorker: DATA.jobWorker };

      // Mock:
      repository.getWorker = async () => expected;

      // Arrange:
      const job_id = DATA.job.id;
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = await service.getWorker(job_id, worker_id, options);

      // Assert:
      expect(res).toEqual(expected)
    });
  });

  describe('updateWorker', () => {
    it('should throw error when action fail', () => {
      // Before:
      repository.updateWorker = async () => { throw ACTION_ERROR; };

      // Arrange:
      const job_id = DATA.job.id;
      const worker_id = DATA.worker.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = service.updateWorker(job_id, worker_id, values, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association updated after update', async () => {
      // Before:
      repository.updateWorker = async () => ({
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
      const res = await service.updateWorker(job_id, worker_id, values, options);

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
      repository.deleteWorker = async () => { throw ACTION_ERROR; };

      // Arrange:
      const job_id = DATA.job.id;
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = service.deleteWorker(job_id, worker_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association deleted after delete', async () => {
      // Before:
      repository.deleteWorker = async () => ({
        ...DATA.jobWorker,
        updated_at: new Date('2019-10-10'),
        deleted_at: new Date('2019-10-10')
      });

      // Arrange:
      const job_id = DATA.jobWorker.job_id;
      const worker_id = DATA.jobWorker.worker_id;
      const options = {};

      // Act:
      const res = await service.deleteWorker(job_id, worker_id, options);

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
      repository.getMaterials = async () => { throw ACTION_ERROR; };

      // Arrange:
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = service.getMaterials(job_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      repository.getMaterials = async () => [ DATA.material ];

      // Arrange:
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = await service.getMaterials(job_id, options);

      // Assert:
      expect(res).toEqual([ DATA.material ]);
    });
  });

  describe('addMaterials', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.addMaterials = async () => { throw ACTION_ERROR; };

      // Arrange:
      const job_id = DATA.job.id;
      const materials = [ DATA.material.id ];

      // Act:
      const res = service.addMaterials(job_id, materials);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations after adding them', async () => {
      // Setup:
      repository.addMaterials = async () => [ DATA.jobMaterial ];

      // Arrange:
      const job_id = DATA.job.id;
      const materials = [ DATA.material.id ];

      // Act:
      const res = await service.addMaterials(job_id, materials);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty();
      expect(res).toEqual([ DATA.jobMaterial ]);
    });
  });

  describe('getMaterial', () => {
    it('should throw error when action fail', () => {
      // Mock:
      repository.getMaterial = async () => { throw ACTION_ERROR; };

      // Arrange:
      const job_id = DATA.job.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = service.getMaterial(job_id, material_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.material, JobMaterial: DATA.jobMaterial };

      // Mock:
      repository.getMaterial = async () => expected;

      // Arrange:
      const job_id = DATA.job.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = await service.getMaterial(job_id, material_id, options);

      // Assert:
      expect(res).toEqual(expected)
    });
  });

  describe('updateMaterial', () => {
    it('should throw error when action fail', () => {
      // Before:
      repository.updateMaterial = async () => { throw ACTION_ERROR; };

      // Arrange:
      const job_id = DATA.job.id;
      const material_id = DATA.material.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = service.updateMaterial(job_id, material_id, values, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association updated after update', async () => {
      // Before:
      repository.updateMaterial = async () => ({
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
      const res = await service.updateMaterial(job_id, material_id, values, options);

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
      repository.deleteMaterial = async () => { throw ACTION_ERROR; };

      // Arrange:
      const job_id = DATA.job.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = service.deleteMaterial(job_id, material_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association deleted after delete', async () => {
      // Before:
      repository.deleteMaterial = async () => ({
        ...DATA.jobMaterial,
        updated_at: new Date('2019-10-10'),
        deleted_at: new Date('2019-10-10')
      });

      // Arrange:
      const job_id = DATA.jobMaterial.job_id;
      const material_id = DATA.jobMaterial.material_id;
      const options = {};

      // Act:
      const res = await service.deleteMaterial(job_id, material_id, options);

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.job_id).toEqual(job_id);
      expect(res.material_id).toEqual(material_id);
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });
});
