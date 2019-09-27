import '../../../config/global';
import db from '../../../../src/providers/postgres';
import * as DATA from '../../../config/models';
import Helpers from '../../../config/helpers';

describe('Jobs - Controller', () => {
  const API_BASE = '/v1';
  const helpers = Helpers(db);

  beforeEach(helpers.destroyData);
  afterEach(helpers.restoreMocks);
  afterAll(helpers.closeConnections);

  describe('Retrieving Jobs', () => {
    it('GET /jobs --> Successfully', async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/jobs/jobs-service', () => ({
          JobService: () => ({
            getJobs: async (options?:object) => [ DATA.job ]
          })
        }));
      } else {
        let area = await db.models.Area.create(DATA.area);
        let service = await db.models.Service.create(DATA.service);
        let client = await db.models.Client.create(DATA.client);
        let salesman = await db.models.Worker.create(DATA.salesman);
        let quote = await db.models.Quote.create(DATA.quote);
        let order = await db.models.Order.create(DATA.order);
        await db.models.Job.create(DATA.job);
      }

      // Arrange:
      let permissions = [ 'get jobs' ];
      let query = {};
      let payload = { permissions, query };

      // Act:
      let res = await helpers.request.get(`${API_BASE}/jobs`, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeArray().not.toBeEmpty();
      expect(res.body.data[0]).toBeObject().not.toBeEmpty();
    });
  });

  describe('Creating Job', () => {
    it(`POST /jobs --> There is an job with the same name`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/jobs/jobs-service', () => ({
          JobService: () => ({
            createJob: helpers.serviceUniqueError
          })
        }));
      } else {
        await db.models.Area.create(DATA.area);
        await db.models.Service.create(DATA.service);
        await db.models.Client.create(DATA.client);
        await db.models.Worker.create(DATA.salesman);
        await db.models.Quote.create(DATA.quote);
        await db.models.Order.create(DATA.order);
        await db.models.Job.create(DATA.job);
      }

      // Arrange:
      let permissions = [ 'create job' ];
      let data = DATA.job;
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.post(`${API_BASE}/jobs`, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`POST /jobs --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/jobs/jobs-service', () => ({
          JobService: () => ({
            createJob: async (values:object) => values
          })
        }));
      } else {
        await db.models.Area.create(DATA.area);
        await db.models.Service.create(DATA.service);
        await db.models.Client.create(DATA.client);
        await db.models.Worker.create(DATA.salesman);
        await db.models.Quote.create(DATA.quote);
        await db.models.Order.create(DATA.order);
      }

      // Arrange:
      let permissions = [ 'create job' ];
      let data = { ...DATA.job };
      delete data.id;
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.post(`${API_BASE}/jobs`, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 201 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
    });
  });

  describe('Retrieving Job', () => {
    it(`GET /jobs/:job --> Not found`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/jobs/jobs-service', () => ({
          JobService: () => ({
            getJob: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/jobs/${DATA.job.id}`;
      let permissions = [ 'get job' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /jobs/:job --> Successfully`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/jobs/jobs-service', () => ({
          JobService: () => ({
            getJob: async (job_id:string, options?:object) => DATA.job
          })
        }));
      } else {
        await db.models.Area.create(DATA.area);
        await db.models.Service.create(DATA.service);
        await db.models.Client.create(DATA.client);
        await db.models.Worker.create(DATA.salesman);
        await db.models.Quote.create(DATA.quote);
        await db.models.Order.create(DATA.order);
        await db.models.Job.create(DATA.job);
      }

      // Arrange:
      let endpoint = `${API_BASE}/jobs/${DATA.job.id}`;
      let permissions = [ 'get job' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.id).toEqual(DATA.job.id);
    });
  });

  describe('Updating Job', () => {
    it(`PATCH /jobs/:job --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/jobs/jobs-service', () => ({
          JobService: () => ({
            updateJob: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/jobs/${DATA.job.id}`;
      let permissions = [ 'update job' ];
      let data = { extra: { enabled: true } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`PATCH /jobs/:job --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/jobs/jobs-service', () => ({
          JobService: () => ({
            updateJob: async (job_id:string, values:object, options?:object) => values
          })
        }));
      } else {
        await db.models.Area.create(DATA.area);
        await db.models.Service.create(DATA.service);
        await db.models.Client.create(DATA.client);
        await db.models.Worker.create(DATA.salesman);
        await db.models.Quote.create(DATA.quote);
        await db.models.Order.create(DATA.order);
        await db.models.Job.create(DATA.job);
      }

      // Arrange:
      let endpoint = `${API_BASE}/jobs/${DATA.job.id}`;
      let permissions = [ 'update job' ];
      let data = { extra: { enabled: true } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data.extra).toEqual({ enabled: true });
    });
  });

  describe('Deleting Job', () => {
    it(`DELETE /jobs/:job --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/jobs/jobs-service', () => ({
          JobService: () => ({
            deleteJob: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/jobs/${DATA.job.id}`;
      let permissions = [ 'delete job' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`DELETE /jobs/:job --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/jobs/jobs-service', () => ({
          JobService: () => ({
            deleteJob: async (job_id:string, options?:object) => ({
              id: job_id,
              updated_at: new Date('2019-10-10'),
              deleted_at: new Date('2019-10-10')
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
        await db.models.Job.create(DATA.job);
      }

      // Arrange:
      let endpoint = `${API_BASE}/jobs/${DATA.job.id}`;
      let permissions = [ 'delete job' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data.id).toEqual(DATA.job.id);
      expect(res.body.data.deleted_at).not.toBe(null);
    });
  });

  describe('Retrieving Subjobs', () => {
    it(`GET /jobs/:job/subjobs --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/jobs/jobs-service', () => ({
          JobService: () => ({
            getSubjobs: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/jobs/${DATA.job.id}/subjobs`;
      let permissions = [ 'get subjobs from job' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /jobs/:job/subjobs --> Successfully`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/jobs/jobs-service', () => ({
          JobService: () => ({
            getSubjobs: async (job_id:string, options?:object) => [{
              ...DATA.subjob,
              JobSubjob: DATA.job
            }]
          })
        }));
      } else {
        await db.models.Area.create(DATA.area);
        await db.models.Service.create(DATA.service);
        await db.models.Client.create(DATA.client);
        await db.models.Worker.create(DATA.salesman);
        await db.models.Quote.create(DATA.quote);
        await db.models.Order.create(DATA.order);
        let job = await db.models.Job.create(DATA.job);
        let subjob = await db.models.Job.create(DATA.subjob);
        await job.addSubjob(subjob);
      }

      // Arrange:
      let endpoint = `${API_BASE}/jobs/${DATA.job.id}/subjobs`;
      let permissions = [ 'get subjobs from job' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeArray().not.toBeEmpty();
    });
  });

  describe('Adding subjobs', () => {
    it(`PUT /jobs/:job/subjobs --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/jobs/jobs-service', () => ({
          JobService: () => ({
            addSubjobs: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/jobs/${DATA.job.id}/subjobs`;
      let permissions = [ 'add subjobs to job' ];
      let data = { subjobs: [ DATA.subjob.id ] };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.put(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`PUT /jobs/:job/subjobs --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/jobs/jobs-service', () => ({
          JobService: () => ({
            addSubjobs: async (job_id:string, subjobs:string[]) => [ DATA.jobSubjob ]
          })
        }));
      } else {
        await db.models.Area.create(DATA.area);
        await db.models.Service.create(DATA.service);
        await db.models.Client.create(DATA.client);
        await db.models.Worker.create(DATA.salesman);
        await db.models.Quote.create(DATA.quote);
        await db.models.Order.create(DATA.order);
        await db.models.Job.create(DATA.job);
        await db.models.Job.create(DATA.subjob);
      }

      // Arrange:
      let endpoint = `${API_BASE}/jobs/${DATA.job.id}/subjobs`;
      let permissions = [ 'add subjobs to job' ];
      let data = { subjobs: [ DATA.subjob.id ] };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.put(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 201 });
      expect(res.body.data).toBeArray().not.toBeEmpty();
      expect(res.body.data[0].job_id).toEqual(DATA.job.id);
      expect(res.body.data[0].subjob_id).toEqual(DATA.subjob.id);
    });
  });

  describe('Retrieve subjob', () => {
    it(`GET /jobs/:job/subjobs/:subjob --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/jobs/jobs-service', () => ({
          JobService: () => ({
            getSubjob: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let job_id = DATA.job.id;
      let subjob_id = DATA.subjob.id;
      let endpoint = `${API_BASE}/jobs/${job_id}/subjobs/${subjob_id}`;
      let permissions = [ 'get subjob from job' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /jobs/:job/subjobs/:subjob --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/jobs/jobs-service', () => ({
          JobService: () => ({
            getSubjob: async (job_id:string, subjob_id:string, options?:object) => ({
              ...DATA.subjob,
              JobSubjob: DATA.jobSubjob
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
        let job = await db.models.Job.create(DATA.job);
        let subjob = await db.models.Job.create(DATA.subjob);
        await job.addSubjob(subjob);
      }

      // Arrange:
      let job_id = DATA.job.id;
      let subjob_id = DATA.subjob.id;
      let endpoint = `${API_BASE}/jobs/${job_id}/subjobs/${subjob_id}`;
      let permissions = [ 'get subjob from job' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.id).toEqual(subjob_id);
    });
  });

  describe('Updating subjob', () => {
    it(`PATCH /jobs/:job/subjobs/:subjob --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/jobs/jobs-service', () => ({
          JobService: () => ({
            updateSubjob: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let job_id = DATA.job.id;
      let subjob_id = DATA.subjob.id;
      let endpoint = `${API_BASE}/jobs/${job_id}/subjobs/${subjob_id}`;
      let permissions = [ 'update subjob from job' ];
      let data = { extra: { enabled: true } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`PATCH /jobs/:job/subjobs/:subjob --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/jobs/jobs-service', () => ({
          JobService: () => ({
            updateSubjob: async (job_id:string, subjob_id:string, values:object, options?:object) => ({
              job_id: job_id,
              subjob_id: subjob_id,
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
        let job = await db.models.Job.create(DATA.job);
        let subjob = await db.models.Job.create(DATA.subjob);
        await job.addSubjob(subjob);
      }

      // Arrange:
      let job_id = DATA.job.id;
      let subjob_id = DATA.subjob.id;
      let endpoint = `${API_BASE}/jobs/${job_id}/subjobs/${subjob_id}`;
      let permissions = [ 'update subjob from job' ];
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

  describe('Deleting subjob', () => {
    it(`DELETE /jobs/:job/subjobs/:subjob --> Failed - exception`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/jobs/jobs-service', () => ({
          JobService: () => ({
            deleteSubjob: helpers.serviceNotFoundError
          })
        }));
      } else {
        await db.models.Area.create(DATA.area);
        await db.models.Service.create(DATA.service);
        await db.models.Client.create(DATA.client);
        await db.models.Worker.create(DATA.salesman);
        await db.models.Quote.create(DATA.quote);
        await db.models.Order.create(DATA.order);
        await db.models.Job.create(DATA.job);
      }

      // Arrange:
      let job_id = DATA.job.id;
      let subjob_id = DATA.subjob.id;
      let endpoint = `${API_BASE}/jobs/${job_id}/subjobs/${subjob_id}`;
      let permissions = [ 'delete subjob from job' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`DELETE /jobs/:job/subjobs/:subjob --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/jobs/jobs-service', () => ({
          JobService: () => ({
            deleteSubjob: async (job_id:string, subjob_id:string, options?:object) => ({
              job_id: job_id,
              subjob_id: subjob_id,
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
        let job = await db.models.Job.create(DATA.job);
        let subjob = await db.models.Job.create(DATA.subjob);
        await job.addSubjob(subjob);
      }

      // Arrange:
      let job_id = DATA.job.id;
      let subjob_id = DATA.subjob.id;
      let endpoint = `${API_BASE}/jobs/${job_id}/subjobs/${subjob_id}`;
      let permissions = [ 'delete subjob from job' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.job_id).toEqual(job_id);
      expect(res.body.data.subjob_id).toEqual(subjob_id);
      expect(res.body.data.deleted_at).not.toBe(null);
    });
  });

  describe('Retrieving Workers', () => {
    it(`GET /jobs/:job/workers --> Failed - exception`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/jobs/jobs-service', () => ({
          JobService: () => ({
            getWorkers: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let job_id = DATA.job.id;
      let endpoint = `${API_BASE}/jobs/${job_id}/workers`;
      let permissions = [ 'get workers from job' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /jobs/:job/workers --> Successfully`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/jobs/jobs-service', () => ({
          JobService: () => ({
            getWorkers: async (job_id:string, options?:object) => [{
              ...DATA.worker,
              JobWorker: DATA.job
            }]
          })
        }));
      } else {
        await db.models.Area.create(DATA.area);
        await db.models.Service.create(DATA.service);
        await db.models.Client.create(DATA.client);
        await db.models.Worker.create(DATA.salesman);
        await db.models.Quote.create(DATA.quote);
        await db.models.Order.create(DATA.order);
        let job = await db.models.Job.create(DATA.job);
        let worker = await db.models.Worker.create(DATA.worker);
        await job.addWorker(worker);
      }

      // Arrange:
      let endpoint = `${API_BASE}/jobs/${DATA.job.id}/workers`;
      let permissions = [ 'get workers from job' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeArray().not.toBeEmpty();
    });
  });

  describe('Adding workers', () => {
    it(`PUT /jobs/:job/workers --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/jobs/jobs-service', () => ({
          JobService: () => ({
            addWorkers: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let job_id = DATA.job.id;
      let worker_id = DATA.worker.id;
      let endpoint = `${API_BASE}/jobs/${job_id}/workers`;
      let permissions = [ 'add workers to job' ];
      let data = { workers: [ worker_id ] };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.put(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`PUT /jobs/:job/workers --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/jobs/jobs-service', () => ({
          JobService: () => ({
            addWorkers: async (job_id:string, workers:string[]) => [ DATA.jobWorker ]
          })
        }));
      } else {
        await db.models.Area.create(DATA.area);
        await db.models.Service.create(DATA.service);
        await db.models.Client.create(DATA.client);
        await db.models.Worker.create(DATA.salesman);
        await db.models.Quote.create(DATA.quote);
        await db.models.Order.create(DATA.order);
        await db.models.Job.create(DATA.job);
        await db.models.Worker.create(DATA.worker);
      }

      // Arrange:
      let endpoint = `${API_BASE}/jobs/${DATA.job.id}/workers`;
      let permissions = [ 'add workers to job' ];
      let data = { workers: [ DATA.worker.id ] };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.put(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 201 });
      expect(res.body.data).toBeArray().not.toBeEmpty();
      expect(res.body.data[0].job_id).toEqual(DATA.job.id);
      expect(res.body.data[0].worker_id).toEqual(DATA.worker.id);
    });
  });

  describe('Retrieve worker', () => {
    it(`GET /jobs/:job/workers/:worker --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/jobs/jobs-service', () => ({
          JobService: () => ({
            getWorker: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let job_id = DATA.job.id;
      let worker_id = DATA.worker.id;
      let endpoint = `${API_BASE}/jobs/${job_id}/workers/${worker_id}`;
      let permissions = [ 'get worker from job' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /jobs/:job/workers/:worker --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/jobs/jobs-service', () => ({
          JobService: () => ({
            getWorker: async (job_id:string, worker_id:string, options?:object) => ({
              ...DATA.worker,
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
        let job = await db.models.Job.create(DATA.job);
        let worker = await db.models.Worker.create(DATA.worker);
        await job.addWorker(worker);
      }

      // Arrange:
      let job_id = DATA.job.id;
      let worker_id = DATA.worker.id;
      let endpoint = `${API_BASE}/jobs/${job_id}/workers/${worker_id}`;
      let permissions = [ 'get worker from job' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.id).toEqual(worker_id);
    });
  });

  describe('Updating worker', () => {
    it(`PATCH /jobs/:job/workers/:worker --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/jobs/jobs-service', () => ({
          JobService: () => ({
            updateWorker: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let job_id = DATA.job.id;
      let worker_id = DATA.worker.id;
      let endpoint = `${API_BASE}/jobs/${job_id}/workers/${worker_id}`;
      let permissions = [ 'update worker from job' ];
      let data = { extra: { enabled: true } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`PATCH /jobs/:job/workers/:worker --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/jobs/jobs-service', () => ({
          JobService: () => ({
            updateWorker: async (job_id:string, worker_id:string, values:object, options?:object) => ({
              job_id: job_id,
              worker_id: worker_id,
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
        let job = await db.models.Job.create(DATA.job);
        let worker = await db.models.Worker.create(DATA.worker);
        await job.addWorker(worker);
      }

      // Arrange:
      let job_id = DATA.job.id;
      let worker_id = DATA.worker.id;
      let endpoint = `${API_BASE}/jobs/${job_id}/workers/${worker_id}`;
      let permissions = [ 'update worker from job' ];
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

  describe('Deleting worker', () => {
    it(`DELETE /jobs/:job/workers/:worker --> Failed - exception`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/jobs/jobs-service', () => ({
          JobService: () => ({
            deleteWorker: helpers.serviceNotFoundError
          })
        }));
      } else {
        await db.models.Area.create(DATA.area);
        await db.models.Service.create(DATA.service);
        await db.models.Client.create(DATA.client);
        await db.models.Worker.create(DATA.salesman);
        await db.models.Quote.create(DATA.quote);
        await db.models.Order.create(DATA.order);
        await db.models.Job.create(DATA.job);
      }

      // Arrange:
      let job_id = DATA.job.id;
      let worker_id = DATA.worker.id;
      let endpoint = `${API_BASE}/jobs/${job_id}/workers/${worker_id}`;
      let permissions = [ 'delete worker from job' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`DELETE /jobs/:job/workers/:worker --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/jobs/jobs-service', () => ({
          JobService: () => ({
            deleteWorker: async (job_id:string, worker_id:string, options?:object) => ({
              job_id: job_id,
              worker_id: worker_id,
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
        let job = await db.models.Job.create(DATA.job);
        let worker = await db.models.Worker.create(DATA.worker);
        await job.addWorker(worker);
      }

      // Arrange:
      let job_id = DATA.job.id;
      let worker_id = DATA.worker.id;
      let endpoint = `${API_BASE}/jobs/${job_id}/workers/${worker_id}`;
      let permissions = [ 'delete worker from job' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.job_id).toEqual(job_id);
      expect(res.body.data.worker_id).toEqual(worker_id);
      expect(res.body.data.deleted_at).not.toBe(null);
    });
  });

  describe('Retrieving Materials', () => {
    it(`GET /jobs/:job/materials --> Failed - exception`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/jobs/jobs-service', () => ({
          JobService: () => ({
            getMaterials: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let job_id = DATA.job.id;
      let endpoint = `${API_BASE}/jobs/${job_id}/materials`;
      let permissions = [ 'get materials from job' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /jobs/:job/materials --> Successfully`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/jobs/jobs-service', () => ({
          JobService: () => ({
            getMaterials: async (job_id:string, options?:object) => [{
              ...DATA.material,
              JobMaterial: DATA.job
            }]
          })
        }));
      } else {
        await db.models.Area.create(DATA.area);
        await db.models.Service.create(DATA.service);
        await db.models.Client.create(DATA.client);
        await db.models.Worker.create(DATA.salesman);
        await db.models.Quote.create(DATA.quote);
        await db.models.Order.create(DATA.order);
        await db.models.Category.create(DATA.category);
        let job = await db.models.Job.create(DATA.job);
        let material = await db.models.Material.create(DATA.material);
        await job.addMaterial(material);
      }

      // Arrange:
      let endpoint = `${API_BASE}/jobs/${DATA.job.id}/materials`;
      let permissions = [ 'get materials from job' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeArray().not.toBeEmpty();
    });
  });

  describe('Adding materials', () => {
    it(`PUT /jobs/:job/materials --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/jobs/jobs-service', () => ({
          JobService: () => ({
            addMaterials: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let job_id = DATA.job.id;
      let material_id = DATA.material.id;
      let endpoint = `${API_BASE}/jobs/${job_id}/materials`;
      let permissions = [ 'add materials to job' ];
      let data = { materials: [ material_id ] };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.put(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`PUT /jobs/:job/materials --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/jobs/jobs-service', () => ({
          JobService: () => ({
            addMaterials: async (job_id:string, materials:string[]) => [ DATA.jobMaterial ]
          })
        }));
      } else {
        await db.models.Area.create(DATA.area);
        await db.models.Service.create(DATA.service);
        await db.models.Client.create(DATA.client);
        await db.models.Worker.create(DATA.salesman);
        await db.models.Quote.create(DATA.quote);
        await db.models.Order.create(DATA.order);
        await db.models.Job.create(DATA.job);
        await db.models.Category.create(DATA.category);
        await db.models.Material.create(DATA.material);
      }

      // Arrange:
      let endpoint = `${API_BASE}/jobs/${DATA.job.id}/materials`;
      let permissions = [ 'add materials to job' ];
      let data = { materials: [ DATA.material.id ] };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.put(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 201 });
      expect(res.body.data).toBeArray().not.toBeEmpty();
      expect(res.body.data[0].job_id).toEqual(DATA.job.id);
      expect(res.body.data[0].material_id).toEqual(DATA.material.id);
    });
  });

  describe('Retrieve material', () => {
    it(`GET /jobs/:job/materials/:material --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/jobs/jobs-service', () => ({
          JobService: () => ({
            getMaterial: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let job_id = DATA.job.id;
      let material_id = DATA.material.id;
      let endpoint = `${API_BASE}/jobs/${job_id}/materials/${material_id}`;
      let permissions = [ 'get material from job' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /jobs/:job/materials/:material --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/jobs/jobs-service', () => ({
          JobService: () => ({
            getMaterial: async (job_id:string, material_id:string, options?:object) => ({
              ...DATA.material,
              JobMaterial: DATA.jobMaterial
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
        await db.models.Category.create(DATA.category);
        let job = await db.models.Job.create(DATA.job);
        let material = await db.models.Material.create(DATA.material);
        await job.addMaterial(material);
      }

      // Arrange:
      let job_id = DATA.job.id;
      let material_id = DATA.material.id;
      let endpoint = `${API_BASE}/jobs/${job_id}/materials/${material_id}`;
      let permissions = [ 'get material from job' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.id).toEqual(material_id);
    });
  });

  describe('Updating material', () => {
    it(`PATCH /jobs/:job/materials/:material --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/jobs/jobs-service', () => ({
          JobService: () => ({
            updateMaterial: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let job_id = DATA.job.id;
      let material_id = DATA.material.id;
      let endpoint = `${API_BASE}/jobs/${job_id}/materials/${material_id}`;
      let permissions = [ 'update material from job' ];
      let data = { extra: { enabled: true } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`PATCH /jobs/:job/materials/:material --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/jobs/jobs-service', () => ({
          JobService: () => ({
            updateMaterial: async (job_id:string, material_id:string, values:object, options?:object) => ({
              job_id: job_id,
              material_id: material_id,
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
        await db.models.Category.create(DATA.category);
        let job = await db.models.Job.create(DATA.job);
        let material = await db.models.Material.create(DATA.material);
        await job.addMaterial(material);
      }

      // Arrange:
      let job_id = DATA.job.id;
      let material_id = DATA.material.id;
      let endpoint = `${API_BASE}/jobs/${job_id}/materials/${material_id}`;
      let permissions = [ 'update material from job' ];
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

  describe('Deleting material', () => {
    it(`DELETE /jobs/:job/materials/:material --> Failed - exception`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/jobs/jobs-service', () => ({
          JobService: () => ({
            deleteMaterial: helpers.serviceNotFoundError
          })
        }));
      } else {
        await db.models.Area.create(DATA.area);
        await db.models.Service.create(DATA.service);
        await db.models.Client.create(DATA.client);
        await db.models.Worker.create(DATA.salesman);
        await db.models.Quote.create(DATA.quote);
        await db.models.Order.create(DATA.order);
        await db.models.Job.create(DATA.job);
        await db.models.Category.create(DATA.category);
      }

      // Arrange:
      let job_id = DATA.job.id;
      let material_id = DATA.material.id;
      let endpoint = `${API_BASE}/jobs/${job_id}/materials/${material_id}`;
      let permissions = [ 'delete material from job' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`DELETE /jobs/:job/materials/:material --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/jobs/jobs-service', () => ({
          JobService: () => ({
            deleteMaterial: async (job_id:string, material_id:string, options?:object) => ({
              job_id: job_id,
              material_id: material_id,
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
        await db.models.Category.create(DATA.category);
        let job = await db.models.Job.create(DATA.job);
        let material = await db.models.Material.create(DATA.material);
        await job.addMaterial(material);
      }

      // Arrange:
      let job_id = DATA.job.id;
      let material_id = DATA.material.id;
      let endpoint = `${API_BASE}/jobs/${job_id}/materials/${material_id}`;
      let permissions = [ 'delete material from job' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.job_id).toEqual(job_id);
      expect(res.body.data.material_id).toEqual(material_id);
      expect(res.body.data.deleted_at).not.toBe(null);
    });
  });
});
