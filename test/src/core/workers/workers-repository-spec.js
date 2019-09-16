const Repository = require('src/core/workers/workers-repository');
const ACTION_ERROR = require('test/config/errors').ERROR_BAD_GATEWAY;
const DATA = require('test/config/models');
const DATABASE = require('test/config/database');

describe('Worker Repository', () => {
  const database = { ...DATABASE };
  const repository = Repository({ database });

  beforeEach(async () => { database.models = DATABASE.models; });

  describe('getWorkers', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Worker, 'findAll').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const options = {};

      // Act:
      const res = repository.getWorkers(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of workers', async () => {
      // Setup:
      jest.spyOn(database.models.Worker, 'findAll')
        .mockResolvedValue([ DATA.worker ]);

      // Arrange:
      const options = {};

      // Act:
      const res = await repository.getWorkers(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty().toEqual([ DATA.worker ]);
    });
    it('should return an empty list when records are not found', async () => {
      // Setup:
      jest.spyOn(database.models.Worker, 'findAll').mockResolvedValue([]);

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
      jest.spyOn(database.models.Worker, 'create').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const values = DATA.worker;

      // Act:
      const res = repository.createWorker(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return worker created', async () => {
      // Setup:
      jest.spyOn(database.models.Worker, 'create')
        .mockResolvedValue(DATA.worker);

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
      jest.spyOn(database.models.Worker, 'findByPk').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = repository.getWorker({ worker_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return null when worker was not found', async () => {
      // Setup:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = await repository.getWorker({ worker_id, options });

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and strict is set true', () => {
      // Setup:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = repository.getWorker({ worker_id, options }, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return worker when is found', async () => {
      // Setup:
      jest.spyOn(database.models.Worker, 'findByPk')
        .mockResolvedValue(DATA.worker);

      // Arrange:
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = await repository.getWorker({ worker_id, options });

      // Assert:
      expect(res).toEqual(DATA.worker);
    });
  });

  describe('updateWorker', () => {
    it('should throw error when worker was not found', () => {
      // Setup:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const worker_id = DATA.worker.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateWorker({ worker_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue({
        update: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const worker_id = DATA.worker.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateWorker({ worker_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return worker updated when is found', async () => {
      // Setup:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue({
        update: jest.fn().mockResolvedValue({
          extra: { enabled: true },
          updated_at: new Date()
        })
      });

      // Arrange:
      const worker_id = DATA.worker.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await repository.updateWorker({ worker_id, values, options });

      // Assert:
      expect(res.extra).toEqual(values.extra);
    });
  });

  describe('deleteWorker', () => {
    it('should throw error when worker was not found', () => {
      // Setup:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = repository.deleteWorker({ worker_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue({
        destroy: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = repository.deleteWorker({ worker_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return worker deleted when is found', async () => {
      // Setup:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue({
        destroy: jest.fn().mockResolvedValue({
          updated_at: new Date(),
          deleted_at: new Date()
        })
      });

      // Arrange:
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = await repository.deleteWorker({ worker_id, options });

      // Assert:
      expect(res.deleted_at).not.toBe(null);
    });
  });

  describe('getSupervisors', () => {
    it('should throw error when worker was not found', () => {
      // Setup:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = repository.getSupervisors({ worker_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue({
        getSupervisors: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = repository.getSupervisors({ worker_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue({
        getSupervisors: jest.fn().mockResolvedValue([ DATA.supervisor ])
      });

      // Arrange:
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = await repository.getSupervisors({ worker_id, options });

      // Assert:
      expect(res).toEqual([ DATA.supervisor ]);
    });
    it('should return a list empty when records are not found', async () => {
      // Mock:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue({
        getSupervisors: jest.fn().mockResolvedValue([])
      });

      // Arrange:
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = await repository.getSupervisors({ worker_id, options });

      // Assert:
      expect(res).toBeArray().toBeEmpty();
    });
  });

  describe('addSupervisors', () => {
    it('should throw error when worker was not found', () => {
      // Setup:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const worker_id = DATA.worker.id;
      const supervisors = [ DATA.supervisor.id ];

      // Act:
      const res = repository.addSupervisors({ worker_id, supervisors });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue({
        addSupervisors: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const options = { worker_id: DATA.worker.id, supervisors: [ DATA.supervisor.id ] };

      // Act:
      const res = repository.addSupervisors(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations after adding them', async () => {
      // Setup:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue({
        addSupervisors: jest.fn().mockResolvedValue([ DATA.workerSupervisor ])
      });

      // Arrange:
      const options = { worker_id: DATA.worker.id, supervisors: [ DATA.supervisor.id ] };

      // Act:
      const res = await repository.addSupervisors(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty();
      expect(res).toEqual([ DATA.workerSupervisor ]);
    });
  });

  describe('getSupervisor', () => {
    it('should throw error when worker was not found', () => {
      // Setup:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const worker_id = DATA.worker.id;
      const supervisor_id = DATA.supervisor.id;
      const options = {};

      // Act:
      const res = repository.getSupervisor({ worker_id, supervisor_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return null when supervisor was not found', async () => {
      // Mock:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue({
        getSupervisors: jest.fn().mockResolvedValue(null)
      });

      // Arrange:
      const worker_id = DATA.worker.id;
      const supervisor_id = DATA.supervisor.id;
      const options = {};

      // Act:
      const res = await repository.getSupervisor({ worker_id, supervisor_id, options });

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and assert is true', () => {
      // Mock:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue({
        getSupervisors: jest.fn().mockResolvedValue(null)
      });

      // Arrange:
      const worker_id = DATA.worker.id;
      const supervisor_id = DATA.supervisor.id;
      const options = {};

      // Act:
      const res = repository.getSupervisor({ worker_id, supervisor_id, options }, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue({
        getSupervisors: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const worker_id = DATA.worker.id;
      const supervisor_id = DATA.supervisor.id;
      const options = {};

      // Act:
      const res = repository.getSupervisor({ worker_id, supervisor_id, options }, true);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.supervisor, WorkerSupervisor: DATA.workerSupervisor };

      // Mock:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue({
        getSupervisors: jest.fn().mockResolvedValue(expected)
      });

      // Arrange:
      const worker_id = DATA.worker.id;
      const supervisor_id = DATA.supervisor.id;
      const options = {};

      // Act:
      const res = await repository.getSupervisor({ worker_id, supervisor_id, options }, true);

      // Assert:
      expect(res).toEqual(expected)
    });
  });

  describe('updateSupervisor', () => {
    it('should throw error when worker was not found', () => {
      // Before:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const worker_id = DATA.worker.id;
      const supervisor_id = DATA.supervisor.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateSupervisor({ worker_id, supervisor_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return null when supervisor was not found', () => {
      // Before:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue({
        getSupervisors: jest.fn().mockResolvedValue(null)
      });

      // Arrange:
      const worker_id = DATA.worker.id;
      const supervisor_id = DATA.supervisor.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateSupervisor({ worker_id, supervisor_id, values, options });

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Before:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue({
        getSupervisors: jest.fn().mockResolvedValue({
          WorkerSupervisor: {
            update: jest.fn().mockRejectedValue(ACTION_ERROR)
          }
        })
      });

      // Arrange:
      const worker_id = DATA.worker.id;
      const supervisor_id = DATA.supervisor.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateSupervisor({ worker_id, supervisor_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association updated after update', async () => {
      // Before:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue({
        getSupervisors: jest.fn().mockResolvedValue({
          WorkerSupervisor: {
            update: jest.fn().mockResolvedValue({
              ...DATA.workerSupervisor,
              extra: { enabled: true },
              updated_at: new Date('2019-10-10')
            })
          }
        })
      });

      // Arrange:
      const worker_id = DATA.workerSupervisor.worker_id;
      const supervisor_id = DATA.workerSupervisor.supervisor_id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await repository.updateSupervisor({ worker_id, supervisor_id, values, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.worker_id).toEqual(worker_id);
      expect(res.supervisor_id).toEqual(supervisor_id);
      expect(res.extra).toEqual({ enabled: true });
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('deleteSupervisor', () => {
    it('should throw error when worker was not found', () => {
      // Before:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const worker_id = DATA.worker.id;
      const supervisor_id = DATA.supervisor.id;
      const options = {};

      // Act:
      const res = repository.deleteSupervisor({ worker_id, supervisor_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return null when supervisor was not found', () => {
      // Before:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue({
        getSupervisors: jest.fn().mockResolvedValue(null)
      });

      // Arrange:
      const worker_id = DATA.worker.id;
      const supervisor_id = DATA.supervisor.id;
      const options = {};

      // Act:
      const res = repository.deleteSupervisor({ worker_id, supervisor_id, options });

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Before:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue({
        getSupervisors: jest.fn().mockResolvedValue({
          WorkerSupervisor: {
            destroy: jest.fn().mockRejectedValue(ACTION_ERROR)
          }
        })
      });

      // Arrange:
      const worker_id = DATA.worker.id;
      const supervisor_id = DATA.supervisor.id;
      const options = {};

      // Act:
      const res = repository.deleteSupervisor({ worker_id, supervisor_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association deleted after delete', async () => {
      // Before:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue({
        getSupervisors: jest.fn().mockResolvedValue({
          WorkerSupervisor: {
            destroy: jest.fn().mockResolvedValue({
              ...DATA.workerSupervisor,
              updated_at: new Date('2019-10-10'),
              deleted_at: new Date('2019-10-10')
            })
          }
        })
      });

      // Arrange:
      const worker_id = DATA.workerSupervisor.worker_id;
      const supervisor_id = DATA.workerSupervisor.supervisor_id;
      const options = {};

      // Act:
      const res = await repository.deleteSupervisor({ worker_id, supervisor_id, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.worker_id).toEqual(worker_id);
      expect(res.supervisor_id).toEqual(supervisor_id);
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('getJobs', () => {
    it('should throw error when worker was not found', () => {
      // Setup:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = repository.getJobs({ worker_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue({
        getJobs: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = repository.getJobs({ worker_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue({
        getJobs: jest.fn().mockResolvedValue([ DATA.job ])
      });

      // Arrange:
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = await repository.getJobs({ worker_id, options });

      // Assert:
      expect(res).toEqual([ DATA.job ]);
    });
    it('should return a list empty when records are not found', async () => {
      // Mock:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue({
        getJobs: jest.fn().mockResolvedValue([])
      });

      // Arrange:
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = await repository.getJobs({ worker_id, options });

      // Assert:
      expect(res).toBeArray().toBeEmpty();
    });
  });

  describe('addJobs', () => {
    it('should throw error when worker was not found', () => {
      // Setup:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const worker_id = DATA.worker.id;
      const jobs = [ DATA.job.id ];

      // Act:
      const res = repository.addJobs({ worker_id, jobs });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue({
        addJobs: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const options = { worker_id: DATA.worker.id, jobs: [ DATA.job.id ] };

      // Act:
      const res = repository.addJobs(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations after adding them', async () => {
      // Setup:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue({
        addJobs: jest.fn().mockResolvedValue([ DATA.jobWorker ])
      });

      // Arrange:
      const options = { worker_id: DATA.worker.id, jobs: [ DATA.job.id ] };

      // Act:
      const res = await repository.addJobs(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty();
      expect(res).toEqual([ DATA.jobWorker ]);
    });
  });

  describe('getJob', () => {
    it('should throw error when worker was not found', () => {
      // Setup:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const worker_id = DATA.worker.id;
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = repository.getJob({ worker_id, job_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return null when job was not found', async () => {
      // Mock:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue({
        getJobs: jest.fn().mockResolvedValue(null)
      });

      // Arrange:
      const worker_id = DATA.worker.id;
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = await repository.getJob({ worker_id, job_id, options });

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and assert is true', () => {
      // Mock:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue({
        getJobs: jest.fn().mockResolvedValue(null)
      });

      // Arrange:
      const worker_id = DATA.worker.id;
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = repository.getJob({ worker_id, job_id, options }, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue({
        getJobs: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const worker_id = DATA.worker.id;
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = repository.getJob({ worker_id, job_id, options }, true);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.job, WorkerJob: DATA.jobWorker };

      // Mock:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue({
        getJobs: jest.fn().mockResolvedValue(expected)
      });

      // Arrange:
      const worker_id = DATA.worker.id;
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = await repository.getJob({ worker_id, job_id, options }, true);

      // Assert:
      expect(res).toEqual(expected)
    });
  });

  describe('updateJob', () => {
    it('should throw error when worker was not found', () => {
      // Before:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const worker_id = DATA.worker.id;
      const job_id = DATA.job.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateJob({ worker_id, job_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return null when job was not found', () => {
      // Before:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue({
        getJobs: jest.fn().mockResolvedValue(null)
      });

      // Arrange:
      const worker_id = DATA.worker.id;
      const job_id = DATA.job.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateJob({ worker_id, job_id, values, options });

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Before:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue({
        getJobs: jest.fn().mockResolvedValue({
          JobWorker: {
            update: jest.fn().mockRejectedValue(ACTION_ERROR)
          }
        })
      });

      // Arrange:
      const worker_id = DATA.worker.id;
      const job_id = DATA.job.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateJob({ worker_id, job_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association updated after update', async () => {
      // Before:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue({
        getJobs: jest.fn().mockResolvedValue({
          JobWorker: {
            update: jest.fn().mockResolvedValue({
              ...DATA.jobWorker,
              extra: { enabled: true },
              updated_at: new Date('2019-10-10')
            })
          }
        })
      });

      // Arrange:
      const worker_id = DATA.jobWorker.worker_id;
      const job_id = DATA.jobWorker.job_id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await repository.updateJob({ worker_id, job_id, values, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.worker_id).toEqual(worker_id);
      expect(res.job_id).toEqual(job_id);
      expect(res.extra).toEqual({ enabled: true });
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('deleteJob', () => {
    it('should throw error when worker was not found', () => {
      // Before:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const worker_id = DATA.worker.id;
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = repository.deleteJob({ worker_id, job_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return null when job was not found', () => {
      // Before:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue({
        getJobs: jest.fn().mockResolvedValue(null)
      });

      // Arrange:
      const worker_id = DATA.worker.id;
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = repository.deleteJob({ worker_id, job_id, options });

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Before:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue({
        getJobs: jest.fn().mockResolvedValue({
          JobWorker: {
            destroy: jest.fn().mockRejectedValue(ACTION_ERROR)
          }
        })
      });

      // Arrange:
      const worker_id = DATA.worker.id;
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = repository.deleteJob({ worker_id, job_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association deleted after delete', async () => {
      // Before:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue({
        getJobs: jest.fn().mockResolvedValue({
          JobWorker: {
            destroy: jest.fn().mockResolvedValue({
              ...DATA.jobWorker,
              updated_at: new Date('2019-10-10'),
              deleted_at: new Date('2019-10-10')
            })
          }
        })
      });

      // Arrange:
      const worker_id = DATA.jobWorker.worker_id;
      const job_id = DATA.jobWorker.job_id;
      const options = {};

      // Act:
      const res = await repository.deleteJob({ worker_id, job_id, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.worker_id).toEqual(worker_id);
      expect(res.job_id).toEqual(job_id);
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('getQuotes', () => {
    it('should throw error when worker was not found', () => {
      // Setup:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = repository.getQuotes({ worker_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue({
        getQuotes: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = repository.getQuotes({ worker_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue({
        getQuotes: jest.fn().mockResolvedValue([ DATA.quote ])
      });

      // Arrange:
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = await repository.getQuotes({ worker_id, options });

      // Assert:
      expect(res).toEqual([ DATA.quote ]);
    });
    it('should return a list empty when records are not found', async () => {
      // Mock:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue({
        getQuotes: jest.fn().mockResolvedValue([])
      });

      // Arrange:
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = await repository.getQuotes({ worker_id, options });

      // Assert:
      expect(res).toBeArray().toBeEmpty();
    });
  });

  describe('getQuote', () => {
    it('should throw error when worker was not found', () => {
      // Setup:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const worker_id = DATA.worker.id;
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = repository.getQuote({ worker_id, quote_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return null when quote was not found', async () => {
      // Mock:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue({
        getQuotes: jest.fn().mockResolvedValue(null)
      });

      // Arrange:
      const worker_id = DATA.worker.id;
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = await repository.getQuote({ worker_id, quote_id, options });

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and assert is true', () => {
      // Mock:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue({
        getQuotes: jest.fn().mockResolvedValue(null)
      });

      // Arrange:
      const worker_id = DATA.worker.id;
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = repository.getQuote({ worker_id, quote_id, options }, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue({
        getQuotes: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const worker_id = DATA.worker.id;
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = repository.getQuote({ worker_id, quote_id, options }, true);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.quote };

      // Mock:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue({
        getQuotes: jest.fn().mockResolvedValue(expected)
      });

      // Arrange:
      const worker_id = DATA.worker.id;
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = await repository.getQuote({ worker_id, quote_id, options }, true);

      // Assert:
      expect(res).toEqual(expected)
    });
  });

  describe('getUser', () => {
    it('should throw error when worker was not found', () => {
      // Setup:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = repository.getUser({ worker_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return null when user was not found', async () => {
      // Mock:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue({
        getUser: jest.fn().mockResolvedValue(null)
      });

      // Arrange:
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = await repository.getUser({ worker_id, options });

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and assert is true', () => {
      // Mock:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue({
        getUser: jest.fn().mockResolvedValue(null)
      });

      // Arrange:
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = repository.getUser({ worker_id, options }, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue({
        getUser: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = repository.getUser({ worker_id, options }, true);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.user };

      // Mock:
      jest.spyOn(database.models.Worker, 'findByPk').mockResolvedValue({
        getUser: jest.fn().mockResolvedValue(expected)
      });

      // Arrange:
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = await repository.getUser({ worker_id, options }, true);

      // Assert:
      expect(res).toEqual(expected)
    });
  });
});
