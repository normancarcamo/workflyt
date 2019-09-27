import '../../../config/global';
import * as DATA from '../../../config/models';
import DATABASE from '../../../config/database';
import { ERROR_BAD_GATEWAY as ACTION_ERROR } from '../../../config/errors';
import { StockRepository } from '../../../../src/core/stocks/stocks-repository';

describe('Stock Repository', () => {
  const database = { ...DATABASE() };
  const repository = StockRepository(database);

  beforeEach(async () => { database.models = DATABASE().models; });

  describe('getStocks', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Stock.findAll = (async () => { throw ACTION_ERROR; }) as any;

      // Arrange:
      const options = {};

      // Act:
      const res = repository.getStocks(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of stocks', async () => {
      // Setup:
      database.models.Stock.findAll = (async () => [ DATA.stock ]) as any;

      // Arrange:
      const options = {};

      // Act:
      const res = await repository.getStocks(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty().toEqual([ DATA.stock ]);
    });
    it('should return an empty list when records are not found', async () => {
      // Setup:
      database.models.Stock.findAll = (async () => []) as any;

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
      database.models.Stock.create = (async () => { throw ACTION_ERROR; }) as any;

      // Arrange:
      const values = DATA.stock;

      // Act:
      const res = repository.createStock(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return stock created', async () => {
      // Setup:
      database.models.Stock.create = (async () => DATA.stock) as any;

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
      database.models.Stock.findByPk = (async () => { throw ACTION_ERROR; }) as any;

      // Arrange:
      const stock_id = DATA.stock.id;
      const options = {};

      // Act:
      const res = repository.getStock(stock_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return null when stock was not found', async () => {
      // Setup:
      database.models.Stock.findByPk = (async () => null) as any;

      // Arrange:
      const stock_id = DATA.stock.id;
      const options = {};

      // Act:
      const res = await repository.getStock(stock_id, options);

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and strict is set true', () => {
      // Setup:
      database.models.Stock.findByPk = (async () => null) as any;

      // Arrange:
      const stock_id = DATA.stock.id;
      const options = {};

      // Act:
      const res = repository.getStock(stock_id, options, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return stock when is found', async () => {
      // Setup:
      database.models.Stock.findByPk = (async () => DATA.stock) as any;

      // Arrange:
      const stock_id = DATA.stock.id;
      const options = {};

      // Act:
      const res = await repository.getStock(stock_id, options);

      // Assert:
      expect(res).toEqual(DATA.stock);
    });
  });

  describe('updateStock', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Stock.findByPk = (async () => ({
        update: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const stock_id = DATA.stock.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateStock(stock_id, values, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return stock updated when is found', async () => {
      // Setup:
      database.models.Stock.findByPk = (async () => ({
        update: async () => ({
          extra: { enabled: true },
          updated_at: new Date()
        })
      })) as any;

      // Arrange:
      const stock_id = DATA.stock.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await repository.updateStock(stock_id, values, options);

      // Assert:
      expect(res.extra).toEqual(values.extra);
    });
  });

  describe('deleteStock', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Stock.findByPk = (async () => ({
        destroy: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const stock_id = DATA.stock.id;
      const options = {};

      // Act:
      const res = repository.deleteStock(stock_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return stock deleted when is found', async () => {
      // Setup:
      database.models.Stock.findByPk = (async () => ({
        destroy: async () => ({
          updated_at: new Date(),
          deleted_at: new Date()
        })
      })) as any;

      // Arrange:
      const stock_id = DATA.stock.id;
      const options = {};

      // Act:
      const res = await repository.deleteStock(stock_id, options);

      // Assert:
      expect(res.deleted_at).not.toBe(null);
    });
  });
});
