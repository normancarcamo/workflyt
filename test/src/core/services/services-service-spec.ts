import '../../../config/global';
import { ServiceRepository } from '../../../../src/core/services/services-repository';
import { ServiceService } from '../../../../src/core/services/services-service';
import { I } from '../../../../src/core/services/services-types';
import { ERROR_BAD_GATEWAY as ACTION_ERROR } from '../../../config/errors';
import * as DATA from '../../../config/models';

describe('Service Service', () => {
  let database = {};
  let repository = ServiceRepository(database);
  let service:I.service = ServiceService(repository);

  beforeEach(async () => { service = ServiceService(repository); });

  describe('getServices', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.getServices = async () => { throw ACTION_ERROR; };

      // Arrange:
      const options = {};

      // Act:
      const res = service.getServices(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of services', async () => {
      // Setup:
      repository.getServices = async () => [ DATA.service ];

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
      repository.createService = async () => { throw ACTION_ERROR; };

      // Arrange:
      const values = DATA.service;

      // Act:
      const res = service.createService(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return service created', async () => {
      // Setup:
      repository.createService = async () => DATA.service;

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
      repository.getService = async () => { throw ACTION_ERROR; };

      // Arrange:
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = service.getService(service_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return service when is found', async () => {
      // Setup:
      repository.getService = async () => DATA.service;

      // Arrange:
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = await service.getService(service_id, options);

      // Assert:
      expect(res).toEqual(DATA.service);
    });
  });

  describe('updateService', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.updateService = async () => { throw ACTION_ERROR; };

      // Arrange:
      const service_id = DATA.service.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = service.updateService(service_id, values, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return service updated when is found', async () => {
      // Setup:
      repository.updateService = async () => ({
        extra: { enabled: true },
        updated_at: new Date('2019-10-10')
      });

      // Arrange:
      const service_id = DATA.service.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await service.updateService(service_id, values, options);

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.extra).toEqual({ enabled: true });
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('deleteService', () => {
    it('should throw error when action fail', () => {
      // Setup:
      repository.deleteService = async () => { throw ACTION_ERROR; };

      // Arrange:
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = service.deleteService(service_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return service updated when is found', async () => {
      // Setup:
      repository.deleteService = async () => ({
        updated_at: new Date('2019-10-10'),
        deleted_at: new Date('2019-10-10')
      });

      // Arrange:
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = await service.deleteService(service_id, options);

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('getJobs', () => {
    it('should throw error when action fail', () => {
      // Mock:
      repository.getJobs = async () => { throw ACTION_ERROR; };

      // Arrange:
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = service.getJobs(service_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      repository.getJobs = async () => [ DATA.job ];

      // Arrange:
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = await service.getJobs(service_id, options);

      // Assert:
      expect(res).toEqual([ DATA.job ]);
    });
  });

  describe('getJob', () => {
    it('should throw error when action fail', () => {
      // Mock:
      repository.getJob = async () => { throw ACTION_ERROR; };

      // Arrange:
      const service_id = DATA.service.id;
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = service.getJob(service_id, job_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.job };

      // Mock:
      repository.getJob = async () => expected;

      // Arrange:
      const service_id = DATA.service.id;
      const job_id = DATA.job.id;
      const options = {};

      // Act:
      const res = await service.getJob(service_id, job_id, options);

      // Assert:
      expect(res).toEqual(expected);
    });
  });
});
