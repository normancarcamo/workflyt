const Repository = require('src/core/stocks/stocks-repository');
const Service = require('src/core/stocks/stocks-service');
const ACTION_ERROR = require('test/config/errors').ERROR_BAD_GATEWAY;
const DATA = require('test/config/models');

describe('Stock Service', () => {
  const database = {};
  const repository = Repository({ database });
  let service = null;

  beforeEach(async () => { service = Service({ repository }); });

  describe('getStocks', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'getStocks').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const options = {};

      // Act:
      const res = service.getStocks(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of stocks', async () => {
      // Setup:
      jest.spyOn(repository, 'getStocks').mockResolvedValue([ DATA.stock ]);

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
      jest.spyOn(repository, 'createStock').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const values = DATA.stock;

      // Act:
      const res = service.createStock(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return stock created', async () => {
      // Setup:
      jest.spyOn(repository, 'createStock').mockResolvedValue(DATA.stock);

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
      jest.spyOn(repository, 'getStock').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const stock_id = DATA.stock.id;
      const options = {};

      // Act:
      const res = service.getStock({ stock_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return stock when is found', async () => {
      // Setup:
      jest.spyOn(repository, 'getStock').mockResolvedValue(DATA.stock);

      // Arrange:
      const stock_id = DATA.stock.id;
      const options = {};

      // Act:
      const res = await service.getStock({ stock_id, options });

      // Assert:
      expect(res).toEqual(DATA.stock);
    });
  });

  describe('updateStock', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'updateStock').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const stock_id = DATA.stock.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = service.updateStock({ stock_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return stock updated when is found', async () => {
      // Setup:
      jest.spyOn(repository, 'updateStock').mockResolvedValue({
        extra: { enabled: true },
        updated_at: new Date('2019-10-10')
      });

      // Arrange:
      const stock_id = DATA.stock.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await service.updateStock({ stock_id, values, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.extra).toEqual({ enabled: true });
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('deleteStock', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'deleteStock').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const stock_id = DATA.stock.id;
      const options = {};

      // Act:
      const res = service.deleteStock({ stock_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return stock updated when is found', async () => {
      // Setup:
      jest.spyOn(repository, 'deleteStock').mockResolvedValue({
        updated_at: new Date('2019-10-10'),
        deleted_at: new Date('2019-10-10')
      });

      // Arrange:
      const stock_id = DATA.stock.id;
      const options = {};

      // Act:
      const res = await service.deleteStock({ stock_id, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });
});
