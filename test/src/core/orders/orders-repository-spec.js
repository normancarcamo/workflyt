const Repository = require('src/core/orders/orders-repository');
const ACTION_ERROR = require('test/config/errors').ERROR_BAD_GATEWAY;
const DATA = require('test/config/models');
const DATABASE = require('test/config/database');

describe('Order Repository', () => {
  const database = { ...DATABASE };
  const repository = Repository({ database });

  beforeEach(async () => { database.models = DATABASE.models; });

  describe('getOrders', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Order, 'findAll').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const options = {};

      // Act:
      const res = repository.getOrders(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of orders', async () => {
      // Setup:
      jest.spyOn(database.models.Order, 'findAll')
        .mockResolvedValue([ DATA.order ]);

      // Arrange:
      const options = {};

      // Act:
      const res = await repository.getOrders(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty().toEqual([ DATA.order ]);
    });
    it('should return an empty list when records are not found', async () => {
      // Setup:
      jest.spyOn(database.models.Order, 'findAll').mockResolvedValue([]);

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
      jest.spyOn(database.models.Order, 'create').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const values = DATA.order;

      // Act:
      const res = repository.createOrder(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return order created', async () => {
      // Setup:
      jest.spyOn(database.models.Order, 'create')
        .mockResolvedValue(DATA.order);

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
      jest.spyOn(database.models.Order, 'findByPk').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const order_id = DATA.order.id;
      const options = {};

      // Act:
      const res = repository.getOrder({ order_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return null when order was not found', async () => {
      // Setup:
      jest.spyOn(database.models.Order, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const order_id = DATA.order.id;
      const options = {};

      // Act:
      const res = await repository.getOrder({ order_id, options });

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and strict is set true', () => {
      // Setup:
      jest.spyOn(database.models.Order, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const order_id = DATA.order.id;
      const options = {};

      // Act:
      const res = repository.getOrder({ order_id, options }, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return order when is found', async () => {
      // Setup:
      jest.spyOn(database.models.Order, 'findByPk')
        .mockResolvedValue(DATA.order);

      // Arrange:
      const order_id = DATA.order.id;
      const options = {};

      // Act:
      const res = await repository.getOrder({ order_id, options });

      // Assert:
      expect(res).toEqual(DATA.order);
    });
  });

  describe('updateOrder', () => {
    it('should throw error when order was not found', () => {
      // Setup:
      jest.spyOn(database.models.Order, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const order_id = DATA.order.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateOrder({ order_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Order, 'findByPk').mockResolvedValue({
        update: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const order_id = DATA.order.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateOrder({ order_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return order updated when is found', async () => {
      // Setup:
      jest.spyOn(database.models.Order, 'findByPk').mockResolvedValue({
        update: jest.fn().mockResolvedValue({
          extra: { enabled: true },
          updated_at: new Date()
        })
      });

      // Arrange:
      const order_id = DATA.order.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await repository.updateOrder({ order_id, values, options });

      // Assert:
      expect(res.extra).toEqual(values.extra);
    });
  });

  describe('deleteOrder', () => {
    it('should throw error when order was not found', () => {
      // Setup:
      jest.spyOn(database.models.Order, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const order_id = DATA.order.id;
      const options = {};

      // Act:
      const res = repository.deleteOrder({ order_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Order, 'findByPk').mockResolvedValue({
        destroy: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const order_id = DATA.order.id;
      const options = {};

      // Act:
      const res = repository.deleteOrder({ order_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return order deleted when is found', async () => {
      // Setup:
      jest.spyOn(database.models.Order, 'findByPk').mockResolvedValue({
        destroy: jest.fn().mockResolvedValue({
          updated_at: new Date(),
          deleted_at: new Date()
        })
      });

      // Arrange:
      const order_id = DATA.order.id;
      const options = {};

      // Act:
      const res = await repository.deleteOrder({ order_id, options });

      // Assert:
      expect(res.deleted_at).not.toBe(null);
    });
  });

  describe('getJobs', () => {
    it('should throw error when order was not found', () => {
      // Setup:
      jest.spyOn(database.models.Order, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const order_id = DATA.order.id;
      const options = {};

      // Act:
      const res = repository.getJobs({ order_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(database.models.Order, 'findByPk').mockResolvedValue({
        getJobs: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const order_id = DATA.order.id;
      const options = {};

      // Act:
      const res = repository.getJobs({ order_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      jest.spyOn(database.models.Order, 'findByPk').mockResolvedValue({
        getJobs: jest.fn().mockResolvedValue([ DATA.job ])
      });

      // Arrange:
      const order_id = DATA.order.id;
      const options = {};

      // Act:
      const res = await repository.getJobs({ order_id, options });

      // Assert:
      expect(res).toEqual([ DATA.job ]);
    });
    it('should return a list empty when records are not found', async () => {
      // Mock:
      jest.spyOn(database.models.Order, 'findByPk').mockResolvedValue({
        getJobs: jest.fn().mockResolvedValue([])
      });

      // Arrange:
      const order_id = DATA.order.id;
      const options = {};

      // Act:
      const res = await repository.getJobs({ order_id, options });

      // Assert:
      expect(res).toBeArray().toBeEmpty();
    });
  });

  describe('getJob', () => {
    it('should throw error when order was not found', () => {
      // Setup:
      jest.spyOn(database.models.Order, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const order_id = DATA.order.id;
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = repository.getJob({ order_id, job_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return null when job was not found', async () => {
      // Mock:
      jest.spyOn(database.models.Order, 'findByPk').mockResolvedValue({
        getJobs: jest.fn().mockResolvedValue(null)
      });

      // Arrange:
      const order_id = DATA.order.id;
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = await repository.getJob({ order_id, job_id, options });

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and assert is true', () => {
      // Mock:
      jest.spyOn(database.models.Order, 'findByPk').mockResolvedValue({
        getJobs: jest.fn().mockResolvedValue(null)
      });

      // Arrange:
      const order_id = DATA.order.id;
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = repository.getJob({ order_id, job_id, options }, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(database.models.Order, 'findByPk').mockResolvedValue({
        getJobs: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const order_id = DATA.order.id;
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = repository.getJob({ order_id, job_id, options }, true);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.job };

      // Mock:
      jest.spyOn(database.models.Order, 'findByPk').mockResolvedValue({
        getJobs: jest.fn().mockResolvedValue(expected)
      });

      // Arrange:
      const order_id = DATA.order.id;
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = await repository.getJob({ order_id, job_id, options }, true);

      // Assert:
      expect(res).toEqual(expected)
    });
  });
});
