import '../../../config/global';
import { QuoteRepository } from '../../../../src/core/quotes/quotes-repository';
import { QuoteService } from '../../../../src/core/quotes/quotes-service';
import { I } from '../../../../src/core/quotes/quotes-types';
import { ERROR_BAD_GATEWAY as ACTION_ERROR } from '../../../config/errors';
import * as DATA from '../../../config/models';

describe('Quote Service', () => {
  let database = {};
  let repository = QuoteRepository(database);
  let service:I.service = QuoteService(repository);

  beforeEach(async () => { service = QuoteService(repository); });

  describe('getQuotes', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.getQuotes = async () => { throw ACTION_ERROR; };

      // Arrange:
      const options = {};

      // Act:
      const res = service.getQuotes(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of quotes', async () => {
      // Setup:
      repository.getQuotes = async () => [ DATA.quote ];

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
      repository.createQuote = async () => { throw ACTION_ERROR; };

      // Arrange:
      const values = DATA.quote;

      // Act:
      const res = service.createQuote(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return quote created', async () => {
      // Setup:
      repository.createQuote = async () => DATA.quote;

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
      repository.getQuote = async () => { throw ACTION_ERROR; };

      // Arrange:
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = service.getQuote(quote_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return quote when is found', async () => {
      // Setup:
      repository.getQuote = async () => DATA.quote;

      // Arrange:
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = await service.getQuote(quote_id, options);

      // Assert:
      expect(res).toEqual(DATA.quote);
    });
  });

  describe('updateQuote', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.updateQuote = async () => { throw ACTION_ERROR; };

      // Arrange:
      const quote_id = DATA.quote.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = service.updateQuote(quote_id, values, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return quote updated when is found', async () => {
      // Setup:
      repository.updateQuote = async () => ({
        extra: { enabled: true },
        updated_at: new Date('2019-10-10')
      });

      // Arrange:
      const quote_id = DATA.quote.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await service.updateQuote(quote_id, values, options);

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.extra).toEqual({ enabled: true });
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('deleteQuote', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.deleteQuote = async () => { throw ACTION_ERROR; };

      // Arrange:
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = service.deleteQuote(quote_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return quote updated when is found', async () => {
      // Setup:
      repository.deleteQuote = async () => ({
        updated_at: new Date('2019-10-10'),
        deleted_at: new Date('2019-10-10')
      });

      // Arrange:
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = await service.deleteQuote(quote_id, options);

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('getServices', () => {
    it('should throw error when action fail', () => {
      // Mock:
      repository.getServices = async () => { throw ACTION_ERROR; };

      // Arrange:
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = service.getServices(quote_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      repository.getServices = async () => [ DATA.service ];

      // Arrange:
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = await service.getServices(quote_id, options);

      // Assert:
      expect(res).toEqual([ DATA.service ]);
    });
  });

  describe('addServices', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.addServices = async () => { throw ACTION_ERROR; };

      // Arrange:
      const quote_id = DATA.quote.id;
      const services = [ DATA.service.id ];

      // Act:
      const res = service.addServices(quote_id, services);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations after adding them', async () => {
      // Setup:
      repository.addServices = async () => [ DATA.quoteService ];

      // Arrange:
      const quote_id = DATA.quote.id;
      const services = [ DATA.service.id ];

      // Act:
      const res = await service.addServices(quote_id, services);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty();
      expect(res).toEqual([ DATA.quoteService ]);
    });
  });

  describe('getService', () => {
    it('should throw error when action fail', () => {
      // Mock:
      repository.getService = async () => { throw ACTION_ERROR; };

      // Arrange:
      const quote_id = DATA.quote.id;
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = service.getService(quote_id, service_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.service, QuoteService: DATA.quoteService };

      // Mock:
      repository.getService = async () => expected;

      // Arrange:
      const quote_id = DATA.quote.id;
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = await service.getService(quote_id, service_id, options);

      // Assert:
      expect(res).toEqual(expected)
    });
  });

  describe('updateService', () => {
    it('should throw error when action fail', () => {
      // Before:
      repository.updateService = async () => { throw ACTION_ERROR; };

      // Arrange:
      const quote_id = DATA.quote.id;
      const service_id = DATA.service.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = service.updateService(quote_id, service_id, values, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association updated after update', async () => {
      // Before:
      repository.updateService = async () => ({
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
      const res = await service.updateService(quote_id, service_id, values, options);

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
      repository.deleteService = async () => { throw ACTION_ERROR; };

      // Arrange:
      const quote_id = DATA.quote.id;
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = service.deleteService(quote_id, service_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association deleted after delete', async () => {
      // Before:
      repository.deleteService = async () => ({
        ...DATA.quoteService,
        updated_at: new Date('2019-10-10'),
        deleted_at: new Date('2019-10-10')
      });

      // Arrange:
      const quote_id = DATA.quoteService.quote_id;
      const service_id = DATA.quoteService.service_id;
      const options = {};

      // Act:
      const res = await service.deleteService(quote_id, service_id, options);

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
      repository.getOrders = async () => { throw ACTION_ERROR; };

      // Arrange:
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = service.getOrders(quote_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      repository.getOrders = async () => [ DATA.order ];

      // Arrange:
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = await service.getOrders(quote_id, options);

      // Assert:
      expect(res).toEqual([ DATA.order ]);
    });
  });

  describe('getOrder', () => {
    it('should throw error when action fail', () => {
      // Mock:
      repository.getOrder = async () => { throw ACTION_ERROR; };

      // Arrange:
      const quote_id = DATA.quote.id;
      const order_id = DATA.order.id;
      const options = {};

      // Act:
      const res = service.getOrder(quote_id, order_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      // Arrange:
      const expected = { ...DATA.order };
      repository.getOrder = async () => expected;
      const quote_id = DATA.quote.id;
      const order_id = DATA.order.id;
      const options = {};

      // Act:
      const res = await service.getOrder(quote_id, order_id, options);

      // Assert:
      expect(res).toEqual(expected);
    });
  });
});
