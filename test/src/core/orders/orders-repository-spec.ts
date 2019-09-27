import '../../../config/global';
import * as DATA from '../../../config/models';
import DATABASE from '../../../config/database';
import { ERROR_BAD_GATEWAY as ACTION_ERROR } from '../../../config/errors';
import { OrderRepository } from '../../../../src/core/orders/orders-repository';

describe('Order Repository', () => {
  const database = { ...DATABASE() };
  const repository = OrderRepository(database);

  beforeEach(async () => { database.models = DATABASE().models; });

  describe('getOrders', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Order.findAll = (async () => { throw ACTION_ERROR; }) as any;

      // Arrange:
      const options = {};

      // Act:
      const res = repository.getOrders(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of orders', async () => {
      // Setup:
      database.models.Order.findAll = (async () => [ DATA.order ]) as any;

      // Arrange:
      const options = {};

      // Act:
      const res = await repository.getOrders(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty().toEqual([ DATA.order ]);
    });
    it('should return an empty list when records are not found', async () => {
      // Setup:
      database.models.Order.findAll = (async () => []) as any;

      // Arrange:
      const options = {};

      // Act:
      const res = await repository.getOrders(options);

      // Assert:
      expect(res).toBeArray().toBeEmpty();
    });
  });

  describe('createOrder', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Order.create = (async () => { throw ACTION_ERROR; }) as any;

      // Arrange:
      const values = DATA.order;

      // Act:
      const res = repository.createOrder(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return order created', async () => {
      // Setup:
      database.models.Order.create = (async () => DATA.order) as any;

      // Arrange:
      const values = DATA.order;

      // Act:
      const res = await repository.createOrder(values);

      // Assert:
      expect(res).toEqual(DATA.order);
    });
  });

  describe('getOrder', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Order.findByPk = (async () => { throw ACTION_ERROR; }) as any;

      // Arrange:
      const order_id = DATA.order.id;
      const options = {};

      // Act:
      const res = repository.getOrder(order_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return null when order was not found', async () => {
      // Setup:
      database.models.Order.findByPk = (async () => null) as any;

      // Arrange:
      const order_id = DATA.order.id;
      const options = {};

      // Act:
      const res = await repository.getOrder(order_id, options);

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and strict is set true', () => {
      // Setup:
      database.models.Order.findByPk = (async () => null) as any;

      // Arrange:
      const order_id = DATA.order.id;
      const options = {};

      // Act:
      const res = repository.getOrder(order_id, options, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return order when is found', async () => {
      // Setup:
      database.models.Order.findByPk = (async () => DATA.order) as any;

      // Arrange:
      const order_id = DATA.order.id;
      const options = {};

      // Act:
      const res = await repository.getOrder(order_id, options);

      // Assert:
      expect(res).toEqual(DATA.order);
    });
  });

  describe('updateOrder', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Order.findByPk = (async () => ({
        update: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const order_id = DATA.order.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateOrder(order_id, values, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return order updated when is found', async () => {
      // Setup:
      database.models.Order.findByPk = (async () => ({
        update: async () => ({
          extra: { enabled: true },
          updated_at: new Date()
        })
      })) as any;

      // Arrange:
      const order_id = DATA.order.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await repository.updateOrder(order_id, values, options);

      // Assert:
      expect(res.extra).toEqual(values.extra);
    });
  });

  describe('deleteOrder', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Order.findByPk = (async () => ({
        destroy: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const order_id = DATA.order.id;
      const options = {};

      // Act:
      const res = repository.deleteOrder(order_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return order deleted when is found', async () => {
      // Setup:
      database.models.Order.findByPk = (async () => ({
        destroy: async () => ({
          updated_at: new Date(),
          deleted_at: new Date()
        })
      })) as any;

      // Arrange:
      const order_id = DATA.order.id;
      const options = {};

      // Act:
      const res = await repository.deleteOrder(order_id, options);

      // Assert:
      expect(res.deleted_at).not.toBe(null);
    });
  });

  describe('getJobs', () => {
    it('should throw error when action fail', () => {
      // Mock:
      database.models.Order.findByPk = (async () => ({
        getJobs: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const order_id = DATA.order.id;
      const options = {};

      // Act:
      const res = repository.getJobs(order_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      database.models.Order.findByPk = (async () => ({
        getJobs: async () => [ DATA.job ]
      })) as any;

      // Arrange:
      const order_id = DATA.order.id;
      const options = {};

      // Act:
      const res = await repository.getJobs(order_id, options);

      // Assert:
      expect(res).toEqual([ DATA.job ]);
    });
    it('should return a list empty when records are not found', async () => {
      // Mock:
      database.models.Order.findByPk = (async () => ({
        getJobs: async () => []
      })) as any;

      // Arrange:
      const order_id = DATA.order.id;
      const options = {};

      // Act:
      const res = await repository.getJobs(order_id, options);

      // Assert:
      expect(res).toBeArray().toBeEmpty();
    });
  });

  describe('getJob', () => {
    it('should return null when job was not found', async () => {
      // Mock:
      database.models.Order.findByPk = (async () => ({
        getJobs: async () => null
      })) as any;

      // Arrange:
      const order_id = DATA.order.id;
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = await repository.getJob(order_id, job_id, options);

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and assert is true', () => {
      // Mock:
      database.models.Order.findByPk = (async () => ({
        getJobs: async () => null
      })) as any;

      // Arrange:
      const order_id = DATA.order.id;
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = repository.getJob(order_id, job_id, options, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Mock:
      database.models.Order.findByPk = (async () => ({
        getJobs: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const order_id = DATA.order.id;
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = repository.getJob(order_id, job_id, options, true);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.job };

      // Mock:
      database.models.Order.findByPk = (async () => ({
        getJobs: async () => expected
      })) as any;

      // Arrange:
      const order_id = DATA.order.id;
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = await repository.getJob(order_id, job_id, options, true);

      // Assert:
      expect(res).toEqual(expected);
    });
  });
});
