const Repository = require('src/core/orders/orders-repository');
const Service = require('src/core/orders/orders-service');
const ACTION_ERROR = require('test/config/errors').ERROR_BAD_GATEWAY;
const DATA = require('test/config/models');

describe('Order Service', () => {
  const database = {};
  const repository = Repository({ database });
  let service = null;

  beforeEach(async () => { service = Service({ repository }); });

  describe('getOrders', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'getOrders').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const options = {};

      // Act:
      const res = service.getOrders(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of orders', async () => {
      // Setup:
      jest.spyOn(repository, 'getOrders').mockResolvedValue([ DATA.order ]);

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
      jest.spyOn(repository, 'createOrder').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const values = DATA.order;

      // Act:
      const res = service.createOrder(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return order created', async () => {
      // Setup:
      jest.spyOn(repository, 'createOrder').mockResolvedValue(DATA.order);

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
      jest.spyOn(repository, 'getOrder').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const order_id = DATA.order.id;
      const options = {};

      // Act:
      const res = service.getOrder({ order_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return order when is found', async () => {
      // Setup:
      jest.spyOn(repository, 'getOrder').mockResolvedValue(DATA.order);

      // Arrange:
      const order_id = DATA.order.id;
      const options = {};

      // Act:
      const res = await service.getOrder({ order_id, options });

      // Assert:
      expect(res).toEqual(DATA.order);
    });
  });

  describe('updateOrder', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'updateOrder').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const order_id = DATA.order.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = service.updateOrder({ order_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return order updated when is found', async () => {
      // Setup:
      jest.spyOn(repository, 'updateOrder').mockResolvedValue({
        extra: { enabled: true },
        updated_at: new Date('2019-10-10')
      });

      // Arrange:
      const order_id = DATA.order.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await service.updateOrder({ order_id, values, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.extra).toEqual({ enabled: true });
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('deleteOrder', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'deleteOrder').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const order_id = DATA.order.id;
      const options = {};

      // Act:
      const res = service.deleteOrder({ order_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return order updated when is found', async () => {
      // Setup:
      jest.spyOn(repository, 'deleteOrder').mockResolvedValue({
        updated_at: new Date('2019-10-10'),
        deleted_at: new Date('2019-10-10')
      });

      // Arrange:
      const order_id = DATA.order.id;
      const options = {};

      // Act:
      const res = await service.deleteOrder({ order_id, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('getJobs', () => {
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(repository, 'getJobs').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const order_id = DATA.order.id;
      const options = {};

      // Act:
      const res = service.getJobs({ order_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      jest.spyOn(repository, 'getJobs').mockResolvedValue([ DATA.job ]);

      // Arrange:
      const order_id = DATA.order.id;
      const options = {};

      // Act:
      const res = await service.getJobs({ order_id, options });

      // Assert:
      expect(res).toEqual([ DATA.job ]);
    });
  });

  describe('getJob', () => {
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(repository, 'getJob').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const order_id = DATA.order.id;
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = service.getJob({ order_id, job_id, options }, true);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.job };

      // Mock:
      jest.spyOn(repository, 'getJob').mockResolvedValue(expected);

      // Arrange:
      const order_id = DATA.order.id;
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = await service.getJob({ order_id, job_id, options }, true);

      // Assert:
      expect(res).toEqual(expected)
    });
  });
});
