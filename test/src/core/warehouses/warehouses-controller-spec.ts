import '../../../config/global';
import db from '../../../../src/providers/postgres';
import * as DATA from '../../../config/models';
import Helpers from '../../../config/helpers';

describe('Warehouses - Controller', () => {
  const API_BASE = '/v1';
  const helpers = Helpers(db);

  beforeEach(helpers.destroyData);
  afterEach(helpers.restoreMocks);
  afterAll(helpers.closeConnections);

  describe('Retrieving Warehouses', () => {
    it('GET /warehouses --> Successfully', async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/warehouses/warehouses-service', () => ({
          WarehouseService: () => ({
            getWarehouses: async (options?:object) => [ DATA.warehouse ]
          })
        }));
      } else {
        await db.models.Warehouse.create(DATA.warehouse);
      }

      // Arrange:
      let permissions = [ 'get warehouses' ];
      let query = {};
      let payload = { permissions, query };

      // Act:
      let res = await helpers.request.get(`${API_BASE}/warehouses`, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeArray().not.toBeEmpty();
      expect(res.body.data[0]).toBeObject().not.toBeEmpty();
    });
  });

  describe('Creating Warehouse', () => {
    it(`POST /warehouses --> There is an warehouse with the same name`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/warehouses/warehouses-service', () => ({
          WarehouseService: () => ({
            createWarehouse: helpers.serviceUniqueError
          })
        }));
      } else {
        await db.models.Warehouse.create(DATA.warehouse);
      }

      // Arrange:
      let permissions = [ 'create warehouse' ];
      let data = DATA.warehouse;
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.post(`${API_BASE}/warehouses`, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 400 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Validation');
    });
    it(`POST /warehouses --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/warehouses/warehouses-service', () => ({
          WarehouseService: () => ({
            createWarehouse: async (values:object) => values
          })
        }));
      }

      // Arrange:
      let permissions = [ 'create warehouse' ];
      let data = { ...DATA.warehouse };
      delete data.id;
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.post(`${API_BASE}/warehouses`, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 201 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
    });
  });

  describe('Retrieving Warehouse', () => {
    it(`GET /warehouses/:warehouse --> Not found`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/warehouses/warehouses-service', () => ({
          WarehouseService: () => ({
            getWarehouse: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/warehouses/${DATA.warehouse.id}`;
      let permissions = [ 'get warehouse' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /warehouses/:warehouse --> Successfully`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/warehouses/warehouses-service', () => ({
          WarehouseService: () => ({
            getWarehouse: async (warehouse_id:string, options?:object) => DATA.warehouse
          })
        }));
      } else {
        await db.models.Warehouse.create(DATA.warehouse);
      }

      // Arrange:
      let endpoint = `${API_BASE}/warehouses/${DATA.warehouse.id}`;
      let permissions = [ 'get warehouse' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.id).toEqual(DATA.warehouse.id);
    });
  });

  describe('Updating Warehouse', () => {
    it(`PATCH /warehouses/:warehouse --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/warehouses/warehouses-service', () => ({
          WarehouseService: () => ({
            updateWarehouse: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/warehouses/${DATA.warehouse.id}`;
      let permissions = [ 'update warehouse' ];
      let data = { extra: { enabled: true } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`PATCH /warehouses/:warehouse --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/warehouses/warehouses-service', () => ({
          WarehouseService: () => ({
            updateWarehouse: async (warehouse_id:string, values:object, options?:object) => values
          })
        }));
      } else {
        await db.models.Warehouse.create(DATA.warehouse);
      }

      // Arrange:
      let endpoint = `${API_BASE}/warehouses/${DATA.warehouse.id}`;
      let permissions = [ 'update warehouse' ];
      let data = { extra: { enabled: true } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data.extra).toEqual({ enabled: true });
    });
  });

  describe('Deleting Warehouse', () => {
    it(`DELETE /warehouses/:warehouse --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/warehouses/warehouses-service', () => ({
          WarehouseService: () => ({
            deleteWarehouse: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let endpoint = `${API_BASE}/warehouses/${DATA.warehouse.id}`;
      let permissions = [ 'delete warehouse' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`DELETE /warehouses/:warehouse --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/warehouses/warehouses-service', () => ({
          WarehouseService: () => ({
            deleteWarehouse: async (warehouse_id:string, options?:object) => ({
              id: warehouse_id,
              updated_at: new Date('2019-10-10'),
              deleted_at: new Date('2019-10-10')
            })
          })
        }));
      } else {
        await db.models.Warehouse.create(DATA.warehouse);
      }

      // Arrange:
      let endpoint = `${API_BASE}/warehouses/${DATA.warehouse.id}`;
      let permissions = [ 'delete warehouse' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data.id).toEqual(DATA.warehouse.id);
      expect(res.body.data.deleted_at).not.toBe(null);
    });
  });

  describe('Retrieving Materials', () => {
    it(`GET /warehouses/:warehouse/materials --> Failed - exception`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/warehouses/warehouses-service', () => ({
          WarehouseService: () => ({
            getMaterials: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let warehouse_id = DATA.warehouse.id;
      let endpoint = `${API_BASE}/warehouses/${warehouse_id}/materials`;
      let permissions = [ 'get materials from warehouse' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /warehouses/:warehouse/materials --> Successfully`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/warehouses/warehouses-service', () => ({
          WarehouseService: () => ({
            getMaterials: async (warehouse_id:string, options?:object) => [{
              ...DATA.material,
              WarehouseMaterial: DATA.warehouse
            }]
          })
        }));
      } else {
        let category = await db.models.Category.create(DATA.category);
        let warehouse = await db.models.Warehouse.create(DATA.warehouse);
        let material = await db.models.Material.create(DATA.material);
        await warehouse.addMaterial(material);
      }

      // Arrange:
      let endpoint = `${API_BASE}/warehouses/${DATA.warehouse.id}/materials`;
      let permissions = [ 'get materials from warehouse' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeArray().not.toBeEmpty();
    });
  });

  describe('Adding materials', () => {
    it(`PUT /warehouses/:warehouse/materials --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/warehouses/warehouses-service', () => ({
          WarehouseService: () => ({
            addMaterials: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let warehouse_id = DATA.warehouse.id;
      let material_id = DATA.material.id;
      let endpoint = `${API_BASE}/warehouses/${warehouse_id}/materials`;
      let permissions = [ 'add materials to warehouse' ];
      let data = { materials: [ material_id ] };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.put(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`PUT /warehouses/:warehouse/materials --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/warehouses/warehouses-service', () => ({
          WarehouseService: () => ({
            addMaterials: async (warehouse_id:string, materials:string[]) => [
              DATA.warehouseMaterial
            ]
          })
        }));
      } else {
        await db.models.Category.create(DATA.category);
        await db.models.Material.create(DATA.material);
        await db.models.Warehouse.create(DATA.warehouse);
      }

      // Arrange:
      let endpoint = `${API_BASE}/warehouses/${DATA.warehouse.id}/materials`;
      let permissions = [ 'add materials to warehouse' ];
      let data = { materials: [ DATA.material.id ] };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.put(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 201 });
      expect(res.body.data).toBeArray().not.toBeEmpty();
      expect(res.body.data[0].warehouse_id).toEqual(DATA.warehouse.id);
      expect(res.body.data[0].material_id).toEqual(DATA.material.id);
    });
  });

  describe('Retrieve material', () => {
    it(`GET /warehouses/:warehouse/materials/:material --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/warehouses/warehouses-service', () => ({
          WarehouseService: () => ({
            getMaterial: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let warehouse_id = DATA.warehouse.id;
      let material_id = DATA.material.id;
      let endpoint = `${API_BASE}/warehouses/${warehouse_id}/materials/${material_id}`;
      let permissions = [ 'get material from warehouse' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`GET /warehouses/:warehouse/materials/:material --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/warehouses/warehouses-service', () => ({
          WarehouseService: () => ({
            getMaterial: async (warehouse_id:string, material_id:string, options?:object) => ({
              ...DATA.material,
              WarehouseMaterial: DATA.warehouseMaterial
            })
          })
        }));
      } else {
        let category = await db.models.Category.create(DATA.category);
        let material = await db.models.Material.create(DATA.material);
        let warehouse = await db.models.Warehouse.create(DATA.warehouse);
        await warehouse.addMaterial(material);
      }

      // Arrange:
      let warehouse_id = DATA.warehouse.id;
      let material_id = DATA.material.id;
      let endpoint = `${API_BASE}/warehouses/${warehouse_id}/materials/${material_id}`;
      let permissions = [ 'get material from warehouse' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.get(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.id).toEqual(material_id);
    });
  });

  describe('Updating material', () => {
    it(`PATCH /warehouses/:warehouse/materials/:material --> Failed - exception`, async () => {
      // Setup:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/warehouses/warehouses-service', () => ({
          WarehouseService: () => ({
            updateMaterial: helpers.serviceNotFoundError
          })
        }));
      }

      // Arrange:
      let warehouse_id = DATA.warehouse.id;
      let material_id = DATA.material.id;
      let endpoint = `${API_BASE}/warehouses/${warehouse_id}/materials/${material_id}`;
      let permissions = [ 'update material from warehouse' ];
      let data = { extra: { enabled: true } };
      let payload = { permissions, data };

      // Act:
      let res = await helpers.request.patch(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`PATCH /warehouses/:warehouse/materials/:material --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/warehouses/warehouses-service', () => ({
          WarehouseService: () => ({
            updateMaterial: async (warehouse_id:string, material_id:string, values:object, options?:object) => ({
              warehouse_id: warehouse_id,
              material_id: material_id,
              ...values
            })
          })
        }));
      } else {
        let category = await db.models.Category.create(DATA.category);
        let material = await db.models.Material.create(DATA.material);
        let warehouse = await db.models.Warehouse.create(DATA.warehouse);
        await warehouse.addMaterial(material);
      }

      // Arrange:
      let warehouse_id = DATA.warehouse.id;
      let material_id = DATA.material.id;
      let endpoint = `${API_BASE}/warehouses/${warehouse_id}/materials/${material_id}`;
      let permissions = [ 'update material from warehouse' ];
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

  describe('Deleting material', () => {
    it(`DELETE /warehouses/:warehouse/materials/:material --> Failed - exception`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/warehouses/warehouses-service', () => ({
          WarehouseService: () => ({
            deleteMaterial: helpers.serviceNotFoundError
          })
        }));
      } else {
        let category = await db.models.Category.create(DATA.category);
        let material = await db.models.Material.create(DATA.material);
        let warehouse = await db.models.Warehouse.create(DATA.warehouse);
      }

      // Arrange:
      let warehouse_id = DATA.warehouse.id;
      let material_id = DATA.material.id;
      let endpoint = `${API_BASE}/warehouses/${warehouse_id}/materials/${material_id}`;
      let permissions = [ 'delete material from warehouse' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertFail({ response: res, status: 404 });
      expect(res.body.error).toBeObject().not.toBeEmpty();
      expect(res.body.error.message).toContain('Not found');
    });
    it(`DELETE /warehouses/:warehouse/materials/:material --> Successfully`, async () => {
      // Mock:
      if (process.env.MOCK === 'true') {
        jest.doMock('src/core/warehouses/warehouses-service', () => ({
          WarehouseService: () => ({
            deleteMaterial: async (warehouse_id:string, material_id:string, options?:object) => ({
              warehouse_id: warehouse_id,
              material_id: material_id,
              deleted_at: new Date()
            })
          })
        }));
      } else {
        let category = await db.models.Category.create(DATA.category);
        let material = await db.models.Material.create(DATA.material);
        let warehouse = await db.models.Warehouse.create(DATA.warehouse);
        await warehouse.addMaterial(material);
      }

      // Arrange:
      let warehouse_id = DATA.warehouse.id;
      let material_id = DATA.material.id;
      let endpoint = `${API_BASE}/warehouses/${warehouse_id}/materials/${material_id}`;
      let permissions = [ 'delete material from warehouse' ];
      let payload = { permissions };

      // Act:
      let res = await helpers.request.delete(endpoint, payload);

      // Assert:
      helpers.assertPass({ response: res, status: 200 });
      expect(res.body.data).toBeObject().not.toBeEmpty();
      expect(res.body.data.warehouse_id).toEqual(warehouse_id);
      expect(res.body.data.material_id).toEqual(material_id);
      expect(res.body.data.deleted_at).not.toBe(null);
    });
  });
});
