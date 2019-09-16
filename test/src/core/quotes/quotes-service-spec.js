const Repository = require('src/core/quotes/quotes-repository');
const Service = require('src/core/quotes/quotes-service');
const ACTION_ERROR = require('test/config/errors').ERROR_BAD_GATEWAY;
const DATA = require('test/config/models');

describe('Quote Service', () => {
  const database = {};
  const repository = Repository({ database });
  let service = null;

  beforeEach(async () => { service = Service({ repository }); });

  describe('getQuotes', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'getQuotes').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const options = {};

      // Act:
      const res = service.getQuotes(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of quotes', async () => {
      // Setup:
      jest.spyOn(repository, 'getQuotes').mockResolvedValue([ DATA.quote ]);

      // Arrange:
      const options = {};

      // Act:
      const res = await service.getQuotes(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty().toEqual([ DATA.quote ]);
    });
  });

  describe('createQuote', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'createQuote').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const values = DATA.quote;

      // Act:
      const res = service.createQuote(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return quote created', async () => {
      // Setup:
      jest.spyOn(repository, 'createQuote').mockResolvedValue(DATA.quote);

      // Arrange:
      const values = DATA.quote;

      // Act:
      const res = await service.createQuote(values);

      // Assert:
      expect(res).toEqual(DATA.quote);
    });
  });

  describe('getQuote', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'getQuote').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = service.getQuote({ quote_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return quote when is found', async () => {
      // Setup:
      jest.spyOn(repository, 'getQuote').mockResolvedValue(DATA.quote);

      // Arrange:
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = await service.getQuote({ quote_id, options });

      // Assert:
      expect(res).toEqual(DATA.quote);
    });
  });

  describe('updateQuote', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'updateQuote').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const quote_id = DATA.quote.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = service.updateQuote({ quote_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return quote updated when is found', async () => {
      // Setup:
      jest.spyOn(repository, 'updateQuote').mockResolvedValue({
        extra: { enabled: true },
        updated_at: new Date('2019-10-10')
      });

      // Arrange:
      const quote_id = DATA.quote.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await service.updateQuote({ quote_id, values, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.extra).toEqual({ enabled: true });
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('deleteQuote', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'deleteQuote').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = service.deleteQuote({ quote_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return quote updated when is found', async () => {
      // Setup:
      jest.spyOn(repository, 'deleteQuote').mockResolvedValue({
        updated_at: new Date('2019-10-10'),
        deleted_at: new Date('2019-10-10')
      });

      // Arrange:
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = await service.deleteQuote({ quote_id, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('getServices', () => {
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(repository, 'getServices').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = service.getServices({ quote_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      jest.spyOn(repository, 'getServices').mockResolvedValue([ DATA.service ]);

      // Arrange:
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = await service.getServices({ quote_id, options });

      // Assert:
      expect(res).toEqual([ DATA.service ]);
    });
  });

  describe('addServices', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'addServices').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const options = { quote_id: DATA.quote.id, services: [ DATA.service.id ] };

      // Act:
      const res = service.addServices(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations after adding them', async () => {
      // Setup:
      jest.spyOn(repository, 'addServices').mockResolvedValue([ DATA.quoteService ]);

      // Arrange:
      const options = { quote_id: DATA.quote.id, services: [ DATA.service.id ] };

      // Act:
      const res = await service.addServices(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty();
      expect(res).toEqual([ DATA.quoteService ]);
    });
  });

  describe('getService', () => {
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(repository, 'getService').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const quote_id = DATA.quote.id;
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = service.getService({ quote_id, service_id, options }, true);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.service, QuoteService: DATA.quoteService };

      // Mock:
      jest.spyOn(repository, 'getService').mockResolvedValue(expected);

      // Arrange:
      const quote_id = DATA.quote.id;
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = await service.getService({ quote_id, service_id, options }, true);

      // Assert:
      expect(res).toEqual(expected)
    });
  });

  describe('updateService', () => {
    it('should throw error when action fail', () => {
      // Before:
      jest.spyOn(repository, 'updateService').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const quote_id = DATA.quote.id;
      const service_id = DATA.service.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = service.updateService({ quote_id, service_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association updated after update', async () => {
      // Before:
      jest.spyOn(repository, 'updateService').mockResolvedValue({
        ...DATA.quoteService,
        extra: { enabled: true },
        updated_at: new Date('2019-10-10')
      });

      // Arrange:
      const quote_id = DATA.quoteService.quote_id;
      const service_id = DATA.quoteService.service_id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await service.updateService({ quote_id, service_id, values, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.quote_id).toEqual(quote_id);
      expect(res.service_id).toEqual(service_id);
      expect(res.extra).toEqual({ enabled: true });
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('deleteService', () => {
    it('should throw error when action fail', () => {
      // Before:
      jest.spyOn(repository, 'deleteService').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const quote_id = DATA.quote.id;
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = service.deleteService({ quote_id, service_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association deleted after delete', async () => {
      // Before:
      jest.spyOn(repository, 'deleteService').mockResolvedValue({
        ...DATA.quoteService,
        updated_at: new Date('2019-10-10'),
        deleted_at: new Date('2019-10-10')
      });

      // Arrange:
      const quote_id = DATA.quoteService.quote_id;
      const service_id = DATA.quoteService.service_id;
      const options = {};

      // Act:
      const res = await service.deleteService({ quote_id, service_id, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.quote_id).toEqual(quote_id);
      expect(res.service_id).toEqual(service_id);
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('getOrders', () => {
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(repository, 'getOrders').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = service.getOrders({ quote_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      jest.spyOn(repository, 'getOrders').mockResolvedValue([ DATA.order ]);

      // Arrange:
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = await service.getOrders({ quote_id, options });

      // Assert:
      expect(res).toEqual([ DATA.order ]);
    });
  });

  describe('getOrder', () => {
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(repository, 'getOrder').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const quote_id = DATA.quote.id;
      const order_id = DATA.order.id;
      const options = {};

      // Act:
      const res = service.getOrder({ quote_id, order_id, options }, true);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.order };

      // Mock:
      jest.spyOn(repository, 'getOrder').mockResolvedValue(expected);

      // Arrange:
      const quote_id = DATA.quote.id;
      const order_id = DATA.order.id;
      const options = {};

      // Act:
      const res = await service.getOrder({ quote_id, order_id, options }, true);

      // Assert:
      expect(res).toEqual(expected)
    });
  });
});
