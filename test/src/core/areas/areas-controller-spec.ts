import '../../../config/global';
import db from '../../../../src/providers/postgres';
import * as DATA from '../../../config/models';
import Helpers from '../../../config/helpers';

describe('Areas - Controller', () => {
  const API_BASE = '/v1';
  const helpers = Helpers(db);

  beforeEach(helpers.destroyData);
  afterEach(helpers.restoreMocks);
  afterAll(helpers.closeConnections);

  describe('Retrieving Areas', () => {
    it('GET /areas --> Successfully', async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('../../../../src/core/areas/areas-service', () => ({
          AreaService: () => ({
            getAreas: async (options?:object) => [ DATA.area ]
          })
        }));
      } else {
        await db.models.Area.create(DATA.area);
      }

      // Arrange:
      let permissions = [ 'get areas' ];
      let query = {};
      let payload = { permissions, query };

      // Act:
      let res = await helpers.request.get(`${API_BASE}/areas`, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeArray().not.toBeEmpty();
      expect(res.body.data[0]).toBeObject().not.toBeEmpty();
    });
  });

  describe('Creating Area', () => {
    it(`POST /areas --> There is an area with the same name`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/areas/areas-service', () => ({
          AreaService: () => ({
            createArea: helpers.serviceUniqueError
          })
        }));
      } else {
        await db.models.Area.create(DATA.area);
      }

      // Arrange:
      let permissions = [ 'create area' ];
      let data = DATA.area;
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.post(`${API_BASE}/areas`, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`POST /areas --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/areas/areas-service', () => ({
          AreaService: () => ({
            createArea: async (values:object, options?:object) => values
          })
        }));
      }

      // Arrange:
      let permissions = [ 'create area' ];
      let data = DATA.area;
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.post(`${API_BASE}/areas`, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 201 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
    });
  });

  describe('Retrieving Area', () => {
    it(`GET /areas/:area --> Not found`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/areas/areas-service', () => ({
          AreaService: () =>  ({
            getArea: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/areas/${DATA.area.id}`;
      let permissions = [ 'get area' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /areas/:area --> Successfully`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/areas/areas-service', () => ({
          AreaService: () => ({
            getArea: async (area_id:string, options?:object) => DATA.area
          })
        }));
      } else {
        await db.models.Area.create(DATA.area);
      }

      // Arrange:
      let endpoint = `${API_BASE}/areas/${DATA.area.id}`;
      let permissions = [ 'get area' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.id).toEqual(DATA.area.id);
    });
  });

  describe('Updating Area', () => {
    it(`PATCH /areas/:area --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/areas/areas-service', () => ({
          AreaService: () => ({
            updateArea: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/areas/${DATA.area.id}`;
      let permissions = [ 'update area' ];
      let data = { extra: { enabled: true } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`PATCH /areas/:area --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/areas/areas-service', () => ({
          AreaService: () => ({
            updateArea: async (area_id:string, values:object, options?:object) => {
              return values;
            }
          })
        }));
      } else {
        await db.models.Area.create(DATA.area);
      }

      // Arrange:
      let endpoint = `${API_BASE}/areas/${DATA.area.id}`;
      let permissions = [ 'update area' ];
      let data = { extra: { enabled: true } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data.extra).toEqual({ enabled: true });
    });
  });

  describe('Deleting Area', () => {
    it(`DELETE /areas/:area --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/areas/areas-service', () => ({
          AreaService: () => ({
            deleteArea: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/areas/${DATA.area.id}`;
      let permissions = [ 'delete area' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`DELETE /areas/:area --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/areas/areas-service', () => ({
          AreaService: () => ({
            deleteArea: async (area_id:string, options?:object) => ({
              id: area_id,
              updated_at: new Date('2019-10-10'),
              deleted_at: new Date('2019-10-10')
            })
          })
        }));
      } else {
        await db.models.Area.create(DATA.area);
      }

      // Arrange:
      let endpoint = `${API_BASE}/areas/${DATA.area.id}`;
      let permissions = [ 'delete area' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data.id).toEqual(DATA.area.id);
      expect(res.body.data.deleted_at).not.toBe(null);
    });
  });

  describe('Retrieving Subareas', () => {
    it(`GET /areas/:area/subareas --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/areas/areas-service', () => ({
          AreaService: () => ({
            getSubareas: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/areas/${DATA.area.id}/subareas`;
      let permissions = [ 'get subareas from area' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /areas/:area/subareas --> Successfully`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/areas/areas-service', () => ({
          AreaService: () => ({
            getSubareas: async (area_id, options) => [{
              ...DATA.subarea,
              AreaSubarea: DATA.area
            }]
          })
        }));
      } else {
        let area = await db.models.Area.create(DATA.area);
        let subarea = await db.models.Area.create(DATA.subarea);
        await area.addSubarea(subarea);
      }

      // Arrange:
      let endpoint = `${API_BASE}/areas/${DATA.area.id}/subareas`;
      let permissions = [ 'get subareas from area' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeArray().not.toBeEmpty();
    });
  });

  describe('Adding subareas', () => {
    it(`PUT /areas/:area/subareas --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/areas/areas-service', () => ({
          AreaService: () => ({
            addSubareas: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/areas/${DATA.area.id}/subareas`;
      let permissions = [ 'add subareas to area' ];
      let data = { subareas: [ DATA.subarea.id ] };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.put(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`PUT /areas/:area/subareas --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/areas/areas-service', () => ({
          AreaService: () => ({
            addSubareas: async ({ area_id, subareas }) => [
              DATA.areaSubarea
            ]
          })
        }));
      } else {
        await db.models.Area.create(DATA.area);
        await db.models.Area.create(DATA.subarea);
      }

      // Arrange:
      let endpoint = `${API_BASE}/areas/${DATA.area.id}/subareas`;
      let permissions = [ 'add subareas to area' ];
      let data = { subareas: [ DATA.subarea.id ] };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.put(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 201 });
      expect(res.body.data).toBeArray().not.toBeEmpty();
      expect(res.body.data[0].area_id).toEqual(DATA.area.id);
      expect(res.body.data[0].subarea_id).toEqual(DATA.subarea.id);
    });
  });

  describe('Retrieve subarea', () => {
    it(`GET /areas/:area/subareas/:subarea --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/areas/areas-service', () => ({
          AreaService: () => ({
            getSubarea: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let area_id = DATA.area.id;
      let subarea_id = DATA.subarea.id;
      let endpoint = `${API_BASE}/areas/${area_id}/subareas/${subarea_id}`;
      let permissions = [ 'get subarea from area' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /areas/:area/subareas/:subarea --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/areas/areas-service', () => ({
          AreaService: () => ({
            getSubarea: async ({ area_id, subarea_id, options }) => ({
              ...DATA.subarea,
              AreaSubarea: DATA.areaSubarea
            })
          })
        }));
      } else {
        let area = await db.models.Area.create(DATA.area);
        let subarea = await db.models.Area.create(DATA.subarea);
        await area.addSubarea(subarea);
      }

      // Arrange:
      let area_id = DATA.area.id;
      let subarea_id = DATA.subarea.id;
      let endpoint = `${API_BASE}/areas/${area_id}/subareas/${subarea_id}`;
      let permissions = [ 'get subarea from area' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.id).toEqual(subarea_id);
    });
  });

  describe('Updating subarea', () => {
    it(`PATCH /areas/:area/subareas/:subarea --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/areas/areas-service', () => ({
          AreaService: () => ({
            updateSubarea: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let area_id = DATA.area.id;
      let subarea_id = DATA.subarea.id;
      let endpoint = `${API_BASE}/areas/${area_id}/subareas/${subarea_id}`;
      let permissions = [ 'update subarea from area' ];
      let data = { extra: { enabled: true } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`PATCH /areas/:area/subareas/:subarea --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/areas/areas-service', () => ({
          AreaService: () => ({
            updateSubarea: async (area_id, subarea_id, values, options) => ({
              area_id: area_id,
              subarea_id: subarea_id,
              ...values
            })
          })
        }));
      } else {
        let area = await db.models.Area.create(DATA.area);
        let subarea = await db.models.Area.create(DATA.subarea);
        await area.addSubarea(subarea);
      }

      // Arrange:
      let area_id = DATA.area.id;
      let subarea_id = DATA.subarea.id;
      let endpoint = `${API_BASE}/areas/${area_id}/subareas/${subarea_id}`;
      let permissions = [ 'update subarea from area' ];
      let data = { extra: { enabled: true } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.extra).toEqual({ enabled: true });
    });
  });

  describe('Deleting subarea', () => {
    it(`DELETE /areas/:area/subareas/:subarea --> Failed - exception`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/areas/areas-service', () => ({
          AreaService: () => ({
            deleteSubarea: helpers.serviceNotFoundError
          })
        }));
      } else {
        await db.models.Area.create(DATA.area);
      }

      // Arrange:
      let area_id = DATA.area.id;
      let subarea_id = DATA.subarea.id;
      let endpoint = `${API_BASE}/areas/${area_id}/subareas/${subarea_id}`;
      let permissions = [ 'delete subarea from area' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`DELETE /areas/:area/subareas/:subarea --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/areas/areas-service', () => ({
          AreaService: () => ({
            deleteSubarea: async (area_id, subarea_id, options) => ({
              area_id: area_id,
              subarea_id: subarea_id,
              deleted_at: new Date()
            })
          })
        }));
      } else {
        let area = await db.models.Area.create(DATA.area);
        let subarea = await db.models.Area.create(DATA.subarea);
        await area.addSubarea(subarea);
      }

      // Arrange:
      let area_id = DATA.area.id;
      let subarea_id = DATA.subarea.id;
      let endpoint = `${API_BASE}/areas/${area_id}/subareas/${subarea_id}`;
      let permissions = [ 'delete subarea from area' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.area_id).toEqual(area_id);
      expect(res.body.data.subarea_id).toEqual(subarea_id);
      expect(res.body.data.deleted_at).not.toBe(null);
    });
  });

  describe('Retrieving Workers', () => {
    it(`GET /areas/:area/workers --> Failed - exception`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/areas/areas-service', () => ({
          AreaService: () => ({
            getWorkers: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let area_id = DATA.area.id;
      let endpoint = `${API_BASE}/areas/${area_id}/workers`;
      let permissions = [ 'get workers from area' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /areas/:area/workers --> Successfully`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/areas/areas-service', () => ({
          AreaService: () => ({
            getWorkers: async (area_id, options) => [{
              ...DATA.worker,
              AreaWorker: DATA.area
            }]
          })
        }));
      } else {
        let area = await db.models.Area.create(DATA.area);
        let worker = await db.models.Worker.create(DATA.worker);
        await area.addWorker(worker);
      }

      // Arrange:
      let endpoint = `${API_BASE}/areas/${DATA.area.id}/workers`;
      let permissions = [ 'get workers from area' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeArray().not.toBeEmpty();
    });
  });

  describe('Adding workers', () => {
    it(`PUT /areas/:area/workers --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/areas/areas-service', () => ({
          AreaService: () => ({
            addWorkers: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let area_id = DATA.area.id;
      let worker_id = DATA.worker.id;
      let endpoint = `${API_BASE}/areas/${area_id}/workers`;
      let permissions = [ 'add workers to area' ];
      let data = { workers: [ worker_id ] };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.put(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`PUT /areas/:area/workers --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/areas/areas-service', () => ({
          AreaService: () => ({
            addWorkers: async (area_id, workers) => [ DATA.areaWorker ]
          })
        }));
      } else {
        await db.models.Area.create(DATA.area);
        await db.models.Worker.create(DATA.worker);
      }

      // Arrange:
      let endpoint = `${API_BASE}/areas/${DATA.area.id}/workers`;
      let permissions = [ 'add workers to area' ];
      let data = { workers: [ DATA.worker.id ] };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.put(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 201 });
      expect(res.body.data).toBeArray().not.toBeEmpty();
      expect(res.body.data[0].area_id).toEqual(DATA.area.id);
      expect(res.body.data[0].worker_id).toEqual(DATA.worker.id);
    });
  });

  describe('Retrieve worker', () => {
    it(`GET /areas/:area/workers/:worker --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/areas/areas-service', () => ({
          AreaService: () => ({
            getWorker: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let area_id = DATA.area.id;
      let worker_id = DATA.worker.id;
      let endpoint = `${API_BASE}/areas/${area_id}/workers/${worker_id}`;
      let permissions = [ 'get worker from area' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /areas/:area/workers/:worker --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/areas/areas-service', () => ({
          AreaService: () => ({
            getWorker: async (area_id, worker_id, options) => ({
              ...DATA.worker,
              AreaWorker: DATA.areaWorker
            })
          })
        }));
      } else {
        let area = await db.models.Area.create(DATA.area);
        let worker = await db.models.Worker.create(DATA.worker);
        await area.addWorker(worker);
      }

      // Arrange:
      let area_id = DATA.area.id;
      let worker_id = DATA.worker.id;
      let endpoint = `${API_BASE}/areas/${area_id}/workers/${worker_id}`;
      let permissions = [ 'get worker from area' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.id).toEqual(worker_id);
    });
  });

  describe('Updating worker', () => {
    it(`PATCH /areas/:area/workers/:worker --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/areas/areas-service', () => ({
          AreaService: () => ({
            updateWorker: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let area_id = DATA.area.id;
      let worker_id = DATA.worker.id;
      let endpoint = `${API_BASE}/areas/${area_id}/workers/${worker_id}`;
      let permissions = [ 'update worker from area' ];
      let data = { extra: { enabled: true } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`PATCH /areas/:area/workers/:worker --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/areas/areas-service', () => ({
          AreaService: () => ({
            updateWorker: async (area_id, worker_id, values, options) => ({
              area_id: area_id,
              worker_id: worker_id,
              ...values
            })
          })
        }));
      } else {
        let area = await db.models.Area.create(DATA.area);
        let worker = await db.models.Worker.create(DATA.worker);
        await area.addWorker(worker);
      }

      // Arrange:
      let area_id = DATA.area.id;
      let worker_id = DATA.worker.id;
      let endpoint = `${API_BASE}/areas/${area_id}/workers/${worker_id}`;
      let permissions = [ 'update worker from area' ];
      let data = { extra: { enabled: true } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.extra).toEqual({ enabled: true });
    });
  });

  describe('Deleting worker', () => {
    it(`DELETE /areas/:area/workers/:worker --> Failed - exception`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/areas/areas-service', () => ({
          AreaService: () => ({
            deleteWorker: helpers.serviceNotFoundError
          })
        }));
      } else {
        await db.models.Area.create(DATA.area);
      }

      // Arrange:
      let area_id = DATA.area.id;
      let worker_id = DATA.worker.id;
      let endpoint = `${API_BASE}/areas/${area_id}/workers/${worker_id}`;
      let permissions = [ 'delete worker from area' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`DELETE /areas/:area/workers/:worker --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/areas/areas-service', () => ({
          AreaService: () => ({
            deleteWorker: async (area_id, worker_id, options) => ({
              area_id: area_id,
              worker_id: worker_id,
              deleted_at: new Date()
            })
          })
        }));
      } else {
        let area = await db.models.Area.create(DATA.area);
        let worker = await db.models.Worker.create(DATA.worker);
        await area.addWorker(worker);
      }

      // Arrange:
      let area_id = DATA.area.id;
      let worker_id = DATA.worker.id;
      let endpoint = `${API_BASE}/areas/${area_id}/workers/${worker_id}`;
      let permissions = [ 'delete worker from area' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.area_id).toEqual(area_id);
      expect(res.body.data.worker_id).toEqual(worker_id);
      expect(res.body.data.deleted_at).not.toBe(null);
    });
  });

  describe('Retrieving Services', () => {
    it(`GET /areas/:area/services --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/areas/areas-service', () => ({
          AreaService: () => ({
            getServices: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let area_id = DATA.area.id;
      let endpoint = `${API_BASE}/areas/${area_id}/services`;
      let permissions = [ 'get services from area' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /areas/:area/services --> Successfully`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/areas/areas-service', () => ({
          AreaService: () => ({
            getServices: async (area_id, options) => [ DATA.service ]
          })
        }));
      } else {
        let area = await db.models.Area.create(DATA.area);
        let service = await db.models.Service.create(DATA.service);
        await area.addService(service);
      }

      // Arrange:
      let endpoint = `${API_BASE}/areas/${DATA.area.id}/services`;
      let permissions = [ 'get services from area' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeArray().not.toBeEmpty();
    });
  });

  describe('Retrieve service', () => {
    it(`GET /areas/:area/services/:service --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/areas/areas-service', () => ({
          AreaService: () => ({
            getService: helpers.serviceNotFoundError
          })
        }));
      } else {
        await db.models.Area.create(DATA.area);
      }

      // Arrange:
      let area_id = DATA.area.id;
      let service_id = DATA.service.id;
      let endpoint = `${API_BASE}/areas/${area_id}/services/${service_id}`;
      let permissions = [ 'get service from area' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /areas/:area/services/:service --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/areas/areas-service', () => ({
          AreaService: () => ({
            getService: async (area_id, service_id, options) => DATA.service
          })
        }));
      } else {
        let area = await db.models.Area.create(DATA.area);
        let service = await db.models.Service.create(DATA.service);
        await area.addService(service);
      }

      // Arrange:
      let area_id = DATA.area.id;
      let service_id = DATA.service.id;
      let endpoint = `${API_BASE}/areas/${area_id}/services/${service_id}`;
      let permissions = [ 'get service from area' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.id).toEqual(service_id);
    });
  });
});
