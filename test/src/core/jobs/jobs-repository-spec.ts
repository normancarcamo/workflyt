import '../../../config/global';
import * as DATA from '../../../config/models';
import DATABASE from '../../../config/database';
import { ERROR_BAD_GATEWAY as ACTION_ERROR } from '../../../config/errors';
import { JobRepository } from '../../../../src/core/jobs/jobs-repository';

describe('Job Repository', () => {
  const database = { ...DATABASE() };
  const repository = JobRepository(database);

  beforeEach(async () => { database.models = DATABASE().models; });

  describe('getJobs', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Job.findAll = (async () => { throw ACTION_ERROR; }) as any;

      // Arrange:
      const options = {};

      // Act:
      const res = repository.getJobs(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of jobs', async () => {
      // Setup:
      database.models.Job.findAll = (async () => [ DATA.job ]) as any;

      // Arrange:
      const options = {};

      // Act:
      const res = await repository.getJobs(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty().toEqual([ DATA.job ]);
    });
    it('should return an empty list when records are not found', async () => {
      // Setup:
      database.models.Job.findAll = (async () => []) as any;

      // Arrange:
      const options = {};

      // Act:
      const res = await repository.getJobs(options);

      // Assert:
      expect(res).toBeArray().toBeEmpty();
    });
  });

  describe('createJob', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Job.create = (async () => { throw ACTION_ERROR; }) as any;

      // Arrange:
      const values = DATA.job;

      // Act:
      const res = repository.createJob(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return job created', async () => {
      // Setup:
      database.models.Job.create = (async () => DATA.job) as any;

      // Arrange:
      const values = DATA.job;

      // Act:
      const res = await repository.createJob(values);

      // Assert:
      expect(res).toEqual(DATA.job);
    });
  });

  describe('getJob', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Job.findByPk = (async () => { throw ACTION_ERROR; }) as any;

      // Arrange:
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = repository.getJob(job_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return null when job was not found', async () => {
      // Setup:
      database.models.Job.findByPk = (async () => null) as any;

      // Arrange:
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = await repository.getJob(job_id, options);

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and strict is set true', () => {
      // Setup:
      database.models.Job.findByPk = (async () => null) as any;

      // Arrange:
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = repository.getJob(job_id, options, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return job when is found', async () => {
      // Setup:
      database.models.Job.findByPk = (async () => DATA.job) as any;

      // Arrange:
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = await repository.getJob(job_id, options);

      // Assert:
      expect(res).toEqual(DATA.job);
    });
  });

  describe('updateJob', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Job.findByPk = (async () => ({
        update: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const job_id = DATA.job.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateJob(job_id, values, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return job updated when is found', async () => {
      // Setup:
      database.models.Job.findByPk = (async () => ({
        update: async () => ({
          extra: { enabled: true },
          updated_at: new Date()
        })
      })) as any;

      // Arrange:
      const job_id = DATA.job.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await repository.updateJob(job_id, values, options);

      // Assert:
      expect(res.extra).toEqual(values.extra);
    });
  });

  describe('deleteJob', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Job.findByPk = (async () => ({
        destroy: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = repository.deleteJob(job_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return job deleted when is found', async () => {
      // Setup:
      database.models.Job.findByPk = (async () => ({
        destroy: async () => ({
          updated_at: new Date(),
          deleted_at: new Date()
        })
      })) as any;

      // Arrange:
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = await repository.deleteJob(job_id, options);

      // Assert:
      expect(res.deleted_at).not.toBe(null);
    });
  });

  describe('getSubjobs', () => {
    it('should throw error when action fail', () => {
      // Mock:
      database.models.Job.findByPk = (async () => ({
        getSubjobs: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = repository.getSubjobs(job_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      database.models.Job.findByPk = (async () => ({
        getSubjobs: async () => [ DATA.subjob ]
      })) as any;

      // Arrange:
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = await repository.getSubjobs(job_id, options);

      // Assert:
      expect(res).toEqual([ DATA.subjob ]);
    });
    it('should return a list empty when records are not found', async () => {
      // Mock:
      database.models.Job.findByPk = (async () => ({
        getSubjobs: async () => []
      })) as any;

      // Arrange:
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = await repository.getSubjobs(job_id, options);

      // Assert:
      expect(res).toBeArray().toBeEmpty();
    });
  });

  describe('addSubjobs', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Job.findByPk = (async () => ({
        addSubjobs: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const job_id = DATA.job.id;
      const subjobs = [ DATA.subjob.id ];

      // Act:
      const res = repository.addSubjobs(job_id, subjobs);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations after adding them', async () => {
      // Setup:
      database.models.Job.findByPk = (async () => ({
        addSubjobs: async () => [ DATA.jobSubjob ]
      })) as any;

      // Arrange:
      const job_id = DATA.job.id;
      const subjobs = [ DATA.subjob.id ];

      // Act:
      const res = await repository.addSubjobs(job_id, subjobs);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty();
      expect(res).toEqual([ DATA.jobSubjob ]);
    });
  });

  describe('getSubjob', () => {
    it('should return null when subjob was not found', async () => {
      // Mock:
      database.models.Job.findByPk = (async () => ({
        getSubjobs: async () => null
      })) as any;

      // Arrange:
      const job_id = DATA.job.id;
      const subjob_id = DATA.subjob.id;
      const options = {};

      // Act:
      const res = await repository.getSubjob(job_id, subjob_id, options);

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and assert is true', () => {
      // Mock:
      database.models.Job.findByPk = (async () => ({
        getSubjobs: async () => null
      })) as any;

      // Arrange:
      const job_id = DATA.job.id;
      const subjob_id = DATA.subjob.id;
      const options = {};

      // Act:
      const res = repository.getSubjob(job_id, subjob_id, options, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Mock:
      database.models.Job.findByPk = (async () => ({
        getSubjobs: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const job_id = DATA.job.id;
      const subjob_id = DATA.subjob.id;
      const options = {};

      // Act:
      const res = repository.getSubjob(job_id, subjob_id, options, true);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.subjob, JobSubjob: DATA.jobSubjob };

      // Mock:
      database.models.Job.findByPk = (async () => ({
        getSubjobs: async () => expected
      })) as any;

      // Arrange:
      const job_id = DATA.job.id;
      const subjob_id = DATA.subjob.id;
      const options = {};

      // Act:
      const res = await repository.getSubjob(job_id, subjob_id, options, true);

      // Assert:
      expect(res).toEqual(expected)
    });
  });

  describe('updateSubjob', () => {
    it('should throw error when action fail', () => {
      // Before:
      database.models.Job.findByPk = (async () => ({
        getSubjobs: async () => ({
          JobSubjob: {
            update: async () => { throw ACTION_ERROR; }
          }
        })
      })) as any;

      // Arrange:
      const job_id = DATA.job.id;
      const subjob_id = DATA.subjob.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateSubjob(job_id, subjob_id, values, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association updated after update', async () => {
      // Before:
      database.models.Job.findByPk = (async () => ({
        getSubjobs: async () => ({
          JobSubjob: {
            update: async () => ({
              ...DATA.jobSubjob,
              extra: { enabled: true },
              updated_at: new Date('2019-10-10')
            })
          }
        })
      })) as any;

      // Arrange:
      const job_id = DATA.jobSubjob.job_id;
      const subjob_id = DATA.jobSubjob.subjob_id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await repository.updateSubjob(job_id, subjob_id, values, options);

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
      database.models.Job.findByPk = (async () => ({
        getSubjobs: async () => ({
          JobSubjob: {
            destroy: async () => { throw ACTION_ERROR; }
          }
        })
      })) as any;

      // Arrange:
      const job_id = DATA.job.id;
      const subjob_id = DATA.subjob.id;
      const options = {};

      // Act:
      const res = repository.deleteSubjob(job_id, subjob_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association deleted after delete', async () => {
      // Before:
      database.models.Job.findByPk = (async () => ({
        getSubjobs: async () => ({
          JobSubjob: {
            destroy: async () => ({
              ...DATA.jobSubjob,
              updated_at: new Date('2019-10-10'),
              deleted_at: new Date('2019-10-10')
            })
          }
        })
      })) as any;

      // Arrange:
      const job_id = DATA.jobSubjob.job_id;
      const subjob_id = DATA.jobSubjob.subjob_id;
      const options = {};

      // Act:
      const res = await repository.deleteSubjob(job_id, subjob_id, options);

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
      database.models.Job.findByPk = (async () => ({
        getWorkers: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = repository.getWorkers(job_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      database.models.Job.findByPk = (async () => ({
        getWorkers: async () => [ DATA.worker ]
      })) as any;

      // Arrange:
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = await repository.getWorkers(job_id, options);

      // Assert:
      expect(res).toEqual([ DATA.worker ]);
    });
    it('should return a list empty when records are not found', async () => {
      // Mock:
      database.models.Job.findByPk = (async () => ({
        getWorkers: async () => []
      })) as any;

      // Arrange:
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = await repository.getWorkers(job_id, options);

      // Assert:
      expect(res).toBeArray().toBeEmpty();
    });
  });

  describe('addWorkers', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Job.findByPk = (async () => ({
        addWorkers: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const job_id = DATA.job.id;
      const workers = [ DATA.worker.id ];

      // Act:
      const res = repository.addWorkers(job_id, workers);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations after adding them', async () => {
      // Setup:
      database.models.Job.findByPk = (async () => ({
        addWorkers: async () => [ DATA.jobWorker ]
      })) as any;

      // Arrange:
      const job_id = DATA.job.id;
      const workers = [ DATA.worker.id ];

      // Act:
      const res = await repository.addWorkers(job_id, workers);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty();
      expect(res).toEqual([ DATA.jobWorker ]);
    });
  });

  describe('getWorker', () => {
    it('should return null when worker was not found', async () => {
      // Mock:
      database.models.Job.findByPk = (async () => ({
        getWorkers: async () => null
      })) as any;

      // Arrange:
      const job_id = DATA.job.id;
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = await repository.getWorker(job_id, worker_id, options);

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and assert is true', () => {
      // Mock:
      database.models.Job.findByPk = (async () => ({
        getWorkers: async () => null
      })) as any;

      // Arrange:
      const job_id = DATA.job.id;
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = repository.getWorker(job_id, worker_id, options, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Mock:
      database.models.Job.findByPk = (async () => ({
        getWorkers: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const job_id = DATA.job.id;
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = repository.getWorker(job_id, worker_id, options, true);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.worker, JobWorker: DATA.jobWorker };

      // Mock:
      database.models.Job.findByPk = (async () => ({
        getWorkers: async () => expected
      })) as any;

      // Arrange:
      const job_id = DATA.job.id;
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = await repository.getWorker(job_id, worker_id, options, true);

      // Assert:
      expect(res).toEqual(expected)
    });
  });

  describe('updateWorker', () => {
    it('should throw error when action fail', () => {
      // Before:
      database.models.Job.findByPk = (async () => ({
        getWorkers: async () => ({
          JobWorker: {
            update: async () => { throw ACTION_ERROR; }
          }
        })
      })) as any;

      // Arrange:
      const job_id = DATA.job.id;
      const worker_id = DATA.worker.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateWorker(job_id, worker_id, values, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association updated after update', async () => {
      // Before:
      database.models.Job.findByPk = (async () => ({
        getWorkers: async () => ({
          JobWorker: {
            update: async () => ({
              ...DATA.jobWorker,
              extra: { enabled: true },
              updated_at: new Date('2019-10-10')
            })
          }
        })
      })) as any;

      // Arrange:
      const job_id = DATA.jobWorker.job_id;
      const worker_id = DATA.jobWorker.worker_id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await repository.updateWorker(job_id, worker_id, values, options);

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
      database.models.Job.findByPk = (async () => ({
        getWorkers: async () => ({
          JobWorker: {
            destroy: async () => { throw ACTION_ERROR; }
          }
        })
      })) as any;

      // Arrange:
      const job_id = DATA.job.id;
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = repository.deleteWorker(job_id, worker_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association deleted after delete', async () => {
      // Before:
      database.models.Job.findByPk = (async () => ({
        getWorkers: async () => ({
          JobWorker: {
            destroy: async () => ({
              ...DATA.jobWorker,
              updated_at: new Date('2019-10-10'),
              deleted_at: new Date('2019-10-10')
            })
          }
        })
      })) as any;

      // Arrange:
      const job_id = DATA.jobWorker.job_id;
      const worker_id = DATA.jobWorker.worker_id;
      const options = {};

      // Act:
      const res = await repository.deleteWorker(job_id, worker_id, options);

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
      database.models.Job.findByPk = (async () => ({
        getMaterials: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = repository.getMaterials(job_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      database.models.Job.findByPk = (async () => ({
        getMaterials: async () => [ DATA.material ]
      })) as any;

      // Arrange:
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = await repository.getMaterials(job_id, options);

      // Assert:
      expect(res).toEqual([ DATA.material ]);
    });
    it('should return a list empty when records are not found', async () => {
      // Mock:
      database.models.Job.findByPk = (async () => ({
        getMaterials: async () => []
      })) as any;

      // Arrange:
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = await repository.getMaterials(job_id, options);

      // Assert:
      expect(res).toBeArray().toBeEmpty();
    });
  });

  describe('addMaterials', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Job.findByPk = (async () => ({
        addMaterials: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const job_id = DATA.job.id;
      const materials = [ DATA.material.id ];

      // Act:
      const res = repository.addMaterials(job_id, materials);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations after adding them', async () => {
      // Setup:
      database.models.Job.findByPk = (async () => ({
        addMaterials: async () => [ DATA.jobMaterial ]
      })) as any;

      // Arrange:
      const job_id = DATA.job.id;
      const materials = [ DATA.material.id ];

      // Act:
      const res = await repository.addMaterials(job_id, materials);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty();
      expect(res).toEqual([ DATA.jobMaterial ]);
    });
  });

  describe('getMaterial', () => {
    it('should return null when material was not found', async () => {
      // Mock:
      database.models.Job.findByPk = (async () => ({
        getMaterials: async () => null
      })) as any;

      // Arrange:
      const job_id = DATA.job.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = await repository.getMaterial(job_id, material_id, options);

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and assert is true', () => {
      // Mock:
      database.models.Job.findByPk = (async () => ({
        getMaterials: async () => null
      })) as any;

      // Arrange:
      const job_id = DATA.job.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = repository.getMaterial(job_id, material_id, options, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Mock:
      database.models.Job.findByPk = (async () => ({
        getMaterials: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const job_id = DATA.job.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = repository.getMaterial(job_id, material_id, options, true);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.material, JobMaterial: DATA.jobMaterial };

      // Mock:
      database.models.Job.findByPk = (async () => ({
        getMaterials: async () => expected
      })) as any;

      // Arrange:
      const job_id = DATA.job.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = await repository.getMaterial(job_id, material_id, options, true);

      // Assert:
      expect(res).toEqual(expected)
    });
  });

  describe('updateMaterial', () => {
    it('should throw error when action fail', () => {
      // Before:
      database.models.Job.findByPk = (async () => ({
        getMaterials: async () => ({
          JobMaterial: {
            update: async () => { throw ACTION_ERROR; }
          }
        })
      })) as any;

      // Arrange:
      const job_id = DATA.job.id;
      const material_id = DATA.material.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateMaterial(job_id, material_id, values, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association updated after update', async () => {
      // Before:
      database.models.Job.findByPk = (async () => ({
        getMaterials: async () => ({
          JobMaterial: {
            update: async () => ({
              ...DATA.jobMaterial,
              extra: { enabled: true },
              updated_at: new Date('2019-10-10')
            })
          }
        })
      })) as any;

      // Arrange:
      const job_id = DATA.jobMaterial.job_id;
      const material_id = DATA.jobMaterial.material_id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await repository.updateMaterial(job_id, material_id, values, options);

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
      database.models.Job.findByPk = (async () => ({
        getMaterials: async () => ({
          JobMaterial: {
            destroy: async () => { throw ACTION_ERROR; }
          }
        })
      })) as any;

      // Arrange:
      const job_id = DATA.job.id;
      const material_id = DATA.material.id;
      const options = {};

      // Act:
      const res = repository.deleteMaterial(job_id, material_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association deleted after delete', async () => {
      // Before:
      database.models.Job.findByPk = (async () => ({
        getMaterials: async () => ({
          JobMaterial: {
            destroy: async () => ({
              ...DATA.jobMaterial,
              updated_at: new Date('2019-10-10'),
              deleted_at: new Date('2019-10-10')
            })
          }
        })
      })) as any;

      // Arrange:
      const job_id = DATA.jobMaterial.job_id;
      const material_id = DATA.jobMaterial.material_id;
      const options = {};

      // Act:
      const res = await repository.deleteMaterial(job_id, material_id, options);

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.job_id).toEqual(job_id);
      expect(res.material_id).toEqual(material_id);
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });
});
