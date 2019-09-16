const Repository = require('src/core/clients/clients-repository');
const Service = require('src/core/clients/clients-service');
const ACTION_ERROR = require('test/config/errors').ERROR_BAD_GATEWAY;
const DATA = require('test/config/models');

describe('Client Service', () => {
  const database = {};
  const repository = Repository({ database });
  let service = null;

  beforeEach(async () => { service = Service({ repository }); });

  describe('getClients', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'getClients').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const options = {};

      // Act:
      const res = service.getClients(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of clients', async () => {
      // Setup:
      jest.spyOn(repository, 'getClients').mockResolvedValue([ DATA.client ]);

      // Arrange:
      const options = {};

      // Act:
      const res = await service.getClients(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty().toEqual([ DATA.client ]);
    });
  });

  describe('createClient', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'createClient').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const values = DATA.client;

      // Act:
      const res = service.createClient(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return client created', async () => {
      // Setup:
      jest.spyOn(repository, 'createClient').mockResolvedValue(DATA.client);

      // Arrange:
      const values = DATA.client;

      // Act:
      const res = await service.createClient(values);

      // Assert:
      expect(res).toEqual(DATA.client);
    });
  });

  describe('getClient', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'getClient').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const client_id = DATA.client.id;
      const options = {};

      // Act:
      const res = service.getClient({ client_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return client when is found', async () => {
      // Setup:
      jest.spyOn(repository, 'getClient').mockResolvedValue(DATA.client);

      // Arrange:
      const client_id = DATA.client.id;
      const options = {};

      // Act:
      const res = await service.getClient({ client_id, options });

      // Assert:
      expect(res).toEqual(DATA.client);
    });
  });

  describe('updateClient', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'updateClient').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const client_id = DATA.client.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = service.updateClient({ client_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return client updated when is found', async () => {
      // Setup:
      jest.spyOn(repository, 'updateClient').mockResolvedValue({
        extra: { enabled: true },
        updated_at: new Date('2019-10-10')
      });

      // Arrange:
      const client_id = DATA.client.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await service.updateClient({ client_id, values, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.extra).toEqual({ enabled: true });
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('deleteClient', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'deleteClient').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const client_id = DATA.client.id;
      const options = {};

      // Act:
      const res = service.deleteClient({ client_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return client updated when is found', async () => {
      // Setup:
      jest.spyOn(repository, 'deleteClient').mockResolvedValue({
        updated_at: new Date('2019-10-10'),
        deleted_at: new Date('2019-10-10')
      });

      // Arrange:
      const client_id = DATA.client.id;
      const options = {};

      // Act:
      const res = await service.deleteClient({ client_id, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('getQuotes', () => {
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(repository, 'getQuotes').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const client_id = DATA.client.id;
      const options = {};

      // Act:
      const res = service.getQuotes({ client_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      jest.spyOn(repository, 'getQuotes').mockResolvedValue([ DATA.quote ]);

      // Arrange:
      const client_id = DATA.client.id;
      const options = {};

      // Act:
      const res = await service.getQuotes({ client_id, options });

      // Assert:
      expect(res).toEqual([ DATA.quote ]);
    });
  });

  describe('getQuote', () => {
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(repository, 'getQuote').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const client_id = DATA.client.id;
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = service.getQuote({ client_id, quote_id, options }, true);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.quote };

      // Mock:
      jest.spyOn(repository, 'getQuote').mockResolvedValue(expected);

      // Arrange:
      const client_id = DATA.client.id;
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = await service.getQuote({ client_id, quote_id, options }, true);

      // Assert:
      expect(res).toEqual(expected)
    });
  });
});
