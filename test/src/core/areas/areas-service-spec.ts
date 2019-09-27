import { AreaRepository as Repository } from '../../../../src/core/areas/areas-repository';
import { AreaService as Service } from '../../../../src/core/areas/areas-service';
import { I } from '../../../../src/core/areas/areas-types';
import { ERROR_BAD_GATEWAY as ACTION_ERROR } from '../../../config/errors';
import * as DATA from '../../../config/models';

describe('Area Service', () => {
  const database = {};
  const repository = Repository(database);
  let service:I.service;

  beforeEach(async () => { service = Service(repository); });

  describe('getAreas', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'getAreas').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const options = {};

      // Act:
      const res = service.getAreas(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of areas', async () => {
      // Setup:
      jest.spyOn(repository, 'getAreas').mockResolvedValue([ DATA.area ]);

      // Arrange:
      const options = {};

      // Act:
      const res = await service.getAreas(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty().toEqual([ DATA.area ]);
    });
  });

  describe('createArea', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'createArea').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const values = DATA.area;

      // Act:
      const res = service.createArea(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return area created', async () => {
      // Setup:
      jest.spyOn(repository, 'createArea').mockResolvedValue(DATA.area);

      // Arrange:
      const values = DATA.area;

      // Act:
      const res = await service.createArea(values);

      // Assert:
      expect(res).toEqual(DATA.area);
    });
  });

  describe('getArea', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'getArea').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const area_id = DATA.area.id;
      const options = {};

      // Act:
      const res = service.getArea(area_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return area when is found', async () => {
      // Setup:
      jest.spyOn(repository, 'getArea').mockResolvedValue(DATA.area);

      // Arrange:
      const area_id = DATA.area.id;
      const options = {};

      // Act:
      const res = await service.getArea(area_id, options);

      // Assert:
      expect(res).toEqual(DATA.area);
    });
  });

  describe('updateArea', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'updateArea').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const area_id = DATA.area.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = service.updateArea(area_id, values, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return area updated when is found', async () => {
      // Setup:
      jest.spyOn(repository, 'updateArea').mockResolvedValue({
        extra: { enabled: true },
        updated_at: new Date('2019-10-10')
      });

      // Arrange:
      const area_id = DATA.area.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await service.updateArea(area_id, values, options);

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.extra).toEqual({ enabled: true });
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('deleteArea', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'deleteArea').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const area_id = DATA.area.id;
      const options = {};

      // Act:
      const res = service.deleteArea(area_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return area updated when is found', async () => {
      // Setup:
      jest.spyOn(repository, 'deleteArea').mockResolvedValue({
        updated_at: new Date('2019-10-10'),
        deleted_at: new Date('2019-10-10')
      });

      // Arrange:
      const area_id = DATA.area.id;
      const options = {};

      // Act:
      const res = await service.deleteArea(area_id, options);

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('getSubareas', () => {
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(repository, 'getSubareas').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const area_id = DATA.area.id;
      const options = {};

      // Act:
      const res = service.getSubareas(area_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      jest.spyOn(repository, 'getSubareas').mockResolvedValue([ DATA.subarea ]);

      // Arrange:
      const area_id = DATA.area.id;
      const options = {};

      // Act:
      const res = await service.getSubareas(area_id, options);

      // Assert:
      expect(res).toEqual([ DATA.subarea ]);
    });
  });

  describe('addSubareas', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'addSubareas').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const area_id = DATA.area.id;
      const subareas = [ DATA.subarea.id ];

      // Act:
      const res = service.addSubareas(area_id, subareas);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations after adding them', async () => {
      // Setup:
      jest.spyOn(repository, 'addSubareas').mockResolvedValue([ DATA.areaSubarea ]);

      // Arrange:
      const area_id = DATA.area.id;
      const subareas = [ DATA.subarea.id ];

      // Act:
      const res = await service.addSubareas(area_id, subareas);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty();
      expect(res).toEqual([ DATA.areaSubarea ]);
    });
  });

  describe('getSubarea', () => {
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(repository, 'getSubarea').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const area_id = DATA.area.id;
      const subarea_id = DATA.subarea.id;
      const options = {};

      // Act:
      const res = service.getSubarea(area_id, subarea_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.subarea, AreaSubarea: DATA.areaSubarea };

      // Mock:
      jest.spyOn(repository, 'getSubarea').mockResolvedValue(expected);

      // Arrange:
      const area_id = DATA.area.id;
      const subarea_id = DATA.subarea.id;
      const options = {};

      // Act:
      const res = await service.getSubarea(area_id, subarea_id, options);

      // Assert:
      expect(res).toEqual(expected)
    });
  });

  describe('updateSubarea', () => {
    it('should throw error when action fail', () => {
      // Before:
      jest.spyOn(repository, 'updateSubarea').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const area_id = DATA.area.id;
      const subarea_id = DATA.subarea.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = service.updateSubarea(area_id, subarea_id, values, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association updated after update', async () => {
      // Before:
      jest.spyOn(repository, 'updateSubarea').mockResolvedValue({
        ...DATA.areaSubarea,
        extra: { enabled: true },
        updated_at: new Date('2019-10-10')
      });

      // Arrange:
      const area_id = DATA.areaSubarea.area_id;
      const subarea_id = DATA.areaSubarea.subarea_id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await service.updateSubarea(area_id, subarea_id, values, options);

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.area_id).toEqual(area_id);
      expect(res.subarea_id).toEqual(subarea_id);
      expect(res.extra).toEqual({ enabled: true });
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('deleteSubarea', () => {
    it('should throw error when action fail', () => {
      // Before:
      jest.spyOn(repository, 'deleteSubarea').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const area_id = DATA.area.id;
      const subarea_id = DATA.subarea.id;
      const options = {};

      // Act:
      const res = service.deleteSubarea(area_id, subarea_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association deleted after delete', async () => {
      // Before:
      jest.spyOn(repository, 'deleteSubarea').mockResolvedValue({
        ...DATA.areaSubarea,
        updated_at: new Date('2019-10-10'),
        deleted_at: new Date('2019-10-10')
      });

      // Arrange:
      const area_id = DATA.areaSubarea.area_id;
      const subarea_id = DATA.areaSubarea.subarea_id;
      const options = {};

      // Act:
      const res = await service.deleteSubarea(area_id, subarea_id, options);

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.area_id).toEqual(area_id);
      expect(res.subarea_id).toEqual(subarea_id);
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('getWorkers', () => {
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(repository, 'getWorkers').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const area_id = DATA.area.id;
      const options = {};

      // Act:
      const res = service.getWorkers(area_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      jest.spyOn(repository, 'getWorkers').mockResolvedValue([ DATA.worker ]);

      // Arrange:
      const area_id = DATA.area.id;
      const options = {};

      // Act:
      const res = await service.getWorkers(area_id, options);

      // Assert:
      expect(res).toEqual([ DATA.worker ]);
    });
  });

  describe('addWorkers', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(repository, 'addWorkers').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const area_id = DATA.area.id;
      const workers = [ DATA.worker.id ];

      // Act:
      const res = service.addWorkers(area_id, workers);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations after adding them', async () => {
      // Setup:
      jest.spyOn(repository, 'addWorkers').mockResolvedValue([ DATA.areaWorker ]);

      // Arrange:
      const area_id = DATA.area.id;
      const workers = [ DATA.worker.id ];

      // Act:
      const res = await service.addWorkers(area_id, workers);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty();
      expect(res).toEqual([ DATA.areaWorker ]);
    });
  });

  describe('getWorker', () => {
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(repository, 'getWorker').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const area_id = DATA.area.id;
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = service.getWorker(area_id, worker_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.worker, AreaWorker: DATA.areaWorker };

      // Mock:
      jest.spyOn(repository, 'getWorker').mockResolvedValue(expected);

      // Arrange:
      const area_id = DATA.area.id;
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = await service.getWorker(area_id, worker_id, options);

      // Assert:
      expect(res).toEqual(expected)
    });
  });

  describe('updateWorker', () => {
    it('should throw error when action fail', () => {
      // Before:
      jest.spyOn(repository, 'updateWorker').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const area_id = DATA.area.id;
      const worker_id = DATA.worker.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = service.updateWorker(area_id, worker_id, values, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association updated after update', async () => {
      // Before:
      jest.spyOn(repository, 'updateWorker').mockResolvedValue({
        ...DATA.areaWorker,
        extra: { enabled: true },
        updated_at: new Date('2019-10-10')
      });

      // Arrange:
      const area_id = DATA.areaWorker.area_id;
      const worker_id = DATA.areaWorker.worker_id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await service.updateWorker(area_id, worker_id, values, options);

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.area_id).toEqual(area_id);
      expect(res.worker_id).toEqual(worker_id);
      expect(res.extra).toEqual({ enabled: true });
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('deleteWorker', () => {
    it('should throw error when action fail', () => {
      // Before:
      jest.spyOn(repository, 'deleteWorker').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const area_id = DATA.area.id;
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = service.deleteWorker(area_id, worker_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association deleted after delete', async () => {
      // Before:
      jest.spyOn(repository, 'deleteWorker').mockResolvedValue({
        ...DATA.areaWorker,
        updated_at: new Date('2019-10-10'),
        deleted_at: new Date('2019-10-10')
      });

      // Arrange:
      const area_id = DATA.areaWorker.area_id;
      const worker_id = DATA.areaWorker.worker_id;
      const options = {};

      // Act:
      const res = await service.deleteWorker(area_id, worker_id, options);

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.area_id).toEqual(area_id);
      expect(res.worker_id).toEqual(worker_id);
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('getServices', () => {
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(repository, 'getServices').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const area_id = DATA.area.id;
      const options = {};

      // Act:
      const res = service.getServices(area_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      jest.spyOn(repository, 'getServices').mockResolvedValue([ DATA.service ]);

      // Arrange:
      const area_id = DATA.area.id;
      const options = {};

      // Act:
      const res = await service.getServices(area_id, options);

      // Assert:
      expect(res).toEqual([ DATA.service ]);
    });
  });

  describe('getService', () => {
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(repository, 'getService').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const area_id = DATA.area.id;
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = service.getService(area_id, service_id, options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.service };

      // Mock:
      jest.spyOn(repository, 'getService').mockResolvedValue(expected);

      // Arrange:
      const area_id = DATA.area.id;
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = await service.getService(area_id, service_id, options);

      // Assert:
      expect(res).toEqual(expected)
    });
  });
});
