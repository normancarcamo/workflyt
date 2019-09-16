const Repository = require('src/core/quotes/quotes-repository');
const ACTION_ERROR = require('test/config/errors').ERROR_BAD_GATEWAY;
const DATA = require('test/config/models');
const DATABASE = require('test/config/database');

describe('Quote Repository', () => {
  const database = { ...DATABASE };
  const repository = Repository({ database });

  beforeEach(async () => { database.models = DATABASE.models; });

  describe('getQuotes', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Quote, 'findAll').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const options = {};

      // Act:
      const res = repository.getQuotes(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of quotes', async () => {
      // Setup:
      jest.spyOn(database.models.Quote, 'findAll')
        .mockResolvedValue([ DATA.quote ]);

      // Arrange:
      const options = {};

      // Act:
      const res = await repository.getQuotes(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty().toEqual([ DATA.quote ]);
    });
    it('should return an empty list when records are not found', async () => {
      // Setup:
      jest.spyOn(database.models.Quote, 'findAll').mockResolvedValue([]);

      // Arrange:
      const options = {};

      // Act:
      const res = await repository.getQuotes(options);

      // Assert:
      expect(res).toBeArray().toBeEmpty();
    });
  });

  describe('createQuote', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Quote, 'create').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const values = DATA.quote;

      // Act:
      const res = repository.createQuote(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return quote created', async () => {
      // Setup:
      jest.spyOn(database.models.Quote, 'create')
        .mockResolvedValue(DATA.quote);

      // Arrange:
      const values = DATA.quote;

      // Act:
      const res = await repository.createQuote(values);

      // Assert:
      expect(res).toEqual(DATA.quote);
    });
  });

  describe('getQuote', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Quote, 'findByPk').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = repository.getQuote({ quote_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return null when quote was not found', async () => {
      // Setup:
      jest.spyOn(database.models.Quote, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = await repository.getQuote({ quote_id, options });

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and strict is set true', () => {
      // Setup:
      jest.spyOn(database.models.Quote, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = repository.getQuote({ quote_id, options }, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return quote when is found', async () => {
      // Setup:
      jest.spyOn(database.models.Quote, 'findByPk')
        .mockResolvedValue(DATA.quote);

      // Arrange:
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = await repository.getQuote({ quote_id, options });

      // Assert:
      expect(res).toEqual(DATA.quote);
    });
  });

  describe('updateQuote', () => {
    it('should throw error when quote was not found', () => {
      // Setup:
      jest.spyOn(database.models.Quote, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const quote_id = DATA.quote.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateQuote({ quote_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Quote, 'findByPk').mockResolvedValue({
        update: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const quote_id = DATA.quote.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateQuote({ quote_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return quote updated when is found', async () => {
      // Setup:
      jest.spyOn(database.models.Quote, 'findByPk').mockResolvedValue({
        update: jest.fn().mockResolvedValue({
          extra: { enabled: true },
          updated_at: new Date()
        })
      });

      // Arrange:
      const quote_id = DATA.quote.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await repository.updateQuote({ quote_id, values, options });

      // Assert:
      expect(res.extra).toEqual(values.extra);
    });
  });

  describe('deleteQuote', () => {
    it('should throw error when quote was not found', () => {
      // Setup:
      jest.spyOn(database.models.Quote, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = repository.deleteQuote({ quote_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Quote, 'findByPk').mockResolvedValue({
        destroy: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = repository.deleteQuote({ quote_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return quote deleted when is found', async () => {
      // Setup:
      jest.spyOn(database.models.Quote, 'findByPk').mockResolvedValue({
        destroy: jest.fn().mockResolvedValue({
          updated_at: new Date(),
          deleted_at: new Date()
        })
      });

      // Arrange:
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = await repository.deleteQuote({ quote_id, options });

      // Assert:
      expect(res.deleted_at).not.toBe(null);
    });
  });

  describe('getServices', () => {
    it('should throw error when quote was not found', () => {
      // Setup:
      jest.spyOn(database.models.Quote, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = repository.getServices({ quote_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(database.models.Quote, 'findByPk').mockResolvedValue({
        getServices: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = repository.getServices({ quote_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      jest.spyOn(database.models.Quote, 'findByPk').mockResolvedValue({
        getServices: jest.fn().mockResolvedValue([ DATA.service ])
      });

      // Arrange:
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = await repository.getServices({ quote_id, options });

      // Assert:
      expect(res).toEqual([ DATA.service ]);
    });
    it('should return a list empty when records are not found', async () => {
      // Mock:
      jest.spyOn(database.models.Quote, 'findByPk').mockResolvedValue({
        getServices: jest.fn().mockResolvedValue([])
      });

      // Arrange:
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = await repository.getServices({ quote_id, options });

      // Assert:
      expect(res).toBeArray().toBeEmpty();
    });
  });

  describe('addServices', () => {
    it('should throw error when quote was not found', () => {
      // Setup:
      jest.spyOn(database.models.Quote, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const quote_id = DATA.quote.id;
      const services = [ DATA.service.id ];

      // Act:
      const res = repository.addServices({ quote_id, services });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Quote, 'findByPk').mockResolvedValue({
        addServices: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const options = {
        quote_id: DATA.quote.id,
        services: [ DATA.service.id ]
      };

      // Act:
      const res = repository.addServices(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations after adding them', async () => {
      // Setup:
      jest.spyOn(database.models.Quote, 'findByPk').mockResolvedValue({
        addServices: jest.fn().mockResolvedValue([
          DATA.quoteService
        ])
      });

      // Arrange:
      const options = {
        quote_id: DATA.quote.id,
        services: [ DATA.service.id ]
      };

      // Act:
      const res = await repository.addServices(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty();
      expect(res).toEqual([ DATA.quoteService ]);
    });
  });

  describe('getService', () => {
    it('should throw error when quote was not found', () => {
      // Setup:
      jest.spyOn(database.models.Quote, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const quote_id = DATA.quote.id;
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = repository.getService({ quote_id, service_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return null when service was not found', async () => {
      // Mock:
      jest.spyOn(database.models.Quote, 'findByPk').mockResolvedValue({
        getServices: jest.fn().mockResolvedValue(null)
      });

      // Arrange:
      const quote_id = DATA.quote.id;
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = await repository.getService({ quote_id, service_id, options });

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and assert is true', () => {
      // Mock:
      jest.spyOn(database.models.Quote, 'findByPk').mockResolvedValue({
        getServices: jest.fn().mockResolvedValue(null)
      });

      // Arrange:
      const quote_id = DATA.quote.id;
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = repository.getService({ quote_id, service_id, options }, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(database.models.Quote, 'findByPk').mockResolvedValue({
        getServices: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const quote_id = DATA.quote.id;
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = repository.getService({ quote_id, service_id, options }, true);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.service, QuoteService: DATA.quoteService };

      // Mock:
      jest.spyOn(database.models.Quote, 'findByPk').mockResolvedValue({
        getServices: jest.fn().mockResolvedValue(expected)
      });

      // Arrange:
      const quote_id = DATA.quote.id;
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = await repository.getService({ quote_id, service_id, options }, true);

      // Assert:
      expect(res).toEqual(expected)
    });
  });

  describe('updateService', () => {
    it('should throw error when quote was not found', () => {
      // Before:
      jest.spyOn(database.models.Quote, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const quote_id = DATA.quote.id;
      const service_id = DATA.service.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateService({ quote_id, service_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return null when service was not found', () => {
      // Before:
      jest.spyOn(database.models.Quote, 'findByPk').mockResolvedValue({
        getServices: jest.fn().mockResolvedValue(null)
      });

      // Arrange:
      const quote_id = DATA.quote.id;
      const service_id = DATA.service.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateService({ quote_id, service_id, values, options });

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Before:
      jest.spyOn(database.models.Quote, 'findByPk').mockResolvedValue({
        getServices: jest.fn().mockResolvedValue({
          QuoteService: {
            update: jest.fn().mockRejectedValue(ACTION_ERROR)
          }
        })
      });

      // Arrange:
      const quote_id = DATA.quote.id;
      const service_id = DATA.service.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateService({ quote_id, service_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association updated after update', async () => {
      // Before:
      jest.spyOn(database.models.Quote, 'findByPk').mockResolvedValue({
        getServices: jest.fn().mockResolvedValue({
          QuoteService: {
            update: jest.fn().mockResolvedValue({
              ...DATA.quoteService,
              extra: { enabled: true },
              updated_at: new Date('2019-10-10')
            })
          }
        })
      });

      // Arrange:
      const quote_id = DATA.quoteService.quote_id;
      const service_id = DATA.quoteService.service_id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await repository.updateService({ quote_id, service_id, values, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.quote_id).toEqual(quote_id);
      expect(res.service_id).toEqual(service_id);
      expect(res.extra).toEqual({ enabled: true });
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('deleteService', () => {
    it('should throw error when quote was not found', () => {
      // Before:
      jest.spyOn(database.models.Quote, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const quote_id = DATA.quote.id;
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = repository.deleteService({ quote_id, service_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return null when service was not found', () => {
      // Before:
      jest.spyOn(database.models.Quote, 'findByPk').mockResolvedValue({
        getServices: jest.fn().mockResolvedValue(null)
      });

      // Arrange:
      const quote_id = DATA.quote.id;
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = repository.deleteService({ quote_id, service_id, options });

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Before:
      jest.spyOn(database.models.Quote, 'findByPk').mockResolvedValue({
        getServices: jest.fn().mockResolvedValue({
          QuoteService: {
            destroy: jest.fn().mockRejectedValue(ACTION_ERROR)
          }
        })
      });

      // Arrange:
      const quote_id = DATA.quote.id;
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = repository.deleteService({ quote_id, service_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association deleted after delete', async () => {
      // Before:
      jest.spyOn(database.models.Quote, 'findByPk').mockResolvedValue({
        getServices: jest.fn().mockResolvedValue({
          QuoteService: {
            destroy: jest.fn().mockResolvedValue({
              ...DATA.quoteService,
              updated_at: new Date('2019-10-10'),
              deleted_at: new Date('2019-10-10')
            })
          }
        })
      });

      // Arrange:
      const quote_id = DATA.quoteService.quote_id;
      const service_id = DATA.quoteService.service_id;
      const options = {};

      // Act:
      const res = await repository.deleteService({ quote_id, service_id, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.quote_id).toEqual(quote_id);
      expect(res.service_id).toEqual(service_id);
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('getOrders', () => {
    it('should throw error when quote was not found', () => {
      // Setup:
      jest.spyOn(database.models.Quote, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = repository.getOrders({ quote_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(database.models.Quote, 'findByPk').mockResolvedValue({
        getOrders: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = repository.getOrders({ quote_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      jest.spyOn(database.models.Quote, 'findByPk').mockResolvedValue({
        getOrders: jest.fn().mockResolvedValue([ DATA.order ])
      });

      // Arrange:
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = await repository.getOrders({ quote_id, options });

      // Assert:
      expect(res).toEqual([ DATA.order ]);
    });
    it('should return a list empty when records are not found', async () => {
      // Mock:
      jest.spyOn(database.models.Quote, 'findByPk').mockResolvedValue({
        getOrders: jest.fn().mockResolvedValue([])
      });

      // Arrange:
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = await repository.getOrders({ quote_id, options });

      // Assert:
      expect(res).toBeArray().toBeEmpty();
    });
  });

  describe('getOrder', () => {
    it('should throw error when quote was not found', () => {
      // Setup:
      jest.spyOn(database.models.Quote, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const quote_id = DATA.quote.id;
      const order_id = DATA.order.id;
      const options = {};

      // Act:
      const res = repository.getOrder({ quote_id, order_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return null when order was not found', async () => {
      // Mock:
      jest.spyOn(database.models.Quote, 'findByPk').mockResolvedValue({
        getOrders: jest.fn().mockResolvedValue(null)
      });

      // Arrange:
      const quote_id = DATA.quote.id;
      const order_id = DATA.order.id;
      const options = {};

      // Act:
      const res = await repository.getOrder({ quote_id, order_id, options });

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and assert is true', () => {
      // Mock:
      jest.spyOn(database.models.Quote, 'findByPk').mockResolvedValue({
        getOrders: jest.fn().mockResolvedValue(null)
      });

      // Arrange:
      const quote_id = DATA.quote.id;
      const order_id = DATA.order.id;
      const options = {};

      // Act:
      const res = repository.getOrder({ quote_id, order_id, options }, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(database.models.Quote, 'findByPk').mockResolvedValue({
        getOrders: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const quote_id = DATA.quote.id;
      const order_id = DATA.order.id;
      const options = {};

      // Act:
      const res = repository.getOrder({ quote_id, order_id, options }, true);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.order };

      // Mock:
      jest.spyOn(database.models.Quote, 'findByPk').mockResolvedValue({
        getOrders: jest.fn().mockResolvedValue(expected)
      });

      // Arrange:
      const quote_id = DATA.quote.id;
      const order_id = DATA.order.id;
      const options = {};

      // Act:
      const res = await repository.getOrder({ quote_id, order_id, options }, true);

      // Assert:
      expect(res).toEqual(expected)
    });
  });
});
