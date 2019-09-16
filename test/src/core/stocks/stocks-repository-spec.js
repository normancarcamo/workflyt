const Repository = require('src/core/stocks/stocks-repository');
const ACTION_ERROR = require('test/config/errors').ERROR_BAD_GATEWAY;
const DATA = require('test/config/models');
const DATABASE = require('test/config/database');

describe('Stock Repository', () => {
  const database = { ...DATABASE };
  const repository = Repository({ database });

  beforeEach(async () => { database.models = DATABASE.models; });

  describe('getStocks', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Stock, 'findAll').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const options = {};

      // Act:
      const res = repository.getStocks(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of stocks', async () => {
      // Setup:
      jest.spyOn(database.models.Stock, 'findAll')
        .mockResolvedValue([ DATA.stock ]);

      // Arrange:
      const options = {};

      // Act:
      const res = await repository.getStocks(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty().toEqual([ DATA.stock ]);
    });
    it('should return an empty list when records are not found', async () => {
      // Setup:
      jest.spyOn(database.models.Stock, 'findAll').mockResolvedValue([]);

      // Arrange:
      const options = {};

      // Act:
      const res = await repository.getStocks(options);

      // Assert:
      expect(res).toBeArray().toBeEmpty();
    });
  });

  describe('createStock', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Stock, 'create').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const values = DATA.stock;

      // Act:
      const res = repository.createStock(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return stock created', async () => {
      // Setup:
      jest.spyOn(database.models.Stock, 'create')
        .mockResolvedValue(DATA.stock);

      // Arrange:
      const values = DATA.stock;

      // Act:
      const res = await repository.createStock(values);

      // Assert:
      expect(res).toEqual(DATA.stock);
    });
  });

  describe('getStock', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Stock, 'findByPk').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const stock_id = DATA.stock.id;
      const options = {};

      // Act:
      const res = repository.getStock({ stock_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return null when stock was not found', async () => {
      // Setup:
      jest.spyOn(database.models.Stock, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const stock_id = DATA.stock.id;
      const options = {};

      // Act:
      const res = await repository.getStock({ stock_id, options });

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and strict is set true', () => {
      // Setup:
      jest.spyOn(database.models.Stock, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const stock_id = DATA.stock.id;
      const options = {};

      // Act:
      const res = repository.getStock({ stock_id, options }, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return stock when is found', async () => {
      // Setup:
      jest.spyOn(database.models.Stock, 'findByPk')
        .mockResolvedValue(DATA.stock);

      // Arrange:
      const stock_id = DATA.stock.id;
      const options = {};

      // Act:
      const res = await repository.getStock({ stock_id, options });

      // Assert:
      expect(res).toEqual(DATA.stock);
    });
  });

  describe('updateStock', () => {
    it('should throw error when stock was not found', () => {
      // Setup:
      jest.spyOn(database.models.Stock, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const stock_id = DATA.stock.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateStock({ stock_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Stock, 'findByPk').mockResolvedValue({
        update: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const stock_id = DATA.stock.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateStock({ stock_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return stock updated when is found', async () => {
      // Setup:
      jest.spyOn(database.models.Stock, 'findByPk').mockResolvedValue({
        update: jest.fn().mockResolvedValue({
          extra: { enabled: true },
          updated_at: new Date()
        })
      });

      // Arrange:
      const stock_id = DATA.stock.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await repository.updateStock({ stock_id, values, options });

      // Assert:
      expect(res.extra).toEqual(values.extra);
    });
  });

  describe('deleteStock', () => {
    it('should throw error when stock was not found', () => {
      // Setup:
      jest.spyOn(database.models.Stock, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const stock_id = DATA.stock.id;
      const options = {};

      // Act:
      const res = repository.deleteStock({ stock_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Stock, 'findByPk').mockResolvedValue({
        destroy: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const stock_id = DATA.stock.id;
      const options = {};

      // Act:
      const res = repository.deleteStock({ stock_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return stock deleted when is found', async () => {
      // Setup:
      jest.spyOn(database.models.Stock, 'findByPk').mockResolvedValue({
        destroy: jest.fn().mockResolvedValue({
          updated_at: new Date(),
          deleted_at: new Date()
        })
      });

      // Arrange:
      const stock_id = DATA.stock.id;
      const options = {};

      // Act:
      const res = await repository.deleteStock({ stock_id, options });

      // Assert:
      expect(res.deleted_at).not.toBe(null);
    });
  });
});
