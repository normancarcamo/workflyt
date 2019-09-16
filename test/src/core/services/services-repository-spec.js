const Repository = require('src/core/services/services-repository');
const ACTION_ERROR = require('test/config/errors').ERROR_BAD_GATEWAY;
const DATA = require('test/config/models');
const DATABASE = require('test/config/database');

describe('Service Repository', () => {
  const database = { ...DATABASE };
  const repository = Repository({ database });

  beforeEach(async () => { database.models = DATABASE.models; });

  describe('getServices', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Service, 'findAll').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const options = {};

      // Act:
      const res = repository.getServices(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of services', async () => {
      // Setup:
      jest.spyOn(database.models.Service, 'findAll').mockResolvedValue([ DATA.service ]);

      // Arrange:
      const options = {};

      // Act:
      const res = await repository.getServices(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty().toEqual([ DATA.service ]);
    });
    it('should return an empty list when records are not found', async () => {
      // Mock:
      jest.spyOn(database.models.Service, 'findAll').mockResolvedValue([]);

      // Arrange:
      const options = {};

      // Act:
      const res = await repository.getServices(options);

      // Assert:
      expect(res).toBeArray().toBeEmpty();
    });
  });

  describe('createService', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Service, 'create').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const values = DATA.service;

      // Act:
      const res = repository.createService(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return service created', async () => {
      // Setup:
      jest.spyOn(database.models.Service, 'create')
        .mockResolvedValue(DATA.service);

      // Arrange:
      const values = DATA.service;

      // Act:
      const res = await repository.createService(values);

      // Assert:
      expect(res).toEqual(DATA.service);
    });
  });

  describe('getService', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Service, 'findByPk').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = repository.getService({ service_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return null when service was not found', async () => {
      // Setup:
      jest.spyOn(database.models.Service, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = await repository.getService({ service_id, options });

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and strict is set true', () => {
      // Setup:
      jest.spyOn(database.models.Service, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = repository.getService({ service_id, options }, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return service when is found', async () => {
      // Setup:
      jest.spyOn(database.models.Service, 'findByPk')
        .mockResolvedValue(DATA.service);

      // Arrange:
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = await repository.getService({ service_id, options });

      // Assert:
      expect(res).toEqual(DATA.service);
    });
  });

  describe('updateService', () => {
    it('should throw error when service was not found', () => {
      // Setup:
      jest.spyOn(database.models.Service, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const service_id = DATA.service.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateService({ service_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Service, 'findByPk').mockResolvedValue({
        update: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const service_id = DATA.service.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateService({ service_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return service updated when is found', async () => {
      // Setup:
      jest.spyOn(database.models.Service, 'findByPk').mockResolvedValue({
        update: jest.fn().mockResolvedValue({
          extra: { enabled: true },
          updated_at: new Date()
        })
      });

      // Arrange:
      const service_id = DATA.service.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await repository.updateService({ service_id, values, options });

      // Assert:
      expect(res.extra).toEqual(values.extra);
    });
  });

  describe('deleteService', () => {
    it('should throw error when service was not found', () => {
      // Setup:
      jest.spyOn(database.models.Service, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = repository.deleteService({ service_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Service, 'findByPk').mockResolvedValue({
        destroy: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = repository.deleteService({ service_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return service deleted when is found', async () => {
      // Setup:
      jest.spyOn(database.models.Service, 'findByPk').mockResolvedValue({
        destroy: jest.fn().mockResolvedValue({
          updated_at: new Date(),
          deleted_at: new Date()
        })
      });

      // Arrange:
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = await repository.deleteService({ service_id, options });

      // Assert:
      expect(res.deleted_at).not.toBe(null);
    });
  });

  describe('getJobs', () => {
    it('should throw error when service was not found', () => {
      // Setup:
      jest.spyOn(database.models.Service, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = repository.getJobs({ service_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(database.models.Service, 'findByPk').mockResolvedValue({
        getJobs: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = repository.getJobs({ service_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      jest.spyOn(database.models.Service, 'findByPk').mockResolvedValue({
        getJobs: jest.fn().mockResolvedValue([ DATA.job ])
      });

      // Arrange:
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = await repository.getJobs({ service_id, options });

      // Assert:
      expect(res).toEqual([ DATA.job ]);
    });
    it('should return a list empty when records are not found', async () => {
      // Mock:
      jest.spyOn(database.models.Service, 'findByPk').mockResolvedValue({
        getJobs: jest.fn().mockResolvedValue([])
      });

      // Arrange:
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = await repository.getJobs({ service_id, options });

      // Assert:
      expect(res).toBeArray().toBeEmpty();
    });
  });

  describe('getJob', () => {
    it('should throw error when service was not found', () => {
      // Setup:
      jest.spyOn(database.models.Service, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const service_id = DATA.service.id;
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = repository.getJob({ service_id, job_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return null when job was not found', async () => {
      // Mock:
      jest.spyOn(database.models.Service, 'findByPk').mockResolvedValue({
        getJobs: jest.fn().mockResolvedValue(null)
      });

      // Arrange:
      const service_id = DATA.service.id;
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = await repository.getJob({ service_id, job_id, options });

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and assert is true', () => {
      // Mock:
      jest.spyOn(database.models.Service, 'findByPk').mockResolvedValue({
        getJobs: jest.fn().mockResolvedValue(null)
      });

      // Arrange:
      const service_id = DATA.service.id;
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = repository.getJob({ service_id, job_id, options }, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(database.models.Service, 'findByPk').mockResolvedValue({
        getJobs: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const service_id = DATA.service.id;
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = repository.getJob({ service_id, job_id, options }, true);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.job };

      // Mock:
      jest.spyOn(database.models.Service, 'findByPk').mockResolvedValue({
        getJobs: jest.fn().mockResolvedValue(expected)
      });

      // Arrange:
      const service_id = DATA.service.id;
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = await repository.getJob({ service_id, job_id, options }, true);

      // Assert:
      expect(res).toEqual(expected)
    });
  });
});
