import '../../../config/global';
import * as DATA from '../../../config/models';
import DATABASE from '../../../config/database';
import { ERROR_BAD_GATEWAY as ACTION_ERROR } from '../../../config/errors';
import { WorkerRepository } from '../../../../src/core/workers/workers-repository';

describe('Worker Repository', () => {
  const database = { ...DATABASE() };
  const repository = WorkerRepository(database);

  beforeEach(async () => { database.models = DATABASE().models; });

  describe('getWorkers', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Worker.findAll = (async () => { throw ACTION_ERROR; }) as any;

      // Arrange:
      const options = {};

      // Act:
      const res = repository.getWorkers(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of workers', async () => {
      // Setup:
      database.models.Worker.findAll = (async () => [ DATA.worker ]) as any;

      // Arrange:
      const options = {};

      // Act:
      const res = await repository.getWorkers(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty().toEqual([ DATA.worker ]);
    });
    it('should return an empty list when records are not found', async () => {
      // Setup:
      database.models.Worker.findAll = (async () => []) as any;

      // Arrange:
      const options = {};

      // Act:
      const res = await repository.getWorkers(options);

      // Assert:
      expect(res).toBeArray().toBeEmpty();
    });
  });

  describe('createWorker', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Worker.create = (async () => { throw ACTION_ERROR; }) as any;

      // Arrange:
      const values = DATA.worker;

      // Act:
      const res = repository.createWorker(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return worker created', async () => {
      // Setup:
      database.models.Worker.create = (async () => DATA.worker) as any;

      // Arrange:
      const values = DATA.worker;

      // Act:
      const res = await repository.createWorker(values);

      // Assert:
      expect(res).toEqual(DATA.worker);
    });
  });

  describe('getWorker', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Worker.findByPk = (async () => { throw ACTION_ERROR; }) as any;

      // Arrange:
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = repository.getWorker(worker_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return null when worker was not found', async () => {
      // Setup:
      database.models.Worker.findByPk = (async () => null) as any;
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = await repository.getWorker(worker_id, options);

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and strict is set true', () => {
      // Setup:
      database.models.Worker.findByPk = (async () => null) as any;

      // Arrange:
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = repository.getWorker(worker_id, options, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return worker when is found', async () => {
      // Setup:
      database.models.Worker.findByPk = (async () => DATA.worker) as any;

      // Arrange:
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = await repository.getWorker(worker_id, options);

      // Assert:
      expect(res).toEqual(DATA.worker);
    });
  });

  describe('updateWorker', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Worker.findByPk = (async () => ({
        update: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const worker_id = DATA.worker.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateWorker(worker_id, values, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return worker updated when is found', async () => {
      // Setup:
      database.models.Worker.findByPk = (async () => ({
        update: async () => ({
          extra: { enabled: true },
          updated_at: new Date()
        })
      })) as any;

      // Arrange:
      const worker_id = DATA.worker.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await repository.updateWorker(worker_id, values, options);

      // Assert:
      expect(res.extra).toEqual(values.extra);
    });
  });

  describe('deleteWorker', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Worker.findByPk = (async () => ({
        destroy: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = repository.deleteWorker(worker_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return worker deleted when is found', async () => {
      // Setup:
      database.models.Worker.findByPk = (async () => ({
        destroy: async () => ({
          updated_at: new Date(),
          deleted_at: new Date()
        })
      })) as any;

      // Arrange:
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = await repository.deleteWorker(worker_id, options);

      // Assert:
      expect(res.deleted_at).not.toBe(null);
    });
  });

  describe('getSupervisors', () => {
    it('should throw error when action fail', () => {
      // Mock:
      database.models.Worker.findByPk = (async () => ({
        getSupervisors: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = repository.getSupervisors(worker_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      database.models.Worker.findByPk = (async () => ({
        getSupervisors: async () => [ DATA.supervisor ]
      })) as any;

      // Arrange:
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = await repository.getSupervisors(worker_id, options);

      // Assert:
      expect(res).toEqual([ DATA.supervisor ]);
    });
    it('should return a list empty when records are not found', async () => {
      // Mock:
      database.models.Worker.findByPk = (async () => ({
        getSupervisors: async () => []
      })) as any;

      // Arrange:
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = await repository.getSupervisors(worker_id, options);

      // Assert:
      expect(res).toBeArray().toBeEmpty();
    });
  });

  describe('addSupervisors', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Worker.findByPk = (async () => ({
        addSupervisors: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const worker_id = DATA.worker.id;
      const supervisors = [ DATA.supervisor.id ];

      // Act:
      const res = repository.addSupervisors(worker_id, supervisors);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations after adding them', async () => {
      // Setup:
      database.models.Worker.findByPk = (async () => ({
        addSupervisors: async () => [ DATA.workerSupervisor ]
      })) as any;

      // Arrange:
      const worker_id:string = DATA.worker.id;
      const supervisors:string[] = [ DATA.supervisor.id ];

      // Act:
      const res = await repository.addSupervisors(worker_id, supervisors);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty();
      expect(res).toEqual([ DATA.workerSupervisor ]);
    });
  });

  describe('getSupervisor', () => {
    it('should return null when supervisor was not found', async () => {
      // Mock:
      database.models.Worker.findByPk = (async () => ({
        getSupervisors: async () => null
      })) as any;

      // Arrange:
      const worker_id = DATA.worker.id;
      const supervisor_id = DATA.supervisor.id;
      const options = {};

      // Act:
      const res = await repository.getSupervisor(worker_id, supervisor_id, options);

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and assert is true', () => {
      // Mock:
      database.models.Worker.findByPk = (async () => ({
        getSupervisors: async () => null
      })) as any;

      // Arrange:
      const worker_id = DATA.worker.id;
      const supervisor_id = DATA.supervisor.id;
      const options = {};

      // Act:
      const res = repository.getSupervisor(worker_id, supervisor_id, options, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Mock:
      database.models.Worker.findByPk = (async () => ({
        getSupervisors: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const worker_id = DATA.worker.id;
      const supervisor_id = DATA.supervisor.id;
      const options = {};

      // Act:
      const res = repository.getSupervisor(worker_id, supervisor_id, options, true);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      // Arrange:
      const expected = { ...DATA.supervisor, WorkerSupervisor: DATA.workerSupervisor };
      database.models.Worker.findByPk = (async () => ({
        getSupervisors: async () => expected
      })) as any;
      const worker_id = DATA.worker.id;
      const supervisor_id = DATA.supervisor.id;
      const options = {};

      // Act:
      const res = await repository.getSupervisor(worker_id, supervisor_id, options, true);

      // Assert:
      expect(res).toEqual(expected);
    });
  });

  describe('updateSupervisor', () => {
    it('should throw error when action fail', () => {
      // Before:
      database.models.Worker.findByPk = (async () => ({
        getSupervisors: async () => ({
          WorkerSupervisor: {
            update: async () => { throw ACTION_ERROR; }
          }
        })
      })) as any;

      // Arrange:
      const worker_id = DATA.worker.id;
      const supervisor_id = DATA.supervisor.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateSupervisor(worker_id, supervisor_id, values, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association updated after update', async () => {
      // Before:
      database.models.Worker.findByPk = (async () => ({
        getSupervisors: async () => ({
          WorkerSupervisor: {
            update: async () => ({
              ...DATA.workerSupervisor,
              extra: { enabled: true },
              updated_at: new Date('2019-10-10')
            })
          }
        })
      })) as any;

      // Arrange:
      const worker_id = DATA.workerSupervisor.worker_id;
      const supervisor_id = DATA.workerSupervisor.supervisor_id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await repository.updateSupervisor(worker_id, supervisor_id, values, options);

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.worker_id).toEqual(worker_id);
      expect(res.supervisor_id).toEqual(supervisor_id);
      expect(res.extra).toEqual({ enabled: true });
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('deleteSupervisor', () => {
    it('should throw error when action fail', () => {
      // Arrange:
      database.models.Worker.findByPk = (async () => ({
        getSupervisors: async () => ({
          WorkerSupervisor: {
            destroy: async () => { throw ACTION_ERROR; }
          }
        })
      })) as any;
      const worker_id = DATA.worker.id;
      const supervisor_id = DATA.supervisor.id;
      const options = {};

      // Act:
      const res = repository.deleteSupervisor(worker_id, supervisor_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association deleted after delete', async () => {
      // Arrange:
      database.models.Worker.findByPk = (async () => ({
        getSupervisors: async () => ({
          WorkerSupervisor: {
            destroy: async () => ({
              ...DATA.workerSupervisor,
              updated_at: new Date('2019-10-10'),
              deleted_at: new Date('2019-10-10')
            })
          }
        })
      })) as any;
      const worker_id = DATA.workerSupervisor.worker_id;
      const supervisor_id = DATA.workerSupervisor.supervisor_id;
      const options = {};

      // Act:
      const res = await repository.deleteSupervisor(worker_id, supervisor_id, options);

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.worker_id).toEqual(worker_id);
      expect(res.supervisor_id).toEqual(supervisor_id);
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('getJobs', () => {
    it('should throw error when action fail', () => {
      // Mock:
      database.models.Worker.findByPk = (async () => ({
        getJobs: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = repository.getJobs(worker_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      database.models.Worker.findByPk = (async () => ({
        getJobs: async () => [ DATA.job ]
      })) as any;

      // Arrange:
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = await repository.getJobs(worker_id, options);

      // Assert:
      expect(res).toEqual([ DATA.job ]);
    });
    it('should return a list empty when records are not found', async () => {
      // Arrange:
      database.models.Worker.findByPk = (async () => ({
        getJobs: async () => []
      })) as any;
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = await repository.getJobs(worker_id, options);

      // Assert:
      expect(res).toBeArray().toBeEmpty();
    });
  });

  describe('addJobs', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Worker.findByPk = (async () => ({
        addJobs: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const worker_id:string = DATA.worker.id;
      const jobs:string[] = [ DATA.job.id ];

      // Act:
      const res = repository.addJobs(worker_id, jobs);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations after adding them', async () => {
      // Arrange:
      database.models.Worker.findByPk = (async () => ({
        addJobs: async () => [ DATA.jobWorker ]
      })) as any;
      const worker_id:string = DATA.worker.id;
      const jobs:string[] = [ DATA.job.id ];

      // Act:
      const res = await repository.addJobs(worker_id, jobs);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty();
      expect(res).toEqual([ DATA.jobWorker ]);
    });
  });

  describe('getJob', () => {
    it('should return null when job was not found', async () => {
      // Arrange:
      database.models.Worker.findByPk = (async () => ({
        getJobs: async () => null
      })) as any;
      const worker_id = DATA.worker.id;
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = await repository.getJob(worker_id, job_id, options);

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and assert is true', () => {
      // Arrange:
      database.models.Worker.findByPk = (async () => ({
        getJobs: async () => null
      })) as any;
      const worker_id = DATA.worker.id;
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = repository.getJob(worker_id, job_id, options, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Arrange:
      database.models.Worker.findByPk = (async () => ({
        getJobs: async () => { throw ACTION_ERROR; }
      })) as any;
      const worker_id = DATA.worker.id;
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = repository.getJob(worker_id, job_id, options, true);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      // Arrange:
      const expected = { ...DATA.job, WorkerJob: DATA.jobWorker };
      database.models.Worker.findByPk = (async () => ({
        getJobs: async () => expected
      })) as any;
      const worker_id = DATA.worker.id;
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = await repository.getJob(worker_id, job_id, options, true);

      // Assert:
      expect(res).toEqual(expected);
    });
  });

  describe('updateJob', () => {
    it('should throw error when action fail', () => {
      // Arrange:
      database.models.Worker.findByPk = (async () => ({
        getJobs: async () => ({
          JobWorker: {
            update: async () => { throw ACTION_ERROR; }
          }
        })
      })) as any;
      const worker_id = DATA.worker.id;
      const job_id = DATA.job.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateJob(worker_id, job_id, values, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association updated after update', async () => {
      // Arrange:
      database.models.Worker.findByPk = (async () => ({
        getJobs: async () => ({
          JobWorker: {
            update: async () => ({
              ...DATA.jobWorker,
              extra: { enabled: true },
              updated_at: new Date('2019-10-10')
            })
          }
        })
      })) as any;
      const worker_id = DATA.jobWorker.worker_id;
      const job_id = DATA.jobWorker.job_id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await repository.updateJob(worker_id, job_id, values, options);

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.worker_id).toEqual(worker_id);
      expect(res.job_id).toEqual(job_id);
      expect(res.extra).toEqual({ enabled: true });
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('deleteJob', () => {
    it('should throw error when action fail', () => {
      // Arrange:
      database.models.Worker.findByPk = (async () => ({
        getJobs: async () => ({
          JobWorker: {
            destroy: async () => { throw ACTION_ERROR; }
          }
        })
      })) as any;
      const worker_id = DATA.worker.id;
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = repository.deleteJob(worker_id, job_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association deleted after delete', async () => {
      // Arrange:
      database.models.Worker.findByPk = (async () => ({
        getJobs: async () => ({
          JobWorker: {
            destroy: async () => ({
              ...DATA.jobWorker,
              updated_at: new Date('2019-10-10'),
              deleted_at: new Date('2019-10-10')
            })
          }
        })
      })) as any;
      const worker_id = DATA.jobWorker.worker_id;
      const job_id = DATA.jobWorker.job_id;
      const options = {};

      // Act:
      const res = await repository.deleteJob(worker_id, job_id, options);

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.worker_id).toEqual(worker_id);
      expect(res.job_id).toEqual(job_id);
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('getQuotes', () => {
    it('should throw error when action fail', () => {
      // Arrange:
      database.models.Worker.findByPk = (async () => ({
        getQuotes: async () => { throw ACTION_ERROR; }
      })) as any;
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = repository.getQuotes(worker_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Arrange:
      database.models.Worker.findByPk = (async () => ({
        getQuotes: async () => [ DATA.quote ]
      })) as any;
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = await repository.getQuotes(worker_id, options);

      // Assert:
      expect(res).toEqual([ DATA.quote ]);
    });
    it('should return a list empty when records are not found', async () => {
      // Arrange:
      database.models.Worker.findByPk = (async () => ({
        getQuotes: async () => []
      })) as any;
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = await repository.getQuotes(worker_id, options);

      // Assert:
      expect(res).toBeArray().toBeEmpty();
    });
  });

  describe('getQuote', () => {
    it('should return null when quote was not found', async () => {
      // Arrange:
      database.models.Worker.findByPk = (async () => ({
        getQuotes: async () => null
      })) as any;
      const worker_id = DATA.worker.id;
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = await repository.getQuote(worker_id, quote_id, options);

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and assert is true', () => {
      // Arrange:
      database.models.Worker.findByPk = (async () => ({
        getQuotes: async () => null
      })) as any;
      const worker_id = DATA.worker.id;
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = repository.getQuote(worker_id, quote_id, options, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Arrange:
      database.models.Worker.findByPk = (async () => ({
        getQuotes: async () => { throw ACTION_ERROR; }
      })) as any;
      const worker_id = DATA.worker.id;
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = repository.getQuote(worker_id, quote_id, options, true);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      // Arrange:
      const expected = { ...DATA.quote };
      database.models.Worker.findByPk = (async () => ({
        getQuotes: async () => expected
      })) as any;
      const worker_id = DATA.worker.id;
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = await repository.getQuote(worker_id, quote_id, options, true);

      // Assert:
      expect(res).toEqual(expected);
    });
  });

  describe('getUser', () => {
    it('should return null when user was not found', async () => {
      // Arrange:
      database.models.Worker.findByPk = (async () => ({
        getUser: async () => null
      })) as any;
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = await repository.getUser(worker_id, options);

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and assert is true', () => {
      // Arrange:
      database.models.Worker.findByPk = (async () => ({
        getUser: async () => null
      })) as any;
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = repository.getUser(worker_id, options, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Arrange:
      database.models.Worker.findByPk = (async () => ({
        getUser: async () => { throw ACTION_ERROR; }
      })) as any;
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = repository.getUser(worker_id, options, true);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      // Arrange:
      const expected = { ...DATA.user };
      database.models.Worker.findByPk = (async () => ({
        getUser: async () => expected
      })) as any;
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = await repository.getUser(worker_id, options, true);

      // Assert:
      expect(res).toEqual(expected);
    });
  });
});
