import '../../../config/global';
import db from '../../../../src/providers/postgres';
import * as DATA from '../../../config/models';
import Helpers from '../../../config/helpers';

describe('Services - Controller', () => {
  const API_BASE = '/v1';
  const helpers = Helpers(db);

  beforeEach(helpers.destroyData);
  afterEach(helpers.restoreMocks);
  afterAll(helpers.closeConnections);

  describe('Retrieving Services', () => {
    it('GET /services --> Successfully', async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/services/services-service', () => ({
          ServiceService: () => ({
            getServices: async (options?:object) => [ DATA.service ]
          })
        }));
      } else {
        await db.models.Area.create(DATA.area);
        await db.models.Service.create(DATA.service);
      }

      // Arrange:
      let permissions = [ 'get services' ];
      let query = {};
      let payload = { permissions, query };

      // Act:
      let res = await helpers.request.get(`${API_BASE}/services`, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeArray().not.toBeEmpty();
      expect(res.body.data[0]).toBeObject().not.toBeEmpty();
    });
  });

  describe('Creating Service', () => {
    it(`POST /services --> There is an service with the same name`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/services/services-service', () => ({
          ServiceService: () => ({
            createService: helpers.serviceUniqueError
          })
        }));
      } else {
        await db.models.Area.create(DATA.area);
        await db.models.Service.create(DATA.service);
      }

      // Arrange:
      let permissions = [ 'create service' ];
      let data = DATA.service;
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.post(`${API_BASE}/services`, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`POST /services --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/services/services-service', () => ({
          ServiceService: () => ({
            createService: async (values:object) => values
          })
        }));
      } else {
        await db.models.Area.create(DATA.area);
      }

      // Arrange:
      let permissions = [ 'create service' ];
      let data = DATA.service;
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.post(`${API_BASE}/services`, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 201 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
    });
  });

  describe('Retrieving Service', () => {
    it(`GET /services/:service --> Not found`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/services/services-service', () => ({
          ServiceService: () => ({
            getService: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/services/${DATA.service.id}`;
      let permissions = [ 'get service' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /services/:service --> Successfully`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/services/services-service', () => ({
          ServiceService: () => ({
            getService: async (service_id:string, options?:object) => DATA.service
          })
        }));
      } else {
        await db.models.Area.create(DATA.area);
        await db.models.Service.create(DATA.service);
      }

      // Arrange:
      let endpoint = `${API_BASE}/services/${DATA.service.id}`;
      let permissions = [ 'get service' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.id).toEqual(DATA.service.id);
    });
  });

  describe('Updating Service', () => {
    it(`PATCH /services/:service --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/services/services-service', () => ({
          ServiceService: () => ({
            updateService: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/services/${DATA.service.id}`;
      let permissions = [ 'update service' ];
      let data = { extra: { enabled: true } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`PATCH /services/:service --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/services/services-service', () => ({
          ServiceService: () => ({
            updateService: async (service_id:string, values:object, options?:object) => values
          })
        }));
      } else {
        await db.models.Area.create(DATA.area);
        await db.models.Service.create(DATA.service);
      }

      // Arrange:
      let endpoint = `${API_BASE}/services/${DATA.service.id}`;
      let permissions = [ 'update service' ];
      let data = { extra: { enabled: true } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data.extra).toEqual({ enabled: true });
    });
  });

  describe('Deleting Service', () => {
    it(`DELETE /services/:service --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/services/services-service', () => ({
          ServiceService: () => ({
            deleteService: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/services/${DATA.service.id}`;
      let permissions = [ 'delete service' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`DELETE /services/:service --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/services/services-service', () => ({
          ServiceService: () => ({
            deleteService: async (service_id:string, options?:object) => ({
              id: service_id,
              updated_at: new Date('2019-10-10'),
              deleted_at: new Date('2019-10-10')
            })
          })
        }));
      } else {
        await db.models.Area.create(DATA.area);
        await db.models.Service.create(DATA.service);
      }

      // Arrange:
      let endpoint = `${API_BASE}/services/${DATA.service.id}`;
      let permissions = [ 'delete service' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data.id).toEqual(DATA.service.id);
      expect(res.body.data.deleted_at).not.toBe(null);
    });
  });

  describe('Retrieving Jobs', () => {
    it(`GET /services/:service/jobs --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/services/services-service', () => ({
          ServiceService: () => ({
            getJobs: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let service_id = DATA.service.id;
      let endpoint = `${API_BASE}/services/${service_id}/jobs`;
      let permissions = [ 'get jobs from service' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /services/:service/jobs --> Successfully`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/services/services-service', () => ({
          ServiceService: () => ({
            getJobs: async (service_id:string, options?:object) => [ DATA.job ]
          })
        }));
      } else {
        let area = await db.models.Area.create(DATA.area);
        let service = await db.models.Service.create(DATA.service);
        let client = await db.models.Client.create(DATA.client);
        let salesman = await db.models.Worker.create(DATA.salesman);
        let quote = await db.models.Quote.create(DATA.quote);
        let order = await db.models.Order.create(DATA.order);
        let job = await db.models.Job.create(DATA.job);
        await service.addJob(job);
      }

      // Arrange:
      let endpoint = `${API_BASE}/services/${DATA.service.id}/jobs`;
      let permissions = [ 'get jobs from service' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeArray().not.toBeEmpty();
    });
  });

  describe('Retrieve job', () => {
    it(`GET /services/:service/jobs/:job --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/services/services-service', () => ({
          ServiceService: () => ({
            getJob: helpers.serviceNotFoundError
          })
        }));
      } else {
        await db.models.Area.create(DATA.area);
        await db.models.Service.create(DATA.service);
      }

      // Arrange:
      let service_id = DATA.service.id;
      let job_id = DATA.job.id;
      let endpoint = `${API_BASE}/services/${service_id}/jobs/${job_id}`;
      let permissions = [ 'get job from service' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /services/:service/jobs/:job --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/services/services-service', () => ({
          ServiceService: () => ({
            getJob: async (service_id:string, job_id:string, options?:object) => DATA.job
          })
        }));
      } else {
        let area = await db.models.Area.create(DATA.area);
        let service = await db.models.Service.create(DATA.service);
        let client = await db.models.Client.create(DATA.client);
        let salesman = await db.models.Worker.create(DATA.salesman);
        let quote = await db.models.Quote.create(DATA.quote);
        let order = await db.models.Order.create(DATA.order);
        let job = await db.models.Job.create(DATA.job);
        await service.addJob(job);
      }

      // Arrange:
      let service_id = DATA.service.id;
      let job_id = DATA.job.id;
      let endpoint = `${API_BASE}/services/${service_id}/jobs/${job_id}`;
      let permissions = [ 'get job from service' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.id).toEqual(job_id);
    });
  });
});
