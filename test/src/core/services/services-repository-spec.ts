import '../../../config/global';
import * as DATA from '../../../config/models';
import DATABASE from '../../../config/database';
import { ERROR_BAD_GATEWAY as ACTION_ERROR } from '../../../config/errors';
import { ServiceRepository } from '../../../../src/core/services/services-repository';

describe('Service Repository', () => {
  const database = { ...DATABASE() };
  const repository = ServiceRepository(database);

  beforeEach(async () => { database.models = DATABASE().models; });

  describe('getServices', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Service.findAll = (async () => { throw ACTION_ERROR; }) as any;

      // Arrange:
      const options = {};

      // Act:
      const res = repository.getServices(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of services', async () => {
      // Setup:
      database.models.Service.findAll = (async () => [ DATA.service ]) as any;

      // Arrange:
      const options = {};

      // Act:
      const res = await repository.getServices(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty().toEqual([ DATA.service ]);
    });
    it('should return an empty list when records are not found', async () => {
      // Mock:
      database.models.Service.findAll = (async () => []) as any;

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
      database.models.Service.create = (async () => { throw ACTION_ERROR; }) as any;

      // Arrange:
      const values = DATA.service;

      // Act:
      const res = repository.createService(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return service created', async () => {
      // Setup:
      database.models.Service.create = (async () => DATA.service) as any;

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
      database.models.Service.findByPk = (async () => { throw ACTION_ERROR; }) as any;

      // Arrange:
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = repository.getService(service_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return null when service was not found', async () => {
      // Setup:
      database.models.Service.findByPk = (async () => null) as any;

      // Arrange:
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = await repository.getService(service_id, options);

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and strict is set true', () => {
      // Setup:
      database.models.Service.findByPk = (async () => null) as any;

      // Arrange:
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = repository.getService(service_id, options, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return service when is found', async () => {
      // Setup:
      database.models.Service.findByPk = (async () => DATA.service) as any;

      // Arrange:
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = await repository.getService(service_id, options);

      // Assert:
      expect(res).toEqual(DATA.service);
    });
  });

  describe('updateService', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Service.findByPk = (async () => ({
        update: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const service_id = DATA.service.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateService(service_id, values, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return service updated when is found', async () => {
      // Setup:
      database.models.Service.findByPk = (async () => ({
        update: async () => ({
          extra: { enabled: true },
          updated_at: new Date()
        })
      })) as any;

      // Arrange:
      const service_id = DATA.service.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await repository.updateService(service_id, values, options);

      // Assert:
      expect(res.extra).toEqual(values.extra);
    });
  });

  describe('deleteService', () => {
    it('should throw error when action fail', () => {
      // Setup:
      database.models.Service.findByPk = (async () => ({
        destroy: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = repository.deleteService(service_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return service deleted when is found', async () => {
      // Setup:
      database.models.Service.findByPk = (async () => ({
        destroy: async () => ({
          updated_at: new Date(),
          deleted_at: new Date()
        })
      })) as any;

      // Arrange:
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = await repository.deleteService(service_id, options);

      // Assert:
      expect(res.deleted_at).not.toBe(null);
    });
  });

  describe('getJobs', () => {
    it('should throw error when action fail', () => {
      // Mock:
      database.models.Service.findByPk = (async () => ({
        getJobs: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = repository.getJobs(service_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      database.models.Service.findByPk = (async () => ({
        getJobs: async () => [ DATA.job ]
      })) as any;

      // Arrange:
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = await repository.getJobs(service_id, options);

      // Assert:
      expect(res).toEqual([ DATA.job ]);
    });
    it('should return a list empty when records are not found', async () => {
      // Mock:
      database.models.Service.findByPk = (async () => ({
        getJobs: async () => []
      })) as any;

      // Arrange:
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = await repository.getJobs(service_id, options);

      // Assert:
      expect(res).toBeArray().toBeEmpty();
    });
  });

  describe('getJob', () => {
    it('should return null when job was not found', async () => {
      // Mock:
      database.models.Service.findByPk = (async () => ({
        getJobs: async () => null
      })) as any;

      // Arrange:
      const service_id = DATA.service.id;
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = await repository.getJob(service_id, job_id, options);

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and assert is true', () => {
      // Mock:
      database.models.Service.findByPk = (async () => ({
        getJobs: async () => null
      })) as any;

      // Arrange:
      const service_id = DATA.service.id;
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = repository.getJob(service_id, job_id, options, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Mock:
      database.models.Service.findByPk = (async () => ({
        getJobs: async () => { throw ACTION_ERROR; }
      })) as any;

      // Arrange:
      const service_id = DATA.service.id;
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = repository.getJob(service_id, job_id, options, true);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.job };

      // Mock:
      database.models.Service.findByPk = (async () => ({
        getJobs: async () => expected
      })) as any;

      // Arrange:
      const service_id = DATA.service.id;
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = await repository.getJob(service_id, job_id, options, true);

      // Assert:
      expect(res).toEqual(expected)
    });
  });
});
