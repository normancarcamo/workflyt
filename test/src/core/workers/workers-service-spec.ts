import '../../../config/global';
import { WorkerRepository } from '../../../../src/core/workers/workers-repository';
import { WorkerService } from '../../../../src/core/workers/workers-service';
import { I } from '../../../../src/core/workers/workers-types';
import { ERROR_BAD_GATEWAY as ACTION_ERROR } from '../../../config/errors';
import * as DATA from '../../../config/models';

describe('Worker Service', () => {
  let database = {};
  let repository = WorkerRepository(database);
  let service:I.service = WorkerService(repository);

  beforeEach(async () => { service = WorkerService(repository); });

  describe('getWorkers', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.getWorkers = async () => { throw ACTION_ERROR; };

      // Arrange:
      const options = {};

      // Act:
      const res = service.getWorkers(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of workers', async () => {
      // Setup:
      repository.getWorkers = async () => [ DATA.worker ];

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
      repository.createWorker = async () => { throw ACTION_ERROR; };

      // Arrange:
      const values = DATA.worker;

      // Act:
      const res = service.createWorker(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return worker created', async () => {
      // Setup:
      repository.createWorker = async () => DATA.worker;

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
      repository.getWorker = async () => { throw ACTION_ERROR; };

      // Arrange:
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = service.getWorker(worker_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return worker when is found', async () => {
      // Setup:
      repository.getWorker = async () => DATA.worker;

      // Arrange:
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = await service.getWorker(worker_id, options);

      // Assert:
      expect(res).toEqual(DATA.worker);
    });
  });

  describe('updateWorker', () => {
    it('should throw error when action fail', () => {
      // Arrange:
      repository.updateWorker = async () => { throw ACTION_ERROR; };
      const worker_id = DATA.worker.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = service.updateWorker(worker_id, values, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return worker updated when is found', async () => {
      // Arrange:
      repository.updateWorker = async () => ({
        extra: { enabled: true },
        updated_at: new Date('2019-10-10')
      });
      const worker_id = DATA.worker.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await service.updateWorker(worker_id, values, options);

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.extra).toEqual({ enabled: true });
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('deleteWorker', () => {
    it('should throw error when action fail', () => {
      // Arrange:
      repository.deleteWorker = async () => { throw ACTION_ERROR; };
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = service.deleteWorker(worker_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return worker updated when is found', async () => {
      // Arrange:
      repository.deleteWorker = async () => ({
        updated_at: new Date('2019-10-10'),
        deleted_at: new Date('2019-10-10')
      });
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = await service.deleteWorker(worker_id, options);

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('getSupervisors', () => {
    it('should throw error when action fail', () => {
      // Mock:
      repository.getSupervisors = async () => { throw ACTION_ERROR; };

      // Arrange:
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = service.getSupervisors(worker_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      repository.getSupervisors = async () => [ DATA.supervisor ];

      // Arrange:
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = await service.getSupervisors(worker_id, options);

      // Assert:
      expect(res).toEqual([ DATA.supervisor ]);
    });
  });

  describe('addSupervisors', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.addSupervisors = async () => { throw ACTION_ERROR; };

      // Arrange:
      const worker_id:string = DATA.worker.id;
      const supervisors:string[] = [ DATA.supervisor.id ];

      // Act:
      const res = service.addSupervisors(worker_id, supervisors);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations after adding them', async () => {
      // Setup:
      repository.addSupervisors = async () => [ DATA.workerSupervisor ];

      // Arrange:
      const worker_id:string = DATA.worker.id;
      const supervisors:string[] = [ DATA.supervisor.id ];

      // Act:
      const res = await service.addSupervisors(worker_id, supervisors);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty();
      expect(res).toEqual([ DATA.workerSupervisor ]);
    });
  });

  describe('getSupervisor', () => {
    it('should throw error when action fail', () => {
      // Mock:
      repository.getSupervisor = async () => { throw ACTION_ERROR; };

      // Arrange:
      const worker_id = DATA.worker.id;
      const supervisor_id = DATA.supervisor.id;
      const options = {};

      // Act:
      const res = service.getSupervisor(worker_id, supervisor_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      // Arrange:
      const expected = { ...DATA.supervisor, WorkerSupervisor: DATA.workerSupervisor };
      repository.getSupervisor = async () => expected;
      const worker_id = DATA.worker.id;
      const supervisor_id = DATA.supervisor.id;
      const options = {};

      // Act:
      const res = await service.getSupervisor(worker_id, supervisor_id, options);

      // Assert:
      expect(res).toEqual(expected);
    });
  });

  describe('updateSupervisor', () => {
    it('should throw error when action fail', () => {
      // Before:
      repository.updateSupervisor = async () => { throw ACTION_ERROR; };

      // Arrange:
      const worker_id = DATA.worker.id;
      const supervisor_id = DATA.supervisor.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = service.updateSupervisor(worker_id, supervisor_id, values, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association updated after update', async () => {
      // Arrange:
      repository.updateSupervisor = async () => ({
        ...DATA.workerSupervisor,
        extra: { enabled: true },
        updated_at: new Date('2019-10-10')
      });
      const worker_id = DATA.workerSupervisor.worker_id;
      const supervisor_id = DATA.workerSupervisor.supervisor_id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await service.updateSupervisor(worker_id, supervisor_id, values, options);

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
      repository.deleteSupervisor = async () => { throw ACTION_ERROR; };
      const worker_id = DATA.worker.id;
      const supervisor_id = DATA.supervisor.id;
      const options = {};

      // Act:
      const res = service.deleteSupervisor(worker_id, supervisor_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association deleted after delete', async () => {
      // Arrange:
      repository.deleteSupervisor = async () => ({
        ...DATA.workerSupervisor,
        updated_at: new Date('2019-10-10'),
        deleted_at: new Date('2019-10-10')
      });
      const worker_id = DATA.workerSupervisor.worker_id;
      const supervisor_id = DATA.workerSupervisor.supervisor_id;
      const options = {};

      // Act:
      const res = await service.deleteSupervisor(worker_id, supervisor_id, options);

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
      // Arrange:
      repository.getJobs = async () => { throw ACTION_ERROR; };
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = service.getJobs(worker_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Arrange:
      repository.getJobs = async () => [ DATA.job ];
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = await service.getJobs(worker_id, options);

      // Assert:
      expect(res).toEqual([ DATA.job ]);
    });
  });

  describe('addJobs', () => {
    it('should throw error when action fail', () => {
      // Arrange:
      repository.addJobs = async () => { throw ACTION_ERROR; };
      const worker_id:string = DATA.worker.id;
      const jobs:string[] = [ DATA.job.id ];

      // Act:
      const res = service.addJobs(worker_id, jobs);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations after adding them', async () => {
      // Arrange:
      repository.addJobs = async () => [ DATA.jobWorker ];
      const worker_id:string = DATA.worker.id;
      const jobs:string[] = [ DATA.job.id ];

      // Act:
      const res = await service.addJobs(worker_id, jobs);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty();
      expect(res).toEqual([ DATA.jobWorker ]);
    });
  });

  describe('getJob', () => {
    it('should throw error when action fail', () => {
      // Arrange:
      repository.getJob = async () => { throw ACTION_ERROR; };
      const worker_id = DATA.worker.id;
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = service.getJob(worker_id, job_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      // Arrange:
      const expected = { ...DATA.job, JobWorker: DATA.jobWorker };
      repository.getJob = async () => expected;
      const worker_id = DATA.worker.id;
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = await service.getJob(worker_id, job_id, options);

      // Assert:
      expect(res).toEqual(expected);
    });
  });

  describe('updateJob', () => {
    it('should throw error when action fail', () => {
      // Arrange:
      repository.updateJob = async () => { throw ACTION_ERROR; };
      const worker_id = DATA.worker.id;
      const job_id = DATA.job.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = service.updateJob(worker_id, job_id, values, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association updated after update', async () => {
      // Arrange:
      repository.updateJob = async () => ({
        ...DATA.jobWorker,
        extra: { enabled: true },
        updated_at: new Date('2019-10-10')
      });
      const worker_id = DATA.jobWorker.worker_id;
      const job_id = DATA.jobWorker.job_id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await service.updateJob(worker_id, job_id, values, options);

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
      repository.deleteJob = async () => { throw ACTION_ERROR; };

      // Arrange:
      const worker_id = DATA.worker.id;
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = service.deleteJob(worker_id, job_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association deleted after delete', async () => {
      // Arrange:
      repository.deleteJob = async () => ({
        ...DATA.jobWorker,
        updated_at: new Date('2019-10-10'),
        deleted_at: new Date('2019-10-10')
      });
      const worker_id = DATA.jobWorker.worker_id;
      const job_id = DATA.jobWorker.job_id;
      const options = {};

      // Act:
      const res = await service.deleteJob(worker_id, job_id, options);

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
      repository.getQuotes = async () => { throw ACTION_ERROR; };
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = service.getQuotes(worker_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Arrange:
      repository.getQuotes = async () => [ DATA.quote ];
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = await service.getQuotes(worker_id, options);

      // Assert:
      expect(res).toEqual([ DATA.quote ]);
    });
  });

  describe('getQuote', () => {
    it('should throw error when action fail', () => {
      // Arrange:
      repository.getQuote = async () => { throw ACTION_ERROR; };
      const worker_id = DATA.worker.id;
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = service.getQuote(worker_id, quote_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      // Arrange:
      const expected = { ...DATA.quote };
      repository.getQuote = async () => expected;
      const worker_id = DATA.worker.id;
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = await service.getQuote(worker_id, quote_id, options);

      // Assert:
      expect(res).toEqual(expected);
    });
  });

  describe('getUser', () => {
    it('should throw error when action fail', () => {
      // Arrange:
      repository.getUser = async () => { throw ACTION_ERROR; };
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = service.getUser(worker_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      // Arrange:
      const expected = { ...DATA.user };
      repository.getUser = async () => expected;
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = await service.getUser(worker_id, options);

      // Assert:
      expect(res).toEqual(expected);
    });
  });
});
