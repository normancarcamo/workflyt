const db = require('src/providers/postgres');
const DATA = require('test/config/models');
const helpers = require('test/config/helpers')(db);
const API_BASE = '/v1';

describe('Workers - Controller', () => {
  beforeEach(helpers.destroyData);
  afterEach(helpers.restoreMocks);
  afterAll(helpers.closeConnections);

  describe('Retrieving Workers', () => {
    it('GET /workers --> Invalid Rights', async () => {
      // Arrange:
      let permissions = [ 'unknow' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(`${API_BASE}/workers`, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it('GET /workers --> Invalid input', async () => {
      // Arrange:
      let permissions = [ 'get workers' ];
      let query = { unknown: 'dm' };
      let payload = { permissions, query };

      // Act:
      let res = await helpers.request.get(`${API_BASE}/workers`, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it('GET /workers --> Successfully', async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/workers/workers-service', () => () => ({
          getWorkers: async options => [ DATA.worker ]
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
    it(`POST /workers --> Invalid Rights`, async () => {
      // Arrange:
      let permissions = [ 'unknown' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.post(`${API_BASE}/workers`, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`POST /workers --> Invalid input`, async () => {
      // Arrange:
      let permissions = [ 'create worker' ];
      let data = { unknownProperty: 'mm' };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.post(`${API_BASE}/workers`, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`POST /workers --> There is an worker with the same name`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/workers/workers-service', () => () => ({
          createWorker: helpers.serviceUniqueError
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
        jest.doMock('src/core/workers/workers-service', () => () => ({
          createWorker: async values => values
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
    it(`GET /workers/:worker --> Invalid Rights`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/workers/${DATA.worker.id}`;
      let permissions = [ 'unknown privilege' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`GET /workers/:worker --> Invalid input`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/workers/kdjsnkjnfksjndkfjnmm`;
      let permissions = [ 'get worker' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`GET /workers/:worker --> Not found`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/workers/workers-service', () => () => ({
          getWorker: helpers.serviceNotFoundError
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
        jest.doMock('src/core/workers/workers-service', () => () => ({
          getWorker: async ({ worker_id, options }) => DATA.worker
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
    it(`PATCH /workers/:worker --> Invalid Rights`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/workers/${DATA.worker.id}`;
      let permissions = [ 'unknown privilege' ];
      let data = { name: 'New name updated' };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`PATCH /workers/:worker --> Invalid input`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/workers/${DATA.worker.id}`;
      let permissions = [ 'update worker' ];
      let data = { namemmm: 'New name updated' };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`PATCH /workers/:worker --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/workers/workers-service', () => () => ({
          updateWorker: helpers.serviceNotFoundError
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
        jest.doMock('src/core/workers/workers-service', () => () => ({
          updateWorker: async ({ worker_id, values, options }) => values
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
    it(`DELETE /workers/:worker --> Invalid Rights`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/workers/${DATA.worker.id}`;
      let permissions = [ 'unknown' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`DELETE /workers/:worker --> Invalid input`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/workers/sjdbjhsbdjhfbsdjhfbjsdhfb`;
      let permissions = [ 'delete worker' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`DELETE /workers/:worker --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/workers/workers-service', () => () => ({
          deleteWorker: helpers.serviceNotFoundError
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
        jest.doMock('src/core/workers/workers-service', () => () => ({
          deleteWorker: async ({ worker_id, options }) => ({
            id: worker_id,
            updated_at: new Date('2019-10-10'),
            deleted_at: new Date('2019-10-10')
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
    it(`GET /workers/:worker/supervisors --> Invalid rights`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/workers/${DATA.worker.id}/supervisors`;
      let permissions = [ 'unknown' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`GET /workers/:worker/supervisors --> Invalid input`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/workers/${DATA.worker.id}/supervisors`;
      let permissions = [ 'get supervisors from worker' ];
      let query = { attributes: [ 'nanana' ] };
      let payload = { permissions, query };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`GET /workers/:worker/supervisors --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/workers/workers-service', () => () => ({
          getSupervisors: helpers.serviceNotFoundError
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
        jest.doMock('src/core/workers/workers-service', () => () => ({
          getSupervisors: async ({ worker_id, options }) => [{
            ...DATA.supervisor,
            WorkerSupervisor: DATA.worker
          }]
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
    it(`PUT /workers/:worker/supervisors --> Invalid rights`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/workers/${DATA.worker.id}/supervisors`;
      let permissions = [ 'unknown' ];
      let data = { supervisors: [] };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.put(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`PUT /workers/:worker/supervisors --> Invalid input`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/workers/${DATA.worker.id}/supervisors`;
      let permissions = [ 'add supervisors to worker' ];
      let data = { supervisors: [ 'welkdnfksnksjdnf' ] };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.put(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`PUT /workers/:worker/supervisors --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/workers/workers-service', () => () => ({
          addSupervisors: helpers.serviceNotFoundError
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
        jest.doMock('src/core/workers/workers-service', () => () => ({
          addSupervisors: async ({ worker_id, supervisors }) => [
            DATA.workerSupervisor
          ]
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
    it(`GET /workers/:worker/supervisors/:supervisor --> Invalid rights`, async () => {
      // Arrange:
      let worker_id = DATA.worker.id;
      let supervisor_id = DATA.supervisor.id;
      let endpoint = `${API_BASE}/workers/${worker_id}/supervisors/${supervisor_id}`;
      let permissions = [ 'unknown' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`GET /workers/:worker/supervisors/:supervisor --> Invalid input`, async () => {
      // Arrange:
      let worker_id = DATA.worker.id;
      let supervisor_id = DATA.supervisor.id;
      let endpoint = `${API_BASE}/workers/${worker_id}/supervisors/${supervisor_id}`;
      let permissions = [ 'get supervisor from worker' ];
      let query = { attributes: [ 'skmksms' ] };
      let payload = { permissions, query };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`GET /workers/:worker/supervisors/:supervisor --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/workers/workers-service', () => () => ({
          getSupervisor: helpers.serviceNotFoundError
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
        jest.doMock('src/core/workers/workers-service', () => () => ({
          getSupervisor: async ({ worker_id, supervisor_id, options }) => ({
            ...DATA.supervisor,
            WorkerSupervisor: DATA.workerSupervisor
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
    it(`PATCH /workers/:worker/supervisors/:supervisor --> Invalid rights`, async () => {
      // Arrange:
      let worker_id = DATA.worker.id;
      let supervisor_id = DATA.supervisor.id;
      let endpoint = `${API_BASE}/workers/${worker_id}/supervisors/${supervisor_id}`;
      let permissions = [ 'jdsnkjnsfkj' ];
      let data = { extra: { enabled: true } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`PATCH /workers/:worker/supervisors/:supervisor --> Invalid input`, async () => {
      // Arrange:
      let worker_id = DATA.worker.id;
      let supervisor_id = DATA.supervisor.id;
      let endpoint = `${API_BASE}/workers/${worker_id}/supervisors/${supervisor_id}`;
      let permissions = [ 'update supervisor from worker' ];
      let data = { unknownProperty: { units: 20 } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`PATCH /workers/:worker/supervisors/:supervisor --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/workers/workers-service', () => () => ({
          updateSupervisor: helpers.serviceNotFoundError
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
        jest.doMock('src/core/workers/workers-service', () => () => ({
          updateSupervisor: async ({ worker_id, supervisor_id, values, options }) => ({
            worker_id: worker_id,
            supervisor_id: supervisor_id,
            ...values
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
    it(`DELETE /workers/:worker/supervisors/:supervisor --> Invalid rights`, async () => {
      // Arrange:
      let worker_id = DATA.worker.id;
      let supervisor_id = DATA.supervisor.id;
      let endpoint = `${API_BASE}/workers/${worker_id}/supervisors/${supervisor_id}`;
      let permissions = [ 'jdbjhdbdfjhb' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`DELETE /workers/:worker/supervisors/:supervisor --> Invalid input`, async () => {
      // Arrange:
      let worker_id = DATA.worker.id;
      let supervisor_id = DATA.supervisor.id;
      let endpoint = `${API_BASE}/workers/${worker_id}/supervisors/${supervisor_id}`;
      let permissions = [ 'delete supervisor from worker' ];
      let query = { force: 'sdkjnskjnfksdjnf' };
      let payload = { permissions, query };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`DELETE /workers/:worker/supervisors/:supervisor --> Failed - exception`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/workers/workers-service', () => () => ({
          deleteSupervisor: helpers.serviceNotFoundError
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
        jest.doMock('src/core/workers/workers-service', () => () => ({
          deleteSupervisor: async ({ worker_id, supervisor_id, options }) => ({
            worker_id: worker_id,
            supervisor_id: supervisor_id,
            deleted_at: new Date()
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
    it(`GET /workers/:worker/jobs --> Invalid rights`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/workers/${DATA.worker.id}/jobs`;
      let permissions = [ 'unknown' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`GET /workers/:worker/jobs --> Invalid input`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/workers/${DATA.worker.id}/jobs`;
      let permissions = [ 'get jobs from worker' ];
      let query = { attributes: [ 'nanana' ] };
      let payload = { permissions, query };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`GET /workers/:worker/jobs --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/workers/workers-service', () => () => ({
          getJobs: helpers.serviceNotFoundError
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
        jest.doMock('src/core/workers/workers-service', () => () => ({
          getJobs: async ({ worker_id, options }) => [{
            ...DATA.job,
            JobWorker: DATA.worker
          }]
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
    it(`PUT /workers/:worker/jobs --> Invalid rights`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/workers/${DATA.worker.id}/jobs`;
      let permissions = [ 'unknown' ];
      let data = { jobs: [] };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.put(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`PUT /workers/:worker/jobs --> Invalid input`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/workers/${DATA.worker.id}/jobs`;
      let permissions = [ 'add jobs to worker' ];
      let data = { jobs: [ 'welkdnfksnksjdnf' ] };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.put(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`PUT /workers/:worker/jobs --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/workers/workers-service', () => () => ({
          addJobs: helpers.serviceNotFoundError
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
        jest.doMock('src/core/workers/workers-service', () => () => ({
          addJobs: async ({ worker_id, jobs }) => [
            DATA.jobWorker
          ]
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
    it(`GET /workers/:worker/jobs/:job --> Invalid rights`, async () => {
      // Arrange:
      let worker_id = DATA.worker.id;
      let job_id = DATA.job.id;
      let endpoint = `${API_BASE}/workers/${worker_id}/jobs/${job_id}`;
      let permissions = [ 'unknown' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`GET /workers/:worker/jobs/:job --> Invalid input`, async () => {
      // Arrange:
      let worker_id = DATA.worker.id;
      let job_id = DATA.job.id;
      let endpoint = `${API_BASE}/workers/${worker_id}/jobs/${job_id}`;
      let permissions = [ 'get job from worker' ];
      let query = { attributes: [ 'skmksms' ] };
      let payload = { permissions, query };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`GET /workers/:worker/jobs/:job --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/workers/workers-service', () => () => ({
          getJob: helpers.serviceNotFoundError
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
        jest.doMock('src/core/workers/workers-service', () => () => ({
          getJob: async ({ worker_id, job_id, options }) => ({
            ...DATA.job,
            JobWorker: DATA.jobWorker
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
    it(`PATCH /workers/:worker/jobs/:job --> Invalid rights`, async () => {
      // Arrange:
      let worker_id = DATA.worker.id;
      let job_id = DATA.job.id;
      let endpoint = `${API_BASE}/workers/${worker_id}/jobs/${job_id}`;
      let permissions = [ 'jdsnkjnsfkj' ];
      let data = { extra: { enabled: true } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`PATCH /workers/:worker/jobs/:job --> Invalid input`, async () => {
      // Arrange:
      let worker_id = DATA.worker.id;
      let job_id = DATA.job.id;
      let endpoint = `${API_BASE}/workers/${worker_id}/jobs/${job_id}`;
      let permissions = [ 'update job from worker' ];
      let data = { unknownProperty: { units: 20 } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`PATCH /workers/:worker/jobs/:job --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/workers/workers-service', () => () => ({
          updateJob: helpers.serviceNotFoundError
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
        jest.doMock('src/core/workers/workers-service', () => () => ({
          updateJob: async ({ worker_id, job_id, values, options }) => ({
            worker_id: worker_id,
            job_id: job_id,
            ...values
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
    it(`DELETE /workers/:worker/jobs/:job --> Invalid rights`, async () => {
      // Arrange:
      let worker_id = DATA.worker.id;
      let job_id = DATA.job.id;
      let endpoint = `${API_BASE}/workers/${worker_id}/jobs/${job_id}`;
      let permissions = [ 'jdbjhdbdfjhb' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`DELETE /workers/:worker/jobs/:job --> Invalid input`, async () => {
      // Arrange:
      let worker_id = DATA.worker.id;
      let job_id = DATA.job.id;
      let endpoint = `${API_BASE}/workers/${worker_id}/jobs/${job_id}`;
      let permissions = [ 'delete job from worker' ];
      let query = { force: 'sdkjnskjnfksdjnf' };
      let payload = { permissions, query };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`DELETE /workers/:worker/jobs/:job --> Failed - exception`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/workers/workers-service', () => () => ({
          deleteJob: helpers.serviceNotFoundError
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
        jest.doMock('src/core/workers/workers-service', () => () => ({
          deleteJob: async ({ worker_id, job_id, options }) => ({
            worker_id: worker_id,
            job_id: job_id,
            deleted_at: new Date()
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
    it(`GET /workers/:worker/quotes --> Invalid rights`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/workers/${DATA.worker.id}/quotes`;
      let permissions = [ 'unknown' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`GET /workers/:worker/quotes --> Invalid input`, async () => {
      // Arrange:
      let endpoint = `${API_BASE}/workers/${DATA.worker.id}/quotes`;
      let permissions = [ 'get quotes from worker' ];
      let query = { attributes: [ 'nanana' ] };
      let payload = { permissions, query };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`GET /workers/:worker/quotes --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/workers/workers-service', () => () => ({
          getQuotes: helpers.serviceNotFoundError
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
        jest.doMock('src/core/workers/workers-service', () => () => ({
          getQuotes: async ({ worker_id, options }) => [ DATA.quote ]
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
    it(`GET /workers/:worker/quotes/:quote --> Invalid rights`, async () => {
      // Arrange:
      let worker_id = DATA.worker.id;
      let quote_id = DATA.quote.id;
      let endpoint = `${API_BASE}/workers/${worker_id}/quotes/${quote_id}`;
      let permissions = [ 'unknown' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`GET /workers/:worker/quotes/:quote --> Invalid input`, async () => {
      // Arrange:
      let worker_id = DATA.worker.id;
      let quote_id = DATA.quote.id;
      let endpoint = `${API_BASE}/workers/${worker_id}/quotes/${quote_id}`;
      let permissions = [ 'get quote from worker' ];
      let query = { attributes: [ 'skmksms' ] };
      let payload = { permissions, query };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`GET /workers/:worker/quotes/:quote --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/workers/workers-service', () => () => ({
          getQuote: helpers.serviceNotFoundError
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
        jest.doMock('src/core/workers/workers-service', () => () => ({
          getQuote: async ({ worker_id, quote_id, options }) => DATA.quote
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
    it(`GET /workers/:worker/user --> Invalid rights`, async () => {
      // Arrange:
      let worker_id = DATA.worker.id;
      let endpoint = `${API_BASE}/workers/${worker_id}/user`;
      let permissions = [ 'unknown' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 403 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Forbidden');
    });
    it(`GET /workers/:worker/user --> Invalid input`, async () => {
      // Arrange:
      let worker_id = DATA.worker.id;
      let endpoint = `${API_BASE}/workers/${worker_id}/user`;
      let permissions = [ 'get user from worker' ];
      let query = { attributes: [ 'skmksms' ] };
      let payload = { permissions, query };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`GET /workers/:worker/user --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/workers/workers-service', () => () => ({
          getUser: helpers.serviceNotFoundError
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
        jest.doMock('src/core/workers/workers-service', () => () => ({
          getUser: async ({ worker_id, options }) => DATA.user
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
