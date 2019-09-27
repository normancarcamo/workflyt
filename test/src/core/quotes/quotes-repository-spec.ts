import '../../../config/global';
import * as DATA from '../../../config/models';
import DATABASE from '../../../config/database';
import { ERROR_BAD_GATEWAY as ACTION_ERROR } from '../../../config/errors';
import { QuoteRepository } from '../../../../src/core/quotes/quotes-repository';

describe('Quote Repository', () => {
  const database = { ...DATABASE() };
  const repository = QuoteRepository(database);

  beforeEach(async () => { database.models = DATABASE().models; });

  describe('getQuotes', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Quote.findAll = (async () => { throw ACTION_ERROR; }) as any;

      // Arrange:
      const options = {};

      // Act:
      const res = repository.getQuotes(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of quotes', async () => {
      // Setup:
      database.models.Quote.findAll = (async () => [ DATA.quote ]) as any;

      // Arrange:
      const options = {};

      // Act:
      const res = await repository.getQuotes(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty().toEqual([ DATA.quote ]);
    });
    it('should return an empty list when records are not found', async () => {
      // Setup:
      database.models.Quote.findAll = (async () => []) as any;

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
      database.models.Quote.create = (async () => { throw ACTION_ERROR; }) as any;

      // Arrange:
      const values = DATA.quote;

      // Act:
      const res = repository.createQuote(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return quote created', async () => {
      // Setup:
      database.models.Quote.create = (async () => DATA.quote) as any;

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
      database.models.Quote.findByPk = (async () => { throw ACTION_ERROR; }) as any;

      // Arrange:
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = repository.getQuote(quote_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return null when quote was not found', async () => {
      // Setup:
      database.models.Quote.findByPk = (async () => null) as any;

      // Arrange:
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = await repository.getQuote(quote_id, options);

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and strict is set true', () => {
      // Setup:
      database.models.Quote.findByPk = (async () => null) as any;

      // Arrange:
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = repository.getQuote(quote_id, options, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return quote when is found', async () => {
      // Setup:
      database.models.Quote.findByPk = (async () => DATA.quote) as any;

      // Arrange:
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = await repository.getQuote(quote_id, options);

      // Assert:
      expect(res).toEqual(DATA.quote);
    });
  });

  describe('updateQuote', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Quote.findByPk = (async () => ({
        update: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const quote_id = DATA.quote.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateQuote(quote_id, values, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return quote updated when is found', async () => {
      // Setup:
      database.models.Quote.findByPk = (async () => ({
        update: async () => ({
          extra: { enabled: true },
          updated_at: new Date()
        })
      })) as any;

      // Arrange:
      const quote_id = DATA.quote.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await repository.updateQuote(quote_id, values, options);

      // Assert:
      expect(res.extra).toEqual(values.extra);
    });
  });

  describe('deleteQuote', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Quote.findByPk = (async () => ({
        destroy: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = repository.deleteQuote(quote_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return quote deleted when is found', async () => {
      // Setup:
      database.models.Quote.findByPk = (async () => ({
        destroy: async () => ({
          updated_at: new Date(),
          deleted_at: new Date()
        })
      })) as any;

      // Arrange:
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = await repository.deleteQuote(quote_id, options);

      // Assert:
      expect(res.deleted_at).not.toBe(null);
    });
  });

  describe('getServices', () => {
    it('should throw error when action fail', () => {
      // Mock:
      database.models.Quote.findByPk = (async () => ({
        getServices: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = repository.getServices(quote_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      database.models.Quote.findByPk = (async () => ({
        getServices: async () => [ DATA.service ]
      })) as any;

      // Arrange:
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = await repository.getServices(quote_id, options);

      // Assert:
      expect(res).toEqual([ DATA.service ]);
    });
    it('should return a list empty when records are not found', async () => {
      // Mock:
      database.models.Quote.findByPk = (async () => ({
        getServices: async () => []
      })) as any;

      // Arrange:
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = await repository.getServices(quote_id, options);

      // Assert:
      expect(res).toBeArray().toBeEmpty();
    });
  });

  describe('addServices', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Quote.findByPk = (async () => ({
        addServices: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const quote_id = DATA.quote.id;
      const services = [ DATA.service.id ];

      // Act:
      const res = repository.addServices(quote_id, services);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations after adding them', async () => {
      // Setup:
      database.models.Quote.findByPk = (async () => ({
        addServices: async () => [ DATA.quoteService ]
      })) as any;

      // Arrange:
      const quote_id = DATA.quote.id;
      const services = [ DATA.service.id ];

      // Act:
      const res = await repository.addServices(quote_id, services);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty();
      expect(res).toEqual([ DATA.quoteService ]);
    });
  });

  describe('getService', () => {
    it('should return null when service was not found', async () => {
      // Mock:
      database.models.Quote.findByPk = (async () => ({
        getServices: async () => null
      })) as any;

      // Arrange:
      const quote_id = DATA.quote.id;
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = await repository.getService(quote_id, service_id, options);

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and assert is true', () => {
      // Mock:
      database.models.Quote.findByPk = (async () => ({
        getServices: async () => null
      })) as any;

      // Arrange:
      const quote_id = DATA.quote.id;
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = repository.getService(quote_id, service_id, options, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Mock:
      database.models.Quote.findByPk = (async () => ({
        getServices: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const quote_id = DATA.quote.id;
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = repository.getService(quote_id, service_id, options, true);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.service, QuoteService: DATA.quoteService };

      // Mock:
      database.models.Quote.findByPk = (async () => ({
        getServices: async () => expected
      })) as any;

      // Arrange:
      const quote_id = DATA.quote.id;
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = await repository.getService(quote_id, service_id, options, true);

      // Assert:
      expect(res).toEqual(expected)
    });
  });

  describe('updateService', () => {
    it('should throw error when action fail', () => {
      // Arrange:
      database.models.Quote.findByPk = (async () => ({
        getServices: async () => ({
          QuoteService: {
            update: async () => { throw ACTION_ERROR; }
          }
        })
      })) as any;
      const quote_id = DATA.quote.id;
      const service_id = DATA.service.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateService(quote_id, service_id, values, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association updated after update', async () => {
      // Arrange:
      database.models.Quote.findByPk = (async () => ({
        getServices: async () => ({
          QuoteService: {
            update: async () => ({
              ...DATA.quoteService,
              extra: { enabled: true },
              updated_at: new Date('2019-10-10')
            })
          }
        })
      })) as any;
      const quote_id = DATA.quoteService.quote_id;
      const service_id = DATA.quoteService.service_id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await repository.updateService(quote_id, service_id, values, options);

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
      // Arrange:
      database.models.Quote.findByPk = (async () => ({
        getServices: async () => ({
          QuoteService: {
            destroy: async () => { throw ACTION_ERROR; }
          }
        })
      })) as any;
      const quote_id = DATA.quote.id;
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = repository.deleteService(quote_id, service_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association deleted after delete', async () => {
      // Arrange:
      database.models.Quote.findByPk = (async () => ({
        getServices: async () => ({
          QuoteService: {
            destroy: async () => ({
              ...DATA.quoteService,
              updated_at: new Date('2019-10-10'),
              deleted_at: new Date('2019-10-10')
            })
          }
        })
      })) as any;
      const quote_id = DATA.quoteService.quote_id;
      const service_id = DATA.quoteService.service_id;
      const options = {};

      // Act:
      const res = await repository.deleteService(quote_id, service_id, options);

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
      database.models.Quote.findByPk = (async () => ({
        getOrders: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = repository.getOrders(quote_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      database.models.Quote.findByPk = (async () => ({
        getOrders: async () => [ DATA.order ]
      })) as any;

      // Arrange:
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = await repository.getOrders(quote_id, options);

      // Assert:
      expect(res).toEqual([ DATA.order ]);
    });
    it('should return a list empty when records are not found', async () => {
      // Mock:
      database.models.Quote.findByPk = (async () => ({
        getOrders: async () => []
      })) as any;

      // Arrange:
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = await repository.getOrders(quote_id, options);

      // Assert:
      expect(res).toBeArray().toBeEmpty();
    });
  });

  describe('getOrder', () => {
    it('should return null when order was not found', async () => {
      // Mock:
      database.models.Quote.findByPk = (async () => ({
        getOrders: async () => null
      })) as any;

      // Arrange:
      const quote_id = DATA.quote.id;
      const order_id = DATA.order.id;
      const options = {};

      // Act:
      const res = await repository.getOrder(quote_id, order_id, options);

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and assert is true', () => {
      // Mock:
      database.models.Quote.findByPk = (async () => ({
        getOrders: async () => null
      })) as any;

      // Arrange:
      const quote_id = DATA.quote.id;
      const order_id = DATA.order.id;
      const options = {};

      // Act:
      const res = repository.getOrder(quote_id, order_id, options, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Mock:
      database.models.Quote.findByPk = (async () => ({
        getOrders: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const quote_id = DATA.quote.id;
      const order_id = DATA.order.id;
      const options = {};

      // Act:
      const res = repository.getOrder(quote_id, order_id, options, true);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.order };

      // Mock:
      database.models.Quote.findByPk = (async () => ({
        getOrders: async () => expected
      })) as any;

      // Arrange:
      const quote_id = DATA.quote.id;
      const order_id = DATA.order.id;
      const options = {};

      // Act:
      const res = await repository.getOrder(quote_id, order_id, options, true);

      // Assert:
      expect(res).toEqual(expected);
    });
  });
});
