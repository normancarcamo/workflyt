const Repository = require('src/core/workers/workers-repository');
const Service = require('src/core/workers/workers-service');
const ACTION_ERROR = require('test/config/errors').ERROR_BAD_GATEWAY;
const DATA = require('test/config/models');

describe('Worker Service', () => {
  const database = {};
  const repository = Repository({ database });
  let service = null;

  beforeEach(async () => { service = Service({ repository }); });

  describe('getWorkers', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'getWorkers').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const options = {};

      // Act:
      const res = service.getWorkers(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of workers', async () => {
      // Setup:
      jest.spyOn(repository, 'getWorkers').mockResolvedValue([ DATA.worker ]);

      // Arrange:
      const options = {};

      // Act:
      const res = await service.getWorkers(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty().toEqual([ DATA.worker ]);
    });
  });

  describe('createWorker', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'createWorker').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const values = DATA.worker;

      // Act:
      const res = service.createWorker(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return worker created', async () => {
      // Setup:
      jest.spyOn(repository, 'createWorker').mockResolvedValue(DATA.worker);

      // Arrange:
      const values = DATA.worker;

      // Act:
      const res = await service.createWorker(values);

      // Assert:
      expect(res).toEqual(DATA.worker);
    });
  });

  describe('getWorker', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'getWorker').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = service.getWorker({ worker_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return worker when is found', async () => {
      // Setup:
      jest.spyOn(repository, 'getWorker').mockResolvedValue(DATA.worker);

      // Arrange:
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = await service.getWorker({ worker_id, options });

      // Assert:
      expect(res).toEqual(DATA.worker);
    });
  });

  describe('updateWorker', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'updateWorker').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const worker_id = DATA.worker.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = service.updateWorker({ worker_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return worker updated when is found', async () => {
      // Setup:
      jest.spyOn(repository, 'updateWorker').mockResolvedValue({
        extra: { enabled: true },
        updated_at: new Date('2019-10-10')
      });

      // Arrange:
      const worker_id = DATA.worker.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await service.updateWorker({ worker_id, values, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.extra).toEqual({ enabled: true });
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('deleteWorker', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'deleteWorker').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = service.deleteWorker({ worker_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return worker updated when is found', async () => {
      // Setup:
      jest.spyOn(repository, 'deleteWorker').mockResolvedValue({
        updated_at: new Date('2019-10-10'),
        deleted_at: new Date('2019-10-10')
      });

      // Arrange:
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = await service.deleteWorker({ worker_id, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('getSupervisors', () => {
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(repository, 'getSupervisors').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = service.getSupervisors({ worker_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      jest.spyOn(repository, 'getSupervisors').mockResolvedValue([ DATA.supervisor ]);

      // Arrange:
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = await service.getSupervisors({ worker_id, options });

      // Assert:
      expect(res).toEqual([ DATA.supervisor ]);
    });
  });

  describe('addSupervisors', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'addSupervisors').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const options = { worker_id: DATA.worker.id, supervisors: [ DATA.supervisor.id ] };

      // Act:
      const res = service.addSupervisors(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations after adding them', async () => {
      // Setup:
      jest.spyOn(repository, 'addSupervisors').mockResolvedValue([ DATA.workerSupervisor ]);

      // Arrange:
      const options = { worker_id: DATA.worker.id, supervisors: [ DATA.supervisor.id ] };

      // Act:
      const res = await service.addSupervisors(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty();
      expect(res).toEqual([ DATA.workerSupervisor ]);
    });
  });

  describe('getSupervisor', () => {
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(repository, 'getSupervisor').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const worker_id = DATA.worker.id;
      const supervisor_id = DATA.supervisor.id;
      const options = {};

      // Act:
      const res = service.getSupervisor({ worker_id, supervisor_id, options }, true);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.supervisor, WorkerSupervisor: DATA.workerSupervisor };

      // Mock:
      jest.spyOn(repository, 'getSupervisor').mockResolvedValue(expected);

      // Arrange:
      const worker_id = DATA.worker.id;
      const supervisor_id = DATA.supervisor.id;
      const options = {};

      // Act:
      const res = await service.getSupervisor({ worker_id, supervisor_id, options }, true);

      // Assert:
      expect(res).toEqual(expected)
    });
  });

  describe('updateSupervisor', () => {
    it('should throw error when action fail', () => {
      // Before:
      jest.spyOn(repository, 'updateSupervisor').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const worker_id = DATA.worker.id;
      const supervisor_id = DATA.supervisor.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = service.updateSupervisor({ worker_id, supervisor_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association updated after update', async () => {
      // Before:
      jest.spyOn(repository, 'updateSupervisor').mockResolvedValue({
        ...DATA.workerSupervisor,
        extra: { enabled: true },
        updated_at: new Date('2019-10-10')
      });

      // Arrange:
      const worker_id = DATA.workerSupervisor.worker_id;
      const supervisor_id = DATA.workerSupervisor.supervisor_id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await service.updateSupervisor({ worker_id, supervisor_id, values, options });

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
      // Before:
      jest.spyOn(repository, 'deleteSupervisor').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const worker_id = DATA.worker.id;
      const supervisor_id = DATA.supervisor.id;
      const options = {};

      // Act:
      const res = service.deleteSupervisor({ worker_id, supervisor_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association deleted after delete', async () => {
      // Before:
      jest.spyOn(repository, 'deleteSupervisor').mockResolvedValue({
        ...DATA.workerSupervisor,
        updated_at: new Date('2019-10-10'),
        deleted_at: new Date('2019-10-10')
      });

      // Arrange:
      const worker_id = DATA.workerSupervisor.worker_id;
      const supervisor_id = DATA.workerSupervisor.supervisor_id;
      const options = {};

      // Act:
      const res = await service.deleteSupervisor({ worker_id, supervisor_id, options });

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
      jest.spyOn(repository, 'getJobs').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = service.getJobs({ worker_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      jest.spyOn(repository, 'getJobs').mockResolvedValue([ DATA.job ]);

      // Arrange:
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = await service.getJobs({ worker_id, options });

      // Assert:
      expect(res).toEqual([ DATA.job ]);
    });
  });

  describe('addJobs', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'addJobs').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const options = { worker_id: DATA.worker.id, jobs: [ DATA.job.id ] };

      // Act:
      const res = service.addJobs(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations after adding them', async () => {
      // Setup:
      jest.spyOn(repository, 'addJobs').mockResolvedValue([ DATA.jobWorker ]);

      // Arrange:
      const options = { worker_id: DATA.worker.id, jobs: [ DATA.job.id ] };

      // Act:
      const res = await service.addJobs(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty();
      expect(res).toEqual([ DATA.jobWorker ]);
    });
  });

  describe('getJob', () => {
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(repository, 'getJob').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const worker_id = DATA.worker.id;
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = service.getJob({ worker_id, job_id, options }, true);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.job, JobWorker: DATA.jobWorker };

      // Mock:
      jest.spyOn(repository, 'getJob').mockResolvedValue(expected);

      // Arrange:
      const worker_id = DATA.worker.id;
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = await service.getJob({ worker_id, job_id, options }, true);

      // Assert:
      expect(res).toEqual(expected)
    });
  });

  describe('updateJob', () => {
    it('should throw error when action fail', () => {
      // Before:
      jest.spyOn(repository, 'updateJob').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const worker_id = DATA.worker.id;
      const job_id = DATA.job.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = service.updateJob({ worker_id, job_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association updated after update', async () => {
      // Before:
      jest.spyOn(repository, 'updateJob').mockResolvedValue({
        ...DATA.jobWorker,
        extra: { enabled: true },
        updated_at: new Date('2019-10-10')
      });

      // Arrange:
      const worker_id = DATA.jobWorker.worker_id;
      const job_id = DATA.jobWorker.job_id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await service.updateJob({ worker_id, job_id, values, options });

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
      // Before:
      jest.spyOn(repository, 'deleteJob').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const worker_id = DATA.worker.id;
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = service.deleteJob({ worker_id, job_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association deleted after delete', async () => {
      // Before:
      jest.spyOn(repository, 'deleteJob').mockResolvedValue({
        ...DATA.jobWorker,
        updated_at: new Date('2019-10-10'),
        deleted_at: new Date('2019-10-10')
      });

      // Arrange:
      const worker_id = DATA.jobWorker.worker_id;
      const job_id = DATA.jobWorker.job_id;
      const options = {};

      // Act:
      const res = await service.deleteJob({ worker_id, job_id, options });

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
      // Mock:
      jest.spyOn(repository, 'getQuotes').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = service.getQuotes({ worker_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      jest.spyOn(repository, 'getQuotes').mockResolvedValue([ DATA.quote ]);

      // Arrange:
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = await service.getQuotes({ worker_id, options });

      // Assert:
      expect(res).toEqual([ DATA.quote ]);
    });
  });

  describe('getQuote', () => {
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(repository, 'getQuote').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const worker_id = DATA.worker.id;
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = service.getQuote({ worker_id, quote_id, options }, true);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.quote };

      // Mock:
      jest.spyOn(repository, 'getQuote').mockResolvedValue(expected);

      // Arrange:
      const worker_id = DATA.worker.id;
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = await service.getQuote({ worker_id, quote_id, options }, true);

      // Assert:
      expect(res).toEqual(expected)
    });
  });

  describe('getUser', () => {
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(repository, 'getUser').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = service.getUser({ worker_id, options }, true);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.user };

      // Mock:
      jest.spyOn(repository, 'getUser').mockResolvedValue(expected);

      // Arrange:
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = await service.getUser({ worker_id, options }, true);

      // Assert:
      expect(res).toEqual(expected)
    });
  });
});
