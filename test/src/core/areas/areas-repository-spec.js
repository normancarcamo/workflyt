const Repository = require('src/core/areas/areas-repository');
const ACTION_ERROR = require('test/config/errors').ERROR_BAD_GATEWAY;
const DATA = require('test/config/models');
const DATABASE = require('test/config/database');

describe('Area Repository', () => {
  const database = { ...DATABASE };
  const repository = Repository({ database });

  beforeEach(async () => { database.models = DATABASE.models; });

  describe('getAreas', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Area, 'findAll').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const options = {};

      // Act:
      const res = repository.getAreas(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of areas', async () => {
      // Setup:
      jest.spyOn(database.models.Area, 'findAll')
        .mockResolvedValue([ DATA.area ]);

      // Arrange:
      const options = {};

      // Act:
      const res = await repository.getAreas(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty().toEqual([ DATA.area ]);
    });
    it('should return an empty list when records are not found', async () => {
      // Setup:
      jest.spyOn(database.models.Area, 'findAll').mockResolvedValue([]);

      // Arrange:
      const options = {};

      // Act:
      const res = await repository.getAreas(options);

      // Assert:
      expect(res).toBeArray().toBeEmpty();
    });
  });

  describe('createArea', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Area, 'create').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const values = DATA.area;

      // Act:
      const res = repository.createArea(values);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return area created', async () => {
      // Setup:
      jest.spyOn(database.models.Area, 'create')
        .mockResolvedValue(DATA.area);

      // Arrange:
      const values = DATA.area;

      // Act:
      const res = await repository.createArea(values);

      // Assert:
      expect(res).toEqual(DATA.area);
    });
  });

  describe('getArea', () => {
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Area, 'findByPk').mockRejectedValue(ACTION_ERROR);

      // Arrange:
      const area_id = DATA.area.id;
      const options = {};

      // Act:
      const res = repository.getArea({ area_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return null when area was not found', async () => {
      // Setup:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const area_id = DATA.area.id;
      const options = {};

      // Act:
      const res = await repository.getArea({ area_id, options });

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and strict is set true', () => {
      // Setup:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const area_id = DATA.area.id;
      const options = {};

      // Act:
      const res = repository.getArea({ area_id, options }, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return area when is found', async () => {
      // Setup:
      jest.spyOn(database.models.Area, 'findByPk')
        .mockResolvedValue(DATA.area);

      // Arrange:
      const area_id = DATA.area.id;
      const options = {};

      // Act:
      const res = await repository.getArea({ area_id, options });

      // Assert:
      expect(res).toEqual(DATA.area);
    });
  });

  describe('updateArea', () => {
    it('should throw error when area was not found', () => {
      // Setup:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const area_id = DATA.area.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateArea({ area_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue({
        update: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const area_id = DATA.area.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateArea({ area_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return area updated when is found', async () => {
      // Setup:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue({
        update: jest.fn().mockResolvedValue({
          extra: { enabled: true },
          updated_at: new Date()
        })
      });

      // Arrange:
      const area_id = DATA.area.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await repository.updateArea({ area_id, values, options });

      // Assert:
      expect(res.extra).toEqual(values.extra);
    });
  });

  describe('deleteArea', () => {
    it('should throw error when area was not found', () => {
      // Setup:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const area_id = DATA.area.id;
      const options = {};

      // Act:
      const res = repository.deleteArea({ area_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue({
        destroy: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const area_id = DATA.area.id;
      const options = {};

      // Act:
      const res = repository.deleteArea({ area_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return area deleted when is found', async () => {
      // Setup:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue({
        destroy: jest.fn().mockResolvedValue({
          updated_at: new Date(),
          deleted_at: new Date()
        })
      });

      // Arrange:
      const area_id = DATA.area.id;
      const options = {};

      // Act:
      const res = await repository.deleteArea({ area_id, options });

      // Assert:
      expect(res.deleted_at).not.toBe(null);
    });
  });

  describe('getSubareas', () => {
    it('should throw error when area was not found', () => {
      // Setup:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const area_id = DATA.area.id;
      const options = {};

      // Act:
      const res = repository.getSubareas({ area_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue({
        getSubareas: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const area_id = DATA.area.id;
      const options = {};

      // Act:
      const res = repository.getSubareas({ area_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue({
        getSubareas: jest.fn().mockResolvedValue([ DATA.subarea ])
      });

      // Arrange:
      const area_id = DATA.area.id;
      const options = {};

      // Act:
      const res = await repository.getSubareas({ area_id, options });

      // Assert:
      expect(res).toEqual([ DATA.subarea ]);
    });
    it('should return a list empty when records are not found', async () => {
      // Mock:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue({
        getSubareas: jest.fn().mockResolvedValue([])
      });

      // Arrange:
      const area_id = DATA.area.id;
      const options = {};

      // Act:
      const res = await repository.getSubareas({ area_id, options });

      // Assert:
      expect(res).toBeArray().toBeEmpty();
    });
  });

  describe('addSubareas', () => {
    it('should throw error when area was not found', () => {
      // Setup:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const area_id = DATA.area.id;
      const subareas = [ DATA.subarea.id ];

      // Act:
      const res = repository.addSubareas({ area_id, subareas });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue({
        addSubareas: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const options = { area_id: DATA.area.id, subareas: [ DATA.subarea.id ] };

      // Act:
      const res = repository.addSubareas(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations after adding them', async () => {
      // Setup:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue({
        addSubareas: jest.fn().mockResolvedValue([ DATA.areaSubarea ])
      });

      // Arrange:
      const options = { area_id: DATA.area.id, subareas: [ DATA.subarea.id ] };

      // Act:
      const res = await repository.addSubareas(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty();
      expect(res).toEqual([ DATA.areaSubarea ]);
    });
  });

  describe('getSubarea', () => {
    it('should throw error when area was not found', () => {
      // Setup:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const area_id = DATA.area.id;
      const subarea_id = DATA.subarea.id;
      const options = {};

      // Act:
      const res = repository.getSubarea({ area_id, subarea_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return null when subarea was not found', async () => {
      // Mock:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue({
        getSubareas: jest.fn().mockResolvedValue(null)
      });

      // Arrange:
      const area_id = DATA.area.id;
      const subarea_id = DATA.subarea.id;
      const options = {};

      // Act:
      const res = await repository.getSubarea({ area_id, subarea_id, options });

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and assert is true', () => {
      // Mock:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue({
        getSubareas: jest.fn().mockResolvedValue(null)
      });

      // Arrange:
      const area_id = DATA.area.id;
      const subarea_id = DATA.subarea.id;
      const options = {};

      // Act:
      const res = repository.getSubarea({ area_id, subarea_id, options }, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue({
        getSubareas: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const area_id = DATA.area.id;
      const subarea_id = DATA.subarea.id;
      const options = {};

      // Act:
      const res = repository.getSubarea({ area_id, subarea_id, options }, true);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.subarea, AreaSubarea: DATA.areaSubarea };

      // Mock:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue({
        getSubareas: jest.fn().mockResolvedValue(expected)
      });

      // Arrange:
      const area_id = DATA.area.id;
      const subarea_id = DATA.subarea.id;
      const options = {};

      // Act:
      const res = await repository.getSubarea({ area_id, subarea_id, options }, true);

      // Assert:
      expect(res).toEqual(expected)
    });
  });

  describe('updateSubarea', () => {
    it('should throw error when area was not found', () => {
      // Before:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const area_id = DATA.area.id;
      const subarea_id = DATA.subarea.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateSubarea({ area_id, subarea_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return null when subarea was not found', () => {
      // Before:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue({
        getSubareas: jest.fn().mockResolvedValue(null)
      });

      // Arrange:
      const area_id = DATA.area.id;
      const subarea_id = DATA.subarea.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateSubarea({ area_id, subarea_id, values, options });

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Before:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue({
        getSubareas: jest.fn().mockResolvedValue({
          AreaSubarea: {
            update: jest.fn().mockRejectedValue(ACTION_ERROR)
          }
        })
      });

      // Arrange:
      const area_id = DATA.area.id;
      const subarea_id = DATA.subarea.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateSubarea({ area_id, subarea_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association updated after update', async () => {
      // Before:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue({
        getSubareas: jest.fn().mockResolvedValue({
          AreaSubarea: {
            update: jest.fn().mockResolvedValue({
              ...DATA.areaSubarea,
              extra: { enabled: true },
              updated_at: new Date('2019-10-10')
            })
          }
        })
      });

      // Arrange:
      const area_id = DATA.areaSubarea.area_id;
      const subarea_id = DATA.areaSubarea.subarea_id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await repository.updateSubarea({ area_id, subarea_id, values, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.area_id).toEqual(area_id);
      expect(res.subarea_id).toEqual(subarea_id);
      expect(res.extra).toEqual({ enabled: true });
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('deleteSubarea', () => {
    it('should throw error when area was not found', () => {
      // Before:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const area_id = DATA.area.id;
      const subarea_id = DATA.subarea.id;
      const options = {};

      // Act:
      const res = repository.deleteSubarea({ area_id, subarea_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return null when subarea was not found', () => {
      // Before:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue({
        getSubareas: jest.fn().mockResolvedValue(null)
      });

      // Arrange:
      const area_id = DATA.area.id;
      const subarea_id = DATA.subarea.id;
      const options = {};

      // Act:
      const res = repository.deleteSubarea({ area_id, subarea_id, options });

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Before:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue({
        getSubareas: jest.fn().mockResolvedValue({
          AreaSubarea: {
            destroy: jest.fn().mockRejectedValue(ACTION_ERROR)
          }
        })
      });

      // Arrange:
      const area_id = DATA.area.id;
      const subarea_id = DATA.subarea.id;
      const options = {};

      // Act:
      const res = repository.deleteSubarea({ area_id, subarea_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association deleted after delete', async () => {
      // Before:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue({
        getSubareas: jest.fn().mockResolvedValue({
          AreaSubarea: {
            destroy: jest.fn().mockResolvedValue({
              ...DATA.areaSubarea,
              updated_at: new Date('2019-10-10'),
              deleted_at: new Date('2019-10-10')
            })
          }
        })
      });

      // Arrange:
      const area_id = DATA.areaSubarea.area_id;
      const subarea_id = DATA.areaSubarea.subarea_id;
      const options = {};

      // Act:
      const res = await repository.deleteSubarea({ area_id, subarea_id, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.area_id).toEqual(area_id);
      expect(res.subarea_id).toEqual(subarea_id);
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('getWorkers', () => {
    it('should throw error when area was not found', () => {
      // Setup:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const area_id = DATA.area.id;
      const options = {};

      // Act:
      const res = repository.getWorkers({ area_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue({
        getWorkers: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const area_id = DATA.area.id;
      const options = {};

      // Act:
      const res = repository.getWorkers({ area_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue({
        getWorkers: jest.fn().mockResolvedValue([ DATA.worker ])
      });

      // Arrange:
      const area_id = DATA.area.id;
      const options = {};

      // Act:
      const res = await repository.getWorkers({ area_id, options });

      // Assert:
      expect(res).toEqual([ DATA.worker ]);
    });
    it('should return a list empty when records are not found', async () => {
      // Mock:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue({
        getWorkers: jest.fn().mockResolvedValue([])
      });

      // Arrange:
      const area_id = DATA.area.id;
      const options = {};

      // Act:
      const res = await repository.getWorkers({ area_id, options });

      // Assert:
      expect(res).toBeArray().toBeEmpty();
    });
  });

  describe('addWorkers', () => {
    it('should throw error when area was not found', () => {
      // Setup:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const area_id = DATA.area.id;
      const workers = [ DATA.worker.id ];

      // Act:
      const res = repository.addWorkers({ area_id, workers });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Setup:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue({
        addWorkers: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const options = {
        area_id: DATA.area.id,
        workers: [ DATA.worker.id ]
      };

      // Act:
      const res = repository.addWorkers(options);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations after adding them', async () => {
      // Setup:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue({
        addWorkers: jest.fn().mockResolvedValue([
          DATA.areaWorker
        ])
      });

      // Arrange:
      const options = {
        area_id: DATA.area.id,
        workers: [ DATA.worker.id ]
      };

      // Act:
      const res = await repository.addWorkers(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty();
      expect(res).toEqual([ DATA.areaWorker ]);
    });
  });

  describe('getWorker', () => {
    it('should throw error when area was not found', () => {
      // Setup:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const area_id = DATA.area.id;
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = repository.getWorker({ area_id, worker_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return null when worker was not found', async () => {
      // Mock:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue({
        getWorkers: jest.fn().mockResolvedValue(null)
      });

      // Arrange:
      const area_id = DATA.area.id;
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = await repository.getWorker({ area_id, worker_id, options });

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and assert is true', () => {
      // Mock:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue({
        getWorkers: jest.fn().mockResolvedValue(null)
      });

      // Arrange:
      const area_id = DATA.area.id;
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = repository.getWorker({ area_id, worker_id, options }, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue({
        getWorkers: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const area_id = DATA.area.id;
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = repository.getWorker({ area_id, worker_id, options }, true);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.worker, AreaWorker: DATA.areaWorker };

      // Mock:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue({
        getWorkers: jest.fn().mockResolvedValue(expected)
      });

      // Arrange:
      const area_id = DATA.area.id;
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = await repository.getWorker({ area_id, worker_id, options }, true);

      // Assert:
      expect(res).toEqual(expected)
    });
  });

  describe('updateWorker', () => {
    it('should throw error when area was not found', () => {
      // Before:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const area_id = DATA.area.id;
      const worker_id = DATA.worker.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateWorker({ area_id, worker_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return null when worker was not found', () => {
      // Before:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue({
        getWorkers: jest.fn().mockResolvedValue(null)
      });

      // Arrange:
      const area_id = DATA.area.id;
      const worker_id = DATA.worker.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateWorker({ area_id, worker_id, values, options });

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Before:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue({
        getWorkers: jest.fn().mockResolvedValue({
          AreaWorker: {
            update: jest.fn().mockRejectedValue(ACTION_ERROR)
          }
        })
      });

      // Arrange:
      const area_id = DATA.area.id;
      const worker_id = DATA.worker.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateWorker({ area_id, worker_id, values, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association updated after update', async () => {
      // Before:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue({
        getWorkers: jest.fn().mockResolvedValue({
          AreaWorker: {
            update: jest.fn().mockResolvedValue({
              ...DATA.areaWorker,
              extra: { enabled: true },
              updated_at: new Date('2019-10-10')
            })
          }
        })
      });

      // Arrange:
      const area_id = DATA.areaWorker.area_id;
      const worker_id = DATA.areaWorker.worker_id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await repository.updateWorker({ area_id, worker_id, values, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.area_id).toEqual(area_id);
      expect(res.worker_id).toEqual(worker_id);
      expect(res.extra).toEqual({ enabled: true });
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('deleteWorker', () => {
    it('should throw error when area was not found', () => {
      // Before:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const area_id = DATA.area.id;
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = repository.deleteWorker({ area_id, worker_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return null when worker was not found', () => {
      // Before:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue({
        getWorkers: jest.fn().mockResolvedValue(null)
      });

      // Arrange:
      const area_id = DATA.area.id;
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = repository.deleteWorker({ area_id, worker_id, options });

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Before:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue({
        getWorkers: jest.fn().mockResolvedValue({
          AreaWorker: {
            destroy: jest.fn().mockRejectedValue(ACTION_ERROR)
          }
        })
      });

      // Arrange:
      const area_id = DATA.area.id;
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = repository.deleteWorker({ area_id, worker_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association deleted after delete', async () => {
      // Before:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue({
        getWorkers: jest.fn().mockResolvedValue({
          AreaWorker: {
            destroy: jest.fn().mockResolvedValue({
              ...DATA.areaWorker,
              updated_at: new Date('2019-10-10'),
              deleted_at: new Date('2019-10-10')
            })
          }
        })
      });

      // Arrange:
      const area_id = DATA.areaWorker.area_id;
      const worker_id = DATA.areaWorker.worker_id;
      const options = {};

      // Act:
      const res = await repository.deleteWorker({ area_id, worker_id, options });

      // Assert:
      expect(res).toBeObject().not.toBeEmpty();
      expect(res.area_id).toEqual(area_id);
      expect(res.worker_id).toEqual(worker_id);
      expect(res.updated_at).toEqual(new Date('2019-10-10'));
      expect(res.deleted_at).toEqual(new Date('2019-10-10'));
    });
  });

  describe('getServices', () => {
    it('should throw error when area was not found', () => {
      // Setup:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const area_id = DATA.area.id;
      const options = {};

      // Act:
      const res = repository.getServices({ area_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue({
        getServices: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const area_id = DATA.area.id;
      const options = {};

      // Act:
      const res = repository.getServices({ area_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Mock:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue({
        getServices: jest.fn().mockResolvedValue([ DATA.service ])
      });

      // Arrange:
      const area_id = DATA.area.id;
      const options = {};

      // Act:
      const res = await repository.getServices({ area_id, options });

      // Assert:
      expect(res).toEqual([ DATA.service ]);
    });
    it('should return a list empty when records are not found', async () => {
      // Mock:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue({
        getServices: jest.fn().mockResolvedValue([])
      });

      // Arrange:
      const area_id = DATA.area.id;
      const options = {};

      // Act:
      const res = await repository.getServices({ area_id, options });

      // Assert:
      expect(res).toBeArray().toBeEmpty();
    });
  });

  describe('getService', () => {
    it('should throw error when area was not found', () => {
      // Setup:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue(null);

      // Arrange:
      const area_id = DATA.area.id;
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = repository.getService({ area_id, service_id, options });

      // Assert:
      return res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should return null when service was not found', async () => {
      // Mock:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue({
        getServices: jest.fn().mockResolvedValue(null)
      });

      // Arrange:
      const area_id = DATA.area.id;
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = await repository.getService({ area_id, service_id, options });

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and assert is true', () => {
      // Mock:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue({
        getServices: jest.fn().mockResolvedValue(null)
      });

      // Arrange:
      const area_id = DATA.area.id;
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = repository.getService({ area_id, service_id, options }, true);

      // Assert:
      res.catch(e => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Mock:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue({
        getServices: jest.fn().mockRejectedValue(ACTION_ERROR)
      });

      // Arrange:
      const area_id = DATA.area.id;
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = repository.getService({ area_id, service_id, options }, true);

      // Assert:
      return res.catch(e => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      const expected = { ...DATA.service };

      // Mock:
      jest.spyOn(database.models.Area, 'findByPk').mockResolvedValue({
        getServices: jest.fn().mockResolvedValue(expected)
      });

      // Arrange:
      const area_id = DATA.area.id;
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = await repository.getService({ area_id, service_id, options }, true);

      // Assert:
      expect(res).toEqual(expected)
    });
  });
});
