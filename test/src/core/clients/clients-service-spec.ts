import '../../../config/global';
import { ClientRepository } from '../../../../src/core/clients/clients-repository';
import { ClientService } from '../../../../src/core/clients/clients-service';
import { I } from '../../../../src/core/clients/clients-types';
import { ERROR_BAD_GATEWAY as ACTION_ERROR } from '../../../config/errors';
import * as DATA from '../../../config/models';

describe('Client Service', () => {
  const database = {};
  let repository:I.repository = null;
  let service:I.service = null;

  beforeEach(async () => {
    repository = ClientRepository(database);
    service = ClientService(repository);
  });

  describe('getClients', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.getClients = async () => { throw ACTION_ERROR; };

      // Arrange:
      const options = {};

      // Act:
      const res = service.getClients(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of clients', async () => {
      // Setup:
      repository.getClients = async () => [ DATA.client ];

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
      repository.createClient = async () => { throw ACTION_ERROR; };

      // Arrange:
      const values = DATA.client;

      // Act:
      const res = service.createClient(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return client created', async () => {
      // Setup:
      repository.createClient = async () => DATA.client;

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
      repository.getClient = async () => { throw ACTION_ERROR; };

      // Arrange:
      const client_id = DATA.client.id;
      const options = {};

      // Act:
      const res = service.getClient(client_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return client when is found', async () => {
      // Setup:
      repository.getClient = async () => DATA.client;

      // Arrange:
      const client_id = DATA.client.id;
      const options = {};

      // Act:
      const res = await service.getClient(client_id, options);

      // Assert:
      expect(res).toEqual(DATA.client);
    });
  });

  describe('updateClient', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.updateClient = async () => { throw ACTION_ERROR; };

      // Arrange:
      const client_id = DATA.client.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = service.updateClient(client_id, values, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return client updated when is found', async () => {
      // Setup:
      repository.updateClient = async () => ({
        extra: { enabled: true },
        updated_at: new Date('2019-10-10')
      });

      // Arrange:
      const client_id = DATA.client.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await service.updateClient(client_id, values, options);

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.extra).toEqual({ enabled: true });
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('deleteClient', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.deleteClient = async () => { throw ACTION_ERROR; };

      // Arrange:
      const client_id = DATA.client.id;
      const options = {};

      // Act:
      const res = service.deleteClient(client_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return client updated when is found', async () => {
      // Setup:
      repository.deleteClient = async () => ({
        updated_at: new Date('2019-10-10'),
        deleted_at: new Date('2019-10-10')
      });

      // Arrange:
      const client_id = DATA.client.id;
      const options = {};

      // Act:
      const res = await service.deleteClient(client_id, options);

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('getQuotes', () => {
    it('should throw error when action fail', () => {
      // Mock:
      repository.getQuotes = async () => { throw ACTION_ERROR; };

      // Arrange:
      const client_id = DATA.client.id;
      const options = {};

      // Act:
      const res = service.getQuotes(client_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      repository.getQuotes = async () => [ DATA.quote ];

      // Arrange:
      const client_id = DATA.client.id;
      const options = {};

      // Act:
      const res = await service.getQuotes(client_id, options);

      // Assert:
      expect(res).toEqual([ DATA.quote ]);
    });
  });

  describe('getQuote', () => {
    it('should throw error when action fail', () => {
      // Mock:
      repository.getQuote = async () => { throw ACTION_ERROR; };

      // Arrange:
      const client_id = DATA.client.id;
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = service.getQuote(client_id, quote_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.quote };

      // Mock:
      repository.getQuote = async () => expected;

      // Arrange:
      const client_id = DATA.client.id;
      const quote_id = DATA.quote.id;
      const options = {};

      // Act:
      const res = await service.getQuote(client_id, quote_id, options);

      // Assert:
      expect(res).toEqual(expected);
    });
  });
});
