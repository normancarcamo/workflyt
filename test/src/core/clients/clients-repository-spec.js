const Repository = require('src/core/clients/clients-repository');
const ACTION_ERROR = require('test/config/errors').ERROR_BAD_GATEWAY;
const DATA = require('test/config/models');
const DATABASE = require('test/config/database');

describe('Client Repository', () => {
  const database = { ...DATABASE };
  const repository = Repository({ database });

  beforeEach(async () => { database.models = DATABASE.models; });

  describe('getClients', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Client, 'findAll').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const options = {};

      // Act:
      const res = repository.getClients(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of clients', async () => {
      // Setup:
      jest.spyOn(database.models.Client, 'findAll')
        .mockResolvedValue([ DATA.client ]);

      // Arrange:
      const options = {};

      // Act:
      const res = await repository.getClients(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty().toEqual([ DATA.client ]);
    });
    it('should return an empty list when records are not found', async () => {
      // Setup:
      jest.spyOn(database.models.Client, 'findAll').mockResolvedValue([]);

      // Arrange:
      const options = {};

      // Act:
      const res = await repository.getClients(options);

      // Assert:
      expect(res).toBeArray().toBeEmpty();
    });
  });

  describe('createClient', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Client, 'create').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const values = DATA.client;

      // Act:
      const res = repository.createClient(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return client created', async () => {
      // Setup:
      jest.spyOn(database.models.Client, 'create')
        .mockResolvedValue(DATA.client);

      // Arrange:
      const values = DATA.client;

      // Act:
      const res = await repository.createClient(values);

      // Assert:
      expect(res).toEqual(DATA.client);
    });
  });

  describe('getClient', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Client, 'findByPk').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const client_id = DATA.client.id;
      const options = {};

      // Act:
      const res = repository.getClient({ client_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return null when client was not found', async () => {
      // Setup:
      jest.spyOn(database.models.Client, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const client_id = DATA.client.id;
      const options = {};

      // Act:
      const res = await repository.getClient({ client_id, options });

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and strict is set true', () => {
      // Setup:
      jest.spyOn(database.models.Client, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const client_id = DATA.client.id;
      const options = {};

      // Act:
      const res = repository.getClient({ client_id, options }, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return client when is found', async () => {
      // Setup:
      jest.spyOn(database.models.Client, 'findByPk')
        .mockResolvedValue(DATA.client);

      // Arrange:
      const client_id = DATA.client.id;
      const options = {};

      // Act:
      const res = await repository.getClient({ client_id, options });

      // Assert:
      expect(res).toEqual(DATA.client);
    });
  });

  describe('updateClient', () => {
    it('should throw error when client was not found', () => {
      // Setup:
      jest.spyOn(database.models.Client, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const client_id = DATA.client.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateClient({ client_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Client, 'findByPk').mockResolvedValue({
        update: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const client_id = DATA.client.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateClient({ client_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return client updated when is found', async () => {
      // Setup:
      jest.spyOn(database.models.Client, 'findByPk').mockResolvedValue({
        update: jest.fn().mockResolvedValue({
          extra: { enabled: true },
          updated_at: new Date()
        })
      });

      // Arrange:
      const client_id = DATA.client.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await repository.updateClient({ client_id, values, options });

      // Assert:
      expect(res.extra).toEqual(values.extra);
    });
  });

  describe('deleteClient', () => {
    it('should throw error when client was not found', () => {
      // Setup:
      jest.spyOn(database.models.Client, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const client_id = DATA.client.id;
      const options = {};

      // Act:
      const res = repository.deleteClient({ client_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Client, 'findByPk').mockResolvedValue({
        destroy: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const client_id = DATA.client.id;
      const options = {};

      // Act:
      const res = repository.deleteClient({ client_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return client deleted when is found', async () => {
      // Setup:
      jest.spyOn(database.models.Client, 'findByPk').mockResolvedValue({
        destroy: jest.fn().mockResolvedValue({
          updated_at: new Date(),
          deleted_at: new Date()
        })
      });

      // Arrange:
      const client_id = DATA.client.id;
      const options = {};

      // Act:
      const res = await repository.deleteClient({ client_id, options });

      // Assert:
      expect(res.deleted_at).not.toBe(null);
    });
  });

  describe('getQuotes', () => {
    it('should throw error when client was not found', () => {
      // Setup:
      jest.spyOn(database.models.Client, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const client_id = DATA.client.id;
      const options = {};

      // Act:
      const res = repository.getQuotes({ client_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(database.models.Client, 'findByPk').mockResolvedValue({
        getQuotes: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const client_id = DATA.client.id;
      const options = {};

      // Act:
      const res = repository.getQuotes({ client_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      jest.spyOn(database.models.Client, 'findByPk').mockResolvedValue({
        getQuotes: jest.fn().mockResolvedValue([ DATA.quote ])
      });

      // Arrange:
      const client_id = DATA.client.id;
      const options = {};

      // Act:
      const res = await repository.getQuotes({ client_id, options });

      // Assert:
      expect(res).toEqual([ DATA.quote ]);
    });
    it('should return a list empty when records are not found', async () => {
      // Mock:
      jest.spyOn(database.models.Client, 'findByPk').mockResolvedValue({
        getQuotes: jest.fn().mockResolvedValue([])
      });

      // Arrange:
      const client_id = DATA.client.id;
      const options = {};

      // Act:
      const res = await repository.getQuotes({ client_id, options });

      // Assert:
      expect(res).toBeArray().toBeEmpty();
    });
  });

  describe('getQuote', () => {
    it('should throw error when client was not found', () => {
      // Setup:
      jest.spyOn(database.models.Client, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const client_id = DATA.client.id;
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = repository.getQuote({ client_id, quote_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return null when quote was not found', async () => {
      // Mock:
      jest.spyOn(database.models.Client, 'findByPk').mockResolvedValue({
        getQuotes: jest.fn().mockResolvedValue(null)
      });

      // Arrange:
      const client_id = DATA.client.id;
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = await repository.getQuote({ client_id, quote_id, options });

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and assert is true', () => {
      // Mock:
      jest.spyOn(database.models.Client, 'findByPk').mockResolvedValue({
        getQuotes: jest.fn().mockResolvedValue(null)
      });

      // Arrange:
      const client_id = DATA.client.id;
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = repository.getQuote({ client_id, quote_id, options }, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(database.models.Client, 'findByPk').mockResolvedValue({
        getQuotes: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const client_id = DATA.client.id;
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = repository.getQuote({ client_id, quote_id, options }, true);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.quote };

      // Mock:
      jest.spyOn(database.models.Client, 'findByPk').mockResolvedValue({
        getQuotes: jest.fn().mockResolvedValue(expected)
      });

      // Arrange:
      const client_id = DATA.client.id;
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = await repository.getQuote({ client_id, quote_id, options }, true);

      // Assert:
      expect(res).toEqual(expected)
    });
  });
});
