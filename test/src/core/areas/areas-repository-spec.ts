import '../../../config/global';
import * as DATA from '../../../config/models';
import DATABASE from '../../../config/database';
import { ERROR_BAD_GATEWAY as ACTION_ERROR } from '../../../config/errors';
import { AreaRepository } from '../../../../src/core/areas/areas-repository';

describe('Area Repository', () => {
  const database = { ...DATABASE() };
  const repository = AreaRepository(database);

  beforeEach(async () => { database.models = DATABASE().models; });

  describe('getAreas', () => {
    it('should throw error when action fail', () => {
      // Arrange:
      database.models.Area.findAll = (async () => { throw ACTION_ERROR; }) as any;
      const options = {};

      // Act:
      const res = repository.getAreas(options);

      // Assert:
      return res.catch((e:Error) => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of areas', async () => {
      // Arrange:
      database.models.Area.findAll = (async () => [ DATA.area ]) as any;
      const options = {};

      // Act:
      const res = await repository.getAreas(options);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty().toEqual([ DATA.area ]);
    });
    it('should return an empty list when records are not found', async () => {
      // Arrange:
      database.models.Area.findAll = (async () => []) as any;
      const options = {};

      // Act:
      const res = await repository.getAreas(options);

      // Assert:
      expect(res).toBeArray().toBeEmpty();
    });
  });

  describe('createArea', () => {
    it('should throw error when action fail', () => {
      // Arrange:
      database.models.Area.create = (async () => { throw ACTION_ERROR; }) as any;
      const values = DATA.area;

      // Act:
      const res = repository.createArea(values);

      // Assert:
      return res.catch((e:Error) => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return area created', async () => {
      // Arrange:
      database.models.Area.create = (async () => DATA.area) as any;
      const values = DATA.area;

      // Act:
      const res = await repository.createArea(values);

      // Assert:
      expect(res).toEqual(DATA.area);
    });
  });

  describe('getArea', () => {
    it('should throw error when action fail', () => {
      // Arrange:
      database.models.Area.findByPk = (async () => { throw ACTION_ERROR; }) as any;
      const area_id = DATA.area.id;
      const options = {};

      // Act:
      const res = repository.getArea(area_id, options);

      // Assert:
      return res.catch((e:Error) => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return null when area was not found', async () => {
      // Arrange:
      database.models.Area.findByPk = (async () => null) as any;
      const area_id = DATA.area.id;
      const options = {};

      // Act:
      const res = await repository.getArea(area_id, options);

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and strict is set true', () => {
      // Arrange:
      database.models.Area.findByPk = (async () => null) as any;
      const area_id = DATA.area.id;
      const options = {};

      // Act:
      const res = repository.getArea(area_id, options, true);

      // Assert:
      res.catch((e:Error) => expect(e.message).toEqual('Not found'));
    });
    it('should return area when is found', async () => {
      // Arrange:
      database.models.Area.findByPk = (async () => DATA.area) as any;
      const area_id = DATA.area.id;
      const options = {};

      // Act:
      const res = await repository.getArea(area_id, options);

      // Assert:
      expect(res).toEqual(DATA.area);
    });
  });

  describe('updateArea', () => {
    it('should throw error when action fail', () => {
      database.models.Area.findByPk = (async () => ({
        update: async () => { throw ACTION_ERROR; }
      })) as any;
      const area_id = DATA.area.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateArea(area_id, values, options);

      // Assert:
      return res.catch((e:Error) => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return area updated when is found', async () => {
      // Arrange:
      database.models.Area.findByPk = (async () => ({
        update: async () => ({
          extra: { enabled: true },
          updated_at: new Date()
        })
      })) as any;
      const area_id = DATA.area.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await repository.updateArea(area_id, values, options);

      // Assert:
      expect(res.extra).toEqual(values.extra);
    });
  });

  describe('deleteArea', () => {
    it('should throw error when action fail', () => {
      // Arrange:
      database.models.Area.findByPk = (async () => ({
        destroy: async () => { throw ACTION_ERROR; }
      })) as any;
      const area_id = DATA.area.id;
      const options = {};

      // Act:
      const res = repository.deleteArea(area_id, options);

      // Assert:
      return res.catch((e:Error) => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return area deleted when is found', async () => {
      // Arrange:
      database.models.Area.findByPk = (async () => ({
        destroy: async () => ({
          updated_at: new Date(),
          deleted_at: new Date()
        })
      })) as any;
      const area_id = DATA.area.id;
      const options = {};

      // Act:
      const res = await repository.deleteArea(area_id, options);

      // Assert:
      expect(res.deleted_at).not.toBe(null);
    });
  });

  describe('getSubareas', () => {
    it('should throw error when action fail', () => {
      // Arrange:
      database.models.Area.findByPk = (async () => ({
        getSubareas: async () => { throw ACTION_ERROR; }
      })) as any;
      const area_id = DATA.area.id;
      const options = {};

      // Act:
      const res = repository.getSubareas(area_id, options);

      // Assert:
      return res.catch((e:Error) => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Arrange:
      database.models.Area.findByPk = (async () => ({
        getSubareas: async () => [ DATA.subarea ]
      })) as any;
      const area_id = DATA.area.id;
      const options = {};

      // Act:
      const res = await repository.getSubareas(area_id, options);

      // Assert:
      expect(res).toEqual([ DATA.subarea ]);
    });
    it('should return a list empty when records are not found', async () => {
      // Arrange:
      database.models.Area.findByPk = (async () => ({
        getSubareas: async () => []
      })) as any;
      const area_id = DATA.area.id;
      const options = {};

      // Act:
      const res = await repository.getSubareas(area_id, options);

      // Assert:
      expect(res).toBeArray().toBeEmpty();
    });
  });

  describe('addSubareas', () => {
    it('should throw error when action fail', () => {
      // Arrange:
      database.models.Area.findByPk = (async () => ({
        addSubareas: async () => { throw ACTION_ERROR; }
      })) as any;
      const area_id = DATA.area.id;
      const subareas = [ DATA.subarea.id ];

      // Act:
      const res = repository.addSubareas(area_id, subareas);

      // Assert:
      return res.catch((e:Error) => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations after adding them', async () => {
      // Arrange:
      database.models.Area.findByPk = (async () => ({
        addSubareas: async () => [ DATA.areaSubarea ]
      })) as any;
      const area_id = DATA.area.id;
      const subareas = [ DATA.subarea.id ];

      // Act:
      const res = await repository.addSubareas(area_id, subareas);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty();
      expect(res).toEqual([ DATA.areaSubarea ]);
    });
  });

  describe('getSubarea', () => {
    it('should return null when subarea was not found', async () => {
      // Arrange:
      database.models.Area.findByPk = (async () => ({
        getSubareas: async () => null
      })) as any;
      const area_id = DATA.area.id;
      const subarea_id = DATA.subarea.id;
      const options = {};

      // Act:
      const res = await repository.getSubarea(area_id, subarea_id, options);

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and assert is true', () => {
      // Arrange:
      database.models.Area.findByPk = (async () => ({
        getSubareas: async () => null
      })) as any;
      const area_id = DATA.area.id;
      const subarea_id = DATA.subarea.id;
      const options = {};

      // Act:
      const res = repository.getSubarea(area_id, subarea_id, options, true);

      // Assert:
      res.catch((e:Error) => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Arrange:
      database.models.Area.findByPk = (async () => ({
        getSubareas: async () => { throw ACTION_ERROR; }
      })) as any;
      const area_id = DATA.area.id;
      const subarea_id = DATA.subarea.id;
      const options = {};

      // Act:
      const res = repository.getSubarea(area_id, subarea_id, options, true);

      // Assert:
      return res.catch((e:Error) => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      // Arrange:
      const expected = { ...DATA.subarea, AreaSubarea: DATA.areaSubarea };
      database.models.Area.findByPk = (async () => ({
        getSubareas: async () => expected
      })) as any;
      const area_id = DATA.area.id;
      const subarea_id = DATA.subarea.id;
      const options = {};

      // Act:
      const res = await repository.getSubarea(area_id, subarea_id, options, true);

      // Assert:
      expect(res).toEqual(expected)
    });
  });

  describe('updateSubarea', () => {
    it('should throw error when action fail', () => {
      // Arrange:
      database.models.Area.findByPk = (async () => ({
        getSubareas: async () => ({
          AreaSubarea: {
            update: async () => { throw ACTION_ERROR; }
          }
        })
      })) as any;
      const area_id = DATA.area.id;
      const subarea_id = DATA.subarea.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateSubarea(area_id, subarea_id, values, options);

      // Assert:
      return res.catch((e:Error) => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association updated after update', async () => {
      // Arrange:
      database.models.Area.findByPk = (async () => ({
        getSubareas: async () => ({
          AreaSubarea: {
            update: async () => ({
              ...DATA.areaSubarea,
              extra: { enabled: true },
              updated_at: new Date('2019-10-10')
            })
          }
        })
      })) as any;
      const area_id = DATA.areaSubarea.area_id;
      const subarea_id = DATA.areaSubarea.subarea_id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await repository.updateSubarea(area_id, subarea_id, values, options);

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
      // Arrange:
      database.models.Area.findByPk = (async () => ({
        getSubareas: async () => ({
          AreaSubarea: {
            destroy: async () => { throw ACTION_ERROR; }
          }
        })
      })) as any;
      const area_id = DATA.area.id;
      const subarea_id = DATA.subarea.id;
      const options = {};

      // Act:
      const res = repository.deleteSubarea(area_id, subarea_id, options);

      // Assert:
      return res.catch((e:Error) => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association deleted after delete', async () => {
      // Arrange:
      database.models.Area.findByPk = (async () => ({
        getSubareas: async () => ({
          AreaSubarea: {
            destroy: async () => ({
              ...DATA.areaSubarea,
              updated_at: new Date('2019-10-10'),
              deleted_at: new Date('2019-10-10')
            })
          }
        })
      })) as any;
      const area_id = DATA.areaSubarea.area_id;
      const subarea_id = DATA.areaSubarea.subarea_id;
      const options = {};

      // Act:
      const res = await repository.deleteSubarea(area_id, subarea_id, options);

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
      // Arrange:
      database.models.Area.findByPk = (async () => ({
        getWorkers: async () => { throw ACTION_ERROR; }
      })) as any;
      const area_id = DATA.area.id;
      const options = {};

      // Act:
      const res = repository.getWorkers(area_id, options);

      // Assert:
      return res.catch((e:Error) => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Arrange:
      database.models.Area.findByPk = (async () => ({
        getWorkers: async () => [ DATA.worker ]
      })) as any;
      const area_id = DATA.area.id;
      const options = {};

      // Act:
      const res = await repository.getWorkers(area_id, options);

      // Assert:
      expect(res).toEqual([ DATA.worker ]);
    });
    it('should return a list empty when records are not found', async () => {
      // Arrange:
      database.models.Area.findByPk = (async () => ({
        getWorkers: async () => []
      })) as any;
      const area_id = DATA.area.id;
      const options = {};

      // Act:
      const res = await repository.getWorkers(area_id, options);

      // Assert:
      expect(res).toBeArray().toBeEmpty();
    });
  });

  describe('addWorkers', () => {
    it('should throw error when action fail', () => {
      // Arrange:
      database.models.Area.findByPk = (async () => ({
        addWorkers: async () => { throw ACTION_ERROR; }
      })) as any;
      const area_id = DATA.area.id;
      const workers = [ DATA.worker.id ];

      // Act:
      const res = repository.addWorkers(area_id, workers);

      // Assert:
      return res.catch((e:Error) => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations after adding them', async () => {
      // Arrange:
      database.models.Area.findByPk = (async () => ({
        addWorkers: async () => [ DATA.areaWorker ]
      })) as any;
      const area_id = DATA.area.id;
      const workers = [ DATA.worker.id ];

      // Act:
      const res = await repository.addWorkers(area_id, workers);

      // Assert:
      expect(res).toBeArray().not.toBeEmpty();
      expect(res).toEqual([ DATA.areaWorker ]);
    });
  });

  describe('getWorker', () => {
    it('should return null when worker was not found', async () => {
      // Arrange:
      database.models.Area.findByPk = (async () => ({
        getWorkers: async () => null
      })) as any;
      const area_id = DATA.area.id;
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = await repository.getWorker(area_id, worker_id, options);

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and assert is true', () => {
      // Arrange:
      database.models.Area.findByPk = (async () => ({
        getWorkers: async () => null
      })) as any;
      const area_id = DATA.area.id;
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = repository.getWorker(area_id, worker_id, options, true);

      // Assert:
      res.catch((e:Error) => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Arrange:
      database.models.Area.findByPk = (async () => ({
        getWorkers: async () => { throw ACTION_ERROR; }
      })) as any;
      const area_id = DATA.area.id;
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = repository.getWorker(area_id, worker_id, options, true);

      // Assert:
      return res.catch((e:Error) => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      // Arrange:
      const expected = { ...DATA.worker, AreaWorker: DATA.areaWorker };
      database.models.Area.findByPk = (async () => ({
        getWorkers: async () => expected
      })) as any;
      const area_id = DATA.area.id;
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = await repository.getWorker(area_id, worker_id, options, true);

      // Assert:
      expect(res).toEqual(expected)
    });
  });

  describe('updateWorker', () => {
    it('should throw error when action fail', () => {
      // Arrange:
      database.models.Area.findByPk = (async () => ({
        getWorkers: async () => ({
          AreaWorker: {
            update: async () => { throw ACTION_ERROR; }
          }
        })
      })) as any;
      const area_id = DATA.area.id;
      const worker_id = DATA.worker.id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = repository.updateWorker(area_id, worker_id, values, options);

      // Assert:
      return res.catch((e:Error) => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association updated after update', async () => {
      // Arrange:
      database.models.Area.findByPk = (async () => ({
        getWorkers: async () => ({
          AreaWorker: {
            update: async () => ({
              ...DATA.areaWorker,
              extra: { enabled: true },
              updated_at: new Date('2019-10-10')
            })
          }
        })
      })) as any;
      const area_id = DATA.areaWorker.area_id;
      const worker_id = DATA.areaWorker.worker_id;
      const values = { extra: { enabled: true } };
      const options = {};

      // Act:
      const res = await repository.updateWorker(area_id, worker_id, values, options);

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
      // Arrange:
      database.models.Area.findByPk = (async () => ({
        getWorkers: async () => ({
          AreaWorker: {
            destroy: async () => { throw ACTION_ERROR; }
          }
        })
      })) as any;
      const area_id = DATA.area.id;
      const worker_id = DATA.worker.id;
      const options = {};

      // Act:
      const res = repository.deleteWorker(area_id, worker_id, options);

      // Assert:
      return res.catch((e:Error) => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association deleted after delete', async () => {
      // Arrange:
      database.models.Area.findByPk = (async () => ({
        getWorkers: async () => ({
          AreaWorker: {
            destroy: async () => ({
              ...DATA.areaWorker,
              updated_at: new Date('2019-10-10'),
              deleted_at: new Date('2019-10-10')
            })
          }
        })
      })) as any;
      const area_id = DATA.areaWorker.area_id;
      const worker_id = DATA.areaWorker.worker_id;
      const options = {};

      // Act:
      const res = await repository.deleteWorker(area_id, worker_id, options);

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
      // Arrange:
      database.models.Area.findByPk = (async () => ({
        getServices: async () => { throw ACTION_ERROR; }
      })) as any;
      const area_id = DATA.area.id;
      const options = {};

      // Act:
      const res = repository.getServices(area_id, options);

      // Assert:
      return res.catch((e:Error) => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return a list of associations', async () => {
      // Arrange:
      database.models.Area.findByPk = (async () => ({
        getServices: async () => [ DATA.service ]
      })) as any;
      const area_id = DATA.area.id;
      const options = {};

      // Act:
      const res = await repository.getServices(area_id, options);

      // Assert:
      expect(res).toEqual([ DATA.service ]);
    });
    it('should return a list empty when records are not found', async () => {
      // Arrange:
      database.models.Area.findByPk = (async () => ({
        getServices: async () => []
      })) as any;
      const area_id = DATA.area.id;
      const options = {};

      // Act:
      const res = await repository.getServices(area_id, options);

      // Assert:
      expect(res).toBeArray().toBeEmpty();
    });
  });

  describe('getService', () => {
    it('should return null when service was not found', async () => {
      // Arrange:
      database.models.Area.findByPk = (async () => ({
        getServices: async () => null
      })) as any;
      const area_id = DATA.area.id;
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = await repository.getService(area_id, service_id, options);

      // Assert:
      expect(res).toBe(null);
    });
    it('should throw error when return null and assert is true', () => {
      // Arrange:
      database.models.Area.findByPk = (async () => ({
        getServices: async () => null
      })) as any;
      const area_id = DATA.area.id;
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = repository.getService(area_id, service_id, options, true);

      // Assert:
      res.catch((e:Error) => expect(e.message).toEqual('Not found'));
    });
    it('should throw error when action fail', () => {
      // Arrange:
      database.models.Area.findByPk = (async () => ({
        getServices: async () => { throw ACTION_ERROR; }
      })) as any;
      const area_id = DATA.area.id;
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = repository.getService(area_id, service_id, options, true);

      // Assert:
      return res.catch((e:Error) => expect(e.message).toEqual(ACTION_ERROR.message));
    });
    it('should return association when is found', async () => {
      // Arrange:
      const expected = { ...DATA.service };
      database.models.Area.findByPk = (async () => ({
        getServices: async () => (expected)
      })) as any;
      const area_id = DATA.area.id;
      const service_id = DATA.service.id;
      const options = {};

      // Act:
      const res = await repository.getService(area_id, service_id, options, true);

      // Assert:
      expect(res).toEqual(expected)
    });
  });
});
