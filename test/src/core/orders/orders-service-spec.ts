import '../../../config/global';
import { OrderRepository } from '../../../../src/core/orders/orders-repository';
import { OrderService } from '../../../../src/core/orders/orders-service';
import { I } from '../../../../src/core/orders/orders-types';
import { ERROR_BAD_GATEWAY as ACTION_ERROR } from '../../../config/errors';
import * as DATA from '../../../config/models';

describe('Order Service', () => {
  let database = {};
  let repository = OrderRepository(database);
  let service:I.service = OrderService(repository);

  beforeEach(async () => { service = OrderService(repository); });

  describe('getOrders', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.getOrders = async () => { throw ACTION_ERROR; };

      // Arrange:
      const options = {};

      // Act:
      const res = service.getOrders(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of orders', async () => {
      // Setup:
      repository.getOrders = async () => [ DATA.order ];

      // Arrange:
      const options = {};

      // Act:
      const res = await service.getOrders(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty().toEqual([ DATA.order ]);
    });
  });

  describe('createOrder', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.createOrder = async () => { throw ACTION_ERROR; };

      // Arrange:
      const values = DATA.order;

      // Act:
      const res = service.createOrder(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return order created', async () => {
      // Setup:
      repository.createOrder = async () => DATA.order;

      // Arrange:
      const values = DATA.order;

      // Act:
      const res = await service.createOrder(values);

      // Assert:
      expect(res).toEqual(DATA.order);
    });
  });

  describe('getOrder', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.getOrder = async () => { throw ACTION_ERROR; };

      // Arrange:
      const order_id = DATA.order.id;
      const options = {};

      // Act:
      const res = service.getOrder(order_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return order when is found', async () => {
      // Setup:
      repository.getOrder = async () => DATA.order;

      // Arrange:
      const order_id = DATA.order.id;
      const options = {};

      // Act:
      const res = await service.getOrder(order_id, options);

      // Assert:
      expect(res).toEqual(DATA.order);
    });
  });

  describe('updateOrder', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.updateOrder = async () => { throw ACTION_ERROR; };

      // Arrange:
      const order_id = DATA.order.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = service.updateOrder(order_id, values, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return order updated when is found', async () => {
      // Setup:
      repository.updateOrder = async () => ({
        extra: { enabled: true },
        updated_at: new Date('2019-10-10')
      });

      // Arrange:
      const order_id = DATA.order.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await service.updateOrder(order_id, values, options);

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.extra).toEqual({ enabled: true });
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('deleteOrder', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.deleteOrder = async () => { throw ACTION_ERROR; };

      // Arrange:
      const order_id = DATA.order.id;
      const options = {};

      // Act:
      const res = service.deleteOrder(order_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return order updated when is found', async () => {
      // Setup:
      repository.deleteOrder = async () => ({
        updated_at: new Date('2019-10-10'),
        deleted_at: new Date('2019-10-10')
      });

      // Arrange:
      const order_id = DATA.order.id;
      const options = {};

      // Act:
      const res = await service.deleteOrder(order_id, options);

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('getJobs', () => {
    it('should throw error when action fail', () => {
      // Mock:
      repository.getJobs = async () => { throw ACTION_ERROR; };

      // Arrange:
      const order_id = DATA.order.id;
      const options = {};

      // Act:
      const res = service.getJobs(order_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      repository.getJobs = async () => [ DATA.job ];

      // Arrange:
      const order_id = DATA.order.id;
      const options = {};

      // Act:
      const res = await service.getJobs(order_id, options);

      // Assert:
      expect(res).toEqual([ DATA.job ]);
    });
  });

  describe('getJob', () => {
    it('should throw error when action fail', () => {
      // Mock:
      repository.getJob = async () => { throw ACTION_ERROR; };

      // Arrange:
      const order_id = DATA.order.id;
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = service.getJob(order_id, job_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.job };

      // Mock:
      repository.getJob = async () => expected;

      // Arrange:
      const order_id = DATA.order.id;
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = await service.getJob(order_id, job_id, options);

      // Assert:
      expect(res).toEqual(expected);
    });
  });
});
