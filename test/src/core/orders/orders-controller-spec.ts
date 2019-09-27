import '../../../config/global';
import db from '../../../../src/providers/postgres';
import * as DATA from '../../../config/models';
import Helpers from '../../../config/helpers';

describe('Orders - Controller', () => {
  const API_BASE = '/v1';
  const helpers = Helpers(db);

  beforeEach(helpers.destroyData);
  afterEach(helpers.restoreMocks);
  afterAll(helpers.closeConnections);

  describe('Retrieving Orders', () => {
    it('GET /orders --> Successfully', async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/orders/orders-service', () => ({
          OrderService: () => ({
            getOrders: async (options?:object) => [ DATA.order ]
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
      let permissions = [ 'get orders' ];
      let query = {};
      let payload = { permissions, query };

      // Act:
      let res = await helpers.request.get(`${API_BASE}/orders`, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeArray().not.toBeEmpty();
      expect(res.body.data[0]).toBeObject().not.toBeEmpty();
    });
  });

  describe('Creating Order', () => {
    it(`POST /orders --> There is an order with the same name`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/orders/orders-service', () => ({
          OrderService: () => ({
            createOrder: helpers.serviceUniqueError
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
      let permissions = [ 'create order' ];
      let data = DATA.order;
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.post(`${API_BASE}/orders`, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`POST /orders --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/orders/orders-service', () => ({
          OrderService: () => ({
            createOrder: async (values:object) => values
          })
        }));
      } else {
        await db.models.Area.create(DATA.area);
        await db.models.Service.create(DATA.service);
        await db.models.Client.create(DATA.client);
        await db.models.Worker.create(DATA.salesman);
        await db.models.Quote.create(DATA.quote);
      }

      // Arrange:
      let permissions = [ 'create order' ];
      let data = DATA.order;
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.post(`${API_BASE}/orders`, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 201 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
    });
  });

  describe('Retrieving Order', () => {
    it(`GET /orders/:order --> Not found`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/orders/orders-service', () => ({
          OrderService: () => ({
            getOrder: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/orders/${DATA.order.id}`;
      let permissions = [ 'get order' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /orders/:order --> Successfully`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/orders/orders-service', () => ({
          OrderService: () => ({
            getOrder: async (order_id:string, options?:object) => DATA.order
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
      let endpoint = `${API_BASE}/orders/${DATA.order.id}`;
      let permissions = [ 'get order' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.id).toEqual(DATA.order.id);
    });
  });

  describe('Updating Order', () => {
    it(`PATCH /orders/:order --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/orders/orders-service', () => ({
          OrderService: () => ({
            updateOrder: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/orders/${DATA.order.id}`;
      let permissions = [ 'update order' ];
      let data = { extra: { enabled: true } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`PATCH /orders/:order --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/orders/orders-service', () => ({
          OrderService: () => ({
            updateOrder: async (order_id:string, values:object, options?:object) => values
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
      let endpoint = `${API_BASE}/orders/${DATA.order.id}`;
      let permissions = [ 'update order' ];
      let data = { extra: { enabled: true } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data.extra).toEqual({ enabled: true });
    });
  });

  describe('Deleting Order', () => {
    it(`DELETE /orders/:order --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/orders/orders-service', () => ({
          OrderService: () => ({
            deleteOrder: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/orders/${DATA.order.id}`;
      let permissions = [ 'delete order' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`DELETE /orders/:order --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/orders/orders-service', () => ({
          OrderService: () => ({
            deleteOrder: async (order_id:string, options?:object) => ({
              id: order_id,
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
      }

      // Arrange:
      let endpoint = `${API_BASE}/orders/${DATA.order.id}`;
      let permissions = [ 'delete order' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data.id).toEqual(DATA.order.id);
      expect(res.body.data.deleted_at).not.toBe(null);
    });
  });

  describe('Retrieving Jobs', () => {
    it(`GET /orders/:order/jobs --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/orders/orders-service', () => ({
          OrderService: () => ({
            getJobs: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let order_id = DATA.order.id;
      let endpoint = `${API_BASE}/orders/${order_id}/jobs`;
      let permissions = [ 'get jobs from order' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /orders/:order/jobs --> Successfully`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/orders/orders-service', () => ({
          OrderService: () => ({
            getJobs: async (order_id:string, options?:object) => [ DATA.job ]
          })
        }));
      } else {
        await db.models.Area.create(DATA.area);
        await db.models.Service.create(DATA.service);
        await db.models.Client.create(DATA.client);
        await db.models.Worker.create(DATA.salesman);
        await db.models.Quote.create(DATA.quote);
        let order = await db.models.Order.create(DATA.order);
        let job = await db.models.Job.create(DATA.job);
        await order.addJob(job);
      }

      // Arrange:
      let endpoint = `${API_BASE}/orders/${DATA.order.id}/jobs`;
      let permissions = [ 'get jobs from order' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeArray().not.toBeEmpty();
    });
  });

  describe('Retrieve job', () => {
    it(`GET /orders/:order/jobs/:job --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/orders/orders-service', () => ({
          OrderService: () => ({
            getJob: helpers.serviceNotFoundError
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
      let order_id = DATA.order.id;
      let job_id = DATA.job.id;
      let endpoint = `${API_BASE}/orders/${order_id}/jobs/${job_id}`;
      let permissions = [ 'get job from order' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /orders/:order/jobs/:job --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/orders/orders-service', () => ({
          OrderService: () => ({
            getJob: async (order_id:string, job_id:string, options?:object) => DATA.job
          })
        }));
      } else {
        await db.models.Area.create(DATA.area);
        await db.models.Service.create(DATA.service);
        await db.models.Client.create(DATA.client);
        await db.models.Worker.create(DATA.salesman);
        await db.models.Quote.create(DATA.quote);
        let order = await db.models.Order.create(DATA.order);
        let job = await db.models.Job.create(DATA.job);
        await order.addJob(job);
      }

      // Arrange:
      let order_id = DATA.order.id;
      let job_id = DATA.job.id;
      let endpoint = `${API_BASE}/orders/${order_id}/jobs/${job_id}`;
      let permissions = [ 'get job from order' ];
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
