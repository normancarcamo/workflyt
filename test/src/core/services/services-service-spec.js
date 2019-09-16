const Repository = require('src/core/services/services-repository');
const Service = require('src/core/services/services-service');
const ACTION_ERROR = require('test/config/errors').ERROR_BAD_GATEWAY;
const DATA = require('test/config/models');

describe('Service Service', () => {
  const database = {};
  const repository = Repository({ database });
  let service = null;

  beforeEach(async () => { service = Service({ repository }); });

  describe('getServices', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'getServices').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const options = {};

      // Act:
      const res = service.getServices(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of services', async () => {
      // Setup:
      jest.spyOn(repository, 'getServices').mockResolvedValue([ DATA.service ]);

      // Arrange:
      const options = {};

      // Act:
      const res = await service.getServices(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty().toEqual([ DATA.service ]);
    });
  });

  describe('createService', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'createService').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const values = DATA.service;

      // Act:
      const res = service.createService(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return service created', async () => {
      // Setup:
      jest.spyOn(repository, 'createService').mockResolvedValue(DATA.service);

      // Arrange:
      const values = DATA.service;

      // Act:
      const res = await service.createService(values);

      // Assert:
      expect(res).toEqual(DATA.service);
    });
  });

  describe('getService', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'getService').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = service.getService({ service_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return service when is found', async () => {
      // Setup:
      jest.spyOn(repository, 'getService').mockResolvedValue(DATA.service);

      // Arrange:
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = await service.getService({ service_id, options });

      // Assert:
      expect(res).toEqual(DATA.service);
    });
  });

  describe('updateService', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'updateService').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const service_id = DATA.service.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = service.updateService({ service_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return service updated when is found', async () => {
      // Setup:
      jest.spyOn(repository, 'updateService').mockResolvedValue({
        extra: { enabled: true },
        updated_at: new Date('2019-10-10')
      });

      // Arrange:
      const service_id = DATA.service.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await service.updateService({ service_id, values, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.extra).toEqual({ enabled: true });
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('deleteService', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'deleteService').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = service.deleteService({ service_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return service updated when is found', async () => {
      // Setup:
      jest.spyOn(repository, 'deleteService').mockResolvedValue({
        updated_at: new Date('2019-10-10'),
        deleted_at: new Date('2019-10-10')
      });

      // Arrange:
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = await service.deleteService({ service_id, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('getJobs', () => {
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(repository, 'getJobs').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = service.getJobs({ service_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      jest.spyOn(repository, 'getJobs').mockResolvedValue([ DATA.job ]);

      // Arrange:
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = await service.getJobs({ service_id, options });

      // Assert:
      expect(res).toEqual([ DATA.job ]);
    });
  });

  describe('getJob', () => {
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(repository, 'getJob').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const service_id = DATA.service.id;
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = service.getJob({ service_id, job_id, options }, true);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.job };

      // Mock:
      jest.spyOn(repository, 'getJob').mockResolvedValue(expected);

      // Arrange:
      const service_id = DATA.service.id;
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = await service.getJob({ service_id, job_id, options }, true);

      // Assert:
      expect(res).toEqual(expected)
    });
  });
});
