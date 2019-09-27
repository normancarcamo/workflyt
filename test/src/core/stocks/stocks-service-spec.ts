import '../../../config/global';
import { StockRepository } from '../../../../src/core/stocks/stocks-repository';
import { StockService } from '../../../../src/core/stocks/stocks-service';
import { I } from '../../../../src/core/stocks/stocks-types';
import { ERROR_BAD_GATEWAY as ACTION_ERROR } from '../../../config/errors';
import * as DATA from '../../../config/models';

describe('Stock Service', () => {
  let database = {};
  let repository = StockRepository(database);
  let service:I.service = StockService(repository);

  beforeEach(async () => { service = StockService(repository); });

  describe('getStocks', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.getStocks = async () => { throw ACTION_ERROR; };

      // Arrange:
      const options = {};

      // Act:
      const res = service.getStocks(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of stocks', async () => {
      // Setup:
      repository.getStocks = async () => [ DATA.stock ];

      // Arrange:
      const options = {};

      // Act:
      const res = await service.getStocks(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty().toEqual([ DATA.stock ]);
    });
  });

  describe('createStock', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.createStock = async () => { throw ACTION_ERROR; };

      // Arrange:
      const values = DATA.stock;

      // Act:
      const res = service.createStock(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return stock created', async () => {
      // Setup:
      repository.createStock = async () => DATA.stock;

      // Arrange:
      const values = DATA.stock;

      // Act:
      const res = await service.createStock(values);

      // Assert:
      expect(res).toEqual(DATA.stock);
    });
  });

  describe('getStock', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.getStock = async () => { throw ACTION_ERROR; };

      // Arrange:
      const stock_id = DATA.stock.id;
      const options = {};

      // Act:
      const res = service.getStock(stock_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return stock when is found', async () => {
      // Setup:
      repository.getStock = async () => DATA.stock;

      // Arrange:
      const stock_id = DATA.stock.id;
      const options = {};

      // Act:
      const res = await service.getStock(stock_id, options);

      // Assert:
      expect(res).toEqual(DATA.stock);
    });
  });

  describe('updateStock', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.updateStock = async () => { throw ACTION_ERROR; };

      // Arrange:
      const stock_id = DATA.stock.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = service.updateStock(stock_id, values, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return stock updated when is found', async () => {
      // Setup:
      repository.updateStock = async () => ({
        extra: { enabled: true },
        updated_at: new Date('2019-10-10')
      });

      // Arrange:
      const stock_id = DATA.stock.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await service.updateStock(stock_id, values, options);

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.extra).toEqual({ enabled: true });
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('deleteStock', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.deleteStock = async () => { throw ACTION_ERROR; };

      // Arrange:
      const stock_id = DATA.stock.id;
      const options = {};

      // Act:
      const res = service.deleteStock(stock_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return stock updated when is found', async () => {
      // Setup:
      repository.deleteStock = async () => ({
        updated_at: new Date('2019-10-10'),
        deleted_at: new Date('2019-10-10')
      });

      // Arrange:
      const stock_id = DATA.stock.id;
      const options = {};

      // Act:
      const res = await service.deleteStock(stock_id, options);

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });
});
