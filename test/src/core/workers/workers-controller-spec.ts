import '../../../config/global';
import db from '../../../../src/providers/postgres';
import * as DATA from '../../../config/models';
import Helpers from '../../../config/helpers';

describe('Workers - Controller', () => {
  const API_BASE = '/v1';
  const helpers = Helpers(db);

  beforeEach(helpers.destroyData);
  afterEach(helpers.restoreMocks);
  afterAll(helpers.closeConnections);

  describe('Retrieving Workers', () => {
    it('GET /workers --> Successfully', async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/workers/workers-service', () => ({
          WorkerService: () => ({
            getWorkers: async (options?:object) => [ DATA.worker ]
          })
        }));
      } else {
        await db.models.Worker.create(DATA.worker);
      }

      // Arrange:
      let permissions = [ 'get workers' ];
      let query = {};
      let payload = { permissions, query };

      // Act:
      let res = await helpers.request.get(`${API_BASE}/workers`, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeArray().not.toBeEmpty();
      expect(res.body.data[0]).toBeObject().not.toBeEmpty();
    });
  });

  describe('Creating Worker', () => {
    it(`POST /workers --> There is an worker with the same name`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/workers/workers-service', () => ({
          WorkerService: () => ({
            createWorker: helpers.serviceUniqueError
          })
        }));
      } else {
        await db.models.Worker.create(DATA.worker);
      }

      // Arrange:
      let permissions = [ 'create worker' ];
      let data = DATA.worker;
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.post(`${API_BASE}/workers`, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`POST /workers --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/workers/workers-service', () => ({
          WorkerService: () => ({
            createWorker: async (values?:object) => values
          })
        }));
      }

      // Arrange:
      let permissions = [ 'create worker' ];
      let data = { ...DATA.worker };
      delete data.id;
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.post(`${API_BASE}/workers`, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 201 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
    });
  });

  describe('Retrieving Worker', () => {
    it(`GET /workers/:worker --> Not found`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/workers/workers-service', () => ({
          WorkerService: () => ({
            getWorker: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/workers/${DATA.worker.id}`;
      let permissions = [ 'get worker' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /workers/:worker --> Successfully`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/workers/workers-service', () => ({
          WorkerService: () => ({
            getWorker: async (worker_id:string, options?:object) => DATA.worker
          })
        }));
      } else {
        await db.models.Worker.create(DATA.worker);
      }

      // Arrange:
      let endpoint = `${API_BASE}/workers/${DATA.worker.id}`;
      let permissions = [ 'get worker' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.id).toEqual(DATA.worker.id);
    });
  });

  describe('Updating Worker', () => {
    it(`PATCH /workers/:worker --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/workers/workers-service', () => ({
          WorkerService: () => ({
            updateWorker: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/workers/${DATA.worker.id}`;
      let permissions = [ 'update worker' ];
      let data = { extra: { enabled: true } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`PATCH /workers/:worker --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/workers/workers-service', () => ({
          WorkerService: () => ({
            updateWorker: async (worker_id:string, values:object, options?:object) => values
          })
        }));
      } else {
        await db.models.Worker.create(DATA.worker);
      }

      // Arrange:
      let endpoint = `${API_BASE}/workers/${DATA.worker.id}`;
      let permissions = [ 'update worker' ];
      let data = { extra: { enabled: true } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data.extra).toEqual({ enabled: true });
    });
  });

  describe('Deleting Worker', () => {
    it(`DELETE /workers/:worker --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/workers/workers-service', () => ({
          WorkerService: () => ({
            deleteWorker: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/workers/${DATA.worker.id}`;
      let permissions = [ 'delete worker' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`DELETE /workers/:worker --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/workers/workers-service', () => ({
          WorkerService: () => ({
            deleteWorker: async (worker_id:string, options?:object) => ({
              id: worker_id,
              updated_at: new Date('2019-10-10'),
              deleted_at: new Date('2019-10-10')
            })
          })
        }));
      } else {
        await db.models.Worker.create(DATA.worker);
      }

      // Arrange:
      let endpoint = `${API_BASE}/workers/${DATA.worker.id}`;
      let permissions = [ 'delete worker' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data.id).toEqual(DATA.worker.id);
      expect(res.body.data.deleted_at).not.toBe(null);
    });
  });

  describe('Retrieving Supervisors', () => {
    it(`GET /workers/:worker/supervisors --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/workers/workers-service', () => ({
          WorkerService: () => ({
            getSupervisors: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/workers/${DATA.worker.id}/supervisors`;
      let permissions = [ 'get supervisors from worker' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /workers/:worker/supervisors --> Successfully`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/workers/workers-service', () => ({
          WorkerService: () => ({
            getSupervisors: async (worker_id:string, options?:object) => [{
              ...DATA.supervisor,
              WorkerSupervisor: DATA.worker
            }]
          })
        }));
      } else {
        let worker = await db.models.Worker.create(DATA.worker);
        let supervisor = await db.models.Worker.create(DATA.supervisor);
        await worker.addSupervisor(supervisor);
      }

      // Arrange:
      let endpoint = `${API_BASE}/workers/${DATA.worker.id}/supervisors`;
      let permissions = [ 'get supervisors from worker' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeArray().not.toBeEmpty();
    });
  });

  describe('Adding supervisors', () => {
    it(`PUT /workers/:worker/supervisors --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/workers/workers-service', () => ({
          WorkerService: () => ({
            addSupervisors: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/workers/${DATA.worker.id}/supervisors`;
      let permissions = [ 'add supervisors to worker' ];
      let data = { supervisors: [ DATA.supervisor.id ] };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.put(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`PUT /workers/:worker/supervisors --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/workers/workers-service', () => ({
          WorkerService: () => ({
            addSupervisors: async (worker_id:string, supervisors:string[]) => [
              DATA.workerSupervisor
            ]
          })
        }));
      } else {
        await db.models.Worker.create(DATA.worker);
        await db.models.Worker.create(DATA.supervisor);
      }

      // Arrange:
      let endpoint = `${API_BASE}/workers/${DATA.worker.id}/supervisors`;
      let permissions = [ 'add supervisors to worker' ];
      let data = { supervisors: [ DATA.supervisor.id ] };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.put(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 201 });
      expect(res.body.data).toBeArray().not.toBeEmpty();
      expect(res.body.data[0].worker_id).toEqual(DATA.worker.id);
      expect(res.body.data[0].supervisor_id).toEqual(DATA.supervisor.id);
    });
  });

  describe('Retrieve supervisor', () => {
    it(`GET /workers/:worker/supervisors/:supervisor --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/workers/workers-service', () => ({
          WorkerService: () => ({
            getSupervisor: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let worker_id = DATA.worker.id;
      let supervisor_id = DATA.supervisor.id;
      let endpoint = `${API_BASE}/workers/${worker_id}/supervisors/${supervisor_id}`;
      let permissions = [ 'get supervisor from worker' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /workers/:worker/supervisors/:supervisor --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/workers/workers-service', () => ({
          WorkerService: () => ({
            getSupervisor: async (worker_id:string, supervisor_id:string, options?:object) => ({
              ...DATA.supervisor,
              WorkerSupervisor: DATA.workerSupervisor
            })
          })
        }));
      } else {
        let worker = await db.models.Worker.create(DATA.worker);
        let supervisor = await db.models.Worker.create(DATA.supervisor);
        await worker.addSupervisor(supervisor);
      }

      // Arrange:
      let worker_id = DATA.worker.id;
      let supervisor_id = DATA.supervisor.id;
      let endpoint = `${API_BASE}/workers/${worker_id}/supervisors/${supervisor_id}`;
      let permissions = [ 'get supervisor from worker' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.id).toEqual(supervisor_id);
    });
  });

  describe('Updating supervisor', () => {
    it(`PATCH /workers/:worker/supervisors/:supervisor --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/workers/workers-service', () => ({
          WorkerService: () => ({
            updateSupervisor: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let worker_id = DATA.worker.id;
      let supervisor_id = DATA.supervisor.id;
      let endpoint = `${API_BASE}/workers/${worker_id}/supervisors/${supervisor_id}`;
      let permissions = [ 'update supervisor from worker' ];
      let data = { extra: { enabled: true } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`PATCH /workers/:worker/supervisors/:supervisor --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/workers/workers-service', () => ({
          WorkerService: () => ({
            updateSupervisor: async (worker_id:string, supervisor_id:string, values:object, options?:object) => ({
              worker_id: worker_id,
              supervisor_id: supervisor_id,
              ...values
            })
          })
        }));
      } else {
        let worker = await db.models.Worker.create(DATA.worker);
        let supervisor = await db.models.Worker.create(DATA.supervisor);
        await worker.addSupervisor(supervisor);
      }

      // Arrange:
      let worker_id = DATA.worker.id;
      let supervisor_id = DATA.supervisor.id;
      let endpoint = `${API_BASE}/workers/${worker_id}/supervisors/${supervisor_id}`;
      let permissions = [ 'update supervisor from worker' ];
      let data = { extra: { enabled: true } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.extra).toEqual({ enabled: true });
    });
  });

  describe('Deleting supervisor', () => {
    it(`DELETE /workers/:worker/supervisors/:supervisor --> Failed - exception`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/workers/workers-service', () => ({
          WorkerService: () => ({
            deleteSupervisor: helpers.serviceNotFoundError
          })
        }));
      } else {
        await db.models.Area.create(DATA.area);
        await db.models.Service.create(DATA.service);
        await db.models.Client.create(DATA.client);
        await db.models.Worker.create(DATA.salesman);
        await db.models.Quote.create(DATA.quote);
        await db.models.Order.create(DATA.order);
        await db.models.Worker.create(DATA.worker);
      }

      // Arrange:
      let worker_id = DATA.worker.id;
      let supervisor_id = DATA.supervisor.id;
      let endpoint = `${API_BASE}/workers/${worker_id}/supervisors/${supervisor_id}`;
      let permissions = [ 'delete supervisor from worker' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`DELETE /workers/:worker/supervisors/:supervisor --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/workers/workers-service', () => ({
          WorkerService: () => ({
            deleteSupervisor: async (worker_id:string, supervisor_id:string, options?:object) => ({
              worker_id: worker_id,
              supervisor_id: supervisor_id,
              deleted_at: new Date()
            })
          })
        }));
      } else {
        let worker = await db.models.Worker.create(DATA.worker);
        let supervisor = await db.models.Worker.create(DATA.supervisor);
        await worker.addSupervisor(supervisor);
      }

      // Arrange:
      let worker_id = DATA.worker.id;
      let supervisor_id = DATA.supervisor.id;
      let endpoint = `${API_BASE}/workers/${worker_id}/supervisors/${supervisor_id}`;
      let permissions = [ 'delete supervisor from worker' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.worker_id).toEqual(worker_id);
      expect(res.body.data.supervisor_id).toEqual(supervisor_id);
      expect(res.body.data.deleted_at).not.toBe(null);
    });
  });

  describe('Retrieving Jobs', () => {
    it(`GET /workers/:worker/jobs --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/workers/workers-service', () => ({
          WorkerService: () => ({
            getJobs: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/workers/${DATA.worker.id}/jobs`;
      let permissions = [ 'get jobs from worker' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /workers/:worker/jobs --> Successfully`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/workers/workers-service', () => ({
          WorkerService: () => ({
            getJobs: async (worker_id:string, options?:object) => [{
              ...DATA.job,
              JobWorker: DATA.worker
            }]
          })
        }));
      } else {
        await db.models.Area.create(DATA.area);
        await db.models.Client.create(DATA.client);
        await db.models.Worker.create(DATA.salesman);
        await db.models.Service.create(DATA.service);
        await db.models.Quote.create(DATA.quote);
        await db.models.Order.create(DATA.order);
        let worker = await db.models.Worker.create(DATA.worker);
        let job = await db.models.Job.create(DATA.job);
        await worker.addJob(job);
      }

      // Arrange:
      let endpoint = `${API_BASE}/workers/${DATA.worker.id}/jobs`;
      let permissions = [ 'get jobs from worker' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeArray().not.toBeEmpty();
    });
  });

  describe('Adding jobs', () => {
    it(`PUT /workers/:worker/jobs --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/workers/workers-service', () => ({
          WorkerService: () => ({
            addJobs: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/workers/${DATA.worker.id}/jobs`;
      let permissions = [ 'add jobs to worker' ];
      let data = { jobs: [ DATA.job.id ] };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.put(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`PUT /workers/:worker/jobs --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/workers/workers-service', () => ({
          WorkerService: () => ({
            addJobs: async (worker_id:string, jobs:string[]) => [
              DATA.jobWorker
            ]
          })
        }));
      } else {
        await db.models.Area.create(DATA.area);
        await db.models.Client.create(DATA.client);
        await db.models.Worker.create(DATA.salesman);
        await db.models.Service.create(DATA.service);
        await db.models.Quote.create(DATA.quote);
        await db.models.Order.create(DATA.order);
        await db.models.Worker.create(DATA.worker);
        await db.models.Job.create(DATA.job);
      }

      // Arrange:
      let endpoint = `${API_BASE}/workers/${DATA.worker.id}/jobs`;
      let permissions = [ 'add jobs to worker' ];
      let data = { jobs: [ DATA.job.id ] };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.put(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 201 });
      expect(res.body.data).toBeArray().not.toBeEmpty();
      expect(res.body.data[0].worker_id).toEqual(DATA.worker.id);
      expect(res.body.data[0].job_id).toEqual(DATA.job.id);
    });
  });

  describe('Retrieve job', () => {
    it(`GET /workers/:worker/jobs/:job --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/workers/workers-service', () => ({
          WorkerService: () => ({
            getJob: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let worker_id = DATA.worker.id;
      let job_id = DATA.job.id;
      let endpoint = `${API_BASE}/workers/${worker_id}/jobs/${job_id}`;
      let permissions = [ 'get job from worker' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /workers/:worker/jobs/:job --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/workers/workers-service', () => ({
          WorkerService: () => ({
            getJob: async (worker_id:string, job_id:string, options?:object) => ({
              ...DATA.job,
              JobWorker: DATA.jobWorker
            })
          })
        }));
      } else {
        await db.models.Area.create(DATA.area);
        await db.models.Service.create(DATA.service);
        await db.models.Client.create(DATA.client);
        await db.models.Worker.create(DATA.salesman);
        await db.models.Quote.create(DATA.quote);
        await db.models.Order.create(DATA.order);
        let worker = await db.models.Worker.create(DATA.worker);
        let job = await db.models.Job.create(DATA.job);
        await worker.addJob(job);
      }

      // Arrange:
      let worker_id = DATA.worker.id;
      let job_id = DATA.job.id;
      let endpoint = `${API_BASE}/workers/${worker_id}/jobs/${job_id}`;
      let permissions = [ 'get job from worker' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.id).toEqual(job_id);
    });
  });

  describe('Updating job', () => {
    it(`PATCH /workers/:worker/jobs/:job --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/workers/workers-service', () => ({
          WorkerService: () => ({
            updateJob: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let worker_id = DATA.worker.id;
      let job_id = DATA.job.id;
      let endpoint = `${API_BASE}/workers/${worker_id}/jobs/${job_id}`;
      let permissions = [ 'update job from worker' ];
      let data = { extra: { enabled: true } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`PATCH /workers/:worker/jobs/:job --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/workers/workers-service', () => ({
          WorkerService: () => ({
            updateJob: async (worker_id:string, job_id:string, values:object, options?:object) => ({
              worker_id: worker_id,
              job_id: job_id,
              ...values
            })
          })
        }));
      } else {
        await db.models.Area.create(DATA.area);
        await db.models.Service.create(DATA.service);
        await db.models.Client.create(DATA.client);
        await db.models.Worker.create(DATA.salesman);
        await db.models.Quote.create(DATA.quote);
        await db.models.Order.create(DATA.order);
        let worker = await db.models.Worker.create(DATA.worker);
        let job = await db.models.Job.create(DATA.job);
        await worker.addJob(job);
      }

      // Arrange:
      let worker_id = DATA.worker.id;
      let job_id = DATA.job.id;
      let endpoint = `${API_BASE}/workers/${worker_id}/jobs/${job_id}`;
      let permissions = [ 'update job from worker' ];
      let data = { extra: { enabled: true } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.extra).toEqual({ enabled: true });
    });
  });

  describe('Deleting job', () => {
    it(`DELETE /workers/:worker/jobs/:job --> Failed - exception`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/workers/workers-service', () => ({
          WorkerService: () => ({
            deleteJob: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let worker_id = DATA.worker.id;
      let job_id = DATA.job.id;
      let endpoint = `${API_BASE}/workers/${worker_id}/jobs/${job_id}`;
      let permissions = [ 'delete job from worker' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`DELETE /workers/:worker/jobs/:job --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/workers/workers-service', () => ({
          WorkerService: () => ({
            deleteJob: async (worker_id:string, job_id:string, options?:object) => ({
              worker_id: worker_id,
              job_id: job_id,
              deleted_at: new Date()
            })
          })
        }));
      } else {
        await db.models.Area.create(DATA.area);
        await db.models.Service.create(DATA.service);
        await db.models.Client.create(DATA.client);
        await db.models.Worker.create(DATA.salesman);
        await db.models.Quote.create(DATA.quote);
        await db.models.Order.create(DATA.order);
        let worker = await db.models.Worker.create(DATA.worker);
        let job = await db.models.Job.create(DATA.job);
        await worker.addJob(job);
      }

      // Arrange:
      let worker_id = DATA.worker.id;
      let job_id = DATA.job.id;
      let endpoint = `${API_BASE}/workers/${worker_id}/jobs/${job_id}`;
      let permissions = [ 'delete job from worker' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.worker_id).toEqual(worker_id);
      expect(res.body.data.job_id).toEqual(job_id);
      expect(res.body.data.deleted_at).not.toBe(null);
    });
  });

  describe('Retrieving Quotes', () => {
    it(`GET /workers/:worker/quotes --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/workers/workers-service', () => ({
          WorkerService: () => ({
            getQuotes: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/workers/${DATA.worker.id}/quotes`;
      let permissions = [ 'get quotes from worker' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /workers/:worker/quotes --> Successfully`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/workers/workers-service', () => ({
          WorkerService: () => ({
            getQuotes: async (worker_id:string, options?:object) => [ DATA.quote ]
          })
        }));
      } else {
        await db.models.Area.create(DATA.area);
        await db.models.Client.create(DATA.client);
        await db.models.Worker.create(DATA.salesman);
        await db.models.Service.create(DATA.service);
        let quote = await db.models.Quote.create(DATA.quote);
        await db.models.Order.create(DATA.order);
        let worker = await db.models.Worker.create(DATA.worker);
        await worker.addQuote(quote);
      }

      // Arrange:
      let endpoint = `${API_BASE}/workers/${DATA.worker.id}/quotes`;
      let permissions = [ 'get quotes from worker' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeArray().not.toBeEmpty();
    });
  });

  describe('Retrieve quote', () => {
    it(`GET /workers/:worker/quotes/:quote --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/workers/workers-service', () => ({
          WorkerService: () => ({
            getQuote: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let worker_id = DATA.worker.id;
      let quote_id = DATA.quote.id;
      let endpoint = `${API_BASE}/workers/${worker_id}/quotes/${quote_id}`;
      let permissions = [ 'get quote from worker' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /workers/:worker/quotes/:quote --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/workers/workers-service', () => ({
          WorkerService: () => ({
            getQuote: async (worker_id:string, quote_id:string, options?:object) => DATA.quote
          })
        }));
      } else {
        await db.models.Area.create(DATA.area);
        await db.models.Client.create(DATA.client);
        await db.models.Worker.create(DATA.salesman);
        await db.models.Service.create(DATA.service);
        let quote = await db.models.Quote.create(DATA.quote);
        await db.models.Order.create(DATA.order);
        let worker = await db.models.Worker.create(DATA.worker);
        await worker.addQuote(quote);
      }

      // Arrange:
      let worker_id = DATA.worker.id;
      let quote_id = DATA.quote.id;
      let endpoint = `${API_BASE}/workers/${worker_id}/quotes/${quote_id}`;
      let permissions = [ 'get quote from worker' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.id).toEqual(quote_id);
    });
  });

  describe('Retrieve user', () => {
    it(`GET /workers/:worker/user --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/workers/workers-service', () => ({
          WorkerService: () => ({
            getUser: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let worker_id = DATA.worker.id;
      let endpoint = `${API_BASE}/workers/${worker_id}/user`;
      let permissions = [ 'get user from worker' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /workers/:worker/user --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/workers/workers-service', () => ({
          WorkerService: () => ({
            getUser: async (worker_id:string, options?:object) => DATA.user
          })
        }));
      } else {
        await db.models.Worker.create(DATA.worker);
        await db.models.User.create(DATA.user);
      }

      // Arrange:
      let worker_id = DATA.worker.id;
      let endpoint = `${API_BASE}/workers/${worker_id}/user`;
      let permissions = [ 'get user from worker' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.id).toEqual(DATA.user.id);
    });
  });
});
